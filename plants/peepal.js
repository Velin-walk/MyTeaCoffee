/**
 * Botanical Plant Definition: Peepal tree (पीपल)
 * Sacred mountain tree (Ficus religiosa)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['peepal'] = {
    id: 9,
    slug: 'peepal',
    english: "Peepal tree",
    nepali: "पीपल",
    scientific: "Ficus religiosa",
    category: "Tree",
    icon: "🌳",
    desc: "Sacred mountain tree famous for its distinctive heart-shaped leaves with long slender weeping drip tips.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="86" rx="34" ry="7" fill="#546e7a" opacity="0.35"/>
        <path d="M50 86 Q49 72 50 62" stroke="#90a4ae" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M50 62 C40 54 34 58 36 68 C38 74 46 80 48 86 C47 78 52 72 50 62 Z" fill="#388e3c"/>
        <path d="M50 62 C60 54 66 58 64 68 C62 74 54 80 52 86 C53 78 48 72 50 62 Z" fill="#43a047"/>
        <path d="M50 62 Q49 46 50 38" stroke="#a5d6a7" stroke-width="1.2"/>
        <text x="50" y="28" font-size="18" text-anchor="middle">🌱</text>
      `,
      growing: `
        <ellipse cx="50" cy="86" rx="36" ry="7" fill="#546e7a" opacity="0.35"/>
        <path d="M47 86 C48 72 45 56 48 42" stroke="#90a4ae" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M47 54 Q34 46 24 38 M48 50 Q62 44 72 38" stroke="#90a4ae" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M24 38 C18 30 10 34 10 42 C10 48 18 54 20 62 C19 54 26 50 26 42 C26 34 24 34 24 38 Z" fill="#388e3c"/>
        <path d="M72 38 C78 30 86 34 86 42 C86 48 78 54 76 62 C77 54 70 50 70 42 C70 34 72 34 72 38 Z" fill="#43a047"/>
        <path d="M48 42 C42 32 38 38 42 46 C46 52 48 56 49 64 C49 56 54 50 54 44 C54 36 50 32 48 42 Z" fill="#4caf50"/>
        <text x="50" y="16" font-size="14" text-anchor="middle">🌿</text>
      `,
      mature: `
        <ellipse cx="50" cy="88" rx="38" ry="8" fill="#546e7a" opacity="0.35"/>
        <path d="M45 88 C47 74 42 60 46 48 C48 40 44 32 46 26" stroke="#90a4ae" stroke-width="6.5" stroke-linecap="round" fill="none"/>
        <path d="M47 88 C51 72 56 60 52 48" stroke="#78909c" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M46 54 Q32 46 18 38 M48 50 Q64 42 78 36" stroke="#90a4ae" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M46 36 Q34 26 26 16 M48 34 Q60 24 68 14" stroke="#90a4ae" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M18 38 C 12 30, 4 34, 4 44 C 4 52, 14 58, 16 68 C 15 58, 22 52, 22 44 C 22 34, 18 34, 18 38 Z" fill="#388e3c" stroke="#1b5e20" stroke-width="0.6"/>
        <path d="M18 38 Q 14 50, 16 68" stroke="#c8e6c9" stroke-width="0.8" fill="none"/>
        <path d="M78 36 C 84 28, 92 32, 92 42 C 92 50, 82 56, 80 66 C 81 56, 74 50, 74 42 C 74 32, 78 32, 78 36 Z" fill="#388e3c" stroke="#1b5e20" stroke-width="0.6"/>
        <path d="M78 36 Q 82 48, 80 66" stroke="#c8e6c9" stroke-width="0.8" fill="none"/>
        <path d="M26 16 C 18 10, 12 16, 14 24 C 16 30, 24 36, 26 44 C 26 36, 32 30, 32 24 C 32 16, 26 12, 26 16 Z" fill="#43a047" stroke="#1b5e20" stroke-width="0.6"/>
        <path d="M26 16 Q 24 28, 26 44" stroke="#c8e6c9" stroke-width="0.8" fill="none"/>
        <path d="M68 14 C 76 8, 82 14, 80 22 C 78 28, 70 34, 68 42 C 68 34, 62 28, 62 22 C 62 14, 68 10, 68 14 Z" fill="#43a047" stroke="#1b5e20" stroke-width="0.6"/>
        <path d="M68 14 Q 70 26, 68 42" stroke="#c8e6c9" stroke-width="0.8" fill="none"/>
        <path d="M46 20 C 38 12, 34 20, 38 28 C 42 34, 46 40, 48 48 C 48 40, 54 34, 56 28 C 58 20, 54 12, 46 20 Z" fill="#4caf50" stroke="#1b5e20" stroke-width="0.6"/>
        <path d="M46 20 Q 46 32, 48 48" stroke="#dcedc8" stroke-width="0.8" fill="none"/>
        <circle cx="36" cy="46" r="2.2" fill="#4a148c"/>
        <circle cx="60" cy="44" r="2.2" fill="#4a148c"/>
      `,
      withered: `
        <ellipse cx="50" cy="88" rx="36" ry="7" fill="#78909c" opacity="0.35"/>
        <path d="M47 88 C49 72 44 58 48 46 C50 38 46 30 48 24" stroke="#78909c" stroke-width="5.5" stroke-linecap="round" fill="none"/>
        <path d="M47 52 Q32 46 20 42 M49 48 Q64 42 76 40" stroke="#78909c" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M20 42 C14 36 12 44 14 52 C16 58 22 56 20 42 Z" fill="#8d6e63"/>
        <path d="M76 40 C82 34 84 42 82 50 C80 56 74 54 76 40 Z" fill="#8d6e63"/>
        <path d="M48 24 C44 18 42 26 44 34 C46 38 50 36 48 24 Z" fill="#6d4c41"/>
        <text x="50" y="20" font-size="20" text-anchor="middle">🥀</text>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
