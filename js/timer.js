    // ============= UNIFIED MASTER TIMER & WATCH SYNC =============
    var forestFixedTimeout = null;

    function getSafeFallbackPlant() {
      const p = (typeof getSelectedPlant === 'function' ? getSelectedPlant() : null)
        || (typeof getSelectedNepalPlant === 'function' ? getSelectedNepalPlant() : null)
        || (window.NEPAL_PLANTS && window.NEPAL_PLANTS[0]);
      if (p) return p;
      return {
        id: 4,
        slug: 'rhododendron',
        nepali: 'लालीगुराँस',
        english: 'Rhododendron',
        scientific: 'Rhododendron arboreum',
        category: 'National Flower / Tree',
        icon: '🌺'
      };
    }

    function readActiveFocusSession() {
      if (typeof safeGetJsonStorage === 'function') {
        return safeGetJsonStorage('activeFocusSession', null, function (val) {
          return val && typeof val === 'object' && typeof val.startTime === 'number' && val.startTime > 0;
        });
      }
      try {
        const parsed = JSON.parse(localStorage.getItem('activeFocusSession'));
        return (parsed && typeof parsed === 'object' && parsed.startTime > 0) ? parsed : null;
      } catch (e) {
        return null;
      }
    }

    function writeActiveFocusSession(sessionObj) {
      try {
        const serialized = JSON.stringify(sessionObj);
        if (typeof safeStorageSet === 'function') {
          safeStorageSet('activeFocusSession', serialized);
        } else {
          localStorage.setItem('activeFocusSession', serialized);
        }
      } catch (e) {}
    }

    function persistOpenPlantedCycles(count) {
      const active = readActiveFocusSession();
      if (!active || !openStartTime) return;
      if (active.plantedCycles === count) return;
      active.plantedCycles = count;
      writeActiveFocusSession(active);
    }

    function clearFixedCompletionTimeout() {
      if (forestFixedTimeout) {
        clearTimeout(forestFixedTimeout);
        forestFixedTimeout = null;
      }
    }

    function scheduleFixedCompletionTimeout(endTime) {
      clearFixedCompletionTimeout();
      if (forestTimerMode !== 'fixed' || !endTime) return;
      const delay = Math.max(0, endTime - Date.now()) + 150;
      forestFixedTimeout = setTimeout(function () {
        if (isForestRunning && forestTimerMode === 'fixed') {
          syncSharedTimerTick();
        }
      }, Math.min(delay, 2147483647));
    }

    function syncSharedTimerTick() {
      if (!isForestRunning && !openStartTime) return;
      const now = Date.now();
      const startTime = openStartTime || forestSessionStartTime || now;
      const elapsed = Math.max(0, Math.floor((now - startTime) / 1000));

      openSecs = elapsed;
      forestOpenElapsedSeconds = elapsed;

      // 1. Update Study Charts Chronometer / Open Watch
      const openDisplay = document.getElementById('openDisplay');
      if (openDisplay) {
        openDisplay.innerText = fmt(elapsed, true);
        openDisplay.style.color = '#FFD700';
      }
      const cardOpen = document.getElementById('card-open');
      if (cardOpen) {
        let progress = ((elapsed % 3600) / 3600) * 100;
        cardOpen.style.background = `linear-gradient(to right, #38bdf8 ${progress}%, var(--text) ${progress}%)`;
      }
      if (typeof toggleButtons === 'function') {
        toggleButtons('O', true);
      }

      // 2. Update Nepal Forest Watch Display
      if (forestTimerMode === 'fixed') {
        const remaining = Math.max(0, Math.round((forestSessionEndTime - now) / 1000));
        forestRemainingSeconds = remaining;
        if (typeof updateForestDisplay === 'function') {
          updateForestDisplay();
        }
        if (remaining <= 0) {
          if (typeof finishForestSession === 'function') finishForestSession();
          else finishAndPlantSharedSession(false);
        }
      } else {
        // Open Timer Mode: Once 25 minutes (1500s) is complete, catch up up to session cap (48 trees = 20h)
        const completedCycles = Math.floor(forestOpenElapsedSeconds / 1500);
        const safeTargetCycles = Math.min(completedCycles, 48);
        if (safeTargetCycles > forestOpenPlantedCount) {
          const plant = getSafeFallbackPlant();

          for (let c = forestOpenPlantedCount + 1; c <= safeTargetCycles; c++) {
            const cycleTimestamp = startTime + (c * 1500 * 1000);
            if (typeof saveForestPlantToHistory === 'function') {
              saveForestPlantToHistory(plant, 25, true, 'mature', 100, cycleTimestamp);
            }
          }
          forestOpenPlantedCount = safeTargetCycles;
          persistOpenPlantedCycles(forestOpenPlantedCount);

          if (typeof playForestChime === 'function') {
            playForestChime();
          }
          if (typeof renderMyForest === 'function') {
            renderMyForest();
          }
        }

        if (typeof updateForestDisplay === 'function') {
          updateForestDisplay();
        }
      }
    }

    function startSharedFocusSession(mode = 'open', isRestoring = false) {
      if (openInt) clearInterval(openInt);
      if (forestTimerInterval && forestTimerInterval !== openInt) clearInterval(forestTimerInterval);
      clearFixedCompletionTimeout();

      isForestRunning = true;
      forestTimerMode = mode || 'open';

      if (!isRestoring) {
        const now = Date.now();
        localStartAt = now;
        openStartTime = now;
        forestSessionStartTime = now;
        forestOpenPlantedCount = 0;
        if (typeof saveState === 'function') {
          saveState("Open", now, forestTimerMode === 'fixed' ? forestDurationMinutes : null);
        }
        writeActiveFocusSession({
          startTime: now,
          mode: forestTimerMode,
          durationMinutes: forestDurationMinutes,
          plantedCycles: 0
        });
      } else {
        forestSessionStartTime = openStartTime;
        const active = readActiveFocusSession();
        if (active && typeof active.plantedCycles === 'number' && active.plantedCycles >= 0) {
          forestOpenPlantedCount = active.plantedCycles;
        } else {
          const history = (typeof safeGetJsonStorage === 'function')
            ? safeGetJsonStorage('nepalForestHistory', [], Array.isArray)
            : [];
          const fromHistory = history.filter(item => item && item.source !== 'charts' && item.source !== 'charts-sync' && item.timestamp >= (openStartTime - 2000)).length;
          forestOpenPlantedCount = fromHistory;
        }
      }

      if (forestTimerMode === 'fixed') {
        forestTotalSeconds = forestDurationMinutes * 60;
        forestSessionEndTime = forestSessionStartTime + (forestTotalSeconds * 1000);
        forestRemainingSeconds = isRestoring
          ? Math.max(0, Math.round((forestSessionEndTime - Date.now()) / 1000))
          : forestTotalSeconds;
        scheduleFixedCompletionTimeout(forestSessionEndTime);
      } else {
        forestOpenElapsedSeconds = Math.max(0, Math.floor((Date.now() - openStartTime) / 1000));
      }

      // Study Charts button & display
      if (typeof toggleButtons === 'function') toggleButtons('O', true);
      const openDisplay = document.getElementById('openDisplay');
      if (openDisplay) openDisplay.style.color = '#FFD700';

      // Nepal Forest controls
      const btnStart = document.getElementById('btnForestStart');
      const btnCompleteOpen = document.getElementById('btnForestCompleteOpen');
      const btnGiveUp = document.getElementById('btnForestGiveUp');
      const durationRow = document.getElementById('forestDurationPills');
      const modeSwitcher = document.querySelector('.timer-mode-switcher');

      if (btnStart) btnStart.style.display = 'none';
      if (durationRow) durationRow.style.opacity = '0.4';
      if (modeSwitcher) modeSwitcher.style.opacity = '0.4';

      if (forestTimerMode === 'open') {
        if (btnCompleteOpen) btnCompleteOpen.style.display = 'inline-flex';
        if (btnGiveUp) {
          btnGiveUp.style.display = 'inline-flex';
          btnGiveUp.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><circle cx="12" cy="10" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Discard';
        }
      } else {
        if (btnCompleteOpen) btnCompleteOpen.style.display = 'none';
        if (btnGiveUp) {
          btnGiveUp.style.display = 'inline-flex';
          btnGiveUp.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><circle cx="12" cy="10" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Give Up';
        }
      }

      const btnModeFixed = document.getElementById('btnForestModeFixed');
      const btnModeOpen = document.getElementById('btnForestModeOpen');
      if (btnModeFixed) btnModeFixed.classList.toggle('active', forestTimerMode === 'fixed');
      if (btnModeOpen) btnModeOpen.classList.toggle('active', forestTimerMode === 'open');

      syncSharedTimerTick();
      if (isForestRunning) {
        openInt = setInterval(syncSharedTimerTick, 500);
        forestTimerInterval = openInt;
      }
    }

    function finishAndPlantSharedSession(isAbandoned = false) {
      if (!isForestRunning && !openStartTime) return;

      if (openInt) clearInterval(openInt);
      if (forestTimerInterval && forestTimerInterval !== openInt) clearInterval(forestTimerInterval);
      clearFixedCompletionTimeout();
      openInt = null;
      forestTimerInterval = null;

      const now = Date.now();
      const startTime = openStartTime || forestSessionStartTime || now;
      const rawElapsed = Math.max(1, Math.floor((now - startTime) / 1000));
      const wasOpenMode = (forestTimerMode === 'open');
      const fixedTargetSecs = forestTotalSeconds || ((forestDurationMinutes || 25) * 60);
      // Fixed completions after device sleep must log the configured target duration, not wall-clock sleep time
      const loggedSecs = wasOpenMode ? rawElapsed : Math.min(rawElapsed, fixedTargetSecs);
      const studiedMinutes = Math.max(1, Math.round(loggedSecs / 60));
      const plant = getSafeFallbackPlant();
      const priorPlantedCount = forestOpenPlantedCount;

      // Reset internal states unconditionally first so timer can never get stuck
      isForestRunning = false;
      openStartTime = null;
      forestSessionStartTime = null;
      forestSessionEndTime = null;
      openSecs = 0;
      forestOpenElapsedSeconds = 0;
      forestOpenPlantedCount = 0;

      if (typeof safeStorageRemove === 'function') {
        safeStorageRemove('activeFocusSession');
      } else {
        try { localStorage.removeItem('activeFocusSession'); } catch (e) {}
      }

      // Clear server state so reload never resurrects old timers
      if (typeof saveState === 'function') {
        saveState("Open", 0);
      }

      // Reset Study Charts UI
      const openDisplay = document.getElementById('openDisplay');
      if (openDisplay) {
        openDisplay.innerText = "00:00:00";
        openDisplay.style.color = 'white';
      }
      const cardOpen = document.getElementById('card-open');
      if (cardOpen) cardOpen.style.background = "var(--card-bg)";
      if (typeof toggleButtons === 'function') toggleButtons('O', false);

      // Reset Nepal Forest UI
      const btnStart = document.getElementById('btnForestStart');
      const btnCompleteOpen = document.getElementById('btnForestCompleteOpen');
      const btnGiveUp = document.getElementById('btnForestGiveUp');
      const durationRow = document.getElementById('forestDurationPills');
      const modeSwitcher = document.querySelector('.timer-mode-switcher');

      if (btnStart) {
        btnStart.style.display = 'inline-flex';
        btnStart.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M12 22V12M12 12C9 12 6 9.5 6 6c3.5 0 6 2.5 6 6zM12 14c3 0 6-2 6-5-3 0-6 2-6 5z"/></svg> ' + (forestTimerMode === 'fixed' ? 'Plant & Focus' : 'Start Focus');
      }
      if (btnCompleteOpen) btnCompleteOpen.style.display = 'none';
      if (btnGiveUp) btnGiveUp.style.display = 'none';
      if (durationRow) durationRow.style.opacity = '1';
      if (modeSwitcher) modeSwitcher.style.opacity = '1';

      if (!isAbandoned) {
        if (wasOpenMode) {
          // Catch up any remaining full 25m cycles completed before stop, bounded to 48
          const totalCycles = Math.min(Math.floor(rawElapsed / 1500), 48);
          for (let c = priorPlantedCount + 1; c <= totalCycles; c++) {
            if (typeof saveForestPlantToHistory === 'function') {
              saveForestPlantToHistory(plant, 25, true, 'mature', 100, startTime + (c * 1500 * 1000));
            }
          }

          // Now plant remaining unplanted minutes according to stage of growth
          const remainingSecs = rawElapsed % 1500;
          const remainingMinutes = Math.round(remainingSecs / 60);

          if (remainingMinutes >= 1) {
            const growthPercent = Math.min(100, (remainingSecs / 1500) * 100);
            let stage = 'sprout';
            if (growthPercent < 25) stage = 'sprout';
            else if (growthPercent < 60) stage = 'growing';
            else if (growthPercent < 95) stage = 'budding';
            else if (growthPercent < 100) stage = 'maturing';
            else stage = 'mature';

            if (typeof saveForestPlantToHistory === 'function') {
              saveForestPlantToHistory(plant, remainingMinutes, true, stage, growthPercent, now);
            }
          } else if (Math.max(priorPlantedCount, totalCycles) === 0 && rawElapsed >= 10) {
            // First tree stopped in early sprout (< 1 min)
            if (typeof saveForestPlantToHistory === 'function') {
              saveForestPlantToHistory(plant, 1, true, 'sprout', Math.min(24, Math.max(1, Math.round((rawElapsed / 1500) * 100))), now);
            }
          }

          // Log full continuous study session once for Study Charts / Google Sheets
          if (studiedMinutes >= 1 && typeof logData === 'function') {
            const fullLogDuration = (typeof fmt === 'function')
              ? fmt(rawElapsed, true)
              : `${Math.floor(studiedMinutes / 60).toString().padStart(2, '0')}:${(studiedMinutes % 60).toString().padStart(2, '0')}:00`;
            logData("Open", fullLogDuration, "N/A", plant.nepali);
          }
        } else {
          // Fixed Countdown Mode: 100% completed
          if (typeof saveForestPlantToHistory === 'function') {
            saveForestPlantToHistory(plant, studiedMinutes, true, 'mature', 100, startTime + (loggedSecs * 1000));
          }
          const logDuration = (typeof fmt === 'function') ? fmt(loggedSecs, true) : `${Math.floor(studiedMinutes / 60).toString().padStart(2, '0')}:${(studiedMinutes % 60).toString().padStart(2, '0')}:00`;
          if (typeof logData === 'function') {
            logData("Forest", logDuration, forestDurationMinutes || "N/A", plant.nepali);
          }
        }

        if (typeof playForestChime === 'function') {
          playForestChime();
        }
        if (typeof renderMyForest === 'function') {
          renderMyForest();
        }
        if (typeof updateForestDisplay === 'function') {
          updateForestDisplay(false);
        }
      } else {
        if (typeof updateForestDisplay === 'function') {
          updateForestDisplay(false);
        }
      }
    }

    function startOpen(isRestoring = false) {
      startSharedFocusSession('open', isRestoring);
    }

    function stopOpen() {
      finishAndPlantSharedSession(false);
    }

    function saveState(type, startTime, targetDuration = null) {
      try {
        const url = (typeof getEffectiveWebAppUrl === 'function') ? getEffectiveWebAppUrl() : WEB_APP_URL;
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "saveState", type, startTime, targetDuration }),
          keepalive: true
        }).catch(() => {});
      } catch (e) {}
    }

    // Refresh all charts and dashboard panels
    function refreshAllDashboardMetrics() {
      if (typeof loadChartDailyWithCache === 'function') loadChartDailyWithCache();
      if (typeof loadChartWeeklyWithCache === 'function') loadChartWeeklyWithCache();
      if (typeof loadChartMonthlyWithCache === 'function') loadChartMonthlyWithCache();
      if (typeof loadPlannerWithCache === 'function') loadPlannerWithCache();
      if (typeof loadCalendarData === 'function') loadCalendarData();
      if (typeof loadHourlyDist === 'function') loadHourlyDist();
      if (typeof load24HourWatchWithCache === 'function') load24HourWatchWithCache();
      if (typeof loadMountain === 'function') loadMountain();
      if (typeof loadScatter === 'function') loadScatter();
      if (typeof loadMasterChronometer === 'function') loadMasterChronometer();
      if (typeof generateSchedule === 'function') generateSchedule();
      if (typeof loadActualStudySessions === 'function') loadActualStudySessions();
      if (typeof loadDailyProgressChart === 'function') loadDailyProgressChart();
      if (typeof loadWeeklySessionsChart === 'function') loadWeeklySessionsChart();
      if (typeof loadActiveHoursChart === 'function') loadActiveHoursChart();
    }

    let localStartAt = 0;           // set to Date.now() inside the start function
    function checkRemoteState() {
      const base = (typeof getEffectiveWebAppUrl === 'function') ? getEffectiveWebAppUrl() : WEB_APP_URL;
      const stateUrl = (typeof buildApiUrl === 'function')
        ? buildApiUrl(base, `action=getState&_t=${Date.now()}`)
        : `${base}${base.indexOf('?') === -1 ? '?' : '&'}action=getState&_t=${Date.now()}`;
      fetch(stateUrl)
        .then(r => {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(props => {
          if (!props || typeof props !== 'object' || props.error) return;
          const serverStart = parseInt(props.Open_startTime, 10) || 0;
          if (serverStart > 0) return;
          if (Date.now() - localStartAt < 30000) {          // still within grace period
            saveState("Open", openStartTime || forestSessionStartTime);  // retry
            return;
          }
          // genuinely stopped elsewhere
          if (isForestRunning) finishAndPlantSharedSession(true); else stopOpen();
        }).catch(() => {});
    }

    // Cross-Device Sync: Check server state every 10 seconds and on visibility change to detect if timer was stopped on phone/another device
    setInterval(() => {
      if ((typeof isForestRunning !== 'undefined' && isForestRunning) || (typeof openStartTime !== 'undefined' && openStartTime)) {
        checkRemoteState();
      }
    }, 10000);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && ((typeof isForestRunning !== 'undefined' && isForestRunning) || (typeof openStartTime !== 'undefined' && openStartTime))) {
        syncSharedTimerTick();
        checkRemoteState();
      }
    });
