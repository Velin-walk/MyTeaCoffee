/**
 * Google Apps Script (GAS) Backend for Study Flow
 *
 * Recommended `Logs` Sheet Columns (A:H):
 *   A: Date
 *   B: Timer Type
 *   C: Target (min)
 *   D: Actual Duration
 *   E: End Hour
 *   F: Decimal Hours
 *   G: Plant
 *   H: Session ID
 *
 * Instructions for deployment:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. In the menu, go to: Extensions > Apps Script
 * 3. Replace any code in Code.gs with this entire script.
 * 4. Click "Deploy" > "New deployment" (or "Manage deployments" > Edit > New version)
 * 5. Select type: "Web app"
 * 6. Configuration:
 *    - Description: Study Flow Backend
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone"
 * 7. Click "Deploy", authorize permissions when prompted, and copy the Web App URL.
 * 8. Set your Web App URL in Study Flow (Settings / Custom Web App URL or in .env).
 */

const LOGS_HEADERS = [
  'Date',
  'Timer Type',
  'Target (min)',
  'Actual Duration',
  'End Hour',
  'Decimal Hours',
  'Plant',
  'Session ID'
];

function getColMap(headerRow) {
  const map = {
    date: 0,
    type: 1,
    target: 2,
    duration: 3,
    endHour: 4,
    decimalHours: 5,
    plant: 6,
    sessionId: 7
  };
  if (!Array.isArray(headerRow)) return map;

  headerRow.forEach((cell, idx) => {
    const h = String(cell || '').trim().toLowerCase();
    if (!h) return;
    if (h === 'date') map.date = idx;
    else if (h === 'timer type' || h === 'type') map.type = idx;
    else if (h === 'target (min)' || h === 'target') map.target = idx;
    else if (h === 'actual duration' || h === 'duration') map.duration = idx;
    else if (h === 'end hour' || h === 'end time (hr)' || h === 'timestamp') map.endHour = idx;
    else if (h === 'decimal hours' || h === 'decimalhours' || h === 'column 1') map.decimalHours = idx;
    else if (h === 'plant') map.plant = idx;
    else if (h === 'session id' || h === 'epoch' || h === 'column 2') map.sessionId = idx;
  });
  return map;
}

function parseDateCell(val) {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;

  const str = String(val).trim();
  if (!str) return null;

  // Handle dd/MM/yyyy text cells safely if pasted manually as strings
  const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const first = parseInt(dmy[1], 10);
    const second = parseInt(dmy[2], 10);
    const year = parseInt(dmy[3], 10);
    // Treat as dd/MM/yyyy when day > 12 or matches sheet locale
    if (first > 12 || second <= 12) {
      const d = new Date(year, second - 1, first);
      return isNaN(d.getTime()) ? null : d;
    }
  }

  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function getDec(val, tz) {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return 0;
    const [h, m, s] = Utilities.formatDate(val, tz, "H:m:s").split(":").map(Number);
    return h + (m / 60) + ((s || 0) / 3600);
  }

  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  let strVal = String(val).trim();
  nepaliDigits.forEach((nepali, idx) => {
    strVal = strVal.split(nepali).join(String(idx));
  });

  if (!strVal.includes(':')) {
    const num = parseFloat(strVal);
    return isNaN(num) ? 0 : num;
  }

  const upper = strVal.toUpperCase();
  const isPM = upper.includes('PM');
  const isAM = upper.includes('AM');
  const clean = upper.replace(/AM|PM/g, '').trim();
  const p = clean.split(':');
  let h = parseInt(p[0], 10) || 0;
  if (isPM && h !== 12) h += 12;
  else if (isAM && h === 12) h = 0;

  if (p.length === 2) {
    return h + ((parseInt(p[1], 10) || 0) / 60);
  }
  const mins = (parseInt(p[1], 10) || 0) / 60;
  const secs = (parseInt(p[2], 10) || 0) / 3600;
  return h + mins + secs;
}

function parseTargetAndPlant(rawTarget, rawPlant) {
  const targetStr = (rawTarget !== undefined && rawTarget !== null) ? String(rawTarget).trim() : '';
  let plantStr = (rawPlant !== undefined && rawPlant !== null) ? String(rawPlant).trim() : '';

  if (/^(n\/a|null|undefined)$/i.test(plantStr)) plantStr = '';

  let targetVal = 'N/A';
  if (targetStr && !/^(n\/a|null|undefined)$/i.test(targetStr)) {
    if (/^\d+(\.\d+)?$/.test(targetStr)) {
      targetVal = parseFloat(targetStr);
    } else if (!plantStr) {
      // Frontend Forest/Open modes send plant name in the `target` slot; route it cleanly to `Plant`
      plantStr = targetStr;
    }
  }

  return { target: targetVal, plant: plantStr };
}

