/**
 * Botanical Plant Definition: Rhododendron (लालीगुराँस)
 * National flower of Nepal (Rhododendron arboreum)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['rhododendron'] = {
    id: 4,
    slug: 'rhododendron',
    english: "Rhododendron",
    nepali: "लालीगुराँस",
    scientific: "Rhododendron arboreum",
    category: "Flower",
    icon: "🌺",
    desc: "National flower of Nepal with dark leathery leaves and spectacular bright scarlet-crimson blossom clusters.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="86" rx="34" ry="7" fill="#4e342e" opacity="0.45"/>
        <path d="M50 86 Q49 72 50 64" stroke="#6d4c41" stroke-width="3" stroke-linecap="round"/>
        <path d="M50 64 C42 62 36 54 36 46 C44 48 48 56 50 64 Z" fill="#1b5e20"/>
        <path d="M50 64 C58 62 64 54 64 46 C56 48 52 56 50 64 Z" fill="#2e7d32"/>
        <path d="M50 64 C46 54 48 44 50 38 C52 44 54 54 50 64 Z" fill="#388e3c"/>
        <circle cx="50" cy="36" r="2.8" fill="#d32f2f"/>
        <text x="50" y="26" font-size="18" text-anchor="middle">🌱</text>
      `,
      growing: `
        <ellipse cx="50" cy="86" rx="36" ry="7" fill="#4e342e" opacity="0.45"/>
        <path d="M50 86 Q49 68 46 54 Q44 44 50 36" stroke="#5d4037" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M47 58 Q36 50 30 42 M48 52 Q60 46 66 38" stroke="#5d4037" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M30 42 C20 40 18 30 22 24 C28 30 30 36 30 42 Z" fill="#1b5e20"/>
        <path d="M30 42 C34 32 38 26 42 22 C42 30 38 38 30 42 Z" fill="#2e7d32"/>
        <path d="M66 38 C76 36 78 26 74 20 C68 26 66 32 66 38 Z" fill="#1b5e20"/>
        <path d="M66 38 C62 28 58 22 54 18 C54 26 58 34 66 38 Z" fill="#2e7d32"/>
        <path d="M50 36 C44 30 44 20 50 14 C56 20 56 30 50 36 Z" fill="#c62828"/>
        <path d="M50 36 C47 28 47 22 50 18 C53 22 53 28 50 36 Z" fill="#b71c1c"/>
        <text x="50" y="10" font-size="14" text-anchor="middle">🌿</text>
      `,
      mature: `
        <ellipse cx="50" cy="88" rx="38" ry="8" fill="#4e342e" opacity="0.45"/>
        <path d="M48 88 Q50 72 47 58 Q44 46 48 38" stroke="#4e342e" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M47 62 Q34 54 24 44 M48 56 Q62 50 72 42" stroke="#5d4037" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M48 42 Q40 34 36 26 M48 40 Q56 32 62 24" stroke="#5d4037" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M24 44 C12 44 8 34 14 26 C22 32 24 38 24 44 Z" fill="#1b5e20"/>
        <path d="M24 44 C26 34 30 26 36 20 C36 30 32 38 24 44 Z" fill="#2e7d32"/>
        <path d="M72 42 C84 42 88 32 82 24 C74 30 72 36 72 42 Z" fill="#1b5e20"/>
        <path d="M72 42 C70 32 66 24 60 18 C60 28 64 36 72 42 Z" fill="#2e7d32"/>
        <path d="M48 38 C36 34 32 22 40 14 C44 24 46 32 48 38 Z" fill="#1b5e20"/>
        <path d="M48 38 C60 34 64 22 56 14 C52 24 50 32 48 38 Z" fill="#2e7d32"/>
        <circle cx="34" cy="30" r="8" fill="#c62828"/>
        <circle cx="62" cy="28" r="8" fill="#c62828"/>
        <circle cx="26" cy="40" r="7" fill="#d32f2f"/>
        <circle cx="70" cy="38" r="7" fill="#d32f2f"/>
        <circle cx="48" cy="24" r="11" fill="#b71c1c"/>
        <circle cx="48" cy="22" r="9" fill="#c62828"/>
        <path d="M40 22 Q48 14 56 22 Q48 30 40 22 Z" fill="#e53935"/>
        <circle cx="43" cy="24" r="4" fill="#d32f2f"/>
        <circle cx="53" cy="24" r="4" fill="#e53935"/>
        <path d="M44 24 Q41 18 43 14 M48 22 Q48 14 49 11 M52 24 Q55 18 53 14" stroke="#ffebee" stroke-width="1.2" stroke-linecap="round" fill="none"/>
        <circle cx="43" cy="14" r="1.3" fill="#ffd54f"/>
        <circle cx="49" cy="11" r="1.3" fill="#ffd54f"/>
        <circle cx="53" cy="14" r="1.3" fill="#ffd54f"/>
        <circle cx="26" cy="38" r="1" fill="#ffd54f"/>
        <circle cx="70" cy="36" r="1" fill="#ffd54f"/>
      `,
      withered: `
        <ellipse cx="50" cy="88" rx="36" ry="7" fill="#8d6e63" opacity="0.4"/>
        <path d="M48 88 Q50 72 47 58 Q44 46 48 38" stroke="#5d4037" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M47 62 Q34 58 24 54" stroke="#6d4c41" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M48 56 Q62 54 70 50" stroke="#6d4c41" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M24 54 Q18 64 22 72 Q26 66 24 54 Z" fill="#795548"/>
        <path d="M70 50 Q76 60 72 68 Q68 62 70 50 Z" fill="#795548"/>
        <circle cx="48" cy="38" r="8" fill="#8d6e63"/>
        <circle cx="42" cy="42" r="5" fill="#6d4c41"/>
        <circle cx="54" cy="42" r="5" fill="#6d4c41"/>
        <ellipse cx="38" cy="88" rx="4" ry="2" fill="#8d6e63"/>
        <ellipse cx="60" cy="87" rx="3" ry="1.5" fill="#6d4c41"/>
        <text x="50" y="22" font-size="20" text-anchor="middle">🥀</text>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
