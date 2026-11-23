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

  const claimed = {};
  const matched = {};

  // Pass 1: exact canonical headers always take precedence
  headerRow.forEach((cell, idx) => {
    const h = String(cell || '').trim().toLowerCase();
    if (!h) return;
    if (h === 'date') { map.date = idx; matched.date = true; claimed[idx] = true; }
    else if (h === 'timer type' || h === 'type') { map.type = idx; matched.type = true; claimed[idx] = true; }
    else if (h === 'target (min)' || h === 'target') { map.target = idx; matched.target = true; claimed[idx] = true; }
    else if (h === 'actual duration' || h === 'duration') { map.duration = idx; matched.duration = true; claimed[idx] = true; }
    else if (h === 'end hour' || h === 'end time (hr)') { map.endHour = idx; matched.endHour = true; claimed[idx] = true; }
    else if (h === 'decimal hours' || h === 'decimalhours') { map.decimalHours = idx; matched.decimalHours = true; claimed[idx] = true; }
    else if (h === 'plant') { map.plant = idx; matched.plant = true; claimed[idx] = true; }
    else if (h === 'session id' || h === 'epoch') { map.sessionId = idx; matched.sessionId = true; claimed[idx] = true; }
  });

  // Pass 2: legacy export aliases only fill unmatched slots and never overwrite canonical columns
  headerRow.forEach((cell, idx) => {
    if (claimed[idx]) return;
    const h = String(cell || '').trim().toLowerCase();
    if (!h) return;
    if (h === 'timestamp' && !matched.endHour) { map.endHour = idx; matched.endHour = true; claimed[idx] = true; }
    else if (h === 'column 1' && !matched.decimalHours) { map.decimalHours = idx; matched.decimalHours = true; claimed[idx] = true; }
    else if (h === 'column 2' && !matched.sessionId) { map.sessionId = idx; matched.sessionId = true; claimed[idx] = true; }
  });

  return map;
}

function buildValidLocalDate(year, month, day, hour, minute, second) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
  if (isNaN(d.getTime())) return null;
  if (d.getFullYear() !== year || d.getMonth() !== (month - 1) || d.getDate() !== day) return null;
  return d;
}

