/**
 * Botanical Plant Definition: Mugwort (तितेपाती)
 * Aromatic Himalayan medicinal herb (Artemisia vulgaris)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['mugwort'] = {
    id: 23,
    slug: 'mugwort',
    english: "Mugwort",
    nepali: "तितेपाती",
    scientific: "Artemisia vulgaris",
    category: "Herb",
    icon: "🌿",
    desc: "Aromatic Himalayan medicinal herb with reddish stems, deeply serrated pinnatifid foliage, and nodding floral shoots.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="86" rx="32" ry="6" fill="#5d4037" opacity="0.45"/>
        <path d="M50 86 Q50 72 50 62" stroke="#8b3a3a" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <path d="M50 64 C42 62 36 56 34 50 C40 52 46 58 50 60 Z" fill="#2e7d32"/>
        <path d="M50 64 C58 62 64 56 66 50 C60 52 54 58 50 60 Z" fill="#388e3c"/>
        <path d="M50 62 C48 54 49 44 50 40 C51 44 52 54 50 62 Z" fill="#43a047"/>
        <circle cx="50" cy="38" r="2" fill="#81c784"/>
        <text x="50" y="28" font-size="18" text-anchor="middle">🌱</text>
      `,
      growing: `
        <ellipse cx="50" cy="86" rx="34" ry="7" fill="#4e342e" opacity="0.4"/>
        <path d="M50 86 L50 48" stroke="#7a2e2e" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M50 74 Q36 68 30 60 Q38 60 42 66 Q48 70 50 72 Z" fill="#2e7d32"/>
        <path d="M50 74 Q64 68 70 60 Q62 60 58 66 Q52 70 50 72 Z" fill="#2e7d32"/>
        <path d="M50 62 Q32 54 28 44 Q36 46 40 52 Q46 56 50 58 Z" fill="#388e3c"/>
        <path d="M50 62 Q68 54 72 44 Q64 46 60 52 Q54 56 50 58 Z" fill="#388e3c"/>
        <path d="M50 50 Q46 38 50 30 Q54 38 50 50 Z" fill="#4caf50"/>
        <path d="M50 74 L50 32" stroke="#a5d6a7" stroke-width="0.8" opacity="0.7"/>
        <text x="50" y="24" font-size="16" text-anchor="middle">🌿</text>
      `,
      mature: `
        <ellipse cx="50" cy="88" rx="36" ry="7" fill="#4e342e" opacity="0.4"/>
        <path d="M50 88 L50 40" stroke="#7a2e2e" stroke-width="3" stroke-linecap="round"/>
        <!-- Left Side Sprig -->
        <path d="M49 80 Q34 76 22 54" stroke="#7a2e2e" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <path d="M26 68 Q16 66 12 62 Q18 60 25 64 Z" fill="#2e7d32"/>
        <path d="M24 60 Q14 54 10 46 Q18 48 23 54 Z" fill="#388e3c"/>
        <path d="M23 54 Q18 46 16 38 Q22 42 23 48 Z" fill="#43a047"/>
        <circle cx="21" cy="46" r="1.6" fill="#2e7d32"/>
        <circle cx="20" cy="41" r="1.8" fill="#33691e"/>
        <circle cx="19" cy="36" r="1.5" fill="#558b2f"/>
        <circle cx="18" cy="32" r="1.3" fill="#689f38"/>
        <!-- Right Side Sprig -->
        <path d="M51 80 Q66 76 78 54" stroke="#7a2e2e" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <path d="M74 68 Q84 66 88 62 Q82 60 75 64 Z" fill="#2e7d32"/>
        <path d="M76 60 Q86 54 90 46 Q82 48 77 54 Z" fill="#388e3c"/>
        <path d="M77 54 Q82 46 84 38 Q78 42 77 48 Z" fill="#43a047"/>
        <circle cx="79" cy="46" r="1.6" fill="#2e7d32"/>
        <circle cx="80" cy="41" r="1.8" fill="#33691e"/>
        <circle cx="81" cy="36" r="1.5" fill="#558b2f"/>
        <circle cx="82" cy="32" r="1.3" fill="#689f38"/>
        <!-- Lower leaflets -->
        <path d="M50 74 Q42 74 38 78 Q42 84 48 78 Z" fill="#2e7d32"/>
        <path d="M50 74 Q58 74 62 78 Q58 84 52 78 Z" fill="#2e7d32"/>
        <!-- Main Deeply-Lobed Mugwort Leaf based on reference -->
        <path d="M50 68 C 45 66, 40 64, 34 68 C 38 64, 43 62, 45 58 C 37 54, 28 50, 24 40 C 31 43, 37 46, 41 42 C 33 36, 31 28, 32 18 C 37 24, 41 30, 44 26 C 40 18, 43 10, 50 6 C 57 10, 60 18, 56 26 C 59 30, 63 24, 68 18 C 69 28, 67 36, 59 42 C 63 46, 69 43, 76 40 C 72 50, 63 54, 55 58 C 57 62, 62 64, 66 68 C 60 64, 55 66, 50 68 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="0.8"/>
        <path d="M50 64 C 46 56, 38 48, 32 42 C 38 44, 43 44, 46 38 C 42 32, 40 24, 42 18 C 45 23, 48 26, 50 14 C 52 26, 55 23, 58 18 C 60 24, 58 32, 54 38 C 57 44, 62 44, 68 42 C 62 48, 54 56, 50 64 Z" fill="#388e3c" opacity="0.9"/>
        <path d="M50 68 L50 10" stroke="#7cb342" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M50 48 L32 38 M50 48 L68 38 M50 36 L38 24 M50 36 L62 24 M50 56 L30 52 M50 56 L70 52" stroke="#a5d6a7" stroke-width="0.75" stroke-linecap="round" opacity="0.8"/>
      `,
      withered: `
        <ellipse cx="50" cy="88" rx="34" ry="6" fill="#8d6e63" opacity="0.4"/>
        <path d="M50 88 Q48 68 44 48 Q40 38 34 32" stroke="#6d4c41" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M49 76 Q36 72 24 64 M48 74 Q60 70 66 62" stroke="#795548" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        <path d="M44 48 Q30 46 22 56 Q28 60 42 54 Z" fill="#8d6e63" opacity="0.85"/>
        <path d="M45 44 Q56 42 62 50 Q56 56 43 50 Z" fill="#795548" opacity="0.85"/>
        <text x="50" y="24" font-size="20" text-anchor="middle">🥀</text>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
