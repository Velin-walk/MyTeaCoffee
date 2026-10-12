// ============= 10 AUTHENTIC BOTANICAL PLANTS OF NEPAL =============
// Loaded modularly from /plants/registry.js
var NEPAL_PLANTS = window.NEPAL_PLANTS || [];

var selectedForestPlantId = parseInt(localStorage.getItem('selectedNepalPlantId'), 10);
if (isNaN(selectedForestPlantId) || !selectedForestPlantId) {
  const initialPlant = (typeof getSelectedNepalPlant === 'function' ? getSelectedNepalPlant() : (window.NEPAL_PLANTS && window.NEPAL_PLANTS[0])) || { id: 4 };
  selectedForestPlantId = initialPlant.id;
  try {
    localStorage.setItem('selectedNepalPlantId', selectedForestPlantId);
  } catch (e) {}
}
forestTimerMode = 'fixed'; // 'fixed' or 'open'
var forestActiveFilter = 'today';
var catalogActiveCategory = 'all';

function syncForestTimerState() {
  syncSharedTimerTick();
}

function getSelectedPlant() {
  if (typeof getSelectedNepalPlant === 'function') {
    return getSelectedNepalPlant();
  }
  const plants = window.NEPAL_PLANTS || NEPAL_PLANTS || [];
  let id = selectedForestPlantId;
  try {
    const stored = parseInt(localStorage.getItem('selectedNepalPlantId'), 10);
    if (!isNaN(stored) && stored > 0) id = stored;
  } catch (e) {}
  const match = plants.find(p => p.id === id);
  if (match) return match;
  if (plants.length > 0) {
    try { localStorage.setItem('selectedNepalPlantId', plants[0].id); } catch(e){}
    return plants[0];
  }
  return null;
}

function setForestTimerMode(mode) {
  if (isForestRunning) return;
  forestTimerMode = mode;
  document.getElementById('btnForestModeFixed')?.classList.toggle('active', mode === 'fixed');
  document.getElementById('btnForestModeOpen')?.classList.toggle('active', mode === 'open');

  const durationRow = document.getElementById('forestDurationPills');
  if (durationRow) {
    durationRow.style.display = mode === 'fixed' ? 'flex' : 'none';
  }

  const btnStart = document.getElementById('btnForestStart');
  if (btnStart) {
    btnStart.innerHTML = mode === 'fixed' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M12 22V12M12 12C9 12 6 9.5 6 6c3.5 0 6 2.5 6 6zM12 14c3 0 6-2 6-5-3 0-6 2-6 5z"/></svg> Plant & Focus' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M12 22V12M12 12C9 12 6 9.5 6 6c3.5 0 6 2.5 6 6zM12 14c3 0 6-2 6-5-3 0-6 2-6 5z"/></svg> Start Focus';
  }

  if (mode === 'open') {
    forestOpenElapsedSeconds = 0;
  }
  updateForestDisplay();
}

