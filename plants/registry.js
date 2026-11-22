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
    'jacaranda'
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

  function getPlantSlug(plant) {
    if (!plant) return 'rhododendron';
    if (typeof plant === 'object' && plant.slug && root.NEPAL_PLANTS_REGISTRY[plant.slug]) {
      return plant.slug;
    }
    const id = typeof plant === 'object' ? plant.id : plant;
    const name = typeof plant === 'object' ? `${plant.english || ''} ${plant.nepali || ''}`.toLowerCase() : String(plant).toLowerCase();

    if (id === 39 || name.includes('jacaranda') || name.includes('ज्याकारान्दा') || name.includes('mimosifolia')) return 'jacaranda';
    if (id === 38 || name.includes('suntala') || name.includes('सुन्तला') || name.includes('citrus') || name.includes('orange')) return 'suntala';
    if (id === 37 || name.includes('sunpati') || name.includes('सुनपाती') || name.includes('anthopogon')) return 'sunpati';
    if (id === 36 || name.includes('sunakhari') || name.includes('सुनखरी') || name.includes('orchid') || name.includes('dendrobium')) return 'sunakhari';
    if (id === 4 || (name.includes('rhododendron') && !name.includes('sunpati') && !name.includes('सुनपाती')) || name.includes('गुराँस')) return 'rhododendron';
    if (id === 9 || name.includes('peepal') || name.includes('पीपल')) return 'peepal';
    if (id === 10 || name.includes('banyan') || name.includes('बर')) return 'banyan';
    if (id === 1 || name.includes('sal') || name.includes('साल')) return 'sal';
    if (id === 2 || id === 3 || name.includes('pine') || name.includes('सल्ला')) return 'pine';
    if (id === 23 || name.includes('mugwort') || name.includes('तितेपाती')) return 'mugwort';
    if (id === 20 || name.includes('bamboo') || name.includes('बाँस')) return 'bamboo';
    if (id === 22 || name.includes('nettle') || name.includes('सिस्नु')) return 'nettle';
    if (id === 35 || name.includes('lotus') || name.includes('कमल')) return 'lotus';
    if (id === 33 || name.includes('marigold') || name.includes('सयपत्री')) return 'marigold';
    return 'rhododendron';
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

  function applySelectedPlantToForestHistory(plant) {
    const active = plant || getSelectedNepalPlant();
    if (!active) return false;
    try {
      const raw = localStorage.getItem('nepalForestHistory');
      if (!raw) return false;
      const history = JSON.parse(raw);
      if (!Array.isArray(history) || history.length === 0) return false;

      let changed = false;
      for (let i = 0; i < history.length; i++) {
        const item = history[i];
        if (!item || typeof item !== 'object') continue;
        if (
          item.id !== active.id ||
          item.slug !== active.slug ||
          item.nepali !== active.nepali ||
          item.english !== active.english ||
          item.scientific !== active.scientific ||
          item.category !== active.category
        ) {
          item.id = active.id;
          item.slug = active.slug;
          item.nepali = active.nepali;
          item.english = active.english;
          item.scientific = active.scientific;
          item.category = active.category;
          if (active.icon) item.icon = active.icon;
          changed = true;
        }
      }

      if (changed) {
        localStorage.setItem('nepalForestHistory', JSON.stringify(history));
      }
      return changed;
    } catch (e) {
      return false;
    }
  }

  function saveSelectedNepalPlant(id, webAppUrl) {
    const plants = root.NEPAL_PLANTS || NEPAL_PLANTS || [];
    const parsedId = parseInt(id, 10);
    const plant = plants.find(p => p.id === parsedId);
    if (!plant) return null;

    try {
      localStorage.setItem('selectedNepalPlantId', plant.id);
    } catch (e) {}

    applySelectedPlantToForestHistory(plant);

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

    applySelectedPlantToForestHistory(match);

    if (typeof root.renderActivePlantProfile === 'function') root.renderActivePlantProfile();
    if (typeof root.renderActivePlant === 'function') root.renderActivePlant();
    if (typeof root.renderMyForest === 'function') root.renderMyForest();
    if (typeof root.renderForestPlots === 'function') root.renderForestPlots();
    if (typeof root.renderPlantsCatalog === 'function') root.renderPlantsCatalog();
    if (typeof root.renderCatalogList === 'function') root.renderCatalogList();

    return match;
  }

  // Assign to global root (window or globalThis)
  root.NEPAL_PLANTS = NEPAL_PLANTS;
  root.getSelectedNepalPlant = getSelectedNepalPlant;
  root.getSelectedPlant = getSelectedNepalPlant;
  root.getCurrentPlant = getSelectedNepalPlant;
  root.applySelectedPlantToForestHistory = applySelectedPlantToForestHistory;
  root.saveSelectedNepalPlant = saveSelectedNepalPlant;
  root.syncSelectedNepalPlantFromState = syncSelectedNepalPlantFromState;
  root.getPlantSlug = getPlantSlug;
  root.getBotanicalSvgContent = getBotanicalSvgContent;
  root.getPlantGrowthSvg = getPlantGrowthSvg;
  root.getPlantGrowthSvgMarkup = getPlantGrowthSvg; // Alias for index.html compatibility
  root.getBotanicalAvatarSvg = getBotanicalAvatarSvg;
  root.getBotanicalIconSvg = getBotanicalIconSvg;
  root.getBotanicalPlotIconSvg = getBotanicalPlotIconSvg;
  root.getPlantStageInfo = getPlantStageInfo;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
