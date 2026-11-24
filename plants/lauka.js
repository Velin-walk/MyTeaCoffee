/**
 * Botanical Plant Definition: Lauka / Bottle Gourd (लौका)
 * Climbing herbaceous vine (Lagenaria siceraria)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['lauka'] = {
    id: 41,
    slug: 'lauka',
    english: "Lauka (Bottle Gourd)",
    nepali: "लौका",
    scientific: "Lagenaria siceraria",
    category: "Herb",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v3"/><path d="M10.5 5h3c.2 2.4 2.5 3.6 2.5 6.2 0 1.7-1.1 2.9-1.1 3.5 0 .7 2.1 1.9 2.1 4.1 0 2.1-2.1 3.5-5 3.5s-5-1.4-5-3.5c0-2.2 2.1-3.4 2.1-4.1 0-.6-1.1-1.8-1.1-3.5 0-2.6 2.3-3.8 2.5-6.2z" fill="#c5e1a5" stroke="currentColor"/><path d="M7 5c1.5 0 2.8-.8 3.5-2M17 5c-1.5 0-2.8-.8-3.5-2"/></svg>',
    desc: "Beloved climbing vine of Nepal's homestead gardens (Lagenaria siceraria), draping trellises with broad velvety leaves, delicate white blossoms, curling tendrils, and smooth pale-green bottle gourds.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="88" rx="30" ry="5" fill="#5d4037" opacity="0.35"/>
        <ellipse cx="50" cy="87" rx="20" ry="3.5" fill="#4e342e" opacity="0.22"/>
        <!-- Slender climbing stem -->
        <path d="M50 88 Q49 76 50 64 Q51 57 54 52" stroke="#558b2f" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <!-- Young curling tendril -->
        <path d="M51 60 Q57 55 59 59 Q60 63 56 62" stroke="#7cb342" stroke-width="1.2" stroke-linecap="round" fill="none"/>
        <!-- Broad rounded gourd cotyledons & first heart leaf -->
        <ellipse cx="43" cy="73" rx="6" ry="3.6" fill="#7cb342" transform="rotate(-24 43 73)"/>
        <ellipse cx="57" cy="72" rx="6" ry="3.6" fill="#689f38" transform="rotate(24 57 72)"/>
        <path d="M50 66 C41 64 36 55 42 49 C46 47 50 52 50 58 C50 52 54 47 58 49 C64 55 59 64 50 66 Z" fill="#43a047"/>
        <path d="M50 64 L50 51 M50 60 L43 54 M50 60 L57 54" stroke="#c5e1a5" stroke-width="0.65" fill="none" opacity="0.8"/>
      `,
      growing: `
        <ellipse cx="50" cy="89" rx="36" ry="5.5" fill="#4e342e" opacity="0.35"/>
        <!-- Simple bamboo trellis stake & crossbar -->
        <path d="M36 88 L36 32 M64 88 L64 32 M28 40 L72 40" stroke="#8d6e63" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M36 40 L64 40" stroke="#6d4c41" stroke-width="1.2" stroke-linecap="round"/>
        <!-- Climbing vine winding up trellis -->
        <path d="M50 88 Q44 74 37 64 Q32 54 38 42 Q48 36 62 40" stroke="#43a047" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <path d="M40 50 Q48 45 55 49" stroke="#558b2f" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        <!-- Curling tendrils -->
        <path d="M62 40 Q68 35 67 30 Q64 28 62 32" stroke="#7cb342" stroke-width="1.2" stroke-linecap="round" fill="none"/>
        <path d="M36 62 Q30 58 29 53 Q31 50 34 53" stroke="#7cb342" stroke-width="1.1" stroke-linecap="round" fill="none"/>
        <!-- Broad heart-shaped vine leaves -->
        <path d="M38 66 C26 65 20 55 26 47 C32 45 37 51 38 58 C39 51 44 46 49 49 C53 56 47 65 38 66 Z" fill="#2e7d32"/>
        <path d="M38 64 L38 52 M38 60 L29 54 M38 60 L45 54" stroke="#a5d6a7" stroke-width="0.65" fill="none" opacity="0.75"/>
        <path d="M50 42 C41 38 38 28 45 23 C49 23 51 28 50 33 C52 28 56 23 60 25 C65 31 59 40 50 42 Z" fill="#388e3c"/>
        <path d="M50 40 L51 28 M50 36 L44 30 M50 36 L57 30" stroke="#a5d6a7" stroke-width="0.65" fill="none" opacity="0.75"/>
        <!-- Signature white bottle gourd star blossom -->
        <g transform="translate(31 37)">
          <ellipse cx="0" cy="-4" rx="2.1" ry="3.6" fill="#ffffff"/>
          <ellipse cx="3.8" cy="-1.2" rx="2.1" ry="3.6" fill="#ffffff" transform="rotate(72 3.8 -1.2)"/>
          <ellipse cx="2.4" cy="3.2" rx="2.1" ry="3.6" fill="#f9fbe7" transform="rotate(144 2.4 3.2)"/>
          <ellipse cx="-2.4" cy="3.2" rx="2.1" ry="3.6" fill="#f9fbe7" transform="rotate(-144 -2.4 3.2)"/>
          <ellipse cx="-3.8" cy="-1.2" rx="2.1" ry="3.6" fill="#ffffff" transform="rotate(-72 -3.8 -1.2)"/>
          <circle cx="0" cy="0" r="1.5" fill="#fdd835"/>
        </g>
        <!-- Young growing bottle gourd hanging from top bar -->
        <path d="M58 40 L58 46" stroke="#558b2f" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M56 46 C55 54 51 59 51 66 C51 72 54.5 76 58 76 C61.5 76 65 72 65 66 C65 59 61 54 60 46 Z" fill="#aed581" stroke="#689f38" stroke-width="0.6"/>
        <ellipse cx="56" cy="66" rx="2.2" ry="4.5" fill="#dce775" opacity="0.55"/>
        <circle cx="58" cy="76.5" r="1" fill="#5d4037"/>
      `,
      mature: `
        <ellipse cx="50" cy="91" rx="42" ry="6" fill="#4e342e" opacity="0.32"/>

        <!-- ================= BAMBOO VINE TRELLIS ================= -->
        <path d="M22 90 L22 24 M78 90 L78 24" stroke="#795548" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M14 26 Q50 22 86 26" stroke="#8d6e63" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M18 35 Q50 32 82 35" stroke="#6d4c41" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Climbing main vine stem -->
        <path d="M23 90 Q20 70 25 50 Q28 34 22 26 Q42 20 62 24 Q74 26 82 28" stroke="#33691e" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M77 90 Q80 68 75 48 Q73 34 78 26" stroke="#558b2f" stroke-width="2.1" stroke-linecap="round" fill="none"/>

        <!-- ================= LUSH OVERLAPPING GOURD LEAVES ================= -->
        <path d="M24 36 C12 34 8 22 15 15 C20 14 24 20 25 26 C27 19 32 14 37 18 C41 25 35 35 24 36 Z" fill="#1b5e20"/>
        <path d="M44 33 C33 30 30 19 37 13 C42 12 45 18 45 24 C47 18 52 13 57 16 C61 23 55 32 44 33 Z" fill="#2e7d32"/>
        <path d="M64 34 C53 31 50 20 57 14 C62 13 65 19 65 25 C67 19 72 14 77 17 C81 24 75 33 64 34 Z" fill="#388e3c"/>
        <path d="M79 38 C69 36 66 26 73 20 C77 19 80 24 80 30 C82 24 86 20 90 24 C93 30 88 38 79 38 Z" fill="#2e7d32"/>
        <path d="M18 54 C10 51 8 42 14 37 C18 37 20 42 20 47 C22 42 26 39 29 42 C31 48 26 54 18 54 Z" fill="#388e3c"/>
        <path d="M82 55 C74 52 72 43 78 38 C82 38 84 43 84 48 C86 43 90 40 93 43 C95 49 90 55 82 55 Z" fill="#33691e"/>
        <!-- Leaf veins -->
        <g stroke="#a5d6a7" stroke-width="0.65" fill="none" opacity="0.72" stroke-linecap="round">
          <path d="M24 34 L25 20 M24 29 L16 22 M24 29 L33 22"/>
          <path d="M44 31 L45 18 M44 26 L37 20 M44 26 L53 20"/>
          <path d="M64 32 L65 19 M64 27 L57 21 M64 27 L73 21"/>
          <path d="M79 36 L80 25"/>
        </g>

        <!-- Spiral tendrils -->
        <g stroke="#7cb342" stroke-width="1.2" fill="none" stroke-linecap="round">
          <path d="M31 28 Q34 36 30 40 Q27 42 29 38 Q31 36 33 39"/>
          <path d="M54 27 Q57 34 54 38 Q51 40 53 36"/>
          <path d="M73 31 Q78 39 74 44 Q71 45 73 41"/>
        </g>

        <!-- White Bottle Gourd Star Blossom -->
        <g transform="translate(22 28)">
          <ellipse cx="0" cy="-4.2" rx="2.2" ry="3.8" fill="#ffffff"/>
          <ellipse cx="4" cy="-1.3" rx="2.2" ry="3.8" fill="#ffffff" transform="rotate(72 4 -1.3)"/>
          <ellipse cx="2.5" cy="3.4" rx="2.2" ry="3.8" fill="#f9fbe7" transform="rotate(144 2.5 3.4)"/>
          <ellipse cx="-2.5" cy="3.4" rx="2.2" ry="3.8" fill="#f9fbe7" transform="rotate(-144 -2.5 3.4)"/>
          <ellipse cx="-4" cy="-1.3" rx="2.2" ry="3.8" fill="#ffffff" transform="rotate(-72 -4 -1.3)"/>
          <circle cx="0" cy="0" r="1.6" fill="#fbc02d"/>
        </g>

        <!-- ================= HANGING BOTTLE GOURDS (लौका) ================= -->
        <!-- 1. Classic Long-Necked Lauka (Left-Center, matching Photo 1) -->
        <path d="M40 27 Q39 31 40 35" stroke="#558b2f" stroke-width="2.1" stroke-linecap="round" fill="none"/>
        <path d="M38 35
                 C37.2 46 37 54 35.5 59
                 C32.5 63.5 26 68 26 76.5
                 C26 84 32 88.5 40 88.5
                 C48 88.5 54 84 54 76.5
                 C54 68 47.5 63.5 44.5 59
                 C43 54 42.8 46 42 35
                 Q40 34 38 35 Z"
              fill="#aed581" stroke="#689f38" stroke-width="0.75"/>
        <!-- Soft sunlit sheen & shading on long Lauka -->
        <path d="M38.5 37 C38 48 37.5 55 36 60 C33 64 28 69 28 76.5 C28 82 32.5 86 38 86.5 C34 83 32 78 33 72 C34 66 38 62 39 56 L39.5 37 Z"
              fill="#dce775" opacity="0.52"/>
        <ellipse cx="36.5" cy="74.5" rx="4.2" ry="6.2" fill="#f0f4c3" opacity="0.58"/>
        <path d="M48 67 C51.5 71 52.5 77.5 50 82.5 C47.5 86 43 87.5 39 87.5 C46 86.5 49.5 81 49.5 75.5 C49.5 71.5 48.5 69 48 67 Z"
              fill="#7cb342" opacity="0.42"/>
        <path d="M40 88.5 Q40 90.8 41 91.5" stroke="#5d4037" stroke-width="1.3" stroke-linecap="round" fill="none"/>

        <!-- 2. Double-Bulbous Calabash Gourd (Right, matching Photo 2) -->
        <path d="M66 30 Q66 34 66 38" stroke="#558b2f" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M64.2 38
                 C63.5 42 58.5 44.5 58.5 50.5
                 C58.5 55 61.8 57.2 61.8 59.5
                 C61.8 61.8 55 65.5 55 74
                 C55 81.5 60 86 66 86
                 C72 86 77 81.5 77 74
                 C77 65.5 70.2 61.8 70.2 59.5
                 C70.2 57.2 73.5 55 73.5 50.5
                 C73.5 44.5 68.5 42 67.8 38
                 Q66 37 64.2 38 Z"
              fill="#9ccc65" stroke="#558b2f" stroke-width="0.75"/>
        <!-- Soft highlights & shading on double gourd -->
        <ellipse cx="63.2" cy="50" rx="2.4" ry="4" fill="#dce775" opacity="0.55"/>
        <ellipse cx="62.2" cy="73" rx="3.8" ry="5.5" fill="#e6ee9c" opacity="0.55"/>
        <path d="M72.5 66 C75 70 75.5 77 73 81.5 C71 84 68 85 65 85 C70 84 73.5 79 73.5 73.5 C73.5 70 73 68 72.5 66 Z"
              fill="#689f38" opacity="0.4"/>
        <circle cx="66" cy="86.6" r="1.1" fill="#5d4037"/>
      `,
      withered: `
        <ellipse cx="50" cy="91" rx="38" ry="5.5" fill="#5d4037" opacity="0.32"/>
        <!-- Bare weathered bamboo trellis -->
        <path d="M24 90 L24 28 M76 90 L76 28 M18 32 L82 34" stroke="#6d4c41" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <!-- Dried brown vine stems -->
        <path d="M25 88 Q22 66 26 46 Q29 34 24 30 Q48 26 76 32" stroke="#5d4037" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Shrivelled dry vine leaves -->
        <path d="M26 42 C18 40 16 32 22 28 C27 29 29 36 26 42 Z" fill="#8d6e63"/>
        <path d="M52 34 C44 32 42 25 48 21 C53 22 55 28 52 34 Z" fill="#795548"/>
        <path d="M75 40 C68 38 66 30 72 26 C77 27 79 34 75 40 Z" fill="#8d6e63"/>
        <!-- Dried hard-shelled tan gourds -->
        <path d="M40 32 L40 38" stroke="#5d4037" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M38.5 38 C38 48 37.5 55 36 60 C33.5 64 29 68 29 75 C29 81 33.5 85 40 85 C46.5 85 51 81 51 75 C51 68 46.5 64 44 60 C42.5 55 42 48 41.5 38 Z"
              fill="#bcaaa4" stroke="#6d4c41" stroke-width="0.7"/>
        <path d="M64 33 L64 39" stroke="#5d4037" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M62.5 39 C62 43 58 45 58 50 C58 54 60.5 56 60.5 58 C60.5 60 55 63 55 70 C55 76 59 80 64 80 C69 80 73 76 73 70 C73 63 67.5 60 67.5 58 C67.5 56 70 54 70 50 C70 45 66 43 65.5 39 Z"
              fill="#a1887f" stroke="#5d4037" stroke-width="0.7"/>
        <!-- Fallen dried leaves on soil -->
        <ellipse cx="32" cy="89" rx="4" ry="1.6" fill="#8d6e63"/>
        <ellipse cx="62" cy="89" rx="3.5" ry="1.4" fill="#795548"/>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
