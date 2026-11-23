/**
 * Rotational Isometric Forest Platform Diorama Renderer
 * Renders the floating isometric grassland & soil platform with 360-degree 3D-style rotation,
 * preserving the original botanical plant UI from /plants/registry.js (getBotanicalPlotIconSvg).
 */
(function (root) {
  'use strict';

  const TILE_W = 68;
  const TILE_H = 34;
  const SCALE_X = TILE_W / Math.SQRT2;
  const WALL_DEPTH = 42;
  const PADDING_X = 72;
  const PADDING_TOP = 132;
  const PADDING_BOTTOM = 74;
  const PLANT_SVG_UNITS = 84;
  const DEFAULT_YAW = Math.PI / 4;
  const DEFAULT_PITCH = 0.5;

  function seededRand(seed) {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
    return x - Math.floor(x);
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function computeGridSize(count) {
    if (count <= 0) return 4;
    if (count <= 12) return 4;
    if (count <= 20) return 5;
    if (count <= 30) return 6;
    if (count <= 54) return 8;
    if (count <= 86) return 10;
    if (count <= 128) return 12;
    if (count <= 176) return 14;
    return Math.ceil(Math.sqrt(count * 1.15));
  }

  function buildTileSlots(gridSize) {
    const slots = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        slots.push({ r, c });
      }
    }
    return slots;
  }

  function projectIso(u, v, centerX, centerY, cosA, sinA, pitch) {
    return {
      x: centerX + (u * cosA - v * sinA) * SCALE_X,
      y: centerY + (u * sinA + v * cosA) * (SCALE_X * pitch)
    };
  }

  function formatItemDateTime(ts) {
    const d = new Date(ts);
    const now = new Date();
    const isToday =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isToday) return timeStr;
    const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return `${dateStr}, ${timeStr}`;
  }

  function formatStageLabel(stage, isWithered) {
    if (isWithered) return 'Withered';
    switch (stage) {
      case 'sprout': return 'Sprout';
      case 'growing': return 'Growing';
      case 'budding': return 'Budding';
      case 'maturing': return 'Maturing';
      default: return 'Mature';
    }
  }

  // Subtle ambient terrain details for empty platform tiles (grass tufts, pebbles, tiny wildflowers)
  function renderTerrainProp(seed) {
    const roll = seededRand(seed);
    if (roll < 0.24) {
      return `
        <g opacity="0.88">
          <path d="M-3,1 L-5,-6 M0,1 L0,-8 M3,1 L5,-5" stroke="#6aa428" stroke-width="1.3" stroke-linecap="round"/>
        </g>
      `;
    }
    if (roll < 0.285) {
      return `
        <g>
          <ellipse cx="0" cy="1" rx="6.5" ry="3.2" fill="#2c3e18" opacity="0.22"/>
          <polygon points="-6,0 -3,-6 2,-5 0,2" fill="#9e9b95"/>
          <polygon points="2,-5 6,-1 4,2 0,2" fill="#76736d"/>
          <polygon points="-3,-6 2,-5 0,-2 -6,0" fill="#bdbab4"/>
        </g>
      `;
    }
    if (roll < 0.315) {
      return `
        <g>
          <ellipse cx="0" cy="1" rx="5" ry="2.4" fill="#243a15" opacity="0.22"/>
          <polygon points="-1.5,0 -1,-6 1,-6 1.5,0" fill="#f5efe6"/>
          <polygon points="0,-12 -6,-6 0,-5" fill="#e53935"/>
          <polygon points="0,-12 0,-5 6,-6" fill="#c62828"/>
          <circle cx="-2" cy="-8" r="0.9" fill="#ffffff"/>
          <circle cx="2" cy="-7" r="0.8" fill="#ffffff"/>
        </g>
      `;
    }
    if (roll < 0.355) {
      return `
        <g>
          <path d="M0,1 L0,-5" stroke="#5d9423" stroke-width="1.1"/>
          <circle cx="0" cy="-6" r="2.1" fill="#fffde7"/>
          <circle cx="0" cy="-6" r="0.9" fill="#fbc02d"/>
        </g>
      `;
    }
    return '';
  }

  function renderSoilStones(p0, p1, isShaded, gridSize, wallDepth, seedBase) {
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const numStones = Math.max(8, Math.min(28, gridSize * 3));
    const stones = [];

    for (let i = 0; i < numStones; i++) {
      const t = 0.05 + seededRand(i * 41 + seedBase) * 0.90;
      const depth = 0.25 + seededRand(i * 73 + seedBase + 13) * 0.58;
      const cx = p0.x + dx * t;
      const cy = p0.y + dy * t + depth * wallDepth;
      const rx = 3.5 + seededRand(i * 19 + 7) * 5.8;
      const ry = rx * (0.45 + seededRand(i * 23 + 3) * 0.25);
      const rot = (isShaded ? -20 : 20) + (seededRand(i * 13) - 0.5) * 24;
      const fill = isShaded
        ? (i % 3 === 0 ? '#704d34' : i % 3 === 1 ? '#4d301d' : '#65442b')
        : (i % 3 === 0 ? '#976f4e' : i % 3 === 1 ? '#6e492e' : '#8a6242');
      stones.push(
        `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})" fill="${fill}" opacity="0.88"/>`
      );
    }
    return stones.join('');
  }

  function renderScallopedTurfEdge(pStart, pEnd, isShaded, gridSize, seedBase, exactSegments) {
    const segments = exactSegments || Math.max(10, gridSize * 3);
    const dx = pEnd.x - pStart.x;
    const dy = pEnd.y - pStart.y;
    let d = `M ${pStart.x.toFixed(1)},${pStart.y.toFixed(1)}`;
    for (let i = 0; i < segments; i++) {
      const t1 = (i + 0.5) / segments;
      const t2 = (i + 1) / segments;
      const drop = 5 + seededRand(i * 29 + seedBase) * 6.5;
      const mx = pStart.x + dx * t1;
      const my = pStart.y + dy * t1 + drop;
      const ex = pStart.x + dx * t2;
      const ey = pStart.y + dy * t2 + (i === segments - 1 ? 0 : 1.5);
      d += ` Q ${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
    }
    d += ` L ${pEnd.x.toFixed(1)},${(pEnd.y - 2).toFixed(1)} L ${pStart.x.toFixed(1)},${(pStart.y - 2).toFixed(1)} Z`;
    const shadowD = d.replace(/Z$/, '');
    const fill = isShaded ? '#78b030' : '#96cf43';
    return `
      <path d="${shadowD}" fill="none" stroke="rgba(26,14,6,0.35)" stroke-width="3" transform="translate(0, 2)"/>
      <path d="${d}" fill="${fill}"/>
    `;
  }

  function buildForestPonds(N, itemCount) {
    const maxAllowed = itemCount > 0 ? Math.max(0, N * N - itemCount) : N * N;
    if (maxAllowed <= 0) return { ponds: [], pondTileKeys: new Set() };

    const candidates = [];
    if (N === 4) {
      candidates.push({ tiles: [{ r: 2, c: 1 }], seed: 401, hasKoi: false });
    } else if (N === 5) {
      candidates.push(
        { tiles: [{ r: 1, c: 3 }], seed: 501, hasKoi: false },
        { tiles: [{ r: 3, c: 1 }], seed: 502, hasKoi: true }
      );
    } else if (N === 6) {
      candidates.push(
        { tiles: [{ r: 1, c: 2 }, { r: 1, c: 3 }], seed: 601, hasKoi: true },
        { tiles: [{ r: 4, c: 1 }], seed: 602, hasKoi: false }
      );
    } else if (N === 8) {
      candidates.push(
        { tiles: [{ r: 2, c: 2 }, { r: 2, c: 3 }], seed: 801, hasKoi: true },
        { tiles: [{ r: 5, c: 5 }], seed: 802, hasKoi: false },
        { tiles: [{ r: 5, c: 1 }], seed: 803, hasKoi: false }
      );
    } else if (N === 10) {
      candidates.push(
        { tiles: [{ r: 2, c: 2 }, { r: 2, c: 3 }], seed: 1001, hasKoi: true },
        { tiles: [{ r: 5, c: 7 }, { r: 6, c: 7 }], seed: 1002, hasKoi: true },
        { tiles: [{ r: 7, c: 2 }], seed: 1003, hasKoi: false },
        { tiles: [{ r: 2, c: 7 }], seed: 1004, hasKoi: false }
      );
    } else if (N === 12) {
      candidates.push(
        { tiles: [{ r: 2, c: 2 }, { r: 2, c: 3 }], seed: 1201, hasKoi: true },
        { tiles: [{ r: 6, c: 8 }, { r: 7, c: 8 }], seed: 1202, hasKoi: true },
        { tiles: [{ r: 9, c: 3 }], seed: 1203, hasKoi: false },
        { tiles: [{ r: 3, c: 9 }], seed: 1204, hasKoi: false },
        { tiles: [{ r: 6, c: 4 }], seed: 1205, hasKoi: false }
      );
    } else {
      candidates.push(
        { tiles: [{ r: 2, c: 2 }, { r: 2, c: 3 }], seed: 1401, hasKoi: true },
        { tiles: [{ r: 6, c: 9 }, { r: 7, c: 9 }], seed: 1402, hasKoi: true },
        { tiles: [{ r: 10, c: 4 }, { r: 10, c: 5 }], seed: 1403, hasKoi: true },
        { tiles: [{ r: 3, c: N - 3 }], seed: 1404, hasKoi: false },
        { tiles: [{ r: N - 4, c: 2 }], seed: 1405, hasKoi: false },
        { tiles: [{ r: Math.floor(N / 2), c: Math.floor(N / 2) - 1 }], seed: 1406, hasKoi: false }
      );
      if (N >= 16) {
        candidates.push(
          { tiles: [{ r: N - 3, c: N - 4 }], seed: 1601, hasKoi: false },
          { tiles: [{ r: 4, c: Math.floor(N / 2) }], seed: 1602, hasKoi: true }
        );
      }
    }

    const ponds = [];
    const pondTileKeys = new Set();
    let usedTiles = 0;

    candidates.forEach((cand) => {
      if (usedTiles + cand.tiles.length > maxAllowed) return;
      const valid = cand.tiles.every((t) => (
        t.r >= 0 && t.r < N && t.c >= 0 && t.c < N && !pondTileKeys.has(`${t.r},${t.c}`)
      ));
      if (!valid) return;
      cand.tiles.forEach((t) => pondTileKeys.add(`${t.r},${t.c}`));
      usedTiles += cand.tiles.length;
      ponds.push(cand);
    });

    return { ponds, pondTileKeys };
  }

  function buildSteplandGrid(N, ponds) {
    const numLevels = N <= 4 ? 3 : (N <= 6 ? 4 : 5);
    const levels = [];

    for (let r = 0; r < N; r++) {
      const row = [];
      for (let c = 0; c < N; c++) {
        const un = (c + 0.5) / N;
        const vn = (r + 0.5) / N;
        // Natural curved hillside terrace contour sloping gently from upper ridge to lower terraces
        const slope = 1 - (un * 0.54 + vn * 0.46);
        const contourWave =
          0.14 * Math.sin(un * Math.PI * 1.55 + 0.35) +
          0.10 * Math.cos(vn * Math.PI * 1.35 - 0.25) +
          0.05 * Math.sin((un - vn) * Math.PI * 2.0);
        const raw = Math.max(0, Math.min(0.999, slope + contourWave * 0.65));
        row.push(Math.floor(raw * numLevels));
      }
      levels.push(row);
    }

    // Flatten each pond onto a shared natural terrace shelf (never on the highest peak)
    const pondTileSet = new Set();
    ponds.forEach((pond) => {
      let minLvl = numLevels - 2;
      pond.tiles.forEach((t) => {
        pondTileSet.add(`${t.r},${t.c}`);
        if (levels[t.r] && typeof levels[t.r][t.c] === 'number') {
          minLvl = Math.min(minLvl, levels[t.r][t.c]);
        }
      });
      const targetLvl = Math.max(0, minLvl);
      pond.level = targetLvl;
      pond.tiles.forEach((t) => {
        if (levels[t.r]) levels[t.r][t.c] = targetLvl;
      });
    });

    // Smooth non-pond step transitions so adjacent terraces never jump more than 1 level
    for (let pass = 0; pass < 3; pass++) {
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          if (pondTileSet.has(`${r},${c}`)) continue;
          let minNb = levels[r][c];
          if (r > 0) minNb = Math.min(minNb, levels[r - 1][c]);
          if (r < N - 1) minNb = Math.min(minNb, levels[r + 1][c]);
          if (c > 0) minNb = Math.min(minNb, levels[r][c - 1]);
          if (c < N - 1) minNb = Math.min(minNb, levels[r][c + 1]);
          if (levels[r][c] > minNb + 1) {
            levels[r][c] = minNb + 1;
          }
        }
      }
    }

    return levels;
  }

  function getTerraceGrassColor(level, isEven) {
    const evenPalette = ['#9ecc46', '#a8d650', '#b2df58', '#bce863', '#c4ef6e'];
    const oddPalette = ['#8dbf3a', '#97c840', '#a1d147', '#abda52', '#b3e25c'];
    const idx = Math.max(0, Math.min(evenPalette.length - 1, level));
    return isEven ? evenPalette[idx] : oddPalette[idx];
  }

  function renderTerraceStepRiser(pA, pB, topElev, botElev, isShaded, seedBase) {
    const topLeft = pA.x <= pB.x ? pA : pB;
    const topRight = pA.x <= pB.x ? pB : pA;
    const yTopL = topLeft.y - topElev;
    const yTopR = topRight.y - topElev;
    const yBotL = topLeft.y - botElev;
    const yBotR = topRight.y - botElev;

    const wallPts = `${topLeft.x.toFixed(1)},${yTopL.toFixed(1)} ${topRight.x.toFixed(1)},${yTopR.toFixed(1)} ${topRight.x.toFixed(1)},${yBotR.toFixed(1)} ${topLeft.x.toFixed(1)},${yBotL.toFixed(1)}`;
    const wallFill = isShaded ? '#68462c' : '#88603f';

    // Subtle retaining stone pebbles tucked into the earth riser
    const dx = topRight.x - topLeft.x;
    const dy = yTopR - yTopL;
    const riserH = topElev - botElev;
    const stones = [];
    if (dx > 12 && riserH > 4) {
      for (let i = 0; i < 2; i++) {
        const t = 0.25 + seededRand(seedBase + i * 19) * 0.5;
        const cx = topLeft.x + dx * t;
        const cy = yTopL + dy * t + riserH * (0.52 + seededRand(seedBase + i * 7) * 0.2);
        const rx = 2.6 + seededRand(seedBase + i * 13) * 2.2;
        const ry = rx * 0.52;
        const stoneFill = isShaded ? '#583b24' : '#735035';
        stones.push(`<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${stoneFill}" opacity="0.72"/>`);
      }
    }

    // Soft mossy turf overhang along top crest of terrace step
    const segs = 3;
    let lipD = `M ${topLeft.x.toFixed(1)},${yTopL.toFixed(1)}`;
    for (let i = 0; i < segs; i++) {
      const t1 = (i + 0.5) / segs;
      const t2 = (i + 1) / segs;
      const drop = Math.min(riserH * 0.48, 2.4 + seededRand(seedBase + i * 31) * 1.8);
      const mx = topLeft.x + dx * t1;
      const my = yTopL + dy * t1 + drop;
      const ex = topLeft.x + dx * t2;
      const ey = yTopL + dy * t2 + (i === segs - 1 ? 0 : 0.6);
      lipD += ` Q ${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
    }
    lipD += ` L ${topRight.x.toFixed(1)},${(yTopR - 0.6).toFixed(1)} L ${topLeft.x.toFixed(1)},${(yTopL - 0.6).toFixed(1)} Z`;
    const lipFill = isShaded ? '#75ac2e' : '#90c841';

    return `
      <line x1="${topLeft.x.toFixed(1)}" y1="${yBotL.toFixed(1)}" x2="${topRight.x.toFixed(1)}" y2="${yBotR.toFixed(1)}" stroke="rgba(18,30,8,0.24)" stroke-width="2.2" stroke-linecap="round"/>
      <polygon points="${wallPts}" fill="${wallFill}"/>
      ${stones.join('')}
      <path d="${lipD}" fill="${lipFill}"/>
    `;
  }

  function buildSmoothClosedPath(pts) {
    const n = pts.length;
    if (n < 3) return '';
    const mid = (a, b) => ({ x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 });
    const firstMid = mid(pts[n - 1], pts[0]);
    let d = `M ${firstMid.x.toFixed(1)},${firstMid.y.toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const curr = pts[i];
      const next = pts[(i + 1) % n];
      const m = mid(curr, next);
      d += ` Q ${curr.x.toFixed(1)},${curr.y.toFixed(1)} ${m.x.toFixed(1)},${m.y.toFixed(1)}`;
    }
    return `${d} Z`;
  }

  function renderIsometricPond(pond, pIdx, half, centerX, centerY, cosA, sinA, pitch, uid, stepH) {
    const tiles = pond.tiles;
    const elevPx = (pond.level || 0) * stepH;
    let sumU = 0;
    let sumV = 0;
    let minR = Infinity;
    let maxR = -Infinity;
    let minC = Infinity;
    let maxC = -Infinity;

    tiles.forEach((t) => {
      sumU += t.c + 0.5 - half;
      sumV += t.r + 0.5 - half;
      if (t.r < minR) minR = t.r;
      if (t.r > maxR) maxR = t.r;
      if (t.c < minC) minC = t.c;
      if (t.c > maxC) maxC = t.c;
    });

    const cu = sumU / tiles.length;
    const cv = sumV / tiles.length;
    const spanC = maxC - minC + 1;
    const spanR = maxR - minR + 1;
    const isMulti = tiles.length > 1;
    const ru = spanC > 1 ? 0.84 : 0.37;
    const rv = spanR > 1 ? 0.84 : 0.35;

    const projPond = (u, v, yAdd = 0) => {
      const pt = projectIso(u, v, centerX, centerY, cosA, sinA, pitch);
      return { x: pt.x, y: pt.y - elevPx + yAdd };
    };

    const numPts = 20;
    const p1 = seededRand(pond.seed + 1) * Math.PI * 2;
    const p2 = seededRand(pond.seed + 2) * Math.PI * 2;
    const p3 = seededRand(pond.seed + 3) * Math.PI * 2;

    const radialPoints = [];
    for (let i = 0; i < numPts; i++) {
      const theta = (i / numPts) * Math.PI * 2;
      const pinch = isMulti
        ? (spanC > spanR ? -0.075 * Math.cos(2 * theta) : 0.075 * Math.cos(2 * theta))
        : 0.07 * Math.cos(2 * theta + p1);
      const wobble = 1 + pinch + 0.055 * Math.sin(3 * theta + p2) + 0.028 * Math.cos(4 * theta + p3);
      radialPoints.push({
        theta,
        du: Math.cos(theta) * ru * wobble,
        dv: Math.sin(theta) * rv * wobble
      });
    }

    const projectScaled = (scale, yOffset) => radialPoints.map((rp) => (
      projPond(cu + rp.du * scale, cv + rp.dv * scale, yOffset)
    ));

    const waterDrop = 3.5 + (0.66 - pitch) * 3.5;
    const haloPath = buildSmoothClosedPath(projectScaled(1.08, 0));
    const shorePath = buildSmoothClosedPath(projectScaled(1.0, 0));
    const waterPath = buildSmoothClosedPath(projectScaled(0.985, waterDrop));
    const shallowPath = buildSmoothClosedPath(projectScaled(0.76, waterDrop));

    const clipId = `pond-clip-${uid}-p${pIdx}`;
    const pondCenterPt = projPond(cu, cv, 0);

    // Gentle water ripples projected in (u, v) space
    const rippleAngle = seededRand(pond.seed + 11) * Math.PI;
    const rippleSpecs = [
      { offU: -ru * 0.18, offV: -rv * 0.12, rx: 0.17, ry: 0.13, delay: '0s' },
      { offU: ru * 0.24, offV: rv * 0.16, rx: 0.13, ry: 0.10, delay: '1.6s' }
    ];
    const ripplesMarkup = rippleSpecs.map((spec) => {
      const arcPts = [];
      for (let k = 0; k <= 6; k++) {
        const a = rippleAngle + (k / 6) * Math.PI * 1.15;
        const pt = projPond(
          cu + spec.offU + Math.cos(a) * spec.rx,
          cv + spec.offV + Math.sin(a) * spec.ry,
          waterDrop
        );
        arcPts.push(`${k === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`);
      }
      return `<path class="iso-pond-ripple" d="${arcPts.join(' ')}" fill="none" stroke="#e0f7fa" stroke-width="1.15" stroke-linecap="round" style="animation-delay:${spec.delay};"/>`;
    }).join('');

    // Optional tiny koi silhouette gliding beneath the surface
    let koiMarkup = '';
    if (pond.hasKoi) {
      const koiBaseA = seededRand(pond.seed + 17) * Math.PI * 2;
      const ku = cu + Math.cos(koiBaseA) * ru * 0.22;
      const kv = cv + Math.sin(koiBaseA) * rv * 0.22;
      const dirU = -Math.sin(koiBaseA);
      const dirV = Math.cos(koiBaseA);
      const head = projPond(ku + dirU * 0.075, kv + dirV * 0.075, waterDrop + 0.8);
      const midPt = projPond(ku, kv, waterDrop + 1.4);
      const tail = projPond(ku - dirU * 0.085, kv - dirV * 0.085, waterDrop + 0.9);
      koiMarkup = `
        <g opacity="0.7">
          <path d="M ${head.x.toFixed(1)},${head.y.toFixed(1)} Q ${midPt.x.toFixed(1)},${midPt.y.toFixed(1)} ${tail.x.toFixed(1)},${tail.y.toFixed(1)}" fill="none" stroke="#fb8c00" stroke-width="2.6" stroke-linecap="round"/>
          <circle cx="${head.x.toFixed(1)}" cy="${head.y.toFixed(1)}" r="1.4" fill="#ffb74d"/>
        </g>
      `;
    }

    // Floating lily pads projected in (u, v) space
    const lilyCount = isMulti ? 2 : 1;
    const lilyPadsMarkup = [];
    for (let l = 0; l < lilyCount; l++) {
      const lAngle = seededRand(pond.seed + 23 + l * 7) * Math.PI * 2;
      const lu = cu + Math.cos(lAngle) * ru * 0.36;
      const lv = cv + Math.sin(lAngle) * rv * 0.36;
      const padR = 0.088;
      const padPts = [];
      const notchAngle = lAngle + 0.8;
      for (let k = 0; k < 10; k++) {
        const a = notchAngle + 0.28 + (k / 9) * (Math.PI * 2 - 0.56);
        const pt = projPond(lu + Math.cos(a) * padR, lv + Math.sin(a) * padR, waterDrop - 0.2);
        padPts.push(`${pt.x.toFixed(1)},${pt.y.toFixed(1)}`);
      }
      const padCenter = projPond(lu, lv, waterDrop - 0.2);
      padPts.push(`${padCenter.x.toFixed(1)},${padCenter.y.toFixed(1)}`);
      const hasBloom = l === 0 && seededRand(pond.seed + 31) > 0.38;
      const bloomMarkup = hasBloom
        ? `<circle cx="${padCenter.x.toFixed(1)}" cy="${(padCenter.y - 1.3).toFixed(1)}" r="2.2" fill="#f48fb1"/><circle cx="${padCenter.x.toFixed(1)}" cy="${(padCenter.y - 1.5).toFixed(1)}" r="1.0" fill="#fce4ec"/>`
        : '';
      lilyPadsMarkup.push(
        `<polygon points="${padPts.join(' ')}" fill="#388e3c" stroke="#66bb6a" stroke-width="0.6"/>` + bloomMarkup
      );
    }

    // Depth-sorted shoreline pebbles & reeds around the rim
    const backProps = [];
    const frontProps = [];
    const stoneAngles = [
      seededRand(pond.seed + 41) * Math.PI * 2,
      seededRand(pond.seed + 42) * Math.PI * 2 + 2.4
    ];
    stoneAngles.forEach((sa, sIdx) => {
      const idx = Math.floor(((sa % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2) * numPts) % numPts;
      const rp = radialPoints[idx];
      const pt = projPond(cu + rp.du * 1.01, cv + rp.dv * 1.01, 0);
      const sx = pt.x.toFixed(1);
      const sy = pt.y.toFixed(1);
      const pebbleSvg = sIdx === 0
        ? `<g transform="translate(${sx}, ${sy})"><ellipse cx="0" cy="0.6" rx="4.2" ry="2.2" fill="#7d7a74"/><ellipse cx="-0.4" cy="-0.2" rx="3.4" ry="1.6" fill="#a8a49e"/><ellipse cx="3.8" cy="1.1" rx="2.3" ry="1.2" fill="#8f8b84"/></g>`
        : `<g transform="translate(${sx}, ${sy})"><ellipse cx="0" cy="0.4" rx="3.3" ry="1.7" fill="#87837c"/><ellipse cx="-0.3" cy="-0.2" rx="2.5" ry="1.2" fill="#b3afa8"/></g>`;
      if (pt.y <= pondCenterPt.y) backProps.push(pebbleSvg);
      else frontProps.push(pebbleSvg);
    });

    const reedAngle = seededRand(pond.seed + 53) * Math.PI * 2;
    const reedIdx = Math.floor(((reedAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2) * numPts) % numPts;
    const reedRp = radialPoints[reedIdx];
    const reedPt = projPond(cu + reedRp.du * 0.99, cv + reedRp.dv * 0.99, 0);
    const cattailTip = isMulti
      ? `<line x1="1.5" y1="0" x2="2" y2="-10.5" stroke="#4d8c2a" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="2" cy="-9.2" rx="1.2" ry="2.5" fill="#6d4c41"/>`
      : '';
    const reedSvg = `
      <g transform="translate(${reedPt.x.toFixed(1)}, ${reedPt.y.toFixed(1)})">
        <path d="M-2.5,0.5 Q-4,-5 -5.5,-8.5 M0,0.5 Q0,-6 0.5,-9.5 M2.5,0.5 Q4.5,-4.5 5.5,-7.5" stroke="#53932c" stroke-width="1.25" stroke-linecap="round" fill="none"/>
        ${cattailTip}
      </g>
    `;
    if (reedPt.y <= pondCenterPt.y) backProps.push(reedSvg);
    else frontProps.push(reedSvg);

    const clipDef = `<clipPath id="${clipId}"><path d="${shorePath}"/></clipPath>`;
    const pondSvg = `
      <g class="iso-pond">
        <path d="${haloPath}" fill="#7db838" opacity="0.52"/>
        ${backProps.join('')}
        <path d="${shorePath}" fill="#694d34" stroke="#567a27" stroke-width="0.9"/>
        <g clip-path="url(#${clipId})">
          <path d="${waterPath}" fill="url(#isoPondWaterGrad)"/>
          <path d="${shallowPath}" fill="url(#isoPondShallowGrad)" opacity="0.44"/>
          ${koiMarkup}
          ${ripplesMarkup}
          ${lilyPadsMarkup.join('')}
          <path d="${shorePath}" fill="none" stroke="rgba(34,20,10,0.28)" stroke-width="1.8"/>
        </g>
        ${frontProps.join('')}
      </g>
    `;

    return {
      depth: pondCenterPt.y,
      clipDef,
      pondSvg
    };
  }

  function computePlatformGeometry(N, items, state) {
    const diamondW = N * TILE_W;
    const diamondH = N * TILE_H;
    const svgW = diamondW + PADDING_X * 2;
    const svgH = diamondH + PADDING_TOP + WALL_DEPTH + PADDING_BOTTOM;
    const centerX = svgW / 2;
    const centerY = PADDING_TOP + diamondH / 2;

    const cosA = Math.cos(state.yaw);
    const sinA = Math.sin(state.yaw);
    const pitch = state.pitch;
    const wallDepth = WALL_DEPTH * (1.16 - pitch * 0.32);
    const stepH = 15.5 * pitch;
    const half = N / 2;

    const orderedItems = items.slice();
    const { ponds, pondTileKeys } = buildForestPonds(N, orderedItems.length);
    const steplandLevels = buildSteplandGrid(N, ponds);
    const allSlots = buildTileSlots(N);
    const slots = allSlots.filter((s) => !pondTileKeys.has(`${s.r},${s.c}`));
    const treeSlots = slots.length > 0 ? slots : allSlots;
    const occupiedMap = new Map();
    orderedItems.forEach((item, idx) => {
      const slot = treeSlots[idx % treeSlots.length];
      occupiedMap.set(`${slot.r},${slot.c}`, { item, idx });
    });

    // 4 platform corners in clockwise grid order (base level = 0)
    const corners = [
      projectIso(-half, -half, centerX, centerY, cosA, sinA, pitch),
      projectIso(half, -half, centerX, centerY, cosA, sinA, pitch),
      projectIso(half, half, centerX, centerY, cosA, sinA, pitch),
      projectIso(-half, half, centerX, centerY, cosA, sinA, pitch)
    ];

    // Outward edge normals in (u, v) grid space with outer tile coordinate lookup
    const edgeDefs = [
      { idx: 0, a: corners[0], b: corners[1], nu: 0, nv: -1, stoneSeed: 100, turfSeed: 11, getTile: (i) => ({ r: 0, c: i }) },
      { idx: 1, a: corners[1], b: corners[2], nu: 1, nv: 0, stoneSeed: 900, turfSeed: 77, getTile: (i) => ({ r: i, c: N - 1 }) },
      { idx: 2, a: corners[2], b: corners[3], nu: 0, nv: 1, stoneSeed: 350, turfSeed: 43, getTile: (i) => ({ r: N - 1, c: N - 1 - i }) },
      { idx: 3, a: corners[3], b: corners[0], nu: -1, nv: 0, stoneSeed: 620, turfSeed: 99, getTile: (i) => ({ r: N - 1 - i, c: 0 }) }
    ];

    const visibleEdges = [];
    edgeDefs.forEach((edge) => {
      const nyScreen = edge.nu * sinA + edge.nv * cosA;
      const nxScreen = edge.nu * cosA - edge.nv * sinA;
      if (nyScreen > 0.005) {
        const leftIsA = edge.a.x <= edge.b.x;
        const leftPt = leftIsA ? edge.a : edge.b;
        const rightPt = leftIsA ? edge.b : edge.a;
        const isShaded = nxScreen >= 0;
        visibleEdges.push({
          ...edge,
          leftIsA,
          leftPt,
          rightPt,
          isShaded
        });
      }
    });

    const shadowPts = corners
      .map((pt) => `${pt.x.toFixed(1)},${(pt.y + wallDepth + 14).toFixed(1)}`)
      .join(' ');

    const clipDefs = [];
    const wallsMarkup = [];
    const turfMarkup = [];

    visibleEdges.forEach((edge) => {
      const p0 = edge.leftPt;
      const p1 = edge.rightPt;
      const segTopPts = [];

      for (let i = 0; i < N; i++) {
        const segIdx = edge.leftIsA ? i : (N - 1 - i);
        const tc = edge.getTile(segIdx);
        const elev = (steplandLevels[tc.r] ? steplandLevels[tc.r][tc.c] : 0) * stepH;
        const tStart = i / N;
        const tEnd = (i + 1) / N;
        const segA = {
          x: p0.x + (p1.x - p0.x) * tStart,
          y: p0.y + (p1.y - p0.y) * tStart - elev
        };
        const segB = {
          x: p0.x + (p1.x - p0.x) * tEnd,
          y: p0.y + (p1.y - p0.y) * tEnd - elev
        };
        segTopPts.push(`${segA.x.toFixed(1)},${segA.y.toFixed(1)} ${segB.x.toFixed(1)},${segB.y.toFixed(1)}`);
        turfMarkup.push(renderScallopedTurfEdge(segA, segB, edge.isShaded, N, edge.turfSeed + i * 17, 3));
      }

      const wallPts = `${segTopPts.join(' ')} ${p1.x.toFixed(1)},${(p1.y + wallDepth).toFixed(1)} ${p0.x.toFixed(1)},${(p0.y + wallDepth).toFixed(1)}`;
      const clipId = `soil-clip-${state.uid}-e${edge.idx}`;
      const gradId = edge.isShaded ? 'isoSoilGradR' : 'isoSoilGradL';

      clipDefs.push(`<clipPath id="${clipId}"><polygon points="${wallPts}"/></clipPath>`);
      wallsMarkup.push(
        `<polygon points="${wallPts}" fill="url(#${gradId})"/>` +
        `<g clip-path="url(#${clipId})">${renderSoilStones(p0, p1, edge.isShaded, N, wallDepth, edge.stoneSeed)}</g>`
      );
    });

    // Checkerboard grass platform tiles sorted back-to-front along rotated depth
    const cells = [];
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const cu = c + 0.5 - half;
        const cv = r + 0.5 - half;
        const depth = cu * sinA + cv * cosA;
        const level = steplandLevels[r][c];
        cells.push({ r, c, cu, cv, depth, level });
      }
    }
    cells.sort((a, b) => a.depth - b.depth || a.r - b.r || a.c - b.c);

    // Map each pond to its front-most tile in back-to-front cell order for exact 3D occlusion
    const cellOrderByKey = new Map();
    cells.forEach((cell, idx) => cellOrderByKey.set(`${cell.r},${cell.c}`, idx));
    const pondsAtTriggerTile = new Map();
    const renderedPonds = ponds.map((pond, pIdx) => {
      const rp = renderIsometricPond(pond, pIdx, half, centerX, centerY, cosA, sinA, pitch, state.uid, stepH);
      if (rp.clipDef) clipDefs.push(rp.clipDef);
      let triggerIdx = -1;
      let triggerKey = '';
      pond.tiles.forEach((t) => {
        const key = `${t.r},${t.c}`;
        const ord = cellOrderByKey.get(key);
        if (typeof ord === 'number' && ord > triggerIdx) {
          triggerIdx = ord;
          triggerKey = key;
        }
      });
      if (triggerKey) {
        if (!pondsAtTriggerTile.has(triggerKey)) pondsAtTriggerTile.set(triggerKey, []);
        pondsAtTriggerTile.get(triggerKey).push(rp.pondSvg);
      }
      return rp;
    });

    // Interior step edge definitions in (u, v) space
    const interiorStepDirs = [
      { dr: -1, dc: 0, nu: 0, nv: -1, aOff: [0, 0], bOff: [1, 0] },
      { dr: 0, dc: 1, nu: 1, nv: 0, aOff: [1, 0], bOff: [1, 1] },
      { dr: 1, dc: 0, nu: 0, nv: 1, aOff: [1, 1], bOff: [0, 1] },
      { dr: 0, dc: -1, nu: -1, nv: 0, aOff: [0, 1], bOff: [0, 0] }
    ];

    const tilesMarkup = [];
    const terrainPropsMarkup = [];
    const pinPositions = [];

    cells.forEach(({ r, c, cu, cv, level }, orderIdx) => {
      const u0 = c - half;
      const v0 = r - half;
      const elevPx = level * stepH;
      const b0 = projectIso(u0, v0, centerX, centerY, cosA, sinA, pitch);
      const b1 = projectIso(u0 + 1, v0, centerX, centerY, cosA, sinA, pitch);
      const b2 = projectIso(u0 + 1, v0 + 1, centerX, centerY, cosA, sinA, pitch);
      const b3 = projectIso(u0, v0 + 1, centerX, centerY, cosA, sinA, pitch);

      // Draw visible interior terrace step risers dropping down to lower adjacent terraces
      interiorStepDirs.forEach((dir, dIdx) => {
        const nr = r + dir.dr;
        const nc = c + dir.dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) return;
        const nLevel = steplandLevels[nr][nc];
        if (level <= nLevel) return;
        const nyScreen = dir.nu * sinA + dir.nv * cosA;
        if (nyScreen <= 0.005) return;
        const nxScreen = dir.nu * cosA - dir.nv * sinA;
        const eA = projectIso(u0 + dir.aOff[0], v0 + dir.aOff[1], centerX, centerY, cosA, sinA, pitch);
        const eB = projectIso(u0 + dir.bOff[0], v0 + dir.bOff[1], centerX, centerY, cosA, sinA, pitch);
        tilesMarkup.push(
          renderTerraceStepRiser(eA, eB, elevPx, nLevel * stepH, nxScreen >= 0, r * 131 + c * 73 + dIdx * 19)
        );
      });

      const polyPts = [
        `${b0.x.toFixed(1)},${(b0.y - elevPx).toFixed(1)}`,
        `${b1.x.toFixed(1)},${(b1.y - elevPx).toFixed(1)}`,
        `${b2.x.toFixed(1)},${(b2.y - elevPx).toFixed(1)}`,
        `${b3.x.toFixed(1)},${(b3.y - elevPx).toFixed(1)}`
      ].join(' ');

      const isEven = (r + c) % 2 === 0;
      const fill = getTerraceGrassColor(level, isEven);
      const occ = occupiedMap.get(`${r},${c}`);
      const isSelected = occ && state.selectedIdx === occ.idx;

      tilesMarkup.push(
        `<polygon points="${polyPts}" fill="${fill}" stroke="rgba(255,255,255,0.08)" stroke-width="0.6"/>`
      );
      if (isSelected) {
        tilesMarkup.push(
          `<polygon points="${polyPts}" fill="rgba(255,248,180,0.42)" stroke="#fff59d" stroke-width="2"/>`
        );
      }

      const trigPonds = pondsAtTriggerTile.get(`${r},${c}`);
      if (trigPonds) {
        tilesMarkup.push(`<g pointer-events="none">${trigPonds.join('')}</g>`);
      }

      const baseCenterPt = projectIso(cu, cv, centerX, centerY, cosA, sinA, pitch);
      const centerPt = { x: baseCenterPt.x, y: baseCenterPt.y - elevPx };
      if (occ) {
        const leftPct = ((centerPt.x / svgW) * 100).toFixed(4);
        const topPct = ((centerPt.y / svgH) * 100).toFixed(4);
        const widthPct = ((PLANT_SVG_UNITS / svgW) * 100).toFixed(4);
        const zIdx = 10 + orderIdx * 2 + (isSelected ? 1 : 0);
        pinPositions.push({
          idx: occ.idx,
          item: occ.item,
          leftPct,
          topPct,
          widthPct,
          zIdx,
          isSelected
        });
      } else if (!pondTileKeys.has(`${r},${c}`)) {
        const propSvg = renderTerrainProp(r * 97 + c * 193 + N * 31);
        if (propSvg) {
          terrainPropsMarkup.push(
            `<g transform="translate(${centerPt.x.toFixed(1)}, ${centerPt.y.toFixed(1)})" pointer-events="none">${propSvg}</g>`
          );
        }
      }
    });

    return {
      svgW,
      svgH,
      shadowPts,
      clipDefs: clipDefs.join(''),
      wallsMarkup: wallsMarkup.join(''),
      tilesMarkup: tilesMarkup.join(''),
      pondsMarkup: '',
      turfMarkup: turfMarkup.join(''),
      terrainPropsMarkup: terrainPropsMarkup.join(''),
      pinPositions,
      orderedItems
    };
  }

  const containerStates = new WeakMap();
  let nextUid = 1;

  function getContainerState(container) {
    let st = containerStates.get(container);
    if (!st) {
      st = {
        uid: nextUid++,
        zoom: 1.0,
        yaw: DEFAULT_YAW,
        pitch: DEFAULT_PITCH,
        selectedIdx: null,
        scrollZoomActive: false,
        eventsBound: false,
        isDragging: false,
        rafPending: false,
        lastWheelZoomAt: 0,
        latestItems: [],
        latestOpts: {},
        lastGroveKey: null
      };
      containerStates.set(container, st);
    }
    return st;
  }

  const SVG_STATIC_DEFS = `
    <linearGradient id="isoSoilGradL" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#865b3c"/>
      <stop offset="100%" stop-color="#694328"/>
    </linearGradient>
    <linearGradient id="isoSoilGradR" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#634027"/>
      <stop offset="100%" stop-color="#482c18"/>
    </linearGradient>
    <linearGradient id="isoPondWaterGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4cc9e0"/>
      <stop offset="55%" stop-color="#1996b8"/>
      <stop offset="100%" stop-color="#0d6988"/>
    </linearGradient>
    <radialGradient id="isoPondShallowGrad" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#9be7f2"/>
      <stop offset="100%" stop-color="#38b6d4" stop-opacity="0"/>
    </radialGradient>
    <filter id="isoIslandShadowBlur" x="-15%" y="-15%" width="130%" height="130%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
  `;

  function updateProjectedFrameInPlace(container, state) {
    const items = state.latestItems;
    const N = computeGridSize(items.length);
    const geom = computePlatformGeometry(N, items, state);

    const svg = container.querySelector('.iso-island-svg');
    if (!svg) return;

    const defsEl = svg.querySelector('.iso-island-defs');
    const shadowPoly = svg.querySelector('.iso-island-shadow');
    const wallsGroup = svg.querySelector('.iso-walls-layer');
    const tilesGroup = svg.querySelector('.iso-tiles-layer');
    const pondsGroup = svg.querySelector('.iso-ponds-layer');
    const turfGroup = svg.querySelector('.iso-turf-layer');
    const propsGroup = svg.querySelector('.iso-terrain-props-layer');

    if (defsEl) defsEl.innerHTML = SVG_STATIC_DEFS + geom.clipDefs;
    if (shadowPoly) shadowPoly.setAttribute('points', geom.shadowPts);
    if (wallsGroup) wallsGroup.innerHTML = geom.wallsMarkup;
    if (tilesGroup) tilesGroup.innerHTML = geom.tilesMarkup;
    if (pondsGroup) pondsGroup.innerHTML = geom.pondsMarkup;
    if (turfGroup) turfGroup.innerHTML = geom.turfMarkup;
    if (propsGroup) propsGroup.innerHTML = geom.terrainPropsMarkup;

    const overlay = container.querySelector('.iso-plants-overlay');
    if (overlay) {
      geom.pinPositions.forEach((p) => {
        const pin = overlay.querySelector(`.iso-plant-pin[data-tree-idx="${p.idx}"]`);
        if (pin) {
          pin.style.left = `${p.leftPct}%`;
          pin.style.top = `${p.topPct}%`;
          pin.style.zIndex = String(p.zIdx);
        }
      });
    }
  }

  function scheduleRotationFrame(container, state) {
    if (state.rafPending) return;
    state.rafPending = true;
    requestAnimationFrame(() => {
      state.rafPending = false;
      updateProjectedFrameInPlace(container, state);
    });
  }

  function bindContainerInteractions(container, state) {
    if (state.eventsBound) return;
    state.eventsBound = true;

    container.addEventListener('mousedown', () => {
      state.scrollZoomActive = true;
    });

    container.addEventListener('click', () => {
      state.scrollZoomActive = true;
    });

    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', (e) => {
        if (!container.contains(e.target)) {
          state.scrollZoomActive = false;
        }
      });
    }

    container.addEventListener('wheel', (e) => {
      if (!state.scrollZoomActive) return;
      if (e.deltaY === 0 || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      const now = Date.now();
      if (now - state.lastWheelZoomAt < 60) return;
      state.lastWheelZoomAt = now;
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      const nextZoom = Math.max(0.4, Math.min(4.0, Number((state.zoom + delta).toFixed(2))));
      if (nextZoom !== state.zoom) {
        state.zoom = nextZoom;
        renderForestDiorama(container, state.latestItems, state.latestOpts);
      }
    }, { passive: false });

    // 3D-style drag rotation across the forest platform
    let pointerDown = false;
    let activePointerId = null;
    let startX = 0;
    let startY = 0;
    let startYaw = DEFAULT_YAW;
    let startPitch = DEFAULT_PITCH;

    container.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const viewport = e.target.closest('.iso-stage-viewport');
      if (!viewport) return;
      state.scrollZoomActive = true;
      pointerDown = true;
      activePointerId = e.pointerId;
      state.isDragging = false;
      startX = e.clientX;
      startY = e.clientY;
      startYaw = state.yaw;
      startPitch = state.pitch;
    });

    window.addEventListener('pointermove', (e) => {
      if (!pointerDown || e.pointerId !== activePointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!state.isDragging && Math.hypot(dx, dy) > 5) {
        state.isDragging = true;
        const viewport = container.querySelector('.iso-stage-viewport');
        if (viewport) viewport.style.cursor = 'grabbing';
      }
      if (state.isDragging) {
        state.yaw = startYaw - dx * 0.009;
        state.pitch = Math.max(0.34, Math.min(0.66, startPitch + dy * 0.0025));
        scheduleRotationFrame(container, state);
      }
    });

    const endDrag = (e) => {
      if (!pointerDown || (e && activePointerId !== null && e.pointerId !== activePointerId)) return;
      pointerDown = false;
      activePointerId = null;
      const viewport = container.querySelector('.iso-stage-viewport');
      if (viewport) viewport.style.cursor = 'grab';
      if (state.isDragging) {
        setTimeout(() => {
          state.isDragging = false;
        }, 30);
      }
    };

    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // Double-click inside platform smoothly snaps back to default isometric angle
    container.addEventListener('dblclick', (e) => {
      if (!e.target.closest('.iso-stage-viewport')) return;
      if (e.target.closest('.iso-plant-pin')) return;
      state.yaw = DEFAULT_YAW;
      state.pitch = DEFAULT_PITCH;
      updateProjectedFrameInPlace(container, state);
    });
  }

  function renderForestDiorama(container, filteredItems, options) {
    if (!container) return;
    const opts = options || {};
    const state = getContainerState(container);
    const items = Array.isArray(filteredItems) ? filteredItems : [];
    state.latestItems = items;
    state.latestOpts = opts;
    bindContainerInteractions(container, state);

    const N = computeGridSize(items.length);
    const geom = computePlatformGeometry(N, items, state);

    const plantOverlays = geom.pinPositions.map((p) => {
      const item = p.item;
      const isWith = !item.isHealthy;
      const stageInfo = typeof root.getPlantStageInfo === 'function'
        ? root.getPlantStageInfo(item)
        : { stage: item.stage || 'mature' };
      const iconContent = typeof root.getBotanicalPlotIconSvg === 'function'
        ? root.getBotanicalPlotIconSvg(item, isWith)
        : '';
      const formattedTime = formatItemDateTime(item.timestamp);
      const label = `${item.nepali || ''} (${item.english || ''}) - ${item.minutes || 0}m • ${formattedTime}`;

      return `
        <div class="iso-plant-pin planted-tree-item ${isWith ? 'withered' : ''} stage-${escapeHtml(stageInfo.stage)} ${p.isSelected ? 'is-selected' : ''}"
             data-tree-idx="${p.idx}"
             role="button"
             tabindex="0"
             aria-label="${escapeHtml(label)}"
             title="${escapeHtml(label)}"
             style="left:${p.leftPct}%;top:${p.topPct}%;width:${p.widthPct}%;z-index:${p.zIdx};">
          <div class="planted-tree-icon">${iconContent}</div>
        </div>
      `;
    });

    const selectedItem =
      state.selectedIdx !== null && geom.orderedItems[state.selectedIdx]
        ? geom.orderedItems[state.selectedIdx]
        : (geom.orderedItems.length > 0 ? geom.orderedItems[geom.orderedItems.length - 1] : null);

    let inspectorHtml = '';
    if (selectedItem) {
      const isWith = !selectedItem.isHealthy;
      const stageInfo = typeof root.getPlantStageInfo === 'function'
        ? root.getPlantStageInfo(selectedItem)
        : { stage: selectedItem.stage || 'mature' };
      const stageLabel = formatStageLabel(stageInfo.stage, isWith);
      const timeLabel = formatItemDateTime(selectedItem.timestamp);
      inspectorHtml = `
        <div class="iso-inspector-bar">
          <div class="iso-inspector-primary">
            <span class="iso-inspector-nepali">${escapeHtml(selectedItem.nepali || selectedItem.english || 'Tree')}</span>
            <span class="iso-inspector-sep">·</span>
            <span class="iso-inspector-english">${escapeHtml(selectedItem.english || '')}</span>
          </div>
          <div class="iso-inspector-meta">
            <span class="iso-inspector-nums">${Number(selectedItem.minutes || 0)} min</span>
            <span class="iso-inspector-sep">·</span>
            <span>${escapeHtml(timeLabel)}</span>
            <span class="iso-inspector-sep">·</span>
            <span class="${isWith ? 'iso-status-withered' : 'iso-status-healthy'}">${escapeHtml(stageLabel)}</span>
          </div>
        </div>
      `;
    } else {
      inspectorHtml = `
        <div class="iso-inspector-bar iso-inspector-empty">
          <button type="button" class="btn-empty-grassland-cue" onclick="scrollToForestTimer()">
            Start focus timer to plant your first tree
          </button>
        </div>
      `;
    }

    const baseWidth = Math.max(540, Math.round(geom.svgW));
    const zoomedWidth = Math.round(baseWidth * state.zoom);
    const zoomPct = Math.round(state.zoom * 100);
    const scalerStyle = state.zoom <= 1.0
      ? `width:${zoomedWidth}px;max-width:100%;`
      : `width:${zoomedWidth}px;max-width:none;`;

    container.innerHTML = `
      <div class="iso-forest-stage" data-empty="${geom.orderedItems.length === 0 ? 'true' : 'false'}">
        <div class="iso-stage-toolbar">
          <div class="iso-stage-summary">
            <span class="iso-summary-count">${geom.orderedItems.length}</span> ${geom.orderedItems.length === 1 ? 'tree' : 'trees'} planted
            <span class="iso-inspector-sep">·</span>
            <span>${N}×${N} grove</span>
          </div>
          <div class="iso-zoom-controls" role="group" aria-label="Forest zoom controls">
            <button type="button" class="iso-zoom-btn" data-zoom-delta="-0.2" title="Zoom out" aria-label="Zoom out">−</button>
            <button type="button" class="iso-zoom-btn iso-zoom-reset" data-zoom-reset="1" title="Reset zoom" aria-label="Reset zoom">${zoomPct}%</button>
            <button type="button" class="iso-zoom-btn" data-zoom-delta="0.2" title="Zoom in" aria-label="Zoom in">+</button>
          </div>
        </div>

        <div class="iso-stage-viewport" style="cursor:grab;user-select:none;">
          <div class="iso-island-scaler" style="${scalerStyle}touch-action:none;">
            <svg class="iso-island-svg" viewBox="0 0 ${geom.svgW} ${geom.svgH}" width="100%" height="auto" role="img" aria-label="Isometric forest platform with ${geom.orderedItems.length} planted trees">
              <defs class="iso-island-defs">
                ${SVG_STATIC_DEFS}
                ${geom.clipDefs}
              </defs>

              <polygon class="iso-island-shadow" points="${geom.shadowPts}" fill="rgba(7, 22, 16, 0.45)" filter="url(#isoIslandShadowBlur)"/>

              <g class="iso-walls-layer">${geom.wallsMarkup}</g>

              <g class="iso-tiles-layer">${geom.tilesMarkup}</g>

              <g class="iso-ponds-layer" pointer-events="none">${geom.pondsMarkup}</g>

              <g class="iso-turf-layer">${geom.turfMarkup}</g>

              <g class="iso-terrain-props-layer">${geom.terrainPropsMarkup}</g>
            </svg>

            <div class="iso-plants-overlay">
              ${plantOverlays.join('')}
            </div>
          </div>
        </div>

        ${inspectorHtml}
      </div>
    `;

    const zoomBtns = container.querySelectorAll('.iso-zoom-btn');
    zoomBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.zoomReset) {
          state.zoom = 1.0;
        } else {
          const delta = parseFloat(btn.dataset.zoomDelta || '0');
          state.zoom = Math.max(0.4, Math.min(4.0, Number((state.zoom + delta).toFixed(2))));
        }
        renderForestDiorama(container, items, opts);
      });
    });

    const treeNodes = container.querySelectorAll('.iso-plant-pin');
    treeNodes.forEach((node) => {
      const selectTree = () => {
        if (state.isDragging) return;
        const idx = parseInt(node.getAttribute('data-tree-idx'), 10);
        if (!isNaN(idx)) {
          state.selectedIdx = idx;
          renderForestDiorama(container, items, opts);
        }
      };
      node.addEventListener('click', selectTree);
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectTree();
        }
      });
    });
  }

  function adjustDioramaZoom(container, delta, items) {
    if (!container) return;
    const state = getContainerState(container);
    state.zoom = Math.max(0.4, Math.min(4.0, Number((state.zoom + delta).toFixed(2))));
    if (Array.isArray(items)) {
      renderForestDiorama(container, items);
    }
  }

  root.renderForestDiorama = renderForestDiorama;
  root.adjustDioramaZoom = adjustDioramaZoom;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
