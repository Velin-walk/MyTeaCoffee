function formatHours(decimalHours) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours % 1) * 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function parseSessionDate(dateStr) {
  const now = new Date();
  if (!dateStr) return now;
  const trimmed = String(dateStr).trim();
  if (!trimmed) return now;

  // Unambiguous ISO yyyy-MM-dd in local time (avoid UTC midnight date shift)
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    return new Date(parseInt(iso[1], 10), parseInt(iso[2], 10) - 1, parseInt(iso[3], 10));
  }

  // Explicit 4-digit year present (e.g. "Dec 28 2025")
  if (/\b\d{4}\b/.test(trimmed)) {
    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? now : parsed;
  }

  // Month/Day without year (e.g. "Dec 28"): infer most recent year so Dec viewed in Jan stays previous year
  const currentYear = now.getFullYear();
  let candidate = new Date(trimmed + ' ' + currentYear);
  if (isNaN(candidate.getTime())) return now;

  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  if (candidate.getTime() - now.getTime() > sevenDaysMs) {
    const prevYearCandidate = new Date(trimmed + ' ' + (currentYear - 1));
    if (!isNaN(prevYearCandidate.getTime())) {
      candidate = prevYearCandidate;
    }
  }
  return candidate;
}
window.parseSessionDate = parseSessionDate;

// Shared backend warning indicator (clears automatically when backend recovers)
function setBackendErrorState(isError, message) {
  if (typeof document === 'undefined' || !document.body) return;
  let badge = document.getElementById('studyFlowBackendNotice');
  if (!isError) {
    if (badge && badge.parentNode) badge.parentNode.removeChild(badge);
    return;
  }
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'studyFlowBackendNotice';
    badge.style.cssText = 'position:fixed;bottom:76px;left:16px;z-index:9997;background:#fef2f2;color:#991b1b;border:1px solid #fecaca;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.12);max-width:340px;';
    document.body.appendChild(badge);
  }
  badge.textContent = message || 'Backend sync unavailable — showing cached data.';
}
window.setBackendErrorState = setBackendErrorState;

