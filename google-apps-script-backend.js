/**
 * Google Apps Script (GAS) Backend for Study Flow
 * 
 * Instructions for deployment:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. In the menu, go to: Extensions > Apps Script
 * 3. Replace any code in Code.gs with this entire script.
 * 4. Click "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Configuration:
 *    - Description: Study Flow Backend
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone"
 * 7. Click "Deploy", authorize permissions when prompted, and copy the Web App URL.
 * 8. Set your Web App URL in Study Flow (Settings / Custom Web App URL or in .env).
 */

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const props = PropertiesService.getUserProperties();
    
    // ✅ NEW: Save Goal
    if (params.action === "setGoal") {
      props.setProperty("DAILY_GOAL", params.goal.toString());
      return ContentService.createTextOutput("Goal Saved").setMimeType(ContentService.MimeType.TEXT);
    }

    if (params.action === "saveState") {
      props.setProperty(params.type + "_startTime", params.startTime.toString());
      if (params.targetDuration) props.setProperty(params.type + "_targetDuration", params.targetDuration.toString());
      return ContentService.createTextOutput("State Saved").setMimeType(ContentService.MimeType.TEXT);
    }

    const cache = CacheService.getUserCache();
    const id = "log_" + params.timestamp;
    if (params.timestamp && cache.get(id)) return ContentService.createTextOutput("Duplicate");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tz = ss.getSpreadsheetTimeZone();
    let sheet = ss.getSheetByName('Logs') || ss.insertSheet('Logs');
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date', 'Type', 'Target', 'Duration', 'Timestamp', 'DecimalHours']);
    }

    let parts = params.duration.split(':');
    let h=0, m=0, s=0;
    if (parts.length === 3) { h=parseInt(parts[0])||0; m=parseInt(parts[1])||0; s=parseInt(parts[2])||0; }
    else { m=parseInt(parts[0])||0; s=parseInt(parts[1])||0; }
    let decimalHours = h + (m/60) + (s/3600);
    
    const [H, M, S] = Utilities.formatDate(new Date(), tz, "H:m:s").split(":").map(Number);
    let timeDecimal = H + M / 60 + S / 3600;
    sheet.appendRow([new Date(), params.type, params.target || "N/A", params.duration, timeDecimal.toFixed(4), decimalHours.toFixed(4)]);

    if (params.timestamp) cache.put(id, "1", 21600);

    cache.remove("CACHE_DATA_" + getTodayStr(tz));
    
    props.deleteProperty(params.type + "_startTime");
    props.deleteProperty(params.type + "_targetDuration");
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch(err) {
    return ContentService.createTextOutput("Error: " + err).setMimeType(ContentService.MimeType.TEXT);
  }
}

function getTodayStr(tz) {
  if (!tz || typeof tz !== 'string') tz = Session.getScriptTimeZone();
  return Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
}

function buildCachedData(sheet, tz) {
  if (!sheet || sheet.getLastRow() < 2) return { dailyGroups: {}, hourlyBuckets: new Array(24).fill(0), cumulativeTotal: 0 };

  const data = sheet.getDataRange().getValues();
  const todayStr = getTodayStr(tz);
  
  let dailyGroups = {};
  let hourlyBuckets = new Array(24).fill(0);
  let cumulativeTotal = 0;

  const getDec = (val, tz) => {
    if (typeof val === 'number') return val;
    if (val instanceof Date) { const [h, m] = Utilities.formatDate(val, tz, "H:m").split(":").map(Number); return h + m/60; }
    let strVal = val.toString().trim();
    const nepaliToEnglish = (str) => {
      const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
      const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      let result = str;
      nepaliDigits.forEach((nepali, idx) => result = result.split(nepali).join(englishDigits[idx]));
      return result;
    };
    strVal = nepaliToEnglish(strVal);
    if (!strVal.includes(':') && !isNaN(parseFloat(strVal))) {
      return parseFloat(strVal);
    }
    let isPM = strVal.includes('PM'), isAM = strVal.includes('AM');
    let p = strVal.split(':'), h = parseInt(p[0])||0;
    if (isPM && h !== 12) h += 12;
    else if (isAM && h === 12) h = 0;
    let mins = (parseInt(p[1])||0)/60;
    let secs = (parseInt(p[2])||0)/3600;
    return h + mins + secs;
  };

  for (let i = 1; i < data.length; i++) {
    if (!data[i][0] || !data[i][3]) continue;
    
    let dateObj = (data[i][0] instanceof Date) ? data[i][0] : new Date(data[i][0]);
    const dateStr = Utilities.formatDate(dateObj, tz, "yyyy-MM-dd");
    
    if (dateStr === todayStr) continue;
    
    const displayKey = Utilities.formatDate(dateObj, tz, "MMM dd");
    let decimalHours = parseFloat(data[i][5]) || 0;
    
    if (!dailyGroups[dateStr]) dailyGroups[dateStr] = { displayDate: displayKey, total: 0, sessions: [] };
    dailyGroups[dateStr].total += decimalHours;
    dailyGroups[dateStr].sessions.push(decimalHours);
    cumulativeTotal += decimalHours;

    if (data[i][3] && data[i][4]) {
      let endTime = getDec(data[i][4], tz);
      let duration = getDec(data[i][3], tz);
      let startTime = endTime - duration;
      for (let h = 0; h < 24; h++) {
        let overlapStart = Math.max(h, startTime);
        let overlapEnd = Math.min(h + 1, endTime);
        if (overlapEnd > overlapStart) {
          hourlyBuckets[h] += (overlapEnd - overlapStart);
        }
      }
    }
  }

  return { dailyGroups, hourlyBuckets, cumulativeTotal };
}

