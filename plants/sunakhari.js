/**
 * Botanical Plant Definition: Sunakhari orchid (सुनखरी)
 * Golden orchid (Dendrobium densiflorum)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['sunakhari'] = {
    id: 36,
    slug: 'sunakhari',
    english: "Sunakhari orchid",
    nepali: "सुनखरी",
    scientific: "Dendrobium densiflorum",
    category: "Flower",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3c-2 3-2 6 0 8 2-2 2-5 0-8z"/><path d="M5 9c3-1 6 1 7 3-3 2-6 0-7-3z"/><path d="M19 9c-3-1-6 1-7 3 3 2 6 0 7-3z"/><path d="M8 15c1.5 4 6.5 4 8 0-2.5-1.5-5.5-1.5-8 0z"/></svg>',
    desc: "Golden orchid of the mid-hills with arching sprays of fragrant golden-yellow blossoms, each with a fringed amber lip, rising above strap-like green leaves.",
    stages: {
      sprout: `
        <ellipse cx="50" cy="88" rx="30" ry="5" fill="#6d4c41" opacity="0.3"/>
        <ellipse cx="50" cy="87" rx="22" ry="3.5" fill="#33691e" opacity="0.25"/>
        <path d="M50 88 Q50 74 49 66" stroke="#558b2f" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M49 68 C44 62 42 54 45 48 C49 54 50 62 49 68 Z" fill="#7cb342"/>
        <path d="M50 70 C54 66 56 60 54 54 C50 60 49 66 50 70 Z" fill="#9ccc65"/>
      `,
      growing: `
        <ellipse cx="50" cy="88" rx="34" ry="5" fill="#6d4c41" opacity="0.3"/>
        <!-- Young pseudobulb -->
        <ellipse cx="50" cy="83" rx="5.5" ry="8" fill="#aed581"/>
        <ellipse cx="50" cy="83" rx="5.5" ry="8" fill="none" stroke="#8fb573" stroke-width="0.7"/>
        <!-- Arching strap leaves -->
        <path d="M50 86 C40 80 32 68 31 54 C38 66 46 77 53 84 Z" fill="#388e3c"/>
        <path d="M52 86 C62 80 70 68 71 54 C64 66 56 77 49 84 Z" fill="#2e7d32"/>
        <path d="M51 86 C48 70 48 54 51 40 C54 54 54 70 53 86 Z" fill="#43a047"/>
        <path d="M51 82 C49 68 49 54 51 44" stroke="#a5d6a7" stroke-width="0.7" fill="none" opacity="0.6"/>
        <!-- Emerging flower spike with closed bud -->
        <path d="M54 86 Q66 74 70 62" stroke="#689f38" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M70 62 C67 58 67 52 70 48 C73 52 73 58 70 62 Z" fill="#fbc02d"/>
        <path d="M70 62 C68.5 58 68.5 53 70 50 C71.5 53 71.5 58 70 62 Z" fill="#fdd835"/>
      `,
      mature: `
        <ellipse cx="50" cy="89" rx="38" ry="5.5" fill="#6d4c41" opacity="0.3"/>
        <!-- Pseudobulbs -->
        <ellipse cx="44" cy="84" rx="5.5" ry="8" fill="#c5e1a5"/>
        <ellipse cx="44" cy="84" rx="5.5" ry="8" fill="none" stroke="#9cc184" stroke-width="0.7"/>
        <ellipse cx="57" cy="85" rx="5" ry="7" fill="#aed581"/>
        <ellipse cx="57" cy="85" rx="5" ry="7" fill="none" stroke="#8fb573" stroke-width="0.7"/>
        <!-- Arching strap leaves with midribs -->
        <path d="M46 86 C34 80 24 66 23 50 C31 64 41 76 49 84 Z" fill="#2e7d32"/>
        <path d="M48 86 C39 78 33 64 34 48 C41 62 48 74 52 84 Z" fill="#388e3c"/>
        <path d="M51 86 C48 68 48 50 51 34 C55 50 55 68 54 86 Z" fill="#43a047"/>
        <path d="M54 86 C63 78 69 64 68 48 C61 62 54 74 50 84 Z" fill="#2e7d32"/>
        <path d="M56 86 C68 80 78 66 79 52 C71 64 61 76 53 84 Z" fill="#388e3c"/>
        <path d="M51 82 C49 66 49 52 51 38" stroke="#a5d6a7" stroke-width="0.7" fill="none" opacity="0.6"/>
        <path d="M40 78 C36 70 33 62 33 54" stroke="#a5d6a7" stroke-width="0.6" fill="none" opacity="0.5"/>
        <path d="M62 78 C66 70 69 62 69 54" stroke="#a5d6a7" stroke-width="0.6" fill="none" opacity="0.5"/>
        <!-- Arching flower spike -->
        <path d="M56 84 C68 74 76 60 76 46 C76 38 72 32 64 30 C58 28.5 53 29 50 31" stroke="#689f38" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <!-- Golden blossoms along the spray -->
        <g transform="translate(76 52) rotate(150)">
          <ellipse cx="0" cy="-5.5" rx="2.1" ry="4.8" fill="#fdd835"/>
          <ellipse cx="-4.6" cy="-3.4" rx="2.3" ry="4.2" fill="#ffeb3b" transform="rotate(-38 -4.6 -3.4)"/>
          <ellipse cx="4.6" cy="-3.4" rx="2.3" ry="4.2" fill="#ffeb3b" transform="rotate(38 4.6 -3.4)"/>
          <ellipse cx="-3.4" cy="2.6" rx="1.8" ry="3.6" fill="#fbc02d" transform="rotate(-140 -3.4 2.6)"/>
          <ellipse cx="3.4" cy="2.6" rx="1.8" ry="3.6" fill="#fbc02d" transform="rotate(140 3.4 2.6)"/>
          <path d="M-2.6 1.5 Q0 6.5 2.6 1.5 Q1.4 -0.6 0 -0.6 Q-1.4 -0.6 -2.6 1.5 Z" fill="#f57f17"/>
          <circle cx="0" cy="1.2" r="1" fill="#e65100"/>
        </g>
        <g transform="translate(74.5 44) rotate(140) scale(0.95)">
          <ellipse cx="0" cy="-5.5" rx="2.1" ry="4.8" fill="#fdd835"/>
          <ellipse cx="-4.6" cy="-3.4" rx="2.3" ry="4.2" fill="#ffeb3b" transform="rotate(-38 -4.6 -3.4)"/>
          <ellipse cx="4.6" cy="-3.4" rx="2.3" ry="4.2" fill="#ffeb3b" transform="rotate(38 4.6 -3.4)"/>
          <ellipse cx="-3.4" cy="2.6" rx="1.8" ry="3.6" fill="#fbc02d" transform="rotate(-140 -3.4 2.6)"/>
          <ellipse cx="3.4" cy="2.6" rx="1.8" ry="3.6" fill="#fbc02d" transform="rotate(140 3.4 2.6)"/>
          <path d="M-2.6 1.5 Q0 6.5 2.6 1.5 Q1.4 -0.6 0 -0.6 Q-1.4 -0.6 -2.6 1.5 Z" fill="#f57f17"/>
          <circle cx="0" cy="1.2" r="1" fill="#e65100"/>
        </g>
        <g transform="translate(70 37) rotate(120)">
          <ellipse cx="0" cy="-5.5" rx="2.1" ry="4.8" fill="#fdd835"/>
          <ellipse cx="-4.6" cy="-3.4" rx="2.3" ry="4.2" fill="#ffeb3b" transform="rotate(-38 -4.6 -3.4)"/>
          <ellipse cx="4.6" cy="-3.4" rx="2.3" ry="4.2" fill="#ffeb3b" transform="rotate(38 4.6 -3.4)"/>
          <ellipse cx="-3.4" cy="2.6" rx="1.8" ry="3.6" fill="#fbc02d" transform="rotate(-140 -3.4 2.6)"/>
          <ellipse cx="3.4" cy="2.6" rx="1.8" ry="3.6" fill="#fbc02d" transform="rotate(140 3.4 2.6)"/>
          <path d="M-2.6 1.5 Q0 6.5 2.6 1.5 Q1.4 -0.6 0 -0.6 Q-1.4 -0.6 -2.6 1.5 Z" fill="#f57f17"/>
          <circle cx="0" cy="1.2" r="1" fill="#e65100"/>
        </g>
        <g transform="translate(64 32) rotate(100) scale(0.95)">
          <ellipse cx="0" cy="-5.5" rx="2.1" ry="4.8" fill="#fdd835"/>
          <ellipse cx="-4.6" cy="-3.4" rx="2.3" ry="4.2" fill="#ffeb3b" transform="rotate(-38 -4.6 -3.4)"/>
          <ellipse cx="4.6" cy="-3.4" rx="2.3" ry="4.2" fill="#ffeb3b" transform="rotate(38 4.6 -3.4)"/>
          <ellipse cx="-3.4" cy="2.6" rx="1.8" ry="3.6" fill="#fbc02d" transform="rotate(-140 -3.4 2.6)"/>
          <ellipse cx="3.4" cy="2.6" rx="1.8" ry="3.6" fill="#fbc02d" transform="rotate(140 3.4 2.6)"/>
          <path d="M-2.6 1.5 Q0 6.5 2.6 1.5 Q1.4 -0.6 0 -0.6 Q-1.4 -0.6 -2.6 1.5 Z" fill="#f57f17"/>
          <circle cx="0" cy="1.2" r="1" fill="#e65100"/>
        </g>
        <g transform="translate(57 30) rotate(80) scale(0.9)">
          <ellipse cx="0" cy="-5.5" rx="2.1" ry="4.8" fill="#fdd835"/>
          <ellipse cx="-4.6" cy="-3.4" rx="2.3" ry="4.2" fill="#ffeb3b" transform="rotate(-38 -4.6 -3.4)"/>
          <ellipse cx="4.6" cy="-3.4" rx="2.3" ry="4.2" fill="#ffeb3b" transform="rotate(38 4.6 -3.4)"/>
          <ellipse cx="-3.4" cy="2.6" rx="1.8" ry="3.6" fill="#fbc02d" transform="rotate(-140 -3.4 2.6)"/>
          <ellipse cx="3.4" cy="2.6" rx="1.8" ry="3.6" fill="#fbc02d" transform="rotate(140 3.4 2.6)"/>
          <path d="M-2.6 1.5 Q0 6.5 2.6 1.5 Q1.4 -0.6 0 -0.6 Q-1.4 -0.6 -2.6 1.5 Z" fill="#f57f17"/>
          <circle cx="0" cy="1.2" r="1" fill="#e65100"/>
        </g>
        <!-- Unopened buds at the spray tip -->
        <path d="M50 31 C47.5 28 47.5 24 50 21.5 C52.5 24 52.5 28 50 31 Z" fill="#fbc02d" transform="rotate(60 50 31)"/>
        <path d="M45 34 C42.8 31.4 42.8 27.8 45 25.5 C47.2 27.8 47.2 31.4 45 34 Z" fill="#fdd835" transform="rotate(75 45 34)"/>
      `,
      withered: `
        <ellipse cx="50" cy="89" rx="34" ry="5" fill="#6d4c41" opacity="0.3"/>
        <!-- Shrivelled pseudobulb -->
        <ellipse cx="46" cy="85" rx="5" ry="7" fill="#a1887f"/>
        <!-- Drooping dried leaves -->
        <path d="M48 86 C38 82 30 74 28 64 C34 72 42 78 50 82 Z" fill="#8d6e63"/>
        <path d="M52 86 C44 78 40 66 42 54 C46 64 50 74 54 82 Z" fill="#a1887f"/>
        <path d="M55 86 C64 82 70 74 72 64 C66 72 60 78 54 82 Z" fill="#8d6e63"/>
        <!-- Bare dried spike -->
        <path d="M56 84 C68 76 74 64 74 52 C74 46 71 42 66 40" stroke="#795548" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Withered flower husks -->
        <path d="M74 52 C71 49 71 45 74 43 C77 45 77 49 74 52 Z" fill="#6d4c41"/>
        <path d="M70 44 C67 41 67 37 70 35 C73 37 73 41 70 44 Z" fill="#5d4037"/>
        <path d="M64 39 C61 36 61 32 64 30 C67 32 67 36 64 39 Z" fill="#6d4c41"/>
        <!-- Fallen petals -->
        <ellipse cx="60" cy="87" rx="3" ry="1.4" fill="#a1887f"/>
        <ellipse cx="40" cy="88" rx="2.6" ry="1.2" fill="#8d6e63"/>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
