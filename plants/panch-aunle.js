/**
 * Botanical Plant Definition: Panch Aunle (पाँच औंले)
 * Protected Himalayan terrestrial alpine orchid (Dactylorhiza hatagirea)
 */
(function (root) {
  root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
  root.NEPAL_PLANTS_REGISTRY['panch-aunle'] = {
    id: 43,
    slug: 'panch-aunle',
    english: "Panch Aunle (Himalayan Marsh Orchid)",
    nepali: "पाँच औंले",
    scientific: "Dactylorhiza hatagirea",
    category: "Herb",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15.5V9.5"/><path d="M12 9.5c-1.7-.9-2.3-2.9-1.4-4.7.5-1.1 1.4-2.1 1.4-3 0 .9.9 1.9 1.4 3 .9 1.8.3 3.8-1.4 4.7z" fill="#ab47bc" stroke="currentColor"/><path d="M12 14.5c-3 0-5-1.2-6-3 2.3-.4 4.5.5 6 2.2M12 14.5c3 0 5-1.2 6-3-2.3-.4-4.5.5-6 2.2" fill="#43a047" stroke="currentColor"/><path d="M4 15.5h16" stroke="#6d4c41" stroke-width="1.3"/><path d="M10.5 16.5Q7 18 5.5 20.5M11.2 16.8Q9.5 19.5 9 21.8M12 16.8V22.5M12.8 16.8Q14.5 19.5 15 21.8M13.5 16.5Q17 18 18.5 20.5" stroke="#d4b07f" stroke-width="1.6"/></svg>',
    desc: "Protected high-altitude Himalayan terrestrial orchid (Dactylorhiza hatagirea, literally 'Five Fingers'), famed for its palmate five-fingered underground tuberous root and dense upright spikes of magenta-purple speckled blossoms framed by slender leafy bracts.",
    stages: {
      sprout: `
        <!-- Underground alpine soil cutaway -->
        <path d="M22 69 Q50 67 78 69 C80 81 70 92 50 93 C30 92 20 81 22 69 Z" fill="#4e342e" opacity="0.88"/>
        <path d="M26 70 Q50 68 74 70 C74 79 65 89 50 90 C35 89 26 79 26 70 Z" fill="#3e2723" opacity="0.72"/>
        <path d="M20 69 Q50 66.5 80 69" stroke="#689f38" stroke-width="2" stroke-linecap="round" fill="none"/>

        <!-- Young underground 5-fingered palmate tuber root -->
        <path d="M47 67 Q50 69 53 67 L52 72 L48 72 Z" fill="#795548"/>
        <path d="M48 72 C43 72 37 75 34 79 C36 80 41 78 46 75 C44 79 42 83 41 86 C43 87 46 83 48 77 C48.5 82 48.5 87 49.5 90 C51 90 51.5 83 52 77 C54 81 56 85 57.5 86 C59 85 57 79 54 75 C59 77 63 80 65 81 C66 79 61 73 52 72 Z" fill="#dbb47c" stroke="#9e7442" stroke-width="0.65" stroke-linejoin="round"/>
        <path d="M49.5 74 L49.5 88 M46.5 74 L36 78 M53.5 74 L63 79" stroke="#f0d5a8" stroke-width="0.6" stroke-linecap="round" opacity="0.7" fill="none"/>

        <!-- Fresh bright-green sheathing shoots above ground -->
        <path d="M50 68 C42 65 34 57 32 48 C39 51 46 59 50 67 Z" fill="#43a047"/>
        <path d="M50 68 C58 65 66 57 68 48 C61 51 54 59 50 67 Z" fill="#66bb6a"/>
        <path d="M50 68 C47 59 47 47 50 39 C53 47 53 59 50 68 Z" fill="#7cb342"/>
        <path d="M49 65 L35 51 M51 65 L65 51 M50 66 L50 43" stroke="#c5e1a5" stroke-width="0.65" fill="none" opacity="0.75"/>
      `,
      growing: `
        <!-- Underground alpine soil cutaway -->
        <path d="M18 69 Q50 66.5 82 69 C84 84 72 95 50 96 C28 95 16 84 18 69 Z" fill="#4e342e" opacity="0.9"/>
        <path d="M23 70 Q50 68 77 70 C77 82 67 92 50 93 C33 92 23 82 23 70 Z" fill="#3e2723" opacity="0.75"/>
        <path d="M16 69 Q50 66 84 69" stroke="#558b2f" stroke-width="2.2" stroke-linecap="round" fill="none"/>

        <!-- Underground 5-fingered palmate tuberous root -->
        <path d="M47 67 L47.5 72.5 Q50 74 52.5 72.5 L53 67 Z" fill="#6d4c41"/>
        <path d="M47.5 70 L42 69 M52.5 70.5 L58 69.5" stroke="#c8a06d" stroke-width="1.2" stroke-linecap="round" fill="none"/>
        <path d="M47.5 72.5 C41 73 33 77 29 82 C31 84 37 80 44 76 C41 81 38 86 37 89 C39.5 90 43 85 47 78 C48 84 48 90 49 94 C51 94 52 85 52.5 78 C55 83 57 88 59 90 C61 89 58 82 55 76 C61 79 66 83 68 86 C70 84 65 76 52.5 72.5 Z" fill="#ddb67e" stroke="#966c3b" stroke-width="0.7" stroke-linejoin="round"/>
        <g stroke="#f3dab0" stroke-width="0.7" stroke-linecap="round" fill="none" opacity="0.75">
          <path d="M46 74 L31 81"/>
          <path d="M49.5 75 L49.5 92"/>
          <path d="M54 74 L66 84"/>
        </g>

        <!-- Clasping green stem & broad sheathing leaves above ground -->
        <path d="M48.5 68 L48.5 34 L51.5 34 L51.5 68 Z" fill="#689f38"/>
        <path d="M49 66 C36 67 22 62 18 52 C27 49 40 55 49 63 Z" fill="#2e7d32"/>
        <path d="M51 66 C64 67 78 62 82 52 C73 49 60 55 51 63 Z" fill="#388e3c"/>
        <path d="M49 58 C38 56 28 48 26 39 C34 39 44 46 49 54 Z" fill="#43a047"/>
        <path d="M51 54 C62 52 72 44 74 35 C66 35 56 42 51 50 Z" fill="#66bb6a"/>
        <path d="M49 46 C43 41 39 33 41 26 C46 30 49 37 50 43 Z" fill="#7cb342"/>
        <g stroke="#c5e1a5" stroke-width="0.65" fill="none" opacity="0.75">
          <path d="M47 64 L21 53"/>
          <path d="M53 64 L79 53"/>
          <path d="M47 55 L28 41"/>
          <path d="M53 51 L72 37"/>
        </g>

        <!-- Emerging bracted flower bud spike -->
        <path d="M47 35 L43 26 M53 33 L57 24" stroke="#558b2f" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M46 34 C44 25 46 18 50 13 C54 18 56 25 54 34 Z" fill="#9c27b0" stroke="#7b1fa2" stroke-width="0.5"/>
        <path d="M47 29 C48 23 49 18 50 15 C51 18 52 23 53 29 Z" fill="#ce93d8" opacity="0.75"/>
        <path d="M46 28 L42 22 M54 26 L58 20 M50 18 L47 12" stroke="#689f38" stroke-width="1" stroke-linecap="round"/>
      `,
      mature: `
        <!-- ================= UNDERGROUND ALPINE SOIL CROSS-SECTION ================= -->
        <path d="M16 68 Q50 65.5 84 68 C87 84 74 96.5 50 97.5 C26 96.5 13 84 16 68 Z" fill="#4e342e" opacity="0.92"/>
        <path d="M21 69.5 Q50 67.5 79 69.5 C80 83 68 94 50 95 C32 94 20 83 21 69.5 Z" fill="#3e2723" opacity="0.8"/>
        <!-- Subtle soil pebbles/specks -->
        <g fill="#6d4c41" opacity="0.55">
          <circle cx="28" cy="76" r="1.1"/><circle cx="71" cy="75" r="1.2"/>
          <circle cx="33" cy="87" r="0.9"/><circle cx="64" cy="90" r="1"/>
          <circle cx="43" cy="91" r="0.8"/><circle cx="58" cy="77" r="0.8"/>
        </g>
        <!-- Mossy grass ground line separating stem & underground root -->
        <path d="M14 68 Q50 65 86 68" stroke="#558b2f" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <path d="M17 67.6 Q50 64.6 83 67.6" stroke="#7cb342" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.8"/>

        <!-- ================= ICONIC 5-FINGERED UNDERGROUND TUBER ROOT (पाँच औंले) ================= -->
        <!-- Fibrous stem sheath collar at soil entry (matches reference photo) -->
        <path d="M46.5 65.5 L47 72 Q50 73.5 53 72 L53.5 65.5 Z" fill="#6d4c41" stroke="#4e342e" stroke-width="0.5"/>
        <path d="M48 66 L48 71 M51.5 66 L51.5 71" stroke="#8d6e63" stroke-width="0.65"/>
        <!-- Upper collar lateral rootlets -->
        <path d="M47 69 Q42 68.5 39 67.5 M53 69.5 Q59 68.5 63 67.8 M46.5 71 Q45 67 45.5 64" stroke="#cfa56e" stroke-width="1.3" stroke-linecap="round" fill="none"/>

        <!-- Palmate 5-fingered fleshy tuberous root -->
        <path d="
          M47 71.5
          C43 72.5 36 76 28.5 79.5
          C27 80.2 27.2 82.2 29.2 82.2
          C34.5 81.8 40 78.8 44 76
          C40.5 80 37 84.5 34.5 87
          C33.5 88 35 89.6 36.8 88.8
          C40.5 86.8 43.5 82 47 77.5
          C47.5 83 47 90 46.8 94.8
          C46.8 96.4 49.4 96.5 49.8 94.8
          C50.6 90 51.2 83 52 77.5
          C54.5 82 56.5 86.5 58 89.2
          C59.2 90.2 61 89.2 60.4 87.6
          C59.2 84.2 57 79.5 54.5 76
          C60.5 78.2 66.5 83.2 69.2 89.8
          C70 91.2 72 90.4 71.6 88.6
          C70 81.2 63.5 74.8 53 71.5
          Z"
          fill="#dfb980" stroke="#966c3b" stroke-width="0.75" stroke-linejoin="round"/>
        <!-- Dimensional highlights & earthy sandy specks on the 5 fingers -->
        <g stroke="#f5deb3" stroke-width="0.85" stroke-linecap="round" fill="none" opacity="0.78">
          <path d="M45 73.5 Q36 77 30 80.5"/>
          <path d="M45.5 76 Q40.5 82 36.5 87"/>
          <path d="M49.2 75 Q48.8 85 48.3 94"/>
          <path d="M53.2 75.5 Q56.5 82 59 87.5"/>
          <path d="M55 73.5 Q64 78 69.5 87.5"/>
        </g>
        <g fill="#795548" opacity="0.45">
          <circle cx="48" cy="76" r="0.55"/><circle cx="51" cy="74" r="0.55"/>
          <circle cx="38" cy="77" r="0.5"/><circle cx="48.5" cy="84" r="0.5"/>
          <circle cx="62" cy="79" r="0.55"/><circle cx="67" cy="84" r="0.5"/>
        </g>

        <!-- ================= ABOVE-GROUND GREEN STEM & SHEATHING LEAVES ================= -->
        <path d="M48 68 L48.5 26 L51.5 26 L52 68 Z" fill="#7cb342"/>
        <path d="M49.5 67 L49.5 30" stroke="#9ccc65" stroke-width="0.85" opacity="0.85"/>

        <!-- Lower broad clasping leaves -->
        <path d="M48.5 66 C34 67.5 18 63 14 53 C24 49 38 54 48.5 62 Z" fill="#2e7d32"/>
        <path d="M51.5 66 C66 67.5 82 63 86 53 C76 49 62 54 51.5 62 Z" fill="#388e3c"/>
        <!-- Mid-stem sheathing leaves -->
        <path d="M48.5 57 C35 55.5 23 49 20 39 C30 37.5 42 44 48.5 53 Z" fill="#43a047"/>
        <path d="M51.5 53 C65 51.5 77 45 80 35 C70 33.5 58 40 51.5 49 Z" fill="#4caf50"/>
        <!-- Upper narrow stem leaves hugging the spike base -->
        <path d="M48.5 46 C41 41 36 33 37 24 C43 28 47 36 48.5 42 Z" fill="#66bb6a"/>
        <path d="M51.5 43 C59 38 64 30 63 21 C57 25 53 33 51.5 39 Z" fill="#7cb342"/>

        <!-- Parallel leaf venation -->
        <g stroke="#c5e1a5" stroke-width="0.6" fill="none" opacity="0.78" stroke-linecap="round">
          <path d="M46 64 L17 54 M43 62 L23 56"/>
          <path d="M54 64 L83 54 M57 62 L77 56"/>
          <path d="M46 54 L22 41 M54 50 L78 37"/>
          <path d="M47 43 L39 27 M53 40 L61 24"/>
        </g>

        <!-- ================= DENSE CYLINDRICAL ORCHID SPIKE ================= -->
        <!-- Slender projecting green-plum floral bracts -->
        <g stroke="#558b2f" stroke-width="1.25" stroke-linecap="round" fill="none">
          <path d="M47 39 L38 32"/>
          <path d="M53 37 L62 30"/>
          <path d="M46 32 L36 25"/>
          <path d="M54 30 L64 23"/>
          <path d="M47 25 L38 18"/>
          <path d="M53 23 L62 16"/>
          <path d="M48 18 L41 12"/>
          <path d="M52 16 L59 10"/>
          <path d="M49 12 L45 7"/>
          <path d="M51 11 L55 6"/>
        </g>
        <g stroke="#8e24aa" stroke-width="0.85" stroke-linecap="round" opacity="0.72">
          <path d="M40 33.5 L38 32 M60 31.5 L62 30 M38 26.5 L36 25 M62 24.5 L64 23 M40 19.5 L38 18 M60 17.5 L62 16"/>
        </g>

        <!-- Central floral rachis backdrop -->
        <path d="M44 38 C42 27 44 12 50 5 C56 12 58 27 56 38 Z" fill="#6a1b9a" opacity="0.45"/>

        <!-- Tier 1 (base of spike) -->
        <g transform="translate(44.5 35.5) scale(0.9)">
          <ellipse cx="-2.5" cy="-1.5" rx="3.2" ry="2.2" fill="#8e24aa" transform="rotate(-25 -2.5 -1.5)"/>
          <path d="M-3 0 C-4 3 0 5 2 3 C3 1 1 -1 -3 0 Z" fill="#ab47bc"/>
          <ellipse cx="-0.5" cy="1.2" rx="1.5" ry="1.1" fill="#f3e5f5"/>
          <circle cx="-0.5" cy="1.2" r="0.55" fill="#6a1b9a"/>
        </g>
        <g transform="translate(55.5 34.5) scale(0.9)">
          <ellipse cx="2.5" cy="-1.5" rx="3.2" ry="2.2" fill="#9c27b0" transform="rotate(25 2.5 -1.5)"/>
          <path d="M3 0 C4 3 0 5 -2 3 C-3 1 -1 -1 3 0 Z" fill="#ba68c8"/>
          <ellipse cx="0.5" cy="1.2" rx="1.5" ry="1.1" fill="#f3e5f5"/>
          <circle cx="0.5" cy="1.2" r="0.55" fill="#6a1b9a"/>
        </g>
        <g transform="translate(50 37) scale(0.9)">
          <ellipse cx="-2.5" cy="-1.2" rx="2.6" ry="2" fill="#7b1fa2"/>
          <ellipse cx="2.5" cy="-1.2" rx="2.6" ry="2" fill="#8e24aa"/>
          <path d="M-3 0.5 Q0 5 3 0.5 Q0 -1 -3 0.5 Z" fill="#ab47bc"/>
          <ellipse cx="0" cy="1.5" rx="1.6" ry="1" fill="#fce4ec"/>
          <circle cx="-0.6" cy="1.5" r="0.45" fill="#6a1b9a"/>
          <circle cx="0.6" cy="1.5" r="0.45" fill="#6a1b9a"/>
        </g>

        <!-- Tier 2 -->
        <g transform="translate(44 28.5) scale(0.9)">
          <ellipse cx="-2.5" cy="-1.5" rx="3.3" ry="2.2" fill="#9c27b0" transform="rotate(-20 -2.5 -1.5)"/>
          <path d="M-3 0 C-4 3.2 0 4.8 2.2 2.8 C3.2 1 1 -1 -3 0 Z" fill="#ba68c8"/>
          <ellipse cx="-0.4" cy="1.2" rx="1.5" ry="1.1" fill="#f3e5f5"/>
          <circle cx="-0.4" cy="1.2" r="0.55" fill="#6a1b9a"/>
        </g>
        <g transform="translate(56 27.5) scale(0.9)">
          <ellipse cx="2.5" cy="-1.5" rx="3.3" ry="2.2" fill="#8e24aa" transform="rotate(20 2.5 -1.5)"/>
          <path d="M3 0 C4 3.2 0 4.8 -2.2 2.8 C-3.2 1 -1 -1 3 0 Z" fill="#ab47bc"/>
          <ellipse cx="0.4" cy="1.2" rx="1.5" ry="1.1" fill="#f3e5f5"/>
          <circle cx="0.4" cy="1.2" r="0.55" fill="#6a1b9a"/>
        </g>
        <g transform="translate(50 30) scale(0.9)">
          <ellipse cx="-2.6" cy="-1.4" rx="2.7" ry="2" fill="#8e24aa"/>
          <ellipse cx="2.6" cy="-1.4" rx="2.7" ry="2" fill="#9c27b0"/>
          <path d="M-3.2 0.4 Q0 5.2 3.2 0.4 Q0 -1.2 -3.2 0.4 Z" fill="#ba68c8"/>
          <ellipse cx="0" cy="1.4" rx="1.7" ry="1.1" fill="#ffffff"/>
          <circle cx="-0.6" cy="1.4" r="0.48" fill="#7b1fa2"/>
          <circle cx="0.6" cy="1.4" r="0.48" fill="#7b1fa2"/>
        </g>

        <!-- Tier 3 -->
        <g transform="translate(44.5 22) scale(0.88)">
          <ellipse cx="-2.2" cy="-1.4" rx="3" ry="2" fill="#8e24aa" transform="rotate(-18 -2.2 -1.4)"/>
          <path d="M-2.8 0 C-3.6 3 0 4.4 2 2.6 C2.8 0.8 0.8 -1 -2.8 0 Z" fill="#ab47bc"/>
          <ellipse cx="-0.3" cy="1.1" rx="1.3" ry="0.95" fill="#f3e5f5"/>
          <circle cx="-0.3" cy="1.1" r="0.48" fill="#6a1b9a"/>
        </g>
        <g transform="translate(55.5 21.5) scale(0.88)">
          <ellipse cx="2.2" cy="-1.4" rx="3" ry="2" fill="#9c27b0" transform="rotate(18 2.2 -1.4)"/>
          <path d="M2.8 0 C3.6 3 0 4.4 -2 2.6 C-2.8 0.8 -0.8 -1 2.8 0 Z" fill="#ce93d8"/>
          <ellipse cx="0.3" cy="1.1" rx="1.3" ry="0.95" fill="#f3e5f5"/>
          <circle cx="0.3" cy="1.1" r="0.48" fill="#6a1b9a"/>
        </g>
        <g transform="translate(50 23.5) scale(0.88)">
          <ellipse cx="-2.4" cy="-1.2" rx="2.5" ry="1.9" fill="#9c27b0"/>
          <ellipse cx="2.4" cy="-1.2" rx="2.5" ry="1.9" fill="#ab47bc"/>
          <path d="M-3 0.4 Q0 4.8 3 0.4 Q0 -1 -3 0.4 Z" fill="#ba68c8"/>
          <ellipse cx="0" cy="1.3" rx="1.5" ry="1" fill="#fce4ec"/>
          <circle cx="0" cy="1.3" r="0.52" fill="#6a1b9a"/>
        </g>

        <!-- Tier 4 -->
        <g transform="translate(46 15.5) scale(0.88)">
          <ellipse cx="-1.8" cy="-1" rx="2.5" ry="1.8" fill="#7b1fa2"/>
          <path d="M-2.2 0.2 Q0 3.8 2 1.8 Q2.2 0 -2.2 0.2 Z" fill="#ab47bc"/>
          <ellipse cx="-0.2" cy="1" rx="1.1" ry="0.8" fill="#f3e5f5"/>
        </g>
        <g transform="translate(54 15.5) scale(0.88)">
          <ellipse cx="1.8" cy="-1" rx="2.5" ry="1.8" fill="#8e24aa"/>
          <path d="M2.2 0.2 Q0 3.8 -2 1.8 Q-2.2 0 2.2 0.2 Z" fill="#ba68c8"/>
          <ellipse cx="0.2" cy="1" rx="1.1" ry="0.8" fill="#f3e5f5"/>
        </g>
        <g transform="translate(50 17) scale(0.88)">
          <ellipse cx="-2" cy="-1" rx="2.1" ry="1.7" fill="#8e24aa"/>
          <ellipse cx="2" cy="-1" rx="2.1" ry="1.7" fill="#9c27b0"/>
          <path d="M-2.5 0.4 Q0 4.2 2.5 0.4 Q0 -0.8 -2.5 0.4 Z" fill="#ce93d8"/>
          <ellipse cx="0" cy="1.1" rx="1.2" ry="0.85" fill="#ffffff"/>
          <circle cx="0" cy="1.1" r="0.42" fill="#6a1b9a"/>
        </g>

        <!-- Tier 5 (dense budded apex of Panch Aunle spike) -->
        <g transform="translate(48 10) scale(0.88)">
          <ellipse cx="0" cy="0" rx="2.3" ry="2.6" fill="#7b1fa2"/>
          <ellipse cx="-0.4" cy="0.3" rx="1" ry="1.2" fill="#ba68c8"/>
        </g>
        <g transform="translate(52 10) scale(0.88)">
          <ellipse cx="0" cy="0" rx="2.3" ry="2.6" fill="#8e24aa"/>
          <ellipse cx="0.4" cy="0.3" rx="1" ry="1.2" fill="#ce93d8"/>
        </g>
        <path d="M47.3 8 C47.8 4.8 49 3.2 50 2.8 C51 3.2 52.2 4.8 52.7 8 C51.4 9.8 48.6 9.8 47.3 8 Z" fill="#6a1b9a"/>
        <ellipse cx="50" cy="5.6" rx="1.2" ry="1.5" fill="#9c27b0"/>
      `,
      withered: `
        <!-- Underground dry soil cutaway -->
        <path d="M18 69 Q50 67 82 69 C84 84 72 95.5 50 96.5 C28 95.5 16 84 18 69 Z" fill="#4e342e" opacity="0.88"/>
        <path d="M23 70 Q50 68.5 77 70 C77 82 67 92.5 50 93.5 C33 92.5 23 82 23 70 Z" fill="#3e2723" opacity="0.72"/>
        <path d="M16 69 Q50 66.5 84 69" stroke="#795548" stroke-width="2" stroke-linecap="round" fill="none"/>

        <!-- Dried shrivelled 5-fingered underground tuber root -->
        <path d="M47 67 L47.5 72 Q50 73.5 52.5 72 L53 67 Z" fill="#5d4037"/>
        <path d="M47.5 72 C42 73 35 76 30 80 C29 81.5 31 82.2 33 81.5 C37 80 41 77.5 44.5 76 C41.5 80 38 84.5 36.5 87 C36 88.2 37.8 89 39 88 C42 85.5 44.5 81.5 47 77.5 C47.5 83 47 89.5 47 93.5 C47 95 49.2 95 49.5 93.5 C50 89 51 83 51.8 77.5 C54 81.8 56 86 57.5 88.5 C58.5 89.5 60 88.5 59.5 87 C58.5 83.8 56.5 79.5 54 76 C59.5 78 65 82.5 67.5 88 C68.5 89 70 88 69.5 86.5 C68 80 62 74.5 52.5 72 Z" fill="#b89872" stroke="#6d4c41" stroke-width="0.7" stroke-linejoin="round"/>

        <!-- Drooping dried basal leaves above ground -->
        <path d="M49 67 C35 69 20 65 16 58 C25 56 38 60 49 64 Z" fill="#795548"/>
        <path d="M51 67 C65 69 80 65 84 58 C75 56 62 60 51 64 Z" fill="#6d4c41"/>
        <path d="M48 59 C37 57 28 52 25 45 C33 46 42 51 48 56 Z" fill="#8d6e63"/>
        <path d="M52 56 C62 54 70 49 73 42 C65 43 57 48 52 52 Z" fill="#795548"/>

        <!-- Bent dry flower stem with papery seed husks -->
        <path d="M50 67 Q49 48 45 31 Q42 20 37 12" stroke="#6d4c41" stroke-width="2.1" stroke-linecap="round" fill="none"/>
        <g fill="#a1887f" stroke="#5d4037" stroke-width="0.4">
          <ellipse cx="43" cy="32" rx="2.3" ry="1.3" transform="rotate(-25 43 32)"/>
          <ellipse cx="47" cy="28" rx="2.3" ry="1.3" transform="rotate(20 47 28)"/>
          <ellipse cx="41" cy="24" rx="2.1" ry="1.2" transform="rotate(-30 41 24)"/>
          <ellipse cx="45" cy="21" rx="2.1" ry="1.2" transform="rotate(18 45 21)"/>
          <ellipse cx="39" cy="17" rx="1.9" ry="1.1" transform="rotate(-25 39 17)"/>
          <ellipse cx="37" cy="12" rx="1.7" ry="2.1"/>
        </g>
        <!-- Fallen dried petal bits -->
        <ellipse cx="28" cy="67" rx="2.8" ry="1.2" fill="#8d6e63"/>
        <ellipse cx="68" cy="67" rx="3" ry="1.3" fill="#a1887f"/>
      `
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
