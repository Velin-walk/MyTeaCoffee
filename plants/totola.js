/**
 * Botanical Plant Definition: Totola (टोटला)
 * Indian trumpet flower / broken bones tree (Oroxylum indicum)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['totola'] = {
    id: 42,
    slug: 'totola',
    english: "Totola (Indian Trumpet Flower)",
    nepali: "टोटला",
    scientific: "Oroxylum indicum",
    category: "Tree",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9M12 12L7 8M12 11L17 8"/><path d="M12 9L12 4"/><path d="M10 4c0-1.2 4-1.2 4 0l-1 3h-2l-1-3z" fill="#8e24aa" stroke="currentColor"/><path d="M7 8v8c0 .8 1.2 1.2 1.2 0V8.5M17 8v9c0 .8-1.2 1.2-1.2 0V8.5" fill="#6d4c41" stroke="currentColor"/></svg>',
    desc: "Deciduous tree native to Nepal's Himalayan foothills (Oroxylum indicum), famed for its large compound leaves, upright clusters of maroon-and-cream trumpet blossoms, and dramatic sword-like hanging pods filled with papery white-winged seeds.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="88" rx="30" ry="5" fill="#5d4037" opacity="0.35"/>
        <ellipse cx="50" cy="87" rx="20" ry="3.5" fill="#4e342e" opacity="0.2"/>
        <!-- Slender ash-grey sapling stem -->
        <path d="M50 88 Q49 76 50 62" stroke="#795548" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <!-- Compound petiole arms with young pointed leaflets -->
        <path d="M50 67 Q41 61 33 56 M50 65 Q59 59 67 54" stroke="#558b2f" stroke-width="1.3" stroke-linecap="round" fill="none"/>
        <path d="M40 62 C34 58 31 51 35 46 C39 50 41 56 40 62 Z" fill="#388e3c"/>
        <path d="M35 58 C28 57 25 51 28 46 C33 48 36 53 35 58 Z" fill="#43a047"/>
        <path d="M60 60 C66 56 69 49 65 44 C61 48 59 54 60 60 Z" fill="#2e7d32"/>
        <path d="M65 56 C72 55 75 49 72 44 C67 46 64 51 65 56 Z" fill="#43a047"/>
        <!-- Upright apical shoot -->
        <path d="M50 62 C47 55 48 47 50 43 C52 47 53 55 50 62 Z" fill="#66bb6a"/>
      `,
      growing: `
        <ellipse cx="50" cy="89" rx="35" ry="5.5" fill="#4e342e" opacity="0.35"/>
        <!-- Upright ash-brown young trunk -->
        <path d="M48 89 Q48 68 49 46 L51 46 Q52 68 52 89 Z" fill="#7d6b5d"/>
        <path d="M49 85 L49 52" stroke="#5d4037" stroke-width="0.9" opacity="0.5"/>
        <!-- Ascending branches -->
        <path d="M49 54 Q39 48 29 42 M51 52 Q61 46 71 40 M50 48 L50 32" stroke="#6d5c4e" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <!-- Broad tripinnate foliage fans -->
        <g fill="#2e7d32">
          <ellipse cx="26" cy="40" rx="8" ry="4" transform="rotate(-20 26 40)"/>
          <ellipse cx="34" cy="45" rx="7" ry="3.5" transform="rotate(10 34 45)"/>
          <ellipse cx="74" cy="38" rx="8" ry="4" transform="rotate(20 74 38)"/>
          <ellipse cx="66" cy="43" rx="7" ry="3.5" transform="rotate(-10 66 43)"/>
        </g>
        <g fill="#43a047">
          <ellipse cx="21" cy="37" rx="5" ry="2.6" transform="rotate(-35 21 37)"/>
          <ellipse cx="32" cy="36" rx="5.5" ry="2.8" transform="rotate(-15 32 36)"/>
          <ellipse cx="68" cy="34" rx="5.5" ry="2.8" transform="rotate(15 68 34)"/>
          <ellipse cx="79" cy="35" rx="5" ry="2.6" transform="rotate(35 79 35)"/>
          <ellipse cx="45" cy="33" rx="6" ry="3" transform="rotate(-18 45 33)"/>
          <ellipse cx="55" cy="33" rx="6" ry="3" transform="rotate(18 55 33)"/>
        </g>
        <!-- Emerging upright terminal flower spike -->
        <path d="M50 32 L50 18" stroke="#558b2f" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M46 21 C44 17 47 14 50 16 C53 14 56 17 54 21 L51.5 25 L48.5 25 Z" fill="#8e24aa"/>
        <ellipse cx="50" cy="17.5" rx="2" ry="1.3" fill="#fff59d"/>
        <!-- First young slender green pod hanging from side branch -->
        <path d="M35 45 Q34 56 34 65" stroke="#558b2f" stroke-width="1.6" stroke-linecap="round" fill="none"/>
      `,
      mature: `
        <ellipse cx="50" cy="91" rx="40" ry="6" fill="#3e2723" opacity="0.35"/>

        <!-- ================= TRUNK & SPREADING CROWN SCAFFOLD ================= -->
        <!-- Root flare & pale greyish-brown trunk -->
        <path d="M44 91 Q47 84 47 72 L47 45 L53 45 L53 72 Q53 84 56 91 Z" fill="#8d7b68"/>
        <path d="M47 88 Q48 72 48 48 M52 88 Q51 70 51 48" stroke="#5d4037" stroke-width="1" opacity="0.45" fill="none"/>
        <!-- Stout ascending branches -->
        <path d="M48 54 Q36 46 22 38 M22 38 Q16 35 12 31" stroke="#796856" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M52 52 Q64 44 78 36 M78 36 Q84 33 88 29" stroke="#796856" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 46 Q43 37 38 29 M51 46 Q57 37 62 29" stroke="#796856" stroke-width="2.6" stroke-linecap="round" fill="none"/>

        <!-- ================= LARGE COMPOUND FOLIAGE CANOPY ================= -->
        <!-- Deep green lower leaf sprays -->
        <g fill="#1b5e20">
          <ellipse cx="20" cy="37" rx="10" ry="4.5" transform="rotate(-18 20 37)"/>
          <ellipse cx="32" cy="40" rx="9" ry="4.2" transform="rotate(8 32 40)"/>
          <ellipse cx="80" cy="35" rx="10" ry="4.5" transform="rotate(18 80 35)"/>
          <ellipse cx="68" cy="38" rx="9" ry="4.2" transform="rotate(-8 68 38)"/>
          <ellipse cx="50" cy="36" rx="12" ry="5"/>
        </g>
        <!-- Mid-tone compound leaflets -->
        <g fill="#2e7d32">
          <ellipse cx="14" cy="32" rx="7.5" ry="3.4" transform="rotate(-28 14 32)"/>
          <ellipse cx="26" cy="31" rx="8" ry="3.6" transform="rotate(-10 26 31)"/>
          <ellipse cx="38" cy="32" rx="8.5" ry="3.8" transform="rotate(-14 38 32)"/>
          <ellipse cx="62" cy="32" rx="8.5" ry="3.8" transform="rotate(14 62 32)"/>
          <ellipse cx="74" cy="30" rx="8" ry="3.6" transform="rotate(10 74 30)"/>
          <ellipse cx="86" cy="31" rx="7.5" ry="3.4" transform="rotate(28 86 31)"/>
          <ellipse cx="50" cy="29" rx="10" ry="4.5"/>
        </g>
        <!-- Sunlit upper leaflets -->
        <g fill="#43a047">
          <ellipse cx="18" cy="28" rx="5.5" ry="2.4" transform="rotate(-22 18 28)"/>
          <ellipse cx="31" cy="27" rx="5.8" ry="2.5" transform="rotate(-8 31 27)"/>
          <ellipse cx="42" cy="25" rx="5.5" ry="2.4" transform="rotate(-12 42 25)"/>
          <ellipse cx="58" cy="25" rx="5.5" ry="2.4" transform="rotate(12 58 25)"/>
          <ellipse cx="69" cy="27" rx="5.8" ry="2.5" transform="rotate(8 69 27)"/>
          <ellipse cx="82" cy="27" rx="5.5" ry="2.4" transform="rotate(22 82 27)"/>
        </g>

        <!-- ================= UPRIGHT INDIAN TRUMPET FLOWERS ================= -->
        <!-- Erect central floral raceme above canopy -->
        <path d="M50 28 L50 10" stroke="#558b2f" stroke-width="2" stroke-linecap="round"/>
        <!-- Lower-left trumpet blossom -->
        <path d="M50 20 L43 17" stroke="#558b2f" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M43 17 L37 15 C35 12 37 9 40 11 C42 9 45 11 44 14 Z" fill="#7b1fa2"/>
        <ellipse cx="39.5" cy="12" rx="1.8" ry="1.2" fill="#fff59d"/>
        <!-- Lower-right trumpet blossom -->
        <path d="M50 19 L57 16" stroke="#558b2f" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M57 16 L63 14 C65 11 63 8 60 10 C58 8 55 10 56 13 Z" fill="#8e24aa"/>
        <ellipse cx="60.5" cy="11" rx="1.8" ry="1.2" fill="#fff59d"/>
        <!-- Top crown trumpet blossoms -->
        <path d="M47 12 C44 8 47 5 50 7 C53 5 56 8 53 12 L51.5 16 L48.5 16 Z" fill="#6a1b9a"/>
        <path d="M48 11 C46.5 8.5 48.5 7 50 8.5 C51.5 7 53.5 8.5 52 11 Z" fill="#fff9c4"/>
        <circle cx="50" cy="8" r="0.9" fill="#fbc02d"/>
        <circle cx="50" cy="5.5" r="1.4" fill="#9c27b0"/>

        <!-- ================= ICONIC SWORD-LIKE HANGING PODS (टोटला) ================= -->
        <!-- 1. Long scimitar pod on far-left -->
        <path d="M22 39 L22 43" stroke="#5d4037" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M20.4 43 Q19.2 58 20.6 74 Q22 77 23.4 74 Q24.6 58 23.6 43 Z" fill="#6d4c41" stroke="#3e2723" stroke-width="0.6"/>
        <path d="M22 44 Q21.5 59 22 74" stroke="#8d6e63" stroke-width="0.7" fill="none" opacity="0.75"/>

        <!-- 2. Twin pods on inner-left branch -->
        <path d="M35 41 L35 45" stroke="#5d4037" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M33.3 45 Q32.5 63 33.8 81 Q35.2 84 36.6 81 Q37.5 63 36.7 45 Z" fill="#5d4037" stroke="#3e2723" stroke-width="0.6"/>
        <path d="M35 46 Q34.5 63 35 80" stroke="#a1887f" stroke-width="0.65" fill="none" opacity="0.65"/>

        <!-- 3. Long curved sword pod on inner-right branch -->
        <path d="M65 40 L65 44" stroke="#5d4037" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M63.4 44 Q64.5 62 63.6 80 Q65 83 66.4 80 Q67.5 62 66.6 44 Z" fill="#5d4037" stroke="#3e2723" stroke-width="0.6"/>
        <path d="M65 45 Q65.5 62 65 79" stroke="#a1887f" stroke-width="0.65" fill="none" opacity="0.65"/>

        <!-- 4. Hanging pod on far-right branch -->
        <path d="M78 37 L78 41" stroke="#5d4037" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M76.5 41 Q77.6 56 76.4 72 Q77.8 75 79.2 72 Q80.4 56 79.5 41 Z" fill="#6d4c41" stroke="#3e2723" stroke-width="0.6"/>
        <path d="M78 42 Q78.4 56 78 71" stroke="#8d6e63" stroke-width="0.7" fill="none" opacity="0.75"/>

        <!-- Papery winged Totola seeds fluttering & resting near base -->
        <ellipse cx="40" cy="89" rx="3.4" ry="1.8" fill="#fffde7" opacity="0.9" transform="rotate(-12 40 89)"/>
        <circle cx="40" cy="89" r="0.9" fill="#d7ccc8"/>
        <ellipse cx="60" cy="88" rx="3.2" ry="1.7" fill="#fffde7" opacity="0.88" transform="rotate(15 60 88)"/>
        <circle cx="60" cy="88" r="0.9" fill="#d7ccc8"/>
      `,
      withered: `
        <ellipse cx="50" cy="91" rx="36" ry="5.5" fill="#5d4037" opacity="0.32"/>
        <!-- Bare leafless deciduous trunk & ascending branches -->
        <path d="M45 91 Q47 84 47 72 L47 45 L53 45 L53 72 Q53 84 55 91 Z" fill="#7d6b5d"/>
        <path d="M48 54 Q36 46 22 38 M22 38 Q16 35 12 31" stroke="#6d5c4e" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <path d="M52 52 Q64 44 78 36 M78 36 Q84 33 88 29" stroke="#6d5c4e" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <path d="M49 46 Q43 37 38 29 M51 46 Q57 37 62 29 M50 45 L50 26" stroke="#6d5c4e" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <!-- Persistent dry sword pods dangling in winter -->
        <path d="M22 39 L22 43" stroke="#4e342e" stroke-width="1.2"/>
        <path d="M20.6 43 Q19.6 58 20.8 73 Q22 76 23.2 73 Q24.2 58 23.4 43 Z" fill="#5d4037"/>
        <path d="M35 45 Q34.2 62 35.4 79 Q36.6 82 37.8 79 Q38.6 62 37.8 45 Z" fill="#4e342e"/>
        <path d="M64 44 Q65 61 64.2 78 Q65.4 81 66.6 78 Q67.6 61 66.8 44 Z" fill="#4e342e"/>
        <path d="M78 37 L78 41" stroke="#4e342e" stroke-width="1.2"/>
        <path d="M76.6 41 Q77.6 56 76.6 70 Q77.8 73 79 70 Q80 56 79.4 41 Z" fill="#5d4037"/>
        <!-- Fallen dried leaves & papery Totola seeds on soil -->
        <ellipse cx="32" cy="89" rx="3.5" ry="1.5" fill="#8d6e63"/>
        <ellipse cx="67" cy="89" rx="3.5" ry="1.5" fill="#795548"/>
        <ellipse cx="44" cy="89" rx="3.2" ry="1.6" fill="#efebe9" opacity="0.85"/>
        <ellipse cx="57" cy="90" rx="3" ry="1.5" fill="#efebe9" opacity="0.8"/>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
