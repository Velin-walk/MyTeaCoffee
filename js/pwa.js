// ============= PWA SERVICE WORKER & INSTALLATION =============
var deferredInstallPrompt = null;

function isRunningStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator && window.navigator.standalone === true);
}

function updateInstallButtonVisibility() {
  const btn = document.getElementById('pwaInstallBtn');
  if (!btn) return;
  if (isRunningStandalone()) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'inline-flex';
  }
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  updateInstallButtonVisibility();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  updateInstallButtonVisibility();
  console.log('Study Flow installed successfully.');
});

function handlePWAInstallClick() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        deferredInstallPrompt = null;
        updateInstallButtonVisibility();
      }
    });
    return;
  }

  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const modal = document.getElementById('pwaInstallModal');
  const modalBody = document.getElementById('pwaModalBody');

  if (isIOS) {
    modalBody.innerHTML = `
      <p style="margin-top:0;">To install <strong>Study Flow</strong> on your iPhone or iPad:</p>
      <ol style="padding-left:20px; margin:12px 0; line-height: 1.8;">
        <li>Tap the <strong>Share</strong> button <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> in Safari.</li>
        <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
        <li>Tap <strong>Add</strong> in the top-right corner.</li>
      </ol>
    `;
  } else {
    modalBody.innerHTML = `
      <p style="margin-top:0;">To install <strong>Study Flow</strong> directly on your device:</p>
      <ul style="padding-left:20px; margin:12px 0; line-height: 1.8;">
        <li><strong>Chrome / Edge:</strong> Click the <strong>Install</strong> icon (⊕) in the browser address bar, or click menu (⋮) &rarr; <em>Install Study Flow</em>.</li>
        <li><strong>Android:</strong> Tap the browser menu (⋮) &rarr; <strong>Install app</strong> or <em>Add to Home screen</em>.</li>
        <li><strong>Preview mode:</strong> Open the app directly in a browser tab to install with one click.</li>
      </ul>
      <div style="margin-top:14px; text-align:center;">
        <a href="${window.location.href}" target="_blank" style="display:inline-block; padding:7px 16px; background:var(--input-bg); border:1px solid var(--border-color); border-radius:6px; color:var(--primary); font-weight:700; text-decoration:none;">Open in new tab ↗</a>
      </div>
    `;
  }
  if (modal) modal.style.display = 'flex';
}

function closePWAModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('pwa-modal-backdrop') && !e.target.classList.contains('pwa-modal-close-btn')) {
    return;
  }
  const modal = document.getElementById('pwaInstallModal');
  if (modal) modal.style.display = 'none';
}

// Strictly no caching anytime: unregister any service worker and clear browser cache storage
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}
if ('caches' in window) {
  caches.keys().then(names => {
    for (const name of names) {
      caches.delete(name);
    }
  });
}

document.addEventListener('DOMContentLoaded', updateInstallButtonVisibility);
updateInstallButtonVisibility();

