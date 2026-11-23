/**
 * Single Canonical Study Log Queue
 * Handles resilient localStorage persistence, cross-tab serialization, monotonic session IDs,
 * exponential backoff with retry cap, and non-silent sync failure visibility.
 */
(function (root) {
  'use strict';

  var QUEUE_KEY = 'pendingStudyLogs';
  var LAST_TS_KEY = 'studyFlow_lastLogTs';
  var MAX_ATTEMPTS = 25;
  var BASE_RETRY_MS = 5000;
  var MAX_RETRY_MS = 5 * 60 * 1000;
  var retryTimer = null;
  var inTabFlushing = false;

  function resolveApiUrl() {
    if (typeof root.getEffectiveWebAppUrl === 'function') {
      return root.getEffectiveWebAppUrl();
    }
    return root.WEB_APP_URL || '/api/data';
  }

  function readQueue() {
    if (typeof root.safeGetJsonStorage === 'function') {
      return root.safeGetJsonStorage(QUEUE_KEY, [], Array.isArray);
    }
    try {
      var raw = root.localStorage ? root.localStorage.getItem(QUEUE_KEY) : null;
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeQueue(items) {
    var clean = Array.isArray(items) ? items : [];
    try {
      if (root.localStorage) {
        root.localStorage.setItem(QUEUE_KEY, JSON.stringify(clean));
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function nextUniqueTimestamp() {
    var now = Date.now();
    var prev = 0;
    try {
      prev = parseInt(root.localStorage ? root.localStorage.getItem(LAST_TS_KEY) : '0', 10) || 0;
    } catch (e) {}
    var ts = Math.max(now, prev + 1);
    try {
      if (root.localStorage) root.localStorage.setItem(LAST_TS_KEY, String(ts));
    } catch (e) {}
    return ts;
  }

  function ensureEntryShape(item) {
    if (!item || typeof item !== 'object') return null;
    var ts = typeof item.timestamp === 'number' && item.timestamp > 0 ? item.timestamp : nextUniqueTimestamp();
    return {
      id: item.id || ('log_' + ts + '_' + Math.random().toString(36).slice(2, 6)),
      type: item.type || 'Open',
      duration: item.duration || '00:00:00',
      target: item.target !== undefined && item.target !== null ? item.target : 'N/A',
      plant: item.plant || undefined,
      timestamp: ts,
      attempts: typeof item.attempts === 'number' ? item.attempts : 0,
      nextRetryAt: typeof item.nextRetryAt === 'number' ? item.nextRetryAt : 0,
      failedPermanent: Boolean(item.failedPermanent),
      lastError: item.lastError || ''
    };
  }

  function updateQueueStatusBanner(queue) {
    if (typeof document === 'undefined' || !document.body) return;
    var existing = document.getElementById('studyFlowSyncNotice');
    var list = Array.isArray(queue) ? queue : readQueue();
    var failedItems = list.filter(function (item) {
      return item && (item.failedPermanent || (item.attempts || 0) >= 1);
    });

    if (failedItems.length === 0) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      return;
    }

    var permCount = failedItems.filter(function (item) { return item.failedPermanent; }).length;
    var msg = permCount > 0
      ? permCount + ' session log(s) paused after repeated backend failures.'
      : failedItems.length + ' session log(s) waiting to sync with Google Sheets.';

    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'studyFlowSyncNotice';
      existing.style.cssText = 'position:fixed;bottom:76px;right:16px;z-index:9998;display:flex;align-items:center;gap:8px;background:#fff7ed;color:#9a3412;border:1px solid #fdba74;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.12);max-width:340px;';
      document.body.appendChild(existing);
    }

    existing.innerHTML = '';
    var textSpan = document.createElement('span');
    textSpan.textContent = msg;
    existing.appendChild(textSpan);

    var retryBtn = document.createElement('button');
    retryBtn.type = 'button';
    retryBtn.textContent = 'Retry';
    retryBtn.style.cssText = 'background:#ea580c;color:#fff;border:none;border-radius:5px;padding:4px 8px;font-size:11px;font-weight:700;cursor:pointer;';
    retryBtn.onclick = function () {
      var cur = readQueue().map(function (it) {
        if (!it) return it;
        return Object.assign({}, it, { attempts: 0, nextRetryAt: 0, failedPermanent: false });
      });
      writeQueue(cur);
      flushPendingStudyLogs(true);
    };
    existing.appendChild(retryBtn);
  }

  function scheduleNextRetry(queue) {
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
    var now = Date.now();
    var earliest = Infinity;
    (queue || []).forEach(function (raw) {
      var item = ensureEntryShape(raw);
      if (!item || item.failedPermanent || item.attempts >= MAX_ATTEMPTS) return;
      var at = item.nextRetryAt || now;
      if (at < earliest) earliest = at;
    });
    if (earliest < Infinity) {
      var delay = Math.max(1000, Math.min(MAX_RETRY_MS, earliest - now));
      retryTimer = setTimeout(function () {
        flushPendingStudyLogs(false);
      }, delay);
    }
  }

  async function runSerialized(fn) {
    if (typeof navigator !== 'undefined' && navigator.locks && typeof navigator.locks.request === 'function') {
      return navigator.locks.request('studyflow_log_queue_lock', fn);
    }
    if (inTabFlushing) return;
    inTabFlushing = true;
    try {
      return await fn();
    } finally {
      inTabFlushing = false;
    }
  }

  async function flushQueueUnlocked(forceAll) {
      var initialQueue = readQueue().map(ensureEntryShape).filter(Boolean);
      if (initialQueue.length === 0) {
        updateQueueStatusBanner([]);
        return;
      }

      var now = Date.now();
      var currentUrl = resolveApiUrl();
      var deliveredIds = new Set();
      var updatedById = new Map();
      var sentCount = 0;

      for (var i = 0; i < initialQueue.length; i++) {
        var item = initialQueue[i];
        if (!forceAll && (item.failedPermanent || item.attempts >= MAX_ATTEMPTS)) {
          continue;
        }
        if (!forceAll && item.nextRetryAt > now) {
          continue;
        }

        var payload = {
          type: item.type,
          duration: item.duration,
          target: item.target,
          timestamp: item.timestamp
        };
        if (item.plant) payload.plant = item.plant;

        try {
          var res = await fetch(currentUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
          });
          var text = (await res.text()).trim();
          if (res.ok && /^(Success|Duplicate)/.test(text)) {
            deliveredIds.add(item.id);
            sentCount++;
          } else {
            var nextAttempts = (item.attempts || 0) + 1;
            var backoff = Math.min(MAX_RETRY_MS, BASE_RETRY_MS * Math.pow(2, nextAttempts - 1));
            updatedById.set(item.id, Object.assign({}, item, {
              attempts: nextAttempts,
              nextRetryAt: Date.now() + backoff,
              failedPermanent: nextAttempts >= MAX_ATTEMPTS,
              lastError: 'HTTP ' + res.status + (text ? ': ' + text.slice(0, 80) : '')
            }));
          }
        } catch (err) {
          var errAttempts = (item.attempts || 0) + 1;
          var errBackoff = Math.min(MAX_RETRY_MS, BASE_RETRY_MS * Math.pow(2, errAttempts - 1));
          updatedById.set(item.id, Object.assign({}, item, {
            attempts: errAttempts,
            nextRetryAt: Date.now() + errBackoff,
            failedPermanent: errAttempts >= MAX_ATTEMPTS,
            lastError: err && err.message ? err.message : 'Network error'
          }));
        }
      }

      // Re-read latest queue before writing so concurrent tabs never drop entries
      var latestQueue = readQueue().map(ensureEntryShape).filter(Boolean);
      var seenIds = new Set();
      var finalQueue = [];

      for (var j = 0; j < latestQueue.length; j++) {
        var cur = latestQueue[j];
        if (deliveredIds.has(cur.id) || seenIds.has(cur.id)) continue;
        seenIds.add(cur.id);
        finalQueue.push(updatedById.has(cur.id) ? updatedById.get(cur.id) : cur);
      }

      writeQueue(finalQueue);
      updateQueueStatusBanner(finalQueue);
      scheduleNextRetry(finalQueue);

      if (sentCount > 0 && typeof root.refreshAllDashboardMetrics === 'function') {
        setTimeout(root.refreshAllDashboardMetrics, 2500);
        setTimeout(root.refreshAllDashboardMetrics, 5500);
      }
  }

  async function flushPendingStudyLogs(forceAll) {
    return runSerialized(function () {
      return flushQueueUnlocked(forceAll);
    });
  }

  function logData(type, duration, target, plant) {
    var ts = nextUniqueTimestamp();
    var entry = ensureEntryShape({
      id: 'log_' + ts + '_' + Math.random().toString(36).slice(2, 6),
      type: type,
      duration: duration,
      target: target,
      plant: plant || undefined,
      timestamp: ts,
      attempts: 0,
      nextRetryAt: 0,
      failedPermanent: false
    });

    runSerialized(async function () {
      var q = readQueue().map(ensureEntryShape).filter(Boolean);
      q.push(entry);
      writeQueue(q);
      await flushQueueUnlocked(false);
    });
  }

  root.flushPendingStudyLogs = flushPendingStudyLogs;
  root.logData = logData;

  root.addEventListener('online', function () {
    flushPendingStudyLogs(false);
  });
  root.addEventListener('DOMContentLoaded', function () {
    updateQueueStatusBanner(readQueue());
    flushPendingStudyLogs(false);
  });
  root.addEventListener('storage', function (e) {
    if (e.key === QUEUE_KEY) {
      updateQueueStatusBanner(readQueue());
    }
  });
  root.addEventListener('studyflow:config-updated', function () {
    flushPendingStudyLogs(true);
  });
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