function switchMainTab(tab) {
  const btnCharts = document.getElementById('tabBtnCharts');
  const btnForest = document.getElementById('tabBtnForest');
  const navCharts = document.getElementById('navItemCharts');
  const navForest = document.getElementById('navItemForest');
  const badgeCharts = document.getElementById('tabBadgeCharts');
  const badgeForest = document.getElementById('tabBadgeForest');
  const topForestBtn = document.getElementById('topForestToggleBtn');
  const forestSection = document.getElementById('nepalForestTab');
  const chartsContainer = document.querySelector('.dashboard-container');

  try {
    localStorage.setItem('studyFlowActiveTab', tab);
  } catch (e) {}

  if (tab === 'charts') {
    // Show charts dashboard, hide forest tab
    if (chartsContainer) chartsContainer.style.display = 'grid';
    if (forestSection) forestSection.style.display = 'none';

    // In-page switcher active state
    if (btnCharts) btnCharts.classList.add('active');
    if (btnForest) btnForest.classList.remove('active');
    if (badgeCharts) {
      badgeCharts.className = 'tab-btn-badge active-badge';
      badgeCharts.textContent = 'Active View';
    }
    if (badgeForest) {
      badgeForest.className = 'tab-btn-badge';
      badgeForest.textContent = '50 Native Plants';
    }

    // Bottom navigation bar active state
    if (navCharts) navCharts.classList.add('active');
    if (navForest) navForest.classList.remove('active');

    // Top toggle button label & state
    if (topForestBtn) {
      topForestBtn.classList.remove('active');
      topForestBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M12 2L6 10h3l-4 7h14l-4-7h3L12 2z"/><path d="M12 17v5"/></svg> <span>Nepal Forest</span>';
      topForestBtn.title = 'Nepal Forest Study';
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Trigger charts redraw/resizing and fresh data load
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      loadChartDailyWithCache();
      loadChartWeeklyWithCache();
      loadChartMonthlyWithCache();
      load24HourWatchWithCache();
      loadMasterChronometer();
      loadActualStudySessions();
      loadDailyProgressChart();
      loadWeeklySessionsChart();
      loadActiveHoursChart();
    }, 150);
  } else {
    // Show forest tab, hide charts dashboard
    if (chartsContainer) chartsContainer.style.display = 'none';
    if (forestSection) forestSection.style.display = 'block';

    // Forest tab active state
    if (btnForest) btnForest.classList.add('active');
    if (btnCharts) btnCharts.classList.remove('active');
    if (badgeForest) {
      badgeForest.className = 'tab-btn-badge forest-badge';
      badgeForest.textContent = 'Active View';
    }
    if (badgeCharts) {
      badgeCharts.className = 'tab-btn-badge';
      badgeCharts.textContent = 'Study Charts';
    }

    // Bottom navigation bar active state
    if (navForest) navForest.classList.add('active');
    if (navCharts) navCharts.classList.remove('active');

    // Top toggle button label & active style
    if (topForestBtn) {
      topForestBtn.classList.add('active');
      topForestBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> <span>Study Charts</span>';
      topForestBtn.title = 'Study Charts & Analytics';
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    renderActivePlantProfile();
    renderMyForest();
  }
}

function openForestApp() {
  window.location.href = '/forest.html';
}

function toggleTopForestTab() {
  const currentTab = localStorage.getItem('studyFlowActiveTab') || 'charts';
  if (currentTab === 'forest') {
    switchMainTab('charts');
  } else {
    switchMainTab('forest');
  }
}

function toggleForestFullscreen() {
  const forestTab = document.getElementById('nepalForestTab');
  const btn = document.getElementById('btnForestFullscreen');
  const navBtnLabel = document.getElementById('navFullscreenLabel');
  if (!forestTab) return;
  const isNowFullscreen = forestTab.classList.toggle('fullscreen-mode');
  
  if (btn) {
    btn.innerHTML = isNowFullscreen ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;margin-right:4px;"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>Exit Fullscreen' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg> Fullscreen Focus';
  }
  if (navBtnLabel) {
    navBtnLabel.textContent = isNowFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
  }

  if (isNowFullscreen) {
    switchMainTab('forest');
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => null);
    }
  } else {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => null);
    }
  }
}

function selectForestDuration(mins, btn) {
  if (isForestRunning) return;
  forestDurationMinutes = mins;
  forestTotalSeconds = mins * 60;
  forestRemainingSeconds = forestTotalSeconds;
  document.querySelectorAll('#forestDurationPills .duration-pill').forEach(el => el.classList.remove('active'));
  if (btn) btn.classList.add('active');
  updateForestDisplay();
}

// ================= 10 AUTHENTIC BOTANICAL SVG ENGINE =================
// Botanical illustration engine & helpers loaded modularly from /plants/registry.js

