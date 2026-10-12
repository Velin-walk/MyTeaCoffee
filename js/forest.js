    // ================= 10 AUTHENTIC BOTANICAL PLANTS OF NEPAL =================
    // Loaded modularly from /plants/registry.js
    const NEPAL_PLANTS = window.NEPAL_PLANTS || [];

    // ================= ORIGINAL SOURCE API & LOGGING =================
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwXOTn__dyqNI-8JvsTPEGtC4OPJYuC9-_jqIlq-lutQZDeQzlmM-46XwWAmWYQu8mT/exec";

    function logData(type, duration, target) {
      fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ type, duration, target })
      }).catch(err => {
        console.error("Error logging forest session to original source:", err);
      });
    }

    // ================= STATE VARIABLES =================
    let selectedPlantId = parseInt(localStorage.getItem('selectedNepalPlantId')) || 4;
    let timerMode = 'fixed'; // 'fixed' or 'open'
    let openElapsedSecs = 0;
    let openPlantedCycles = 0;
    let timerDurationMins = 25;
    let timerTotalSecs = 25 * 60;
    let timerRemainingSecs = 25 * 60;
    let sessionStartTime = null;
    let sessionTargetEndTime = null;
    let isSessionActive = false;
    let sessionTimerInterval = null;
    let activeForestFilter = 'today';
    let currentCatalogCategory = 'all';

    function syncForestTimer() {
      if (!isSessionActive) return;
      const now = Date.now();
      if (timerMode === 'open') {
        openElapsedSecs = Math.max(0, Math.floor((now - sessionStartTime) / 1000));
        const completedCycles = Math.floor(openElapsedSecs / 1500);
        if (completedCycles > openPlantedCycles) {
          const plant = getCurrentPlant();
          for (let c = openPlantedCycles + 1; c <= completedCycles; c++) {
            saveForestRecord(plant, 25, true, 'mature', 100);
            logData("Forest", "00:25:00", plant.nepali);
          }
          openPlantedCycles = completedCycles;
          playSuccessChime();
          renderForestPlots();
        }
        renderTimerDisplay();
      } else {
        const remaining = Math.max(0, Math.round((sessionTargetEndTime - now) / 1000));
        timerRemainingSecs = remaining;
        renderTimerDisplay();
        if (remaining <= 0) {
          completeForestSession();
        }
      }
    }

    function getCurrentPlant() {
      const plants = window.NEPAL_PLANTS || NEPAL_PLANTS || [];
      return plants.find(p => p.id === selectedPlantId) || plants[0] || { id: 4, english: 'Rhododendron', nepali: 'लालीगुराँस', scientific: 'Rhododendron arboreum', category: 'Flower', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><circle cx="12" cy="12" r="3"/><path d="M12 5a3 3 0 0 0-3 3c0 2 3 4 3 4s3-2 3-4a3 3 0 0 0-3-3zM12 19a3 3 0 0 0 3-3c0-2-3-4-3-4s-3 2-3 4a3 3 0 0 0 3 3z"/><path d="M5 12a3 3 0 0 0 3 3c2 0 4-3 4-3s-2-3-4-3a3 3 0 0 0-3 3zM19 12a3 3 0 0 0-3-3c-2 0-4 3-4 3s2 3 4 3a3 3 0 0 0 3-3z"/></svg>', desc: 'National flower of Nepal' };
    }

    // ================= TIMER MODE TOGGLE =================
    function setTimerMode(mode) {
      if (isSessionActive) return;
      timerMode = mode;
      document.getElementById('btnModeFixed')?.classList.toggle('active', mode === 'fixed');
      document.getElementById('btnModeOpen')?.classList.toggle('active', mode === 'open');

      const durationRow = document.getElementById('forestDurationRow');
      if (durationRow) {
        durationRow.style.display = mode === 'fixed' ? 'flex' : 'none';
      }

      const btnStart = document.getElementById('btnStartForestSession');
      if (btnStart) {
        btnStart.innerHTML = mode === 'fixed' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M12 22V12M12 12C9 12 6 9.5 6 6c3.5 0 6 2.5 6 6zM12 14c3 0 6-2 6-5-3 0-6 2-6 5z"/></svg> Plant & Focus' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M12 22V12M12 12C9 12 6 9.5 6 6c3.5 0 6 2.5 6 6zM12 14c3 0 6-2 6-5-3 0-6 2-6 5z"/></svg> Start Focus';
      }

      if (mode === 'open') {
        openElapsedSecs = 0;
      }
      renderTimerDisplay();
    }

    // ================= THEME SELECTOR =================
    function changeForestTheme(themeClass) {
      document.body.className = '';
      if (themeClass && themeClass !== 'default') {
        document.body.classList.add(themeClass);
      }
      try {
        localStorage.setItem('selectedTheme', themeClass);
      } catch (e) {}
    }

    // Load saved theme
    (function initTheme() {
      const savedTheme = localStorage.getItem('selectedTheme') || 'theme-forest';
      if (savedTheme) {
        changeForestTheme(savedTheme);
        const sel = document.getElementById('forestThemeSelect');
        if (sel) sel.value = savedTheme;
      }
    })();

    // ================= FULLSCREEN =================
    function toggleFullscreen() {
      const isFull = document.body.classList.toggle('is-fullscreen');
      const btn = document.getElementById('btnFullscreenHeader');
      if (isFull) {
        if (btn) btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg> <span>Exit Fullscreen</span>';
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        if (btn) btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg> <span>Fullscreen</span>';
        if (document.exitFullscreen && document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    }

    // ================= TIMER DURATION =================
    function setTimerDuration(mins, btn) {
      if (isSessionActive) return;
      timerDurationMins = mins;
      timerTotalSecs = mins * 60;
      timerRemainingSecs = timerTotalSecs;

      document.querySelectorAll('#forestDurationRow .duration-pill').forEach(el => el.classList.remove('active'));
      if (btn) btn.classList.add('active');
      renderTimerDisplay();
    }

    // ================= 10 AUTHENTIC BOTANICAL SVG ENGINE =================
    // Botanical illustration engine & helpers loaded modularly from /plants/registry.js

    // ================= RENDER TIMER =================
    function renderTimerDisplay(isWithered = false) {
      const plant = getCurrentPlant();
      const digits = document.getElementById('forestTimerDigits');
      const ring = document.getElementById('forestGrowthRing');
      const graphic = document.getElementById('forestGrowthStageGraphic');
      const status = document.getElementById('forestStatusLabel');

      if (timerMode === 'open') {
        const hrs = Math.floor(openElapsedSecs / 3600);
        const mins = Math.floor((openElapsedSecs % 3600) / 60);
        const secs = openElapsedSecs % 60;
        const str = hrs > 0
          ? `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
          : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (digits) digits.innerText = str;

        const cycleSecs = 25 * 60;
        const curElapsed = openElapsedSecs % cycleSecs;
        const pct = (curElapsed / cycleSecs) * 100;

        if (ring) {
          const circum = 660;
          const offset = circum - (circum * pct / 100);
          ring.style.strokeDashoffset = offset;
          ring.style.stroke = isWithered ? 'var(--danger)' : 'var(--primary)';
        }

        if (graphic) {
          graphic.innerHTML = getPlantGrowthSvg(plant, pct, isWithered);
        }

        if (status) {
          if (isWithered) {
            status.innerText = 'Session Discarded';
            status.style.color = 'var(--danger)';
          } else if (!isSessionActive) {
            status.innerText = 'Ready to Focus (Open Timer)';
            status.style.color = 'var(--primary)';
          } else if (openElapsedSecs > 0 && curElapsed < 3 && openPlantedCycles > 0) {
            status.innerText = `${plant.nepali} successfully planted!`;
            status.style.color = 'var(--primary)';
          } else if (pct < 25) {
            status.innerText = `Sprouting ${plant.nepali}...`;
            status.style.color = 'var(--primary)';
          } else if (pct < 60) {
            status.innerText = `Growing ${plant.nepali}...`;
            status.style.color = 'var(--primary)';
          } else if (pct < 95) {
            status.innerText = `Budding ${plant.nepali}...`;
            status.style.color = 'var(--primary)';
          } else if (pct < 100) {
            status.innerText = `Maturing ${plant.nepali}...`;
            status.style.color = 'var(--primary)';
          } else {
            status.innerText = `${plant.nepali} successfully planted!`;
            status.style.color = 'var(--primary)';
          }
        }
        return;
      }

      // Fixed Countdown Mode
      const mins = Math.floor(timerRemainingSecs / 60);
      const secs = timerRemainingSecs % 60;
      const str = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      if (digits) digits.innerText = str;

      const elapsed = timerTotalSecs - timerRemainingSecs;
      const pct = timerTotalSecs > 0 ? (elapsed / timerTotalSecs) * 100 : 0;

      if (ring) {
        const circum = 660;
        const offset = circum - (circum * pct / 100);
        ring.style.strokeDashoffset = offset;
        ring.style.stroke = isWithered ? 'var(--danger)' : 'var(--primary)';
      }

      if (graphic) {
        graphic.innerHTML = getPlantGrowthSvg(plant, pct, isWithered);
      }

      if (status) {
        if (isWithered) {
          status.innerText = 'Withered (Session Abandoned)';
          status.style.color = 'var(--danger)';
        } else if (!isSessionActive) {
          status.innerText = pct >= 100 ? `${plant.nepali} successfully planted!` : 'Ready to Plant';
          status.style.color = 'var(--primary)';
        } else if (pct < 25) {
          status.innerText = `Sprouting ${plant.nepali}...`;
          status.style.color = 'var(--primary)';
        } else if (pct < 60) {
          status.innerText = `Growing ${plant.nepali}...`;
          status.style.color = 'var(--primary)';
        } else if (pct < 95) {
          status.innerText = `Budding ${plant.nepali}...`;
          status.style.color = 'var(--primary)';
        } else if (pct < 100) {
          status.innerText = `Maturing ${plant.nepali}...`;
          status.style.color = 'var(--primary)';
        } else {
          status.innerText = `${plant.nepali} successfully planted!`;
          status.style.color = 'var(--primary)';
        }
      }
    }

    // ================= SESSION CONTROL =================
    function startOrResumeSession(isResuming = false) {
      if (isSessionActive) return;
      isSessionActive = true;
      if (!isResuming) {
        sessionStartTime = Date.now();
        openPlantedCycles = 0;
        try {
          localStorage.setItem('activeFocusSession', JSON.stringify({
            startTime: sessionStartTime,
            mode: timerMode,
            durationMinutes: timerDurationMins
          }));
        } catch (e) {}
      } else {
        const elapsedSecs = Math.max(0, Math.floor((Date.now() - sessionStartTime) / 1000));
        try {
          const history = JSON.parse(localStorage.getItem('nepalForestHistory')) || [];
          openPlantedCycles = history.filter(item => item.timestamp >= (sessionStartTime - 2000)).length;
        } catch (e) {
          openPlantedCycles = Math.floor(elapsedSecs / 1500);
        }
      }

      const btnStart = document.getElementById('btnStartForestSession');
      const btnCompleteOpen = document.getElementById('btnCompleteOpenSession');
      const btnGiveUp = document.getElementById('btnGiveUpForestSession');
      const pillRow = document.getElementById('forestDurationRow');
      const modeSwitcher = document.querySelector('.timer-mode-switcher');

      if (btnStart) btnStart.style.display = 'none';
      if (pillRow) pillRow.style.opacity = '0.4';
      if (modeSwitcher) modeSwitcher.style.opacity = '0.4';

      if (timerMode === 'open') {
        openElapsedSecs = isResuming ? Math.max(0, Math.floor((Date.now() - sessionStartTime) / 1000)) : 0;
        if (btnCompleteOpen) btnCompleteOpen.style.display = 'inline-flex';
        if (btnGiveUp) {
          btnGiveUp.style.display = 'inline-flex';
          btnGiveUp.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Discard';
        }
        renderTimerDisplay();
        sessionTimerInterval = setInterval(syncForestTimer, 1000);
      } else {
        timerTotalSecs = timerDurationMins * 60;
        sessionTargetEndTime = sessionStartTime + (timerTotalSecs * 1000);
        timerRemainingSecs = Math.max(0, Math.round((sessionTargetEndTime - Date.now()) / 1000));
        if (btnCompleteOpen) btnCompleteOpen.style.display = 'none';
        if (btnGiveUp) {
          btnGiveUp.style.display = 'inline-flex';
          btnGiveUp.innerText = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Give Up';
        }
        renderTimerDisplay();
        sessionTimerInterval = setInterval(syncForestTimer, 1000);
      }
    }

    function completeOpenSession() {
      if (!isSessionActive || timerMode !== 'open') return;

      clearInterval(sessionTimerInterval);
      sessionTimerInterval = null;
      isSessionActive = false;
      sessionStartTime = null;
      sessionTargetEndTime = null;
      try { localStorage.removeItem('activeFocusSession'); } catch (e) {}

      const plant = getCurrentPlant();
      const remainingSecs = openElapsedSecs % 1500;
      const remainingMins = Math.round(remainingSecs / 60);

      if (remainingMins >= 1) {
        const pct = Math.min(100, (remainingSecs / 1500) * 100);
        let stage = 'sprout';
        if (pct < 25) stage = 'sprout';
        else if (pct < 60) stage = 'growing';
        else if (pct < 95) stage = 'budding';
        else if (pct < 100) stage = 'maturing';
        else stage = 'mature';

        saveForestRecord(plant, remainingMins, true, stage, pct);
        const logDuration = `${Math.floor(remainingMins / 60).toString().padStart(2, '0')}:${(remainingMins % 60).toString().padStart(2, '0')}:00`;
        logData("Forest", logDuration, plant.nepali);
      } else if (openPlantedCycles === 0 && openElapsedSecs >= 10) {
        saveForestRecord(plant, 1, true, 'sprout', Math.min(24, Math.max(1, Math.round((openElapsedSecs / 1500) * 100))));
      }

      openPlantedCycles = 0;
      playSuccessChime();

      const btnStart = document.getElementById('btnStartForestSession');
      const btnCompleteOpen = document.getElementById('btnCompleteOpenSession');
      const btnGiveUp = document.getElementById('btnGiveUpForestSession');
      const pillRow = document.getElementById('forestDurationRow');
      const modeSwitcher = document.querySelector('.timer-mode-switcher');

      if (btnStart) {
        btnStart.style.display = 'inline-flex';
        btnStart.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M12 22V12M12 12C9 12 6 9.5 6 6c3.5 0 6 2.5 6 6zM12 14c3 0 6-2 6-5-3 0-6 2-6 5z"/></svg> Start Focus';
      }
      if (btnCompleteOpen) btnCompleteOpen.style.display = 'none';
      if (btnGiveUp) btnGiveUp.style.display = 'none';
      if (pillRow) pillRow.style.opacity = '1';
      if (modeSwitcher) modeSwitcher.style.opacity = '1';

      openElapsedSecs = 0;
      renderTimerDisplay(false);
      renderForestPlots();
    }

    function giveUpSession() {
      if (!isSessionActive) return;
      const plant = getCurrentPlant();

      const btnStart = document.getElementById('btnStartForestSession');
      const btnCompleteOpen = document.getElementById('btnCompleteOpenSession');
      const btnGiveUp = document.getElementById('btnGiveUpForestSession');
      const pillRow = document.getElementById('forestDurationRow');
      const modeSwitcher = document.querySelector('.timer-mode-switcher');

      if (timerMode === 'open') {
        const ok = confirm(`Do you want to discard this open study session? Your "${plant.nepali}" will not be saved.`);
        if (!ok) return;

        clearInterval(sessionTimerInterval);
        sessionTimerInterval = null;
        isSessionActive = false;
        sessionStartTime = null;
        sessionTargetEndTime = null;
        openPlantedCycles = 0;
        try { localStorage.removeItem('activeFocusSession'); } catch (e) {}

        renderTimerDisplay(true);

        if (btnStart) {
          btnStart.style.display = 'inline-flex';
          btnStart.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M12 22V12M12 12C9 12 6 9.5 6 6c3.5 0 6 2.5 6 6zM12 14c3 0 6-2 6-5-3 0-6 2-6 5z"/></svg> Start Focus';
        }
        if (btnCompleteOpen) btnCompleteOpen.style.display = 'none';
        if (btnGiveUp) btnGiveUp.style.display = 'none';
        if (pillRow) pillRow.style.opacity = '1';
        if (modeSwitcher) modeSwitcher.style.opacity = '1';

        openElapsedSecs = 0;
        setTimeout(() => {
          renderTimerDisplay(false);
        }, 1500);
        return;
      }

      // Fixed Mode Give Up
      const ok = confirm(`Do you want to abandon your session? Your "${plant.nepali}" will wither!`);
      if (!ok) return;

      clearInterval(sessionTimerInterval);
      sessionTimerInterval = null;
      isSessionActive = false;
      sessionStartTime = null;
      sessionTargetEndTime = null;
      try { localStorage.removeItem('activeFocusSession'); } catch (e) {}

      const actualStudiedMinutes = Math.round((timerTotalSecs - timerRemainingSecs) / 60);
      const studiedMinutes = Math.max(1, actualStudiedMinutes);
      const pct = timerTotalSecs > 0 ? ((timerTotalSecs - timerRemainingSecs) / timerTotalSecs) * 100 : 0;
      let stage = 'sprout';
      if (pct < 25) stage = 'sprout';
      else if (pct < 60) stage = 'growing';
      else if (pct < 95) stage = 'budding';
      else if (pct < 100) stage = 'maturing';
      else stage = 'mature';

      saveForestRecord(plant, studiedMinutes, false, stage, pct);

      // Send actual focused study time to original source so all charts are populated and saved
      if (actualStudiedMinutes >= 1) {
        const logDuration = `${Math.floor(actualStudiedMinutes / 60).toString().padStart(2, '0')}:${(actualStudiedMinutes % 60).toString().padStart(2, '0')}:00`;
        logData("Forest", logDuration, plant.nepali);
      }

      renderTimerDisplay(true);

      if (btnStart) {
        btnStart.style.display = 'inline-flex';
        btnStart.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M12 22V12M12 12C9 12 6 9.5 6 6c3.5 0 6 2.5 6 6zM12 14c3 0 6-2 6-5-3 0-6 2-6 5z"/></svg> Try Again';
      }
      if (btnCompleteOpen) btnCompleteOpen.style.display = 'none';
      if (btnGiveUp) btnGiveUp.style.display = 'none';
      if (pillRow) pillRow.style.opacity = '1';
      if (modeSwitcher) modeSwitcher.style.opacity = '1';

      renderForestPlots();
    }

    function completeForestSession() {
      clearInterval(sessionTimerInterval);
      sessionTimerInterval = null;
      isSessionActive = false;
      sessionStartTime = null;
      sessionTargetEndTime = null;
      try { localStorage.removeItem('activeFocusSession'); } catch (e) {}

      const plant = getCurrentPlant();
      const studiedMinutes = Math.round(timerTotalSecs / 60);
      saveForestRecord(plant, studiedMinutes, true, 'mature', 100);

      // Send to original source so all charts are populated and saved
      const logDuration = `${Math.floor(studiedMinutes / 60).toString().padStart(2, '0')}:${(studiedMinutes % 60).toString().padStart(2, '0')}:00`;
      logData("Forest", logDuration, plant.nepali);

      playSuccessChime();
      renderTimerDisplay(false);

      const btnStart = document.getElementById('btnStartForestSession');
      const btnCompleteOpen = document.getElementById('btnCompleteOpenSession');
      const btnGiveUp = document.getElementById('btnGiveUpForestSession');
      const pillRow = document.getElementById('forestDurationRow');
      const modeSwitcher = document.querySelector('.timer-mode-switcher');

      if (btnStart) {
        btnStart.style.display = 'inline-flex';
        btnStart.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M12 22V12M12 12C9 12 6 9.5 6 6c3.5 0 6 2.5 6 6zM12 14c3 0 6-2 6-5-3 0-6 2-6 5z"/></svg> Plant Another';
      }
      if (btnCompleteOpen) btnCompleteOpen.style.display = 'none';
      if (btnGiveUp) btnGiveUp.style.display = 'none';
      if (pillRow) pillRow.style.opacity = '1';
      if (modeSwitcher) modeSwitcher.style.opacity = '1';

      renderForestPlots();
    }

    // ================= AUDIO CHIME =================
    function playSuccessChime() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(392, now); // G4
        gain1.gain.setValueAtTime(0.15, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 1.2);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(523.25, now + 0.25); // C5
        gain2.gain.setValueAtTime(0.2, now + 0.25);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.25);
        osc2.stop(now + 1.8);
      } catch (e) {
        console.log('Audio chime error:', e);
      }
    }

    // ================= STORAGE =================
    function saveForestRecord(plant, minutes, isHealthy, stage, growthPercent) {
      let history = [];
      try {
        history = JSON.parse(localStorage.getItem('nepalForestHistory')) || [];
      } catch (e) {}

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

      try {
        localStorage.setItem('nepalForestHistory', JSON.stringify(history));
      } catch (e) {}
    }

    function renderActivePlant() {
      const plant = getCurrentPlant();
      const avatarEl = document.getElementById('activePlantAvatar');
      if (avatarEl) {
        avatarEl.innerHTML = getBotanicalAvatarSvg(plant);
      }
      document.getElementById('activePlantNepali').innerText = plant.nepali;
      document.getElementById('activePlantEnglish').innerText = plant.english;
      document.getElementById('activePlantScientific').innerText = plant.scientific;
      document.getElementById('activePlantCategory').innerText = plant.category;
      if (plant.desc) {
        document.getElementById('activePlantDescription').innerText = plant.desc;
      }
      renderTimerDisplay();
    }

    // ================= MY FOREST PLOTS =================
    function renderForestPlots() {
      let history = [];
      try {
        history = JSON.parse(localStorage.getItem('nepalForestHistory')) || [];
      } catch (e) {}

      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const startOfWeek = startOfDay - (now.getDay() * 24 * 60 * 60 * 1000);

      let filtered = history;
      if (activeForestFilter === 'today') {
        filtered = history.filter(item => item.timestamp >= startOfDay);
      } else if (activeForestFilter === 'week') {
        filtered = history.filter(item => item.timestamp >= startOfWeek);
      }

      const total = filtered.length;
      const healthy = filtered.filter(item => item.isHealthy).length;
      const withered = filtered.filter(item => !item.isHealthy).length;
      const totalMinutes = filtered.reduce((acc, cur) => acc + (cur.minutes || 0), 0);

      const statPlanted = document.getElementById('statTotalPlanted');
      const statTime = document.getElementById('statTotalFocusTime');
      const statThriving = document.getElementById('statThrivingCount');
      const statWithered = document.getElementById('statWitheredCount');

      if (statPlanted) statPlanted.innerText = total;
      if (statTime) {
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        statTime.innerText = h > 0 ? `${h}h ${m}m` : `${m}m`;
      }
      if (statThriving) statThriving.innerText = healthy;
      if (statWithered) statWithered.innerText = withered;

      const container = document.getElementById('forestPlotsContainer');
      if (!container) return;

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

      container.innerHTML = `
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
      const timer = document.querySelector('.timer-focus-card') || document.querySelector('.forest-workspace-grid');
      if (timer) {
        timer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    function filterForest(type) {
      activeForestFilter = type;
      document.getElementById('btnFilterToday')?.classList.toggle('active', type === 'today');
      document.getElementById('btnFilterWeek')?.classList.toggle('active', type === 'week');
      document.getElementById('btnFilterAll')?.classList.toggle('active', type === 'all');
      renderForestPlots();
    }

    // ================= 50 PLANTS CATALOG MODAL =================
    function openPlantsModal() {
      const modal = document.getElementById('catalogModal');
      if (modal) {
        modal.style.display = 'flex';
        renderCatalogList();
      }
    }

    function closePlantsModal() {
      const modal = document.getElementById('catalogModal');
      if (modal) modal.style.display = 'none';
    }

    function closeModalOnBackdrop(e) {
      if (e.target.id === 'catalogModal') {
        closePlantsModal();
      }
    }

    function setCategoryFilter(cat, btn) {
      currentCatalogCategory = cat;
      const parent = btn?.parentElement;
      if (parent) {
        parent.querySelectorAll('.duration-pill').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
      }
      renderCatalogList();
    }

    function filterPlantsCatalog() {
      renderCatalogList();
    }

    function renderCatalogList() {
      const container = document.getElementById('catalogPlantsList');
      if (!container) return;

      const query = (document.getElementById('catalogSearchInput')?.value || '').toLowerCase().trim();
      const plants = window.NEPAL_PLANTS || NEPAL_PLANTS || [];

      const list = plants.filter(plant => {
        const matchesCategory = currentCatalogCategory === 'all' || 
          plant.category.toLowerCase() === currentCatalogCategory.toLowerCase() ||
          (currentCatalogCategory === 'Tree' && plant.id === 4);
        const matchesQuery = !query ||
          plant.nepali.toLowerCase().includes(query) ||
          plant.english.toLowerCase().includes(query) ||
          plant.scientific.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
      });

      container.innerHTML = list.map(plant => {
        const isSel = plant.id === selectedPlantId;
        return `
          <div class="catalog-card-item ${isSel ? 'selected' : ''}" onclick="pickPlant(${plant.id})">
            <div class="catalog-icon">${getBotanicalIconSvg(plant)}</div>
            <div class="catalog-meta">
              <div class="catalog-meta-top">
                <span class="catalog-nepali">${plant.nepali}</span>
                <span class="catalog-badge">${plant.category}</span>
              </div>
              <div class="catalog-english">${plant.english}</div>
              <div class="catalog-scientific">${plant.scientific}</div>
            </div>
          </div>
        `;
      }).join('');
    }

    function pickPlant(id) {
      if (isSessionActive) {
        alert("A focus session is currently active! You can choose a new plant once the session is complete.");
        return;
      }
      selectedPlantId = id;
      try {
        localStorage.setItem('selectedNepalPlantId', id);
      } catch (e) {}
      renderActivePlant();
      closePlantsModal();
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePlantsModal();
        if (document.body.classList.contains('is-fullscreen')) {
          toggleFullscreen();
        }
      }
    });

    // 2-Way Sync: Auto-plant study chart sessions into Nepal Forest
    function syncWatchSessionsToForest(sessions) {
      if (!Array.isArray(sessions) || sessions.length === 0) return;
      let history = [];
      try {
        history = JSON.parse(localStorage.getItem('nepalForestHistory')) || [];
      } catch (e) {
        history = [];
      }

      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const dateKey = now.toISOString().slice(0, 10);
      let updated = false;

      const plant = (typeof getCurrentPlant === 'function')
        ? getCurrentPlant()
        : { id: 4, english: 'Rhododendron', nepali: 'लालीगुराँस', scientific: 'Rhododendron arboreum', category: 'Flower', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><circle cx="12" cy="12" r="3"/><path d="M12 5a3 3 0 0 0-3 3c0 2 3 4 3 4s3-2 3-4a3 3 0 0 0-3-3zM12 19a3 3 0 0 0 3-3c0-2-3-4-3-4s-3 2-3 4a3 3 0 0 0 3 3z"/><path d="M5 12a3 3 0 0 0 3 3c2 0 4-3 4-3s-2-3-4-3a3 3 0 0 0-3 3zM19 12a3 3 0 0 0-3-3c-2 0-4 3-4 3s2 3 4 3a3 3 0 0 0 3-3z"/></svg>' };

      sessions.forEach(sess => {
        if (typeof sess.hrs !== 'number' || sess.hrs <= 0) return;
        const mins = Math.max(1, Math.round(sess.hrs * 60));
        const startHour = Math.floor(sess.start);
        const startMin = Math.round((sess.start % 1) * 60);
        const sessTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMin).getTime() + (mins * 60 * 1000);
        const sessionKey = `${dateKey}_${sess.start.toFixed(2)}_${sess.hrs.toFixed(2)}`;

        const alreadyPlanted = history.some(item => {
          if (item.sessionKey === sessionKey) return true;
          if (item.timestamp >= startOfDay) {
            const timeDiff = Math.abs(item.timestamp - sessTime);
            const minDiff = Math.abs((item.minutes || 0) - mins);
            if (timeDiff <= 15 * 60 * 1000 && minDiff <= 3) return true;
          }
          return false;
        });

        if (!alreadyPlanted) {
          history.push({
            id: plant.id,
            nepali: plant.nepali,
            english: plant.english,
            scientific: plant.scientific,
            category: plant.category,
            icon: plant.icon,
            minutes: mins,
            isHealthy: true,
            timestamp: sessTime,
            sessionKey: sessionKey,
            source: 'charts'
          });
          updated = true;
        }
      });

      if (updated) {
        try {
          localStorage.setItem('nepalForestHistory', JSON.stringify(history));
        } catch (e) {}
        renderForestPlots();
      }
    }

    // Window load initialization
    window.addEventListener('load', () => {
      renderActivePlant();
      renderForestPlots();

      // Auto-restore active session if present from charts/other tabs
      try {
        const active = JSON.parse(localStorage.getItem('activeFocusSession'));
        if (active && active.startTime && !isSessionActive) {
          const elapsed = Math.floor((Date.now() - active.startTime) / 1000);
          if (elapsed < 12 * 3600) {
            sessionStartTime = active.startTime;
            if (active.mode) timerMode = active.mode;
            if (active.durationMinutes) timerDurationMins = active.durationMinutes;
            startOrResumeSession(true);
          } else {
            localStorage.removeItem('activeFocusSession');
          }
        }
      } catch (e) {}

      // Sync sessions from study charts / Google Sheets backend
      fetch(`${WEB_APP_URL}?action=getWatchData&_t=${Date.now()}`)
        .then(res => res.json())
        .then(sessions => syncWatchSessionsToForest(sessions))
        .catch(() => {});
    });

    // Cross-tab synchronization
    window.addEventListener('storage', (e) => {
      if (e.key === 'activeFocusSession') {
        if (!e.newValue && isSessionActive) {
          clearInterval(sessionTimerInterval);
          sessionTimerInterval = null;
          isSessionActive = false;
          sessionStartTime = null;
          sessionTargetEndTime = null;
          renderTimerDisplay(false);
          renderForestPlots();
          const btnStart = document.getElementById('btnStartForestSession');
          const btnCompleteOpen = document.getElementById('btnCompleteOpenSession');
          const btnGiveUp = document.getElementById('btnGiveUpForestSession');
          if (btnStart) btnStart.style.display = 'inline-flex';
          if (btnCompleteOpen) btnCompleteOpen.style.display = 'none';
          if (btnGiveUp) btnGiveUp.style.display = 'none';
        } else if (e.newValue && !isSessionActive) {
          try {
            const active = JSON.parse(e.newValue);
            if (active && active.startTime) {
              sessionStartTime = active.startTime;
              if (active.mode) timerMode = active.mode;
              if (active.durationMinutes) timerDurationMins = active.durationMinutes;
              startOrResumeSession(true);
            }
          } catch (err) {}
        }
      } else if (e.key === 'nepalForestHistory') {
        renderForestPlots();
      }
    });

    // Synchronize timer immediately when returning from other apps or tabs
    document.addEventListener('visibilitychange', () => {
      if (isSessionActive && !document.hidden) {
        syncForestTimer();
      }
    });
    window.addEventListener('focus', () => {
      if (isSessionActive) {
        syncForestTimer();
      }
    });
    window.addEventListener('pageshow', () => {
      if (isSessionActive) {
        syncForestTimer();
      }
    });
