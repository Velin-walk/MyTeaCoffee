/**
 * Botanical Plant Definition: Suntala (सुन्तला)
 * Orange tree (Citrus sinensis)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['suntala'] = {
    id: 38,
    slug: 'suntala',
    english: "Suntala (orange tree)",
    nepali: "सुन्तला",
    scientific: "Citrus sinensis",
    category: "Fruit",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="14" r="6"/><path d="M12 8 Q12 5 14 4"/><path d="M14 4 Q17 4 17 6.5 Q14.5 7 14 4 Z" fill="currentColor" stroke="none"/></svg>',
    desc: "The beloved sweet orange of Nepal's mid-hills, a bushy evergreen tree with glossy dark-green leaves on many spreading branches, fragrant white blossoms and bright golden-orange fruit.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="88" rx="28" ry="5" fill="#5d4037" opacity="0.35"/>
        <ellipse cx="50" cy="87" rx="20" ry="3.5" fill="#795548" opacity="0.25"/>
        <path d="M50 88 Q50 78 50 70" stroke="#7d5a3c" stroke-width="2" stroke-linecap="round" fill="none"/>
        <ellipse cx="45" cy="73" rx="4.5" ry="2.8" fill="#558b2f" transform="rotate(-32 45 73)"/>
        <ellipse cx="55" cy="71" rx="4.5" ry="2.8" fill="#689f38" transform="rotate(32 55 71)"/>
        <ellipse cx="50" cy="65" rx="5" ry="3.2" fill="#7cb342"/>
      `,
      growing: `
        <ellipse cx="50" cy="88" rx="32" ry="5" fill="#5d4037" opacity="0.35"/>
        <!-- Young trunk with first side branches -->
        <path d="M50 88 Q50 78 50 70 M50 76 Q43 71 38 67 M50 73 Q57 68 62 64 M50 70 Q50 64 50 60" stroke="#7d5a3c" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <!-- Glossy oval leaves -->
        <ellipse cx="37" cy="64" rx="5.5" ry="3.4" fill="#2e7d32" transform="rotate(-35 37 64)"/>
        <ellipse cx="43" cy="70" rx="5.5" ry="3.4" fill="#33691e" transform="rotate(-15 43 70)"/>
        <ellipse cx="63" cy="61" rx="5.5" ry="3.4" fill="#388e3c" transform="rotate(35 63 61)"/>
        <ellipse cx="57" cy="68" rx="5.5" ry="3.4" fill="#2e7d32" transform="rotate(15 57 68)"/>
        <ellipse cx="50" cy="64" rx="6" ry="3.6" fill="#43a047" transform="rotate(-5 50 64)"/>
        <ellipse cx="44" cy="57" rx="5" ry="3.2" fill="#558b2f" transform="rotate(-28 44 57)"/>
        <ellipse cx="56" cy="55" rx="5" ry="3.2" fill="#33691e" transform="rotate(28 56 55)"/>
        <ellipse cx="50" cy="52" rx="5" ry="3.2" fill="#689f38"/>
        <!-- Leaf highlight sheen -->
        <ellipse cx="48" cy="63" rx="2" ry="1" fill="#9ccc65" opacity="0.8" transform="rotate(-5 48 63)"/>
        <ellipse cx="55" cy="54" rx="1.8" ry="0.9" fill="#aed581" opacity="0.8" transform="rotate(28 55 54)"/>
      `,
      mature: `
        <ellipse cx="50" cy="90" rx="42" ry="6" fill="#5d4037" opacity="0.35"/>
        <!-- Short trunk splitting into many spreading branches -->
        <path d="M50 90 L50 78 M50 82 Q42 74 34 68 M50 80 Q58 72 66 66 M50 78 Q50 68 50 60 M44 76 Q38 74 32 74 M56 74 Q62 72 68 72 M50 72 Q44 66 40 60 M50 70 Q56 64 60 58" stroke="#7d5a3c" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <!-- Dense bushy canopy, back layer -->
        <circle cx="50" cy="52" r="17" fill="#2e5d23"/>
        <circle cx="33" cy="60" r="13" fill="#2e5d23"/>
        <circle cx="67" cy="58" r="13" fill="#2e5d23"/>
        <!-- Canopy mid layer -->
        <circle cx="50" cy="55" r="15" fill="#33691e"/>
        <circle cx="35" cy="62" r="11" fill="#33691e"/>
        <circle cx="65" cy="60" r="11" fill="#33691e"/>
        <circle cx="50" cy="42" r="11" fill="#33691e"/>
        <circle cx="28" cy="68" r="8" fill="#33691e"/>
        <circle cx="72" cy="66" r="8" fill="#33691e"/>
        <!-- Canopy light layer -->
        <circle cx="46" cy="50" r="11" fill="#43a047"/>
        <circle cx="58" cy="54" r="9" fill="#43a047"/>
        <circle cx="34" cy="58" r="8" fill="#558b2f"/>
        <circle cx="66" cy="56" r="8" fill="#558b2f"/>
        <circle cx="50" cy="38" r="8" fill="#558b2f"/>
        <circle cx="42" cy="44" r="6" fill="#689f38"/>
        <circle cx="28" cy="66" r="6" fill="#43a047"/>
        <circle cx="72" cy="64" r="6" fill="#43a047"/>
        <circle cx="56" cy="42" r="5.5" fill="#7cb342"/>
        <!-- Glossy leaf flecks -->
        <ellipse cx="44" cy="47" rx="2.4" ry="1.3" fill="#9ccc65" opacity="0.85" transform="rotate(-20 44 47)"/>
        <ellipse cx="60" cy="51" rx="2.2" ry="1.2" fill="#9ccc65" opacity="0.85" transform="rotate(18 60 51)"/>
        <ellipse cx="36" cy="56" rx="2" ry="1.1" fill="#aed581" opacity="0.85" transform="rotate(-12 36 56)"/>
        <ellipse cx="52" cy="37" rx="2" ry="1.1" fill="#aed581" opacity="0.85"/>
        <ellipse cx="68" cy="62" rx="2" ry="1.1" fill="#9ccc65" opacity="0.85" transform="rotate(22 68 62)"/>
        <!-- Oranges nestled in the canopy -->
        <circle cx="40" cy="60" r="4" fill="#fb8c00"/>
        <circle cx="40" cy="60" r="4" fill="none" stroke="#e65100" stroke-width="0.6" opacity="0.7"/>
        <circle cx="38.8" cy="58.8" r="1.2" fill="#ffcc80" opacity="0.9"/>
        <circle cx="57" cy="64" r="4.2" fill="#f57c00"/>
        <circle cx="57" cy="64" r="4.2" fill="none" stroke="#e65100" stroke-width="0.6" opacity="0.7"/>
        <circle cx="55.8" cy="62.8" r="1.2" fill="#ffcc80" opacity="0.9"/>
        <circle cx="50" cy="70" r="4" fill="#fb8c00"/>
        <circle cx="50" cy="70" r="4" fill="none" stroke="#e65100" stroke-width="0.6" opacity="0.7"/>
        <circle cx="48.8" cy="68.8" r="1.2" fill="#ffcc80" opacity="0.9"/>
        <circle cx="30" cy="70" r="3.6" fill="#f57c00"/>
        <circle cx="30" cy="70" r="3.6" fill="none" stroke="#e65100" stroke-width="0.6" opacity="0.7"/>
        <circle cx="28.9" cy="68.9" r="1" fill="#ffcc80" opacity="0.9"/>
        <circle cx="69" cy="69" r="3.6" fill="#fb8c00"/>
        <circle cx="69" cy="69" r="3.6" fill="none" stroke="#e65100" stroke-width="0.6" opacity="0.7"/>
        <circle cx="67.9" cy="67.9" r="1" fill="#ffcc80" opacity="0.9"/>
        <circle cx="47" cy="47" r="3.4" fill="#ffa726"/>
        <circle cx="47" cy="47" r="3.4" fill="none" stroke="#e65100" stroke-width="0.6" opacity="0.7"/>
        <circle cx="45.9" cy="45.9" r="1" fill="#ffe0b2" opacity="0.9"/>
        <!-- Tiny blossom remnants -->
        <circle cx="61" cy="45" r="1.6" fill="#ffffff"/>
        <circle cx="61" cy="45" r="0.6" fill="#fbc02d"/>
        <circle cx="35" cy="52" r="1.5" fill="#ffffff"/>
        <circle cx="35" cy="52" r="0.6" fill="#fbc02d"/>
      `,
      withered: `
        <ellipse cx="50" cy="90" rx="36" ry="5" fill="#5d4037" opacity="0.35"/>
        <!-- Bare woody branches -->
        <path d="M50 90 L50 78 M50 82 Q42 74 34 68 M50 80 Q58 72 66 66 M50 78 Q50 68 50 60 M44 76 Q38 74 32 74 M56 74 Q62 72 68 72 M50 72 Q44 66 40 60 M50 70 Q56 64 60 58" stroke="#6d4c41" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <!-- Sparse dried leaves -->
        <ellipse cx="36" cy="66" rx="4.5" ry="2.8" fill="#8d6e63" transform="rotate(-38 36 66)"/>
        <ellipse cx="44" cy="72" rx="4.5" ry="2.8" fill="#a1887f" transform="rotate(-15 44 72)"/>
        <ellipse cx="64" cy="64" rx="4.5" ry="2.8" fill="#8d6e63" transform="rotate(38 64 64)"/>
        <ellipse cx="57" cy="70" rx="4.5" ry="2.8" fill="#795548" transform="rotate(18 57 70)"/>
        <ellipse cx="50" cy="62" rx="4.5" ry="2.8" fill="#a1887f" transform="rotate(-5 50 62)"/>
        <ellipse cx="40" cy="58" rx="4" ry="2.5" fill="#8d6e63" transform="rotate(-30 40 58)"/>
        <ellipse cx="60" cy="56" rx="4" ry="2.5" fill="#6d4c41" transform="rotate(30 60 56)"/>
        <!-- Shrivelled fruit still hanging -->
        <circle cx="46" cy="74" r="3" fill="#a15c1e"/>
        <circle cx="46" cy="74" r="3" fill="none" stroke="#6d4c41" stroke-width="0.6"/>
        <circle cx="62" cy="68" r="2.6" fill="#8d5a2a"/>
        <circle cx="62" cy="68" r="2.6" fill="none" stroke="#6d4c41" stroke-width="0.6"/>
        <!-- Fallen leaves and a dropped fruit -->
        <ellipse cx="38" cy="88" rx="3" ry="1.4" fill="#8d6e63"/>
        <ellipse cx="56" cy="89" rx="2.6" ry="1.2" fill="#795548"/>
        <circle cx="66" cy="88" r="2.8" fill="#a15c1e"/>
        <circle cx="66" cy="88" r="2.8" fill="none" stroke="#6d4c41" stroke-width="0.6"/>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
