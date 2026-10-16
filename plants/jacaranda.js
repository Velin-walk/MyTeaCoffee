/**
 * Botanical Plant Definition: Jacaranda (ज्याकारान्दा)
 * Jacaranda tree (Jacaranda mimosifolia)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['jacaranda'] = {
    id: 39,
    slug: 'jacaranda',
    english: "Jacaranda",
    nepali: "ज्याकारान्दा",
    scientific: "Jacaranda mimosifolia",
    category: "Flowering Tree",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21v-5M12 16l-4-5M12 16l4-5"/><circle cx="8" cy="10" r="2.2" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="2.2" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="2.2" fill="currentColor" stroke="none"/></svg>',
    desc: "Elegant flowering tree of the Kathmandu streets, with feathery fern-like leaves and open sprays of lavender-blue trumpet flowers that carpet the ground beneath in bloom.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="88" rx="28" ry="5" fill="#5d4037" opacity="0.35"/>
        <ellipse cx="50" cy="87" rx="20" ry="3.5" fill="#795548" opacity="0.25"/>
        <path d="M50 88 Q50 78 50 70" stroke="#6d4c41" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- First feathery bipinnate leaflets -->
        <ellipse cx="44" cy="70" rx="5" ry="2.2" fill="#7cb342" transform="rotate(-35 44 70)"/>
        <ellipse cx="56" cy="70" rx="5" ry="2.2" fill="#8bc34a" transform="rotate(35 56 70)"/>
        <ellipse cx="46" cy="65" rx="4.2" ry="2" fill="#8bc34a" transform="rotate(-55 46 65)"/>
        <ellipse cx="54" cy="65" rx="4.2" ry="2" fill="#9ccc65" transform="rotate(55 54 65)"/>
        <ellipse cx="50" cy="63" rx="3" ry="2" fill="#9ccc65"/>
      `,
      growing: `
        <ellipse cx="50" cy="88" rx="34" ry="5" fill="#5d4037" opacity="0.35"/>
        <!-- Young slender trunk with first branch -->
        <path d="M50 88 Q50 78 50 70 Q50 62 50 56 M50 72 Q44 68 40 64 M50 70 Q56 66 60 62" stroke="#6d4c41" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <!-- Fern-like bipinnate foliage -->
        <ellipse cx="38" cy="62" rx="7" ry="2.6" fill="#43a047" transform="rotate(-40 38 62)"/>
        <ellipse cx="45" cy="56" rx="7" ry="2.6" fill="#388e3c" transform="rotate(-15 45 56)"/>
        <ellipse cx="55" cy="54" rx="7" ry="2.6" fill="#43a047" transform="rotate(12 55 54)"/>
        <ellipse cx="62" cy="60" rx="7" ry="2.6" fill="#2e7d32" transform="rotate(38 62 60)"/>
        <ellipse cx="50" cy="50" rx="6.5" ry="2.6" fill="#66bb6a"/>
        <ellipse cx="42" cy="66" rx="6" ry="2.4" fill="#2e7d32" transform="rotate(-25 42 66)"/>
        <ellipse cx="58" cy="64" rx="6" ry="2.4" fill="#388e3c" transform="rotate(25 58 64)"/>
        <!-- First small flower clusters -->
        <circle cx="40" cy="50" r="2.2" fill="#b39ddb"/>
        <circle cx="44" cy="47" r="2.4" fill="#9575cd"/>
        <circle cx="59" cy="47" r="2.2" fill="#b39ddb"/>
        <circle cx="56" cy="44" r="2.4" fill="#9575cd"/>
      `,
      mature: `
        <ellipse cx="50" cy="89" rx="44" ry="6" fill="#5d4037" opacity="0.35"/>
        <!-- Carpet of fallen lavender blossoms -->
        <ellipse cx="38" cy="88" rx="4" ry="1.6" fill="#b39ddb"/>
        <ellipse cx="63" cy="87" rx="4" ry="1.6" fill="#d1c4e9"/>
        <ellipse cx="30" cy="86" rx="3.5" ry="1.4" fill="#9575cd"/>
        <ellipse cx="71" cy="86" rx="3.5" ry="1.4" fill="#b39ddb"/>
        <ellipse cx="45" cy="86" rx="3" ry="1.3" fill="#9575cd"/>
        <ellipse cx="56" cy="85" rx="3" ry="1.3" fill="#d1c4e9"/>
        <!-- Mature trunk with spreading branch skeleton -->
        <path d="M50 89 L50 76 Q50 68 50 62 M50 78 Q42 72 36 66 M50 78 Q58 72 64 66 M36 66 Q30 60 26 56 M64 66 Q70 60 74 56 M50 74 Q40 66 34 60 M50 74 Q60 66 66 60" stroke="#5d4037" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M50 62 Q44 56 40 52 M50 62 Q56 56 60 52 M50 66 L50 54" stroke="#5d4037" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Ferny bipinnate canopy -->
        <ellipse cx="26" cy="54" rx="8" ry="2.8" fill="#43a047" transform="rotate(-35 26 54)"/>
        <ellipse cx="34" cy="58" rx="8" ry="2.8" fill="#2e7d32" transform="rotate(-15 34 58)"/>
        <ellipse cx="40" cy="50" rx="8" ry="2.8" fill="#388e3c" transform="rotate(-40 40 50)"/>
        <ellipse cx="48" cy="46" rx="8.5" ry="3" fill="#43a047"/>
        <ellipse cx="58" cy="48" rx="8" ry="2.8" fill="#2e7d32" transform="rotate(15 58 48)"/>
        <ellipse cx="64" cy="52" rx="8" ry="2.8" fill="#388e3c" transform="rotate(35 64 52)"/>
        <ellipse cx="72" cy="54" rx="7.5" ry="2.8" fill="#43a047" transform="rotate(40 72 54)"/>
        <ellipse cx="44" cy="56" rx="7" ry="2.6" fill="#66bb6a" transform="rotate(-10 44 56)"/>
        <ellipse cx="55" cy="57" rx="7" ry="2.6" fill="#66bb6a" transform="rotate(10 55 57)"/>
        <ellipse cx="38" cy="64" rx="6.5" ry="2.5" fill="#2e7d32" transform="rotate(-20 38 64)"/>
        <ellipse cx="62" cy="62" rx="6.5" ry="2.5" fill="#2e7d32" transform="rotate(20 62 62)"/>
        <!-- Open sprays of lavender-blue trumpet clusters -->
        <circle cx="30" cy="44" r="3" fill="#b39ddb"/>
        <circle cx="36" cy="41" r="3.2" fill="#9575cd"/>
        <circle cx="41" cy="45" r="3" fill="#d1c4e9"/>
        <circle cx="34" cy="47" r="2.8" fill="#9575cd"/>
        <circle cx="46" cy="40" r="3.2" fill="#b39ddb"/>
        <circle cx="52" cy="38" r="3.4" fill="#9575cd"/>
        <circle cx="58" cy="41" r="3" fill="#b39ddb"/>
        <circle cx="50" cy="43" r="2.8" fill="#d1c4e9"/>
        <circle cx="63" cy="44" r="3" fill="#9575cd"/>
        <circle cx="69" cy="46" r="3.2" fill="#b39ddb"/>
        <circle cx="74" cy="48" r="2.8" fill="#d1c4e9"/>
        <circle cx="67" cy="50" r="2.8" fill="#b39ddb"/>
        <!-- Purple trumpet depths -->
        <circle cx="36" cy="41" r="1.1" fill="#4a148c"/>
        <circle cx="52" cy="38" r="1.1" fill="#4a148c"/>
        <circle cx="69" cy="46" r="1" fill="#4a148c"/>
        <circle cx="34" cy="47" r="0.9" fill="#4a148c"/>
        <circle cx="58" cy="41" r="0.9" fill="#4a148c"/>
      `,
      withered: `
        <ellipse cx="50" cy="89" rx="36" ry="5" fill="#5d4037" opacity="0.35"/>
        <!-- Bare gnarled branch skeleton -->
        <path d="M50 89 L50 76 Q50 68 50 62 M50 78 Q42 72 36 66 M50 78 Q58 72 64 66 M36 66 Q30 60 26 56 M64 66 Q70 60 74 56 M50 74 Q40 66 34 60 M50 74 Q60 66 66 60" stroke="#5d4037" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <path d="M50 62 Q44 56 40 52 M50 62 Q56 56 60 52 M50 66 L50 54" stroke="#5d4037" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- A few dried seed pods (round woody capsules) -->
        <circle cx="40" cy="52" r="2.6" fill="#6d4c41"/>
        <circle cx="60" cy="50" r="2.4" fill="#795548"/>
        <circle cx="52" cy="54" r="2.2" fill="#8d6e63"/>
        <!-- Sparse brown remaining foliage -->
        <ellipse cx="34" cy="58" rx="6.5" ry="2.4" fill="#8d6e63" transform="rotate(-15 34 58)"/>
        <ellipse cx="66" cy="56" rx="6.5" ry="2.4" fill="#795548" transform="rotate(20 66 56)"/>
        <ellipse cx="50" cy="48" rx="6" ry="2.4" fill="#a1887f"/>
        <!-- Dried fallen blossoms on the ground -->
        <ellipse cx="40" cy="88" rx="3" ry="1.3" fill="#8d6e63"/>
        <ellipse cx="61" cy="87" rx="3" ry="1.3" fill="#a1887f"/>
        <ellipse cx="31" cy="86" rx="2.5" ry="1.1" fill="#795548"/>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
