/**
 * Botanical Plant Definition: Chir pine (रानी सल्ला)
 * Aromatic Himalayan Queen Pine (Pinus roxburghii)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['pine'] = {
    id: 2,
    slug: 'pine',
    english: "Chir pine",
    nepali: "रानी सल्ला",
    scientific: "Pinus roxburghii",
    category: "Tree",
    icon: "🌲",
    desc: "Aromatic Himalayan Queen Pine with tall plated reddish trunk, tiered branches, and long weeping 3-needle fascicles.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="86" rx="34" ry="7" fill="#4e342e" opacity="0.45"/>
        <path d="M50 86 L50 62" stroke="#8d4024" stroke-width="3" stroke-linecap="round"/>
        <path d="M50 62 L38 52 M50 62 L42 44 M50 62 L50 40 M50 62 L58 44 M50 62 L62 52" stroke="#2e7d32" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="50" cy="62" r="2.5" fill="#5d4037"/>
        <text x="50" y="28" font-size="18" text-anchor="middle">🌱</text>
      `,
      growing: `
        <ellipse cx="50" cy="86" rx="34" ry="7" fill="#4e342e" opacity="0.45"/>
        <path d="M49 86 L50 28" stroke="#8d4024" stroke-width="5" stroke-linecap="round"/>
        <path d="M49 60 Q34 58 22 62 M50 60 Q66 58 78 62" stroke="#5d2815" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <path d="M49 44 Q38 42 28 44 M50 44 Q62 42 72 44" stroke="#5d2815" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M22 62 Q18 68 16 76 M78 62 Q82 68 84 76" stroke="#2e7d32" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        <path d="M28 44 Q24 52 24 60 M72 44 Q76 52 76 60" stroke="#388e3c" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        <path d="M50 28 L50 16 M46 22 L40 18 M54 22 L60 18" stroke="#4caf50" stroke-width="1.6" stroke-linecap="round"/>
        <ellipse cx="34" cy="46" rx="2.5" ry="3.5" fill="#5d4037"/>
        <text x="50" y="12" font-size="14" text-anchor="middle">🌲</text>
      `,
      mature: `
        <ellipse cx="50" cy="88" rx="34" ry="7" fill="#4e342e" opacity="0.45"/>
        <path d="M48 88 L49 24" stroke="#8d4024" stroke-width="6" stroke-linecap="round"/>
        <path d="M51 88 L50 24" stroke="#6d2e18" stroke-width="4" stroke-linecap="round"/>
        <path d="M48 80 L48 72 M49 64 L49 54 M50 44 L50 34" stroke="#4a1c0d" stroke-width="1.4"/>
        <path d="M48 58 Q32 56 18 60 M50 58 Q68 56 82 60" stroke="#5d2815" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M49 44 Q36 42 24 44 M50 44 Q64 42 76 44" stroke="#5d2815" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M49 32 Q40 30 32 30 M50 32 Q60 30 68 30" stroke="#5d2815" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <path d="M18 60 Q14 66 12 74 M22 59 Q18 68 18 76 M26 58 Q24 68 25 76" stroke="#2e7d32" stroke-width="1.4" stroke-linecap="round" fill="none"/>
        <path d="M82 60 Q86 66 88 74 M78 59 Q82 68 82 76 M74 58 Q76 68 75 76" stroke="#2e7d32" stroke-width="1.4" stroke-linecap="round" fill="none"/>
        <path d="M24 44 Q20 52 18 60 M28 43 Q26 54 26 62 M32 43 Q32 54 34 62" stroke="#388e3c" stroke-width="1.4" stroke-linecap="round" fill="none"/>
        <path d="M76 44 Q80 52 82 60 M72 43 Q74 54 74 62 M68 43 Q68 54 66 62" stroke="#388e3c" stroke-width="1.4" stroke-linecap="round" fill="none"/>
        <path d="M32 30 Q28 38 28 46 M38 31 Q38 42 40 48 M44 26 Q42 36 42 44" stroke="#43a047" stroke-width="1.4" stroke-linecap="round" fill="none"/>
        <path d="M68 30 Q72 38 72 46 M62 31 Q62 42 60 48 M56 26 Q58 36 58 44" stroke="#43a047" stroke-width="1.4" stroke-linecap="round" fill="none"/>
        <path d="M50 24 Q48 16 50 10 M50 24 Q44 18 42 12 M50 24 Q56 18 58 12" stroke="#4caf50" stroke-width="1.4" stroke-linecap="round" fill="none"/>
        <ellipse cx="28" cy="46" rx="3.5" ry="5" fill="#5d4037" transform="rotate(15 28 46)"/>
        <ellipse cx="72" cy="46" rx="3.5" ry="5" fill="#5d4037" transform="rotate(-15 72 46)"/>
        <ellipse cx="38" cy="33" rx="3" ry="4" fill="#6d4c41"/>
      `,
      withered: `
        <ellipse cx="50" cy="88" rx="32" ry="6" fill="#4e342e" opacity="0.4"/>
        <path d="M49 88 L50 24" stroke="#6d2e18" stroke-width="5" stroke-linecap="round"/>
        <path d="M49 60 Q34 60 22 66 M50 60 Q66 60 78 66" stroke="#4a1c0d" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M49 46 Q38 46 28 50 M50 46 Q62 46 72 50" stroke="#4a1c0d" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <path d="M22 66 L18 78 M78 66 L82 78 M28 50 L24 60 M72 50 L76 60" stroke="#8d6e63" stroke-width="1.2" stroke-linecap="round"/>
        <ellipse cx="28" cy="52" rx="3" ry="4" fill="#5d4037"/>
        <text x="50" y="18" font-size="20" text-anchor="middle">🥀</text>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