function doGet(e) {
  try {
    if (!e || !e.parameter) return JSON_RESPONSE([["Error", "No parameters"]]);
    
    const action = e.parameter.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Logs');
    const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
    const props = PropertiesService.getUserProperties();
    const todayStr = getTodayStr(tz);

    // 1. WATCH DATA (Supports Today, Yesterday, or any day offset)
    if (action === "getWatchData") {
      let daysAgo = parseInt(e.parameter.daysAgo || 0);
      let targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - daysAgo);
      let targetStr = Utilities.formatDate(targetDate, tz, "yyyy-MM-dd");
      
      let sessions = [];
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          if (!data[i][0]) continue;
          let rDate = (data[i][0] instanceof Date) ? data[i][0] : new Date(data[i][0]);
          if (Utilities.formatDate(rDate, tz, "yyyy-MM-dd") === targetStr) {
            let hrs = parseFloat(data[i][5]) || 0;
            let timeVal = parseFloat(data[i][4]) || 0;
            // Column 4 is completion time; compute actual start time
            let start = timeVal >= hrs ? (timeVal - hrs) : timeVal;
            sessions.push({
              hrs: hrs,
              start: parseFloat(start.toFixed(4))
            });
          }
        }
      }
      return JSON_RESPONSE(sessions);
    }

    // 2. PROJECTION DATA (Aggregates habit for Tomorrow)
    if (action === "getProjectionData") {
      let hourlyAgg = new Array(24).fill(0);
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        const now = new Date();
        for (let i = 1; i < data.length; i++) {
          if (!data[i][0]) continue;
          let rDate = (data[i][0] instanceof Date) ? data[i][0] : new Date(data[i][0]);
          let diff = (now - rDate) / (1000 * 60 * 60 * 24);
          // Look at the last 7 days of history to build the habit
          if (diff > 0 && diff <= 7) { 
            let hourIdx = Math.floor(data[i][4]);
            if (hourIdx >= 0 && hourIdx < 24) {
              hourlyAgg[hourIdx] += (parseFloat(data[i][5]) / 7);
            }
          }
        }
      }
      return JSON_RESPONSE(hourlyAgg);
    }

    // 2. GOAL DATA (Gauges & Schedule)
    if (action === "getGoalData") {
      let todayHours = 0;
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        data.forEach(row => {
          let rDate = (row[0] instanceof Date) ? row[0] : new Date(row[0]);
          if (Utilities.formatDate(rDate, tz, "yyyy-MM-dd") === todayStr) {
            todayHours += parseFloat(row[5]) || 0;
          }
        });
      }
      const goal = parseFloat(props.getProperty("DAILY_GOAL")) || 4;
      return JSON_RESPONSE({ current: todayHours, goal: goal });
    }

    if (action === "getState") {
      const all = props.getProperties(), out = {};
      Object.keys(all).forEach(k => { if (/_(startTime|targetDuration)$/.test(k)) out[k] = all[k]; });
      return JSON_RESPONSE(out);
    }

    // cache block
    const cache = CacheService.getUserCache();
    const cacheKey = "CACHE_DATA_" + todayStr;
    let cachedData = null;
    const raw = cache.get(cacheKey);
    if (raw) { try { cachedData = JSON.parse(raw); } catch (e) {} }
    if (!cachedData) {
      cachedData = buildCachedData(sheet, tz);
      try { cache.put(cacheKey, JSON.stringify(cachedData), 21600); } catch (e) {}
    }

    // 4. OTHER ANALYTICS ACTIONS
    if (action === "getGoal") return JSON_RESPONSE({ goal: parseFloat(props.getProperty("DAILY_GOAL")) || 4 });
    
    if (action === "getHourlyDistribution") {
      let result = [["Hour", "Intensity"]];
      cachedData.hourlyBuckets.forEach((val, h) => { result.push([h + ":00", parseFloat(val.toFixed(2))]); });
      return JSON_RESPONSE(result);
    }

    if (action === "getMountainData") {
      let mountain = [["Day", "Cumulative Hours"]];
      let runningTotal = 0;
      let sortedKeys = Object.keys(cachedData.dailyGroups).sort();
      sortedKeys.forEach(dayKey => {
        let group = cachedData.dailyGroups[dayKey];
        runningTotal += group.total;
        let label = group.displayDate || dayKey;
        mountain.push([label, parseFloat(runningTotal.toFixed(1))]);
      });
      return JSON_RESPONSE(mountain);
    }

    if (action === "getScatterData") {
      let points = [["Planned", "Actual"]];
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        data.forEach(row => {
          let targetVal = parseInt(row[2]);
          let actualHours = parseFloat(row[5]) || 0;
          if (!isNaN(targetVal) && targetVal > 0 && actualHours > 0) {
            points.push([targetVal, parseFloat((actualHours * 60).toFixed(1))]);
          }
        });
      }
      return JSON_RESPONSE(points);
    }
    
    if (action === "getPlannerData") {
      // Returns 7-day schedule / planner data (falls through or returns standard daily groups)
    }

    // 5. DEFAULT ACTION: BAR CHARTS (Daily/Weekly/Monthly)
    const view = e.parameter.view || 'Daily';
    const palette = ['#4285f4', '#34a853', '#fbbc05', '#ea4335', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad'];
    let dailyGroups = JSON.parse(JSON.stringify(cachedData.dailyGroups)) || {};
    let maxSessions = 0;

    // Add Today's Data into the chart groups
    if (sheet && sheet.getLastRow() > 1) {
      const data = sheet.getDataRange().getValues();
      data.forEach(row => {
        let rDate = (row[0] instanceof Date) ? row[0] : new Date(row[0]);
        if (Utilities.formatDate(rDate, tz, "yyyy-MM-dd") === todayStr) {
          const displayKey = Utilities.formatDate(rDate, tz, "MMM dd");
          if (!dailyGroups[todayStr]) dailyGroups[todayStr] = { displayDate: displayKey, total: 0, sessions: [] };
          dailyGroups[todayStr].sessions.push(parseFloat(row[5]) || 0);
        }
      });
    }

    // Determine how many session columns we need
    Object.keys(dailyGroups).forEach(date => {
      if (dailyGroups[date].sessions.length > maxSessions) maxSessions = dailyGroups[date].sessions.length;
    });

    let header = ['Date'];
    for (let n = 0; n < maxSessions; n++) {
      header.push('S'+(n+1)); header.push({role:'style'}); header.push({role:'tooltip'});
    }

    let result = [header];
    
    // Chronological sort by ISO date key (yyyy-MM-dd)
    let sortedDates = Object.keys(dailyGroups).sort();

    sortedDates.forEach(dateKey => {
      let group = dailyGroups[dateKey];
      let row = [group.displayDate || dateKey];
      let sessions = group.sessions || [];
      for (let n = 0; n < maxSessions; n++) {
        if (sessions[n]) {
          row.push(sessions[n]);
          row.push(palette[n % palette.length]);
          row.push("Session " + (n+1) + ": " + (sessions[n]*60).toFixed(0) + "m");
        } else { row.push(0); row.push(''); row.push(''); }
      }
      result.push(row);
    });

    return JSON_RESPONSE(result);

  } catch (err) {
    return JSON_RESPONSE([["Error", err.toString()]]);
  }
}

function JSON_RESPONSE(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function cleanupOldCache() {
  const p = PropertiesService.getUserProperties();
  Object.keys(p.getProperties()).filter(k => k.startsWith("CACHE_")).forEach(k => p.deleteProperty(k));
}