async function fetchBackendJson(queryString) {
  const base = (typeof getEffectiveWebAppUrl === 'function') ? getEffectiveWebAppUrl() : (window.WEB_APP_URL || '/api/data');
  const url = (typeof buildApiUrl === 'function')
    ? buildApiUrl(base, queryString)
    : base + (queryString ? ((base.indexOf('?') === -1 ? '?' : '&') + queryString.replace(/^\?/, '')) : '');
  const res = await fetch(url);
  if (!res.ok) {
    let errText = `Backend HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      if (errBody && (errBody.message || errBody.error)) {
        errText = errBody.message || errBody.error;
      }
    } catch (e) {}
    setBackendErrorState(true, `Backend unavailable (${res.status}) — cached data may be shown.`);
    throw new Error(errText);
  }
  const data = await res.json();
  if (data && !Array.isArray(data) && typeof data === 'object' && data.error) {
    setBackendErrorState(true, `Backend error: ${data.error}`);
    throw new Error(data.message || data.error);
  }
  if (!res.headers || !res.headers.get('X-Proxy-Cache')) {
    setBackendErrorState(false);
  } else {
    setBackendErrorState(true, 'Using stale proxy cache — Google Sheets unreachable.');
  }
  return data;
}
window.fetchBackendJson = fetchBackendJson;

    function openGasModal() {
      const modal = document.getElementById('gasModal');
      if (!modal) return;
      modal.style.display = 'flex';
      const urlInput = document.getElementById('customGasUrlInput');
      if (urlInput) {
        urlInput.value = getGasWebAppUrl();
      }
      const codeDisplay = document.getElementById('gasCodeDisplay');
      if (codeDisplay && (!codeDisplay.textContent || codeDisplay.textContent.trim().length === 0)) {
        fetch('/google-apps-script-backend.js')
          .then(res => res.text())
          .then(text => {
            codeDisplay.textContent = text;
          })
          .catch(() => {
            codeDisplay.textContent = '// See google-apps-script-backend.js in project root';
          });
      }
    }

    function closeGasModal(e) {
      if (e && e.target && e.target !== document.getElementById('gasModal') && !e.target.classList.contains('pwa-modal-close-btn') && e.target.tagName !== 'BUTTON') {
        return;
      }
      const modal = document.getElementById('gasModal');
      if (modal) modal.style.display = 'none';
    }

    function saveCustomGasUrl() {
      const input = document.getElementById('customGasUrlInput');
      const status = document.getElementById('gasUrlSaveStatus');
      if (!input) return;
      const val = input.value.trim();
      setGasWebAppUrl(val);
      if (status) {
        status.textContent = 'Saved! Web App URL updated.';
        status.style.color = 'var(--success)';
        setTimeout(() => { if (status) status.textContent = ''; }, 3000);
      }
      if (typeof alert === 'function') {
        alert('Google Apps Script URL saved successfully.');
      }
    }

    function resetCustomGasUrl() {
      setGasWebAppUrl('');
      const input = document.getElementById('customGasUrlInput');
      if (input) input.value = getGasWebAppUrl();
      const status = document.getElementById('gasUrlSaveStatus');
      if (status) {
        status.textContent = 'Reset to default Web App URL.';
        status.style.color = 'var(--warning)';
        setTimeout(() => { if (status) status.textContent = ''; }, 3000);
      }
    }

    function copyGasScript() {
      const codeDisplay = document.getElementById('gasCodeDisplay');
      const btn = document.getElementById('copyGasBtn');
      const textToCopy = (codeDisplay && codeDisplay.textContent) ? codeDisplay.textContent : '';
      if (!textToCopy) {
        fetch('/google-apps-script-backend.js')
          .then(res => res.text())
          .then(code => {
            navigator.clipboard.writeText(code).then(() => {
              if (btn) btn.textContent = 'Copied!';
              setTimeout(() => { if (btn) btn.textContent = 'Copy Script'; }, 2000);
            });
          });
        return;
      }
      navigator.clipboard.writeText(textToCopy).then(() => {
        if (btn) btn.textContent = 'Copied!';
        setTimeout(() => { if (btn) btn.textContent = 'Copy Script'; }, 2000);
      }).catch(() => {
        if (btn) btn.textContent = 'Selected - press Ctrl+C';
      });
    }

    window.openGasModal = openGasModal;
    window.closeGasModal = closeGasModal;
    window.saveCustomGasUrl = saveCustomGasUrl;
    window.resetCustomGasUrl = resetCustomGasUrl;
    window.copyGasScript = copyGasScript;
    var db;
    var openInt = null, openSecs = 0, openStartTime = null;
    var forestTimerMode = 'open'; // 'open' or 'fixed'
    var forestOpenElapsedSeconds = 0;
    var forestOpenPlantedCount = 0;
    var forestDurationMinutes = 25;
    var forestTimerInterval = null;
    var forestRemainingSeconds = 25 * 60;
    var forestTotalSeconds = 25 * 60;
    var forestSessionStartTime = null;
    var forestSessionEndTime = null;
    var isForestRunning = false;

    // Initialize IndexedDB
    function initIndexedDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('StudyDashboardDB', 1);
        request.onerror = () => { console.error('IndexedDB error:', request.error); reject(request.error); };
        request.onsuccess = () => { db = request.result; console.log('IndexedDB initialized'); resolve(db); };
        request.onupgradeneeded = (event) => {
          const database = event.target.result;
          if (!database.objectStoreNames.contains('dailyData')) database.createObjectStore('dailyData', { keyPath: 'id' });
          if (!database.objectStoreNames.contains('weeklyData')) database.createObjectStore('weeklyData', { keyPath: 'id' });
          if (!database.objectStoreNames.contains('monthlyData')) database.createObjectStore('monthlyData', { keyPath: 'id' });
          if (!database.objectStoreNames.contains('watchData')) database.createObjectStore('watchData', { keyPath: 'id' });
          if (!database.objectStoreNames.contains('plannerData')) database.createObjectStore('plannerData', { keyPath: 'id' });
        };
      });
    }

    // Save to IndexedDB
    function saveToIndexedDB(storeName, data) {
      return new Promise((resolve) => {
        if (!db) { resolve(); return; }
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        store.clear();
        store.add({ id: 1, data: data, timestamp: Date.now() });
        transaction.oncomplete = () => resolve();
      });
    }

    // Get from IndexedDB
    function getFromIndexedDB(storeName) {
      return new Promise((resolve) => {
        if (!db) { resolve(null); return; }
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(1);
        request.onsuccess = () => resolve(request.result ? request.result.data : null);
        request.onerror = () => resolve(null);
      });
    }

    // ============= CACHE WRAPPER FUNCTIONS =============

    async function loadChartDailyWithCache() {
      const cachedData = await getFromIndexedDB('dailyData');
      if (cachedData) { loadChart('Daily', 'chart_div_daily', cachedData); }
      fetchBackendJson('view=Daily').then(newData => {
        if (Array.isArray(newData)) saveToIndexedDB('dailyData', newData);
        loadChart('Daily', 'chart_div_daily', newData);
      }).catch(() => {
        const el = document.getElementById('chart_div_daily');
        if (!cachedData && el) el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--danger);font-size:12px;">Error loading chart</div>';
      });
    }

    async function loadChartWeeklyWithCache() {
      const cachedData = await getFromIndexedDB('weeklyData');
      if (cachedData) { loadChart('Weekly', 'chart_div_weekly', cachedData); }
      fetchBackendJson('view=Weekly').then(newData => {
        if (Array.isArray(newData)) saveToIndexedDB('weeklyData', newData);
        loadChart('Weekly', 'chart_div_weekly', newData);
      }).catch(() => {
        const el = document.getElementById('chart_div_weekly');
        if (!cachedData && el) el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--danger);font-size:12px;">Error loading chart</div>';
      });
    }

    async function loadChartMonthlyWithCache() {
      const cachedData = await getFromIndexedDB('monthlyData');
      if (cachedData) { loadChart('Monthly', 'chart_div_monthly', cachedData); }
      fetchBackendJson('view=Monthly').then(newData => {
        if (Array.isArray(newData)) saveToIndexedDB('monthlyData', newData);
        loadChart('Monthly', 'chart_div_monthly', newData);
      }).catch(() => {
        const el = document.getElementById('chart_div_monthly');
        if (!cachedData && el) el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--danger);font-size:12px;">Error loading chart</div>';
      });
    }

    async function load24HourWatchWithCache() {
      const cachedData = await getFromIndexedDB('watchData');
      if (cachedData) { updateWatchDisplay(cachedData); }
      fetchBackendJson(`action=getWatchData&_t=${Date.now()}`).then(newData => {
        if (Array.isArray(newData)) saveToIndexedDB('watchData', newData);
        updateWatchDisplay(newData);
        loadMasterChronometer();
      }).catch(err => console.error("Watch error:", err));
    }

    async function loadPlannerWithCache() {
      const cachedData = await getFromIndexedDB('plannerData');
      if (cachedData) { displayPlannerTable(cachedData); }
      fetchBackendJson('action=getPlannerData').then(newData => {
        if (Array.isArray(newData)) saveToIndexedDB('plannerData', newData);
        displayPlannerTable(newData);
      }).catch(() => {
        const el = document.getElementById('gridWrapper');
        if (!cachedData && el) el.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--danger);">Error loading planner</div>`;
      });
    }

    // ============= DISPLAY FUNCTIONS =============

    function mergeContinuousSessions(sessions) {
      if (!Array.isArray(sessions) || sessions.length <= 1) {
        return Array.isArray(sessions) ? [...sessions] : [];
      }
      const valid = sessions.filter(s => typeof s.hrs === 'number' && s.hrs > 0 && typeof s.start === 'number');
      if (valid.length <= 1) return valid;
      valid.sort((a, b) => a.start - b.start);

      const merged = [];
      let current = { ...valid[0] };

      for (let i = 1; i < valid.length; i++) {
        const next = valid[i];
        const currentEnd = current.start + current.hrs;
        const gap = next.start - currentEnd;

        // If sessions share nearly identical start time (duplicate sync entries), deduplicate duration
        if (Math.abs(next.start - current.start) <= 0.05) {
          current.hrs = Math.max(current.hrs, next.hrs);
          if (!current.plant && next.plant) current.plant = next.plant;
        } else if (gap <= 0.05) {
          // Merge contiguous sequential slices if gap is <= 3 minutes (0.05 hr) or overlapping
          const newEnd = Math.max(currentEnd, next.start + next.hrs);
          if (newEnd > currentEnd) {
            current.hrs = newEnd - current.start;
          }
          if (!current.plant && next.plant) current.plant = next.plant;
        } else {
          merged.push(current);
          current = { ...next };
        }
      }
      if (current) merged.push(current);
      return merged;
    }
    window.mergeContinuousSessions = mergeContinuousSessions;

    function updateWatchDisplay(rawSessions) {
      const sessions = mergeContinuousSessions(rawSessions);
      let totalStudyH = 0, totalBreakM = 0, totalRestH = 0;
      if (sessions && sessions.length > 0) {
        sessions.sort((a, b) => a.start - b.start);
        sessions.forEach((sess, i) => {
          totalStudyH += sess.hrs;
          if (i < sessions.length - 1) {
            let gap = sessions[i+1].start - (sess.start + sess.hrs);
            if (gap > 0) { if (gap >= 6) totalRestH += gap; else totalBreakM += (gap * 60); }
          }
        });
        let firstGap = sessions[0].start, lastGap = 24 - (sessions[sessions.length-1].start + sessions[sessions.length-1].hrs);
        [firstGap, lastGap].forEach(gap => { if (gap >= 6) totalRestH += gap; else if (gap > 0) totalBreakM += (gap * 60); });
      }
      const masterTotalHours = document.getElementById('masterTotalHours');
      const masterBreak = document.getElementById('masterBreak');
      const masterRest = document.getElementById('masterRest');
      if (masterTotalHours) masterTotalHours.innerText = formatHours(totalStudyH);
      if (masterBreak) masterBreak.innerText = Math.round(totalBreakM) + 'm';
      if (masterRest) masterRest.innerText = formatHours(totalRestH);

      // 2-Way Sync: Auto-plant unmerged study chart sessions into Nepal Forest
      syncWatchSessionsToForest(rawSessions);
    }

    function syncWatchSessionsToForest(sessions) {
      if (!Array.isArray(sessions) || sessions.length === 0) return;

      // Fallback plant only when source session has no plant recorded
      const activePlant = (typeof getSelectedNepalPlant === 'function')
        ? getSelectedNepalPlant()
        : ((typeof getSelectedPlant === 'function') ? getSelectedPlant() : (function() {
            const plants = window.NEPAL_PLANTS || [];
            let id = null;
            try { id = parseInt(localStorage.getItem('selectedNepalPlantId'), 10); } catch(e){}
            if (id) {
              const match = plants.find(p => p.id === id);
              if (match) return match;
            }
            if (plants.length > 0) {
              try { localStorage.setItem('selectedNepalPlantId', plants[0].id); } catch(e){}
              return plants[0];
            }
            return null;
          })());

      const now = new Date();
      if (typeof syncSheetSessionsToForestHistory === 'function' && typeof formatLocalDateKey === 'function') {
        const updated = syncSheetSessionsToForestHistory(
          [{
            dateKey: formatLocalDateKey(now),
            targetDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            daysAgo: 0,
            sessions
          }],
          activePlant,
          { reconcileAllSheetDates: false }
        );
        if (updated && typeof renderMyForest === 'function') {
          renderMyForest();
        }
        return;
      }
    }

    function displayPlannerTable(data) {
      if (!Array.isArray(data) || data.length === 0) {
        document.getElementById('gridWrapper').innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-tertiary); font-size: 11px;">No schedule data</div>';
        return;
      }
      const rowMap = new Map();
      for (let i = 1; i < data.length; i++) {
        if (data[i] && data[i][0]) rowMap.set(data[i][0], data[i]);
      }
      const now = new Date();
      const last7CalendarDays = [];
      for (let d = 6; d >= 0; d--) {
        const dt = new Date(now);
        dt.setDate(now.getDate() - d);
        last7CalendarDays.push(dt);
      }
      const tableData = last7CalendarDays.map(dt => {
        const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        const dayOfWeek = dt.toLocaleDateString('en-US', { weekday: 'short' });
        const row = rowMap.get(dateStr);
        let sessionCount = 0, totalStudyHours = 0;
        if (row) {
          for (let j = 1; j < row.length; j += 3) {
            const hours = row[j];
            if (typeof hours === 'number' && hours > 0) { sessionCount++; totalStudyHours += hours; }
          }
        }
        return { dayOfWeek, dateStr, sessionCount, totalStudyHours };
      });
      const weeklyTotals = { totalSessions: tableData.reduce((sum, d) => sum + d.sessionCount, 0), totalStudyHours: tableData.reduce((sum, d) => sum + d.totalStudyHours, 0) };
      let html = `<div style="overflow-x: auto; width: 100%;"><table style="width: 100%; border-collapse: collapse; font-size: 16px;"><thead><tr style="background: var(--input-bg); border-bottom: 1px solid var(--primary);"><th style="padding: 6px 8px; text-align: left; font-weight: 700; color: var(--text); font-size: 10px;">Day</th><th style="padding: 6px 8px; text-align: center; font-weight: 700; color: var(--text); font-size: 10px;">Sessions</th><th style="padding: 6px 8px; text-align: center; font-weight: 700; color: var(--text); font-size: 10px;">Study Time</th><th style="padding: 6px 8px; text-align: right; font-weight: 700; color: var(--text); font-size: 10px;">Efficiency</th></tr></thead><tbody>`;
      tableData.forEach((day, idx) => {
        const efficiency = Math.round((day.totalStudyHours / 16) * 100);
        const bgColor = idx >= 5 ? 'rgba(0,0,0,0.02)' : 'transparent';
        html += `<tr style="background: ${bgColor}; border-bottom: 1px solid var(--border-color);"><td style="padding: 6px 8px; font-weight: 600; color: var(--primary); font-size: 10px;">${day.dayOfWeek} <span style="font-size: 9px; color: var(--text-tertiary);">${day.dateStr}</span></td><td style="padding: 6px 8px; text-align: center;"><span style="background: var(--primary); color: white; padding: 2px 4px; border-radius: 3px; font-weight: 600; font-size: 9px;">${day.sessionCount}</span></td><td style="padding: 6px 8px; text-align: center; font-weight: 700; color: var(--primary); font-size: 10px;">${formatHours(day.totalStudyHours)}</td><td style="padding: 6px 8px; text-align: right;"><div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px;"><div style="width: 30px; height: 4px; background: var(--border-color); border-radius: 2px; overflow: hidden;"><div style="width: ${Math.min(100, efficiency)}%; height: 100%; background: ${efficiency > 80 ? 'var(--success)' : efficiency > 50 ? 'var(--warning)' : 'var(--danger)'}; transition: width 0.3s;"></div></div><span style="font-weight: 600; font-size: 9px; min-width: 30px;">${efficiency}%</span></div></td></tr>`;
      });
      const weeklyEfficiency = Math.round((weeklyTotals.totalStudyHours / 12) * 100);
      html += `<tr style="background: var(--primary); color: white; font-weight: 700; font-size: 10px;"><td style="padding: 6px 8px; font-weight: 800;">7-DAY</td><td style="padding: 6px 8px; text-align: center;"><span style="background: rgba(255,255,255,0.3); padding: 2px 4px; border-radius: 3px; font-size: 9px;">${weeklyTotals.totalSessions}</span></td><td style="padding: 6px 8px; text-align: center;">${weeklyTotals.totalStudyHours.toFixed(1)}h</td><td style="padding: 6px 8px; text-align: right;"><div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px;"><div style="width: 30px; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; overflow: hidden;"><div style="width: ${Math.min(100, weeklyEfficiency)}%; height: 100%; background: rgba(255,255,255,0.8);"></div></div><span style="font-size: 9px; min-width: 30px;">${weeklyEfficiency}%</span></div></td></tr></tbody></table></div>`;
      html += `<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color);"><div style="text-align: center;"><span style="display: block; font-size: 9px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Avg/Day</span><span style="font-size: 13px; font-weight: 800; color: var(--primary);">${formatHours(weeklyTotals.totalStudyHours / 7)}</span></div><div style="text-align: center;"><span style="display: block; font-size: 9px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Peak</span><span style="font-size: 13px; font-weight: 800; color: var(--success);">${tableData.reduce((max, d) => d.totalStudyHours > max.totalStudyHours ? d : max).dayOfWeek}</span></div><div style="text-align: center;"><span style="display: block; font-size: 9px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Avg Sess</span><span style="font-size: 13px; font-weight: 800; color: var(--primary);">${(weeklyTotals.totalSessions / 7).toFixed(1)}</span></div><div style="text-align: center;"><span style="display: block; font-size: 9px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Active</span><span style="font-size: 13px; font-weight: 800; color: var(--warning);">${Math.round((tableData.filter(d => d.sessionCount > 0).length / 7) * 100)}%</span></div></div>`;
      document.getElementById('gridWrapper').innerHTML = html;
    }