function extractPlantFromRow(row, col) {
  if (col.plant >= 0 && row[col.plant] !== undefined && row[col.plant] !== null) {
    const p = String(row[col.plant]).trim();
    if (p && p.toUpperCase() !== 'N/A') return p;
  }
  // Legacy fallback: rows where plant name was written into Target (min)
  if (col.target >= 0 && row[col.target] !== undefined && row[col.target] !== null) {
    const t = String(row[col.target]).trim();
    if (t && t.toUpperCase() !== 'N/A' && !/^\d+(\.\d+)?$/.test(t)) return t;
  }
  return '';
}

function isDuplicateSessionInSheet(sheet, sessionId) {
  if (!sheet || !sessionId) return false;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const col = getColMap(headerRow);
  if (col.sessionId < 0 || col.sessionId >= sheet.getLastColumn()) return false;

  const checkCount = Math.min(30, lastRow - 1);
  const startRow = lastRow - checkCount + 1;
  const ids = sheet.getRange(startRow, col.sessionId + 1, checkCount, 1).getValues();
  const targetId = String(sessionId).trim();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0] || '').trim() === targetId) return true;
  }
  return false;
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const props = PropertiesService.getUserProperties();

    // Save Daily Goal
    if (params.action === "setGoal") {
      props.setProperty("DAILY_GOAL", params.goal.toString());
      return ContentService.createTextOutput("Goal Saved").setMimeType(ContentService.MimeType.TEXT);
    }

    // Save Cross-Device Active Timer / Selected Plant State
    if (params.action === "saveState") {
      props.setProperty(params.type + "_startTime", params.startTime.toString());
      if (params.targetDuration) props.setProperty(params.type + "_targetDuration", params.targetDuration.toString());
      return ContentService.createTextOutput("State Saved").setMimeType(ContentService.MimeType.TEXT);
    }

    const cache = CacheService.getUserCache();
    const sessionId = params.timestamp ? String(params.timestamp).trim() : "";
    const id = "log_" + sessionId;
    if (sessionId && cache.get(id)) {
      return ContentService.createTextOutput("Duplicate").setMimeType(ContentService.MimeType.TEXT);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
    let sheet = ss.getSheetByName('Logs') || ss.insertSheet('Logs');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(LOGS_HEADERS);
    } else if (sessionId && isDuplicateSessionInSheet(sheet, sessionId)) {
      cache.put(id, "1", 21600);
      return ContentService.createTextOutput("Duplicate").setMimeType(ContentService.MimeType.TEXT);
    }

    const durationStr = String(params.duration || "00:00:00").trim();
    const parts = durationStr.split(':');
    let h = 0, m = 0, s = 0;
    if (parts.length === 3) {
      h = parseInt(parts[0], 10) || 0;
      m = parseInt(parts[1], 10) || 0;
      s = parseInt(parts[2], 10) || 0;
    } else {
      m = parseInt(parts[0], 10) || 0;
      s = parseInt(parts[1], 10) || 0;
    }
    const decimalHours = h + (m / 60) + (s / 3600);

    const now = new Date();
    const [H, M, S] = Utilities.formatDate(now, tz, "H:m:s").split(":").map(Number);
    const timeDecimal = H + (M / 60) + (S / 3600);

    const parsed = parseTargetAndPlant(params.target, params.plant);
    const sessionType = params.type || "Open";

    const headerRow = sheet.getRange(1, 1, 1, Math.max(LOGS_HEADERS.length, sheet.getLastColumn())).getValues()[0];
    const col = getColMap(headerRow);
    const rowLen = Math.max(8, col.date + 1, col.type + 1, col.target + 1, col.duration + 1, col.endHour + 1, col.decimalHours + 1, col.plant + 1, col.sessionId + 1);
    const rowOut = new Array(rowLen).fill('');
    rowOut[col.date] = now;
    rowOut[col.type] = sessionType;
    rowOut[col.target] = parsed.target;
    rowOut[col.duration] = durationStr;
    rowOut[col.endHour] = parseFloat(timeDecimal.toFixed(4));
    rowOut[col.decimalHours] = parseFloat(decimalHours.toFixed(4));
    rowOut[col.plant] = parsed.plant;
    rowOut[col.sessionId] = sessionId;

    sheet.appendRow(rowOut);

    if (sessionId) cache.put(id, "1", 21600);
    cache.remove("CACHE_DATA_" + getTodayStr(tz));

    props.deleteProperty(sessionType + "_startTime");
    props.deleteProperty(sessionType + "_targetDuration");
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err).setMimeType(ContentService.MimeType.TEXT);
  }
}

function getTodayStr(tz) {
  if (!tz || typeof tz !== 'string') tz = Session.getScriptTimeZone();
  return Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
}