function updateForestDisplay(isWithered = false) {
  const plant = getSelectedPlant();
  const timerEl = document.getElementById('forestTimerDisplay');
  const ringEl = document.getElementById('growthRingProgress');
  const svgContainer = document.getElementById('growthSvgStage');
  const stageLabel = document.getElementById('forestStageLabel');

  if (forestTimerMode === 'open') {
    const hrs = Math.floor(forestOpenElapsedSeconds / 3600);
    const mins = Math.floor((forestOpenElapsedSeconds % 3600) / 60);
    const secs = forestOpenElapsedSeconds % 60;
    const timeStr = hrs > 0
      ? `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (timerEl) timerEl.innerText = timeStr;

    const cycleSecs = 25 * 60;
    const currentTreeElapsed = forestOpenElapsedSeconds % cycleSecs;
    const progressPercent = (currentTreeElapsed / cycleSecs) * 100;

    if (ringEl) {
      const circumference = 660;
      const offset = circumference - (circumference * progressPercent / 100);
      ringEl.style.strokeDashoffset = offset;
      ringEl.style.stroke = isWithered ? 'var(--danger)' : 'var(--success)';
    }

    if (svgContainer) {
      svgContainer.innerHTML = getPlantGrowthSvgMarkup(plant, progressPercent, isWithered);
    }

    if (stageLabel) {
      if (isWithered) {
        stageLabel.innerText = 'Session Discarded';
        stageLabel.style.color = 'var(--danger)';
      } else if (!isForestRunning) {
        stageLabel.innerText = 'Ready to Focus (Open Timer)';
        stageLabel.style.color = 'var(--success)';
      } else if (forestOpenElapsedSeconds > 0 && currentTreeElapsed < 3 && forestOpenPlantedCount > 0) {
        stageLabel.innerText = `${plant.nepali} successfully planted!`;
        stageLabel.style.color = 'var(--success)';
      } else if (progressPercent < 25) {
        stageLabel.innerText = `Sprouting ${plant.nepali}...`;
        stageLabel.style.color = 'var(--success)';
      } else if (progressPercent < 60) {
        stageLabel.innerText = `Growing ${plant.nepali}...`;
        stageLabel.style.color = 'var(--success)';
      } else if (progressPercent < 95) {
        stageLabel.innerText = `Budding ${plant.nepali}...`;
        stageLabel.style.color = 'var(--success)';
      } else if (progressPercent < 100) {
        stageLabel.innerText = `Maturing ${plant.nepali}...`;
        stageLabel.style.color = 'var(--success)';
      } else {
        stageLabel.innerText = `${plant.nepali} successfully planted!`;
        stageLabel.style.color = 'var(--success)';
      }
    }
    return;
  }

  // Fixed Countdown Mode
  const m = Math.floor(forestRemainingSeconds / 60);
  const s = forestRemainingSeconds % 60;
  const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  if (timerEl) timerEl.innerText = timeStr;

  const elapsed = forestTotalSeconds - forestRemainingSeconds;
  const progressPercent = forestTotalSeconds > 0 ? (elapsed / forestTotalSeconds) * 100 : 0;

  if (ringEl) {
    const circumference = 660;
    const offset = circumference - (circumference * progressPercent / 100);
    ringEl.style.strokeDashoffset = offset;
    ringEl.style.stroke = isWithered ? 'var(--danger)' : 'var(--success)';
  }

  if (svgContainer) {
    svgContainer.innerHTML = getPlantGrowthSvgMarkup(plant, progressPercent, isWithered);
  }

  if (stageLabel) {
    if (isWithered) {
      stageLabel.innerText = 'Withered (Session Abandoned)';
      stageLabel.style.color = 'var(--danger)';
    } else if (!isForestRunning) {
      stageLabel.innerText = progressPercent >= 100 ? `${plant.nepali} successfully planted!` : 'Ready to Plant';
      stageLabel.style.color = 'var(--success)';
    } else if (progressPercent < 25) {
      stageLabel.innerText = `Sprouting ${plant.nepali}...`;
      stageLabel.style.color = 'var(--success)';
    } else if (progressPercent < 60) {
      stageLabel.innerText = `Growing ${plant.nepali}...`;
      stageLabel.style.color = 'var(--success)';
    } else if (progressPercent < 95) {
      stageLabel.innerText = `Budding ${plant.nepali}...`;
      stageLabel.style.color = 'var(--success)';
    } else if (progressPercent < 100) {
      stageLabel.innerText = `Maturing ${plant.nepali}...`;
      stageLabel.style.color = 'var(--success)';
    } else {
      stageLabel.innerText = `${plant.nepali} successfully planted!`;
      stageLabel.style.color = 'var(--success)';
    }
  }
}

function toggleForestSession() {
  if (isForestRunning) return;
  startSharedFocusSession(forestTimerMode, false);
}

function completeForestOpenSession() {
  if (!isForestRunning) return;
  finishAndPlantSharedSession(false);
}

function giveUpForestSession() {
  if (!isForestRunning) return;
  const plant = getSelectedPlant();

  if (forestTimerMode === 'open') {
    const confirmDiscard = window.confirm(`Do you want to discard this open study session? Your "${plant.nepali}" will not be saved.`);
    if (!confirmDiscard) return;

    finishAndPlantSharedSession(true);
    updateForestDisplay(true);
    setTimeout(() => {
      updateForestDisplay(false);
    }, 1500);
    return;
  }

  // Fixed Countdown Mode Give Up
  const confirmGiveUp = window.confirm(`Do you want to abandon your session? Your "${plant.nepali}" will wither!`);
  if (!confirmGiveUp) return;

  const actualStudiedMinutes = Math.round((forestTotalSeconds - forestRemainingSeconds) / 60);
  const studiedMinutes = Math.max(1, actualStudiedMinutes);
  const progressPercent = forestTotalSeconds > 0 ? ((forestTotalSeconds - forestRemainingSeconds) / forestTotalSeconds) * 100 : 0;
  let stage = 'sprout';
  if (progressPercent < 25) stage = 'sprout';
  else if (progressPercent < 60) stage = 'growing';
  else if (progressPercent < 95) stage = 'budding';
  else if (progressPercent < 100) stage = 'maturing';
  else stage = 'mature';

  saveForestPlantToHistory(plant, studiedMinutes, false, stage, progressPercent);

  if (actualStudiedMinutes >= 1) {
    const logDuration = `${Math.floor(actualStudiedMinutes / 60).toString().padStart(2, '0')}:${(actualStudiedMinutes % 60).toString().padStart(2, '0')}:00`;
    logData("Forest", logDuration, plant.nepali);
  }

  finishAndPlantSharedSession(true);
  updateForestDisplay(true);
  renderMyForest();
}

function finishForestSession() {
  finishAndPlantSharedSession(false);
}

function saveForestPlantToHistory(plant, minutes, isHealthy, stage, growthPercent) {
  let history = JSON.parse(localStorage.getItem('nepalForestHistory')) || [];
  let finalStage = stage;
  let finalPct = typeof growthPercent === 'number' ? growthPercent : null;

  if (!finalStage) {
    if (finalPct !== null) {
      if (finalPct < 25) finalStage = 'sprout';
      else if (finalPct < 60) finalStage = 'growing';
      else if (finalPct < 95) finalStage = 'budding';
      else if (finalPct < 100) finalStage = 'maturing';
      else finalStage = 'mature';
    } else if (typeof minutes === 'number') {
      if (minutes >= 25) {
        finalStage = 'mature';
        finalPct = 100;
      } else {
        finalPct = Math.min(100, (minutes / 25) * 100);
        if (finalPct < 25) finalStage = 'sprout';
        else if (finalPct < 60) finalStage = 'growing';
        else if (finalPct < 95) finalStage = 'budding';
        else if (finalPct < 100) finalStage = 'maturing';
        else finalStage = 'mature';
      }
    } else {
      finalStage = 'mature';
      finalPct = 100;
    }
  }

  history.push({
    id: plant.id,
    nepali: plant.nepali,
    english: plant.english,
    scientific: plant.scientific,
    category: plant.category,
    icon: plant.icon,
    minutes: minutes,
    isHealthy: isHealthy,
    stage: finalStage,
    growthPercent: finalPct !== null ? Math.round(finalPct) : 100,
    timestamp: Date.now()
  });
  localStorage.setItem('nepalForestHistory', JSON.stringify(history));
}

function renderActivePlantProfile() {
  const plant = getSelectedPlant();
  const emblem = document.getElementById('activePlantEmblem');
  const nepali = document.getElementById('activePlantNepali');
  const english = document.getElementById('activePlantEnglish');
  const scientific = document.getElementById('activePlantScientific');
  const category = document.getElementById('activePlantCategory');

  if (emblem) {
    emblem.innerHTML = getBotanicalAvatarSvg(plant);
  }
  if (nepali) nepali.innerText = plant.nepali;
  if (english) english.innerText = plant.english;
  if (scientific) scientific.innerText = plant.scientific;
  if (category) category.innerText = plant.category;

  updateForestDisplay();
}

function renderMyForest() {
  const history = JSON.parse(localStorage.getItem('nepalForestHistory')) || [];
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfDay - (now.getDay() * 24 * 60 * 60 * 1000);

  let filtered = history;
  if (forestActiveFilter === 'today') {
    filtered = history.filter(item => item.timestamp >= startOfDay);
  } else if (forestActiveFilter === 'week') {
    filtered = history.filter(item => item.timestamp >= startOfWeek);
  }

  const totalTrees = filtered.length;
  const healthyCount = filtered.filter(item => item.isHealthy).length;
  const witheredCount = filtered.filter(item => !item.isHealthy).length;
  const totalMinutes = filtered.reduce((acc, cur) => acc + (cur.minutes || 0), 0);

  const statTrees = document.getElementById('statForestTotalTrees');
  const statTime = document.getElementById('statForestTotalTime');
  const statHealthy = document.getElementById('statForestHealthy');
  const statWithered = document.getElementById('statForestWithered');

  if (statTrees) statTrees.innerText = totalTrees;
  if (statTime) {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    statTime.innerText = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  }
  if (statHealthy) statHealthy.innerText = healthyCount;
  if (statWithered) statWithered.innerText = witheredCount;

  const canvas = document.getElementById('forestGridCanvas');
  if (!canvas) return;

  // Mini grassland terrain with rich soil: NO PLANTS when ready for plantation, simple & elegant
  let surfaceContent = '';
  if (filtered.length === 0) {
    surfaceContent = `
      <div class="grassland-empty-view">
        <button class="btn-empty-grassland-cue" onclick="scrollToForestTimer()">
          Ready for plantation • Start focus timer to plant a tree
        </button>
      </div>
    `;
  } else {
    const plantedPlots = filtered.slice().reverse().map(item => {
      const timeDate = new Date(item.timestamp);
      const formatted = timeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isWith = !item.isHealthy;
      const stageInfo = (typeof getPlantStageInfo === 'function') ? getPlantStageInfo(item) : { stage: item.stage || 'mature' };
      const iconContent = getBotanicalPlotIconSvg(item, isWith);
      return `
        <div class="planted-tree-item ${isWith ? 'withered' : ''} stage-${stageInfo.stage}" title="${item.nepali} (${item.english}) - ${item.minutes}m • ${formatted}">
          <div class="planted-tree-icon">${iconContent}</div>
          <div class="planted-tree-name">${item.nepali}</div>
          <div class="planted-tree-meta">${item.minutes}m • ${formatted}</div>
        </div>
      `;
    }).join('');

    surfaceContent = `
      <div class="grassland-trees-grid">
        ${plantedPlots}
      </div>
    `;
  }

  canvas.innerHTML = `
    <div class="mini-grassland-terrain">
      <div class="grassland-surface">
        ${surfaceContent}
      </div>
      <div class="grassland-fringe"></div>
      <div class="grassland-soil">
        <span class="soil-caption">FERTILE SOIL • READY FOR PLANTATION</span>
      </div>
    </div>
  `;
}

function scrollToForestTimer() {
  const timer = document.getElementById('forestTimerDisplay') || document.querySelector('.forest-focus-card');
  if (timer) {
    timer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function filterForestGrid(type) {
  forestActiveFilter = type;
  document.getElementById('filterTodayBtn')?.classList.toggle('active', type === 'today');
  document.getElementById('filterWeekBtn')?.classList.toggle('active', type === 'week');
  document.getElementById('filterAllBtn')?.classList.toggle('active', type === 'all');
  renderMyForest();
}

function openPlantsCatalogModal() {
  const modal = document.getElementById('nepalPlantsModal');
  if (modal) {
    modal.style.display = 'flex';
    renderPlantsCatalog();
  }
}

function closePlantsModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('catalog-modal-backdrop')) return;
  const modal = document.getElementById('nepalPlantsModal');
  if (modal) modal.style.display = 'none';
}

function filterCatalogCategory(category, btn) {
  catalogActiveCategory = category;
  const parent = btn?.parentElement;
  if (parent) {
    parent.querySelectorAll('.duration-pill').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
  }
  renderPlantsCatalog();
}

function renderPlantsCatalog() {
  const listEl = document.getElementById('plantsCatalogList');
  if (!listEl) return;
  const search = (document.getElementById('plantSearchInput')?.value || '').toLowerCase().trim();
  const plants = window.NEPAL_PLANTS || NEPAL_PLANTS || [];

  const filtered = plants.filter(plant => {
    const matchesCat = catalogActiveCategory === 'all' || plant.category.toLowerCase() === catalogActiveCategory.toLowerCase();
    const matchesSearch = !search ||
      plant.nepali.toLowerCase().includes(search) ||
      plant.english.toLowerCase().includes(search) ||
      plant.scientific.toLowerCase().includes(search);
    return matchesCat && matchesSearch;
  });

  listEl.innerHTML = filtered.map(plant => {
    const isSelected = plant.id === selectedForestPlantId;
    return `
      <div class="plant-catalog-card ${isSelected ? 'selected' : ''}" onclick="selectNepalPlant(${plant.id})">
        <div class="catalog-card-icon">${getBotanicalIconSvg(plant)}</div>
        <div class="catalog-card-details">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="catalog-card-nepali">${plant.id}. ${plant.nepali}</div>
            <span style="font-size:10px; font-weight:700; color:var(--success); background:rgba(52,168,83,0.1); padding:2px 6px; border-radius:10px;">${plant.category}</span>
          </div>
          <div class="catalog-card-english">${plant.english}</div>
          <div class="catalog-card-scientific">${plant.scientific}</div>
        </div>
      </div>
    `;
  }).join('');
}

function selectNepalPlant(id) {
  if (isForestRunning) {
    alert("A focus session is currently active! You can choose a new plant once the session is complete.");
    return;
  }
  selectedForestPlantId = id;
  localStorage.setItem('selectedNepalPlantId', id);
  renderActivePlantProfile();
  closePlantsModal();
}

function playForestChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(392, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.2);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, now + 0.25);
    gain2.gain.setValueAtTime(0.2, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.25);
    osc2.stop(now + 1.8);
  } catch (e) {
    console.log('Audio chime unavailable', e);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePlantsModal();
    const forestTab = document.getElementById('nepalForestTab');
    if (forestTab && forestTab.classList.contains('fullscreen-mode')) {
      toggleForestFullscreen();
    }
  }
});

// Initialize Nepal Forest on load
window.addEventListener('load', () => {
  renderActivePlantProfile();
  renderMyForest();
  const savedTab = localStorage.getItem('studyFlowActiveTab') || 'charts';
  switchMainTab(savedTab);

  // Auto-restore active session if present
  try {
    const active = JSON.parse(localStorage.getItem('activeFocusSession'));
    if (active && active.startTime && !isForestRunning) {
      const elapsed = Math.floor((Date.now() - active.startTime) / 1000);
      if (elapsed < 12 * 3600) {
        openStartTime = active.startTime;
        forestTimerMode = active.mode || 'open';
        if (active.durationMinutes) forestDurationMinutes = active.durationMinutes;
        startSharedFocusSession(forestTimerMode, true);
      } else {
        localStorage.removeItem('activeFocusSession');
      }
    }
  } catch (e) {}
});

// Cross-tab synchronization
window.addEventListener('storage', (e) => {
  if (e.key === 'selectedNepalPlantId') {
    const newId = parseInt(e.newValue, 10);
    if (!isNaN(newId) && newId > 0) {
      selectedForestPlantId = newId;
      renderActivePlantProfile();
    }
  } else if (e.key === 'activeFocusSession') {
    if (!e.newValue && isForestRunning) {
      finishAndPlantSharedSession(true);
      renderMyForest();
    } else if (e.newValue && !isForestRunning) {
      try {
        const active = JSON.parse(e.newValue);
        if (active && active.startTime) {
          openStartTime = active.startTime;
          forestTimerMode = active.mode || 'open';
          if (active.durationMinutes) forestDurationMinutes = active.durationMinutes;
          startSharedFocusSession(forestTimerMode, true);
        }
      } catch (err) {}
    }
  } else if (e.key === 'nepalForestHistory') {
    renderMyForest();
  }
});

// Synchronize timer immediately when returning from other apps or tabs
document.addEventListener('visibilitychange', () => {
  if (isForestRunning && !document.hidden) {
    syncForestTimerState();
  }
});
window.addEventListener('focus', () => {
  if (isForestRunning) {
    syncForestTimerState();
  }
});
window.addEventListener('pageshow', () => {
  if (isForestRunning) {
    syncForestTimerState();
  }
});
