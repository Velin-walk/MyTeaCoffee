/**
 * Botanical Plant Definition: Rhododendron (लालीगुराँस)
 * National flower of Nepal (Rhododendron arboreum)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['rhododendron'] = {
    id: 4,
    slug: 'rhododendron',
    english: "Rhododendron",
    nepali: "लालीगुराँस",
    scientific: "Rhododendron arboreum",
    category: "Flower",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22V12M12 12C9 12 6 9.5 6 6c3.5 0 6 2.5 6 6zM12 14c3 0 6-2 6-5-3 0-6 2-6 5z"/><circle cx="12" cy="7" r="3" fill="#e53935" stroke="none"/><circle cx="7" cy="10" r="2.2" fill="#d32f2f" stroke="none"/><circle cx="17" cy="10" r="2.2" fill="#d32f2f" stroke="none"/></svg>',
    desc: "National flower of Nepal, a majestic Himalayan tree (Rhododendron arboreum) with a stout gnarled trunk, wide spreading boughs, dark leathery leaves, and glorious trusses of scarlet blossoms.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="88" rx="34" ry="6" fill="#3e2723" opacity="0.45"/>
        <!-- Young sapling tree stem with early branch nodes -->
        <path d="M50 88 Q49 76 50 66 Q48 58 46 50" stroke="#4e342e" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M50 68 Q54 62 58 56" stroke="#5d4037" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Deep green leathery lanceolate leaves -->
        <path d="M46 52 C38 50 32 42 34 34 C42 36 46 44 46 52 Z" fill="#1b5e20"/>
        <path d="M46 52 L36 38" stroke="#81c784" stroke-width="0.8"/>
        <path d="M46 50 C54 48 60 40 58 32 C50 34 46 42 46 50 Z" fill="#2e7d32"/>
        <path d="M46 50 L54 36" stroke="#81c784" stroke-width="0.8"/>
        <path d="M58 56 C66 54 70 46 68 40 C62 42 58 48 58 56 Z" fill="#2e7d32"/>
        <!-- Emergent scarlet terminal bud -->
        <path d="M46 50 C42 44 43 36 46 32 C49 36 50 44 46 50 Z" fill="#d32f2f"/>
        <circle cx="46" cy="31" r="2" fill="#e53935"/>
      `,
      growing: `
        <ellipse cx="50" cy="88" rx="38" ry="7" fill="#3e2723" opacity="0.45"/>
        <!-- Tree root buttress and sturdy trunk -->
        <path d="M46 88 Q48 80 48 70 M54 88 Q52 80 52 70" stroke="#3e2723" stroke-width="3" stroke-linecap="round"/>
        <path d="M50 88 Q49 74 49 60" stroke="#4e342e" stroke-width="5.5" stroke-linecap="round" fill="none"/>
        <!-- Multiple spreading boughs -->
        <path d="M49 64 Q38 58 28 50 M28 50 Q22 46 18 40" stroke="#4e342e" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 60 Q38 48 34 38 M34 38 Q32 30 28 24" stroke="#5d4037" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M49 56 Q50 42 49 32 M49 32 Q48 24 46 18" stroke="#5d4037" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <path d="M49 58 Q60 46 66 38 M66 38 Q70 30 74 24" stroke="#5d4037" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M49 64 Q62 58 72 50 M72 50 Q78 46 82 40" stroke="#4e342e" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <!-- Leathery foliage whorls on branch ends -->
        <ellipse cx="18" cy="40" rx="9" ry="5.5" fill="#1b5e20" transform="rotate(-30 18 40)"/>
        <ellipse cx="28" cy="24" rx="9" ry="5.5" fill="#2e7d32" transform="rotate(-40 28 24)"/>
        <ellipse cx="46" cy="18" rx="10" ry="5.5" fill="#1b5e20"/>
        <ellipse cx="74" cy="24" rx="9" ry="5.5" fill="#2e7d32" transform="rotate(40 74 24)"/>
        <ellipse cx="82" cy="40" rx="9" ry="5.5" fill="#1b5e20" transform="rotate(30 82 40)"/>
        <!-- Swelling scarlet-crimson buds on branches -->
        <circle cx="18" cy="36" r="4.5" fill="#c62828"/>
        <circle cx="28" cy="20" r="5" fill="#d32f2f"/>
        <circle cx="46" cy="14" r="6" fill="#b71c1c"/>
        <circle cx="46" cy="12" r="4.5" fill="#e53935"/>
        <circle cx="74" cy="20" r="5" fill="#d32f2f"/>
        <circle cx="82" cy="36" r="4.5" fill="#c62828"/>
      `,
      mature: `
        <ellipse cx="50" cy="89" rx="42" ry="7.5" fill="#3e2723" opacity="0.45"/>
        <!-- Buttressed root base firmly gripping Himalayan ground -->
        <path d="M42 89 Q46 82 48 72 M58 89 Q54 82 52 72 M50 89 L50 78" stroke="#3e2723" stroke-width="3.6" stroke-linecap="round"/>
        <!-- Gnarled tree trunk with rough bark fissures -->
        <path d="M50 89 Q49 76 48 64 Q47 54 49 46" stroke="#4e342e" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M49 86 Q48 74 48 64" stroke="#271815" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <path d="M51 84 Q50 72 50 62" stroke="#6d4c41" stroke-width="1.2" stroke-linecap="round" fill="none"/>
        <!-- ================= EXPANSIVE BRANCHING SCAFFOLD ================= -->
        <!-- Lower-left heavy spreading bough with sub-branches -->
        <path d="M48 64 Q36 58 24 52" stroke="#4e342e" stroke-width="4.2" stroke-linecap="round" fill="none"/>
        <path d="M24 52 Q18 48 14 44" stroke="#5d4037" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M28 54 Q24 44 20 38" stroke="#5d4037" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <!-- Upper-left bough spreading wide -->
        <path d="M48 52 Q38 42 30 32" stroke="#4e342e" stroke-width="3.8" stroke-linecap="round" fill="none"/>
        <path d="M30 32 Q24 26 22 20" stroke="#5d4037" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M34 36 Q34 26 36 20" stroke="#5d4037" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <!-- Central crown upright branch forks -->
        <path d="M49 46 Q49 34 48 24" stroke="#4e342e" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M48 28 Q44 20 42 14" stroke="#5d4037" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <path d="M49 26 Q54 18 56 12" stroke="#5d4037" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <!-- Upper-right bough spreading wide -->
        <path d="M50 52 Q62 42 70 32" stroke="#4e342e" stroke-width="3.8" stroke-linecap="round" fill="none"/>
        <path d="M70 32 Q76 26 78 20" stroke="#5d4037" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M66 36 Q66 26 64 20" stroke="#5d4037" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <!-- Lower-right heavy spreading bough with sub-branches -->
        <path d="M50 64 Q64 58 76 52" stroke="#4e342e" stroke-width="4.2" stroke-linecap="round" fill="none"/>
        <path d="M76 52 Q82 48 86 44" stroke="#5d4037" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M72 54 Q76 44 80 38" stroke="#5d4037" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <!-- ================= EVERGREEN LEAF ROSETTES BENEATH BLOSSOMS ================= -->
        <!-- Far-left foliage -->
        <ellipse cx="16" cy="46" rx="10" ry="5" fill="#1b5e20" transform="rotate(-25 16 46)"/>
        <ellipse cx="22" cy="40" rx="9" ry="4.5" fill="#2e7d32" transform="rotate(-40 22 40)"/>
        <!-- Upper-left foliage -->
        <ellipse cx="24" cy="24" rx="10" ry="5" fill="#1b5e20" transform="rotate(-35 24 24)"/>
        <ellipse cx="36" cy="22" rx="10" ry="5" fill="#2e7d32" transform="rotate(-15 36 22)"/>
        <!-- Central crown foliage -->
        <ellipse cx="44" cy="18" rx="10" ry="5" fill="#1b5e20" transform="rotate(-10 44 18)"/>
        <ellipse cx="54" cy="16" rx="10" ry="5" fill="#2e7d32" transform="rotate(10 54 16)"/>
        <!-- Upper-right foliage -->
        <ellipse cx="64" cy="22" rx="10" ry="5" fill="#2e7d32" transform="rotate(15 64 22)"/>
        <ellipse cx="76" cy="24" rx="10" ry="5" fill="#1b5e20" transform="rotate(35 76 24)"/>
        <!-- Far-right foliage -->
        <ellipse cx="78" cy="40" rx="9" ry="4.5" fill="#2e7d32" transform="rotate(40 78 40)"/>
        <ellipse cx="84" cy="46" rx="10" ry="5" fill="#1b5e20" transform="rotate(25 84 46)"/>
        <!-- ================= MAJESTIC SCARLET FLOWER TRUSSES (गुराँसका थुङ्गाहरू) ================= -->
        <!-- 1. Far-left lower truss (around x:18, y:42) -->
        <circle cx="18" cy="42" r="7.5" fill="#b71c1c"/>
        <circle cx="18" cy="41" r="6" fill="#c62828"/>
        <circle cx="15" cy="43" r="3.8" fill="#d32f2f"/>
        <circle cx="21" cy="43" r="3.8" fill="#d32f2f"/>
        <circle cx="18" cy="38" r="3.5" fill="#e53935"/>
        <circle cx="18" cy="36" r="1.1" fill="#ffd54f"/>
        <!-- 2. Mid-left branch truss (around x:24, y:34) -->
        <circle cx="24" cy="34" r="7" fill="#b71c1c"/>
        <circle cx="24" cy="33" r="5.5" fill="#c62828"/>
        <circle cx="22" cy="35" r="3.4" fill="#d32f2f"/>
        <circle cx="26" cy="35" r="3.4" fill="#e53935"/>
        <circle cx="24" cy="30" r="1" fill="#ffd54f"/>
        <!-- 3. Upper-left high truss (around x:32, y:20) -->
        <circle cx="32" cy="20" r="8.5" fill="#b71c1c"/>
        <circle cx="32" cy="19" r="7" fill="#c62828"/>
        <circle cx="28" cy="21" r="4.2" fill="#d32f2f"/>
        <circle cx="36" cy="21" r="4.2" fill="#d32f2f"/>
        <circle cx="32" cy="16" r="4" fill="#e53935"/>
        <circle cx="30" cy="15" r="1.2" fill="#ffd54f"/>
        <circle cx="34" cy="15" r="1.2" fill="#ffd54f"/>
        <!-- 4. Grand Central Crown Truss (x:49, y:12) -->
        <circle cx="49" cy="12" r="10.5" fill="#b71c1c"/>
        <circle cx="49" cy="11" r="8.5" fill="#c62828"/>
        <circle cx="44" cy="13" r="5.2" fill="#d32f2f"/>
        <circle cx="54" cy="13" r="5.2" fill="#d32f2f"/>
        <circle cx="49" cy="8" r="5" fill="#e53935"/>
        <path d="M43 10 Q49 5 55 10 Q49 14 43 10 Z" fill="#ef5350"/>
        <circle cx="46" cy="7" r="1.3" fill="#ffd54f"/>
        <circle cx="49" cy="5" r="1.4" fill="#ffd54f"/>
        <circle cx="52" cy="7" r="1.3" fill="#ffd54f"/>
        <!-- 5. Upper-right high truss (around x:66, y:20) -->
        <circle cx="66" cy="20" r="8.5" fill="#b71c1c"/>
        <circle cx="66" cy="19" r="7" fill="#c62828"/>
        <circle cx="62" cy="21" r="4.2" fill="#d32f2f"/>
        <circle cx="70" cy="21" r="4.2" fill="#d32f2f"/>
        <circle cx="66" cy="16" r="4" fill="#e53935"/>
        <circle cx="64" cy="15" r="1.2" fill="#ffd54f"/>
        <circle cx="68" cy="15" r="1.2" fill="#ffd54f"/>
        <!-- 6. Mid-right branch truss (around x:74, y:34) -->
        <circle cx="74" cy="34" r="7" fill="#b71c1c"/>
        <circle cx="74" cy="33" r="5.5" fill="#c62828"/>
        <circle cx="72" cy="35" r="3.4" fill="#d32f2f"/>
        <circle cx="76" cy="35" r="3.4" fill="#e53935"/>
        <circle cx="74" cy="30" r="1" fill="#ffd54f"/>
        <!-- 7. Far-right lower truss (around x:82, y:42) -->
        <circle cx="82" cy="42" r="7.5" fill="#b71c1c"/>
        <circle cx="82" cy="41" r="6" fill="#c62828"/>
        <circle cx="79" cy="43" r="3.8" fill="#d32f2f"/>
        <circle cx="85" cy="43" r="3.8" fill="#d32f2f"/>
        <circle cx="82" cy="38" r="3.5" fill="#e53935"/>
        <circle cx="82" cy="36" r="1.1" fill="#ffd54f"/>
      `,
      withered: `
        <ellipse cx="50" cy="89" rx="40" ry="7" fill="#6d4c41" opacity="0.35"/>
        <!-- Gnarled tree trunk & bare buttressed roots -->
        <path d="M44 89 Q46 82 48 72 M56 89 Q54 82 52 72" stroke="#4e342e" stroke-width="3" stroke-linecap="round"/>
        <path d="M50 89 Q49 76 48 64 Q47 54 49 46" stroke="#4e342e" stroke-width="6.5" stroke-linecap="round" fill="none"/>
        <!-- Exposed branching skeleton of the dormant tree -->
        <path d="M48 64 Q36 58 24 52 M24 52 Q18 48 14 44 M28 54 Q24 44 20 38" stroke="#5d4037" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M48 52 Q38 42 30 32 M30 32 Q24 26 22 20 M34 36 Q34 26 36 20" stroke="#5d4037" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M49 46 Q49 34 48 24 M48 28 Q44 20 42 14 M49 26 Q54 18 56 12" stroke="#5d4037" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <path d="M50 52 Q62 42 70 32 M70 32 Q76 26 78 20 M66 36 Q66 26 64 20" stroke="#5d4037" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M50 64 Q64 58 76 52 M76 52 Q82 48 86 44 M72 54 Q76 44 80 38" stroke="#5d4037" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Dried curled foliage -->
        <ellipse cx="18" cy="46" rx="6" ry="3" fill="#8d6e63" transform="rotate(-20 18 46)"/>
        <ellipse cx="32" cy="24" rx="6" ry="3" fill="#795548" transform="rotate(-30 32 24)"/>
        <ellipse cx="49" cy="18" rx="6" ry="3" fill="#8d6e63"/>
        <ellipse cx="68" cy="24" rx="6" ry="3" fill="#795548" transform="rotate(30 68 24)"/>
        <ellipse cx="82" cy="46" rx="6" ry="3" fill="#8d6e63" transform="rotate(20 82 46)"/>
        <!-- Withered flower husks / capsules -->
        <circle cx="18" cy="42" r="3.5" fill="#5d4037"/>
        <circle cx="32" cy="20" r="4" fill="#6d4c41"/>
        <circle cx="49" cy="12" r="5" fill="#5d4037"/>
        <circle cx="66" cy="20" r="4" fill="#6d4c41"/>
        <circle cx="82" cy="42" r="3.5" fill="#5d4037"/>
        <!-- Fallen petals on the mountain soil -->
        <ellipse cx="34" cy="88" rx="4" ry="1.6" fill="#8d6e63"/>
        <ellipse cx="62" cy="88" rx="4.5" ry="1.8" fill="#795548"/>
        <ellipse cx="46" cy="89" rx="3" ry="1.2" fill="#b71c1c" opacity="0.6"/>
        <ellipse cx="56" cy="89" rx="2.8" ry="1.2" fill="#c62828" opacity="0.6"/>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
