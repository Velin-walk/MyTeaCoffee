/**
 * Botanical Plant Definition: Sunpati (सुनपाती)
 * Dwarf rhododendron (Rhododendron anthopogon)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['sunpati'] = {
    id: 37,
    slug: 'sunpati',
    english: "Sunpati (dwarf rhododendron)",
    nepali: "सुनपाती",
    scientific: "Rhododendron anthopogon",
    category: "Flower",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="2.4" fill="#ffd54f" stroke="#f57f17" stroke-width="0.8"/><circle cx="8" cy="10" r="2.4" fill="#ffe082" stroke="#f57f17" stroke-width="0.8"/><circle cx="16" cy="10" r="2.4" fill="#ffe082" stroke="#f57f17" stroke-width="0.8"/><circle cx="10" cy="13" r="2.4" fill="#ffd54f" stroke="#f57f17" stroke-width="0.8"/><circle cx="14" cy="13" r="2.4" fill="#ffd54f" stroke="#f57f17" stroke-width="0.8"/><path d="M12 15v6M12 18l-3 2M12 18l3 2" stroke="currentColor" stroke-width="2"/></svg>',
    desc: "Aromatic dwarf rhododendron of the high Himalaya (Rhododendron anthopogon), a low compact alpine shrub with golden-green scented leaves and radiant rounded clusters of golden-yellow blossoms.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="88" rx="28" ry="5" fill="#5d4037" opacity="0.35"/>
        <ellipse cx="50" cy="87" rx="20" ry="3.5" fill="#795548" opacity="0.25"/>
        <path d="M50 88 Q50 78 50 72" stroke="#6d4c41" stroke-width="2" stroke-linecap="round" fill="none"/>
        <ellipse cx="46" cy="74" rx="4" ry="2.6" fill="#7cb342" transform="rotate(-30 46 74)"/>
        <ellipse cx="54" cy="72" rx="4" ry="2.6" fill="#8bc34a" transform="rotate(30 54 72)"/>
        <ellipse cx="50" cy="67" rx="4.5" ry="3" fill="#c0ca33"/>
        <circle cx="50" cy="64" r="2" fill="#ffd54f"/>
      `,
      growing: `
        <ellipse cx="50" cy="88" rx="32" ry="5" fill="#5d4037" opacity="0.35"/>
        <!-- Low woody branching base of alpine shrub -->
        <path d="M50 88 Q50 80 49 74 M49 78 Q44 74 41 70 M49 76 Q54 72 57 68" stroke="#6d4c41" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <!-- Small leathery oval golden-green leaves -->
        <ellipse cx="40" cy="68" rx="5" ry="3.2" fill="#33691e" transform="rotate(-35 40 68)"/>
        <ellipse cx="45" cy="74" rx="5" ry="3.2" fill="#558b2f" transform="rotate(-15 45 74)"/>
        <ellipse cx="58" cy="66" rx="5" ry="3.2" fill="#388e3c" transform="rotate(35 58 66)"/>
        <ellipse cx="54" cy="73" rx="5" ry="3.2" fill="#689f38" transform="rotate(15 54 73)"/>
        <ellipse cx="49" cy="70" rx="5.5" ry="3.4" fill="#558b2f" transform="rotate(-5 49 70)"/>
        <ellipse cx="43" cy="63" rx="4.5" ry="3" fill="#689f38" transform="rotate(-25 43 63)"/>
        <ellipse cx="55" cy="61" rx="4.5" ry="3" fill="#558b2f" transform="rotate(25 55 61)"/>
        <!-- Tight golden bud cluster at the crown -->
        <circle cx="46" cy="56" r="2.4" fill="#ffe082"/>
        <circle cx="50" cy="54" r="2.6" fill="#ffd54f"/>
        <circle cx="54" cy="56" r="2.4" fill="#ffe082"/>
        <circle cx="48" cy="58" r="2.2" fill="#ffca28"/>
        <circle cx="52" cy="58" r="2.2" fill="#ffca28"/>
        <circle cx="50" cy="56" r="1.1" fill="#f57f17"/>
      `,
      mature: `
        <ellipse cx="50" cy="89" rx="40" ry="6" fill="#5d4037" opacity="0.35"/>
        <!-- Low compact woody stems of dwarf alpine shrub -->
        <path d="M50 89 Q49 80 46 74 M50 89 Q52 80 55 74 M50 89 Q50 82 50 78 M46 76 Q40 72 36 68 M55 76 Q61 72 65 68" stroke="#6d4c41" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <!-- Dense small leathery golden-green leaves -->
        <ellipse cx="36" cy="66" rx="5" ry="3.2" fill="#2e7d32" transform="rotate(-35 36 66)"/>
        <ellipse cx="42" cy="72" rx="5.5" ry="3.4" fill="#33691e" transform="rotate(-18 42 72)"/>
        <ellipse cx="49" cy="76" rx="5.5" ry="3.4" fill="#2e7d32" transform="rotate(-5 49 76)"/>
        <ellipse cx="58" cy="72" rx="5.5" ry="3.4" fill="#558b2f" transform="rotate(18 58 72)"/>
        <ellipse cx="64" cy="66" rx="5" ry="3.2" fill="#33691e" transform="rotate(35 64 66)"/>
        <ellipse cx="33" cy="72" rx="4.5" ry="3" fill="#689f38" transform="rotate(-30 33 72)"/>
        <ellipse cx="67" cy="72" rx="4.5" ry="3" fill="#2e7d32" transform="rotate(30 67 72)"/>
        <ellipse cx="44" cy="66" rx="5" ry="3.2" fill="#558b2f" transform="rotate(-20 44 66)"/>
        <ellipse cx="56" cy="66" rx="5" ry="3.2" fill="#2e7d32" transform="rotate(20 56 66)"/>
        <ellipse cx="50" cy="70" rx="5.5" ry="3.4" fill="#33691e"/>
        <!-- Golden-brown underside leaf accents (anthopogon characteristic) -->
        <ellipse cx="39" cy="68" rx="3.5" ry="1.8" fill="#8d6e63" opacity="0.4" transform="rotate(-30 39 68)"/>
        <ellipse cx="61" cy="68" rx="3.5" ry="1.8" fill="#8d6e63" opacity="0.4" transform="rotate(30 61 68)"/>
        <!-- ================= RADIANT GOLDEN BLOSSOM CLUSTERS ================= -->
        <!-- 1. Rounded cluster of golden blossoms, left crown -->
        <circle cx="30" cy="58" r="3.2" fill="#ffd54f"/>
        <circle cx="36" cy="55" r="3.4" fill="#ffe082"/>
        <circle cx="41" cy="59" r="3.2" fill="#ffca28"/>
        <circle cx="33" cy="62" r="3" fill="#ffd54f"/>
        <circle cx="38" cy="63" r="3" fill="#fff59d"/>
        <circle cx="36" cy="58" r="1.2" fill="#f57f17"/>
        <circle cx="33" cy="59" r="1" fill="#e65100"/>
        <circle cx="39" cy="60" r="1" fill="#f57f17"/>
        <circle cx="35" cy="54" r="0.8" fill="#fff9c4"/>
        <!-- 2. Dense central cluster of golden blossoms, top crown -->
        <circle cx="45" cy="48" r="3.4" fill="#ffe082"/>
        <circle cx="51" cy="46" r="3.6" fill="#fff59d"/>
        <circle cx="57" cy="49" r="3.4" fill="#ffe082"/>
        <circle cx="43" cy="53" r="3.2" fill="#ffd54f"/>
        <circle cx="50" cy="52" r="3.6" fill="#ffca28"/>
        <circle cx="56" cy="54" r="3.2" fill="#ffd54f"/>
        <circle cx="48" cy="56" r="3" fill="#ffca28"/>
        <circle cx="51" cy="49" r="1.3" fill="#f57f17"/>
        <circle cx="46" cy="50" r="1.1" fill="#e65100"/>
        <circle cx="55" cy="51" r="1.1" fill="#e65100"/>
        <circle cx="50" cy="54" r="1.1" fill="#f57f17"/>
        <circle cx="51" cy="45" r="0.9" fill="#fff9c4"/>
        <circle cx="47" cy="47" r="0.8" fill="#fff9c4"/>
        <!-- 3. Rounded cluster of golden blossoms, right crown -->
        <circle cx="63" cy="58" r="3.2" fill="#ffd54f"/>
        <circle cx="69" cy="56" r="3.4" fill="#ffe082"/>
        <circle cx="73" cy="60" r="3.2" fill="#ffca28"/>
        <circle cx="66" cy="62" r="3" fill="#fff59d"/>
        <circle cx="71" cy="63" r="3" fill="#ffd54f"/>
        <circle cx="69" cy="59" r="1.2" fill="#f57f17"/>
        <circle cx="65" cy="60" r="1" fill="#e65100"/>
        <circle cx="72" cy="61" r="1" fill="#f57f17"/>
        <circle cx="70" cy="55" r="0.8" fill="#fff9c4"/>
      `,
      withered: `
        <ellipse cx="50" cy="89" rx="34" ry="5" fill="#5d4037" opacity="0.35"/>
        <!-- Bare woody dwarf stems -->
        <path d="M50 89 Q49 80 46 74 M50 89 Q52 80 55 74 M50 89 Q50 82 50 78 M46 76 Q40 72 36 68 M55 76 Q61 72 65 68" stroke="#5d4037" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <!-- Dried curled leaves with golden-russet tint -->
        <ellipse cx="38" cy="70" rx="4.5" ry="2.8" fill="#8d6e63" transform="rotate(-40 38 70)"/>
        <ellipse cx="44" cy="75" rx="4.5" ry="2.8" fill="#a1887f" transform="rotate(-15 44 75)"/>
        <ellipse cx="57" cy="74" rx="4.5" ry="2.8" fill="#8d6e63" transform="rotate(20 57 74)"/>
        <ellipse cx="62" cy="70" rx="4.5" ry="2.8" fill="#795548" transform="rotate(40 62 70)"/>
        <ellipse cx="50" cy="76" rx="4.5" ry="2.8" fill="#a1887f"/>
        <!-- Dried golden-brown flower remnants -->
        <circle cx="36" cy="64" r="2.4" fill="#8d6e63"/>
        <circle cx="39" cy="61" r="2.2" fill="#6d4c41"/>
        <circle cx="64" cy="64" r="2.4" fill="#8d6e63"/>
        <circle cx="61" cy="61" r="2.2" fill="#6d4c41"/>
        <circle cx="50" cy="62" r="2.4" fill="#8d6e63"/>
        <circle cx="47" cy="59" r="2" fill="#6d4c41"/>
        <!-- Fallen golden-amber petals on soil -->
        <ellipse cx="40" cy="87" rx="3" ry="1.4" fill="#ffb300" opacity="0.7"/>
        <ellipse cx="60" cy="88" rx="2.6" ry="1.2" fill="#ffa000" opacity="0.6"/>
        <ellipse cx="52" cy="88" rx="2.2" ry="1" fill="#8d6e63"/>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
