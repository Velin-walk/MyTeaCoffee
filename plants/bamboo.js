/**
 * Botanical Plant Definition: Bamboo (बाँस)
 * Fast-growing giant mountain grass (Bambusa spp.)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['bamboo'] = {
    id: 20,
    slug: 'bamboo',
    english: "Bamboo",
    nepali: "बाँस",
    scientific: "Bambusa spp.",
    category: "Grass",
    icon: "🎋",
    desc: "Fast-growing giant mountain grass with segmented nodal culms, cream rings, and graceful fluttering sprays of leaves.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="86" rx="34" ry="7" fill="#4e342e" opacity="0.45"/>
        <path d="M42 86 C42 72 48 60 50 50 C52 60 58 72 58 86 Z" fill="#689f38"/>
        <path d="M44 80 L56 80 M46 72 L54 72 M48 64 L52 64" stroke="#33691e" stroke-width="1.4"/>
        <path d="M50 50 L50 42" stroke="#7cb342" stroke-width="2"/>
        <text x="50" y="28" font-size="18" text-anchor="middle">🌱</text>
      `,
      growing: `
        <ellipse cx="50" cy="86" rx="34" ry="7" fill="#4e342e" opacity="0.4"/>
        <path d="M46 86 L44 26" stroke="#689f38" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M56 86 L56 22" stroke="#558b2f" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="45" cy="58" rx="2.8" ry="1" fill="#33691e"/>
        <ellipse cx="56" cy="54" rx="3.2" ry="1.2" fill="#33691e"/>
        <ellipse cx="44.5" cy="40" rx="2.5" ry="0.9" fill="#33691e"/>
        <ellipse cx="56" cy="36" rx="3" ry="1.1" fill="#33691e"/>
        <!-- Graceful drooping leaf sprays -->
        <path d="M44 40 Q30 36 20 42" stroke="#558b2f" stroke-width="1.2" fill="none"/>
        <path d="M20 42 C14 40 12 46 18 48 C24 46 22 42 20 42 Z" fill="#2e7d32"/>
        <path d="M56 36 Q70 32 80 40" stroke="#558b2f" stroke-width="1.2" fill="none"/>
        <path d="M80 40 C86 40 88 46 82 48 C78 46 78 42 80 40 Z" fill="#388e3c"/>
        <text x="50" y="16" font-size="14" text-anchor="middle">🎋</text>
      `,
      mature: `
        <ellipse cx="50" cy="88" rx="36" ry="7" fill="#4e342e" opacity="0.4"/>
        <!-- Young shoot at base -->
        <path d="M26 88 C26 78 30 72 32 68 C34 72 38 78 38 88 Z" fill="#689f38"/>
        <path d="M27 82 L37 82 M29 76 L35 76" stroke="#43a047" stroke-width="1.2"/>
        <!-- Culm 1 (Main Central-Right) -->
        <path d="M54 88 L52 14" stroke="#558b2f" stroke-width="4.2" stroke-linecap="round"/>
        <ellipse cx="53.5" cy="72" rx="3.5" ry="1.2" fill="#33691e"/>
        <ellipse cx="53" cy="54" rx="3.2" ry="1.2" fill="#33691e"/>
        <ellipse cx="52.5" cy="36" rx="3" ry="1.2" fill="#33691e"/>
        <!-- Culm 2 (Left) -->
        <path d="M42 88 Q40 50 36 20" stroke="#689f38" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <ellipse cx="41" cy="70" rx="3" ry="1" fill="#33691e"/>
        <ellipse cx="39" cy="52" rx="2.8" ry="1" fill="#33691e"/>
        <ellipse cx="37" cy="34" rx="2.5" ry="0.9" fill="#33691e"/>
        <!-- Culm 3 (Far Right Slender) -->
        <path d="M64 88 Q66 54 68 30" stroke="#7cb342" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <ellipse cx="65" cy="68" rx="2.4" ry="0.9" fill="#33691e"/>
        <ellipse cx="67" cy="48" rx="2.2" ry="0.8" fill="#33691e"/>
        <!-- Arching Leafy Sprays -->
        <path d="M37 34 Q24 30 14 36" stroke="#558b2f" stroke-width="1.2" fill="none"/>
        <path d="M14 36 C8 34 6 42 12 44 C18 42 18 36 14 36 Z" fill="#2e7d32"/>
        <path d="M20 32 C16 28 16 22 22 24 C26 28 24 32 20 32 Z" fill="#388e3c"/>
        <path d="M26 31 C24 24 28 18 32 22 C34 26 30 30 26 31 Z" fill="#43a047"/>
        <path d="M52.5 36 Q42 26 38 18" stroke="#558b2f" stroke-width="1.2" fill="none"/>
        <path d="M38 18 C32 14 36 8 40 10 C42 14 40 18 38 18 Z" fill="#2e7d32"/>
        <path d="M46 28 C42 22 46 16 50 18 C52 22 48 26 46 28 Z" fill="#43a047"/>
        <path d="M52 20 Q66 18 80 26" stroke="#558b2f" stroke-width="1.2" fill="none"/>
        <path d="M80 26 C88 26 92 34 86 36 C80 34 80 28 80 26 Z" fill="#2e7d32"/>
        <path d="M72 21 C76 16 82 18 80 24 C76 26 72 24 72 21 Z" fill="#388e3c"/>
        <path d="M62 18 C64 12 70 14 70 20 C66 22 62 20 62 18 Z" fill="#43a047"/>
      `,
      withered: `
        <ellipse cx="50" cy="88" rx="34" ry="6" fill="#4e342e" opacity="0.35"/>
        <path d="M53 88 L52 20 M42 88 Q41 54 38 28 M64 88 Q65 58 66 36" stroke="#bcaaa4" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="52.5" cy="56" rx="3" ry="1" fill="#8d6e63"/>
        <ellipse cx="40" cy="54" rx="2.5" ry="0.9" fill="#8d6e63"/>
        <!-- Withered pale straw leaves -->
        <path d="M38 28 Q26 34 20 44 M52 20 Q62 26 70 38" stroke="#a1887f" stroke-width="1.4" stroke-linecap="round" fill="none"/>
        <text x="50" y="14" font-size="20" text-anchor="middle">🥀</text>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