function parseDateCell(val) {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;

  const str = String(val).trim();
  if (!str) return null;

  // Handle yyyy-MM-dd (with optional time) unambiguously
  const iso = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (iso) {
    return buildValidLocalDate(
      parseInt(iso[1], 10),
      parseInt(iso[2], 10),
      parseInt(iso[3], 10),
      parseInt(iso[4] || '0', 10),
      parseInt(iso[5] || '0', 10),
      parseInt(iso[6] || '0', 10)
    );
  }

  // Handle dd/MM/yyyy (primary sheet format) and unambiguous MM/dd/yyyy text cells
  const slash = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (slash) {
    const first = parseInt(slash[1], 10);
    const second = parseInt(slash[2], 10);
    const year = parseInt(slash[3], 10);
    const h = parseInt(slash[4] || '0', 10);
    const m = parseInt(slash[5] || '0', 10);
    const s = parseInt(slash[6] || '0', 10);

    if (second <= 12) {
      const asDmy = buildValidLocalDate(year, second, first, h, m, s);
      if (asDmy) return asDmy;
    }
    if (first <= 12 && second > 12) {
      const asMdy = buildValidLocalDate(year, first, second, h, m, s);
      if (asMdy) return asMdy;
    }
    return null;
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

function getRowDecimalHours(row, col, tz) {
  const rawDec = parseFloat(row[col.decimalHours]);
  if (!isNaN(rawDec) && rawDec > 0) return rawDec;
  return getDec(row[col.duration], tz);
}

function getRowEndHour(row, col, dateObj, tz) {
  const rawEnd = row[col.endHour];
  if (rawEnd !== '' && rawEnd !== null && rawEnd !== undefined) {
    const endVal = getDec(rawEnd, tz);
    if (endVal > 0) return endVal;
  }
  if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
    const [h, m, s] = Utilities.formatDate(dateObj, tz, "H:m:s").split(":").map(Number);
    const fromDate = h + (m / 60) + ((s || 0) / 3600);
    if (fromDate > 0) return fromDate;
  }
  return 0;
}

function dedupeDaySessions(sessions) {
  const out = [];
  for (let i = 0; i < sessions.length; i++) {
    const cand = sessions[i];
    let matchedIdx = -1;
    for (let j = 0; j < out.length; j++) {
      const prev = out[j];
      if (cand.sessionId && prev.sessionId && cand.sessionId === prev.sessionId) {
        matchedIdx = j;
        break;
      }
      if (Math.abs(cand.end - prev.end) <= 0.02 && Math.abs(cand.hrs - prev.hrs) <= 0.02) {
        matchedIdx = j;
        break;
      }
    }
    if (matchedIdx === -1) {
      out.push({ ...cand });
    } else {
      if (!out[matchedIdx].plant && cand.plant) out[matchedIdx].plant = cand.plant;
      if (!out[matchedIdx].sessionId && cand.sessionId) out[matchedIdx].sessionId = cand.sessionId;
      if (out[matchedIdx].target === 'N/A' && cand.target !== 'N/A') out[matchedIdx].target = cand.target;
    }
  }
  return out;
}

function mergeOverlappingIntervals(sessions) {
  const deduped = dedupeDaySessions(sessions);
  const timed = [];
  const untimed = [];
  deduped.forEach(s => {
    if (s.end > 0) timed.push({ ...s });
    else untimed.push({ ...s });
  });
  timed.sort((a, b) => a.start - b.start || a.end - b.end);

  const merged = [];
  for (let i = 0; i < timed.length; i++) {
    const curr = timed[i];
    if (merged.length === 0) {
      merged.push(curr);
      continue;
    }
    const prev = merged[merged.length - 1];
    if (curr.start < prev.end - 0.001) {
      prev.start = Math.min(prev.start, curr.start);
      prev.end = Math.max(prev.end, curr.end);
      prev.hrs = Math.max(0, prev.end - prev.start);
      if (!prev.plant && curr.plant) prev.plant = curr.plant;
    } else {
      merged.push(curr);
    }
  }
  return merged.concat(untimed);
}

function isDuplicateSessionInSheet(sheet, sessionId) {
  if (!sheet || !sessionId) return false;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const col = getColMap(headerRow);
  if (col.sessionId < 0 || col.sessionId >= sheet.getLastColumn()) return false;

  const rowCount = lastRow - 1;
  const ids = sheet.getRange(2, col.sessionId + 1, rowCount, 1).getValues();
  const targetId = String(sessionId).trim();
  for (let i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0] || '').trim() === targetId) return true;
  }
  return false;
}

