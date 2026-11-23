/**
 * Global Quote Loader & 1-Minute Top Bar Rotator
 * Displays one quote at a time for 1 minute (60,000 ms) at the top of every page.
 */
(function (root) {
  'use strict';

  var STORAGE_QUOTES_KEY = 'studyFlow_quotes_v1';
  var STORAGE_STATE_KEY = 'studyFlow_quoteState_v1';
  var STORAGE_INIT_KEY = 'studyFlow_quotes_initialized_v1';
  var STORAGE_SEED_V2_KEY = 'studyFlow_quotes_seed_v2';
  var ROTATION_MS = 60 * 1000; // 1 minute per quote

  var DEFAULT_QUOTES = [
    { id: 'q-init-1', text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
    { id: 'q-init-2', text: 'A focused mind is the seed of true mastery.', author: '' },
    { id: 'q-init-3', text: 'Small daily improvements over time lead to stunning results.', author: 'Robin Sharma' },
    { id: 'q-init-4', text: 'Pain is temporary. Quitting lasts forever.', author: 'Lance Armstrong' },
    { id: 'q-init-5', text: 'Pain is the price you pay for success.', author: '' },
    { id: 'q-init-6', text: 'We struggle with the complexities and avoid the simplicities.', author: 'Norman Vincent Peale' }
  ];

  var isLoaderOpen = false;
  var tickerId = null;

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function loadQuotes() {
    try {
      var initialized = localStorage.getItem(STORAGE_INIT_KEY);
      var raw = localStorage.getItem(STORAGE_QUOTES_KEY);
      if (!initialized && !raw) {
        localStorage.setItem(STORAGE_INIT_KEY, '1');
        localStorage.setItem(STORAGE_SEED_V2_KEY, '1');
        localStorage.setItem(STORAGE_QUOTES_KEY, JSON.stringify(DEFAULT_QUOTES));
        return DEFAULT_QUOTES.slice();
      }
      var parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      var list = parsed.filter(function (q) { return q && typeof q.text === 'string' && q.text.trim().length > 0; });
      if (!localStorage.getItem(STORAGE_SEED_V2_KEY)) {
        var added = false;
        DEFAULT_QUOTES.slice(3).forEach(function (dq) {
          var exists = list.some(function (q) { return q.id === dq.id || q.text.trim() === dq.text; });
          if (!exists) {
            list.push(dq);
            added = true;
          }
        });
        localStorage.setItem(STORAGE_SEED_V2_KEY, '1');
        if (added) {
          localStorage.setItem(STORAGE_QUOTES_KEY, JSON.stringify(list));
        }
      }
      return list;
    } catch (e) {
      return DEFAULT_QUOTES.slice();
    }
  }

  function saveQuotes(quotes) {
    try {
      localStorage.setItem(STORAGE_INIT_KEY, '1');
      localStorage.setItem(STORAGE_QUOTES_KEY, JSON.stringify(quotes));
    } catch (e) {}
  }

  function loadState(count) {
    var now = Date.now();
    try {
      var raw = localStorage.getItem(STORAGE_STATE_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed.index === 'number' && typeof parsed.startedAt === 'number') {
        var idx = count > 0 ? ((parsed.index % count) + count) % count : 0;
        return { index: idx, startedAt: parsed.startedAt };
      }
    } catch (e) {}
    var initial = { index: 0, startedAt: now };
    saveState(initial);
    return initial;
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function parseQuoteLine(line) {
    var clean = String(line || '').trim();
    if (!clean) return null;
    // Strip wrapping straight or curly double quotes if user pasted them
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith('\u201c') && clean.endsWith('\u201d'))) {
      clean = clean.slice(1, -1).trim();
    }
    if (!clean) return null;

    var author = '';
    var text = clean;
    var sepMatch = clean.match(/^(.*?)\s+(?:\u2014|--|\u2013)\s+(.{1,80})$/);
    if (sepMatch && sepMatch[1].trim()) {
      text = sepMatch[1].trim();
      author = sepMatch[2].trim();
    }
    return {
      id: 'q-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      text: text,
      author: author
    };
  }

  function syncRotationTick() {
    var quotes = loadQuotes();
    if (quotes.length === 0) return;

    var state = loadState(quotes.length);
    var now = Date.now();
    var elapsed = Math.max(0, now - state.startedAt);

    if (quotes.length > 1 && elapsed >= ROTATION_MS) {
      var steps = Math.floor(elapsed / ROTATION_MS);
      state.index = (state.index + steps) % quotes.length;
      state.startedAt = state.startedAt + steps * ROTATION_MS;
      // Guard against huge jumps after sleep
      if (now - state.startedAt >= ROTATION_MS) {
        state.startedAt = now;
      }
      saveState(state);
      renderQuoteUI();
      return;
    }

    var countdownEl = document.getElementById('globalQuoteCountdown');
    if (countdownEl) {
      if (quotes.length <= 1) {
        countdownEl.textContent = quotes.length === 1 ? '1 / 1' : '0';
      } else {
        var remaining = Math.max(1, Math.ceil((ROTATION_MS - elapsed) / 1000));
        countdownEl.textContent = (state.index + 1) + '/' + quotes.length + ' · ' + remaining + 's';
      }
    }
  }

  function renderQuoteUI(statusMsg) {
    var host = document.getElementById('globalQuoteHost');
    if (!host) return;

    var quotes = loadQuotes();
    var state = loadState(quotes.length);
    var active = quotes.length > 0 ? quotes[state.index] : null;
    var elapsed = Math.max(0, Date.now() - state.startedAt);
    var remaining = Math.max(1, Math.ceil((ROTATION_MS - (elapsed % ROTATION_MS)) / 1000));
    var countPillText = quotes.length === 0
      ? '0 quotes'
      : (quotes.length === 1 ? '1 / 1' : (state.index + 1) + '/' + quotes.length + ' · ' + remaining + 's');

    var activeMarkup = active
      ? '<span class="quote-mark-icon" aria-hidden="true">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>' +
            '<path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>' +
          '</svg>' +
        '</span>' +
        '<p class="quote-active-text">&ldquo;' + escapeHtml(active.text) + '&rdquo;' +
          (active.author ? ' <span class="quote-active-author">&mdash; ' + escapeHtml(active.author) + '</span>' : '') +
        '</p>'
      : '<span class="quote-empty-hint">No quotes loaded yet. Open <strong>Quote Loader</strong> to add quotes.</span>';

    var listMarkup = quotes.length > 0
      ? quotes.map(function (q, idx) {
          var isCurr = idx === state.index;
          return (
            '<div class="quote-list-item' + (isCurr ? ' is-active' : '') + '" onclick="window.selectGlobalQuote(' + idx + ')" title="Show this quote for 1 minute">' +
              '<span class="quote-list-text">&ldquo;' + escapeHtml(q.text) + '&rdquo;' +
                (q.author ? ' <span style="color:var(--text-secondary);">— ' + escapeHtml(q.author) + '</span>' : '') +
              '</span>' +
              (isCurr ? '<span class="quote-list-badge">Showing</span>' : '') +
              '<button type="button" class="quote-list-del" onclick="event.stopPropagation(); window.removeGlobalQuote(' + idx + ');" title="Delete quote" aria-label="Delete quote">&times;</button>' +
            '</div>'
          );
        }).join('')
      : '<div class="quote-empty-hint" style="padding:4px 2px;">Your quote list is empty. Add quotes above to rotate every 1 minute.</div>';

    var existingInput = document.getElementById('quoteLoaderInput');
    var preservedDraft = existingInput ? existingInput.value : '';

    host.innerHTML =
      '<div class="quote-shell-box">' +
        '<div class="quote-top-bar">' +
          '<div class="quote-active-wrap">' + activeMarkup + '</div>' +
          '<div class="quote-bar-controls">' +
            '<span id="globalQuoteCountdown" class="quote-meta-pill" title="Rotates every 1 minute">' + countPillText + '</span>' +
            (quotes.length > 1
              ? '<button type="button" class="quote-nav-btn" onclick="window.prevGlobalQuote()" title="Previous quote" aria-label="Previous quote">&lsaquo;</button>' +
                '<button type="button" class="quote-nav-btn" onclick="window.nextGlobalQuote()" title="Next quote" aria-label="Next quote">&rsaquo;</button>'
              : '') +
            '<button type="button" id="btnToggleQuoteLoader" class="quote-loader-toggle-btn' + (isLoaderOpen ? ' is-open' : '') + '" onclick="window.toggleQuoteLoaderPanel()">' +
              '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
              '<span>Quote Loader</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
        (isLoaderOpen
          ? '<div class="quote-loader-panel" id="quoteLoaderPanel">' +
              '<div class="quote-loader-header">' +
                '<h3 class="quote-loader-title">Quote Loader</h3>' +
                '<span class="quote-loader-sub">One quote per line (optional: Quote &mdash; Author). Rotates every 1 minute across every page.</span>' +
              '</div>' +
              '<div class="quote-loader-form">' +
                '<textarea id="quoteLoaderInput" class="quote-loader-textarea" rows="2" placeholder="Paste or type one or more quotes (one per line)...&#10;Example: Stay focused and never stop learning. &mdash; Anonymous"></textarea>' +
                '<div class="quote-loader-actions">' +
                  '<div class="quote-loader-btn-group">' +
                    '<button type="button" class="quote-btn-primary" onclick="window.addGlobalQuotes()">Add Quote(s)</button>' +
                    (quotes.length > 0 ? '<button type="button" class="quote-btn-secondary" onclick="window.clearAllGlobalQuotes()">Clear All</button>' : '') +
                  '</div>' +
                  '<span id="quoteLoaderStatus" class="quote-loader-status">' + (statusMsg ? escapeHtml(statusMsg) : '') + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="quote-list-container">' + listMarkup + '</div>' +
            '</div>'
          : '') +
      '</div>';

    if (isLoaderOpen && preservedDraft) {
      var restoredInput = document.getElementById('quoteLoaderInput');
      if (restoredInput) restoredInput.value = preservedDraft;
    }
  }

  root.toggleQuoteLoaderPanel = function () {
    isLoaderOpen = !isLoaderOpen;
    renderQuoteUI();
    if (isLoaderOpen) {
      var input = document.getElementById('quoteLoaderInput');
      if (input) input.focus();
    }
  };

  root.addGlobalQuotes = function () {
    var input = document.getElementById('quoteLoaderInput');
    if (!input) return;
    var lines = input.value.split(/\r?\n/);
    var parsed = [];
    for (var i = 0; i < lines.length; i++) {
      var item = parseQuoteLine(lines[i]);
      if (item) parsed.push(item);
    }
    if (parsed.length === 0) {
      renderQuoteUI('Enter at least one quote first.');
      return;
    }

    var quotes = loadQuotes();
    var firstNewIndex = quotes.length;
    quotes = quotes.concat(parsed);
    saveQuotes(quotes);

    // Display the newly loaded quote right away for a fresh 1-minute window
    saveState({ index: firstNewIndex, startedAt: Date.now() });
    input.value = '';
    renderQuoteUI(parsed.length === 1 ? 'Added 1 quote.' : 'Added ' + parsed.length + ' quotes.');
  };

  root.removeGlobalQuote = function (idx) {
    var quotes = loadQuotes();
    if (idx < 0 || idx >= quotes.length) return;
    var state = loadState(quotes.length);
    quotes.splice(idx, 1);
    saveQuotes(quotes);

    if (quotes.length === 0) {
      saveState({ index: 0, startedAt: Date.now() });
    } else if (idx < state.index || state.index >= quotes.length) {
      saveState({ index: Math.max(0, Math.min(state.index - (idx < state.index ? 1 : 0), quotes.length - 1)), startedAt: state.startedAt });
    } else if (idx === state.index) {
      saveState({ index: state.index % quotes.length, startedAt: Date.now() });
    }
    renderQuoteUI();
  };

  root.clearAllGlobalQuotes = function () {
    saveQuotes([]);
    saveState({ index: 0, startedAt: Date.now() });
    renderQuoteUI('All quotes cleared.');
  };

  root.selectGlobalQuote = function (idx) {
    var quotes = loadQuotes();
    if (idx < 0 || idx >= quotes.length) return;
    saveState({ index: idx, startedAt: Date.now() });
    renderQuoteUI();
  };

  root.nextGlobalQuote = function () {
    var quotes = loadQuotes();
    if (quotes.length === 0) return;
    var state = loadState(quotes.length);
    saveState({ index: (state.index + 1) % quotes.length, startedAt: Date.now() });
    renderQuoteUI();
  };

  root.prevGlobalQuote = function () {
    var quotes = loadQuotes();
    if (quotes.length === 0) return;
    var state = loadState(quotes.length);
    saveState({ index: (state.index - 1 + quotes.length) % quotes.length, startedAt: Date.now() });
    renderQuoteUI();
  };

  function initGlobalQuotes() {
    renderQuoteUI();
    syncRotationTick();
    if (tickerId) clearInterval(tickerId);
    tickerId = setInterval(syncRotationTick, 1000);

    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_QUOTES_KEY || e.key === STORAGE_STATE_KEY) {
        renderQuoteUI();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalQuotes);
  } else {
    initGlobalQuotes();
  }
})(window);
