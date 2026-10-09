/**
 * Botanical Plant Definition: Sal tree (साल)
 * Majestic columnar hardwood tree (Shorea robusta)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['sal'] = {
    id: 1,
    slug: 'sal',
    english: "Sal tree",
    nepali: "साल",
    scientific: "Shorea robusta",
    category: "Tree",
    icon: "🌳",
    desc: "Majestic columnar hardwood tree native to Nepal's valleys with textured fissured bark and glossy ovate ribbed foliage.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="86" rx="34" ry="7" fill="#3e2723" opacity="0.45"/>
        <path d="M50 86 L50 56" stroke="#3e2723" stroke-width="4.2" stroke-linecap="square"/>
        <path d="M50 64 C40 60 38 48 44 42 C48 48 48 58 50 64 Z" fill="#2e7d32"/>
        <path d="M50 64 C60 60 62 48 56 42 C52 48 52 58 50 64 Z" fill="#388e3c"/>
        <path d="M44 42 L47 54 M56 42 L53 54" stroke="#a5d6a7" stroke-width="0.8"/>
        <text x="50" y="28" font-size="18" text-anchor="middle">🌱</text>
      `,
      growing: `
        <ellipse cx="50" cy="86" rx="34" ry="7" fill="#3e2723" opacity="0.45"/>
        <path d="M48 86 L48 38 M52 86 L52 38" stroke="#3e2723" stroke-width="5" stroke-linecap="square"/>
        <path d="M48 52 Q36 44 26 36 M52 52 Q64 44 74 36" stroke="#4e342e" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <ellipse cx="26" cy="34" rx="14" ry="10" fill="#2e7d32"/>
        <ellipse cx="74" cy="34" rx="14" ry="10" fill="#2e7d32"/>
        <ellipse cx="50" cy="24" rx="18" ry="12" fill="#388e3c"/>
        <ellipse cx="50" cy="30" rx="14" ry="9" fill="#1b5e20" opacity="0.85"/>
        <text x="50" y="14" font-size="14" text-anchor="middle">🌿</text>
      `,
      mature: `
        <ellipse cx="50" cy="88" rx="34" ry="7" fill="#3e2723" opacity="0.45"/>
        <path d="M47 88 L48 36 M52 88 L51 36" stroke="#3e2723" stroke-width="6.5" stroke-linecap="square"/>
        <path d="M48 84 L48 44 M51 80 L51 46" stroke="#271815" stroke-width="1.3"/>
        <path d="M48 46 Q36 38 26 30 M51 46 Q64 38 74 30" stroke="#4e342e" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M49 38 L49 22" stroke="#4e342e" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="26" cy="28" rx="16" ry="12" fill="#2e7d32"/>
        <ellipse cx="74" cy="28" rx="16" ry="12" fill="#2e7d32"/>
        <ellipse cx="49" cy="18" rx="20" ry="14" fill="#388e3c"/>
        <ellipse cx="49" cy="26" rx="18" ry="12" fill="#1b5e20" opacity="0.85"/>
        <path d="M14 26 C8 24 10 18 18 16 C22 20 20 26 14 26 Z" fill="#43a047"/>
        <path d="M14 26 L17 18" stroke="#a5d6a7" stroke-width="0.8"/>
        <path d="M84 26 C90 24 88 18 80 16 C76 20 78 26 84 26 Z" fill="#43a047"/>
        <path d="M84 26 L81 18" stroke="#a5d6a7" stroke-width="0.8"/>
        <circle cx="34" cy="36" r="1.8" fill="#fff59d"/>
        <circle cx="38" cy="38" r="1.6" fill="#fff59d"/>
        <circle cx="62" cy="36" r="1.8" fill="#fff59d"/>
        <circle cx="66" cy="38" r="1.6" fill="#fff59d"/>
      `,
      withered: `
        <ellipse cx="50" cy="88" rx="32" ry="6" fill="#3e2723" opacity="0.4"/>
        <path d="M48 88 L48 34 M52 88 L52 34" stroke="#3e2723" stroke-width="5" stroke-linecap="square"/>
        <path d="M48 46 Q34 38 24 32 M52 46 Q66 38 76 32" stroke="#4e342e" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <ellipse cx="24" cy="30" rx="12" ry="8" fill="#795548" opacity="0.7"/>
        <ellipse cx="76" cy="30" rx="12" ry="8" fill="#795548" opacity="0.7"/>
        <ellipse cx="50" cy="24" rx="14" ry="9" fill="#6d4c41" opacity="0.75"/>
        <text x="50" y="16" font-size="20" text-anchor="middle">🥀</text>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