function buildCachedData(sheet, tz) {
  if (!sheet || sheet.getLastRow() < 2) {
    return { dailyGroups: {}, hourlyBuckets: new Array(24).fill(0), cumulativeTotal: 0 };
  }

  const data = sheet.getDataRange().getValues();
  const col = getColMap(data[0]);
  const todayStr = getTodayStr(tz);

  let dailyGroups = {};
  let hourlyBuckets = new Array(24).fill(0);
  let cumulativeTotal = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const dateObj = parseDateCell(row[col.date]);
    if (!dateObj) continue;

    const dateStr = Utilities.formatDate(dateObj, tz, "yyyy-MM-dd");
    if (dateStr === todayStr) continue;

    let decimalHours = parseFloat(row[col.decimalHours]);
    if (isNaN(decimalHours) || decimalHours <= 0) {
      decimalHours = getDec(row[col.duration], tz);
    }
    if (decimalHours <= 0) continue;

    const displayKey = Utilities.formatDate(dateObj, tz, "MMM dd");
    if (!dailyGroups[dateStr]) dailyGroups[dateStr] = { displayDate: displayKey, total: 0, sessions: [] };
    dailyGroups[dateStr].total += decimalHours;
    dailyGroups[dateStr].sessions.push(decimalHours);
    cumulativeTotal += decimalHours;

    if (row[col.duration] && row[col.endHour] !== '' && row[col.endHour] !== null && row[col.endHour] !== undefined) {
      const endTime = getDec(row[col.endHour], tz);
      const duration = getDec(row[col.duration], tz) || decimalHours;
      const startTime = Math.max(0, endTime - duration);
      for (let h = 0; h < 24; h++) {
        const overlapStart = Math.max(h, startTime);
        const overlapEnd = Math.min(h + 1, endTime);
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
    if (action === "version") {
      return JSON_RESPONSE({ ok: true, schema: LOGS_HEADERS, version: "2.1-plant-column-fix" });
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Logs');
    const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
    const props = PropertiesService.getUserProperties();
    const todayStr = getTodayStr(tz);

    // 1. WATCH DATA (Supports Today, Yesterday, or any day offset)
    if (action === "getWatchData") {
      const daysAgo = parseInt(e.parameter.daysAgo || 0, 10) || 0;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - daysAgo);
      const targetStr = Utilities.formatDate(targetDate, tz, "yyyy-MM-dd");

      const sessions = [];
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        const col = getColMap(data[0]);
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const rDate = parseDateCell(row[col.date]);
          if (!rDate) continue;
          if (Utilities.formatDate(rDate, tz, "yyyy-MM-dd") === targetStr) {
            let hrs = parseFloat(row[col.decimalHours]);
            if (isNaN(hrs) || hrs <= 0) hrs = getDec(row[col.duration], tz);
            if (hrs <= 0) continue;

            const timeVal = getDec(row[col.endHour], tz);
            // endHour is completion time; compute start time safely
            const start = Math.max(0, timeVal - hrs);
            const plantName = extractPlantFromRow(row, col);
            const item = {
              hrs: parseFloat(hrs.toFixed(4)),
              start: parseFloat(start.toFixed(4))
            };
            if (plantName) item.plant = plantName;
            sessions.push(item);
          }
        }
      }
      return JSON_RESPONSE(sessions);
    }

    // 2. PROJECTION DATA (Aggregates habit from last 7 days)
    if (action === "getProjectionData") {
      const hourlyAgg = new Array(24).fill(0);
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        const col = getColMap(data[0]);
        const now = new Date();
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const rDate = parseDateCell(row[col.date]);
          if (!rDate) continue;
          const diff = (now - rDate) / (1000 * 60 * 60 * 24);
          if (diff > 0 && diff <= 7) {
            const hourIdx = Math.floor(getDec(row[col.endHour], tz));
            const hrs = parseFloat(row[col.decimalHours]) || getDec(row[col.duration], tz);
            if (hourIdx >= 0 && hourIdx < 24 && hrs > 0) {
              hourlyAgg[hourIdx] += (hrs / 7);
            }
          }
        }
      }
      return JSON_RESPONSE(hourlyAgg);
    }

    // 3. GOAL DATA (Gauges & Schedule)
    if (action === "getGoalData") {
      let todayHours = 0;
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        const col = getColMap(data[0]);
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const rDate = parseDateCell(row[col.date]);
          if (!rDate) continue;
          if (Utilities.formatDate(rDate, tz, "yyyy-MM-dd") === todayStr) {
            const hrs = parseFloat(row[col.decimalHours]) || getDec(row[col.duration], tz);
            if (hrs > 0) todayHours += hrs;
          }
        }
      }
      const goal = parseFloat(props.getProperty("DAILY_GOAL")) || 4;
      return JSON_RESPONSE({ current: todayHours, goal: goal });
    }

    if (action === "getState") {
      const all = props.getProperties(), out = {};
      Object.keys(all).forEach(k => { if (/_(startTime|targetDuration)$/.test(k)) out[k] = all[k]; });
      return JSON_RESPONSE(out);
    }

    // Cache block for historical analytics
    const cache = CacheService.getUserCache();
    const cacheKey = "CACHE_DATA_" + todayStr;
    let cachedData = null;
    const raw = cache.get(cacheKey);
    if (raw) { try { cachedData = JSON.parse(raw); } catch (err) {} }
    if (!cachedData) {
      cachedData = buildCachedData(sheet, tz);
      try { cache.put(cacheKey, JSON.stringify(cachedData), 21600); } catch (err) {}
    }

    // 4. OTHER ANALYTICS ACTIONS
    if (action === "getGoal") return JSON_RESPONSE({ goal: parseFloat(props.getProperty("DAILY_GOAL")) || 4 });

    if (action === "getHourlyDistribution") {
      const result = [["Hour", "Intensity"]];
      cachedData.hourlyBuckets.forEach((val, h) => { result.push([h + ":00", parseFloat(val.toFixed(2))]); });
      return JSON_RESPONSE(result);
    }

    if (action === "getMountainData") {
      const mountain = [["Day", "Cumulative Hours"]];
      let runningTotal = 0;
      const sortedKeys = Object.keys(cachedData.dailyGroups).sort();
      sortedKeys.forEach(dayKey => {
        const group = cachedData.dailyGroups[dayKey];
        runningTotal += group.total;
        const label = group.displayDate || dayKey;
        mountain.push([label, parseFloat(runningTotal.toFixed(1))]);
      });
      return JSON_RESPONSE(mountain);
    }

    if (action === "getScatterData") {
      const points = [["Planned", "Actual"]];
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        const col = getColMap(data[0]);
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const targetRaw = String(row[col.target] || '').trim();
          const targetVal = /^\d+(\.\d+)?$/.test(targetRaw) ? parseFloat(targetRaw) : NaN;
          const actualHours = parseFloat(row[col.decimalHours]) || getDec(row[col.duration], tz);
          if (!isNaN(targetVal) && targetVal > 0 && actualHours > 0) {
            points.push([targetVal, parseFloat((actualHours * 60).toFixed(1))]);
          }
        }
      }
      return JSON_RESPONSE(points);
    }

    // 5. DEFAULT & getPlannerData: BAR CHARTS (Daily / Weekly / Monthly / Planner)
    const palette = ['#4285f4', '#34a853', '#fbbc05', '#ea4335', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad'];
    let dailyGroups = JSON.parse(JSON.stringify(cachedData.dailyGroups)) || {};
    let maxSessions = 0;

    // Add Today's Data into the chart groups
    if (sheet && sheet.getLastRow() > 1) {
      const data = sheet.getDataRange().getValues();
      const col = getColMap(data[0]);
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const rDate = parseDateCell(row[col.date]);
        if (!rDate) continue;
        if (Utilities.formatDate(rDate, tz, "yyyy-MM-dd") === todayStr) {
          const hrs = parseFloat(row[col.decimalHours]) || getDec(row[col.duration], tz);
          if (hrs <= 0) continue;
          const displayKey = Utilities.formatDate(rDate, tz, "MMM dd");
          if (!dailyGroups[todayStr]) dailyGroups[todayStr] = { displayDate: displayKey, total: 0, sessions: [] };
          dailyGroups[todayStr].total += hrs;
          dailyGroups[todayStr].sessions.push(hrs);
        }
      }
    }

    // Determine how many session columns we need
    Object.keys(dailyGroups).forEach(date => {
      if (dailyGroups[date].sessions.length > maxSessions) maxSessions = dailyGroups[date].sessions.length;
    });

    const header = ['Date'];
    for (let n = 0; n < maxSessions; n++) {
      header.push('S' + (n + 1)); header.push({ role: 'style' }); header.push({ role: 'tooltip' });
    }

    const result = [header];
    const sortedDates = Object.keys(dailyGroups).sort();

    sortedDates.forEach(dateKey => {
      const group = dailyGroups[dateKey];
      const row = [group.displayDate || dateKey];
      const sessions = group.sessions || [];
      for (let n = 0; n < maxSessions; n++) {
        if (sessions[n]) {
          row.push(sessions[n]);
          row.push(palette[n % palette.length]);
          row.push("Session " + (n + 1) + ": " + (sessions[n] * 60).toFixed(0) + "m");
        } else {
          row.push(0); row.push(''); row.push('');
        }
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

