/**
 * Botanical Plant Definition: Yarsagumba (यार्सागुम्बा)
 * High-altitude Himalayan caterpillar fungus (Ophiocordyceps sinensis / Cordyceps sinensis)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['yarsagumba'] = {
    id: 44,
    slug: 'yarsagumba',
    english: "Yarsagumba (Caterpillar Fungus)",
    nepali: "यार्सागुम्बा",
    scientific: "Ophiocordyceps sinensis",
    category: "Herb",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13V4.5c0-.8.8-1.5 1.3-.8.4.5.3 1.4.2 2.3L13 13" fill="#5d4037" stroke="currentColor"/><path d="M4 13h16" stroke="#558b2f" stroke-width="1.4"/><path d="M7.5 12.5c-.5-1.4-.2-2.8.8-3.6M16.5 12.5c.6-1.3.4-2.7-.5-3.4" stroke="#66bb6a" stroke-width="1.2"/><path d="M12.5 13c1.6 1 2 3.2 1.2 5.4-.6 1.7-1.6 3.1-2.5 4-.8.6-2-.1-1.7-1.1.5-1.8 1.2-3.4 1.3-5.3.1-1.3.2-2.2 1.7-3z" fill="#eab354" stroke="currentColor"/><path d="M11 16h2.2M10.5 18.2h2.2M9.8 20.4h2" stroke="#8d6e63" stroke-width="0.9"/></svg>',
    desc: "Prized high-altitude Himalayan medicinal fungus (Ophiocordyceps sinensis, locally Yarsagumba or 'Winter Worm, Summer Grass'), growing out of an underground golden-ochre segmented ghost-moth larva into a slender dark-brown fruiting stalk across alpine meadows.",
    stages: {
      sprout: `
        <!-- Alpine soil cross-section -->
        <path d="M20 58 Q50 55.5 80 58 C82 77 70 93 50 95 C30 93 18 77 20 58 Z" fill="#4e342e" opacity="0.9"/>
        <path d="M25 59.5 Q50 57.5 75 59.5 C76 76 66 90 50 92 C34 90 24 76 25 59.5 Z" fill="#3e2723" opacity="0.78"/>
        <!-- Fine soil rootlets & grassy alpine horizon -->
        <path d="M18 58 Q50 55 82 58" stroke="#558b2f" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M31 57 Q28 52 25 49 M34 57 Q33 52 35 48 M68 57 Q71 52 74 49 M65 57 Q65 53 63 50" stroke="#7cb342" stroke-width="1.3" stroke-linecap="round" fill="none"/>

        <!-- Underground golden-ochre segmented caterpillar larva -->
        <path d="M51 58 C53.5 60 54.5 66 53 73 C51.5 80 48.5 86 46 90 C44.5 92 41.5 90.5 42.2 88 C44 82 46.2 76 47.2 70 C48 64 47.8 59.5 51 58 Z" fill="#e0a94c" stroke="#8c5a20" stroke-width="0.75"/>
        <!-- Transverse caterpillar segments -->
        <g stroke="#9c6724" stroke-width="0.75" stroke-linecap="round" fill="none" opacity="0.85">
          <path d="M48 63 Q50.8 64 53.5 63"/>
          <path d="M47.8 67 Q50.6 68 53.4 67"/>
          <path d="M47.2 71 Q50 72 52.8 71"/>
          <path d="M46.4 75 Q49 76 51.8 75"/>
          <path d="M45.4 79 Q47.8 80 50.6 79"/>
          <path d="M44.2 83 Q46.5 84 49.2 83"/>
          <path d="M43 87 Q45 88 47.4 87"/>
        </g>
        <!-- Dark collar & tiny emerging fungal shoot poking just above turf -->
        <path d="M48.5 59.5 Q51 57.5 53 59.5 L52 55.5 Q50.5 49 49.5 45 C49 47 48.8 53 48.5 59.5 Z" fill="#4e342e" stroke="#3e2723" stroke-width="0.5"/>
      `,
      growing: `
        <!-- Alpine soil cross-section -->
        <path d="M17 57 Q50 54.5 83 57 C85 77 73 94.5 50 96.5 C27 94.5 15 77 17 57 Z" fill="#4e342e" opacity="0.92"/>
        <path d="M22 58.5 Q50 56.5 78 58.5 C79 76 68 91.5 50 93.5 C32 91.5 21 76 22 58.5 Z" fill="#3e2723" opacity="0.8"/>
        <!-- Meadow tufts on turf -->
        <path d="M15 57 Q50 54 85 57" stroke="#558b2f" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <g stroke="#66bb6a" stroke-width="1.35" stroke-linecap="round" fill="none">
          <path d="M26 56 Q23 49 20 45 M29 56 Q29 48 31 44"/>
          <path d="M39 55.5 Q37 50 35 47"/>
          <path d="M63 55.5 Q65 49 67 46"/>
          <path d="M72 56 Q75 49 79 45 M70 56 Q69 50 68 47"/>
        </g>

        <!-- Underground golden-ochre caterpillar host -->
        <path d="M51 56 C54 58 55.5 64 53.8 72 C52 80 48.5 87 45.5 92 C44 94 40.8 92.5 41.6 89.5 C43.8 83 46.2 76 47.4 69 C48.2 63 47.8 58 51 56 Z" fill="#e5af52" stroke="#8c5a20" stroke-width="0.75"/>
        <!-- Subtle ventral prolegs -->
        <path d="M53.5 68 L55 68.8 M52.6 73 L54 73.8 M51.2 78 L52.5 78.8" stroke="#c98e32" stroke-width="1.3" stroke-linecap="round"/>
        <!-- Segment rings & warm highlight -->
        <path d="M49 60 Q48.5 74 43.2 90" stroke="#f7d388" stroke-width="1.1" stroke-linecap="round" opacity="0.65" fill="none"/>
        <g stroke="#9c6724" stroke-width="0.75" stroke-linecap="round" fill="none" opacity="0.88">
          <path d="M48.2 61 Q51.2 62.2 54 61"/>
          <path d="M48 65 Q51 66.2 54 65"/>
          <path d="M47.4 69 Q50.4 70.2 53.4 69"/>
          <path d="M46.6 73 Q49.5 74.2 52.6 73"/>
          <path d="M45.6 77 Q48.4 78.2 51.4 77"/>
          <path d="M44.5 81 Q47 82.2 50 81"/>
          <path d="M43.4 85 Q45.8 86 48.4 85"/>
          <path d="M42.2 89 Q44.2 90 46.5 89"/>
        </g>

        <!-- Growing fruiting stroma rising above ground -->
        <path d="M48 58 Q50.8 59.5 53.2 57.5 L52 51 Q51.2 38 50.5 27 C50 25 49 25 48.6 27 Q48.4 39 48 58 Z" fill="#8d5a3c" stroke="#4e342e" stroke-width="0.55"/>
        <path d="M48.3 58 L48.6 52 L52.2 52 L53 57.5 Q50.5 59 48.3 58 Z" fill="#3e2723"/>
        <path d="M49.6 50 L49.6 31" stroke="#c89268" stroke-width="1.1" stroke-linecap="round" opacity="0.72"/>
        <ellipse cx="49.6" cy="27.2" rx="1.2" ry="1.8" fill="#4e342e"/>
      `,
      mature: `
        <!-- ================= HIGH-ALTITUDE ALPINE SOIL CROSS-SECTION ================= -->
        <path d="M15 55 Q50 52.5 85 55 C88 76 74 96 50 98 C26 96 12 76 15 55 Z" fill="#4e342e" opacity="0.93"/>
        <path d="M20 57 Q50 55 80 57 C81 75 69 93 50 95 C31 93 19 75 20 57 Z" fill="#3e2723" opacity="0.82"/>
        <!-- Fine underground rootlets & humus texture matching photo -->
        <g stroke="#6d4c41" stroke-width="0.7" fill="none" opacity="0.65">
          <path d="M28 63 Q32 70 29 78 M31 69 Q36 72 39 76"/>
          <path d="M72 62 Q67 69 70 77 M68 68 Q62 72 60 75"/>
          <path d="M35 84 Q40 87 38 91 M64 83 Q59 87 62 91"/>
        </g>

        <!-- Mossy alpine meadow horizon & tiny herb blades -->
        <path d="M13 55 Q50 52 87 55" stroke="#558b2f" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M16 54.5 Q50 51.5 84 54.5" stroke="#7cb342" stroke-width="1.1" stroke-linecap="round" fill="none" opacity="0.85"/>
        <g stroke="#66bb6a" stroke-width="1.35" stroke-linecap="round" fill="none">
          <path d="M21 54 Q18 46 15 41 M24 54 Q23 46 26 42 M27 54 Q29 48 32 45"/>
          <path d="M36 53.5 Q33 47 30 43 M39 53.5 Q39 46 41 42"/>
          <path d="M61 53.5 Q62 46 64 42 M64 53.5 Q67 47 70 43"/>
          <path d="M73 54 Q75 47 78 42 M76 54 Q80 47 83 43"/>
        </g>
        <!-- Tiny pale alpine cushion leaves -->
        <g fill="#a5d6a7" opacity="0.82">
          <ellipse cx="32" cy="52" rx="2.2" ry="1.2" transform="rotate(-20 32 52)"/>
          <ellipse cx="68" cy="52" rx="2.2" ry="1.2" transform="rotate(20 68 52)"/>
          <ellipse cx="43" cy="52.5" rx="1.8" ry="1" transform="rotate(-12 43 52.5)"/>
          <ellipse cx="58" cy="52.5" rx="1.8" ry="1" transform="rotate(12 58 52.5)"/>
        </g>

        <!-- ================= UNDERGROUND GOLDEN-OCHRE CATERPILLAR HOST ================= -->
        <!-- Plump mummified Thitarodes caterpillar body curving down-left in soil -->
        <path d="M51 54.5 C54.5 56.5 56 63 54.2 71.5 C52.4 80 48.6 88 45.2 93.5 C43.6 95.8 39.8 94.2 40.6 90.8 C42.8 83.5 45.4 76 46.8 68 C47.6 62 47.4 56.5 51 54.5 Z" fill="#e6b051" stroke="#8a571c" stroke-width="0.8" stroke-linejoin="round"/>
        <!-- Distinct small ventral proleg stubs along right side (characteristic of Yarsagumba) -->
        <g fill="#d39636" stroke="#8a571c" stroke-width="0.5">
          <ellipse cx="54.8" cy="65.5" rx="1.3" ry="0.9"/>
          <ellipse cx="53.8" cy="70.8" rx="1.35" ry="0.9"/>
          <ellipse cx="52.5" cy="76" rx="1.3" ry="0.85"/>
          <ellipse cx="50.8" cy="81" rx="1.2" ry="0.8"/>
        </g>
        <!-- Warm golden highlight along the larva's back -->
        <path d="M48.8 59 Q48 74 42.5 91.5" stroke="#fae09e" stroke-width="1.3" stroke-linecap="round" opacity="0.72" fill="none"/>
        <!-- Finely segmented transverse caterpillar rings -->
        <g stroke="#996320" stroke-width="0.8" stroke-linecap="round" fill="none" opacity="0.9">
          <path d="M48 59 Q51.4 60.4 54.6 59"/>
          <path d="M47.8 62.5 Q51.2 63.8 54.6 62.5"/>
          <path d="M47.4 66 Q50.8 67.3 54.2 66"/>
          <path d="M46.8 69.5 Q50.2 70.8 53.6 69.5"/>
          <path d="M46 73 Q49.4 74.3 52.8 73"/>
          <path d="M45.2 76.5 Q48.5 77.8 51.8 76.5"/>
          <path d="M44.4 80 Q47.6 81.2 50.8 80"/>
          <path d="M43.4 83.5 Q46.4 84.6 49.5 83.5"/>
          <path d="M42.4 87 Q45.2 88 48 87"/>
          <path d="M41.5 90.5 Q44 91.4 46.5 90.5"/>
        </g>

        <!-- ================= UPRIGHT DARK-BROWN FRUITING STROMA ================= -->
        <!-- Dark umber head-capsule junction at ground entry -->
        <path d="M47.8 56.5 Q51 58.2 53.8 56 L53 50.5 L48.2 50.5 Z" fill="#3e2723" stroke="#281815" stroke-width="0.5"/>
        <!-- Slender club-shaped fruiting stalk rising out of caterpillar head -->
        <path d="M48.2 51.5 Q48.4 36 48.2 21 Q48.1 12 49.2 8.2 C49.7 7 50.8 7 51.3 8.2 Q52.2 13 52 22 Q51.8 36 53 51.5 Z" fill="#6d432e" stroke="#3e2723" stroke-width="0.6"/>
        <!-- Warm tan-chestnut midsection & dark spore-bearing apex (as in reference photos) -->
        <path d="M48.8 48 Q49.2 35 49 23 L51.4 23 Q51.2 35 51.9 48 Z" fill="#a87049" opacity="0.88"/>
        <path d="M49.5 45 L49.6 25" stroke="#d49e72" stroke-width="0.95" stroke-linecap="round" opacity="0.72"/>
        <!-- Darker brown-black upper fertile club tip -->
        <path d="M48.2 22 Q48.1 12 49.2 8.2 C49.7 7 50.8 7 51.3 8.2 Q52.2 13 52 22 Z" fill="#4a2e22"/>
        <ellipse cx="50.2" cy="12" rx="1.1" ry="3.2" fill="#362018" opacity="0.75"/>
      `,
      withered: `
        <!-- Dry alpine soil cross-section -->
        <path d="M18 58 Q50 55.5 82 58 C84 77 72 94 50 95.5 C28 94 16 77 18 58 Z" fill="#4e342e" opacity="0.88"/>
        <path d="M23 59.5 Q50 57.5 77 59.5 C78 76 67 91 50 92.5 C33 91 22 76 23 59.5 Z" fill="#3e2723" opacity="0.75"/>
        <path d="M16 58 Q50 55 84 58" stroke="#795548" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M26 57 Q23 51 19 48 M72 57 Q75 51 79 48" stroke="#8d6e63" stroke-width="1.2" stroke-linecap="round" fill="none"/>

        <!-- Desiccated darker ochre caterpillar host underground -->
        <path d="M51 58 C53.5 60 54.5 66 52.8 73 C51 80 47.8 87 45 91.5 C43.5 93 41 91.5 41.8 89 C43.8 83 46 76 47.2 69 C48 63 48 59 51 58 Z" fill="#a8814c" stroke="#5d4037" stroke-width="0.75"/>
        <g stroke="#5d4037" stroke-width="0.7" stroke-linecap="round" fill="none" opacity="0.8">
          <path d="M48 63 Q50.8 64 53.5 63"/>
          <path d="M47.4 68 Q50.2 69 53 68"/>
          <path d="M46.4 74 Q49 75 51.8 74"/>
          <path d="M45.2 80 Q47.6 81 50.2 80"/>
          <path d="M43.6 86 Q45.8 87 48 86"/>
        </g>

        <!-- Bent dried dark-brown fruiting stalk -->
        <path d="M48 58 L48.5 52 L52.5 52 L53 58 Z" fill="#3e2723"/>
        <path d="M50.5 53 Q49 38 45 26 Q42 18 38 14" stroke="#5d4037" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <circle cx="38" cy="14" r="1.3" fill="#4e342e"/>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
