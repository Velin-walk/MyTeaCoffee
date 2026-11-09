    // ============= ORIGINAL CODE (UNCHANGED) =============

    function getThemeColors() {
      const style = getComputedStyle(document.body);
      return {
        primary: style.getPropertyValue('--primary').trim(),
        success: style.getPropertyValue('--success').trim(),
        danger: style.getPropertyValue('--danger').trim(),
        warning: style.getPropertyValue('--warning').trim(),
        calEvent: style.getPropertyValue('--cal-event').trim(),
        studyEvent: style.getPropertyValue('--study-event').trim(),
      };
    }

    function isGoogleChartsFullyLoaded() {
      return typeof google !== 'undefined' &&
             typeof google.visualization !== 'undefined' &&
             typeof google.visualization.arrayToDataTable === 'function' &&
             typeof google.visualization.ColumnChart === 'function' &&
             typeof google.visualization.LineChart === 'function' &&
             typeof google.visualization.AreaChart === 'function' &&
             typeof google.visualization.ScatterChart === 'function';
    }

    const _googleChartsReadyQueue = [];
    let _isGoogleChartsInitializing = false;

    function flushGoogleChartsQueue() {
      if (!isGoogleChartsFullyLoaded()) return;
      while (_googleChartsReadyQueue.length > 0) {
        const cb = _googleChartsReadyQueue.shift();
        try { cb(); } catch (err) { console.error("Google Charts callback error:", err); }
      }
    }

    function initGoogleChartsLoader() {
      if (isGoogleChartsFullyLoaded()) {
        flushGoogleChartsQueue();
        return;
      }
      if (typeof google !== 'undefined' && google.charts && typeof google.charts.load === 'function') {
        if (!_isGoogleChartsInitializing) {
          _isGoogleChartsInitializing = true;
          try {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(() => {
              const checkInterval = setInterval(() => {
                if (isGoogleChartsFullyLoaded()) {
                  clearInterval(checkInterval);
                  flushGoogleChartsQueue();
                }
              }, 30);
              setTimeout(() => {
                clearInterval(checkInterval);
                if (isGoogleChartsFullyLoaded()) flushGoogleChartsQueue();
              }, 5000);
            });
          } catch (e) {
            console.warn("Google Charts load error:", e);
          }
        }
      } else {
        window.addEventListener('load', initGoogleChartsLoader, { once: true });
      }
    }

    // Initialize Google Charts loader early
    initGoogleChartsLoader();

    function whenGoogleChartsLoaded(callback) {
      if (isGoogleChartsFullyLoaded()) {
        callback();
      } else {
        _googleChartsReadyQueue.push(callback);
        initGoogleChartsLoader();
      }
    }

    function changeTheme(themeName, reloadCharts = true) {
      document.body.classList.remove('theme-paper', 'theme-blackboard', 'theme-galaxy', 'theme-forest', 'theme-cyberpunk', 'theme-ocean', 'theme-sketch');
      if (themeName !== 'default') { document.body.classList.add(themeName); }
      localStorage.setItem('selectedTheme', themeName);
      if (reloadCharts) {
        whenGoogleChartsLoaded(() => {
          setTimeout(() => {
            loadChartDailyWithCache(); loadChartWeeklyWithCache(); loadChartMonthlyWithCache();
            loadHourlyDist(); loadMountain(); loadScatter();
            loadMasterChronometer(); loadDailyProgressChart();
          }, 100);
        });
      }
    }

    function saveGoal() {
      const newGoal = parseFloat(document.getElementById('goalInput').value);
      if (newGoal <= 0) { alert('Goal must be greater than 0'); return; }
      fetch(WEB_APP_URL, {
        method: "POST", mode: "no-cors",
        body: JSON.stringify({ action: "setGoal", goal: newGoal })
      }).then(() => {
        load24HourWatchWithCache();
        loadMasterChronometer();
        generateSchedule();
        alert('Goal updated to ' + newGoal + ' hours!');
      });
    }

    window.onload = async function() {
      const savedTheme = localStorage.getItem('selectedTheme') || 'default';
      document.getElementById('themeSelect').value = savedTheme;
      changeTheme(savedTheme, false);

      // Initialize IndexedDB
      await initIndexedDB().catch(err => console.error('Failed to init IndexedDB:', err));

      fetch(`${WEB_APP_URL}?action=getGoal`).then(res => res.json()).then(data => {
        document.getElementById('goalInput').value = data.goal;
      }).catch(() => null);
      
      fetch(`${WEB_APP_URL}?action=getState`).then(res => res.json()).then(props => restoreSessions(props)).catch(() => null);
      
      whenGoogleChartsLoaded(async () => {
        loadChartDailyWithCache(); loadChartWeeklyWithCache(); loadChartMonthlyWithCache(); loadCalendarData(); loadHourlyDist();
        load24HourWatchWithCache(); loadMountain(); loadScatter(); loadMasterChronometer();
        loadActualStudySessions(); loadDailyProgressChart(); loadWeeklySessionsChart(); 
        loadActiveHoursChart();
      });
      loadPlannerWithCache();
      setDefaultEndTime();
      updateRealTimeClock();
      initCardControls();
      loadActiveHoursChart(); // Add with other chart updates
    };

    function restoreSessions(props) {
      // Do not override if an active session (such as Fixed countdown) was already restored or started locally
      if (typeof isForestRunning !== 'undefined' && isForestRunning) return;
      if (!props || !props.Open_startTime) return;

      const serverStart = parseInt(props.Open_startTime, 10);
      if (isNaN(serverStart) || serverStart <= 0) return;

      // 12-hour expiration cap to prevent resurrecting stale multi-day timers and mass-planting
      const elapsed = (Date.now() - serverStart) / 1000;
      if (elapsed < 0 || elapsed > 12 * 3600) {
        return;
      }

      openStartTime = serverStart;
      if (typeof startOpen === 'function') {
        startOpen(true);
      }
    }



    function loadChartDaily() { loadChart('Daily', 'chart_div_daily'); }
    function loadChartWeekly() { loadChart('Weekly', 'chart_div_weekly'); }
    function loadChartMonthly() { loadChart('Monthly', 'chart_div_monthly'); }

    function loadChart(view, chartDivId, cachedData = null) {
      const fetchView = (view === 'Weekly' || view === 'Daily') ? 'Daily' : view;
      const themeColors = getThemeColors();
     
      const processChart = (rawData) => {
        if (!rawData || rawData.length <= 1) { 
          const el = document.getElementById(chartDivId);
          if (el) el.innerHTML = "No logs."; 
          return; 
        }
        if (!isGoogleChartsFullyLoaded()) {
          whenGoogleChartsLoaded(() => processChart(rawData));
          return;
        }
        let finalData = [];
        let globalMax = 0;
     
        if (view === 'Daily') {
          const today = new Date();
          const todayKey = today.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
          let todayRow = rawData.find(row => row[0] === todayKey);
          if (!todayRow) { document.getElementById(chartDivId).innerHTML = "No sessions today."; return; }
          
          finalData.push(['Session', 'Hours', { role: 'style' }, { role: 'annotation' }]);
          let sessionCount = 1;
          for (let j = 1; j < todayRow.length; j += 3) {
            let hrs = todayRow[j];
            let color = todayRow[j + 1];
            if (typeof hrs === 'number' && hrs > 0 && typeof color === 'string' && color.startsWith('#')) {
              let mins = Math.round(hrs * 60);
              finalData.push(['S' + sessionCount, hrs, `color: ${color}; fill-opacity: 0.8`, Math.floor(mins/60) + "h " + (mins%60) + "m"]);
              if (hrs > globalMax) globalMax = hrs;
              sessionCount++;
            }
          }
          const chartData = google.visualization.arrayToDataTable(finalData);
          const options = {
            legend: 'none', backgroundColor: 'transparent', chartArea: { width: '95%', height: '85%', top: 10, bottom: 25 },
            bar: { groupWidth: '70%' }, vAxis: { gridlines: { color: 'transparent' }, baselineColor: themeColors.primary, viewWindow: { min: 0, max: globalMax > 0 ? (globalMax * 1.1) : 1 }, textPosition: 'none' },
            hAxis: { textStyle: { fontSize: 8, color: themeColors.primary }, baselineColor: 'transparent', gridlines: { color: 'transparent' } },
            annotations: { alwaysOutside: true, textStyle: { fontSize: 10, bold: true, color: themeColors.primary }, stem: { color: 'transparent', length: 0 } },
            animation: { startup: true, duration: 600, easing: 'out' }
          };
          new google.visualization.ColumnChart(document.getElementById(chartDivId)).draw(chartData, options);
        } 
        else if (view === 'Weekly') {
          // Map logged rows by date string (e.g. "Nov 08")
          const rowMap = new Map();
          for (let i = 1; i < rawData.length; i++) {
            if (rawData[i] && rawData[i][0]) rowMap.set(rawData[i][0], rawData[i]);
          }

          // Build last 7 calendar days ending today
          const last7CalendarDates = [];
          const now = new Date();
          for (let d = 6; d >= 0; d--) {
            const dt = new Date(now);
            dt.setDate(now.getDate() - d);
            last7CalendarDates.push(dt.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }));
          }

          // Build header without mutating rawData[0]
          const header = [rawData[0][0], "Base", { role: "style" }, { role: "tooltip" }, ...rawData[0].slice(1), { role: "annotation" }];
          const data = [header];

          last7CalendarDates.forEach(dateStr => {
            const existingRow = rowMap.get(dateStr);
            let dailyTotal = 0;
            const sessionCols = [];

            if (existingRow) {
              for (let j = 1; j < existingRow.length; j += 3) {
                const hrs = existingRow[j];
                const style = existingRow[j + 1];
                const tip = existingRow[j + 2];
                if (typeof hrs === 'number') dailyTotal += hrs;
                sessionCols.push(hrs !== undefined ? hrs : 0);
                sessionCols.push(style || '');
                sessionCols.push(tip || '');
              }
            } else {
              for (let j = 1; j < rawData[0].length; j += 3) {
                sessionCols.push(0, '', '');
              }
            }

            if (dailyTotal > globalMax) globalMax = dailyTotal;
            const tm = Math.round(dailyTotal * 60);
            const annotation = dailyTotal > 0 ? (Math.floor(tm / 60) + "h " + (tm % 60) + "m") : "";

            data.push([
              dateStr,
              0.05, 'none', '', // Base spacer
              ...sessionCols,
              annotation
            ]);
          });

          const chartData = google.visualization.arrayToDataTable(data);
          const options = {
            isStacked: true, legend: 'none', backgroundColor: 'transparent', chartArea: { width: '95%', height: '85%', top: 10, bottom: 25 },
            bar: { groupWidth: '70%' }, vAxis: { gridlines: { color: 'transparent' }, baselineColor: themeColors.primary, viewWindow: { min: 0, max: globalMax > 0 ? (globalMax * 1.1) : 1 }, textPosition: 'none' },
            hAxis: { textStyle: { fontSize: 8, color: themeColors.primary }, baselineColor: 'transparent', gridlines: { color: 'transparent' } },
            annotations: { alwaysOutside: true, textStyle: { fontSize: 10, bold: true, color: themeColors.primary }, stem: { color: 'transparent', length: 0 } },
            animation: { startup: true, duration: 600, easing: 'out' }
          };
          new google.visualization.ColumnChart(document.getElementById(chartDivId)).draw(chartData, options);
        } 
        else if (view === 'Monthly') {
          const last30Days = rawData.slice(-31).slice(1);
          finalData.push(['Date', 'Hours', { role: 'style' }]);
          last30Days.forEach((row) => {
            const dateStr = row[0];
            let dailyTotal = 0;
            for (let j = 1; j < row.length; j += 3) { if (typeof row[j] === 'number') dailyTotal += row[j]; }
            const color = dailyTotal >= 6 ? themeColors.success : themeColors.danger;
            finalData.push([dateStr, dailyTotal, `color: ${color}`]);
            if (dailyTotal > globalMax) globalMax = dailyTotal;
          });
          const chartData = google.visualization.arrayToDataTable(finalData);
          const options = {
            legend: 'none', backgroundColor: 'transparent', chartArea: { width: '90%', height: '80%', top: 15, bottom: 30 },
            pointSize: 5, lineWidth: 2, curveType: 'linear',
            vAxis: { gridlines: { color: 'rgba(0,0,0,0.05)' }, minorGridlines: { color: 'transparent' }, baselineColor: 'transparent', viewWindow: { min: 0, max: globalMax > 0 ? (globalMax * 1.15) : 10 }, textStyle: { fontSize: 8, color: themeColors.text } },
            hAxis: { textStyle: { fontSize: 8, color: themeColors.primary }, showTextEvery: Math.ceil(last30Days.length / 6), gridlines: { color: 'transparent' }, baselineColor: 'transparent' },
            series: { 0: { color: themeColors.warning, lineWidth: 1.5 } },
            animation: { startup: true, duration: 800, easing: 'out' }
          };
          new google.visualization.LineChart(document.getElementById(chartDivId)).draw(chartData, options);
        }
      };

      if (cachedData) {
        processChart(cachedData);
      } else {
        fetch(`${WEB_APP_URL}?view=${fetchView}`).then(res => res.json()).then(processChart).catch(err => {
          console.error('Chart error:', err);
          document.getElementById(chartDivId).innerHTML = 'Error loading chart';
        });
      }
    }

