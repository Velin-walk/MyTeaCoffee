var WEB_APP_URL = window.WEB_APP_URL || (function () {
  const DEFAULT = "https://script.google.com/macros/s/AKfycbwXOTn__dyqNI-8JvsTPEGtC4OPJYuC9-_jqIlq-lutQZDeQzlmM-46XwWAmWYQu8mT/exec";
  try { return localStorage.getItem('study_custom_gas_url') || DEFAULT; }
  catch (e) { return DEFAULT; }
})();
window.WEB_APP_URL = WEB_APP_URL;

async function flushPendingStudyLogs() {
  if (window._flushing) return;
  window._flushing = true;
  try {
    let q = JSON.parse(localStorage.getItem('pendingStudyLogs') || '[]');
    if (!Array.isArray(q) || q.length === 0) return;
    
    const remaining = [];
    let sentCount = 0;
    const currentUrl = window.WEB_APP_URL || (function () {
      const DEFAULT = "https://script.google.com/macros/s/AKfycbwXOTn__dyqNI-8JvsTPEGtC4OPJYuC9-_jqIlq-lutQZDeQzlmM-46XwWAmWYQu8mT/exec";
      try { return localStorage.getItem('study_custom_gas_url') || DEFAULT; }
      catch (e) { return DEFAULT; }
    })();

    for (const item of q) {
      try {
        const res = await fetch(currentUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(item)
        });
        const t = await res.text();
        if (!/^(Success|Duplicate)/.test(t)) {
          remaining.push(item);
        } else {
          sentCount++;
        }
      } catch (e) {
        remaining.push(item);
      }
    }
    localStorage.setItem('pendingStudyLogs', JSON.stringify(remaining));

    if (sentCount > 0 && typeof refreshAllDashboardMetrics === 'function') {
      setTimeout(refreshAllDashboardMetrics, 2500);
      setTimeout(refreshAllDashboardMetrics, 5500);
    }
  } finally {
    window._flushing = false;
  }
}

function logData(type, duration, target) {
  const q = JSON.parse(localStorage.getItem('pendingStudyLogs') || '[]');
  q.push({ type, duration, target, timestamp: Date.now() });
  localStorage.setItem('pendingStudyLogs', JSON.stringify(q));
  flushPendingStudyLogs();
}

window.flushPendingStudyLogs = flushPendingStudyLogs;
window.logData = logData;

window.addEventListener('online', flushPendingStudyLogs);
window.addEventListener('DOMContentLoaded', flushPendingStudyLogs);