function doPost(e) {
  try {
    const rawBody = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    const params = JSON.parse(rawBody);
    if (!params || typeof params !== 'object') {
      return ContentService.createTextOutput("Error: Invalid payload").setMimeType(ContentService.MimeType.TEXT);
    }
    const props = PropertiesService.getUserProperties();

    // Save Daily Goal
    if (params.action === "setGoal") {
      const goalVal = parseFloat(params.goal);
      if (isNaN(goalVal) || goalVal <= 0) {
        return ContentService.createTextOutput("Error: Invalid goal").setMimeType(ContentService.MimeType.TEXT);
      }
      props.setProperty("DAILY_GOAL", String(goalVal));
      return ContentService.createTextOutput("Goal Saved").setMimeType(ContentService.MimeType.TEXT);
    }

    // Save Cross-Device Active Timer / Selected Plant State
    if (params.action === "saveState") {
      const stateType = String(params.type || 'Open').trim().replace(/[^a-zA-Z0-9_-]/g, '');
      if (!stateType) {
        return ContentService.createTextOutput("Error: Missing state type").setMimeType(ContentService.MimeType.TEXT);
      }
      const startVal = Number(params.startTime);
      if (!params.startTime || isNaN(startVal) || startVal <= 0) {
        props.deleteProperty(stateType + "_startTime");
        props.deleteProperty(stateType + "_targetDuration");
        return ContentService.createTextOutput("State Cleared").setMimeType(ContentService.MimeType.TEXT);
      }
      props.setProperty(stateType + "_startTime", String(startVal));
      if (params.targetDuration !== undefined && params.targetDuration !== null && params.targetDuration !== '') {
        props.setProperty(stateType + "_targetDuration", String(params.targetDuration));
      } else {
        props.deleteProperty(stateType + "_targetDuration");
      }
      return ContentService.createTextOutput("State Saved").setMimeType(ContentService.MimeType.TEXT);
    }

    const cache = CacheService.getUserCache();
    const sessionId = params.timestamp ? String(params.timestamp).trim() : "";
    const id = "log_" + sessionId;
    if (sessionId && cache.get(id)) {
      return ContentService.createTextOutput("Duplicate").setMimeType(ContentService.MimeType.TEXT);
    }

    const lock = LockService.getScriptLock();
    if (!lock.tryLock(15000)) {
      return ContentService.createTextOutput("Error: Busy, retry shortly").setMimeType(ContentService.MimeType.TEXT);
    }

    try {
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
      const sessionType = params.type === "Target" ? "Forest" : (params.type || "Open");
      const rowSessionId = sessionId || String(now.getTime());

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
      rowOut[col.sessionId] = rowSessionId;

      sheet.appendRow(rowOut);

      cache.put("log_" + rowSessionId, "1", 21600);
      cache.remove("CACHE_DATA_" + getTodayStr(tz));

      props.deleteProperty(sessionType + "_startTime");
      props.deleteProperty(sessionType + "_targetDuration");
      return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    } finally {
      lock.releaseLock();
    }
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

  const rawByDay = {};
  const displayKeyByDay = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const dateObj = parseDateCell(row[col.date]);
    if (!dateObj) continue;

    const dateStr = Utilities.formatDate(dateObj, tz, "yyyy-MM-dd");
    if (dateStr === todayStr) continue;

    const decimalHours = getRowDecimalHours(row, col, tz);
    if (decimalHours <= 0) continue;

    const endTime = getRowEndHour(row, col, dateObj, tz);
    const startTime = endTime > 0 ? Math.max(0, endTime - decimalHours) : 0;
    const sessionId = col.sessionId >= 0 ? String(row[col.sessionId] || '').trim() : '';

    if (!rawByDay[dateStr]) {
      rawByDay[dateStr] = [];
      displayKeyByDay[dateStr] = Utilities.formatDate(dateObj, tz, "MMM dd");
    }
    rawByDay[dateStr].push({
      start: startTime,
      end: endTime,
      hrs: decimalHours,
      sessionId: sessionId,
      plant: extractPlantFromRow(row, col)
    });
  }

  let dailyGroups = {};
  let hourlyBuckets = new Array(24).fill(0);
  let cumulativeTotal = 0;

  Object.keys(rawByDay).sort().forEach(dateStr => {
    const merged = mergeOverlappingIntervals(rawByDay[dateStr]);
    const sessions = [];
    let dayTotal = 0;
    const dayHours = new Array(24).fill(0);

    merged.forEach(s => {
      if (s.hrs <= 0) return;
      dayTotal += s.hrs;
      sessions.push(s.hrs);
      if (s.end > 0) {
        for (let h = 0; h < 24; h++) {
          const overlapStart = Math.max(h, s.start);
          const overlapEnd = Math.min(h + 1, s.end);
          if (overlapEnd > overlapStart) {
            dayHours[h] = Math.min(1, dayHours[h] + (overlapEnd - overlapStart));
          }
        }
      }
    });

    if (dayTotal > 0) {
      dailyGroups[dateStr] = { displayDate: displayKeyByDay[dateStr], total: dayTotal, sessions: sessions };
      cumulativeTotal += dayTotal;
      for (let h = 0; h < 24; h++) {
        hourlyBuckets[h] += dayHours[h];
      }
    }
  });

  return { dailyGroups, hourlyBuckets, cumulativeTotal };
}

