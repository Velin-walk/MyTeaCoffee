
/**
 * Botanical Plant Definition: Jacaranda (ज्याकारान्दा)
 * Jacaranda tree (Jacaranda mimosifolia)
 * Enhanced Botanical Vector Edition
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

    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21V12M12 16L6 10M12 15L18 9M12 12L12 6"/><path d="M6 10L4 7M6 10L9 8M18 9L21 6M18 9L15 7M12 6L9 3M12 6L15 3" stroke-linecap="round"/><circle cx="4" cy="7" r="1.5" fill="currentColor"/><circle cx="9" cy="8" r="1.5" fill="currentColor"/><circle cx="21" cy="6" r="1.5" fill="currentColor"/><circle cx="15" cy="7" r="1.5" fill="currentColor"/><circle cx="9" cy="3" r="1.5" fill="currentColor"/><circle cx="15" cy="3" r="1.5" fill="currentColor"/></svg>',

    desc: "An elegant flowering tree admired across Nepal for its spreading umbrella-shaped canopy, delicate fern-like bipinnate foliage and spectacular clusters of lavender-blue trumpet flowers. During peak bloom, its blossoms create a beautiful violet carpet beneath the tree.",

    stages: {

      /* =========================================
         SPROUT - Young seedling
      ========================================= */
      sprout: `
        <defs>
          <linearGradient id="jacSproutSoil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#9b7352"/>
            <stop offset="100%" stop-color="#5d4037"/>
          </linearGradient>
          <linearGradient id="jacSproutStem" x1="0" y1="0" x2="1" y2="0">
            <stop stop-color="#795548"/>
            <stop offset="50%" stop-color="#b88962"/>
            <stop offset="100%" stop-color="#604438"/>
          </linearGradient>
          <linearGradient id="jacSproutLeaf" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#b2df8a"/>
            <stop offset="100%" stop-color="#388e3c"/>
          </linearGradient>
        </defs>

        <ellipse cx="50" cy="90" rx="30" ry="4.5" fill="#4e342e" opacity=".2"/>
        <path d="M22 88 Q50 84 78 88 Q64 94 36 92Z" fill="url(#jacSproutSoil)" opacity=".7"/>

        <!-- Main delicate stem -->
        <path d="M50 88 Q48 79 50 70 Q51 64 50 57"
          fill="none" stroke="url(#jacSproutStem)" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Compound leaf stems -->
        <g stroke="#558b2f" stroke-width=".8" fill="none" stroke-linecap="round">
          <path d="M50 68 Q42 64 34 57"/>
          <path d="M50 64 Q57 60 64 54"/>
          <path d="M50 59 Q49 55 48 51"/>
        </g>

        <!-- Left young bipinnate leaflets -->
        <g fill="url(#jacSproutLeaf)">
          <ellipse cx="39" cy="64" rx="4.2" ry="1.6" transform="rotate(24 39 64)"/>
          <ellipse cx="35" cy="60" rx="4" ry="1.5" transform="rotate(32 35 60)"/>
          <ellipse cx="42" cy="61" rx="3.8" ry="1.4" transform="rotate(-18 42 61)"/>
          <ellipse cx="45" cy="65" rx="3.5" ry="1.3" transform="rotate(-15 45 65)"/>

          <!-- Right leaflets -->
          <ellipse cx="59" cy="61" rx="4" ry="1.5" transform="rotate(-25 59 61)"/>
          <ellipse cx="65" cy="57" rx="3.8" ry="1.4" transform="rotate(-32 65 57)"/>
          <ellipse cx="56" cy="57" rx="3.6" ry="1.4" transform="rotate(20 56 57)"/>

          <!-- Top leaf -->
          <ellipse cx="46" cy="54" rx="3.5" ry="1.4" transform="rotate(-40 46 54)"/>
          <ellipse cx="52" cy="53" rx="3.5" ry="1.4" transform="rotate(30 52 53)"/>
          <ellipse cx="49" cy="49" rx="3.4" ry="1.4"/>
        </g>

        <!-- Leaf central veins -->
        <g stroke="#dcedc8" stroke-width=".45" opacity=".8">
          <path d="M50 68L34 57 M50 64L64 54 M50 59L48 51"/>
        </g>

        <!-- New growth -->
        <path d="M50 57 Q47 52 48 47 Q50 45 52 48"
          fill="#81c784" stroke="#558b2f" stroke-width=".7"/>
      `,

      /* =========================================
         GROWING - Developing young tree
      ========================================= */
      growing: `
        <defs>
          <linearGradient id="jacGrowTrunk" x1="0" y1="0" x2="1" y2="0">
            <stop stop-color="#4e342e"/>
            <stop offset=".35" stop-color="#9a7052"/>
            <stop offset=".65" stop-color="#795548"/>
            <stop offset="1" stop-color="#4e342e"/>
          </linearGradient>
          <linearGradient id="jacGrowLeaf" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#81c784"/>
            <stop offset="100%" stop-color="#1b5e20"/>
          </linearGradient>
        </defs>

        <ellipse cx="50" cy="90" rx="36" ry="5" fill="#4e342e" opacity=".22"/>

        <!-- Trunk -->
        <path d="M49 89 Q48 78 50 68 Q49 58 50 48"
          fill="none" stroke="url(#jacGrowTrunk)" stroke-width="4" stroke-linecap="round"/>

        <!-- Main branches -->
        <g fill="none" stroke="#795548" stroke-linecap="round">
          <path d="M50 69 Q41 63 34 55" stroke-width="2.7"/>
          <path d="M50 66 Q60 58 67 51" stroke-width="2.6"/>
          <path d="M50 58 Q44 52 42 45" stroke-width="2"/>
          <path d="M50 55 Q57 49 60 42" stroke-width="2"/>
          <path d="M34 55L28 49 M67 51L73 45" stroke-width="1.5"/>
        </g>

        <!-- Fine compound foliage -->
        <g stroke="#558b2f" stroke-width=".65" fill="none" opacity=".95">
          <path d="M28 49L22 42 M34 55L25 56 M42 45L34 37 M60 42L67 34 M67 51L78 48 M50 48L48 38"/>
        </g>

        <!-- Left foliage -->
        <g fill="url(#jacGrowLeaf)">
          <ellipse cx="24" cy="44" rx="6" ry="2" transform="rotate(35 24 44)"/>
          <ellipse cx="29" cy="49" rx="5.5" ry="2" transform="rotate(-20 29 49)"/>
          <ellipse cx="35" cy="42" rx="5.5" ry="1.9" transform="rotate(-35 35 42)"/>
          <ellipse cx="39" cy="49" rx="5" ry="1.9" transform="rotate(15 39 49)"/>
          <ellipse cx="43" cy="39" rx="5" ry="1.9" transform="rotate(-35 43 39)"/>
          <ellipse cx="46" cy="47" rx="5.5" ry="2"/>
        </g>

        <!-- Right foliage -->
        <g fill="url(#jacGrowLeaf)">
          <ellipse cx="65" cy="39" rx="5.5" ry="2" transform="rotate(35 65 39)"/>
          <ellipse cx="70" cy="47" rx="5.5" ry="2" transform="rotate(-25 70 47)"/>
          <ellipse cx="76" cy="42" rx="5" ry="1.9" transform="rotate(35 76 42)"/>
          <ellipse cx="57" cy="48" rx="5" ry="2" transform="rotate(-20 57 48)"/>
          <ellipse cx="60" cy="34" rx="5" ry="1.9" transform="rotate(35 60 34)"/>
          <ellipse cx="51" cy="38" rx="5" ry="2"/>
        </g>

        <!-- Fine individual leaflet details -->
        <g fill="#a5d66f">
          <ellipse cx="22" cy="41" rx="2.1" ry=".8" transform="rotate(35 22 41)"/>
          <ellipse cx="27" cy="45" rx="2.1" ry=".8" transform="rotate(-25 27 45)"/>
          <ellipse cx="33" cy="39" rx="2.1" ry=".8" transform="rotate(-35 33 39)"/>
          <ellipse cx="40" cy="43" rx="2.1" ry=".8" transform="rotate(20 40 43)"/>
          <ellipse cx="66" cy="35" rx="2.1" ry=".8" transform="rotate(30 66 35)"/>
          <ellipse cx="73" cy="44" rx="2.1" ry=".8" transform="rotate(-30 73 44)"/>
          <ellipse cx="59" cy="44" rx="2.1" ry=".8" transform="rotate(-20 59 44)"/>
          <ellipse cx="63" cy="32" rx="2.1" ry=".8" transform="rotate(30 63 32)"/>
        </g>

        <!-- Early flower panicles -->
        <g fill="#9575cd">
          <circle cx="35" cy="33" r="2.1"/>
          <circle cx="39" cy="30" r="2.4"/>
          <circle cx="43" cy="33" r="2"/>
          <circle cx="63" cy="29" r="2.1"/>
          <circle cx="67" cy="26" r="2.4"/>
          <circle cx="71" cy="29" r="2"/>
        </g>
        <g fill="#d1c4e9">
          <circle cx="37" cy="29" r="1.1"/>
          <circle cx="41" cy="32" r="1"/>
          <circle cx="65" cy="25" r="1.1"/>
          <circle cx="69" cy="29" r="1"/>
        </g>
      `,

      /* =========================================
         MATURE - Full flowering Jacaranda
      ========================================= */
      mature: `
        <defs>
          <linearGradient id="jacMatTrunk" x1="0" y1="0" x2="1" y2="0">
            <stop stop-color="#4e342e"/>
            <stop offset=".25" stop-color="#8d6349"/>
            <stop offset=".5" stop-color="#b08a69"/>
            <stop offset=".75" stop-color="#795548"/>
            <stop offset="1" stop-color="#3e2723"/>
          </linearGradient>

          <linearGradient id="jacMatLeaf" x1="0" y1="0" x2="0" y2="1">
            <stop stop-color="#81c784"/>
            <stop offset=".5" stop-color="#388e3c"/>
            <stop offset="1" stop-color="#1b5e20"/>
          </linearGradient>

          <radialGradient id="jacFlower" cx="35%" cy="25%" r="75%">
            <stop offset="0%" stop-color="#e1bee7"/>
            <stop offset="45%" stop-color="#b39ddb"/>
            <stop offset="100%" stop-color="#5e35b1"/>
          </radialGradient>

          <radialGradient id="jacFlowerLight">
            <stop offset="0%" stop-color="#ede7f6"/>
            <stop offset="100%" stop-color="#9575cd"/>
          </radialGradient>
        </defs>

        <!-- Ground shadow -->
        <ellipse cx="50" cy="90" rx="46" ry="5.5" fill="#4e342e" opacity=".19"/>

        <!-- Fallen blossom carpet -->
        <g opacity=".95">
          <path d="M8 88l3-2 3 2-3 2Z" fill="#9575cd"/>
          <path d="M17 87l2-2 3 1-1 3Z" fill="#b39ddb"/>
          <path d="M27 89l3-3 3 2-2 2Z" fill="#7e57c2"/>
          <path d="M37 87l2-2 3 1-1 3Z" fill="#d1c4e9"/>
          <path d="M47 89l3-3 3 2-2 2Z" fill="#9575cd"/>
          <path d="M57 87l3-2 3 2-2 2Z" fill="#b39ddb"/>
          <path d="M68 89l3-3 3 2-2 2Z" fill="#7e57c2"/>
          <path d="M79 87l3-2 3 2-2 2Z" fill="#d1c4e9"/>
          <path d="M89 89l2-3 3 2-2 2Z" fill="#9575cd"/>
        </g>

        <!-- Main trunk with natural taper -->
        <path d="M48 90 Q49 78 48 69 Q47 59 50 49 Q51 45 50 39
                 L53 39 Q52 55 54 66 Q53 78 57 90Z"
          fill="url(#jacMatTrunk)"/>

        <!-- Trunk texture -->
        <g fill="none" stroke="#4e342e" opacity=".45" stroke-linecap="round">
          <path d="M50 84Q52 77 50 70" stroke-width=".8"/>
          <path d="M53 87Q50 77 52 69" stroke-width=".7"/>
          <path d="M49 65Q51 59 50 53" stroke-width=".6"/>
        </g>

        <!-- Main tree structure -->
        <g fill="none" stroke="#795548" stroke-linecap="round" stroke-linejoin="round">
          <path d="M50 70 Q38 63 30 53 Q24 47 19 39" stroke-width="4"/>
          <path d="M52 68 Q64 60 72 50 Q79 43 83 35" stroke-width="3.8"/>
          <path d="M49 59 Q39 52 35 42 Q32 36 29 31" stroke-width="3"/>
          <path d="M52 57 Q62 50 66 40 Q69 34 72 29" stroke-width="3"/>
          <path d="M50 49 Q44 41 43 31 Q42 25 44 20" stroke-width="2.4"/>
          <path d="M52 49 Q58 40 57 30 Q57 24 56 18" stroke-width="2.4"/>

          <!-- Fine branch divisions -->
          <path d="M19 39L12 31 M19 39L24 28 M30 53L23 49 M35 42L29 36 M83 35L89 27 M83 35L76 27 M72 50L79 45 M66 40L73 35 M43 31L37 24 M57 30L64 23"
            stroke-width="1.5"/>
        </g>

        <!-- Foliage behind flowers -->
        <g fill="url(#jacMatLeaf)">
          <!-- Left outer canopy -->
          <ellipse cx="15" cy="34" rx="10" ry="5" transform="rotate(25 15 34)"/>
          <ellipse cx="23" cy="27" rx="10" ry="5" transform="rotate(-20 23 27)"/>
          <ellipse cx="29" cy="36" rx="11" ry="5" transform="rotate(20 29 36)"/>
          <ellipse cx="34" cy="24" rx="11" ry="5" transform="rotate(-35 34 24)"/>
          <ellipse cx="40" cy="32" rx="10" ry="4.5" transform="rotate(15 40 32)"/>

          <!-- Upper canopy -->
          <ellipse cx="45" cy="19" rx="10" ry="5"/>
          <ellipse cx="55" cy="18" rx="11" ry="5"/>
          <ellipse cx="65" cy="23" rx="11" ry="5" transform="rotate(25 65 23)"/>

          <!-- Right outer canopy -->
          <ellipse cx="74" cy="31" rx="11" ry="5" transform="rotate(-20 74 31)"/>
          <ellipse cx="83" cy="35" rx="10" ry="5" transform="rotate(25 83 35)"/>
          <ellipse cx="69" cy="38" rx="11" ry="5" transform="rotate(15 69 38)"/>

          <!-- Lower canopy -->
          <ellipse cx="29" cy="46" rx="10" ry="4.5"/>
          <ellipse cx="43" cy="43" rx="11" ry="5"/>
          <ellipse cx="57" cy="43" rx="11" ry="5"/>
          <ellipse cx="75" cy="47" rx="10" ry="4.5"/>
        </g>

        <!-- Fine fern-like leaflets -->
        <g fill="#a5d66f" opacity=".95">
          <ellipse cx="11" cy="29" rx="3" ry="1.2" transform="rotate(35 11 29)"/>
          <ellipse cx="18" cy="32" rx="3" ry="1.1" transform="rotate(-25 18 32)"/>
          <ellipse cx="22" cy="23" rx="3" ry="1.2" transform="rotate(-35 22 23)"/>
          <ellipse cx="29" cy="30" rx="3" ry="1.2" transform="rotate(30 29 30)"/>
          <ellipse cx="34" cy="20" rx="3" ry="1.2" transform="rotate(-30 34 20)"/>
          <ellipse cx="40" cy="26" rx="3" ry="1.2"/>
          <ellipse cx="45" cy="15" rx="3" ry="1.2"/>
          <ellipse cx="54" cy="14" rx="3" ry="1.2"/>
          <ellipse cx="64" cy="19" rx="3" ry="1.2" transform="rotate(25 64 19)"/>
          <ellipse cx="72" cy="27" rx="3" ry="1.2" transform="rotate(-30 72 27)"/>
          <ellipse cx="82" cy="31" rx="3" ry="1.2" transform="rotate(30 82 31)"/>
          <ellipse cx="76" cy="40" rx="3" ry="1.2"/>
          <ellipse cx="29" cy="42" rx="3" ry="1.2"/>
          <ellipse cx="43" cy="39" rx="3" ry="1.2"/>
          <ellipse cx="57" cy="39" rx="3" ry="1.2"/>
        </g>

        <!-- Leaf veins -->
        <g stroke="#c5e1a5" stroke-width=".55" opacity=".65" fill="none">
          <path d="M8 35Q18 31 25 27"/>
          <path d="M26 37Q35 28 43 22"/>
          <path d="M44 31Q50 23 56 18"/>
          <path d="M57 32Q68 25 76 29"/>
          <path d="M67 43Q78 35 86 34"/>
        </g>

        <!-- Flower panicle stems -->
        <g fill="none" stroke="#6a459e" stroke-width=".9" stroke-linecap="round">
          <path d="M17 27Q20 19 25 15"/>
          <path d="M34 21Q37 14 42 12"/>
          <path d="M48 18Q49 11 52 9"/>
          <path d="M63 22Q67 15 72 14"/>
          <path d="M77 28Q81 22 85 21"/>
          <path d="M28 35Q29 29 32 26"/>
          <path d="M57 37Q60 29 64 27"/>
        </g>

        <!-- Five-lobed trumpet flowers -->
        <g fill="url(#jacFlower)" stroke="#7650b1" stroke-width=".45">
          <!-- Flower 1 -->
          <path d="M19 18 C15 14 13 19 16 22 C12 24 17 28 20 24 C23 28 28 24 24 21 C28 17 23 14 19 18Z"/>
          <path d="M28 13 C24 9 22 14 25 17 C21 20 26 23 29 19 C33 22 36 18 32 15 C35 11 30 9 28 13Z"/>

          <!-- Flower 2 -->
          <path d="M38 13 C34 9 32 14 35 17 C31 20 36 23 39 19 C43 22 46 18 42 15 C45 11 40 9 38 13Z"/>
          <path d="M46 8 C42 4 40 9 43 12 C39 15 44 18 47 14 C51 17 54 13 50 10 C53 6 48 4 46 8Z"/>

          <!-- Flower 3 -->
          <path d="M53 7 C49 3 47 8 50 11 C46 14 51 17 54 13 C58 16 61 12 57 9 C60 5 55 3 53 7Z"/>
          <path d="M70 12 C66 8 64 13 67 16 C63 19 68 22 71 18 C75 21 78 17 74 14 C77 10 72 8 70 12Z"/>

          <!-- Flower 4 -->
          <path d="M82 19 C78 15 76 20 79 23 C75 26 80 29 83 25 C87 28 90 24 86 21 C89 17 84 15 82 19Z"/>
          <path d="M32 25 C28 21 26 26 29 29 C25 32 30 35 33 31 C37 34 40 30 36 27 C39 23 34 21 32 25Z"/>

          <!-- Flower 5 -->
          <path d="M63 29 C59 25 57 30 60 33 C56 36 61 39 64 35 C68 38 71 34 67 31 C70 27 65 25 63 29Z"/>
          <path d="M47 26 C43 22 41 27 44 30 C40 33 45 36 48 32 C52 35 55 31 51 28 C54 24 49 22 47 26Z"/>
        </g>

        <!-- Flower throats -->
        <g fill="#4a148c" opacity=".9">
          <ellipse cx="19" cy="21" rx="1.3" ry="2"/>
          <ellipse cx="28" cy="16" rx="1.3" ry="2"/>
          <ellipse cx="38" cy="16" rx="1.3" ry="2"/>
          <ellipse cx="46" cy="11" rx="1.3" ry="2"/>
          <ellipse cx="53" cy="10" rx="1.3" ry="2"/>
          <ellipse cx="70" cy="15" rx="1.3" ry="2"/>
          <ellipse cx="82" cy="22" rx="1.3" ry="2"/>
          <ellipse cx="32" cy="28" rx="1.3" ry="2"/>
          <ellipse cx="63" cy="32" rx="1.3" ry="2"/>
          <ellipse cx="47" cy="29" rx="1.3" ry="2"/>
        </g>

        <!-- Light petal highlights -->
        <g fill="#ede7f6" opacity=".8">
          <ellipse cx="17" cy="17" rx="1.7" ry=".8" transform="rotate(-30 17 17)"/>
          <ellipse cx="26" cy="12" rx="1.7" ry=".8" transform="rotate(-30 26 12)"/>
          <ellipse cx="36" cy="12" rx="1.7" ry=".8" transform="rotate(-30 36 12)"/>
          <ellipse cx="44" cy="7" rx="1.7" ry=".8" transform="rotate(-30 44 7)"/>
          <ellipse cx="51" cy="6" rx="1.7" ry=".8" transform="rotate(-30 51 6)"/>
          <ellipse cx="68" cy="11" rx="1.7" ry=".8" transform="rotate(-30 68 11)"/>
          <ellipse cx="80" cy="18" rx="1.7" ry=".8" transform="rotate(-30 80 18)"/>
        </g>

        <!-- Small petal details in canopy -->
        <g fill="#b39ddb" opacity=".85">
          <circle cx="12" cy="24" r="1.1"/>
          <circle cx="23" cy="10" r="1.1"/>
          <circle cx="39" cy="7" r="1.1"/>
          <circle cx="58" cy="5" r="1.1"/>
          <circle cx="75" cy="10" r="1.1"/>
          <circle cx="89" cy="24" r="1.1"/>
        </g>
      `,

      /* =========================================
         WITHERED - Dormant / leaf-shedding tree
      ========================================= */
      withered: `
        <defs>
          <linearGradient id="jacDryTrunk" x1="0" y1="0" x2="1" y2="0">
            <stop stop-color="#4e342e"/>
            <stop offset=".4" stop-color="#8d6e63"/>
            <stop offset=".7" stop-color="#795548"/>
            <stop offset="1" stop-color="#3e2723"/>
          </linearGradient>
          <linearGradient id="jacDryPod" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#a1887f"/>
            <stop offset=".5" stop-color="#795548"/>
            <stop offset="1" stop-color="#4e342e"/>
          </linearGradient>
        </defs>

        <!-- Ground -->
        <ellipse cx="50" cy="90" rx="40" ry="5" fill="#4e342e" opacity=".2"/>

        <!-- Main trunk -->
        <path d="M49 90 Q48 78 50 68 Q49 57 50 47 L53 47
                 Q53 63 54 73 Q54 82 57 90Z"
          fill="url(#jacDryTrunk)"/>

        <!-- Main branches -->
        <g fill="none" stroke="#6d4c41" stroke-linecap="round" stroke-linejoin="round">
          <path d="M50 72Q39 63 31 53Q25 45 18 38" stroke-width="3.5"/>
          <path d="M52 69Q64 59 73 49Q80 42 85 34" stroke-width="3.3"/>
          <path d="M49 57Q39 49 35 39Q31 31 28 25" stroke-width="2.5"/>
          <path d="M52 56Q62 48 66 38Q70 30 74 24" stroke-width="2.5"/>
          <path d="M50 47Q43 38 43 29Q42 23 40 18" stroke-width="2"/>
          <path d="M52 47Q59 37 59 28Q59 22 61 16" stroke-width="2"/>

          <!-- Fine branch tips -->
          <path d="M18 38L12 28 M18 38L21 27 M31 53L24 47 M28 25L24 17 M35 39L29 32 M85 34L91 24 M85 34L79 23 M73 49L80 43 M74 24L77 16 M66 38L72 31 M43 29L37 20 M61 28L67 19"
            stroke-width="1.3"/>
        </g>

        <!-- Sparse dried leaves -->
        <g fill="#a1887f">
          <path d="M18 37Q10 32 12 27Q19 27 18 37Z"/>
          <path d="M34 39Q27 34 29 29Q36 32 34 39Z"/>
          <path d="M43 29Q37 25 39 19Q45 23 43 29Z"/>
          <path d="M66 38Q63 31 68 27Q72 33 66 38Z"/>
          <path d="M83 35Q88 29 89 24Q82 25 83 35Z"/>
          <path d="M72 49Q79 44 82 42Q77 49 72 49Z"/>
        </g>

        <g fill="#795548">
          <path d="M24 47Q18 41 21 37Q27 42 24 47Z"/>
          <path d="M58 37Q55 30 59 25Q64 32 58 37Z"/>
          <path d="M77 23Q75 17 80 13Q83 20 77 23Z"/>
          <path d="M12 28Q7 23 10 19Q15 22 12 28Z"/>
        </g>

        <!-- Characteristic flat round woody seed capsules -->
        <g>
          <path d="M25 24 Q21 19 25 14 Q29 10 34 14 Q38 18 34 23 Q30 27 25 24Z"
            fill="url(#jacDryPod)" stroke="#4e342e" stroke-width=".8"/>
          <path d="M27 22Q25 18 29 14Q33 13 35 17Q34 22 30 24Z"
            fill="#bcaaa4" opacity=".45"/>
          <path d="M25 18Q29 19 34 17" stroke="#4e342e" stroke-width=".6" fill="none"/>

          <path d="M72 27 Q68 22 72 17 Q76 13 81 17 Q85 21 81 26 Q77 30 72 27Z"
            fill="url(#jacDryPod)" stroke="#4e342e" stroke-width=".8"/>
          <path d="M74 25Q72 21 76 17Q80 16 82 20Q81 25 77 27Z"
            fill="#bcaaa4" opacity=".4"/>
          <path d="M72 21Q76 22 81 20" stroke="#4e342e" stroke-width=".6" fill="none"/>

          <path d="M56 49Q53 45 56 41Q60 37 64 41Q68 45 64 49Q60 53 56 49Z"
            fill="url(#jacDryPod)" stroke="#4e342e" stroke-width=".7"/>
        </g>

        <!-- Dry seed pod attachment stems -->
        <g stroke="#6d4c41" stroke-width="1" fill="none">
          <path d="M28 26L27 32"/>
          <path d="M76 28L73 33"/>
          <path d="M60 49L59 53"/>
        </g>

        <!-- Fallen dry leaves and petals -->
        <g fill="#a1887f">
          <path d="M17 87Q12 83 17 80Q22 84 17 87Z"/>
          <path d="M34 89Q29 85 34 82Q39 85 34 89Z"/>
          <path d="M68 88Q63 84 68 81Q73 84 68 88Z"/>
          <path d="M82 88Q77 84 82 81Q87 84 82 88Z"/>
        </g>

        <g fill="#795548" opacity=".8">
          <ellipse cx="44" cy="87" rx="2.5" ry="1"/>
          <ellipse cx="57" cy="88" rx="2.5" ry="1"/>
          <ellipse cx="91" cy="86" rx="2" ry=".8"/>
        </g>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
