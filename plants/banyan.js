/**
 * Botanical Plant Definition: Banyan tree (बर)
 * Immense sacred tree of Chautari rest-stops (Ficus benghalensis)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['banyan'] = {
    id: 10,
    slug: 'banyan',
    english: "Banyan tree",
    nepali: "बर",
    scientific: "Ficus benghalensis",
    category: "Tree",
    icon: "🌳",
    desc: "Immense sacred tree of Chautari rest-stops, spreading wide with characteristic aerial prop roots descending to earth.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="86" rx="36" ry="7" fill="#4e342e" opacity="0.45"/>
        <path d="M50 86 Q48 72 50 60" stroke="#5d4037" stroke-width="4.5" stroke-linecap="round"/>
        <ellipse cx="40" cy="54" rx="8" ry="5" fill="#1b5e20" transform="rotate(-20 40 54)"/>
        <ellipse cx="60" cy="54" rx="8" ry="5" fill="#2e7d32" transform="rotate(20 60 54)"/>
        <ellipse cx="50" cy="44" rx="7" ry="4" fill="#388e3c"/>
        <text x="50" y="28" font-size="18" text-anchor="middle">🌱</text>
      `,
      growing: `
        <ellipse cx="50" cy="86" rx="38" ry="7" fill="#4e342e" opacity="0.45"/>
        <path d="M46 86 Q48 68 47 50 M52 86 Q50 68 51 50" stroke="#5d4037" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M47 56 Q30 52 18 50 M51 56 Q68 52 80 50" stroke="#5d4037" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M28 52 L28 86 M70 52 L70 86" stroke="#795548" stroke-width="1.8" stroke-linecap="round"/>
        <ellipse cx="50" cy="34" rx="26" ry="15" fill="#1b5e20"/>
        <ellipse cx="32" cy="40" rx="18" ry="12" fill="#2e7d32"/>
        <ellipse cx="68" cy="40" rx="18" ry="12" fill="#2e7d32"/>
        <ellipse cx="50" cy="28" rx="20" ry="12" fill="#388e3c"/>
        <text x="50" y="14" font-size="14" text-anchor="middle">🌿</text>
      `,
      mature: `
        <ellipse cx="50" cy="88" rx="42" ry="8" fill="#4e342e" opacity="0.45"/>
        <path d="M44 88 Q48 66 46 48 M52 88 Q50 66 52 48" stroke="#5d4037" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M46 54 Q30 50 14 48 M50 54 Q70 50 86 48" stroke="#5d4037" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M48 46 Q34 38 22 34 M48 46 Q64 38 78 34" stroke="#6d4c41" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M22 50 L20 88 M32 52 L32 88" stroke="#795548" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M78 50 L80 88 M68 52 L68 88" stroke="#795548" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M16 50 Q16 64 17 76 M84 50 Q84 64 83 76" stroke="#a1887f" stroke-width="1.2" stroke-linecap="round" fill="none"/>
        <ellipse cx="50" cy="30" rx="30" ry="18" fill="#1b5e20"/>
        <ellipse cx="28" cy="38" rx="22" ry="15" fill="#2e7d32"/>
        <ellipse cx="72" cy="38" rx="22" ry="15" fill="#2e7d32"/>
        <ellipse cx="50" cy="24" rx="24" ry="14" fill="#388e3c"/>
        <ellipse cx="36" cy="32" rx="16" ry="12" fill="#43a047" opacity="0.9"/>
        <ellipse cx="64" cy="32" rx="16" ry="12" fill="#43a047" opacity="0.9"/>
        <circle cx="20" cy="46" r="2" fill="#d84315"/>
        <circle cx="80" cy="46" r="2" fill="#d84315"/>
        <circle cx="48" cy="42" r="2" fill="#d84315"/>
      `,
      withered: `
        <ellipse cx="50" cy="88" rx="40" ry="7" fill="#6d4c41" opacity="0.35"/>
        <path d="M46 88 Q48 68 46 50 M52 88 Q50 68 52 50" stroke="#5d4037" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M46 54 Q28 50 16 48 M50 54 Q72 50 84 48" stroke="#5d4037" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M22 50 L20 88 M32 52 L32 88 M78 50 L80 88 M68 52 L68 88" stroke="#8d6e63" stroke-width="1.6" stroke-dasharray="3 2"/>
        <ellipse cx="50" cy="34" rx="26" ry="12" fill="#795548" opacity="0.8"/>
        <ellipse cx="30" cy="40" rx="16" ry="9" fill="#8d6e63" opacity="0.75"/>
        <ellipse cx="70" cy="40" rx="16" ry="9" fill="#8d6e63" opacity="0.75"/>
        <text x="50" y="22" font-size="20" text-anchor="middle">🥀</text>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