var calendarStats = {};

function getDayHoursFromStats(dateObj) {
  const y = dateObj.getFullYear();
  const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const d = dateObj.getDate().toString().padStart(2, '0');
  const fullKey = `${y}-${m}-${d}`;
  const legacyKey = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  if (calendarStats[fullKey] !== undefined) return calendarStats[fullKey];
  if (calendarStats[legacyKey] !== undefined) return calendarStats[legacyKey];
  return 0;
}

async function loadCalendarData() {
  try {
    const allData = await fetch(`${WEB_APP_URL}?view=Daily`).then(res => res.json());
    if (!allData || !Array.isArray(allData) || allData.length <= 1) return;

    calendarStats = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    const years = new Set([currentYear]);

    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      const rawDateStr = row[0];
      if (!rawDateStr) continue;

      const parsedDate = (typeof parseSessionDate === 'function')
        ? parseSessionDate(rawDateStr)
        : (/\b\d{4}\b/.test(rawDateStr) ? new Date(rawDateStr) : new Date(rawDateStr + ' ' + currentYear));

      const parsedYear = parsedDate.getFullYear();
      if (!isNaN(parsedYear)) years.add(parsedYear);

      let dailyTotal = 0;
      for (let j = 1; j < row.length; j += 3) {
        if (typeof row[j] === 'number') dailyTotal += row[j];
      }

      const y = parsedDate.getFullYear();
      const m = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const d = parsedDate.getDate().toString().padStart(2, '0');
      const fullKey = `${y}-${m}-${d}`;
      calendarStats[fullKey] = dailyTotal;
      calendarStats[rawDateStr] = dailyTotal;
    }

    // Populate year dropdown dynamically with current and recorded years
    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
      yearSelect.innerHTML = '';
      Array.from(years).sort().reverse().forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });
      yearSelect.value = currentYear;
    }

    const monthSelect = document.getElementById('monthSelect');
    if (monthSelect) {
      monthSelect.value = now.getMonth();
    }

    updateCalendar();
  } catch (error) {
    console.error('Calendar error:', error);
  }
}