function doGet(e) {
  try {
    if (!e || !e.parameter) return JSON_RESPONSE([["Error", "No parameters"]]);

    const action = e.parameter.action;
    if (action === "version") {
      return JSON_RESPONSE({ ok: true, schema: LOGS_HEADERS, version: "2.3-data-integrity-fix" });
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

      const rawDay = [];
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        const col = getColMap(data[0]);
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const rDate = parseDateCell(row[col.date]);
          if (!rDate) continue;
          if (Utilities.formatDate(rDate, tz, "yyyy-MM-dd") === targetStr) {
            const hrs = getRowDecimalHours(row, col, tz);
            if (hrs <= 0) continue;

            const timeVal = getRowEndHour(row, col, rDate, tz);
            const start = Math.max(0, timeVal - hrs);
            const sessionId = col.sessionId >= 0 ? String(row[col.sessionId] || '').trim() : '';
            rawDay.push({
              hrs: hrs,
              start: start,
              end: timeVal,
              sessionId: sessionId,
              plant: extractPlantFromRow(row, col)
            });
          }
        }
      }
      const sessions = dedupeDaySessions(rawDay).map(s => {
        const item = { hrs: parseFloat(s.hrs.toFixed(4)), start: parseFloat(s.start.toFixed(4)) };
        if (s.plant) item.plant = s.plant;
        return item;
      });
      return JSON_RESPONSE(sessions);
    }

    // 1b. FULL FOREST HISTORY DATA (All rows with Date, Start, Duration, Plant)
    if (action === "getForestData") {
      const byDay = {};
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        const col = getColMap(data[0]);
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const rDate = parseDateCell(row[col.date]);
          if (!rDate) continue;

          const hrs = getRowDecimalHours(row, col, tz);
          if (hrs <= 0) continue;

          const dateStr = Utilities.formatDate(rDate, tz, "yyyy-MM-dd");
          const timeVal = getRowEndHour(row, col, rDate, tz);
          const start = Math.max(0, timeVal - hrs);
          const sessionId = col.sessionId >= 0 ? String(row[col.sessionId] || '').trim() : '';

          if (!byDay[dateStr]) byDay[dateStr] = [];
          byDay[dateStr].push({
            hrs: hrs,
            start: start,
            end: timeVal,
            sessionId: sessionId,
            plant: extractPlantFromRow(row, col)
          });
        }
      }
      const sessions = [];
      Object.keys(byDay).sort().forEach(dateStr => {
        dedupeDaySessions(byDay[dateStr]).forEach(s => {
          const item = {
            date: dateStr,
            hrs: parseFloat(s.hrs.toFixed(4)),
            start: parseFloat(s.start.toFixed(4))
          };
          if (s.plant) item.plant = s.plant;
          sessions.push(item);
        });
      });
      return JSON_RESPONSE(sessions);
    }

    // 2. PROJECTION DATA (Aggregates habit from last 7 days)
    if (action === "getProjectionData") {
      const hourlyAgg = new Array(24).fill(0);
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        const col = getColMap(data[0]);
        const now = new Date();
        const rawByDay = {};
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const rDate = parseDateCell(row[col.date]);
          if (!rDate) continue;
          const diff = (now - rDate) / (1000 * 60 * 60 * 24);
          if (diff > 0 && diff <= 7) {
            const hrs = getRowDecimalHours(row, col, tz);
            if (hrs <= 0) continue;
            const dateStr = Utilities.formatDate(rDate, tz, "yyyy-MM-dd");
            const endTime = getRowEndHour(row, col, rDate, tz);
            const startTime = endTime > 0 ? Math.max(0, endTime - hrs) : 0;
            const sessionId = col.sessionId >= 0 ? String(row[col.sessionId] || '').trim() : '';
            if (!rawByDay[dateStr]) rawByDay[dateStr] = [];
            rawByDay[dateStr].push({ start: startTime, end: endTime, hrs: hrs, sessionId: sessionId });
          }
        }
        Object.keys(rawByDay).forEach(dateStr => {
          mergeOverlappingIntervals(rawByDay[dateStr]).forEach(s => {
            const hourIdx = Math.floor(s.end);
            if (hourIdx >= 0 && hourIdx < 24 && s.hrs > 0) {
              hourlyAgg[hourIdx] += (s.hrs / 7);
            }
          });
        });
      }
      return JSON_RESPONSE(hourlyAgg);
    }

    // 3. GOAL DATA (Gauges & Schedule)
    if (action === "getGoalData") {
      let todayHours = 0;
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        const col = getColMap(data[0]);
        const todayRaw = [];
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const rDate = parseDateCell(row[col.date]);
          if (!rDate) continue;
          if (Utilities.formatDate(rDate, tz, "yyyy-MM-dd") === todayStr) {
            const hrs = getRowDecimalHours(row, col, tz);
            if (hrs > 0) {
              const endTime = getRowEndHour(row, col, rDate, tz);
              const startTime = endTime > 0 ? Math.max(0, endTime - hrs) : 0;
              const sessionId = col.sessionId >= 0 ? String(row[col.sessionId] || '').trim() : '';
              todayRaw.push({ start: startTime, end: endTime, hrs: hrs, sessionId: sessionId });
            }
          }
        }
        mergeOverlappingIntervals(todayRaw).forEach(s => { todayHours += s.hrs; });
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

    // Add Today's Data into the chart groups (deduplicated & overlap-merged)
    if (sheet && sheet.getLastRow() > 1) {
      const data = sheet.getDataRange().getValues();
      const col = getColMap(data[0]);
      const todayRaw = [];
      let todayDisplay = '';
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const rDate = parseDateCell(row[col.date]);
        if (!rDate) continue;
        if (Utilities.formatDate(rDate, tz, "yyyy-MM-dd") === todayStr) {
          const hrs = getRowDecimalHours(row, col, tz);
          if (hrs <= 0) continue;
          if (!todayDisplay) todayDisplay = Utilities.formatDate(rDate, tz, "MMM dd");
          const endTime = getRowEndHour(row, col, rDate, tz);
          const startTime = endTime > 0 ? Math.max(0, endTime - hrs) : 0;
          const sessionId = col.sessionId >= 0 ? String(row[col.sessionId] || '').trim() : '';
          todayRaw.push({ start: startTime, end: endTime, hrs: hrs, sessionId: sessionId });
        }
      }
      const todayMerged = mergeOverlappingIntervals(todayRaw);
      if (todayMerged.length > 0) {
        dailyGroups[todayStr] = { displayDate: todayDisplay, total: 0, sessions: [] };
        todayMerged.forEach(s => {
          dailyGroups[todayStr].total += s.hrs;
          dailyGroups[todayStr].sessions.push(s.hrs);
        });
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

function formatDurationHMS(decimalHours) {
  const totalSecs = Math.max(0, Math.round((decimalHours || 0) * 3600));
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

/**
 * Manual Sheet Maintenance Script (run from Apps Script Editor > Run > cleanupLogsSheet):
 * - Backs up `Logs` into `Logs_Backup` first
 * - Drops short test sessions (< 2 minutes)
 * - Removes duplicate saves and merges overlapping same-day intervals
 * - Aligns Date timestamps with End Hour & normalizes legacy 'Target' type
 * - Backfills missing epoch-ms Session IDs in Column H
 */
function cleanupLogsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Logs');
  if (!sheet || sheet.getLastRow() < 2) return;

  const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  const data = sheet.getDataRange().getValues();
  const col = getColMap(data[0]);

  // 1. Save safety backup snapshot before modifying `Logs`
  let backup = ss.getSheetByName('Logs_Backup');
  if (!backup) backup = ss.insertSheet('Logs_Backup');
  backup.clearContents();
  backup.getRange(1, 1, data.length, data[0].length).setValues(data);

  const byDay = {};
  let droppedShort = 0;
  let fixedDates = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rDate = parseDateCell(row[col.date]);
    if (!rDate) continue;

    const hrs = getRowDecimalHours(row, col, tz);
    if (hrs <= 0) continue;

    // Drop short test/accidental sessions (< 2 minutes)
    if (hrs * 60 < 2) {
      droppedShort++;
      continue;
    }

    const endHour = getRowEndHour(row, col, rDate, tz);
    const startHour = endHour > 0 ? Math.max(0, endHour - hrs) : 0;

    // Align Date time-of-day with End Hour when missing (midnight) or mismatched (> 3 min)
    const [dh, dm, ds] = Utilities.formatDate(rDate, tz, "H:m:s").split(":").map(Number);
    const dateDec = dh + (dm / 60) + ((ds || 0) / 3600);
    let alignedDate = rDate;
    if (endHour > 0 && (dateDec === 0 || Math.abs(dateDec - endHour) > 0.05)) {
      const totalEndSecs = Math.min(86399, Math.max(0, Math.round(endHour * 3600)));
      const eh = Math.floor(totalEndSecs / 3600);
      const em = Math.floor((totalEndSecs % 3600) / 60);
      const es = totalEndSecs % 60;
      alignedDate = new Date(rDate.getFullYear(), rDate.getMonth(), rDate.getDate(), eh, em, es);
      fixedDates++;
    }

    const parsedTP = parseTargetAndPlant(row[col.target], extractPlantFromRow(row, col));
    const rawType = String(row[col.type] || 'Open').trim();
    const normType = rawType === 'Target' ? 'Forest' : (rawType || 'Open');
    const sessionId = col.sessionId >= 0 ? String(row[col.sessionId] || '').trim() : '';
    const dateStr = Utilities.formatDate(alignedDate, tz, "yyyy-MM-dd");

    if (!byDay[dateStr]) byDay[dateStr] = [];
    byDay[dateStr].push({
      dateObj: alignedDate,
      type: normType,
      target: parsedTP.target,
      hrs: hrs,
      start: startHour,
      end: endHour,
      plant: parsedTP.plant,
      sessionId: sessionId
    });
  }

  const outRows = [LOGS_HEADERS];
  let mergedOrRemovedOverlaps = 0;
  let backfilledIds = 0;
  const usedIds = {};

  Object.keys(byDay).sort().forEach(dateStr => {
    const rawList = byDay[dateStr];
    const cleanList = mergeOverlappingIntervals(rawList).sort((a, b) => a.end - b.end);
    mergedOrRemovedOverlaps += Math.max(0, rawList.length - cleanList.length);

    cleanList.forEach((s, idx) => {
      let sid = s.sessionId;
      if (!sid) {
        let baseMs = s.dateObj.getTime();
        while (usedIds[String(baseMs)]) baseMs++;
        sid = String(baseMs);
        backfilledIds++;
      }
      usedIds[sid] = true;

      outRows.push([
        s.dateObj,
        s.type,
        s.target,
        formatDurationHMS(s.hrs),
        parseFloat((s.end || 0).toFixed(4)),
        parseFloat(s.hrs.toFixed(4)),
        s.plant || '',
        sid
      ]);
    });
  });

  sheet.clearContents();
  sheet.getRange(1, 1, outRows.length, LOGS_HEADERS.length).setValues(outRows);
  if (outRows.length > 1) {
    sheet.getRange(2, 1, outRows.length - 1, 1).setNumberFormat('dd/MM/yyyy HH:mm:ss');
  }
  CacheService.getUserCache().remove("CACHE_DATA_" + getTodayStr(tz));

  Logger.log(
    'cleanupLogsSheet complete: kept=%s, droppedShort=%s, mergedOrDeduped=%s, fixedDates=%s, backfilledIds=%s',
    outRows.length - 1,
    droppedShort,
    mergedOrRemovedOverlaps,
    fixedDates,
    backfilledIds
  );
}


