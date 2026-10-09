/**
 * Master Registry & Botanical SVG Engine for Native Plants of Nepal
 * Collects individual plant definitions and provides botanical rendering helpers.
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};

  // Canonical order of the 10 Native Plants of Nepal
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
    'marigold'
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
    const id = typeof plant === 'object' ? plant.id : plant;
    const name = typeof plant === 'object' ? `${plant.english || ''} ${plant.nepali || ''}`.toLowerCase() : String(plant).toLowerCase();

    if (id === 4 || name.includes('rhododendron') || name.includes('गुराँस')) return 'rhododendron';
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

  function getBotanicalPlotIconSvg(item, isWithered) {
    const slug = getPlantSlug(item);
    const content = getBotanicalSvgContent(slug, 'mature', isWithered);
    return `<svg width="24" height="24" viewBox="0 0 100 100" class="botanical-svg-plot plant-${slug}" style="display:block;margin:0 auto;">${content}</svg>`;
  }

  // Assign to global root (window or globalThis)
  root.NEPAL_PLANTS = NEPAL_PLANTS;
  root.getPlantSlug = getPlantSlug;
  root.getBotanicalSvgContent = getBotanicalSvgContent;
  root.getPlantGrowthSvg = getPlantGrowthSvg;
  root.getPlantGrowthSvgMarkup = getPlantGrowthSvg; // Alias for index.html compatibility
  root.getBotanicalAvatarSvg = getBotanicalAvatarSvg;
  root.getBotanicalIconSvg = getBotanicalIconSvg;
  root.getBotanicalPlotIconSvg = getBotanicalPlotIconSvg;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