function updateCalendar() {
  const monthSelect = document.getElementById('monthSelect');
  const yearSelect = document.getElementById('yearSelect');
  if (!monthSelect || !yearSelect) return;

  const month = parseInt(monthSelect.value, 10);
  const year = parseInt(yearSelect.value, 10);

  const container = document.getElementById('calendarContainer');
  if (!container) return;
  container.innerHTML = '';

  // Add day headers
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach(day => {
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerText = day;
    container.appendChild(header);
  });

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day empty';
    container.appendChild(emptyCell);
  }

  // Add day cells
  const now = new Date();
  const isCurrentMonthAndYear = (now.getFullYear() === year && now.getMonth() === month);
  const currentDayNum = now.getDate();

  let totalHours = 0, daysWithData = 0;
  let longestStreak = 0, tempStreak = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const yStr = year.toString();
    const mStr = (month + 1).toString().padStart(2, '0');
    const dStr = day.toString().padStart(2, '0');
    const fullKey = `${yStr}-${mStr}-${dStr}`;
    const legacyKey = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    const h = calendarStats[fullKey] !== undefined ? calendarStats[fullKey] : (calendarStats[legacyKey] || 0);

    let lvl = h > 5 ? 4 : h > 3 ? 3 : h > 1 ? 2 : h > 0 ? 1 : 0;

    const hours = Math.floor(h);
    const minutes = Math.round((h % 1) * 60);
    const timeStr = h > 0 ? `${hours}h<br>${minutes}m` : '';

    const cell = document.createElement('div');
    cell.className = `calendar-day lvl-${lvl}`;
    if (isCurrentMonthAndYear && day === currentDayNum) {
      cell.classList.add('today');
    }
    cell.innerHTML = `<div class="calendar-day-number">${day}</div><div class="calendar-day-hours">${timeStr}</div>`;
    cell.title = `${legacyKey}: ${h > 0 ? hours + 'h ' + minutes + 'm' : '0h'}`;

    if (h > 0) {
      totalHours += h;
      daysWithData++;
    }

    // Longest streak tracks all days that have already occurred
    const hasDayOccurred = !isCurrentMonthAndYear || (day <= currentDayNum);
    if (hasDayOccurred) {
      if (h > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    container.appendChild(cell);
  }

  // Calculate current streak accurately backwards from today
  let currentStreak = 0;
  const walkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayHours = getDayHoursFromStats(walkDate);

  if (todayHours > 0) {
    currentStreak = 1;
    walkDate.setDate(walkDate.getDate() - 1);
    while (getDayHoursFromStats(walkDate) > 0) {
      currentStreak++;
      walkDate.setDate(walkDate.getDate() - 1);
    }
  } else {
    // If not studied yet today, check if yesterday was studied (streak is still alive today)
    walkDate.setDate(walkDate.getDate() - 1);
    while (getDayHoursFromStats(walkDate) > 0) {
      currentStreak++;
      walkDate.setDate(walkDate.getDate() - 1);
    }
  }

  // Update stats
  const avgDaily = daysWithData > 0 ? (totalHours / daysWithData).toFixed(1) : '0';
  const statAvg = document.getElementById('statAvg');
  const statStreak = document.getElementById('statStreak');
  const statLongest = document.getElementById('statLongest');
  if (statAvg) statAvg.innerText = avgDaily + 'h';
  if (statStreak) statStreak.innerText = currentStreak + 'd';
  if (statLongest) statLongest.innerText = longestStreak + 'd';
}

