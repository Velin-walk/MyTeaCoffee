    // ============= UNIFIED MASTER TIMER & WATCH SYNC =============
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
        cardOpen.style.background = `linear-gradient(to right, white ${progress}%, var(--text) ${progress}%)`;
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
          finishForestSession();
        }
      } else {
        // Open Timer Mode: Once 25 minutes (1500s) is complete, start planting new tree!
        const completedCycles = Math.floor(forestOpenElapsedSeconds / 1500);
        if (completedCycles > forestOpenPlantedCount) {
          const plant = (typeof getSelectedPlant === 'function')
            ? getSelectedPlant()
            : (typeof getSelectedNepalPlant === 'function' ? getSelectedNepalPlant() : null);
          if (!plant) return;

          for (let c = forestOpenPlantedCount + 1; c <= completedCycles; c++) {
            if (typeof saveForestPlantToHistory === 'function') {
              saveForestPlantToHistory(plant, 25, true, 'mature', 100);
            }
            if (typeof logData === 'function') {
              logData("Forest", "00:25:00", plant.nepali);
            }
          }
          forestOpenPlantedCount = completedCycles;

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

      isForestRunning = true;
      forestTimerMode = mode || 'open';

      if (!isRestoring) {
        const now = Date.now();
        openStartTime = now;
        forestSessionStartTime = now;
        forestOpenPlantedCount = 0;
        if (typeof saveState === 'function') {
          saveState("Open", now);
        }
        try {
          localStorage.setItem('activeFocusSession', JSON.stringify({
            startTime: now,
            mode: forestTimerMode,
            durationMinutes: forestDurationMinutes
          }));
        } catch (e) {}
      } else {
        forestSessionStartTime = openStartTime;
        const elapsedSecs = Math.max(0, Math.floor((Date.now() - openStartTime) / 1000));
        try {
          const history = JSON.parse(localStorage.getItem('nepalForestHistory')) || [];
          forestOpenPlantedCount = history.filter(item => item.timestamp >= (openStartTime - 2000)).length;
        } catch (e) {
          forestOpenPlantedCount = Math.floor(elapsedSecs / 1500);
        }
      }

      if (forestTimerMode === 'fixed') {
        forestTotalSeconds = forestDurationMinutes * 60;
        forestRemainingSeconds = forestTotalSeconds;
        forestSessionEndTime = forestSessionStartTime + (forestTotalSeconds * 1000);
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
      openInt = setInterval(syncSharedTimerTick, 500);
      forestTimerInterval = openInt;
    }

    function finishAndPlantSharedSession(isAbandoned = false) {
      if (!isForestRunning && !openStartTime) return;

      if (openInt) clearInterval(openInt);
      if (forestTimerInterval && forestTimerInterval !== openInt) clearInterval(forestTimerInterval);
      openInt = null;
      forestTimerInterval = null;

      const now = Date.now();
      const startTime = openStartTime || forestSessionStartTime || now;
      const elapsed = Math.max(1, Math.floor((now - startTime) / 1000));
      const studiedMinutes = Math.max(1, Math.round(elapsed / 60));
      const plant = (typeof getSelectedPlant === 'function')
        ? getSelectedPlant()
        : (typeof getSelectedNepalPlant === 'function' ? getSelectedNepalPlant() : null);
      if (!plant) return;

      const wasOpenMode = (forestTimerMode === 'open');
      const priorPlantedCount = forestOpenPlantedCount;

      // Reset internal states
      isForestRunning = false;
      openStartTime = null;
      forestSessionStartTime = null;
      forestSessionEndTime = null;
      openSecs = 0;
      forestOpenElapsedSeconds = 0;
      forestOpenPlantedCount = 0;

      try {
        localStorage.removeItem('activeFocusSession');
      } catch (e) {}

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
          // In open mode: auto-planted trees already planted 25m each.
          // Now plant remaining unplanted minutes according to stage of growth!
          const remainingSecs = elapsed % 1500;
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
              saveForestPlantToHistory(plant, remainingMinutes, true, stage, growthPercent);
            }
            const logDuration = (typeof fmt === 'function') ? fmt(remainingSecs, true) : `${Math.floor(remainingMinutes / 60).toString().padStart(2, '0')}:${(remainingMinutes % 60).toString().padStart(2, '0')}:00`;
            if (typeof logData === 'function') {
              logData("Open", logDuration, plant.nepali);
            }
          } else if (priorPlantedCount === 0 && elapsed >= 10) {
            // First tree stopped in early sprout (< 1 min)
            if (typeof saveForestPlantToHistory === 'function') {
              saveForestPlantToHistory(plant, 1, true, 'sprout', Math.min(24, Math.max(1, Math.round((elapsed / 1500) * 100))));
            }
          }
        } else {
          // Fixed Countdown Mode: 100% completed
          if (typeof saveForestPlantToHistory === 'function') {
            saveForestPlantToHistory(plant, studiedMinutes, true, 'mature', 100);
          }
          const logDuration = (typeof fmt === 'function') ? fmt(elapsed, true) : `${Math.floor(studiedMinutes / 60).toString().padStart(2, '0')}:${(studiedMinutes % 60).toString().padStart(2, '0')}:00`;
          if (typeof logData === 'function') {
            logData("Forest", logDuration, plant.nepali);
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
      fetch(WEB_APP_URL, { method: "POST", mode: "no-cors", body: JSON.stringify({ action: "saveState", type, startTime, targetDuration }) });
    }

    function logData(type, duration, target) {
      fetch(WEB_APP_URL, { method: "POST", mode: "no-cors", body: JSON.stringify({ type, duration, target }) }).then(() => {
        setTimeout(() => { 
          loadChartDailyWithCache(); loadChartWeeklyWithCache(); loadChartMonthlyWithCache();
          loadPlannerWithCache(); loadCalendarData(); loadHourlyDist();
          load24HourWatchWithCache(); loadMountain(); loadScatter();
          loadMasterChronometer();
          generateSchedule(); loadActualStudySessions(); loadDailyProgressChart();
          loadWeeklySessionsChart();
          loadActiveHoursChart();
        }, 1500);
      });
    }
