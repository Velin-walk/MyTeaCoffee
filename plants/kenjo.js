/**
 * Botanical Plant Definition: Kenjo / Padamchal (केन्जो / पदमचाल)
 * Rare high-altitude Himalayan alpine herb (Rheum nobile)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['kenjo'] = {
    id: 40,
    slug: 'kenjo',
    english: "Kenjo (Padamchal)",
    nepali: "केन्जो (पदमचाल)",
    scientific: "Rheum nobile",
    category: "Herb",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-2.2 2.5-3.8 7.5-4.5 12.5h9C15.8 10.5 14.2 5.5 12 3z" fill="#fff9c4" stroke="currentColor"/><path d="M9.5 8.5c1.6.9 3.4.9 5 0M8.5 12c2.2 1 4.8 1 7 0"/><path d="M7.5 15.5c-3 0-5 1.5-5.5 3.5 3 .8 6 .4 8-1.2M16.5 15.5c3 0 5 1.5 5.5 3.5-3 .8-6 .4-8-1.2M12 15.5c-2.5 1.5-3.2 3.8-2.2 5.5h4.4c1-1.7.3-4-2.2-5.5z" fill="#43a047" stroke="currentColor"/></svg>',
    desc: "Rare high-altitude Himalayan alpine herb (Rheum nobile, locally Kenjo or Padamchal), famed for its luminous tower of creamy-yellow translucent papery bracts rising above a lush rosette of broad ruffled green leaves.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="88" rx="30" ry="5" fill="#5d4037" opacity="0.35"/>
        <ellipse cx="50" cy="87" rx="22" ry="3.5" fill="#4e342e" opacity="0.2"/>
        <!-- Broad young basal rosette leaves -->
        <path d="M50 84 C40 86 28 84 25 76 C29 70 41 72 50 79 Z" fill="#2e7d32"/>
        <path d="M50 84 C60 86 72 84 75 76 C71 70 59 72 50 79 Z" fill="#388e3c"/>
        <path d="M26 76 C30 82 38 84 44 83" stroke="#c62828" stroke-width="0.9" fill="none" opacity="0.7"/>
        <path d="M50 82 L31 76 M50 82 L69 76" stroke="#a5d6a7" stroke-width="0.7" fill="none" opacity="0.75"/>
        <path d="M50 82 C43 79 38 71 42 66 C47 68 50 74 50 82 Z" fill="#43a047"/>
        <path d="M50 82 C57 79 62 71 58 66 C53 68 50 74 50 82 Z" fill="#66bb6a"/>
        <!-- Emergent creamy alpine shoot -->
        <path d="M50 80 C45 75 45 64 50 58 C55 64 55 75 50 80 Z" fill="#fff9c4" stroke="#dce775" stroke-width="0.6"/>
        <path d="M50 77 L50 61" stroke="#c0ca33" stroke-width="0.55" opacity="0.6"/>
      `,
      growing: `
        <ellipse cx="50" cy="89" rx="38" ry="6" fill="#4e342e" opacity="0.35"/>
        <!-- Lower lush basal leaves with subtle crimson edges -->
        <path d="M48 84 C32 88 18 85 15 76 C21 67 37 70 49 79 Z" fill="#2e7d32"/>
        <path d="M16 77 C21 84 32 86 42 84" stroke="#b71c1c" stroke-width="1.1" fill="none" opacity="0.75"/>
        <path d="M52 84 C68 88 82 85 85 76 C79 67 63 70 51 79 Z" fill="#388e3c"/>
        <path d="M50 86 C39 92 26 91 25 83 C31 76 43 78 50 83 Z" fill="#1b5e20"/>
        <path d="M50 86 C61 92 74 91 75 83 C69 76 57 78 50 83 Z" fill="#2e7d32"/>
        <!-- Upper transition chartreuse-green rosette leaves -->
        <path d="M49 79 C36 77 25 71 26 63 C34 59 45 65 50 74 Z" fill="#689f38"/>
        <path d="M51 79 C64 77 75 71 74 63 C66 59 55 65 50 74 Z" fill="#7cb342"/>
        <path d="M48 80 L23 76 M52 80 L77 76 M49 75 L31 66 M51 75 L69 66" stroke="#c5e1a5" stroke-width="0.65" fill="none" opacity="0.8"/>
        <!-- Emerging layered translucent bract dome -->
        <path d="M50 74 C38 74 32 66 36 58 C42 56 49 62 50 74 Z" fill="#e6ee9c" stroke="#c0ca33" stroke-width="0.5"/>
        <path d="M50 74 C62 74 68 66 64 58 C58 56 51 62 50 74 Z" fill="#dce775" stroke="#afb42b" stroke-width="0.5"/>
        <path d="M39 67 C37 58 43 50 50 48 C57 50 63 58 61 67 C55 71 45 71 39 67 Z" fill="#fff9c4" stroke="#d4e157" stroke-width="0.5"/>
        <path d="M43 56 C42 48 46 41 50 38 C54 41 58 48 57 56 C53 59 47 59 43 56 Z" fill="#fffde7" stroke="#e6ee9c" stroke-width="0.5"/>
        <path d="M50 68 L44 59 M50 68 L56 59 M50 57 L50 42" stroke="#c5e1a5" stroke-width="0.55" fill="none" opacity="0.75"/>
      `,
      mature: `
        <ellipse cx="50" cy="91" rx="44" ry="6.5" fill="#3e2723" opacity="0.35"/>

        <!-- ================= LUSH BASAL LEAF ROSETTE ================= -->
        <!-- Back & wide outer leaves -->
        <path d="M48 77 C28 77 12 71 11 61 C17 53 35 58 49 69 Z" fill="#2e7d32"/>
        <path d="M52 77 C72 77 88 71 89 61 C83 53 65 58 51 69 Z" fill="#388e3c"/>

        <!-- Mid-lower ruffled green leaves -->
        <path d="M48 81 C26 86 9 82 8 71 C14 62 34 66 49 75 Z" fill="#388e3c"/>
        <path d="M9 72 C14 81 26 84 39 82" stroke="#c62828" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.82"/>
        <path d="M52 81 C74 86 91 82 92 71 C86 62 66 66 51 75 Z" fill="#2e7d32"/>
        <path d="M91 72 C86 81 74 84 62 82" stroke="#b71c1c" stroke-width="1.1" stroke-linecap="round" fill="none" opacity="0.65"/>

        <!-- Foreground broad basal leaves -->
        <path d="M49 82 C34 91 16 90 15 80 C20 71 38 73 49 79 Z" fill="#2e7d32"/>
        <path d="M16 81 C22 88 32 90 42 86" stroke="#b71c1c" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.65"/>
        <path d="M51 82 C66 91 84 90 85 80 C80 71 62 73 51 79 Z" fill="#43a047"/>
        <path d="M50 82 C40 94 39 95 50 96 C61 95 60 94 50 82 Z" fill="#1b5e20"/>
        <path d="M49 82 C42 91 43 94 50 94 C57 94 58 91 51 82 Z" fill="#388e3c"/>

        <!-- Basal leaf venation -->
        <g stroke="#a5d6a7" stroke-width="0.6" fill="none" opacity="0.72" stroke-linecap="round">
          <path d="M46 77 L15 71 M33 76 L24 69 M26 75 L19 77"/>
          <path d="M54 77 L85 71 M67 76 L76 69 M74 75 L81 77"/>
          <path d="M47 82 L21 81 M34 83 L27 87"/>
          <path d="M53 82 L79 81 M66 83 L73 87"/>
          <path d="M50 83 L50 93 M50 88 L45 91 M50 88 L55 91"/>
        </g>

        <!-- Upper chartreuse-lime transition bracts cupping the spire base -->
        <path d="M49 74 C34 76 22 70 23 61 C31 55 44 60 50 70 Z" fill="#9ccc65" stroke="#689f38" stroke-width="0.45"/>
        <path d="M51 74 C66 76 78 70 77 61 C69 55 56 60 50 70 Z" fill="#aed581" stroke="#689f38" stroke-width="0.45"/>
        <path d="M42 71 C38 64 43 57 50 57 C57 57 62 64 58 71 C53 75 47 75 42 71 Z" fill="#dce775" stroke="#9e9d24" stroke-width="0.45"/>

        <!-- ================= TRANSLUCENT BRACT TOWER (KENJO SPIRE) ================= -->
        <!-- Tier 1 (widest lower bracts) -->
        <path d="M29 63 C28 53 37 47 47 52 C51 57 48 66 40 69 C33 69 29 66 29 63 Z" fill="#f4f1c8" stroke="#c5cd7a" stroke-width="0.5"/>
        <path d="M71 63 C72 53 63 47 53 52 C49 57 52 66 60 69 C67 69 71 66 71 63 Z" fill="#efeab4" stroke="#bec770" stroke-width="0.5"/>
        <path d="M38 66 C37 54 44 47 50 47 C56 47 63 54 62 66 C56 71 44 71 38 66 Z" fill="#fcf9d8" stroke="#ccd485" stroke-width="0.5"/>

        <!-- Tier 2 -->
        <path d="M32 54 C32 45 40 40 48 44 C51 49 48 57 41 59 C35 59 32 57 32 54 Z" fill="#fbf7d5" stroke="#d0d68e" stroke-width="0.48"/>
        <path d="M68 54 C68 45 60 40 52 44 C49 49 52 57 59 59 C65 59 68 57 68 54 Z" fill="#f3efc4" stroke="#c8cf82" stroke-width="0.48"/>
        <path d="M40 56 C40 46 45 39 50 39 C55 39 60 46 60 56 C55 60 45 60 40 56 Z" fill="#fffde7" stroke="#d7dc96" stroke-width="0.48"/>

        <!-- Tier 3 -->
        <path d="M35 45 C35 37 42 32 48 36 C51 41 48 48 42 49 C37 49 35 47 35 45 Z" fill="#fcf9dc" stroke="#d5db98" stroke-width="0.45"/>
        <path d="M65 45 C65 37 58 32 52 36 C49 41 52 48 58 49 C63 49 65 47 65 45 Z" fill="#f5f1ca" stroke="#cdd38b" stroke-width="0.45"/>
        <path d="M42 47 C42 37 46 31 50 31 C54 31 58 37 58 47 C54 50 46 50 42 47 Z" fill="#fffef0" stroke="#dce0a2" stroke-width="0.45"/>

        <!-- Tier 4 -->
        <path d="M38 36 C38 29 44 25 49 28 C51 32 49 38 44 39 C40 39 38 38 38 36 Z" fill="#fdfae1" stroke="#d8dd9e" stroke-width="0.42"/>
        <path d="M62 36 C62 29 56 25 51 28 C49 32 51 38 56 39 C60 39 62 38 62 36 Z" fill="#f7f3d0" stroke="#cfd590" stroke-width="0.42"/>
        <path d="M43 38 C43 29 46 23 50 23 C54 23 57 29 57 38 C54 41 46 41 43 38 Z" fill="#fffef3" stroke="#dfe3a8" stroke-width="0.42"/>

        <!-- Tier 5 (upper spire) -->
        <path d="M40 27 C41 21 45 18 49 20 C51 24 49 29 45 30 C42 30 40 29 40 27 Z" fill="#fefbe6" stroke="#dce0a4" stroke-width="0.4"/>
        <path d="M60 27 C59 21 55 18 51 20 C49 24 51 29 55 30 C58 30 60 29 60 27 Z" fill="#f8f4d5" stroke="#d4d998" stroke-width="0.4"/>
        <path d="M44 28 C44 21 47 16 50 16 C53 16 56 21 56 28 C53 31 47 31 44 28 Z" fill="#fffff5" stroke="#e2e6b0" stroke-width="0.4"/>

        <!-- Tier 6 & Rosy-Cream Apex -->
        <path d="M43 19 C43 13 46 10 50 10 C54 10 57 13 57 19 C54 22 46 22 43 19 Z" fill="#fdf8e2" stroke="#dfe2ac" stroke-width="0.38"/>
        <path d="M45 13 C45 8.5 47.5 6 50 6 C52.5 6 55 8.5 55 13 C53 15 47 15 45 13 Z" fill="#f7ddd4" stroke="#e0b8ad" stroke-width="0.38"/>
        <ellipse cx="50" cy="7.5" rx="2.4" ry="1.8" fill="#f2c4ba" opacity="0.85"/>

        <!-- Delicate pale-green reticulate veining across bracts -->
        <g stroke="#c5d47a" stroke-width="0.45" fill="none" opacity="0.68" stroke-linecap="round">
          <path d="M50 69 L50 51 M46 66 L42 54 M54 66 L58 54"/>
          <path d="M39 67 L33 56 M61 67 L67 56"/>
          <path d="M50 58 L50 42 M46 55 L43 44 M54 55 L57 44"/>
          <path d="M41 48 L37 38 M59 48 L63 38"/>
          <path d="M50 48 L50 33 M47 45 L45 35 M53 45 L55 35"/>
          <path d="M50 39 L50 25 M47 36 L45 27 M53 36 L55 27"/>
          <path d="M50 29 L50 18 M47 26 L46 19 M53 26 L54 19"/>
        </g>
      `,
      withered: `
        <ellipse cx="50" cy="90" rx="38" ry="5.5" fill="#5d4037" opacity="0.35"/>
        <!-- Dried shrivelled basal leaves -->
        <path d="M49 85 C34 88 18 85 15 78 C22 72 37 75 49 81 Z" fill="#795548"/>
        <path d="M51 85 C66 88 82 85 85 78 C78 72 63 75 51 81 Z" fill="#6d4c41"/>
        <path d="M48 86 C36 92 24 91 22 85 C28 80 40 81 48 84 Z" fill="#5d4037"/>
        <path d="M52 86 C64 92 76 91 78 85 C72 80 60 81 52 84 Z" fill="#8d6e63"/>
        <!-- Leaning dry bract spire -->
        <path d="M50 84 Q47 64 41 46 Q38 34 35 24" stroke="#6d4c41" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M40 76 C37 68 43 62 49 64 C54 66 56 74 51 79 C46 81 41 79 40 76 Z" fill="#a1887f" stroke="#6d4c41" stroke-width="0.45"/>
        <path d="M38 64 C36 56 42 50 47 53 C52 56 52 63 47 66 C42 67 39 66 38 64 Z" fill="#bcaaa4" stroke="#795548" stroke-width="0.45"/>
        <path d="M36 52 C35 45 40 40 45 43 C49 46 49 52 44 54 C40 55 37 54 36 52 Z" fill="#a1887f" stroke="#6d4c41" stroke-width="0.45"/>
        <path d="M35 40 C34 34 38 30 42 32 C45 35 45 40 41 42 C38 43 36 42 35 40 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="0.45"/>
        <path d="M34 30 C33 25 36 22 39 24 C41 26 41 30 38 31 C36 32 34 31 34 30 Z" fill="#795548"/>
        <!-- Fallen papery bract fragments -->
        <ellipse cx="64" cy="88" rx="4.5" ry="1.8" fill="#bcaaa4" opacity="0.8"/>
        <ellipse cx="30" cy="89" rx="3.8" ry="1.5" fill="#a1887f" opacity="0.75"/>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
