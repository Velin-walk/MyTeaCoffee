(function () {
  'use strict';

  const EVEREST_GEOJSON_URL = '/assets/aistudio/Everest_f80aa1b8.json';
  const THEME_STORAGE_KEY = 'selectedTheme';
  const SCOPE_STORAGE_KEY = 'mountainClimbScope';
  const TARGET_HOURS_STORAGE_KEY = 'mountainSummitTargetHours';

  let loadedModel = null;
  let activeCampIdx = 7;
  let climbScope = 'all';
  let summitTargetHours = 50;
  let latestStats = { totalMinutes: 0, isLiveTimerActive: false, liveSessionElapsedSecs: 0 };
  let liveTickTimer = null;
  let idbSyncInFlight = false;
  let cachedIdbDaily = null;
  let cachedIdbWatch = null;

  function readStorage(key, fallback) {
    if (typeof safeStorageGet === 'function') return safeStorageGet(key, fallback);
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    if (typeof safeStorageSet === 'function') {
      safeStorageSet(key, value);
      return;
    }
    try {
      localStorage.setItem(key, String(value));
    } catch (e) {}
  }

  function loadMountainTheme() {
    const saved = readStorage(THEME_STORAGE_KEY, 'default') || 'default';
    applyMountainTheme(saved);
    const sel = document.getElementById('mountainThemeSelect');
    if (sel) sel.value = saved;
  }

  function applyMountainTheme(theme) {
    const wasFs = document.body.classList.contains('is-fullscreen');
    document.body.className = wasFs ? 'is-fullscreen' : '';
    if (theme && theme !== 'default') {
      document.body.classList.add(theme);
    }
  }

  function changeMountainTheme(theme) {
    applyMountainTheme(theme);
    writeStorage(THEME_STORAGE_KEY, theme);
  }

  function toggleMountainFullscreen() {
    const isFs = document.body.classList.toggle('is-fullscreen');
    const btn = document.getElementById('btnMountainFullscreen');
    if (btn) {
      btn.setAttribute('aria-pressed', isFs ? 'true' : 'false');
    }
    if (isFs) {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => null);
      }
    } else if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => null);
    }
  }

  function formatDateKey(dt) {
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  }

  function parseLocalDateKey(dateKey) {
    const parts = String(dateKey || '').split('-');
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    return new Date(y, m, d);
  }

  function formatDurationHM(totalMinutes) {
    const mins = Math.max(0, Math.round(totalMinutes || 0));
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  function formatLiveTimerClock(totalSecs) {
    const secs = Math.max(0, Math.floor(totalSecs || 0));
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function readJsonLocalStorage(key, fallback) {
    try {
      const raw = readStorage(key, null);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function readStudyDashboardDB() {
    return new Promise((resolve) => {
      if (typeof indexedDB === 'undefined') {
        resolve({ dailyData: null, watchData: null });
        return;
      }
      try {
        const req = indexedDB.open('StudyDashboardDB', 1);
        req.onupgradeneeded = (event) => {
          const database = event.target.result;
          ['dailyData', 'weeklyData', 'monthlyData', 'watchData', 'plannerData'].forEach((name) => {
            if (!database.objectStoreNames.contains(name)) {
              database.createObjectStore(name, { keyPath: 'id' });
            }
          });
        };
        req.onerror = () => resolve({ dailyData: null, watchData: null });
        req.onsuccess = () => {
          const database = req.result;
          const result = { dailyData: null, watchData: null };
          const stores = ['dailyData', 'watchData'].filter((s) => database.objectStoreNames.contains(s));
          if (!stores.length) {
            try { database.close(); } catch (e) {}
            resolve(result);
            return;
          }
          try {
            const tx = database.transaction(stores, 'readonly');
            if (stores.includes('dailyData')) {
              const r1 = tx.objectStore('dailyData').get(1);
              r1.onsuccess = () => { result.dailyData = r1.result ? r1.result.data : null; };
            }
            if (stores.includes('watchData')) {
              const r2 = tx.objectStore('watchData').get(1);
              r2.onsuccess = () => { result.watchData = r2.result ? r2.result.data : null; };
            }
            tx.oncomplete = () => {
              try { database.close(); } catch (e) {}
              resolve(result);
            };
            tx.onerror = () => {
              try { database.close(); } catch (e) {}
              resolve(result);
            };
          } catch (err) {
            try { database.close(); } catch (e) {}
            resolve(result);
          }
        };
      } catch (e) {
        resolve({ dailyData: null, watchData: null });
      }
    });
  }

  function computeStudyFocusStatsSync(scope, dailyData, watchData) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = startOfToday - (now.getDay() * 86400000);
    const todayKey = formatDateKey(now);

    const isDateKeyInScope = (dk) => {
      if (scope === 'all') return true;
      const dt = parseLocalDateKey(dk);
      if (!dt) return false;
      const ts = dt.getTime();
      if (scope === 'today') return dk === todayKey;
      if (scope === 'week') return ts >= startOfWeek;
      return true;
    };

    const minutesByDate = new Map();

    // 1. Primary store: nepalForestHistory (completed focus + synced chart sessions)
    const history = readJsonLocalStorage('nepalForestHistory', []);
    if (Array.isArray(history)) {
      history.forEach((item) => {
        if (!item || typeof item.minutes !== 'number' || !Number.isFinite(item.minutes) || item.minutes <= 0) return;
        const ts = (typeof item.timestamp === 'number' && item.timestamp > 0) ? item.timestamp : Date.now();
        const dk = formatDateKey(new Date(ts));
        minutesByDate.set(dk, (minutesByDate.get(dk) || 0) + item.minutes);
      });
    }

    // 2. Fallback / merge from Study Charts IndexedDB cache for days not yet in nepalForestHistory
    if (Array.isArray(dailyData) && dailyData.length > 1) {
      for (let i = 1; i < dailyData.length; i++) {
        const row = dailyData[i];
        if (!Array.isArray(row) || !row[0]) continue;
        const parsedDate = (typeof window.parseSessionDate === 'function')
          ? window.parseSessionDate(row[0])
          : new Date(row[0]);
        if (!parsedDate || isNaN(parsedDate.getTime())) continue;
        const dk = formatDateKey(parsedDate);
        if (dk === todayKey || minutesByDate.has(dk)) continue;
        let dayHrs = 0;
        for (let j = 1; j < row.length; j += 3) {
          if (typeof row[j] === 'number' && Number.isFinite(row[j]) && row[j] > 0) {
            dayHrs += row[j];
          }
        }
        if (dayHrs > 0) {
          minutesByDate.set(dk, Math.round(dayHrs * 60));
        }
      }
    }

    // 3. Merge today's 24h watchData (take max vs today's forest records so nothing is double-counted)
    if (Array.isArray(watchData) && watchData.length > 0) {
      const mergedWatch = (typeof window.mergeContinuousSessions === 'function')
        ? window.mergeContinuousSessions(watchData)
        : watchData;
      const watchHours = mergedWatch.reduce((sum, s) => {
        const hrs = (s && typeof s.hrs === 'number' && Number.isFinite(s.hrs) && s.hrs > 0) ? s.hrs : 0;
        return sum + hrs;
      }, 0);
      const watchTodayMins = Math.round(watchHours * 60);
      const existingTodayMins = minutesByDate.get(todayKey) || 0;
      if (watchTodayMins > existingTodayMins) {
        minutesByDate.set(todayKey, watchTodayMins);
      }
    }

    let totalMinutes = 0;
    minutesByDate.forEach((mins, dk) => {
      if (isDateKeyInScope(dk)) {
        totalMinutes += mins;
      }
    });

    // 4. Add uncommitted elapsed minutes from live active focus timer
    let isLiveTimerActive = false;
    let liveSessionElapsedSecs = 0;
    const active = readJsonLocalStorage('activeFocusSession', null);
    if (active && typeof active === 'object' && typeof active.startTime === 'number' && active.startTime > 0) {
      const elapsedSecs = Math.max(0, (Date.now() - active.startTime) / 1000);
      if (elapsedSecs < 12 * 3600) {
        isLiveTimerActive = true;
        liveSessionElapsedSecs = elapsedSecs;
        let uncommittedMins = 0;
        if (active.mode === 'fixed') {
          const durMins = (typeof active.durationMinutes === 'number' && active.durationMinutes > 0)
            ? active.durationMinutes
            : 25;
          uncommittedMins = Math.min(durMins, elapsedSecs / 60);
        } else {
          const plantedCycles = (typeof active.plantedCycles === 'number' && active.plantedCycles >= 0)
            ? active.plantedCycles
            : 0;
          uncommittedMins = Math.max(0, (elapsedSecs / 60) - plantedCycles * 25);
        }
        totalMinutes += uncommittedMins;
      }
    }

    return {
      totalMinutes,
      isLiveTimerActive,
      liveSessionElapsedSecs
    };
  }

  function getCampProgressMeta(model, totalHours, targetHours) {
    if (!model || !model.camps || !model.camps.length) {
      return { progress: 0, climberPt: null, milestones: [], reachedCount: 0, nextCamp: null, currentCamp: null };
    }
    const baseCamp = model.camps.find((c) => c.title === 'Base Camp') || model.camps[0];
    const startDistM = baseCamp ? baseCamp.distM : 0;
    const endDistM = model.totalDistM || 1;
    const spanDist = Math.max(1, endDistM - startDistM);

    const safeTarget = Math.max(0.5, Number(targetHours) || 50);
    const progress = Math.max(0, Math.min(1, totalHours / safeTarget));
    const climberPt = (typeof window.sampleEverestTrailAtProgress === 'function')
      ? window.sampleEverestTrailAtProgress(model, progress)
      : null;

    const milestones = model.camps.map((camp, idx) => {
      const campFrac = Math.max(0, Math.min(1, (camp.distM - startDistM) / spanDist));
      const requiredHours = campFrac * safeTarget;
      const reached = progress + 1e-6 >= campFrac;
      return {
        idx,
        camp,
        campFrac,
        requiredHours,
        reached,
        isNext: false
      };
    });

    let nextCamp = null;
    let currentCamp = milestones[0] || null;
    for (let i = 0; i < milestones.length; i++) {
      if (milestones[i].reached) {
        currentCamp = milestones[i];
      } else if (!nextCamp) {
        milestones[i].isNext = true;
        nextCamp = milestones[i];
      }
    }

    const reachedCount = milestones.filter((m) => m.reached).length;
    return { progress, climberPt, milestones, reachedCount, nextCamp, currentCamp };
  }

  function renderElevationProfile(model, selectedIdx, climberPt, milestoneList) {
    const host = document.getElementById('mountainElevationProfile');
    if (!host || !model || !model.trail.length) return;

    const W = 820;
    const H = 190;
    const padL = 52;
    const padR = 24;
    const padT = 22;
    const padB = 34;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const minEle = 5100;
    const maxEle = 9000;
    const totalD = model.totalDistM || 1;

    const xOf = (d) => padL + (d / totalD) * plotW;
    const yOf = (ele) => padT + plotH - ((ele - minEle) / (maxEle - minEle)) * plotH;

    const pathPts = model.trail.map((pt, i) => `${i === 0 ? 'M' : 'L'}${xOf(pt.distM).toFixed(1)},${yOf(pt.eleM).toFixed(1)}`).join(' ');
    const areaPts = `${pathPts} L${xOf(totalD).toFixed(1)},${(padT + plotH).toFixed(1)} L${padL},${(padT + plotH).toFixed(1)} Z`;

    const gridAlts = [5500, 6500, 7500, 8000, 8849];
    const gridMarkup = gridAlts.map((alt) => {
      const y = yOf(alt).toFixed(1);
      const isDeathZone = alt === 8000;
      return `
        <line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="${isDeathZone ? 'rgba(234,88,12,0.42)' : 'var(--border-color)'}" stroke-width="${isDeathZone ? '1.2' : '0.8'}" stroke-dasharray="${isDeathZone ? '4 4' : '2 3'}"/>
        <text x="${padL - 7}" y="${Number(y) + 3.5}" text-anchor="end" font-size="10" font-weight="600" fill="${isDeathZone ? '#ea580c' : 'var(--text-tertiary)'}">${alt}m</text>
      `;
    }).join('');

    const distTicks = [0, 3, 6, 9, 12, 14].filter((km) => km * 1000 <= totalD + 400);
    const distMarkup = distTicks.map((km) => {
      const x = xOf(Math.min(totalD, km * 1000)).toFixed(1);
      return `<text x="${x}" y="${H - 10}" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-tertiary)">${km} km</text>`;
    }).join('');

    // Highlight completed climb segment from trail start up to exact interpolated climber position
    let climbedPathPts = '';
    if (climberPt && typeof climberPt.fracIdx === 'number') {
      const wholeIdx = Math.floor(climberPt.fracIdx);
      const pts = model.trail.slice(0, wholeIdx + 1).map((pt, i) => `${i === 0 ? 'M' : 'L'}${xOf(pt.distM).toFixed(1)},${yOf(pt.eleM).toFixed(1)}`);
      pts.push(`L${xOf(climberPt.distM).toFixed(1)},${yOf(climberPt.eleM).toFixed(1)}`);
      climbedPathPts = pts.join(' ');
    }

    const campMarkers = model.camps.map((c, idx) => {
      const cx = xOf(c.distM).toFixed(1);
      const cy = yOf(c.eleM).toFixed(1);
      const isSel = idx === selectedIdx;
      const isReached = milestoneList && milestoneList[idx] ? milestoneList[idx].reached : false;
      const dotFill = isSel ? '#38bdf8' : (isReached ? '#16a34a' : 'var(--primary)');
      return `
        <g class="ele-camp-dot" data-camp-idx="${idx}" style="cursor:pointer;">
          <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${padT + plotH}" stroke="${isSel ? '#38bdf8' : 'var(--border-color)'}" stroke-width="${isSel ? '1.4' : '0.8'}" stroke-dasharray="2 2"/>
          <circle cx="${cx}" cy="${cy}" r="${isSel ? 5.8 : 4.2}" fill="${dotFill}" stroke="#ffffff" stroke-width="1.5"/>
        </g>
      `;
    }).join('');

    let climberDotMarkup = '';
    if (climberPt) {
      const clx = xOf(climberPt.distM).toFixed(1);
      const cly = yOf(climberPt.eleM).toFixed(1);
      climberDotMarkup = `
        <g pointer-events="none">
          <circle cx="${clx}" cy="${cly}" r="9" fill="rgba(250, 204, 21, 0.34)"/>
          <circle cx="${clx}" cy="${cly}" r="5.2" fill="#facc15" stroke="#ea580c" stroke-width="2"/>
        </g>
      `;
    }

    host.innerHTML = `
      <svg class="elevation-profile-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mount Everest elevation profile from Base Camp to Summit">
        <defs>
          <linearGradient id="everestEleFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.32"/>
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.03"/>
          </linearGradient>
        </defs>
        ${gridMarkup}
        ${distMarkup}
        <path d="${areaPts}" fill="url(#everestEleFill)"/>
        <path d="${pathPts}" fill="none" stroke="var(--text-tertiary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
        ${climbedPathPts ? `<path d="${climbedPathPts}" fill="none" stroke="#ea580c" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
        ${campMarkers}
        ${climberDotMarkup}
      </svg>
    `;

    host.querySelectorAll('.ele-camp-dot').forEach((node) => {
      node.addEventListener('click', () => {
        const idx = parseInt(node.getAttribute('data-camp-idx'), 10);
        if (!isNaN(idx)) handleSelectCamp(idx);
      });
    });
  }

  function renderCampList(model, selectedIdx, milestoneList, totalHours) {
    const grid = document.getElementById('mountainCampList');
    if (!grid || !model) return;
    grid.innerHTML = model.camps.map((c, idx) => {
      const prevEle = idx > 0 ? model.camps[idx - 1].eleM : c.eleM;
      const gain = idx > 0 ? `+${Math.round(c.eleM - prevEle)} m leg` : 'Start Staging';
      const ms = milestoneList && milestoneList[idx] ? milestoneList[idx] : null;
      const reached = ms ? ms.reached : false;
      const isNext = ms ? ms.isNext : false;
      const reqHours = ms ? ms.requiredHours : 0;

      let statusClass = 'camp-status-locked';
      let statusLabel = `At ${formatDurationHM(reqHours * 60)}`;
      let cardStateClass = '';
      if (reached) {
        statusClass = 'camp-status-reached';
        statusLabel = idx === 0 ? 'Staging ✓' : 'Reached ✓';
        cardStateClass = 'is-reached';
      } else if (isNext) {
        const remMins = Math.max(1, Math.ceil((reqHours - totalHours) * 60));
        statusClass = 'camp-status-next';
        statusLabel = `Next · ${formatDurationHM(remMins)} to go`;
        cardStateClass = 'is-next';
      }

      return `
        <button type="button" class="camp-stage-card ${cardStateClass} ${idx === selectedIdx ? 'is-selected' : ''}" data-camp-idx="${idx}">
          <div class="camp-card-top">
            <span class="camp-card-name">${c.title}</span>
            <span class="camp-card-ele">${Math.round(c.eleM).toLocaleString()} m</span>
          </div>
          <div class="camp-card-meta">${(c.distM / 1000).toFixed(2)} km · ${gain}</div>
          <div class="camp-card-meta">${c.zone}</div>
          <span class="camp-status-badge ${statusClass}">${statusLabel}</span>
        </button>
      `;
    }).join('');

    grid.querySelectorAll('.camp-stage-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-camp-idx'), 10);
        if (!isNaN(idx)) handleSelectCamp(idx);
      });
    });
  }

  function refreshClimbProgressUI(skipDbQuery) {
    if (!loadedModel) return;
    latestStats = computeStudyFocusStatsSync(climbScope, cachedIdbDaily, cachedIdbWatch);
    const totalHours = latestStats.totalMinutes / 60;
    const meta = getCampProgressMeta(loadedModel, totalHours, summitTargetHours);
    const climberPt = meta.climberPt;

    const stage = document.getElementById('mountainDioramaStage');
    if (stage && typeof window.setMountainClimberProgress === 'function') {
      window.setMountainClimberProgress(stage, meta.progress, { isActive: latestStats.isLiveTimerActive });
    }

    const eleEl = document.getElementById('statClimberEle');
    const hrsEl = document.getElementById('statStudyHours');
    const distEl = document.getElementById('statClimberDist');
    const nextEl = document.getElementById('statNextCamp');

    if (eleEl && climberPt) {
      eleEl.textContent = `${Math.round(climberPt.eleM).toLocaleString()} m`;
    }
    if (hrsEl) {
      hrsEl.textContent = formatDurationHM(latestStats.totalMinutes);
    }
    if (distEl && climberPt) {
      distEl.textContent = `${(climberPt.distM / 1000).toFixed(2)} / ${(loadedModel.totalDistM / 1000).toFixed(2)} km`;
    }
    if (nextEl) {
      nextEl.textContent = meta.nextCamp ? meta.nextCamp.camp.shortName : 'Summit Reached!';
    }

    const pctText = `${Math.round(meta.progress * 100)}%`;
    const headEl = document.getElementById('climberProgressHeadline');
    const fillEl = document.getElementById('climberProgressFill');
    const subEl = document.getElementById('climberProgressSub');
    const targetEl = document.getElementById('climberTargetSummary');
    const liveBadge = document.getElementById('climberLiveTimerBadge');
    const liveText = document.getElementById('climberLiveTimerText');

    if (headEl) {
      if (meta.progress >= 0.999) {
        headEl.textContent = 'Summit Reached! · 100% (8,849 m)';
      } else {
        const curName = meta.currentCamp ? meta.currentCamp.camp.title : 'Base Camp';
        headEl.textContent = `${curName} · ${pctText} to Summit (8,849 m)`;
      }
    }
    if (fillEl) {
      fillEl.style.width = `${(meta.progress * 100).toFixed(2)}%`;
    }
    if (subEl) {
      if (!meta.nextCamp) {
        subEl.textContent = 'Congratulations — you reached the Sagarmatha / Everest Summit!';
      } else {
        const remMins = Math.max(1, Math.ceil((meta.nextCamp.requiredHours - totalHours) * 60));
        subEl.textContent = `Next: ${meta.nextCamp.camp.title} (${Math.round(meta.nextCamp.camp.eleM).toLocaleString()} m) in ${formatDurationHM(remMins)}`;
      }
    }
    if (targetEl) {
      const scopeLabel = climbScope === 'today' ? 'Today' : (climbScope === 'week' ? 'This Week' : 'All Time');
      targetEl.textContent = `${scopeLabel} · Goal: ${summitTargetHours}h`;
    }
    if (liveBadge && liveText) {
      if (latestStats.isLiveTimerActive) {
        liveBadge.style.display = 'inline-flex';
        liveText.textContent = `Timer Live · ${formatLiveTimerClock(latestStats.liveSessionElapsedSecs)}`;
      } else {
        liveBadge.style.display = 'none';
      }
    }

    renderElevationProfile(loadedModel, activeCampIdx, climberPt, meta.milestones);
    renderCampList(loadedModel, activeCampIdx, meta.milestones, totalHours);

    if (!skipDbQuery && !idbSyncInFlight) {
      idbSyncInFlight = true;
      readStudyDashboardDB().then(({ dailyData, watchData }) => {
        idbSyncInFlight = false;
        cachedIdbDaily = dailyData;
        cachedIdbWatch = watchData;
        refreshClimbProgressUI(true);
      }).catch(() => {
        idbSyncInFlight = false;
      });
    }
  }

  function handleSelectCamp(idx) {
    if (!loadedModel) return;
    activeCampIdx = Math.max(0, Math.min(loadedModel.camps.length - 1, idx));
    const stage = document.getElementById('mountainDioramaStage');
    if (stage && typeof window.selectMountainCamp === 'function') {
      window.selectMountainCamp(stage, activeCampIdx);
    }
    refreshClimbProgressUI(true);
  }

  function syncScopeButtonsUI() {
    document.querySelectorAll('[data-climb-scope]').forEach((btn) => {
      const s = btn.getAttribute('data-climb-scope');
      btn.classList.toggle('active', s === climbScope);
    });
    const sel = document.getElementById('summitGoalHoursSelect');
    if (sel) {
      sel.value = String(summitTargetHours);
    }
  }

  function setClimbScope(scope) {
    if (scope !== 'all' && scope !== 'week' && scope !== 'today') return;
    climbScope = scope;
    writeStorage(SCOPE_STORAGE_KEY, scope);
    syncScopeButtonsUI();
    refreshClimbProgressUI(false);
  }

  function setSummitTargetHours(hoursVal) {
    const parsed = parseFloat(hoursVal);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    summitTargetHours = parsed;
    writeStorage(TARGET_HOURS_STORAGE_KEY, parsed);
    syncScopeButtonsUI();
    refreshClimbProgressUI(true);
  }

  function loadSavedClimbPreferences() {
    const savedScope = readStorage(SCOPE_STORAGE_KEY, 'all');
    if (savedScope === 'all' || savedScope === 'week' || savedScope === 'today') {
      climbScope = savedScope;
    }
    const savedTarget = parseFloat(readStorage(TARGET_HOURS_STORAGE_KEY, '50'));
    if (Number.isFinite(savedTarget) && savedTarget > 0) {
      summitTargetHours = savedTarget;
    }
    syncScopeButtonsUI();
  }

  async function initMountainPage() {
    loadMountainTheme();
    loadSavedClimbPreferences();

    const stage = document.getElementById('mountainDioramaStage');
    if (!stage) return;

    try {
      const [res, idbData] = await Promise.all([
        fetch(EVEREST_GEOJSON_URL, { cache: 'no-store' }),
        readStudyDashboardDB()
      ]);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const geojson = await res.json();

      cachedIdbDaily = idbData.dailyData;
      cachedIdbWatch = idbData.watchData;

      latestStats = computeStudyFocusStatsSync(climbScope, cachedIdbDaily, cachedIdbWatch);
      const initialProgress = Math.max(0, Math.min(1, (latestStats.totalMinutes / 60) / summitTargetHours));

      loadedModel = window.renderMountainDiorama(stage, geojson, {
        selectedCampIdx: activeCampIdx,
        climberProgress: initialProgress,
        climberActive: latestStats.isLiveTimerActive,
        onSelectCamp: (idx) => {
          activeCampIdx = idx;
          refreshClimbProgressUI(true);
        }
      });

      if (loadedModel) {
        refreshClimbProgressUI(true);
      }

      if (liveTickTimer) clearInterval(liveTickTimer);
      liveTickTimer = setInterval(() => {
        if (!loadedModel) return;
        const active = readJsonLocalStorage('activeFocusSession', null);
        if (active && active.startTime) {
          refreshClimbProgressUI(true);
        } else if (latestStats.isLiveTimerActive) {
          refreshClimbProgressUI(false);
        }
      }, 1000);
    } catch (err) {
      console.error('[Mountain] Failed to load Everest GeoJSON:', err);
      stage.innerHTML = '<div style="padding:28px;text-align:center;color:#fca5a5;">Unable to load Everest expedition GPS dataset.</div>';
    }
  }

  window.addEventListener('storage', (e) => {
    if (e.key === THEME_STORAGE_KEY) {
      loadMountainTheme();
    } else if (e.key === 'nepalForestHistory' || e.key === 'activeFocusSession') {
      refreshClimbProgressUI(false);
    } else if (e.key === SCOPE_STORAGE_KEY || e.key === TARGET_HOURS_STORAGE_KEY) {
      loadSavedClimbPreferences();
      refreshClimbProgressUI(true);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && loadedModel) {
      refreshClimbProgressUI(false);
    }
  });

  window.changeMountainTheme = changeMountainTheme;
  window.toggleMountainFullscreen = toggleMountainFullscreen;
  window.setClimbScope = setClimbScope;
  window.setSummitTargetHours = setSummitTargetHours;

  document.addEventListener('DOMContentLoaded', initMountainPage);
})();
