/**
 * Master Registry & Botanical SVG Engine for Native Plants of Nepal
 * Collects individual plant definitions and provides botanical rendering helpers.
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};

  // Canonical order of Native Plants of Nepal
  const PLANT_SLUGS_ORDER = [
    'rhododendron',
    'peepal',
    'banyan',
    'sal',
    'pine',
    'mugwort',
    'bamboo',
    'nettle',
    'lotus',
    'marigold',
    'sunakhari',
    'sunpati',
    'suntala',
    'jacaranda',
    'kenjo',
    'lauka'
  ];

  // Build canonical NEPAL_PLANTS array
  const NEPAL_PLANTS = PLANT_SLUGS_ORDER.map(slug => {
    const mod = root.NEPAL_PLANTS_REGISTRY[slug];
    if (!mod) {
      console.warn(`[BotanicalRegistry] Plant module '${slug}' not loaded.`);
      return null;
    }
    return {
      id: mod.id,
      slug: mod.slug,
      english: mod.english,
      nepali: mod.nepali,
      scientific: mod.scientific,
      category: mod.category,
      icon: mod.icon,
      desc: mod.desc
    };
  }).filter(Boolean);

  const EXACT_PLANT_ALIASES = {
    'lauka': 'lauka',
    'lauka (bottle gourd)': 'lauka',
    'bottle gourd': 'lauka',
    'gourd': 'lauka',
    'calabash': 'lauka',
    'lagenaria siceraria': 'lauka',
    'लौका': 'lauka',
    'kenjo': 'kenjo',
    'kenzo': 'kenjo',
    'kenzo flower': 'kenjo',
    'kenjo (padamchal)': 'kenjo',
    'padamchal': 'kenjo',
    'rheum nobile': 'kenjo',
    'sikkim rhubarb': 'kenjo',
    'केन्जो': 'kenjo',
    'पदमचाल': 'kenjo',
    'केन्जो (पदमचाल)': 'kenjo',
    'jacaranda': 'jacaranda',
    'jacaranda mimosifolia': 'jacaranda',
    'ज्याकारान्दा': 'jacaranda',
    'suntala': 'suntala',
    'suntala (orange tree)': 'suntala',
    'orange tree': 'suntala',
    'orange': 'suntala',
    'citrus sinensis': 'suntala',
    'सुन्तला': 'suntala',
    'sunpati': 'sunpati',
    'sunpati (dwarf rhododendron)': 'sunpati',
    'dwarf rhododendron': 'sunpati',
    'rhododendron anthopogon': 'sunpati',
    'सुनपाती': 'sunpati',
    'sunakhari': 'sunakhari',
    'sunakhari orchid': 'sunakhari',
    'orchid': 'sunakhari',
    'dendrobium densiflorum': 'sunakhari',
    'सुनखरी': 'sunakhari',
    'rhododendron': 'rhododendron',
    'rhododendron arboreum': 'rhododendron',
    'laliguras': 'rhododendron',
    'laligurans': 'rhododendron',
    'लालीगुराँस': 'rhododendron',
    'लालिगुराँस': 'rhododendron',
    'गुराँस': 'rhododendron',
    'peepal': 'peepal',
    'peepal tree': 'peepal',
    'ficus religiosa': 'peepal',
    'पीपल': 'peepal',
    'banyan': 'banyan',
    'banyan tree': 'banyan',
    'ficus benghalensis': 'banyan',
    'बर': 'banyan',
    'sal': 'sal',
    'sal tree': 'sal',
    'shorea robusta': 'sal',
    'साल': 'sal',
    'pine': 'pine',
    'chir pine': 'pine',
    'himalayan pine': 'pine',
    'pinus roxburghii': 'pine',
    'रानी सल्ला': 'pine',
    'सल्ला': 'pine',
    'mugwort': 'mugwort',
    'artemisia vulgaris': 'mugwort',
    'तितेपाती': 'mugwort',
    'bamboo': 'bamboo',
    'bambusa spp.': 'bamboo',
    'बाँस': 'bamboo',
    'nettle': 'nettle',
    'stinging nettle': 'nettle',
    'urtica dioica': 'nettle',
    'सिस्नु': 'nettle',
    'lotus': 'lotus',
    'sacred lotus': 'lotus',
    'nelumbo nucifera': 'lotus',
    'कमल': 'lotus',
    'marigold': 'marigold',
    'tagetes erecta': 'marigold',
    'सयपत्री': 'marigold'
  };

  const ID_TO_SLUG = {
    41: 'lauka',
    40: 'kenjo',
    39: 'jacaranda',
    38: 'suntala',
    37: 'sunpati',
    36: 'sunakhari',
    4: 'rhododendron',
    9: 'peepal',
    10: 'banyan',
    1: 'sal',
    2: 'pine',
    3: 'pine',
    23: 'mugwort',
    20: 'bamboo',
    22: 'nettle',
    35: 'lotus',
    33: 'marigold'
  };

  function matchPlantSlugOrNull(plant) {
    if (!plant) return null;
    if (typeof plant === 'object' && plant.slug && root.NEPAL_PLANTS_REGISTRY[plant.slug]) {
      return plant.slug;
    }

    const rawStr = typeof plant === 'object' ? '' : String(plant).trim();
    const id = typeof plant === 'object'
      ? Number(plant.id)
      : (/^\d+$/.test(rawStr) ? parseInt(rawStr, 10) : NaN);

    if (!isNaN(id) && ID_TO_SLUG[id]) return ID_TO_SLUG[id];

    const candidates = typeof plant === 'object'
      ? [plant.english, plant.nepali, plant.scientific].filter(Boolean)
      : [rawStr];

    for (let i = 0; i < candidates.length; i++) {
      const normalized = String(candidates[i]).trim().toLowerCase().replace(/\s+/g, ' ');
      if (!normalized) continue;

      if (EXACT_PLANT_ALIASES[normalized]) {
        return EXACT_PLANT_ALIASES[normalized];
      }

      // Disambiguate multi-word phrases before token lookup
      if (normalized.indexOf('dwarf rhododendron') !== -1 || normalized.indexOf('rhododendron anthopogon') !== -1) {
        return 'sunpati';
      }

      // Tokenize on separators so short words like 'बर' or 'sal' never match inside unrelated plant names
      const tokens = normalized.split(/[\s,()/\\\-:]+/).filter(Boolean);
      for (let t = 0; t < tokens.length; t++) {
        if (EXACT_PLANT_ALIASES[tokens[t]]) {
          return EXACT_PLANT_ALIASES[tokens[t]];
        }
      }
    }

    return null;
  }

  function getPlantSlug(plant) {
    return matchPlantSlugOrNull(plant) || 'rhododendron';
  }

  function resolvePlantFromSource(plantName, fallbackPlant) {
    const plants = root.NEPAL_PLANTS || NEPAL_PLANTS || [];
    if (plantName) {
      const slug = matchPlantSlugOrNull(plantName);
      if (slug) {
        const match = plants.find(p => p.slug === slug);
        if (match) return match;
      }
    }
    return fallbackPlant || null;
  }

  function getBotanicalSvgContent(slug, stage, isWithered) {
    const plantModule = root.NEPAL_PLANTS_REGISTRY[slug] || root.NEPAL_PLANTS_REGISTRY['rhododendron'];
    if (!plantModule || !plantModule.stages) return '';
    if (isWithered) {
      return plantModule.stages.withered || '';
    }
    return plantModule.stages[stage] || plantModule.stages.mature || '';
  }

  function getPlantGrowthSvg(plant, percent, isWithered) {
    const slug = getPlantSlug(plant);
    const stage = percent < 25 ? 'sprout' : (percent < 60 ? 'growing' : 'mature');
    const content = getBotanicalSvgContent(slug, stage, isWithered);
    return `<svg width="120" height="120" viewBox="0 0 100 100" class="botanical-svg plant-${slug}">${content}</svg>`;
  }

  function getBotanicalAvatarSvg(plant) {
    const slug = getPlantSlug(plant);
    const content = getBotanicalSvgContent(slug, 'mature', false);
    return `<svg width="76" height="76" viewBox="0 0 100 100" class="botanical-svg-avatar plant-${slug}" style="display:block;margin:0 auto;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.15));">${content}</svg>`;
  }

  function getBotanicalIconSvg(plant) {
    const slug = getPlantSlug(plant);
    const content = getBotanicalSvgContent(slug, 'mature', false);
    return `<svg width="36" height="36" viewBox="0 0 100 100" class="botanical-svg-icon plant-${slug}" style="display:block;margin:0 auto;">${content}</svg>`;
  }

  function getPlantStageInfo(item) {
    if (!item) return { stage: 'mature', graphicStage: 'mature', scale: 1.0, pct: 100 };

    let stage = item.stage;
    let pct = (typeof item.growthPercent === 'number') ? item.growthPercent : null;

    if (!stage && pct !== null) {
      if (pct < 25) stage = 'sprout';
      else if (pct < 60) stage = 'growing';
      else if (pct < 95) stage = 'budding';
      else if (pct < 100) stage = 'maturing';
      else stage = 'mature';
    } else if (!stage && typeof item.minutes === 'number') {
      if (item.minutes >= 25) {
        stage = 'mature';
        pct = 100;
      } else {
        pct = Math.min(100, (item.minutes / 25) * 100);
        if (pct < 25) stage = 'sprout';
        else if (pct < 60) stage = 'growing';
        else if (pct < 95) stage = 'budding';
        else if (pct < 100) stage = 'maturing';
        else stage = 'mature';
      }
    }

    if (!stage) stage = 'mature';
    if (pct === null) {
      pct = (stage === 'sprout') ? 20 : ((stage === 'growing') ? 50 : ((stage === 'budding') ? 80 : 100));
    }

    // Graphical artwork stage according to table:
    // Sprout -> 'sprout'
    // Growing -> 'growing'
    // Budding (Mature graphic) -> 'mature'
    // Maturing -> 'mature'
    // Planted -> 'mature'
    const graphicStage = (stage === 'sprout') ? 'sprout' : ((stage === 'growing') ? 'growing' : 'mature');

    // Visual scale factor based on stage of growth:
    // Sprout: 0.58 (small seedling)
    // Growing: 0.78 (young growing plant)
    // Budding: 0.88 (budding flower/tree)
    // Maturing: 0.94 (maturing tree)
    // Mature / Planted: 1.0 (fully mature)
    let scale = 1.0;
    if (stage === 'sprout') scale = 0.58;
    else if (stage === 'growing') scale = 0.78;
    else if (stage === 'budding') scale = 0.88;
    else if (stage === 'maturing') scale = 0.94;
    else scale = 1.0;

    return { stage, graphicStage, scale, pct };
  }

  function getBotanicalPlotIconSvg(item, isWithered) {
    const slug = getPlantSlug(item);
    const stageInfo = getPlantStageInfo(item);
    const graphicStage = isWithered ? 'mature' : stageInfo.graphicStage;
    const content = getBotanicalSvgContent(slug, graphicStage, isWithered);
    const scale = isWithered ? 0.88 : stageInfo.scale;
    return `<svg width="24" height="24" viewBox="0 0 100 100" class="botanical-svg-plot plant-${slug} stage-${stageInfo.stage}" style="display:block;margin:0 auto;width:100%!important;height:100%!important;transform:scale(${scale});transform-origin:50% 90%;">${content}</svg>`;
  }

  /**
   * Retrieves the plant currently chosen in Nepal Forest.
   * Nepal Forest always has a plant chosen (stored in 'selectedNepalPlantId').
   * If not already set, it chooses and persists a plant so there is always a chosen plant.
   */
  function getSelectedNepalPlant() {
    const plants = root.NEPAL_PLANTS || NEPAL_PLANTS || [];
    let savedId = null;
    try {
      const stored = localStorage.getItem('selectedNepalPlantId');
      if (stored !== null && stored !== '') {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed > 0) savedId = parsed;
      }
    } catch (e) {}

    let chosen = null;
    if (savedId) {
      chosen = plants.find(p => p.id === savedId);
    }

    if (!chosen && plants.length > 0) {
      chosen = plants[0];
      try {
        localStorage.setItem('selectedNepalPlantId', chosen.id);
      } catch (e) {}
    }

    return chosen;
  }

  function saveSelectedNepalPlant(id, webAppUrl) {
    const plants = root.NEPAL_PLANTS || NEPAL_PLANTS || [];
    const parsedId = parseInt(id, 10);
    const plant = plants.find(p => p.id === parsedId);
    if (!plant) return null;

    try {
      localStorage.setItem('selectedNepalPlantId', plant.id);
    } catch (e) {}

    const url = webAppUrl || root.WEB_APP_URL;
    if (url && typeof fetch === 'function') {
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'saveState', type: 'SelectedPlant', startTime: plant.id }),
          keepalive: true
        }).catch(() => {});
      } catch (e) {}
    }
    return plant;
  }

  function syncSelectedNepalPlantFromState(props) {
    if (!props || !props.SelectedPlant_startTime) return null;
    const remoteId = parseInt(props.SelectedPlant_startTime, 10);
    if (isNaN(remoteId) || remoteId <= 0) return null;

    const plants = root.NEPAL_PLANTS || NEPAL_PLANTS || [];
    const match = plants.find(p => p.id === remoteId);
    if (!match) return null;

    try {
      localStorage.setItem('selectedNepalPlantId', match.id);
    } catch (e) {}

    if (typeof root.selectedForestPlantId !== 'undefined') {
      root.selectedForestPlantId = match.id;
    }

    if (typeof root.renderActivePlantProfile === 'function') root.renderActivePlantProfile();
    if (typeof root.renderActivePlant === 'function') root.renderActivePlant();
    if (typeof root.renderMyForest === 'function') root.renderMyForest();
    if (typeof root.renderForestPlots === 'function') root.renderForestPlots();
    if (typeof root.renderPlantsCatalog === 'function') root.renderPlantsCatalog();
    if (typeof root.renderCatalogList === 'function') root.renderCatalogList();

    return match;
  }

  function formatLocalDateKey(dateObj) {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function parseLocalDateKey(dateKey) {
    const m = String(dateKey || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
  }

  function syncSheetSessionsToForestHistory(dayGroups, fallbackPlant, options) {
    if (!Array.isArray(dayGroups)) return false;
    const opts = options || {};
    const reconcileAll = Boolean(opts.reconcileAllSheetDates);

    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('nepalForestHistory')) || [];
    } catch (e) {
      history = [];
    }
    if (!Array.isArray(history)) history = [];

    const reconciledDateKeys = new Set(dayGroups.map(g => g.dateKey).filter(Boolean));
    const localItems = [];
    const preservedSyncedItems = [];

    history.forEach(item => {
      if (!item || typeof item !== 'object') return;
      const isSynced = item.source === 'charts' || item.source === 'charts-sync';
      if (!isSynced) {
        localItems.push(item);
        return;
      }
      if (!reconcileAll) {
        const itemDateKey = item.timestamp ? formatLocalDateKey(new Date(item.timestamp)) : '';
        if (!reconciledDateKeys.has(itemDateKey)) {
          // Repair previously mis-labeled '< 25m -> growing' stage on older synced items
          if (typeof item.minutes === 'number' && item.minutes < 25) {
            const repaired = getPlantStageInfo({ minutes: item.minutes });
            if (item.stage !== repaired.stage || item.growthPercent !== Math.round(repaired.pct)) {
              preservedSyncedItems.push({
                ...item,
                stage: repaired.stage,
                growthPercent: Math.round(repaired.pct)
              });
              return;
            }
          }
          preservedSyncedItems.push(item);
        }
      }
    });

    const newSyncedItems = [];
    const sortedGroups = dayGroups.slice().sort((a, b) => String(a.dateKey).localeCompare(String(b.dateKey)));

    sortedGroups.forEach(group => {
      const targetDate = group.targetDate || parseLocalDateKey(group.dateKey);
      if (!targetDate || !Array.isArray(group.sessions)) return;
      const dateKey = group.dateKey || formatLocalDateKey(targetDate);
      const daysAgo = typeof group.daysAgo === 'number' ? group.daysAgo : 0;

      group.sessions.forEach(sess => {
        if (!sess || typeof sess.hrs !== 'number' || sess.hrs <= 0 || typeof sess.start !== 'number') return;

        const sourcePlant = sess.plant ? resolvePlantFromSource(sess.plant, null) : null;
        if (!sourcePlant && daysAgo >= 7) return;
        const sessionPlant = sourcePlant || fallbackPlant;
        if (!sessionPlant) return;

        const totalMins = Math.max(1, Math.round(sess.hrs * 60));
        const startHour = Math.floor(sess.start);
        const startMin = Math.round((sess.start % 1) * 60);
        const baseStartTime = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate(),
          startHour,
          startMin
        ).getTime();

        const fullCycles = Math.floor(totalMins / 25);
        const remMins = totalMins % 25;
        const chunks = [];

        if (totalMins <= 25) {
          chunks.push({ mins: totalMins, offsetMins: 0, cycleIdx: 0 });
        } else {
          for (let c = 0; c < fullCycles; c++) {
            chunks.push({ mins: 25, offsetMins: c * 25, cycleIdx: c });
          }
          if (remMins >= 1) {
            chunks.push({ mins: remMins, offsetMins: fullCycles * 25, cycleIdx: fullCycles });
          }
        }

        chunks.forEach(chunk => {
          const chunkSessTime = baseStartTime + ((chunk.offsetMins + chunk.mins) * 60 * 1000);
          const chunkSessionKey = `${dateKey}_${sess.start.toFixed(2)}_${sess.hrs.toFixed(2)}_c${chunk.cycleIdx}`;

          // Do not duplicate a session already planted locally in this browser
          const matchesLocal = localItems.some(item => {
            if (item.sessionKey && item.sessionKey === chunkSessionKey) return true;
            const timeDiff = Math.abs((item.timestamp || 0) - chunkSessTime);
            const minDiff = Math.abs((item.minutes || 0) - chunk.mins);
            return timeDiff <= 10 * 60 * 1000 && minDiff <= 3;
          });
          if (matchesLocal) return;

          // Deduplicate duplicate sheet log rows within 3 minutes & ±3 min duration
          const matchesSynced = newSyncedItems.some(item => {
            if (item.sessionKey === chunkSessionKey) return true;
            const timeDiff = Math.abs((item.timestamp || 0) - chunkSessTime);
            const minDiff = Math.abs((item.minutes || 0) - chunk.mins);
            return timeDiff <= 3 * 60 * 1000 && minDiff <= 3;
          });
          if (matchesSynced) return;

          const stageInfo = getPlantStageInfo({ minutes: chunk.mins });
          newSyncedItems.push({
            id: sessionPlant.id,
            slug: sessionPlant.slug,
            nepali: sessionPlant.nepali,
            english: sessionPlant.english,
            scientific: sessionPlant.scientific,
            category: sessionPlant.category,
            icon: sessionPlant.icon,
            minutes: chunk.mins,
            isHealthy: true,
            stage: stageInfo.stage,
            growthPercent: Math.round(stageInfo.pct),
            timestamp: chunkSessTime,
            sessionKey: chunkSessionKey,
            source: 'charts-sync'
          });
        });
      });
    });

    const nextHistory = localItems
      .concat(preservedSyncedItems, newSyncedItems)
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    let prevSerialized = '';
    let nextSerialized = '';
    try {
      prevSerialized = JSON.stringify(history);
      nextSerialized = JSON.stringify(nextHistory);
    } catch (e) {}

    if (prevSerialized === nextSerialized) return false;

    try {
      localStorage.setItem('nepalForestHistory', nextSerialized || JSON.stringify(nextHistory));
    } catch (e) {
      try {
        localStorage.setItem('nepalForestHistory', JSON.stringify(nextHistory.slice(-500)));
      } catch (err) {}
    }
    return true;
  }

  function appendQuery(baseUrl, qs) {
    if (typeof root.buildApiUrl === 'function') return root.buildApiUrl(baseUrl, qs);
    const clean = String(qs || '').replace(/^\?/, '');
    if (!clean) return baseUrl;
    return baseUrl + (baseUrl.indexOf('?') === -1 ? '?' : '&') + clean;
  }

  async function fetchAndSyncForestHistory(webAppUrl, fallbackPlant, onUpdated) {
    const targetBase = webAppUrl || (typeof root.getEffectiveWebAppUrl === 'function' ? root.getEffectiveWebAppUrl() : root.WEB_APP_URL);
    if (!targetBase || typeof fetch !== 'function') return false;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    let changed = false;

    try {
      const res = await fetch(appendQuery(targetBase, `action=getForestData&_t=${Date.now()}`));
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const rows = await res.json();
      const isValidForestResponse = Array.isArray(rows) && (
        rows.length === 0 ||
        (rows[0] && typeof rows[0] === 'object' && !Array.isArray(rows[0]) && typeof rows[0].date === 'string')
      );

      if (isValidForestResponse) {
        const groupsByDate = new Map();
        rows.forEach(sess => {
          if (!sess || !sess.date) return;
          const targetDate = parseLocalDateKey(sess.date);
          if (!targetDate) return;
          if (!groupsByDate.has(sess.date)) {
            const daysAgo = Math.round((todayStart - targetDate.getTime()) / (24 * 60 * 60 * 1000));
            groupsByDate.set(sess.date, {
              dateKey: sess.date,
              targetDate,
              daysAgo,
              sessions: []
            });
          }
          groupsByDate.get(sess.date).sessions.push(sess);
        });
        changed = syncSheetSessionsToForestHistory(
          Array.from(groupsByDate.values()),
          fallbackPlant,
          { reconcileAllSheetDates: true }
        );
        if (changed && typeof onUpdated === 'function') onUpdated();
        return changed;
      }
    } catch (e) {}

    // Fallback when deployed GAS does not yet include action=getForestData
    const dayGroups = [];
    for (let d = 0; d < 7; d++) {
      try {
        const res = await fetch(appendQuery(targetBase, `action=getWatchData&daysAgo=${d}&_t=${Date.now()}`));
        if (!res.ok) continue;
        const sessions = await res.json();
        if (!Array.isArray(sessions) || sessions.length === 0) continue;
        const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - d);
        dayGroups.push({
          dateKey: formatLocalDateKey(targetDate),
          targetDate,
          daysAgo: d,
          sessions
        });
      } catch (e) {}
    }

    if (dayGroups.length > 0) {
      changed = syncSheetSessionsToForestHistory(dayGroups, fallbackPlant, { reconcileAllSheetDates: false });
      if (changed && typeof onUpdated === 'function') onUpdated();
    }
    return changed;
  }

  // Assign to global root (window or globalThis)
  root.NEPAL_PLANTS = NEPAL_PLANTS;
  root.getSelectedNepalPlant = getSelectedNepalPlant;
  root.getSelectedPlant = getSelectedNepalPlant;
  root.getCurrentPlant = getSelectedNepalPlant;
  root.saveSelectedNepalPlant = saveSelectedNepalPlant;
  root.syncSelectedNepalPlantFromState = syncSelectedNepalPlantFromState;
  root.resolvePlantFromSource = resolvePlantFromSource;
  root.formatLocalDateKey = formatLocalDateKey;
  root.syncSheetSessionsToForestHistory = syncSheetSessionsToForestHistory;
  root.fetchAndSyncForestHistory = fetchAndSyncForestHistory;
  root.getPlantSlug = getPlantSlug;
  root.getBotanicalSvgContent = getBotanicalSvgContent;
  root.getPlantGrowthSvg = getPlantGrowthSvg;
  root.getPlantGrowthSvgMarkup = getPlantGrowthSvg; // Alias for index.html compatibility
  root.getBotanicalAvatarSvg = getBotanicalAvatarSvg;
  root.getBotanicalIconSvg = getBotanicalIconSvg;
  root.getBotanicalPlotIconSvg = getBotanicalPlotIconSvg;
  root.getPlantStageInfo = getPlantStageInfo;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