function loadHourlyDist() {
      fetch(`${WEB_APP_URL}?action=getHourlyDistribution`).then(res => res.json()).then(data => {
        if (!data || data.length <= 1) return;
        whenGoogleChartsLoaded(() => {
          const themeColors = getThemeColors();
          const el = document.getElementById('hourly_dist_chart');
          if (!el) return;
          new google.visualization.AreaChart(el).draw(google.visualization.arrayToDataTable(data), {
            curveType: 'function', legend: 'none', colors: [themeColors.warning], areaOpacity: 0.1, backgroundColor: 'transparent',
            chartArea: { width: '90%', height: '80%' }, vAxis: { textPosition: 'none', gridlines: { color: 'transparent' } },
            hAxis: { textStyle: { fontSize: 8, color: themeColors.warning }, showTextEvery: 6 }
          });
        });
      });
    }

    function loadMountain() {
      fetch(`${WEB_APP_URL}?action=getMountainData`).then(res => res.json()).then(data => {
        if (!data || data.length <= 1) return;
        whenGoogleChartsLoaded(() => {
          const themeColors = getThemeColors();
          const el = document.getElementById('mountain_chart');
          if (!el) return;
          new google.visualization.AreaChart(el).draw(google.visualization.arrayToDataTable(data), {
            legend:'none', colors:[themeColors.primary], areaOpacity:0.05, chartArea:{width:'90%', height:'80%'},
            vAxis:{textPosition:'none', gridlines:{color:'transparent'}}, hAxis:{textPosition:'none'}
          });
        });
      });
    }

    function loadScatter() {
      fetch(`${WEB_APP_URL}?action=getScatterData`).then(res => res.json()).then(data => {
        if (!data || data.length <= 1) return;
        whenGoogleChartsLoaded(() => {
          const themeColors = getThemeColors();
          const el = document.getElementById('scatter_chart');
          if (!el) return;
          new google.visualization.ScatterChart(el).draw(google.visualization.arrayToDataTable(data), {
            legend:'none', colors:[themeColors.danger], chartArea:{width:'80%', height:'70%'},
            hAxis:{title:'Planned', titleTextStyle:{fontSize:8}}, vAxis:{title:'Actual', titleTextStyle:{fontSize:8}}
          });
        });
      });
    }

    function toggleButtons(group, isRunning) {
      document.getElementById('start' + group).disabled = isRunning;
    }

    function fmt(s, hrs = false) {
      if (s < 0) s = 0; 
      let h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sc = s % 60;
      let res = `${m.toString().padStart(2, '0')}:${sc.toString().padStart(2, '0')}`;
      return hrs ? `${h.toString().padStart(2, '0')}:${res}` : res;
    }

    function setDefaultEndTime() {
      const now = new Date();
      const endTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
      const hours = String(endTime.getHours()).padStart(2, '0');
      const minutes = String(endTime.getMinutes()).padStart(2, '0');
      document.getElementById('endTimeInput').value = `${hours}:${minutes}`;
      generateSchedule();
    }

    function recommendSessions(hoursRemaining) {
      let sessionCount, studyDuration, breakDuration;
      if (hoursRemaining < 1) { sessionCount = 1; studyDuration = hoursRemaining; breakDuration = 0; } 
      else if (hoursRemaining < 2) { sessionCount = 2; studyDuration = hoursRemaining / 2; breakDuration = 0.25; } 
      else if (hoursRemaining < 4) { sessionCount = 3; studyDuration = hoursRemaining / 3; breakDuration = (hoursRemaining < 3) ? 0.25 : 0.33; } 
      else if (hoursRemaining < 6) { sessionCount = 4; studyDuration = hoursRemaining / 4; breakDuration = 0.33; } 
      else { sessionCount = 5; studyDuration = hoursRemaining / 5; breakDuration = 0.42; }
      return { sessionCount, studyDuration, breakDuration };
    }

    function generateSchedule() {
      const endTimeInput = document.getElementById('endTimeInput').value;
      if (!endTimeInput) {
        document.getElementById('scheduleContainer').innerHTML = '<div style="text-align: center; color: var(--text-tertiary); font-size: 12px; padding: 20px;">Set an end time to generate schedule</div>';
        return;
      }
      fetch(`${WEB_APP_URL}?action=getGoalData`).then(res => res.json()).then(data => {
        const dailyGoal = data.goal;
        const currentStudied = data.current;
        const hoursRemaining = Math.max(0, dailyGoal - currentStudied);
        const now = new Date();
        const [endHour, endMin] = endTimeInput.split(':').map(Number);
        let endTime = new Date(now);
        endTime.setHours(endHour, endMin, 0);
        if (endTime < now) endTime.setDate(endTime.getDate() + 1);
        const timeAvailableMs = endTime - now;
        const timeAvailableHours = timeAvailableMs / (1000 * 60 * 60);
        const recommendation = recommendSessions(hoursRemaining);
        let { sessionCount, studyDuration } = recommendation;
        let breakDuration = recommendation.breakDuration;
        const totalTimeWithBreaks = (studyDuration * sessionCount) + (breakDuration * (sessionCount - 1));
        const totalTimeWithoutBreaks = studyDuration * sessionCount;
        let isFeasible = true, breaksRemoved = false, finalEndTime = new Date(endTime);
        if (totalTimeWithBreaks > timeAvailableHours) {
          if (totalTimeWithoutBreaks <= timeAvailableHours) { breakDuration = 0; breaksRemoved = true; } 
          else {
            const additionalTimeNeeded = totalTimeWithoutBreaks - timeAvailableHours;
            finalEndTime = new Date(endTime.getTime() + (additionalTimeNeeded * 60 * 60 * 1000));
            breakDuration = 0; breaksRemoved = true;
          }
        }
        const schedule = [];
        let currentTime = new Date(now);
        for (let i = 0; i < sessionCount; i++) {
          schedule.push({ type: 'study', start: new Date(currentTime), duration: studyDuration, label: `Study ${i + 1}` });
          currentTime.setHours(currentTime.getHours() + Math.floor(studyDuration));
          currentTime.setMinutes(currentTime.getMinutes() + Math.round((studyDuration % 1) * 60));
          if (i < sessionCount - 1 && breakDuration > 0) {
            schedule.push({ type: 'break', start: new Date(currentTime), duration: breakDuration, label: `Break` });
            currentTime.setHours(currentTime.getHours() + Math.floor(breakDuration));
            currentTime.setMinutes(currentTime.getMinutes() + Math.round((breakDuration % 1) * 60));
          }
        }
        const scheduleEndsAt = new Date(currentTime);
        const bufferMs = finalEndTime - scheduleEndsAt;
        const bufferMinutes = Math.round(bufferMs / (1000 * 60));
        const isTight = bufferMinutes < 30;
        const endTimeExtended = finalEndTime > endTime;
        renderSchedule(schedule, hoursRemaining, sessionCount, studyDuration, breakDuration, isFeasible, isTight, bufferMinutes, now, finalEndTime, breaksRemoved, endTimeExtended);
      }).catch(err => {
        document.getElementById('scheduleContainer').innerHTML = '<div style="text-align: center; color: var(--danger); font-size: 12px; padding: 20px;">Error loading goal data</div>';
      });
    }

    function renderSchedule(schedule, hoursRemaining, sessionCount, studyDuration, breakDuration, isFeasible, isTight, bufferMinutes, startTime, endTime, breaksRemoved, endTimeExtended) {
      let html = `<div class="schedule-info"><strong>${hoursRemaining.toFixed(1)}h</strong> remaining to meet your ${(parseFloat(document.getElementById('goalInput').value)).toFixed(1)}h goal<br><strong>Recommended:</strong> ${sessionCount} sessions</div>`;
      if (breaksRemoved && !endTimeExtended) {
        html += `<div style="background: var(--input-bg); border-left: 4px solid var(--warning); padding: 10px; border-radius: 6px; margin-bottom: 12px; font-size: 12px; color: var(--warning); display:flex; align-items:center; gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> <span><strong>Breaks removed</strong> to fit goal within end time</span></div>`;
      }
      if (endTimeExtended) {
        html += `<div style="background: var(--input-bg); border-left: 4px solid var(--danger); padding: 10px; border-radius: 6px; margin-bottom: 12px; font-size: 12px; color: var(--danger); display:flex; align-items:center; gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> <span><strong>End time extended</strong> — goal requires more time even with 0 breaks</span></div>`;
      }
      let currentTime = new Date(startTime);
      let sessionNum = 1, i = 0;
      while (i < schedule.length) {
        const item = schedule[i];
        if (item.type === 'study') {
          const studyHours = Math.floor(item.duration);
          const studyMinutes = Math.round((item.duration % 1) * 60);
          const studyDurationStr = studyHours > 0 ? `${studyHours}h ${studyMinutes}m` : `${studyMinutes}m`;
          const startStr = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
          html += `<div class="schedule-row">`;
          html += `<span style="font-weight: 600; color: var(--primary); min-width: 60px;">${startStr}</span>`;
          html += `<span class="schedule-block schedule-study">Study ${sessionNum}</span>`;
          html += `<span style="color: var(--text-secondary);">${studyDurationStr}</span>`;
          if (i + 1 < schedule.length && schedule[i + 1].type === 'break') {
            const breakItem = schedule[i + 1];
            const breakHours = Math.floor(breakItem.duration);
            const breakMinutes = Math.round((breakItem.duration % 1) * 60);
            const breakDurationStr = breakHours > 0 ? `${breakHours}h ${breakMinutes}m` : `${breakMinutes}m`;
            html += `<span style="color: var(--text-tertiary); margin: 0 4px;">→</span>`;
            html += `<span class="schedule-block schedule-break">Break</span>`;
            html += `<span style="color: var(--text-tertiary);">${breakDurationStr}</span>`;
            const breakEndTime = new Date(currentTime);
            breakEndTime.setHours(breakEndTime.getHours() + studyHours + breakHours);
            breakEndTime.setMinutes(breakEndTime.getMinutes() + studyMinutes + breakMinutes);
            currentTime = new Date(breakEndTime);
            i += 2;
          } else {
            const studyEndTime = new Date(currentTime);
            studyEndTime.setHours(studyEndTime.getHours() + studyHours);
            studyEndTime.setMinutes(studyEndTime.getMinutes() + studyMinutes);
            currentTime = new Date(studyEndTime);
            i++;
          }
          html += `</div>`;
          sessionNum++;
        } else { i++; }
      }
      if (isFeasible) {
        const badgeClass = isTight ? 'feasibility-warning' : 'feasibility-good';
        const badgeText = isTight ? `Tight schedule (${bufferMinutes}m buffer)` : `Achievable (${bufferMinutes}m buffer)`;
        html += `<div class="feasibility-badge ${badgeClass}">${badgeText}</div>`;
      } else {
        html += `<div class="feasibility-badge feasibility-bad" style="display:inline-flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Not achievable in time</div>`;
      }
      html += `<p style="font-size: 11px; color: var(--text-tertiary); margin-top: 12px; text-align: center; display:flex; align-items:center; justify-content:center; gap:6px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z"/></svg> Based on ultradian rhythm & focus cycles</p>`;
      document.getElementById('scheduleContainer').innerHTML = html;
    }

    function loadMasterChronometer() {
      const temporalRing = document.getElementById('masterTemporalRing');
      const goalRing = document.getElementById('masterGoalRing');
      const themeColors = getThemeColors();
      const colors = [themeColors.primary, themeColors.success, themeColors.danger, themeColors.warning, '#8B4513', themeColors.calEvent];
      const timestamp = Date.now();
      Promise.all([
        fetch(`${WEB_APP_URL}?action=getWatchData&_t=${timestamp}`).then(res => res.json()),
        fetch(`${WEB_APP_URL}?action=getGoalData&_t=${timestamp}`).then(res => res.json())
      ]).then(([rawSessions, goalData]) => {
        const sessions = (typeof mergeContinuousSessions === 'function')
          ? mergeContinuousSessions(rawSessions)
          : (Array.isArray(rawSessions) ? rawSessions : []);
        if (temporalRing) temporalRing.innerHTML = ''; 
        if (goalRing) goalRing.innerHTML = '';
        const dailyGoal = (goalData && goalData.goal) || 4;
        let totalStudyH = 0, totalBreakM = 0, totalRestH = 0;
        const getArc = (sVal, dVal, tVal, outR, innR) => {
          if (tVal <= 0 || dVal <= 0) return '';
          // Avoid 360-degree SVG degenerate arc where start == end point produces 0 length
          const clampedD = Math.min(dVal, tVal * 0.9999);
          const sA = (sVal / tVal) * 360 - 90;
          const eA = ((sVal + clampedD) / tVal) * 360 - 90;
          const sR = (sA * Math.PI) / 180, eR = (eA * Math.PI) / 180;
          const large = (clampedD / tVal) > 0.5 ? 1 : 0;
          return `M ${150+outR*Math.cos(sR)} ${150+outR*Math.sin(sR)} A ${outR} ${outR} 0 ${large} 1 ${150+outR*Math.cos(eR)} ${150+outR*Math.sin(eR)} L ${150+innR*Math.cos(eR)} ${150+innR*Math.sin(eR)} A ${innR} ${innR} 0 ${large} 0 ${150+innR*Math.cos(sR)} ${150+innR*Math.sin(sR)} Z`;
        };
        if (Array.isArray(sessions) && sessions.length > 0) {
          sessions.sort((a, b) => a.start - b.start);
          let cumulativeHrs = 0;
          sessions.forEach((sess, idx) => {
            totalStudyH += sess.hrs;
            const sessionColor = colors[idx % colors.length];

            // 1. 24-Hour Temporal Ring (handle crossing midnight if start + hrs > 24)
            if (sess.start + sess.hrs > 24) {
              const beforeMidnight = 24 - sess.start;
              const afterMidnight = (sess.start + sess.hrs) - 24;
              if (beforeMidnight > 0) {
                const tPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                tPath1.setAttribute('d', getArc(sess.start, beforeMidnight, 24, 140, 105.5));
                tPath1.setAttribute('fill', sessionColor);
                tPath1.setAttribute('stroke', 'white');
                tPath1.setAttribute('stroke-width', '0.5');
                if (temporalRing) temporalRing.appendChild(tPath1);
              }
              if (afterMidnight > 0) {
                const tPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                tPath2.setAttribute('d', getArc(0, afterMidnight, 24, 140, 105.5));
                tPath2.setAttribute('fill', sessionColor);
                tPath2.setAttribute('stroke', 'white');
                tPath2.setAttribute('stroke-width', '0.5');
                if (temporalRing) temporalRing.appendChild(tPath2);
              }
            } else {
              const tPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              tPath.setAttribute('d', getArc(sess.start, sess.hrs, 24, 140, 105.5));
              tPath.setAttribute('fill', sessionColor);
              tPath.setAttribute('stroke', 'white');
              tPath.setAttribute('stroke-width', '0.5');
              if (temporalRing) temporalRing.appendChild(tPath);
            }

            // 2. Goal Ring: Draw arc portion up to dailyGoal without wrapping past 360 degrees
            if (cumulativeHrs < dailyGoal) {
              const sliceHrs = Math.min(sess.hrs, dailyGoal - cumulativeHrs);
              if (sliceHrs > 0) {
                const gPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                gPath.setAttribute('d', getArc(cumulativeHrs, sliceHrs, dailyGoal, 104.5, 70));
                gPath.setAttribute('fill', sessionColor);
                gPath.setAttribute('stroke', 'white');
                gPath.setAttribute('stroke-width', '0.5');
                if (goalRing) goalRing.appendChild(gPath);
              }
            }
            cumulativeHrs += sess.hrs;

            if (idx < sessions.length - 1) {
              let gap = sessions[idx+1].start - (sess.start + sess.hrs);
              if (gap > 0) { if (gap >= 6) totalRestH += gap; else totalBreakM += (gap * 60); }
            }
          });
          let firstGap = sessions[0].start; 
          let lastGap = 24 - (sessions[sessions.length-1].start + sessions[sessions.length-1].hrs);
          [firstGap, lastGap].forEach(gap => {
            if (gap > 0) { if (gap >= 6) totalRestH += gap; else totalBreakM += (gap * 60); }
          });
        }
        const percent = Math.round((totalStudyH / dailyGoal) * 100);
        const totalEl = document.getElementById('masterTotalHours');
        if (totalEl) totalEl.textContent = formatHours(totalStudyH);
        const percentEl = document.getElementById('masterGoalPercent');
        if (percentEl) percentEl.textContent = percent + '%';
        const breakEl = document.getElementById('masterBreak');
        if (breakEl) breakEl.textContent = Math.round(totalBreakM) + 'm';
        const restEl = document.getElementById('masterRest');
        if (restEl) restEl.textContent = formatHours(totalRestH);
      }).catch(e => console.error("Chronometer Update Error:", e));
    }

    function loadActualStudySessions() {
      fetch(`${WEB_APP_URL}?action=getWatchData`).then(res => res.json()).then(rawSessions => {
        const sessions = (typeof mergeContinuousSessions === 'function')
          ? mergeContinuousSessions(rawSessions)
          : (Array.isArray(rawSessions) ? rawSessions : []);
        const container = document.getElementById('actualContainer');
        if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
          container.innerHTML = '<div style="text-align: center; color: var(--text-tertiary); font-size: 12px; padding: 20px;">No sessions logged today yet</div>';
          document.getElementById('actualTotalHours').innerText = '0.0h';
          document.getElementById('actualSessionCount').innerText = '0';
          document.getElementById('actualBreakTime').innerText = '0m';
          return;
        }
        sessions.sort((a, b) => a.start - b.start);
        let totalHours = 0, totalBreakMinutes = 0;
        let html = '<div style="font-size: 12px; line-height: 2;">';
        sessions.forEach((sess, idx) => {
          totalHours += sess.hrs;
          const startHour = Math.floor(sess.start);
          const startMin = Math.round((sess.start % 1) * 60);
          const startTime = `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`;
          const durationHours = Math.floor(sess.hrs);
          const durationMin = Math.round((sess.hrs % 1) * 60);
          const durationStr = durationHours > 0 ? `${durationHours}h ${durationMin}m` : `${durationMin}m`;
          html += `<div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: var(--input-bg); border-radius: 6px;">
            <span style="font-weight: 600; color: var(--primary); min-width: 50px;">${startTime}</span>
            <span style="background: var(--primary); color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;">Study</span>
            <span style="color: var(--text-secondary); min-width: 70px;">${durationStr}</span>`;
          if (idx < sessions.length - 1) {
            const gap = sessions[idx + 1].start - (sess.start + sess.hrs);
            if (gap > 0) {
              const breakMin = Math.round(gap * 60);
              totalBreakMinutes += breakMin;
              html += `<span style="color: var(--text-tertiary); margin: 0 4px;">→</span>
                <span style="background: var(--warning); color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;">Break</span>
                <span style="color: var(--warning); font-weight: 600;">${breakMin}m</span>`;
            }
          }
          html += `</div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        document.getElementById('actualTotalHours').innerText = formatHours(totalHours);  
        document.getElementById('actualSessionCount').innerText = sessions.length;
        document.getElementById('actualBreakTime').innerText = Math.round(totalBreakMinutes) + 'm';
      }).catch(err => {
        document.getElementById('actualContainer').innerHTML = '<div style="text-align: center; color: var(--danger); font-size: 12px; padding: 20px;">Error loading sessions</div>';
      });
    }

    function loadDailyProgressChart() {
      const themeColors = getThemeColors();
      Promise.all([
        fetch(`${WEB_APP_URL}?action=getWatchData`).then(res => res.json()).catch(() => []),
        fetch(`${WEB_APP_URL}?action=getProjectionData`).then(res => res.json()).catch(() => [])
      ]).then(([rawTodayWatch, projectionData]) => {
        const todayWatch = (typeof mergeContinuousSessions === 'function')
          ? mergeContinuousSessions(rawTodayWatch)
          : (Array.isArray(rawTodayWatch) ? rawTodayWatch : []);

        let todayByHour = {}, todayStartHour = 24;
        if (Array.isArray(todayWatch) && todayWatch.length > 0) {
          todayWatch.sort((a, b) => a.start - b.start);
          let cumulativeHours = 0;
          todayWatch.forEach(sess => {
            const startHour = Math.floor(sess.start);
            if (startHour < todayStartHour) todayStartHour = startHour;
            cumulativeHours += sess.hrs;
            const endHour = Math.ceil(sess.start + sess.hrs);
            for (let h = startHour; h < endHour && h < 24; h++) {
              if (!todayByHour[h] || todayByHour[h] < cumulativeHours) todayByHour[h] = cumulativeHours;
            }
          });
        }

        let pastByHour = {}, pastStartHour = 24;
        let pastRunningTotal = 0;
        if (Array.isArray(projectionData) && projectionData.length === 24) {
          projectionData.forEach((val, h) => {
            const num = typeof val === 'number' ? val : parseFloat(val) || 0;
            pastRunningTotal += num;
            if (num > 0 && pastStartHour === 24) pastStartHour = h;
            pastByHour[h] = pastRunningTotal;
          });
        }

        const startHour = Math.min(todayStartHour < 24 ? todayStartHour : 8, pastStartHour < 24 ? pastStartHour : 8);
        const endHour = 24;
        let chartData = [['Hour', 'Today', '7-Day Avg']];
        let lastTodayVal = null, lastAvgVal = null;
        for (let h = startHour; h < endHour; h++) {
          const hourLabel = h.toString().padStart(2, '0') + ':00';
          const todayVal = todayByHour[h] !== undefined ? todayByHour[h] : lastTodayVal;
          const avgVal = pastByHour[h] !== undefined ? parseFloat(pastByHour[h].toFixed(2)) : lastAvgVal;
          if (todayVal !== null) lastTodayVal = todayVal;
          if (avgVal !== null) lastAvgVal = avgVal;
          chartData.push([hourLabel, todayVal, avgVal]);
        }
        whenGoogleChartsLoaded(() => {
          const el = document.getElementById('dailyProgressChart');
          if (!el) return;
          const table = google.visualization.arrayToDataTable(chartData);
          const options = {
            legend: { position: 'bottom' }, pointSize: 4, lineWidth: 2, colors: [themeColors.primary, themeColors.warning],
            backgroundColor: 'transparent', chartArea: { width: '85%', height: '70%' },
            hAxis: { textStyle: { fontSize: 10, color: themeColors.warning } },
            vAxis: { textStyle: { fontSize: 10, color: themeColors.warning } }
          };
          new google.visualization.LineChart(el).draw(table, options);
        });
      }).catch(err => console.error('Daily progress chart error:', err));
    }

    function initCardControls() {
      const hiddenCards = JSON.parse(localStorage.getItem('hiddenCards')) || [];
      hiddenCards.forEach(id => { document.getElementById(id)?.classList.add('hidden'); });
      document.querySelectorAll('.card').forEach((card, idx) => {
        if (!card.id) card.id = 'card-' + idx;
        const h3 = card.querySelector('h3');
        if (h3) {
          const header = document.createElement('div');
          header.className = 'card-header';
          const title = h3.cloneNode(true);
          const hideBtn = document.createElement('button');
          hideBtn.className = 'btn-hide';
          hideBtn.innerHTML = '-';
          hideBtn.onclick = (e) => { e.stopPropagation(); toggleCardVisibility(card.id); };
          header.appendChild(title);
          header.appendChild(hideBtn);
          h3.replaceWith(header);
        }
        card.draggable = true;
        card.addEventListener('dragstart', (e) => { e.dataTransfer.effectAllowed = 'move'; card.classList.add('dragging'); });
        card.addEventListener('dragend', () => { card.classList.remove('dragging'); });
      });
      const container = document.querySelector('.dashboard-container');
      container.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
      container.addEventListener('drop', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.card.dragging');
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) container.appendChild(dragging);
        else container.insertBefore(dragging, afterElement);
      });
    }

    function toggleCardVisibility(cardId) {
      const card = document.getElementById(cardId);
      card.classList.toggle('hidden');
      let hiddenCards = JSON.parse(localStorage.getItem('hiddenCards')) || [];
      if (card.classList.contains('hidden')) {
        if (!hiddenCards.includes(cardId)) hiddenCards.push(cardId);
      } else {
        hiddenCards = hiddenCards.filter(id => id !== cardId);
      }
      localStorage.setItem('hiddenCards', JSON.stringify(hiddenCards));
    }

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
        else return closest;
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function loadWeeklySessionsChart() {
      fetch(`${WEB_APP_URL}?action=getPlannerData`)
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data) || data.length === 0) {
            document.getElementById('weeklySessionsChart').innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-tertiary);">No session data available</div>';
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
          const themeColors = getThemeColors();
          const dayColors = ['#4285f4', '#34a853', '#fbbc05', '#ea4335', '#9b59b6', '#16a085', '#e74c3c'];
          const daySessionsData = last7CalendarDays.map((dt, dayIdx) => {
            const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
            const dayName = dt.toLocaleDateString('en-US', { weekday: 'short' });
            const row = rowMap.get(dateStr);
            const sessions = [];
            if (row) {
              for (let j = 1; j < row.length; j += 3) {
                const hours = row[j];
                if (typeof hours === 'number' && hours > 0) sessions.push(parseFloat(hours.toFixed(2)));
              }
            }
            return { dayName, dateStr, dayIdx, sessions };
          });
          const maxSessions = Math.max(...daySessionsData.map(d => d.sessions.length));
          const chartData = [['Session']];
          daySessionsData.forEach(day => { chartData[0].push(day.dayName); });
          for (let sessionNum = 0; sessionNum < maxSessions; sessionNum++) {
            const row = ['S' + (sessionNum + 1)];
            daySessionsData.forEach(dayData => { row.push(dayData.sessions[sessionNum] !== undefined ? dayData.sessions[sessionNum] : null); });
            chartData.push(row);
          }
          whenGoogleChartsLoaded(() => {
            const el = document.getElementById('weeklySessionsChart');
            if (!el) return;
            const dataTable = google.visualization.arrayToDataTable(chartData);
            const options = {
              title: '', legend: { position: 'bottom', textStyle: { fontSize: 11, color: themeColors.text } },
              backgroundColor: 'transparent', chartArea: { width: '85%', height: '75%', top: 20, bottom: 50 },
              pointSize: 5, lineWidth: 2.5, curveType: 'function', colors: dayColors,
              vAxis: { title: 'Hours per Session', titleTextStyle: { fontSize: 11, italic: false, bold: true, color: themeColors.primary }, gridlines: { color: 'rgba(0,0,0,0.05)' }, minorGridlines: { color: 'transparent' }, textStyle: { fontSize: 10, color: themeColors.text }, baselineColor: 'transparent' },
              hAxis: { title: 'Session Number', titleTextStyle: { fontSize: 11, italic: false, bold: true, color: themeColors.primary }, textStyle: { fontSize: 10, color: themeColors.primary }, gridlines: { color: 'transparent' }, baselineColor: 'transparent' },
              animation: { startup: true, duration: 800, easing: 'out' }
            };
            const chart = new google.visualization.LineChart(el);
            chart.draw(dataTable, options);
          });
        })
        .catch(err => {
          console.error('Weekly sessions chart error:', err);
          document.getElementById('weeklySessionsChart').innerHTML = `<div style="text-align: center; padding: 40px; color: var(--danger); font-size: 12px;">Error loading chart: ${err.message}</div>`;
        });
    }

// Real-time clock update
function updateRealTimeClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  
  document.getElementById('realTimeWatch').innerText = `${hours}:${minutes}:${seconds}`;
  document.getElementById('realTimeDate').innerText = dateStr;
}

setInterval(updateRealTimeClock, 1000);
updateRealTimeClock();

function loadActiveHoursChart() {
  fetch(`${WEB_APP_URL}?action=getWatchData`).then(res => res.json()).then(rawSessions => {
    const sessions = (typeof mergeContinuousSessions === 'function')
      ? mergeContinuousSessions(rawSessions)
      : (Array.isArray(rawSessions) ? rawSessions : []);
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
      const empty = '<div style="text-align: center; padding: 20px; color: var(--text-tertiary); font-size: 11px;">No data</div>';
      document.getElementById('activeHoursChartAM').innerHTML = empty;
      document.getElementById('activeHoursChartPM').innerHTML = empty;
      return;
    }

    let minHour = 24, maxHour = 0;
    sessions.forEach(sess => {
      if (typeof sess.hrs !== 'number' || sess.hrs <= 0) return;
      minHour = Math.min(minHour, Math.floor(sess.start));
      maxHour = Math.max(maxHour, Math.ceil(sess.start + sess.hrs));
    });
    if (minHour === 24) return;

    const hourlyStudy = {};
    for (let h = minHour; h < maxHour; h++) hourlyStudy[h] = 0;

    sessions.forEach(sess => {
      if (typeof sess.hrs !== 'number' || sess.hrs <= 0) return;
      for (let h = minHour; h < maxHour; h++) {
        const overlap = Math.min(sess.start + sess.hrs, h + 1) - Math.max(sess.start, h);
        if (overlap > 0) hourlyStudy[h] += overlap;
      }
    });

    const themeColors = getThemeColors();
    const mid = 12; // Split at noon

    function drawChart(containerId, fromHour, toHour) {
      const chartData = [['Hour', 'Hours', { role: 'style' }]];
      const barCount = toHour - fromHour;
      for (let h = fromHour; h < toHour; h++) {
        const hrs = parseFloat((hourlyStudy[h] || 0).toFixed(1));
        chartData.push([String(h).padStart(2, '0') + ':00', hrs, `color: ${hrs > 0 ? '#FC4C02' : 'rgba(0,0,0,0.1)'}`]);
      }
      whenGoogleChartsLoaded(() => {
        const el = document.getElementById(containerId);
        if (!el) return;
        const dataTable = google.visualization.arrayToDataTable(chartData);
        new google.visualization.ColumnChart(el).draw(dataTable, {
          legend: 'none',
          backgroundColor: 'transparent',
          chartArea: { left: 30, top: 5, right: 5, bottom: 22, width: '92%', height: '78%' },
          bar: { groupWidth: barCount > 8 ? '55%' : '70%' },
          vAxis: { textPosition: 'none', gridlines: { color: 'rgba(0,0,0,0.04)' }, baselineColor: 'transparent' },
          hAxis: { textStyle: { fontSize: 8, color: themeColors.text }, slantedText: barCount > 6, slantedTextAngle: 30, showTextEvery: barCount > 10 ? 2 : 1, gridlines: { color: 'transparent' } },
          animation: { startup: true, duration: 500, easing: 'out' }
        });
      });
    }

    drawChart('activeHoursChartAM', minHour, Math.min(maxHour, mid));
    drawChart('activeHoursChartPM', Math.max(minHour, mid), maxHour);

  }).catch(err => console.error('Active hours error:', err));
}

