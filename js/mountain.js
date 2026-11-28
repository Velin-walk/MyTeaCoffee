(function () {
  'use strict';

  const EVEREST_GEOJSON_URLS = [
    '/assets/aistudio/Everest_f80aa1b8.json',
    '/public/assets/aistudio/Everest_f80aa1b8.json',
    'assets/aistudio/Everest_f80aa1b8.json',
    'public/assets/aistudio/Everest_f80aa1b8.json'
  ];
  const FALLBACK_EVEREST_GEOJSON = {"features":[{"geometry":{"coordinates":[86.92524027674324,27.988071283640686,0,0],"type":"Point"},"id":"c2f0497f-7d42-474c-ab89-4328efc2a1cf","type":"Feature","properties":{"-updated-by":"BEQT1K","marker-symbol":"point","creator":"BEQT1K","-created-on":1795832457349,"marker-color":"#ff0000","-updated-on":1795832457349,"title":"Peak","marker-size":1,"class":"Marker","updated":1795832457349,"marker-rotation":0,"-created-by":"BEQT1K"}},{"geometry":{"coordinates":[86.85289237227673,28.00211347028737,0,0],"type":"Point"},"id":"26f57293-4be4-495f-abc5-2663107ab689","type":"Feature","properties":{"-updated-by":"BEQT1K","marker-symbol":"point","creator":"BEQT1K","-created-on":1795832513394,"marker-color":"#ff0000","-updated-on":1795832513394,"title":"Base Camp","marker-size":1,"class":"Marker","updated":1795832513394,"marker-rotation":0,"-created-by":"BEQT1K"}},{"geometry":{"coordinates":[86.87273236520608,27.995868636845554,0,0],"type":"Point"},"id":"e014b115-023d-4a4d-bad6-5965ebef08fb","type":"Feature","properties":{"-updated-by":"BEQT1K","marker-symbol":"point","creator":"BEQT1K","-created-on":1795832548109,"marker-color":"#ff0000","-updated-on":1795832548109,"title":"Khumbu Icefall","marker-size":1,"class":"Marker","updated":1795832548109,"marker-rotation":0,"-created-by":"BEQT1K"}},{"geometry":{"coordinates":[86.8912982940674,27.982274659104082,0,0],"type":"Point"},"id":"cd553733-c8b9-4986-ae40-a4ba094933ac","type":"Feature","properties":{"-updated-by":"BEQT1K","marker-symbol":"point","creator":"BEQT1K","-created-on":1795832603212,"marker-color":"#ff0000","-updated-on":1795832603212,"title":"Camp II","marker-size":1,"class":"Marker","updated":1795832603212,"marker-rotation":0,"-created-by":"BEQT1K"}},{"geometry":{"coordinates":[86.93000793457033,27.973633516269906,0,0],"type":"Point"},"id":"04728972-f1e3-4d27-9206-42365fe27418","type":"Feature","properties":{"-updated-by":"BEQT1K","marker-symbol":"point","creator":"BEQT1K","-created-on":1795832634517,"marker-color":"#ff0000","-updated-on":1795832634517,"title":"Camp IV","marker-size":1,"class":"Marker","updated":1795832634517,"marker-rotation":0,"-created-by":"BEQT1K"}},{"geometry":{"coordinates":[86.91558837890626,27.97302709428688,0,0],"type":"Point"},"id":"045fadae-e4c0-4a29-9051-75cd595de835","type":"Feature","properties":{"-updated-by":"BEQT1K","marker-symbol":"point","creator":"BEQT1K","-created-on":1795832659964,"marker-color":"#ff0000","-updated-on":1795832659964,"title":"Camp III","marker-size":1,"class":"Marker","updated":1795832659964,"marker-rotation":0,"-created-by":"BEQT1K"}},{"geometry":{"coordinates":[86.92575931549074,27.98716342008376,0,0],"type":"Point"},"id":"389adc10-b23a-4237-994a-471facc0df86","type":"Feature","properties":{"-updated-by":"BEQT1K","marker-symbol":"point","creator":"BEQT1K","-created-on":1795832716616,"marker-color":"#ff0000","-updated-on":1795832716616,"title":"Hillary Step","marker-size":1,"class":"Marker","updated":1795832716616,"marker-rotation":0,"-created-by":"BEQT1K"}},{"geometry":{"coordinates":[86.87632026287066,27.987496915641895,0,0],"type":"Point"},"id":"348a1107-0308-40d2-a0de-a9280d32a013","type":"Feature","properties":{"-updated-by":"BEQT1K","marker-symbol":"point","creator":"BEQT1K","-created-on":1795832759174,"marker-color":"#ff0000","-updated-on":1795832759174,"title":"Camp I","marker-size":1,"class":"Marker","updated":1795832759174,"marker-rotation":0,"-created-by":"BEQT1K"}},{"geometry":{"coordinates":[[86.8472988353102,27.997308244046916],[86.84759,27.99752],[86.84767,27.99766],[86.84797,27.99764],[86.84847,27.99806],[86.84886,27.99856],[86.84928,27.9989],[86.84945,27.99893],[86.8496,27.99913],[86.84972,27.99941],[86.84992,27.99951],[86.85035,27.99983],[86.85068,27.99991],[86.85076,28],[86.85112,28.00007],[86.85162,28.00023],[86.85183,28.00058],[86.85203,28.00069],[86.85216,28.00084],[86.85232,28.00095],[86.85242,28.0012],[86.85263,28.00127],[86.85303,28.00129],[86.85351,28.00176],[86.85364,28.00193],[86.85404,28.00193],[86.85459,28.00238],[86.85475,28.00246],[86.85516,28.0027],[86.85525,28.00281],[86.85567,28.00293],[86.85573,28.00291],[86.85573,28.00291],[86.85594,28.00263],[86.8561,28.00267],[86.85634,28.00267],[86.85655,28.00239],[86.8566,28.00225],[86.8566,28.0021],[86.85696,28.00172],[86.85718,28.00175],[86.85759,28.00186],[86.8578099996485,28.001790000530132],[86.8578099996485,28.001790000530132],[86.85781,28.00179],[86.85791,28.00184],[86.85791,28.00184],[86.85806,28.00191],[86.85826,28.00192],[86.85837,28.0018],[86.8587,28.00172],[86.85893,28.0017],[86.85893,28.0017],[86.85912,28.00148],[86.85989,28.00129],[86.86017,28.00117],[86.86036,28.00119],[86.86075,28.00109],[86.86106,28.00111],[86.86179,28.00134],[86.86205,28.00138],[86.86231,28.00132],[86.86262,28.00142],[86.8629,28.00145],[86.86305,28.00143],[86.86331146512516,28.001270215756847],[86.86331146512515,28.001270215883046],[86.86359,28.0011],[86.86368,28.00071],[86.86465,27.99951],[86.86442,27.99982],[86.86496,27.99933],[86.86492,27.99904],[86.86511,27.99881],[86.86511,27.99881],[86.86732,27.99875],[86.86744,27.99847],[86.86761,27.99842],[86.86756,27.9983],[86.86779,27.99815],[86.86773,27.99782],[86.86796,27.99787],[86.86814,27.99781],[86.86836,27.99769],[86.8685,27.9977],[86.86858,27.99762],[86.86856,27.99752],[86.86883,27.99744],[86.86891,27.99735],[86.86902,27.99736],[86.86907,27.99727],[86.86919,27.9973],[86.86925,27.99719],[86.86947,27.99714],[86.86955,27.99718],[86.86959,27.99727],[86.86965,27.9972],[86.86975,27.99726],[86.86981,27.99741],[86.86994,27.99744],[86.87019,27.99754],[86.87033,27.99751],[86.87045,27.99758],[86.87115,27.99766],[86.87119,27.99773],[86.8714,27.99779],[86.87148,27.99776],[86.87152,27.99767],[86.87159,27.99759],[86.87161,27.99749],[86.87183,27.99736],[86.87185,27.99699],[86.8719,27.99682],[86.87257,27.99675],[86.87283,27.99657],[86.8739,27.99613],[86.87385,27.99596],[86.87403,27.99583],[86.87416,27.99567],[86.87436,27.99549],[86.87462,27.99543],[86.87478,27.99542],[86.87482,27.99535],[86.87493,27.99531],[86.87496,27.9951],[86.8751,27.99511],[86.8752,27.99515],[86.87519,27.99473],[86.87523,27.99465],[86.87534,27.99464],[86.87526,27.99459],[86.87524,27.9945],[86.87516,27.9944],[86.87516,27.9944],[86.87491,27.99415],[86.87491,27.99395],[86.87511,27.99389],[86.8756,27.99417],[86.87638,27.9944],[86.87638,27.9944],[86.87657,27.99446],[86.87658,27.9944],[86.87658,27.9944],[86.87672,27.99308],[86.87702,27.99299],[86.87677,27.99272],[86.87709,27.99259],[86.87702,27.99241],[86.87712,27.99218],[86.8771,27.99189],[86.87732,27.99182],[86.87745,27.9917],[86.87814,27.99161],[86.87829,27.99133],[86.87854,27.99131],[86.87894,27.99104],[86.879,27.99084],[86.879,27.99064],[86.8783,27.98983],[86.87844,27.98959],[86.87866,27.98947],[86.87833,27.98904],[86.87836,27.98884],[86.878,27.98834],[86.8778,27.98827],[86.87762,27.98803],[86.87763552768826,27.987986292433046],[86.87763552768826,27.987986292578224],[86.87789,27.98727],[86.87708,27.98678],[86.87752,27.98639],[86.87665,27.9856],[86.87686,27.98523],[86.8763,27.98492],[86.87651,27.98459],[86.87671,27.98413],[86.87709,27.98384],[86.87753,27.98338],[86.8782,27.98305],[86.87849,27.98321],[86.87869,27.98326],[86.87924,27.9832],[86.87988,27.98304],[86.87988,27.98304],[86.87988,27.98304],[86.87988,27.98304],[86.87988,27.98304],[86.87988,27.98302],[86.8796,27.98273],[86.87988,27.98271],[86.87988,27.98271],[86.87997,27.98271],[86.8806,27.98217],[86.88075,27.98216],[86.88105,27.98232],[86.88143,27.98259],[86.88188,27.98271],[86.88233,27.98252],[86.88295,27.98268],[86.88362,27.98259],[86.88387,27.98258],[86.88474,27.98275],[86.88564,27.98261],[86.8861,27.98261],[86.88646,27.98245],[86.88701,27.9825],[86.88769,27.98242],[86.88863,27.98222],[86.88996,27.98232],[86.89038,27.98216],[86.89125576984449,27.982189940849384],[86.89125576984448,27.98218994085079],[86.89155,27.9822],[86.89187,27.98207],[86.89219,27.98211],[86.89249,27.98195],[86.89314,27.98191],[86.8941,27.98191],[86.89438,27.9818],[86.89521,27.9818],[86.89549,27.98173],[86.8957,27.98175],[86.89668,27.98137],[86.89698,27.98133],[86.89733,27.9812],[86.89771,27.9811],[86.89829,27.98143],[86.89872,27.98151],[86.89923,27.98135],[86.89947,27.98122],[86.89995,27.98105],[86.90108,27.98035],[86.90158,27.98014],[86.90186,27.9799],[86.90186,27.9799],[86.90189,27.97987],[86.90206,27.9799],[86.9023,27.97972],[86.90251,27.97974],[86.90251,27.97974],[86.90308,27.97946],[86.90327,27.97947],[86.90361,27.97937],[86.90385,27.97939],[86.90441,27.97922],[86.905,27.97895],[86.9049999998187,27.97895000004631],[86.905,27.97895],[86.90525,27.97888],[86.90554,27.97873],[86.9058,27.97863],[86.90631,27.97849],[86.90651,27.97839],[86.90677,27.97818],[86.90702,27.97808],[86.9072,27.97798],[86.90746,27.9778],[86.90788,27.97737],[86.90829,27.97684],[86.90863,27.97674],[86.90885,27.97658],[86.90899,27.97642],[86.90893,27.97623],[86.90896,27.97606],[86.9093,27.97551],[86.90948,27.97531],[86.90967,27.975],[86.90967,27.975],[86.90981,27.97479],[86.91026,27.97424],[86.91017,27.97345],[86.91024,27.97336],[86.91054,27.97316],[86.91073,27.97301],[86.91116,27.97285],[86.91188,27.97271],[86.91226,27.97252],[86.91297,27.97223],[86.9134,27.97198],[86.91372,27.9717],[86.91412,27.97146],[86.91461,27.97123],[86.91478,27.97103],[86.91511,27.97092],[86.91536,27.9708],[86.91608,27.97061],[86.91623,27.9705],[86.9163,27.97034],[86.91656,27.97007],[86.91687,27.96988],[86.91717,27.96944],[86.91757,27.969],[86.918,27.96886],[86.91844,27.96886],[86.91903,27.9688],[86.91957,27.96842],[86.92039,27.96827],[86.9206,27.96834],[86.92094,27.96813],[86.92179,27.96774],[86.92221,27.96757],[86.9231,27.96743],[86.92362,27.9672],[86.92383,27.9673],[86.92383,27.9673],[86.92505,27.96787],[86.92633,27.96806],[86.9264,27.96818],[86.92722,27.96853],[86.92773032568105,27.968974050083514],[86.92799,27.9692],[86.92802,27.96972],[86.92796,27.96994],[86.92761,27.9706],[86.92748,27.97067],[86.92742,27.97081],[86.92744,27.97102],[86.92773,27.9713],[86.92813,27.97176],[86.92855,27.97207],[86.92894,27.97287],[86.9291,27.97306],[86.92945,27.97322],[86.92981,27.97329],[86.93007,27.97338],[86.93016587588133,27.973475875881338],[86.93016587588133,27.973475875914268],[86.93024,27.97355],[86.93033,27.97379],[86.9303,27.97396],[86.93032,27.97444],[86.9304,27.975],[86.9304,27.975],[86.93047,27.97558],[86.93054,27.9757],[86.9305,27.97583],[86.93051,27.97598],[86.93043,27.97609],[86.93042,27.97638],[86.93033,27.9766],[86.93033,27.9767],[86.93025,27.97676],[86.93021,27.97687],[86.93011,27.97692],[86.93017,27.97711],[86.93014,27.9773],[86.92999,27.97756],[86.92994,27.97789],[86.92977,27.97838],[86.92966,27.97842],[86.92957,27.97884],[86.92926,27.97946],[86.92908,27.97992],[86.92899,27.98016],[86.9289,27.98057],[86.92893,27.98167],[86.92901,27.98181],[86.92905,27.98212],[86.92914,27.9823],[86.92911,27.98251],[86.92893,27.98271],[86.92888,27.98272],[86.92876,27.9827],[86.92833,27.98285],[86.92759,27.98314],[86.92605,27.98442],[86.92548,27.9857],[86.92556,27.98645],[86.92538,27.98683],[86.92537,27.98703],[86.92529,27.98713],[86.92531,27.98731],[86.92522,27.98756],[86.9252,27.9878],[86.92521,27.98806],[86.92521,27.98806],[86.92520634439184,27.988065605265852]],"type":"LineString"},"id":"89ac7a8a-6886-4fc4-9342-34b8e6ffaa61","type":"Feature","properties":{"-updated-by":"BEQT1K","stroke-opacity":1,"creator":"BEQT1K","-created-on":1795832837952,"pattern":"solid","-updated-on":1795832837952,"stroke-width":2,"title":"","stroke":"#ff0000","class":"Shape","updated":1795832837952,"-created-by":"BEQT1K"}}],"type":"FeatureCollection"};
  const THEME_STORAGE_KEY = 'selectedTheme';
  const SCOPE_STORAGE_KEY = 'mountainClimbScope';
  const TARGET_HOURS_STORAGE_KEY = 'mountainSummitTargetHours';

  const SOUTH_COL_BASE_ROUND_TRIP_HOURS = 44; // 29.5h ascent + 14.5h descent
  const SOUTH_COL_BASE_ASCENT_HOURS = 29.5;
  const SOUTH_COL_BASE_DESCENT_HOURS = 14.5;
  const SOUTH_COL_STAGE_TEMPLATE = [
    // Ascent stages (29.5h total)
    { phase: 'ascent',  from: 'Base Camp', to: 'Camp I',    baseHours: 4.0,  rangeLabel: '2–6h avg' },
    { phase: 'ascent',  from: 'Camp I',    to: 'Camp II',   baseHours: 5.5,  rangeLabel: '4–7h avg' },
    { phase: 'ascent',  from: 'Camp II',   to: 'Camp III',  baseHours: 4.0,  rangeLabel: '3–5h avg' },
    { phase: 'ascent',  from: 'Camp III',  to: 'Camp IV',   baseHours: 6.0,  rangeLabel: '5–7h avg' },
    { phase: 'ascent',  from: 'Camp IV',   to: 'Peak',      baseHours: 10.0, rangeLabel: '8–12+h avg' },
    // Descent stages (14.5h total)
    { phase: 'descent', from: 'Peak',      to: 'Camp IV',   baseHours: 4.0,  rangeLabel: '3–5h avg' },
    { phase: 'descent', from: 'Camp IV',   to: 'Camp II',   baseHours: 5.0,  rangeLabel: '4–6h avg (past Camp III)' },
    { phase: 'descent', from: 'Camp II',   to: 'Base Camp', baseHours: 5.5,  rangeLabel: '4–7h avg' }
  ];

  let loadedModel = null;
  let activeCampIdx = 7;
  let climbScope = 'all';
  let summitTargetHours = SOUTH_COL_BASE_ROUND_TRIP_HOURS;
  let latestStats = { totalMinutes: 0, isLiveTimerActive: false, liveSessionElapsedSecs: 0 };
  let liveTickTimer = null;
  let idbSyncInFlight = false;
  let cachedIdbDaily = null;
  let cachedIdbWatch = null;

  function readStorage(key, fallback) {
    if (typeof safeStorageGet === 'function') return safeStorageGet(key, fallback);
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    if (typeof safeStorageSet === 'function') {
      safeStorageSet(key, value);
      return;
    }
    try {
      localStorage.setItem(key, String(value));
    } catch (e) {}
  }

  function loadMountainTheme() {
    const saved = readStorage(THEME_STORAGE_KEY, 'default') || 'default';
    applyMountainTheme(saved);
    const sel = document.getElementById('mountainThemeSelect');
    if (sel) sel.value = saved;
  }

  function applyMountainTheme(theme) {
    const wasFs = document.body.classList.contains('is-fullscreen');
    document.body.className = wasFs ? 'is-fullscreen' : '';
    if (theme && theme !== 'default') {
      document.body.classList.add(theme);
    }
  }

  function changeMountainTheme(theme) {
    applyMountainTheme(theme);
    writeStorage(THEME_STORAGE_KEY, theme);
  }

  function toggleMountainFullscreen() {
    const isFs = document.body.classList.toggle('is-fullscreen');
    const btn = document.getElementById('btnMountainFullscreen');
    if (btn) {
      btn.setAttribute('aria-pressed', isFs ? 'true' : 'false');
    }
    if (isFs) {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => null);
      }
    } else if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => null);
    }
  }

  function formatDateKey(dt) {
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  }

  function parseLocalDateKey(dateKey) {
    const parts = String(dateKey || '').split('-');
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    return new Date(y, m, d);
  }

  function formatDurationHM(totalMinutes) {
    const mins = Math.max(0, Math.round(totalMinutes || 0));
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  function formatLiveTimerClock(totalSecs) {
    const secs = Math.max(0, Math.floor(totalSecs || 0));
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function readJsonLocalStorage(key, fallback) {
    try {
      const raw = readStorage(key, null);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function readStudyDashboardDB() {
    return new Promise((resolve) => {
      if (typeof indexedDB === 'undefined') {
        resolve({ dailyData: null, watchData: null });
        return;
      }
      try {
        const req = indexedDB.open('StudyDashboardDB', 1);
        req.onupgradeneeded = (event) => {
          const database = event.target.result;
          ['dailyData', 'weeklyData', 'monthlyData', 'watchData', 'plannerData'].forEach((name) => {
            if (!database.objectStoreNames.contains(name)) {
              database.createObjectStore(name, { keyPath: 'id' });
            }
          });
        };
        req.onerror = () => resolve({ dailyData: null, watchData: null });
        req.onsuccess = () => {
          const database = req.result;
          const result = { dailyData: null, watchData: null };
          const stores = ['dailyData', 'watchData'].filter((s) => database.objectStoreNames.contains(s));
          if (!stores.length) {
            try { database.close(); } catch (e) {}
            resolve(result);
            return;
          }
          try {
            const tx = database.transaction(stores, 'readonly');
            if (stores.includes('dailyData')) {
              const r1 = tx.objectStore('dailyData').get(1);
              r1.onsuccess = () => { result.dailyData = r1.result ? r1.result.data : null; };
            }
            if (stores.includes('watchData')) {
              const r2 = tx.objectStore('watchData').get(1);
              r2.onsuccess = () => { result.watchData = r2.result ? r2.result.data : null; };
            }
            tx.oncomplete = () => {
              try { database.close(); } catch (e) {}
              resolve(result);
            };
            tx.onerror = () => {
              try { database.close(); } catch (e) {}
              resolve(result);
            };
          } catch (err) {
            try { database.close(); } catch (e) {}
            resolve(result);
          }
        };
      } catch (e) {
        resolve({ dailyData: null, watchData: null });
      }
    });
  }

  function computeStudyFocusStatsSync(scope, dailyData, watchData) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = startOfToday - (now.getDay() * 86400000);
    const todayKey = formatDateKey(now);

    const isDateKeyInScope = (dk) => {
      if (scope === 'all') return true;
      const dt = parseLocalDateKey(dk);
      if (!dt) return false;
      const ts = dt.getTime();
      if (scope === 'today') return dk === todayKey;
      if (scope === 'week') return ts >= startOfWeek;
      return true;
    };

    const minutesByDate = new Map();

    // 1. Primary store: nepalForestHistory (completed focus + synced chart sessions)
    const history = readJsonLocalStorage('nepalForestHistory', []);
    if (Array.isArray(history)) {
      history.forEach((item) => {
        if (!item || typeof item.minutes !== 'number' || !Number.isFinite(item.minutes) || item.minutes <= 0) return;
        const ts = (typeof item.timestamp === 'number' && item.timestamp > 0) ? item.timestamp : Date.now();
        const dk = formatDateKey(new Date(ts));
        minutesByDate.set(dk, (minutesByDate.get(dk) || 0) + item.minutes);
      });
    }

    // 2. Fallback / merge from Study Charts IndexedDB cache for days not yet in nepalForestHistory
    if (Array.isArray(dailyData) && dailyData.length > 1) {
      for (let i = 1; i < dailyData.length; i++) {
        const row = dailyData[i];
        if (!Array.isArray(row) || !row[0]) continue;
        const parsedDate = (typeof window.parseSessionDate === 'function')
          ? window.parseSessionDate(row[0])
          : new Date(row[0]);
        if (!parsedDate || isNaN(parsedDate.getTime())) continue;
        const dk = formatDateKey(parsedDate);
        if (dk === todayKey || minutesByDate.has(dk)) continue;
        let dayHrs = 0;
        for (let j = 1; j < row.length; j += 3) {
          if (typeof row[j] === 'number' && Number.isFinite(row[j]) && row[j] > 0) {
            dayHrs += row[j];
          }
        }
        if (dayHrs > 0) {
          minutesByDate.set(dk, Math.round(dayHrs * 60));
        }
      }
    }

    // 3. Merge today's 24h watchData (take max vs today's forest records so nothing is double-counted)
    if (Array.isArray(watchData) && watchData.length > 0) {
      const mergedWatch = (typeof window.mergeContinuousSessions === 'function')
        ? window.mergeContinuousSessions(watchData)
        : watchData;
      const watchHours = mergedWatch.reduce((sum, s) => {
        const hrs = (s && typeof s.hrs === 'number' && Number.isFinite(s.hrs) && s.hrs > 0) ? s.hrs : 0;
        return sum + hrs;
      }, 0);
      const watchTodayMins = Math.round(watchHours * 60);
      const existingTodayMins = minutesByDate.get(todayKey) || 0;
      if (watchTodayMins > existingTodayMins) {
        minutesByDate.set(todayKey, watchTodayMins);
      }
    }

    let totalMinutes = 0;
    minutesByDate.forEach((mins, dk) => {
      if (isDateKeyInScope(dk)) {
        totalMinutes += mins;
      }
    });

    // 4. Add uncommitted elapsed minutes from live active focus timer
    let isLiveTimerActive = false;
    let liveSessionElapsedSecs = 0;
    const active = readJsonLocalStorage('activeFocusSession', null);
    if (active && typeof active === 'object' && typeof active.startTime === 'number' && active.startTime > 0) {
      const elapsedSecs = Math.max(0, (Date.now() - active.startTime) / 1000);
      if (elapsedSecs < 12 * 3600) {
        isLiveTimerActive = true;
        liveSessionElapsedSecs = elapsedSecs;
        let uncommittedMins = 0;
        if (active.mode === 'fixed') {
          const durMins = (typeof active.durationMinutes === 'number' && active.durationMinutes > 0)
            ? active.durationMinutes
            : 25;
          uncommittedMins = Math.min(durMins, elapsedSecs / 60);
        } else {
          const plantedCycles = (typeof active.plantedCycles === 'number' && active.plantedCycles >= 0)
            ? active.plantedCycles
            : 0;
          uncommittedMins = Math.max(0, (elapsedSecs / 60) - plantedCycles * 25);
        }
        totalMinutes += uncommittedMins;
      }
    }

    return {
      totalMinutes,
      isLiveTimerActive,
      liveSessionElapsedSecs
    };
  }

  function getCampProgressMeta(model, totalHours, targetHours) {
    if (!model || !model.camps || !model.camps.length) {
      return {
        progress: 0,
        trailProgress: 0,
        climberPt: null,
        milestones: [],
        reachedCount: 0,
        nextCamp: null,
        currentCamp: null,
        completedRoundTrips: 0,
        summitsReached: 0,
        expeditionNum: 1,
        cycleHours: SOUTH_COL_BASE_ROUND_TRIP_HOURS,
        cycleElapsed: 0,
        ascentHours: SOUTH_COL_BASE_ASCENT_HOURS,
        descentHours: SOUTH_COL_BASE_DESCENT_HOURS,
        isDescent: false,
        isAtSummit: false,
        activeStage: null,
        stages: []
      };
    }

    const findCamp = (title, fallbackIdx) =>
      model.camps.find((c) => c.title === title) || model.camps[Math.min(fallbackIdx, model.camps.length - 1)];

    const baseCamp = findCamp('Base Camp', 0);
    const peakCamp = findCamp('Peak', model.camps.length - 1);
    const startDistM = baseCamp ? baseCamp.distM : 0;
    const endDistM = model.totalDistM || (peakCamp ? peakCamp.distM : 1);
    const spanDist = Math.max(1, endDistM - startDistM);

    const safeTotal = Math.max(0, Number(totalHours) || 0);
    const cycleHours = Math.max(0.5, Number(targetHours) || SOUTH_COL_BASE_ROUND_TRIP_HOURS);
    const scale = cycleHours / SOUTH_COL_BASE_ROUND_TRIP_HOURS;
    const ascentHours = SOUTH_COL_BASE_ASCENT_HOURS * scale;
    const descentHours = SOUTH_COL_BASE_DESCENT_HOURS * scale;

    const completedRoundTrips = safeTotal > 0 ? Math.floor((safeTotal + 1e-9) / cycleHours) : 0;
    let cycleElapsed = safeTotal - completedRoundTrips * cycleHours;
    if (cycleElapsed < 1e-9) cycleElapsed = 0;

    const expeditionNum = completedRoundTrips + 1;
    const isAtSummit = Math.abs(cycleElapsed - ascentHours) <= 1e-6;
    const isDescent = cycleElapsed > ascentHours + 1e-6;
    const summitsReached = completedRoundTrips + (cycleElapsed + 1e-6 >= ascentHours ? 1 : 0);

    // Build scaled 8-stage ascent + descent schedule
    const campByTitle = new Map();
    model.camps.forEach((c) => campByTitle.set(c.title, c));

    let runningHours = 0;
    const stages = SOUTH_COL_STAGE_TEMPLATE.map((tpl) => {
      const durationHours = tpl.baseHours * scale;
      const startHours = runningHours;
      const endHours = runningHours + durationHours;
      runningHours = endHours;
      return {
        ...tpl,
        durationHours,
        startHours,
        endHours,
        fromCamp: campByTitle.get(tpl.from) || baseCamp,
        toCamp: campByTitle.get(tpl.to) || peakCamp
      };
    });

    // Find current active stage within this round-trip cycle
    let activeStage = stages[0];
    for (let i = 0; i < stages.length; i++) {
      if (cycleElapsed <= stages[i].endHours + 1e-9 || i === stages.length - 1) {
        activeStage = stages[i];
        break;
      }
    }

    const stageSpan = Math.max(1e-9, activeStage.durationHours);
    const stageFrac = Math.max(0, Math.min(1, (cycleElapsed - activeStage.startHours) / stageSpan));
    const fromDist = activeStage.fromCamp ? activeStage.fromCamp.distM : startDistM;
    const toDist = activeStage.toCamp ? activeStage.toCamp.distM : endDistM;
    const climberDistM = fromDist + (toDist - fromDist) * stageFrac;
    const trailProgress = Math.max(0, Math.min(1, (climberDistM - startDistM) / spanDist));

    const climberPt = (typeof window.sampleEverestTrailAtProgress === 'function')
      ? window.sampleEverestTrailAtProgress(model, trailProgress)
      : null;

    // Helper: map any trail waypoint's distance to its ascent hours along the 5 ascent stages
    const ascentStages = stages.filter((s) => s.phase === 'ascent');
    const getAscentHoursForCamp = (camp) => {
      if (!camp) return 0;
      if (camp.title === 'Base Camp') return 0;
      if (camp.title === 'Peak') return ascentHours;
      for (let i = 0; i < ascentStages.length; i++) {
        const st = ascentStages[i];
        if (st.toCamp && st.toCamp.title === camp.title) return st.endHours;
        const d0 = st.fromCamp ? st.fromCamp.distM : startDistM;
        const d1 = st.toCamp ? st.toCamp.distM : endDistM;
        if (camp.distM >= Math.min(d0, d1) - 1 && camp.distM <= Math.max(d0, d1) + 1) {
          const t = Math.max(0, Math.min(1, (camp.distM - d0) / Math.max(1, d1 - d0)));
          return st.startHours + t * st.durationHours;
        }
      }
      return Math.max(0, Math.min(ascentHours, ((camp.distM - startDistM) / spanDist) * ascentHours));
    };

    // Descent stop arrival hours (Peak -> Camp IV -> Camp II -> Base Camp)
    const descentStages = stages.filter((s) => s.phase === 'descent');
    const descentArrivalByTitle = new Map();
    descentArrivalByTitle.set('Peak', ascentHours);
    descentStages.forEach((st) => {
      descentArrivalByTitle.set(st.to, st.endHours);
    });

    const milestones = model.camps.map((camp, idx) => {
      const ascHours = getAscentHoursForCamp(camp);
      const descHours = descentArrivalByTitle.has(camp.title) ? descentArrivalByTitle.get(camp.title) : null;
      const reachedAscent = isDescent || isAtSummit || (cycleElapsed + 1e-6 >= ascHours);
      const reachedDescent = isDescent && descHours !== null && (cycleElapsed + 1e-6 >= descHours);

      let stageLegLabel = 'Start Staging';
      if (camp.title === 'Khumbu Icefall') {
        stageLegLabel = `In Base Camp → Camp I (${ascentStages[0].durationHours.toFixed(1).replace(/\.0$/, '')}h avg)`;
      } else if (camp.title === 'Hillary Step') {
        stageLegLabel = `In Camp IV → Peak (${ascentStages[4].durationHours.toFixed(1).replace(/\.0$/, '')}h avg)`;
      } else if (idx > 0) {
        const st = ascentStages.find((s) => s.to === camp.title);
        if (st) {
          stageLegLabel = `+${formatDurationHM(st.durationHours * 60)} (${st.rangeLabel})`;
        }
      }

      return {
        idx,
        camp,
        ascentHours: ascHours,
        descentHours: descHours,
        requiredHours: isDescent && descHours !== null ? descHours : ascHours,
        reached: isDescent ? (camp.title === 'Peak' ? true : reachedDescent) : reachedAscent,
        reachedAscent,
        reachedDescent,
        stageLegLabel,
        isNext: false
      };
    });

    let nextCamp = null;
    let currentCamp = milestones[0] || null;
    if (!isDescent && !isAtSummit) {
      for (let i = 0; i < milestones.length; i++) {
        if (milestones[i].reachedAscent) {
          currentCamp = milestones[i];
        } else if (!nextCamp) {
          milestones[i].isNext = true;
          nextCamp = milestones[i];
        }
      }
    } else {
      // During descent (or right at Summit), current/next follow Peak -> Camp IV -> Camp II -> Base Camp
      const peakMs = milestones.find((m) => m.camp.title === 'Peak') || milestones[milestones.length - 1];
      currentCamp = peakMs;
      const descentOrder = ['Camp IV', 'Camp II', 'Base Camp'];
      for (let i = 0; i < descentOrder.length; i++) {
        const ms = milestones.find((m) => m.camp.title === descentOrder[i]);
        if (!ms) continue;
        if (ms.reachedDescent) {
          currentCamp = ms;
        } else if (!nextCamp) {
          ms.isNext = true;
          nextCamp = ms;
        }
      }
    }

    const progress = Math.max(0, Math.min(1, cycleElapsed / cycleHours));
    const reachedCount = milestones.filter((m) => m.reachedAscent).length;
    return {
      progress,
      trailProgress,
      climberPt,
      milestones,
      reachedCount,
      nextCamp,
      currentCamp,
      completedRoundTrips,
      summitsReached,
      expeditionNum,
      cycleHours,
      cycleElapsed,
      ascentHours,
      descentHours,
      isDescent,
      isAtSummit,
      activeStage,
      stages
    };
  }

  function renderElevationProfile(model, selectedIdx, climberPt, milestoneList, isDescentPhase) {
    const host = document.getElementById('mountainElevationProfile');
    if (!host || !model || !model.trail.length) return;

    const W = 820;
    const H = 190;
    const padL = 52;
    const padR = 24;
    const padT = 22;
    const padB = 34;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const minEle = 5100;
    const maxEle = 9000;
    const totalD = model.totalDistM || 1;

    const xOf = (d) => padL + (d / totalD) * plotW;
    const yOf = (ele) => padT + plotH - ((ele - minEle) / (maxEle - minEle)) * plotH;

    const pathPts = model.trail.map((pt, i) => `${i === 0 ? 'M' : 'L'}${xOf(pt.distM).toFixed(1)},${yOf(pt.eleM).toFixed(1)}`).join(' ');
    const areaPts = `${pathPts} L${xOf(totalD).toFixed(1)},${(padT + plotH).toFixed(1)} L${padL},${(padT + plotH).toFixed(1)} Z`;

    const gridAlts = [5500, 6500, 7500, 8000, 8849];
    const gridMarkup = gridAlts.map((alt) => {
      const y = yOf(alt).toFixed(1);
      const isDeathZone = alt === 8000;
      return `
        <line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="${isDeathZone ? 'rgba(234,88,12,0.42)' : 'var(--border-color)'}" stroke-width="${isDeathZone ? '1.2' : '0.8'}" stroke-dasharray="${isDeathZone ? '4 4' : '2 3'}"/>
        <text x="${padL - 7}" y="${Number(y) + 3.5}" text-anchor="end" font-size="10" font-weight="600" fill="${isDeathZone ? '#ea580c' : 'var(--text-tertiary)'}">${alt}m</text>
      `;
    }).join('');

    const distTicks = [0, 3, 6, 9, 12, 14].filter((km) => km * 1000 <= totalD + 400);
    const distMarkup = distTicks.map((km) => {
      const x = xOf(Math.min(totalD, km * 1000)).toFixed(1);
      return `<text x="${x}" y="${H - 10}" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-tertiary)">${km} km</text>`;
    }).join('');

    // Highlight completed climb segment from trail start up to climber position (or full route if descending)
    let climbedPathPts = '';
    if (isDescentPhase) {
      climbedPathPts = pathPts;
    } else if (climberPt && typeof climberPt.fracIdx === 'number') {
      const wholeIdx = Math.floor(climberPt.fracIdx);
      const pts = model.trail.slice(0, wholeIdx + 1).map((pt, i) => `${i === 0 ? 'M' : 'L'}${xOf(pt.distM).toFixed(1)},${yOf(pt.eleM).toFixed(1)}`);
      pts.push(`L${xOf(climberPt.distM).toFixed(1)},${yOf(climberPt.eleM).toFixed(1)}`);
      climbedPathPts = pts.join(' ');
    }

    const campMarkers = model.camps.map((c, idx) => {
      const cx = xOf(c.distM).toFixed(1);
      const cy = yOf(c.eleM).toFixed(1);
      const isSel = idx === selectedIdx;
      const isReached = milestoneList && milestoneList[idx] ? milestoneList[idx].reached : false;
      const dotFill = isSel ? '#38bdf8' : (isReached ? '#16a34a' : 'var(--primary)');
      return `
        <g class="ele-camp-dot" data-camp-idx="${idx}" style="cursor:pointer;">
          <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${padT + plotH}" stroke="${isSel ? '#38bdf8' : 'var(--border-color)'}" stroke-width="${isSel ? '1.4' : '0.8'}" stroke-dasharray="2 2"/>
          <circle cx="${cx}" cy="${cy}" r="${isSel ? 5.8 : 4.2}" fill="${dotFill}" stroke="#ffffff" stroke-width="1.5"/>
        </g>
      `;
    }).join('');

    let climberDotMarkup = '';
    if (climberPt) {
      const clx = xOf(climberPt.distM).toFixed(1);
      const cly = yOf(climberPt.eleM).toFixed(1);
      climberDotMarkup = `
        <g pointer-events="none">
          <circle cx="${clx}" cy="${cly}" r="9" fill="rgba(250, 204, 21, 0.34)"/>
          <circle cx="${clx}" cy="${cly}" r="5.2" fill="#facc15" stroke="#ea580c" stroke-width="2"/>
        </g>
      `;
    }

    host.innerHTML = `
      <svg class="elevation-profile-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mount Everest elevation profile from Base Camp to Summit">
        <defs>
          <linearGradient id="everestEleFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.32"/>
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.03"/>
          </linearGradient>
        </defs>
        ${gridMarkup}
        ${distMarkup}
        <path d="${areaPts}" fill="url(#everestEleFill)"/>
        <path d="${pathPts}" fill="none" stroke="var(--text-tertiary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
        ${climbedPathPts ? `<path d="${climbedPathPts}" fill="none" stroke="#ea580c" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
        ${campMarkers}
        ${climberDotMarkup}
      </svg>
    `;

    host.querySelectorAll('.ele-camp-dot').forEach((node) => {
      node.addEventListener('click', () => {
        const idx = parseInt(node.getAttribute('data-camp-idx'), 10);
        if (!isNaN(idx)) handleSelectCamp(idx);
      });
    });
  }

  function renderCampList(model, selectedIdx, meta) {
    const grid = document.getElementById('mountainCampList');
    if (!grid || !model) return;
    const milestoneList = meta ? meta.milestones : [];
    const cycleElapsed = meta ? meta.cycleElapsed : 0;
    const isDescent = meta ? meta.isDescent : false;
    const isAtSummit = meta ? meta.isAtSummit : false;

    grid.innerHTML = model.camps.map((c, idx) => {
      const ms = milestoneList && milestoneList[idx] ? milestoneList[idx] : null;
      const legInfo = ms ? ms.stageLegLabel : '';
      const reqHours = ms ? ms.requiredHours : 0;

      let statusClass = 'camp-status-locked';
      let statusLabel = `At ${formatDurationHM(reqHours * 60)}`;
      let cardStateClass = '';

      if (isDescent || isAtSummit) {
        if (c.title === 'Peak') {
          statusClass = 'camp-status-reached';
          statusLabel = 'Summited ✓';
          cardStateClass = 'is-reached';
        } else if (ms && ms.isNext) {
          const remMins = Math.max(1, Math.ceil((reqHours - cycleElapsed) * 60));
          statusClass = 'camp-status-next';
          statusLabel = `Descent · ${formatDurationHM(remMins)} to go`;
          cardStateClass = 'is-next';
        } else if (ms && ms.reachedDescent) {
          statusClass = 'camp-status-reached';
          statusLabel = c.title === 'Base Camp' ? 'Returned ✓' : 'Descended ✓';
          cardStateClass = 'is-reached';
        } else if (ms && ms.descentHours !== null) {
          statusClass = 'camp-status-locked';
          statusLabel = `Descent at ${formatDurationHM(ms.descentHours * 60)}`;
        } else if (c.title === 'Camp III') {
          statusClass = 'camp-status-reached';
          statusLabel = 'Past on descent ↓';
          cardStateClass = 'is-reached';
        } else {
          statusClass = 'camp-status-reached';
          statusLabel = 'Ascended ✓';
          cardStateClass = 'is-reached';
        }
      } else {
        const reached = ms ? ms.reachedAscent : false;
        const isNext = ms ? ms.isNext : false;
        if (reached) {
          statusClass = 'camp-status-reached';
          statusLabel = idx === 0 ? 'Staging ✓' : 'Reached ✓';
          cardStateClass = 'is-reached';
        } else if (isNext) {
          const remMins = Math.max(1, Math.ceil((reqHours - cycleElapsed) * 60));
          statusClass = 'camp-status-next';
          statusLabel = `Next · ${formatDurationHM(remMins)} to go`;
          cardStateClass = 'is-next';
        }
      }

      return `
        <button type="button" class="camp-stage-card ${cardStateClass} ${idx === selectedIdx ? 'is-selected' : ''}" data-camp-idx="${idx}">
          <div class="camp-card-top">
            <span class="camp-card-name">${c.title}</span>
            <span class="camp-card-ele">${Math.round(c.eleM).toLocaleString()} m</span>
          </div>
          <div class="camp-card-meta">${(c.distM / 1000).toFixed(2)} km · ${legInfo}</div>
          <div class="camp-card-meta">${c.zone}</div>
          <span class="camp-status-badge ${statusClass}">${statusLabel}</span>
        </button>
      `;
    }).join('');

    grid.querySelectorAll('.camp-stage-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-camp-idx'), 10);
        if (!isNaN(idx)) handleSelectCamp(idx);
      });
    });
  }

  function refreshClimbProgressUI(skipDbQuery) {
    if (!loadedModel) return;
    latestStats = computeStudyFocusStatsSync(climbScope, cachedIdbDaily, cachedIdbWatch);
    const totalHours = latestStats.totalMinutes / 60;
    const meta = getCampProgressMeta(loadedModel, totalHours, summitTargetHours);
    const climberPt = meta.climberPt;

    const stage = document.getElementById('mountainDioramaStage');
    if (stage && typeof window.setMountainClimberProgress === 'function') {
      window.setMountainClimberProgress(stage, meta.trailProgress, {
        isActive: latestStats.isLiveTimerActive,
        isDescent: meta.isDescent
      });
    }

    const eleEl = document.getElementById('statClimberEle');
    const hrsEl = document.getElementById('statStudyHours');
    const distEl = document.getElementById('statClimberDist');
    const nextEl = document.getElementById('statNextCamp');

    if (eleEl && climberPt) {
      eleEl.textContent = `${Math.round(climberPt.eleM).toLocaleString()} m`;
    }
    if (hrsEl) {
      hrsEl.textContent = formatDurationHM(latestStats.totalMinutes);
    }
    if (distEl && climberPt) {
      const distText = `${(climberPt.distM / 1000).toFixed(2)} / ${(loadedModel.totalDistM / 1000).toFixed(2)} km`;
      distEl.textContent = meta.isDescent ? `${distText} ↓` : distText;
    }
    if (nextEl) {
      if (meta.nextCamp) {
        nextEl.textContent = meta.isDescent || meta.isAtSummit
          ? `${meta.nextCamp.camp.shortName} ↓`
          : meta.nextCamp.camp.shortName;
      } else {
        nextEl.textContent = 'Base Camp ✓';
      }
    }

    const pctText = `${Math.round(meta.progress * 100)}%`;
    const headEl = document.getElementById('climberProgressHeadline');
    const fillEl = document.getElementById('climberProgressFill');
    const subEl = document.getElementById('climberProgressSub');
    const targetEl = document.getElementById('climberTargetSummary');
    const liveBadge = document.getElementById('climberLiveTimerBadge');
    const liveText = document.getElementById('climberLiveTimerText');

    const activeLegText = meta.activeStage ? `${meta.activeStage.from} → ${meta.activeStage.to}` : 'Base Camp';
    const nextTitle = meta.nextCamp ? meta.nextCamp.camp.title : 'Base Camp';
    const nextEle = meta.nextCamp ? Math.round(meta.nextCamp.camp.eleM).toLocaleString() : '5,364';
    const remMins = meta.nextCamp ? Math.max(1, Math.ceil((meta.nextCamp.requiredHours - meta.cycleElapsed) * 60)) : 0;

    if (headEl) {
      if (meta.completedRoundTrips >= 1) {
        const timesWord = meta.completedRoundTrips === 1 ? '1 time' : `${meta.completedRoundTrips} times`;
        if (meta.cycleElapsed < 1e-6) {
          headEl.textContent = `Climbed & Descended Everest ${timesWord} · Ready at Base Camp for Climb #${meta.expeditionNum}`;
        } else if (meta.isAtSummit) {
          headEl.textContent = `Climbed ${timesWord} + Summited Climb #${meta.expeditionNum}! · Starting Descent (${pctText})`;
        } else if (meta.isDescent) {
          headEl.textContent = `Climbed ${timesWord} · Climb #${meta.expeditionNum}: Descending ${activeLegText} (${pctText})`;
        } else {
          headEl.textContent = `Climbed ${timesWord} · Climb #${meta.expeditionNum}: Ascending ${activeLegText} (${pctText})`;
        }
      } else if (meta.isAtSummit) {
        headEl.textContent = `Summit Reached (8,849 m) in ${formatDurationHM(meta.ascentHours * 60)}! · Starting Descent (${pctText})`;
      } else if (meta.isDescent) {
        headEl.textContent = `1× Summit Reached · Descending ${activeLegText} (${pctText} of Round Trip)`;
      } else {
        const curName = meta.currentCamp ? meta.currentCamp.camp.title : 'Base Camp';
        headEl.textContent = `${curName} · Ascending ${activeLegText} (${pctText} of Round Trip)`;
      }
    }
    if (fillEl) {
      fillEl.style.width = `${(meta.progress * 100).toFixed(2)}%`;
    }
    if (subEl) {
      if (meta.completedRoundTrips >= 1) {
        const doneTotalHM = formatDurationHM(meta.completedRoundTrips * meta.cycleHours * 60);
        const lapElapsedHM = formatDurationHM(meta.cycleElapsed * 60);
        const timesWord = meta.completedRoundTrips === 1 ? '1 full round trip' : `${meta.completedRoundTrips} full round trips`;
        if (meta.cycleElapsed < 1e-6) {
          subEl.textContent = `Completed ${timesWord} (${doneTotalHM}) · Next on Climb #${meta.expeditionNum}: ${nextTitle} (${nextEle} m) in ${formatDurationHM(remMins)}`;
        } else {
          const dirVerb = meta.isDescent || meta.isAtSummit ? 'descending to' : 'progressing to';
          subEl.textContent = `${timesWord} (${doneTotalHM}) + ${lapElapsedHM} into Climb #${meta.expeditionNum} · ${dirVerb} ${nextTitle} (${nextEle} m) in ${formatDurationHM(remMins)}`;
        }
      } else if (meta.isAtSummit) {
        subEl.textContent = `Summited! Next descent leg: ${nextTitle} (${nextEle} m) in ${formatDurationHM(remMins)} · Total descent ${formatDurationHM(meta.descentHours * 60)}`;
      } else if (meta.isDescent) {
        subEl.textContent = `Descent: Next ${nextTitle} (${nextEle} m) in ${formatDurationHM(remMins)} · Stage avg ${formatDurationHM(meta.activeStage.durationHours * 60)}`;
      } else {
        subEl.textContent = `Next: ${nextTitle} (${nextEle} m) in ${formatDurationHM(remMins)} · Ascent ${formatDurationHM(meta.ascentHours * 60)} / Round Trip ${formatDurationHM(meta.cycleHours * 60)}`;
      }
    }
    if (targetEl) {
      const scopeLabel = climbScope === 'today' ? 'Today' : (climbScope === 'week' ? 'This Week' : 'All Time');
      targetEl.textContent = `${scopeLabel} · ${formatDurationHM(meta.cycleHours * 60)} Cycle (${formatDurationHM(meta.ascentHours * 60)}↑ + ${formatDurationHM(meta.descentHours * 60)}↓)`;
    }
    if (liveBadge && liveText) {
      if (latestStats.isLiveTimerActive) {
        liveBadge.style.display = 'inline-flex';
        liveText.textContent = `Timer Live · ${formatLiveTimerClock(latestStats.liveSessionElapsedSecs)}`;
      } else {
        liveBadge.style.display = 'none';
      }
    }

    renderElevationProfile(loadedModel, activeCampIdx, climberPt, meta.milestones, meta.isDescent || meta.isAtSummit);
    renderCampList(loadedModel, activeCampIdx, meta);

    if (!skipDbQuery && !idbSyncInFlight) {
      idbSyncInFlight = true;
      readStudyDashboardDB().then(({ dailyData, watchData }) => {
        idbSyncInFlight = false;
        cachedIdbDaily = dailyData;
        cachedIdbWatch = watchData;
        refreshClimbProgressUI(true);
      }).catch(() => {
        idbSyncInFlight = false;
      });
    }
  }

  function handleSelectCamp(idx) {
    if (!loadedModel) return;
    activeCampIdx = Math.max(0, Math.min(loadedModel.camps.length - 1, idx));
    const stage = document.getElementById('mountainDioramaStage');
    if (stage && typeof window.selectMountainCamp === 'function') {
      window.selectMountainCamp(stage, activeCampIdx);
    }
    refreshClimbProgressUI(true);
  }

  function syncScopeButtonsUI() {
    document.querySelectorAll('[data-climb-scope]').forEach((btn) => {
      const s = btn.getAttribute('data-climb-scope');
      btn.classList.toggle('active', s === climbScope);
    });
    const sel = document.getElementById('summitGoalHoursSelect');
    if (sel) {
      sel.value = String(summitTargetHours);
    }
  }

  function setClimbScope(scope) {
    if (scope !== 'all' && scope !== 'week' && scope !== 'today') return;
    climbScope = scope;
    writeStorage(SCOPE_STORAGE_KEY, scope);
    syncScopeButtonsUI();
    refreshClimbProgressUI(false);
  }

  function setSummitTargetHours(hoursVal) {
    const parsed = parseFloat(hoursVal);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    summitTargetHours = parsed;
    writeStorage(TARGET_HOURS_STORAGE_KEY, parsed);
    syncScopeButtonsUI();
    refreshClimbProgressUI(true);
  }

  function loadSavedClimbPreferences() {
    const savedScope = readStorage(SCOPE_STORAGE_KEY, 'all');
    if (savedScope === 'all' || savedScope === 'week' || savedScope === 'today') {
      climbScope = savedScope;
    }
    const savedTarget = parseFloat(readStorage(TARGET_HOURS_STORAGE_KEY, String(SOUTH_COL_BASE_ROUND_TRIP_HOURS)));
    if (Number.isFinite(savedTarget) && savedTarget > 0) {
      summitTargetHours = savedTarget;
    }
    syncScopeButtonsUI();
  }

  async function loadEverestGeoJson() {
    for (let i = 0; i < EVEREST_GEOJSON_URLS.length; i++) {
      try {
        const res = await fetch(EVEREST_GEOJSON_URLS[i], { cache: 'no-store' });
        if (!res.ok) continue;
        const data = await res.json();
        if (data && Array.isArray(data.features) && data.features.length > 0) {
          return data;
        }
      } catch (e) {
        // Try next candidate URL
      }
    }
    return FALLBACK_EVEREST_GEOJSON;
  }

  async function initMountainPage() {
    loadMountainTheme();
    loadSavedClimbPreferences();

    const stage = document.getElementById('mountainDioramaStage');
    if (!stage) return;

    try {
      const [geojson, idbData] = await Promise.all([
        loadEverestGeoJson(),
        readStudyDashboardDB()
      ]);

      cachedIdbDaily = idbData.dailyData;
      cachedIdbWatch = idbData.watchData;

      latestStats = computeStudyFocusStatsSync(climbScope, cachedIdbDaily, cachedIdbWatch);
      const initialProgress = Math.max(0, Math.min(1, (latestStats.totalMinutes / 60) / summitTargetHours));

      loadedModel = window.renderMountainDiorama(stage, geojson, {
        selectedCampIdx: activeCampIdx,
        climberProgress: initialProgress,
        climberActive: latestStats.isLiveTimerActive,
        onSelectCamp: (idx) => {
          activeCampIdx = idx;
          refreshClimbProgressUI(true);
        }
      });

      if (loadedModel) {
        refreshClimbProgressUI(true);
      }

      if (liveTickTimer) clearInterval(liveTickTimer);
      liveTickTimer = setInterval(() => {
        if (!loadedModel) return;
        const active = readJsonLocalStorage('activeFocusSession', null);
        if (active && active.startTime) {
          refreshClimbProgressUI(true);
        } else if (latestStats.isLiveTimerActive) {
          refreshClimbProgressUI(false);
        }
      }, 1000);
    } catch (err) {
      console.error('[Mountain] Failed to load Everest GeoJSON:', err);
      stage.innerHTML = '<div style="padding:28px;text-align:center;color:#fca5a5;">Unable to load Everest expedition GPS dataset.</div>';
    }
  }

  window.addEventListener('storage', (e) => {
    if (e.key === THEME_STORAGE_KEY) {
      loadMountainTheme();
    } else if (e.key === 'nepalForestHistory' || e.key === 'activeFocusSession') {
      refreshClimbProgressUI(false);
    } else if (e.key === SCOPE_STORAGE_KEY || e.key === TARGET_HOURS_STORAGE_KEY) {
      loadSavedClimbPreferences();
      refreshClimbProgressUI(true);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && loadedModel) {
      refreshClimbProgressUI(false);
    }
  });

  window.changeMountainTheme = changeMountainTheme;
  window.toggleMountainFullscreen = toggleMountainFullscreen;
  window.setClimbScope = setClimbScope;
  window.setSummitTargetHours = setSummitTargetHours;

  document.addEventListener('DOMContentLoaded', initMountainPage);
})();
