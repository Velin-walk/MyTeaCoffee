/**
 * Botanical Plant Definition: Sacred lotus (कमल)
 * Sacred blossom (Nelumbo nucifera)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['lotus'] = {
    id: 35,
    slug: 'lotus',
    english: "Sacred lotus",
    nepali: "कमल",
    scientific: "Nelumbo nucifera",
    category: "Flower",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3c-1.5 4-4 7-8 9 4 1 8 0 8-3 0 3 4 4 8 3-4-2-6.5-5-8-9z"/><path d="M12 9c-2 3-4 5-8 6 3 3 8 2 8 0 0 2 5 3 8 0-4-1-6-3-8-6z"/></svg>',
    desc: "Sacred blossom emerging above broad floating emerald pads with layered delicate pink petals and a golden seed core.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="86" rx="42" ry="6" fill="#78909c" opacity="0.35"/>
        <ellipse cx="50" cy="87" rx="32" ry="4" fill="#b0bec5" opacity="0.35"/>
        <ellipse cx="36" cy="84" rx="14" ry="5" fill="#388e3c"/>
        <path d="M52 86 Q54 68 52 54" stroke="#43a047" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M52 54 C48 50 48 42 52 36 C56 42 56 50 52 54 Z" fill="#f48fb1"/>

      `,
      growing: `
        <ellipse cx="50" cy="86" rx="42" ry="7" fill="#78909c" opacity="0.3"/>
        <ellipse cx="32" cy="84" rx="20" ry="6" fill="#2e7d32"/>
        <ellipse cx="32" cy="83" rx="18" ry="5" fill="#388e3c"/>
        <path d="M52 86 Q50 62 50 44" stroke="#43a047" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M50 44 C42 40 42 28 50 20 C58 28 58 40 50 44 Z" fill="#e91e63"/>
        <path d="M50 44 C46 38 46 30 50 24 C54 30 54 38 50 44 Z" fill="#f48fb1"/>

      `,
      mature: `
        <ellipse cx="50" cy="86" rx="44" ry="7" fill="#b0bec5" opacity="0.3"/>
        <ellipse cx="50" cy="88" rx="38" ry="5" fill="#78909c" opacity="0.3"/>
        <!-- Floating circular emerald peltate pad -->
        <ellipse cx="28" cy="84" rx="22" ry="7" fill="#2e7d32"/>
        <ellipse cx="28" cy="83" rx="20" ry="6" fill="#388e3c"/>
        <path d="M28 83 L14 81 M28 83 L42 81 M28 83 L20 86 M28 83 L36 86" stroke="#81c784" stroke-width="0.7"/>
        <circle cx="28" cy="83" r="1.5" fill="#e8f5e9" opacity="0.8"/>
        <!-- Stalks -->
        <path d="M52 88 Q50 60 50 42" stroke="#43a047" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="51" cy="74" r="0.8" fill="#2e7d32"/>
        <circle cx="49" cy="62" r="0.8" fill="#2e7d32"/>
        <circle cx="51" cy="50" r="0.8" fill="#2e7d32"/>
        <path d="M68 88 Q70 66 72 52" stroke="#43a047" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M72 52 C66 48 66 38 72 32 C78 38 78 48 72 52 Z" fill="#ec407a"/>
        <path d="M72 52 C69 46 69 40 72 34 C75 40 75 46 72 52 Z" fill="#f48fb1"/>
        <!-- Multi-layered Sacred Lotus Blossom -->
        <path d="M50 42 C30 40 18 30 24 20 C34 26 44 34 50 42 Z" fill="#e91e63"/>
        <path d="M50 42 C70 40 82 30 76 20 C66 26 56 34 50 42 Z" fill="#e91e63"/>
        <path d="M50 42 C34 46 22 42 22 34 C30 32 42 38 50 42 Z" fill="#d81b60"/>
        <path d="M50 42 C66 46 78 42 78 34 C70 32 58 38 50 42 Z" fill="#d81b60"/>
        <path d="M50 42 C36 34 32 20 42 12 C48 20 49 32 50 42 Z" fill="#f06292"/>
        <path d="M50 42 C64 34 68 20 58 12 C52 20 51 32 50 42 Z" fill="#f06292"/>
        <path d="M50 42 C42 32 42 18 50 10 C58 18 58 32 50 42 Z" fill="#fce4ec"/>
        <path d="M50 42 C45 34 45 22 50 14 C55 22 55 34 50 42 Z" fill="#ffffff"/>
        <!-- Golden central seed receptacle and stamens -->
        <ellipse cx="50" cy="24" rx="7" ry="4" fill="#fbc02d"/>
        <circle cx="47" cy="23" r="0.9" fill="#f57f17"/>
        <circle cx="50" cy="23" r="0.9" fill="#f57f17"/>
        <circle cx="53" cy="23" r="0.9" fill="#f57f17"/>
        <circle cx="48" cy="25" r="0.9" fill="#f57f17"/>
        <circle cx="52" cy="25" r="0.9" fill="#f57f17"/>
        <path d="M43 25 Q42 21 44 19 M57 25 Q58 21 56 19 M45 28 Q44 26 46 24 M55 28 Q56 26 54 24" stroke="#ffeb3b" stroke-width="1.2" stroke-linecap="round"/>
      `,
      withered: `
        <ellipse cx="50" cy="88" rx="38" ry="6" fill="#78909c" opacity="0.3"/>
        <ellipse cx="28" cy="85" rx="18" ry="6" fill="#8d6e63" opacity="0.7"/>
        <path d="M52 88 Q50 64 42 48" stroke="#6d4c41" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Fallen petals and dried seedhead -->
        <ellipse cx="42" cy="46" rx="6" ry="4" fill="#5d4037"/>
        <ellipse cx="36" cy="87" rx="4" ry="2" fill="#8d6e63"/>
        <ellipse cx="58" cy="87" rx="3.5" ry="1.5" fill="#8d6e63"/>

      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
