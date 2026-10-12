function formatHours(decimalHours) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours % 1) * 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
    // ============= INDEXEDDB SETUP =============
    var WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwXOTn__dyqNI-8JvsTPEGtC4OPJYuC9-_jqIlq-lutQZDeQzlmM-46XwWAmWYQu8mT/exec";
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
      fetch(`${WEB_APP_URL}?view=Daily`).then(res => res.json()).then(newData => {
        saveToIndexedDB('dailyData', newData);
        loadChart('Daily', 'chart_div_daily', newData);
      }).catch(err => { if (!cachedData) document.getElementById('chart_div_daily').innerHTML = 'Error loading chart'; });
    }

    async function loadChartWeeklyWithCache() {
      const cachedData = await getFromIndexedDB('weeklyData');
      if (cachedData) { loadChart('Weekly', 'chart_div_weekly', cachedData); }
      fetch(`${WEB_APP_URL}?view=Weekly`).then(res => res.json()).then(newData => {
        saveToIndexedDB('weeklyData', newData);
        loadChart('Weekly', 'chart_div_weekly', newData);
      }).catch(err => { if (!cachedData) document.getElementById('chart_div_weekly').innerHTML = 'Error loading chart'; });
    }

    async function loadChartMonthlyWithCache() {
      const cachedData = await getFromIndexedDB('monthlyData');
      if (cachedData) { loadChart('Monthly', 'chart_div_monthly', cachedData); }
      fetch(`${WEB_APP_URL}?view=Monthly`).then(res => res.json()).then(newData => {
        saveToIndexedDB('monthlyData', newData);
        loadChart('Monthly', 'chart_div_monthly', newData);
      }).catch(err => { if (!cachedData) document.getElementById('chart_div_monthly').innerHTML = 'Error loading chart'; });
    }

    async function load24HourWatchWithCache() {
      const cachedData = await getFromIndexedDB('watchData');
      if (cachedData) { updateWatchDisplay(cachedData); }
      fetch(`${WEB_APP_URL}?action=getWatchData&_t=${Date.now()}`).then(res => res.json()).then(newData => {
        saveToIndexedDB('watchData', newData);
        updateWatchDisplay(newData);
        loadMasterChronometer();
      }).catch(err => console.error("Watch error:", err));
    }

    async function loadPlannerWithCache() {
      const cachedData = await getFromIndexedDB('plannerData');
      if (cachedData) { displayPlannerTable(cachedData); }
      fetch(`${WEB_APP_URL}?action=getPlannerData`).then(res => res.json()).then(newData => {
        saveToIndexedDB('plannerData', newData);
        displayPlannerTable(newData);
      }).catch(err => { if (!cachedData) document.getElementById('gridWrapper').innerHTML = `<div style="text-align: center; padding: 20px; color: var(--danger);">Error loading planner</div>`; });
    }

    // ============= DISPLAY FUNCTIONS (NO CHANGES) =============

    function updateWatchDisplay(sessions) {
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

      // 2-Way Sync: Auto-plant study chart sessions into Nepal Forest
      syncWatchSessionsToForest(sessions);
    }

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

      const plant = (typeof getSelectedPlant === 'function')
        ? getSelectedPlant()
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
        if (typeof renderMyForest === 'function') {
          renderMyForest();
        }
      }
    }

    function displayPlannerTable(data) {
      if (!Array.isArray(data) || data.length === 0) {
        document.getElementById('gridWrapper').innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-tertiary); font-size: 11px;">No schedule data</div>';
        return;
      }
      const last7Days = data.slice(-7);
      const tableData = last7Days.map((row) => {
        const dateStr = row[0];
        const dayOfWeek = new Date(dateStr + ' 2026').toLocaleDateString('en-US', { weekday: 'short' });
        let sessionCount = 0, totalStudyHours = 0;
        for (let j = 1; j < row.length; j += 3) { const hours = row[j]; if (typeof hours === 'number' && hours > 0) { sessionCount++; totalStudyHours += hours; } }
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

