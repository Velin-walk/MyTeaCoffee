/**
 * Botanical Plant Definition: Stinging nettle (सिस्नु)
 * Revered Himalayan super-herb (Urtica dioica)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['nettle'] = {
    id: 22,
    slug: 'nettle',
    english: "Stinging nettle",
    nepali: "सिस्नु",
    scientific: "Urtica dioica",
    category: "Herb",
    icon: "🌿",
    desc: "Revered Himalayan super-herb with square stems, opposite pairs of deeply serrated heart-based leaves, and catkins.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="86" rx="32" ry="6" fill="#4e342e" opacity="0.45"/>
        <path d="M50 86 L50 60" stroke="#556b2f" stroke-width="3" stroke-linecap="round"/>
        <path d="M50 64 C42 60 34 62 30 70 C36 72 44 70 50 64 Z" fill="#2e7d32"/>
        <path d="M50 64 C58 60 66 62 70 70 C64 72 56 70 50 64 Z" fill="#388e3c"/>
        <path d="M50 60 L50 48" stroke="#4caf50" stroke-width="1.5"/>
        <text x="50" y="28" font-size="18" text-anchor="middle">🌱</text>
      `,
      growing: `
        <ellipse cx="50" cy="86" rx="32" ry="6" fill="#4e342e" opacity="0.4"/>
        <path d="M50 86 L50 32" stroke="#556b2f" stroke-width="3.6" stroke-linecap="round"/>
        <path d="M50 68 C38 66 24 68 18 76 C24 78 32 76 38 74 C42 74 46 72 50 68 Z" fill="#2e7d32"/>
        <path d="M50 68 C62 66 76 68 82 76 C76 78 68 76 62 74 C58 74 54 72 50 68 Z" fill="#2e7d32"/>
        <path d="M50 50 C36 46 20 44 14 52 C20 54 28 54 36 54 C42 54 46 52 50 50 Z" fill="#388e3c"/>
        <path d="M50 50 C64 46 80 44 86 52 C80 54 72 54 64 54 C58 54 54 52 50 50 Z" fill="#388e3c"/>
        <path d="M50 32 L50 20" stroke="#4caf50" stroke-width="1.6"/>
        <text x="50" y="14" font-size="14" text-anchor="middle">🌿</text>
      `,
      mature: `
        <ellipse cx="50" cy="88" rx="34" ry="7" fill="#4e342e" opacity="0.4"/>
        <!-- 4-angled erect stem with purplish hue -->
        <path d="M48 88 L48 22" stroke="#556b2f" stroke-width="4" stroke-linecap="round"/>
        <path d="M51 88 L51 22" stroke="#3e2723" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Opposite Leaf Pair 1 (Lower) -->
        <path d="M48 70 C36 68 20 66 12 74 C16 78 22 76 28 78 C24 82 30 82 36 80 C34 84 40 82 48 78 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="0.8"/>
        <path d="M51 70 C63 68 79 66 87 74 C83 78 77 76 71 78 C75 82 69 82 63 80 C65 84 59 82 51 78 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="0.8"/>
        <path d="M44 72 Q38 80 34 86 M55 72 Q61 80 65 86" stroke="#9e9d24" stroke-width="1.8" stroke-dasharray="1.5 1.5" fill="none"/>
        <!-- Opposite Leaf Pair 2 (Middle) -->
        <path d="M48 50 C34 46 16 42 10 50 C16 54 22 52 28 56 C24 60 32 58 38 58 C36 62 42 60 48 56 Z" fill="#388e3c" stroke="#1b5e20" stroke-width="0.8"/>
        <path d="M51 50 C65 46 83 42 89 50 C83 54 77 52 71 56 C75 60 67 58 61 58 C63 62 57 60 51 56 Z" fill="#388e3c" stroke="#1b5e20" stroke-width="0.8"/>
        <path d="M44 52 Q36 60 32 66 M55 52 Q63 60 67 66" stroke="#c0ca33" stroke-width="1.6" stroke-dasharray="1.5 1.5" fill="none"/>
        <!-- Opposite Leaf Pair 3 (Upper) -->
        <path d="M48 34 C36 28 24 24 18 30 C24 34 30 32 36 36 C34 40 40 38 48 36 Z" fill="#43a047" stroke="#1b5e20" stroke-width="0.8"/>
        <path d="M51 34 C63 28 75 24 81 30 C75 34 69 32 63 36 C65 40 59 38 51 36 Z" fill="#43a047" stroke="#1b5e20" stroke-width="0.8"/>
        <path d="M49 22 C43 14 47 6 50 2 C53 6 57 14 50 22 Z" fill="#4caf50" stroke="#1b5e20" stroke-width="0.8"/>
        <!-- Stinging hairs (trichomes) -->
        <path d="M47 40 L44 38 M52 42 L55 40 M47 60 L44 58 M52 62 L55 60" stroke="#e8f5e9" stroke-width="0.9"/>
      `,
      withered: `
        <ellipse cx="50" cy="88" rx="32" ry="6" fill="#4e342e" opacity="0.35"/>
        <path d="M50 88 Q48 60 42 38" stroke="#4e342e" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M46 64 C36 64 24 72 26 80 C32 76 42 72 46 64 Z" fill="#6d4c41"/>
        <path d="M48 64 C58 64 70 72 68 80 C62 76 52 72 48 64 Z" fill="#6d4c41"/>
        <text x="50" y="28" font-size="20" text-anchor="middle">🥀</text>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
