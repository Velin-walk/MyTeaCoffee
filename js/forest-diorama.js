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

  function getStepDir(fromTile, toTile) {
    if (!fromTile || !toTile) return null;
    const dr = toTile.r - fromTile.r;
    const dc = toTile.c - fromTile.c;
    if (dr === -1 && dc === 0) return 'N';
    if (dr === 0 && dc === 1) return 'E';
    if (dr === 1 && dc === 0) return 'S';
    if (dr === 0 && dc === -1) return 'W';
    return null;
  }

  const STREAM_DIRS = {
    N: { du: 0, dv: -0.5, dr: -1, dc: 0, nu: 0, nv: -1, pu: 1, pv: 0 },
    E: { du: 0.5, dv: 0, dr: 0, dc: 1, nu: 1, nv: 0, pu: 0, pv: 1 },
    S: { du: 0, dv: 0.5, dr: 1, dc: 0, nu: 0, nv: 1, pu: -1, pv: 0 },
    W: { du: -0.5, dv: 0, dr: 0, dc: -1, nu: -1, nv: 0, pu: 0, pv: -1 }
  };

  function buildForestStreams(N, ponds, pondTileKeys) {
    const candidates = [];
    if (N === 4) {
      candidates.push(
        { tiles: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 1 }], toPond: { r: 2, c: 1 }, hw: 0.048, seed: 4101 },
        { tiles: [{ r: 1, c: 0 }, { r: 1, c: 1 }], hw: 0.032, seed: 4102 },
        { tiles: [{ r: 3, c: 1 }, { r: 3, c: 2 }], fromPond: { r: 2, c: 1 }, hw: 0.048, seed: 4103 },
        { tiles: [{ r: 0, c: 2 }, { r: 0, c: 3 }, { r: 1, c: 3 }, { r: 2, c: 3 }, { r: 2, c: 2 }, { r: 3, c: 2 }], hw: 0.034, seed: 4104 }
      );
    } else if (N === 5) {
      candidates.push(
        { tiles: [{ r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }], toPond: { r: 1, c: 3 }, hw: 0.048, seed: 5101 },
        { tiles: [{ r: 0, c: 4 }, { r: 1, c: 4 }], toPond: { r: 1, c: 3 }, hw: 0.032, seed: 5102 },
        { tiles: [{ r: 2, c: 3 }, { r: 3, c: 3 }, { r: 4, c: 3 }], fromPond: { r: 1, c: 3 }, hw: 0.046, seed: 5103 },
        { tiles: [{ r: 1, c: 0 }, { r: 2, c: 0 }, { r: 2, c: 1 }], toPond: { r: 3, c: 1 }, hw: 0.042, seed: 5104 },
        { tiles: [{ r: 1, c: 1 }, { r: 2, c: 1 }], hw: 0.030, seed: 5105 },
        { tiles: [{ r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }], fromPond: { r: 3, c: 1 }, hw: 0.042, seed: 5106 },
        { tiles: [{ r: 2, c: 2 }, { r: 3, c: 2 }, { r: 3, c: 3 }], hw: 0.030, seed: 5107 }
      );
    } else if (N === 6) {
      candidates.push(
        { tiles: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }], toPond: { r: 1, c: 2 }, hw: 0.048, seed: 6101 },
        { tiles: [{ r: 0, c: 4 }, { r: 0, c: 3 }], toPond: { r: 1, c: 3 }, hw: 0.034, seed: 6102 },
        { tiles: [{ r: 1, c: 4 }, { r: 2, c: 4 }, { r: 3, c: 4 }, { r: 4, c: 4 }, { r: 5, c: 4 }], fromPond: { r: 1, c: 3 }, hw: 0.046, seed: 6103 },
        { tiles: [{ r: 1, c: 5 }, { r: 2, c: 5 }, { r: 2, c: 4 }], hw: 0.030, seed: 6104 },
        { tiles: [{ r: 2, c: 1 }, { r: 3, c: 1 }], toPond: { r: 4, c: 1 }, hw: 0.044, seed: 6105 },
        { tiles: [{ r: 3, c: 0 }, { r: 4, c: 0 }], toPond: { r: 4, c: 1 }, hw: 0.030, seed: 6106 },
        { tiles: [{ r: 5, c: 1 }, { r: 5, c: 2 }, { r: 5, c: 3 }, { r: 5, c: 4 }], fromPond: { r: 4, c: 1 }, hw: 0.044, seed: 6107 },
        { tiles: [{ r: 2, c: 2 }, { r: 3, c: 2 }, { r: 3, c: 3 }, { r: 4, c: 3 }, { r: 4, c: 4 }], hw: 0.032, seed: 6108 }
      );
    } else if (N === 8) {
      candidates.push(
        { tiles: [{ r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 2 }], toPond: { r: 2, c: 2 }, hw: 0.050, seed: 8101 },
        { tiles: [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }], hw: 0.032, seed: 8102 },
        { tiles: [{ r: 0, c: 5 }, { r: 1, c: 5 }, { r: 1, c: 4 }, { r: 1, c: 3 }], toPond: { r: 2, c: 3 }, hw: 0.034, seed: 8103 },
        { tiles: [{ r: 2, c: 4 }, { r: 3, c: 4 }, { r: 4, c: 4 }, { r: 4, c: 5 }], fromPond: { r: 2, c: 3 }, toPond: { r: 5, c: 5 }, hw: 0.048, seed: 8104 },
        { tiles: [{ r: 3, c: 6 }, { r: 4, c: 6 }, { r: 5, c: 6 }], toPond: { r: 5, c: 5 }, hw: 0.032, seed: 8105 },
        { tiles: [{ r: 6, c: 5 }, { r: 6, c: 6 }, { r: 7, c: 6 }], fromPond: { r: 5, c: 5 }, hw: 0.044, seed: 8106 },
        { tiles: [{ r: 3, c: 1 }, { r: 4, c: 1 }], toPond: { r: 5, c: 1 }, hw: 0.044, seed: 8107 },
        { tiles: [{ r: 4, c: 0 }, { r: 5, c: 0 }], toPond: { r: 5, c: 1 }, hw: 0.030, seed: 8108 },
        { tiles: [{ r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 }], fromPond: { r: 5, c: 1 }, hw: 0.042, seed: 8109 },
        { tiles: [{ r: 3, c: 2 }, { r: 3, c: 3 }, { r: 4, c: 3 }, { r: 5, c: 3 }, { r: 6, c: 3 }], hw: 0.030, seed: 8110 }
      );
    } else if (N === 10) {
      candidates.push(
        { tiles: [{ r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 2 }], toPond: { r: 2, c: 2 }, hw: 0.050, seed: 10101 },
        { tiles: [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }], hw: 0.032, seed: 10102 },
        { tiles: [{ r: 2, c: 4 }, { r: 2, c: 5 }, { r: 2, c: 6 }], fromPond: { r: 2, c: 3 }, toPond: { r: 2, c: 7 }, hw: 0.048, seed: 10103 },
        { tiles: [{ r: 0, c: 6 }, { r: 1, c: 6 }, { r: 2, c: 6 }], hw: 0.032, seed: 10104 },
        { tiles: [{ r: 3, c: 7 }, { r: 4, c: 7 }], fromPond: { r: 2, c: 7 }, toPond: { r: 5, c: 7 }, hw: 0.046, seed: 10105 },
        { tiles: [{ r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 }], toPond: { r: 5, c: 7 }, hw: 0.030, seed: 10106 },
        { tiles: [{ r: 7, c: 7 }, { r: 8, c: 7 }, { r: 8, c: 8 }], fromPond: { r: 6, c: 7 }, hw: 0.044, seed: 10107 },
        { tiles: [{ r: 4, c: 2 }, { r: 5, c: 2 }, { r: 6, c: 2 }], toPond: { r: 7, c: 2 }, hw: 0.044, seed: 10108 },
        { tiles: [{ r: 5, c: 0 }, { r: 5, c: 1 }, { r: 6, c: 1 }, { r: 7, c: 1 }], toPond: { r: 7, c: 2 }, hw: 0.032, seed: 10109 },
        { tiles: [{ r: 8, c: 2 }, { r: 8, c: 3 }, { r: 8, c: 4 }, { r: 8, c: 5 }, { r: 8, c: 6 }, { r: 8, c: 7 }], fromPond: { r: 7, c: 2 }, hw: 0.042, seed: 10110 },
        { tiles: [{ r: 3, c: 4 }, { r: 4, c: 4 }, { r: 5, c: 4 }, { r: 6, c: 4 }, { r: 7, c: 4 }, { r: 8, c: 4 }], hw: 0.032, seed: 10111 }
      );
    } else if (N === 12) {
      candidates.push(
        { tiles: [{ r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 2 }], toPond: { r: 2, c: 2 }, hw: 0.050, seed: 12101 },
        { tiles: [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }], hw: 0.032, seed: 12102 },
        { tiles: [{ r: 0, c: 5 }, { r: 1, c: 5 }, { r: 1, c: 4 }, { r: 1, c: 3 }], toPond: { r: 2, c: 3 }, hw: 0.034, seed: 12103 },
        { tiles: [{ r: 3, c: 3 }, { r: 4, c: 3 }, { r: 5, c: 3 }, { r: 5, c: 4 }], fromPond: { r: 2, c: 3 }, toPond: { r: 6, c: 4 }, hw: 0.048, seed: 12104 },
        { tiles: [{ r: 2, c: 4 }, { r: 2, c: 5 }, { r: 2, c: 6 }, { r: 3, c: 6 }, { r: 3, c: 7 }, { r: 3, c: 8 }], fromPond: { r: 2, c: 3 }, toPond: { r: 3, c: 9 }, hw: 0.038, seed: 12105 },
        { tiles: [{ r: 0, c: 8 }, { r: 0, c: 9 }, { r: 1, c: 9 }, { r: 2, c: 9 }], toPond: { r: 3, c: 9 }, hw: 0.034, seed: 12106 },
        { tiles: [{ r: 4, c: 9 }, { r: 4, c: 8 }, { r: 5, c: 8 }], fromPond: { r: 3, c: 9 }, toPond: { r: 6, c: 8 }, hw: 0.044, seed: 12107 },
        { tiles: [{ r: 5, c: 10 }, { r: 6, c: 10 }, { r: 6, c: 9 }], toPond: { r: 6, c: 8 }, hw: 0.030, seed: 12108 },
        { tiles: [{ r: 8, c: 8 }, { r: 9, c: 8 }, { r: 9, c: 9 }, { r: 10, c: 9 }, { r: 10, c: 10 }], fromPond: { r: 7, c: 8 }, hw: 0.044, seed: 12109 },
        { tiles: [{ r: 7, c: 4 }, { r: 8, c: 4 }, { r: 8, c: 3 }], fromPond: { r: 6, c: 4 }, toPond: { r: 9, c: 3 }, hw: 0.044, seed: 12110 },
        { tiles: [{ r: 10, c: 3 }, { r: 10, c: 4 }, { r: 10, c: 5 }, { r: 10, c: 6 }, { r: 10, c: 7 }, { r: 10, c: 8 }, { r: 10, c: 9 }], fromPond: { r: 9, c: 3 }, hw: 0.042, seed: 12111 },
        { tiles: [{ r: 4, c: 1 }, { r: 5, c: 1 }, { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }], toPond: { r: 6, c: 4 }, hw: 0.032, seed: 12112 },
        { tiles: [{ r: 7, c: 0 }, { r: 8, c: 0 }, { r: 8, c: 1 }, { r: 9, c: 1 }, { r: 9, c: 2 }], toPond: { r: 9, c: 3 }, hw: 0.030, seed: 12113 },
        { tiles: [{ r: 4, c: 5 }, { r: 5, c: 5 }, { r: 5, c: 6 }, { r: 6, c: 6 }, { r: 7, c: 6 }, { r: 8, c: 6 }, { r: 9, c: 6 }, { r: 10, c: 6 }], hw: 0.032, seed: 12114 }
      );
    } else {
      const midR = Math.floor(N / 2);
      const midC = Math.floor(N / 2) - 1;
      const midFeedTiles = [{ r: 3, c: 3 }, { r: 4, c: 3 }, { r: 5, c: 3 }];
      for (let cc = 4; cc <= midC; cc++) midFeedTiles.push({ r: 5, c: cc });
      for (let rr = 6; rr < midR; rr++) midFeedTiles.push({ r: rr, c: midC });
      candidates.push(
        { tiles: [{ r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 2 }], toPond: { r: 2, c: 2 }, hw: 0.050, seed: 14101 },
        { tiles: [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }], hw: 0.032, seed: 14102 },
        { tiles: midFeedTiles, fromPond: { r: 2, c: 3 }, toPond: { r: midR, c: midC }, hw: 0.046, seed: 14103 },
        { tiles: [{ r: 2, c: 4 }, { r: 2, c: 5 }, { r: 2, c: 6 }, { r: 2, c: 7 }], fromPond: { r: 2, c: 3 }, hw: 0.036, seed: 14104 },
        { tiles: [{ r: 4, c: 9 }, { r: 5, c: 9 }], toPond: { r: 6, c: 9 }, hw: 0.046, seed: 14105 },
        { tiles: [{ r: 4, c: 10 }, { r: 5, c: 10 }, { r: 6, c: 10 }], toPond: { r: 6, c: 9 }, hw: 0.032, seed: 14106 },
        { tiles: [{ r: 8, c: 9 }, { r: 9, c: 9 }, { r: 10, c: 9 }, { r: 10, c: 10 }], fromPond: { r: 7, c: 9 }, hw: 0.044, seed: 14107 },
        N === 14
          ? { tiles: [{ r: 8, c: 6 }, { r: 9, c: 6 }, { r: 9, c: 5 }], fromPond: { r: 7, c: 6 }, toPond: { r: 10, c: 5 }, hw: 0.044, seed: 14108 }
          : { tiles: [{ r: midR + 1, c: midC }, { r: midR + 2, c: midC }, { r: midR + 2, c: midC + 1 }], fromPond: { r: midR, c: midC }, hw: 0.044, seed: 14108 },
        { tiles: [{ r: N - 8, c: 1 }, { r: N - 7, c: 1 }, { r: N - 6, c: 1 }, { r: N - 6, c: 2 }, { r: N - 5, c: 2 }], toPond: { r: N - 4, c: 2 }, hw: 0.034, seed: 14109 },
        { tiles: [{ r: N - 4, c: 3 }, { r: N - 3, c: 3 }, { r: N - 3, c: 4 }, { r: N - 2, c: 4 }], fromPond: { r: N - 4, c: 2 }, hw: 0.040, seed: 14110 },
        { tiles: [{ r: 1, c: N - 4 }, { r: 2, c: N - 4 }, { r: 2, c: N - 3 }], toPond: { r: 3, c: N - 3 }, hw: 0.036, seed: 14111 },
        { tiles: [{ r: 4, c: N - 3 }, { r: 5, c: N - 3 }, { r: 6, c: N - 3 }, { r: 7, c: N - 3 }], fromPond: { r: 3, c: N - 3 }, hw: 0.036, seed: 14112 }
      );
    }

    const pondByTileKey = new Map();
    ponds.forEach((p) => {
      p.connections = [];
      p.tiles.forEach((t) => pondByTileKey.set(`${t.r},${t.c}`, p));
    });

    const streams = [];
    const streamTileKeys = new Set();
    const streamCellMap = new Map();

    candidates.forEach((cand) => {
      const valid = cand.tiles.every((t) => (
        t.r >= 0 && t.r < N && t.c >= 0 && t.c < N &&
        !pondTileKeys.has(`${t.r},${t.c}`)
      ));
      if (!valid) return;
      if (cand.fromPond && !pondByTileKey.has(`${cand.fromPond.r},${cand.fromPond.c}`)) return;
      if (cand.toPond && !pondByTileKey.has(`${cand.toPond.r},${cand.toPond.c}`)) return;

      cand.tiles.forEach((t) => streamTileKeys.add(`${t.r},${t.c}`));

      const streamObj = {
        ...cand,
        fromPondObj: cand.fromPond ? pondByTileKey.get(`${cand.fromPond.r},${cand.fromPond.c}`) : null,
        toPondObj: cand.toPond ? pondByTileKey.get(`${cand.toPond.r},${cand.toPond.c}`) : null
      };
      streams.push(streamObj);

      cand.tiles.forEach((t, idx) => {
        const prevRef = idx > 0 ? cand.tiles[idx - 1] : cand.fromPond;
        const nextRef = idx < cand.tiles.length - 1 ? cand.tiles[idx + 1] : cand.toPond;
        const inDir = prevRef ? getStepDir(t, prevRef) : null;
        const outDir = nextRef ? getStepDir(t, nextRef) : null;
        const key = `${t.r},${t.c}`;
        if (!streamCellMap.has(key)) {
          streamCellMap.set(key, { r: t.r, c: t.c, branches: [] });
        }
        streamCellMap.get(key).branches.push({
          inDir,
          outDir,
          prevTile: prevRef || null,
          nextTile: nextRef || null,
          fromPond: idx === 0 && Boolean(cand.fromPond),
          toPond: idx === cand.tiles.length - 1 && Boolean(cand.toPond),
          hw: cand.hw || 0.044,
          isTributaryEnd: idx === cand.tiles.length - 1 && !cand.toPond && streamCellMap.get(key).branches.length > 0,
          seed: cand.seed + idx * 37
        });
      });

      if (streamObj.fromPondObj && cand.tiles.length > 0) {
        const outFromPondDir = getStepDir(cand.fromPond, cand.tiles[0]);
        if (outFromPondDir) {
          streamObj.fromPondObj.connections.push({
            tile: cand.fromPond,
            dir: outFromPondDir,
            isInlet: false,
            hw: cand.hw || 0.044,
            seed: cand.seed + 5
          });
        }
      }
      if (streamObj.toPondObj && cand.tiles.length > 0) {
        const lastTile = cand.tiles[cand.tiles.length - 1];
        const inToPondDir = getStepDir(cand.toPond, lastTile);
        if (inToPondDir) {
          streamObj.toPondObj.connections.push({
            tile: cand.toPond,
            dir: inToPondDir,
            isInlet: true,
            hw: cand.hw || 0.044,
            seed: cand.seed + 9
          });
        }
      }
    });

    return { streams, streamTileKeys, streamCellMap };
  }

  function buildSteplandGrid(N, ponds, streams) {
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

    const enforceStreamSlopes = () => {
      (streams || []).forEach((stream) => {
        const minAllowed = stream.toPondObj ? (stream.toPondObj.level || 0) : 0;
        let prevLvl = stream.fromPondObj ? (stream.fromPondObj.level || 0) : numLevels - 1;
        for (let i = 0; i < stream.tiles.length; i++) {
          const t = stream.tiles[i];
          let lvl = levels[t.r][t.c];
          if (lvl > prevLvl) lvl = prevLvl;
          if (lvl < minAllowed) lvl = minAllowed;
          levels[t.r][t.c] = lvl;
          prevLvl = lvl;
        }
      });
    };

    enforceStreamSlopes();

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
      enforceStreamSlopes();
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

    // Stream inlet/outlet stubs connecting smoothly beneath the pond water surface
    const pondStubsHalo = [];
    const pondStubsShore = [];
    const pondStubsWater = [];
    (pond.connections || []).forEach((conn) => {
      const dv = STREAM_DIRS[conn.dir];
      if (!dv) return;
      const tcu = conn.tile.c + 0.5 - half;
      const tcv = conn.tile.r + 0.5 - half;
      const edgeU = tcu + dv.du;
      const edgeV = tcv + dv.dv;
      const innerU = tcu + dv.du * 0.28;
      const innerV = tcv + dv.dv * 0.28;
      const hw = conn.hw || 0.048;

      const makeStubPoly = (mult) => {
        const w = hw * mult;
        const pts = [
          projPond(edgeU + dv.pu * w, edgeV + dv.pv * w, 0),
          projPond(innerU + dv.pu * w, innerV + dv.pv * w, 0),
          projPond(innerU - dv.pu * w, innerV - dv.pv * w, 0),
          projPond(edgeU - dv.pu * w, edgeV - dv.pv * w, 0)
        ];
        return `<polygon points="${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}"/>`;
      };
      const makeWaterStubPoly = () => {
        const pts = [
          projPond(edgeU + dv.pu * hw, edgeV + dv.pv * hw, waterDrop * 0.35),
          projPond(innerU + dv.pu * hw, innerV + dv.pv * hw, waterDrop),
          projPond(innerU - dv.pu * hw, innerV - dv.pv * hw, waterDrop),
          projPond(edgeU - dv.pu * hw, edgeV - dv.pv * hw, waterDrop * 0.35)
        ];
        return `<polygon points="${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}"/>`;
      };
      pondStubsHalo.push(makeStubPoly(1.38));
      pondStubsShore.push(makeStubPoly(1.18));
      pondStubsWater.push(makeWaterStubPoly());
    });

    const clipDef = `<clipPath id="${clipId}"><path d="${shorePath}"/></clipPath>`;
    const pondSvg = `
      <g class="iso-pond">
        <path d="${haloPath}" fill="#7db838" opacity="0.52"/>
        <g fill="#7db838" opacity="0.44">${pondStubsHalo.join('')}</g>
        ${backProps.join('')}
        <g fill="#694d34">${pondStubsShore.join('')}</g>
        <path d="${shorePath}" fill="#694d34" stroke="#567a27" stroke-width="0.9"/>
        <g clip-path="url(#${clipId})">
          <path d="${waterPath}" fill="url(#isoPondWaterGrad)"/>
          <path d="${shallowPath}" fill="url(#isoPondShallowGrad)" opacity="0.44"/>
          ${koiMarkup}
          ${ripplesMarkup}
          ${lilyPadsMarkup.join('')}
          <path d="${shorePath}" fill="none" stroke="rgba(34,20,10,0.28)" stroke-width="1.8"/>
        </g>
        <g fill="url(#isoPondWaterGrad)">${pondStubsWater.join('')}</g>
        ${frontProps.join('')}
      </g>
    `;

    return {
      depth: pondCenterPt.y,
      clipDef,
      pondSvg
    };
  }

  function renderStreamTileSegment(cell, cu, cv, level, steplandLevels, half, centerX, centerY, cosA, sinA, pitch, stepH) {
    const elevPx = level * stepH;
    const proj = (u, v, yOff = 0) => {
      const pt = projectIso(u, v, centerX, centerY, cosA, sinA, pitch);
      return { x: pt.x, y: pt.y - elevPx + yOff };
    };

    const waterDrop = 1.1 + (0.66 - pitch) * 1.1;
    const halos = [];
    const shores = [];
    const waters = [];
    const details = [];
    const waterfalls = [];

    let primaryJoinPt = null;

    (cell.branches || []).forEach((branch, bIdx) => {
      const inVec = branch.inDir ? STREAM_DIRS[branch.inDir] : null;
      const outVec = branch.outDir ? STREAM_DIRS[branch.outDir] : null;
      const baseHw = branch.hw || 0.044;

      const p0 = inVec
        ? { u: cu + inVec.du, v: cv + inVec.dv }
        : { u: cu - (outVec ? outVec.du * 0.24 : 0), v: cv - (outVec ? outVec.dv * 0.24 : 0) };
      const p2 = outVec
        ? { u: cu + outVec.du, v: cv + outVec.dv }
        : (branch.isTributaryEnd
          ? (primaryJoinPt || { u: cu, v: cv })
          : { u: cu - (inVec ? inVec.du * 0.14 : 0), v: cv - (inVec ? inVec.dv * 0.14 : 0) });

      const dx = p2.u - p0.u;
      const dy = p2.v - p0.v;
      const dLen = Math.hypot(dx, dy) || 1;
      const perpU = -dy / dLen;
      const perpV = dx / dLen;
      const curveSign = seededRand(branch.seed + 3) >= 0.5 ? 1 : -1;
      const isOpposite = inVec && outVec && (inVec.dr + outVec.dr === 0 && inVec.dc + outVec.dc === 0);
      const meanderMag = isOpposite
        ? (0.20 + seededRand(branch.seed) * 0.08) * curveSign
        : ((branch.isTributaryEnd ? 0.05 : 0.08) + seededRand(branch.seed) * (branch.isTributaryEnd ? 0.05 : 0.08)) * curveSign;
      const p1 = {
        u: (p0.u + p2.u) * 0.5 + perpU * meanderMag,
        v: (p0.v + p2.v) * 0.5 + perpV * meanderMag
      };

      const samples = 6;
      const centerSamples = [];
      for (let k = 0; k <= samples; k++) {
        const t = k / samples;
        const mt = 1 - t;
        const u = mt * mt * p0.u + 2 * mt * t * p1.u + t * t * p2.u;
        const v = mt * mt * p0.v + 2 * mt * t * p1.v + t * t * p2.v;

        let pu;
        let pv;
        if (k === 0 && inVec) {
          pu = inVec.pu;
          pv = inVec.pv;
        } else if (k === samples && outVec) {
          pu = outVec.pu;
          pv = outVec.pv;
        } else {
          const tu = 2 * mt * (p1.u - p0.u) + 2 * t * (p2.u - p1.u);
          const tv = 2 * mt * (p1.v - p0.v) + 2 * t * (p2.v - p1.v);
          const tLen = Math.hypot(tu, tv) || 1;
          pu = -tv / tLen;
          pv = tu / tLen;
        }

        let hw = baseHw;
        if (!inVec && t < 0.4) {
          hw = baseHw * (0.48 + (t / 0.4) * 0.52);
        } else if (!outVec && !branch.isTributaryEnd && t > 0.65) {
          hw = baseHw * (1 + ((t - 0.65) / 0.35) * 0.25);
        }
        centerSamples.push({ u, v, pu, pv, hw });
      }

      if (bIdx === 0) {
        const midSample = centerSamples[Math.floor(samples / 2)];
        primaryJoinPt = { u: midSample.u, v: midSample.v };
      }

      const buildRibbonPath = (scale, yOff) => {
        const lCoords = centerSamples.map((s) => {
          const pt = proj(s.u + s.pu * s.hw * scale, s.v + s.pv * s.hw * scale, yOff);
          return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
        });
        const rCoords = centerSamples.slice().reverse().map((s) => {
          const pt = proj(s.u - s.pu * s.hw * scale, s.v - s.pv * s.hw * scale, yOff);
          return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
        });
        return `M ${lCoords.join(' L ')} L ${rCoords.join(' L ')} Z`;
      };

      halos.push(`<path d="${buildRibbonPath(1.38, 0)}"/>`);
      shores.push(`<path d="${buildRibbonPath(1.18, 0)}"/>`);
      waters.push(`<path d="${buildRibbonPath(1.0, waterDrop * 0.55)}"/>`);

      details.push(`<path d="${buildRibbonPath(0.45, waterDrop * 0.5)}" fill="url(#isoPondShallowGrad)" opacity="0.45"/>`);

      const flowCoords = centerSamples.map((s, idx) => {
        const off = (idx === 0 || idx === samples) ? 0 : (seededRand(branch.seed + idx * 13) - 0.5) * 0.015;
        const pt = proj(s.u + s.pu * off, s.v + s.pv * off, waterDrop * 0.45);
        return `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      }).join(' ');
      details.push(`<path class="iso-stream-flow" d="${flowCoords}" fill="none" stroke="#e0f7fa" stroke-width="0.78" stroke-linecap="round" stroke-dasharray="3 4"/>`);

      if (bIdx === 0 && seededRand(branch.seed + 51) > 0.45) {
        const side = seededRand(branch.seed + 57) > 0.5 ? 1 : -1;
        const midS = centerSamples[3];
        const pebblePt = proj(midS.u + midS.pu * midS.hw * 1.48 * side, midS.v + midS.pv * midS.hw * 1.48 * side, 0);
        details.push(`
          <g transform="translate(${pebblePt.x.toFixed(1)}, ${pebblePt.y.toFixed(1)})">
            <ellipse cx="0" cy="0.3" rx="1.9" ry="1.0" fill="#7d7a74"/>
            <ellipse cx="-0.2" cy="-0.1" rx="1.4" ry="0.7" fill="#a8a49e"/>
          </g>
        `);
      }

      if (!inVec) {
        const srcPt = proj(p0.u, p0.v, 0);
        const rockPt = proj(p0.u - (outVec ? outVec.du * 0.08 : 0), p0.v - (outVec ? outVec.dv * 0.08 : 0), 0);
        shores.push(`<ellipse cx="${srcPt.x.toFixed(1)}" cy="${(srcPt.y + waterDrop * 0.35).toFixed(1)}" rx="2.9" ry="1.5"/>`);
        waters.push(`<ellipse cx="${srcPt.x.toFixed(1)}" cy="${(srcPt.y + waterDrop * 0.55).toFixed(1)}" rx="2.3" ry="1.2"/>`);
        details.push(`
          <g transform="translate(${rockPt.x.toFixed(1)}, ${rockPt.y.toFixed(1)})">
            <ellipse cx="0" cy="0.4" rx="2.6" ry="1.3" fill="#2c3e18" opacity="0.22"/>
            <polygon points="-2.4,0 -1.2,-2.6 1.0,-2.1 0,0.8" fill="#9e9b95"/>
            <polygon points="1.0,-2.1 2.5,-0.4 1.8,0.8 0,0.8" fill="#76736d"/>
          </g>
        `);
      }

      if (!outVec && !branch.isTributaryEnd) {
        const endPt = proj(p2.u, p2.v, 0);
        halos.push(`<ellipse cx="${endPt.x.toFixed(1)}" cy="${(endPt.y + 0.1).toFixed(1)}" rx="4.6" ry="2.3"/>`);
        shores.push(`<ellipse cx="${endPt.x.toFixed(1)}" cy="${(endPt.y + 0.2).toFixed(1)}" rx="3.8" ry="1.9"/>`);
        waters.push(`<ellipse cx="${endPt.x.toFixed(1)}" cy="${(endPt.y + waterDrop * 0.55).toFixed(1)}" rx="3.2" ry="1.6"/>`);
        details.push(`<ellipse cx="${endPt.x.toFixed(1)}" cy="${(endPt.y + waterDrop * 0.5).toFixed(1)}" rx="1.8" ry="0.9" fill="url(#isoPondShallowGrad)" opacity="0.5"/>`);
      }

      if (branch.prevTile && steplandLevels[branch.prevTile.r]) {
        const prevLevel = steplandLevels[branch.prevTile.r][branch.prevTile.c];
        if (prevLevel > level) {
          const sp = proj(p0.u, p0.v, waterDrop * 0.5);
          details.push(`
            <ellipse cx="${sp.x.toFixed(1)}" cy="${sp.y.toFixed(1)}" rx="2.8" ry="1.4" fill="#e0f7fa" opacity="0.74"/>
            <ellipse cx="${sp.x.toFixed(1)}" cy="${(sp.y - 0.3).toFixed(1)}" rx="1.6" ry="0.8" fill="#ffffff" opacity="0.82"/>
          `);
        }
      }

      if (outVec && branch.nextTile && steplandLevels[branch.nextTile.r]) {
        const nextLevel = steplandLevels[branch.nextTile.r][branch.nextTile.c];
        if (level > nextLevel) {
          const nyScreen = outVec.nu * sinA + outVec.nv * cosA;
          if (nyScreen > 0.005) {
            const dropPx = (level - nextLevel) * stepH;
            const eL = proj(p2.u + outVec.pu * baseHw, p2.v + outVec.pv * baseHw, waterDrop * 0.4);
            const eR = proj(p2.u - outVec.pu * baseHw, p2.v - outVec.pv * baseHw, waterDrop * 0.4);
            const fallPts = `${eL.x.toFixed(1)},${eL.y.toFixed(1)} ${eR.x.toFixed(1)},${eR.y.toFixed(1)} ${eR.x.toFixed(1)},${(eR.y + dropPx).toFixed(1)} ${eL.x.toFixed(1)},${(eL.y + dropPx).toFixed(1)}`;
            const midX = (eL.x + eR.x) * 0.5;
            const midYTop = (eL.y + eR.y) * 0.5;
            waterfalls.push(`
              <g class="iso-stream-waterfall">
                <polygon points="${fallPts}" fill="url(#isoPondWaterGrad)"/>
                <line x1="${midX.toFixed(1)}" y1="${midYTop.toFixed(1)}" x2="${midX.toFixed(1)}" y2="${(midYTop + dropPx).toFixed(1)}" stroke="#e0f7fa" stroke-width="0.85" stroke-linecap="round" opacity="0.8"/>
                <line x1="${eL.x.toFixed(1)}" y1="${eL.y.toFixed(1)}" x2="${eR.x.toFixed(1)}" y2="${eR.y.toFixed(1)}" stroke="#e0f7fa" stroke-width="1.0" stroke-linecap="round" opacity="0.85"/>
                <ellipse cx="${midX.toFixed(1)}" cy="${(midYTop + dropPx).toFixed(1)}" rx="2.8" ry="1.3" fill="#e0f7fa" opacity="0.78"/>
              </g>
            `);
          }
        }
      }
    });

    return `
      <g class="iso-stream" pointer-events="none">
        <g fill="#7db838" opacity="0.42">${halos.join('')}</g>
        <g fill="#694d34">${shores.join('')}</g>
        <g fill="url(#isoPondWaterGrad)">${waters.join('')}</g>
        ${details.join('')}
        ${waterfalls.join('')}
      </g>
    `;
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
    const { streams, streamTileKeys, streamCellMap } = buildForestStreams(N, ponds, pondTileKeys);
    const steplandLevels = buildSteplandGrid(N, ponds, streams);
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

      const streamCell = streamCellMap.get(`${r},${c}`);
      if (streamCell) {
        tilesMarkup.push(
          renderStreamTileSegment(streamCell, cu, cv, level, steplandLevels, half, centerX, centerY, cosA, sinA, pitch, stepH)
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
      } else if (!pondTileKeys.has(`${r},${c}`) && !streamTileKeys.has(`${r},${c}`)) {
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
        panX: 0,
        panY: 0,
        interactionMode: 'rotate',
        manualMode: false,
        yaw: DEFAULT_YAW,
        pitch: DEFAULT_PITCH,
        selectedIdx: null,
        scrollZoomActive: false,
        eventsBound: false,
        isDragging: false,
        isPinching: false,
        pinchCooldownUntil: 0,
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

  function getEffectiveMode(state) {
    if (state.manualMode) return state.interactionMode;
    return state.zoom > 1.02 ? 'pan' : 'rotate';
  }

  function clampCameraPan(container, state, rawX, rawY, targetZoom) {
    const z = typeof targetZoom === 'number' ? targetZoom : state.zoom;
    if (z <= 1.02 && !(state.manualMode && state.interactionMode === 'pan')) {
      return { x: 0, y: 0 };
    }
    const viewport = container.querySelector('.iso-stage-viewport');
    const scaler = container.querySelector('.iso-island-scaler');
    if (!viewport || !scaler) {
      return { x: rawX, y: rawY };
    }
    const vw = viewport.clientWidth || 320;
    const vh = viewport.clientHeight || 240;
    const sw = scaler.offsetWidth || vw;
    const sh = scaler.offsetHeight || vh;
    const maxX = sw * z > vw
      ? (sw * z - vw) * 0.5 + 24
      : Math.max(24, (vw - sw * z) * 0.35);
    const maxY = sh * z > vh
      ? (sh * z - vh) * 0.5 + 20
      : Math.max(16, (vh - sh * z) * 0.25);
    return {
      x: Math.max(-maxX, Math.min(maxX, rawX)),
      y: Math.max(-maxY, Math.min(maxY, rawY))
    };
  }

  function syncCameraToolbarUI(container, state) {
    const effectiveMode = getEffectiveMode(state);
    const zoomResetBtn = container.querySelector('.iso-zoom-reset');
    if (zoomResetBtn) {
      zoomResetBtn.textContent = `${Math.round(state.zoom * 100)}%`;
    }
    const modeBtns = container.querySelectorAll('.iso-mode-btn');
    modeBtns.forEach((btn) => {
      const m = btn.getAttribute('data-interaction-mode');
      const active = m === effectiveMode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    const viewport = container.querySelector('.iso-stage-viewport');
    if (viewport) {
      viewport.style.cursor = effectiveMode === 'pan' ? 'move' : 'grab';
      viewport.style.touchAction = (effectiveMode === 'pan' || state.zoom > 1.02) ? 'none' : 'pan-y';
    }
  }

  function applyCameraTransform(container, state) {
    const clamped = clampCameraPan(container, state, state.panX, state.panY, state.zoom);
    state.panX = clamped.x;
    state.panY = clamped.y;

    const scaler = container.querySelector('.iso-island-scaler');
    if (scaler) {
      scaler.style.transform = `translate3d(${state.panX.toFixed(2)}px, ${state.panY.toFixed(2)}px, 0) scale(${state.zoom.toFixed(4)})`;
    }
    syncCameraToolbarUI(container, state);
  }

  function setCameraZoom(container, state, rawNextZoom, focalClientX, focalClientY) {
    const oldZoom = state.zoom;
    const nextZoom = Math.max(0.4, Math.min(4.0, Number(rawNextZoom.toFixed(3))));
    if (nextZoom === oldZoom && state.zoom <= 1.02) {
      applyCameraTransform(container, state);
      return;
    }

    let nextPanX = state.panX;
    let nextPanY = state.panY;

    if (nextZoom <= 1.02) {
      if (!state.manualMode) {
        state.interactionMode = 'rotate';
      }
      if (!state.manualMode || state.interactionMode === 'rotate') {
        nextPanX = 0;
        nextPanY = 0;
      }
    } else {
      if (!state.manualMode) {
        state.interactionMode = 'pan';
      }
      if (typeof focalClientX === 'number' && typeof focalClientY === 'number') {
        const scaler = container.querySelector('.iso-island-scaler');
        if (scaler) {
          const rect = scaler.getBoundingClientRect();
          const baseCenterX = rect.left + rect.width * 0.5 - state.panX;
          const baseCenterY = rect.top + rect.height * 0.5 - state.panY;
          const fx = focalClientX - baseCenterX;
          const fy = focalClientY - baseCenterY;
          const ratio = nextZoom / oldZoom;
          nextPanX = fx - (fx - state.panX) * ratio;
          nextPanY = fy - (fy - state.panY) * ratio;
        }
      } else {
        const ratio = nextZoom / oldZoom;
        nextPanX = state.panX * ratio;
        nextPanY = state.panY * ratio;
      }
    }

    state.zoom = Number(nextZoom.toFixed(2));
    state.panX = nextPanX;
    state.panY = nextPanY;
    applyCameraTransform(container, state);
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
      const inViewport = Boolean(e.target.closest('.iso-stage-viewport'));
      if (!inViewport) return;
      if (!state.scrollZoomActive && !e.ctrlKey) return;
      if (e.deltaY === 0) return;
      if (!e.ctrlKey && Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      const nextZoom = e.ctrlKey
        ? state.zoom * Math.exp(-e.deltaY * 0.01)
        : state.zoom + (e.deltaY < 0 ? 0.2 : -0.2);
      setCameraZoom(container, state, nextZoom, e.clientX, e.clientY);
    }, { passive: false });

    // Multi-touch pinch-to-zoom & 2-finger pan for mobile/tablet
    let pinchActive = false;
    let pinchStartDist = 0;
    let pinchStartZoom = 1.0;
    let pinchStartPanX = 0;
    let pinchStartPanY = 0;
    let pinchStartFx = 0;
    let pinchStartFy = 0;
    let pinchBaseCenterX = 0;
    let pinchBaseCenterY = 0;

    // Single-pointer drag (rotates OR pans depending on active mode)
    let pointerDown = false;
    let activePointerId = null;
    let dragMode = 'rotate';
    let startX = 0;
    let startY = 0;
    let startYaw = DEFAULT_YAW;
    let startPitch = DEFAULT_PITCH;
    let startPanX = 0;
    let startPanY = 0;

    const cancelSingleDrag = () => {
      pointerDown = false;
      activePointerId = null;
      state.isDragging = false;
    };

    container.addEventListener('touchstart', (e) => {
      const viewport = e.target.closest('.iso-stage-viewport');
      if (!viewport) return;
      if (e.touches.length === 2) {
        e.preventDefault();
        cancelSingleDrag();
        pinchActive = true;
        state.isPinching = true;
        state.scrollZoomActive = true;

        const t0 = e.touches[0];
        const t1 = e.touches[1];
        pinchStartDist = Math.max(10, Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY));
        pinchStartZoom = state.zoom;
        pinchStartPanX = state.panX;
        pinchStartPanY = state.panY;

        const midX = (t0.clientX + t1.clientX) * 0.5;
        const midY = (t0.clientY + t1.clientY) * 0.5;
        const scaler = container.querySelector('.iso-island-scaler');
        if (scaler) {
          const rect = scaler.getBoundingClientRect();
          pinchBaseCenterX = rect.left + rect.width * 0.5 - state.panX;
          pinchBaseCenterY = rect.top + rect.height * 0.5 - state.panY;
        } else {
          const vpRect = viewport.getBoundingClientRect();
          pinchBaseCenterX = vpRect.left + vpRect.width * 0.5 - state.panX;
          pinchBaseCenterY = vpRect.top + vpRect.height * 0.5 - state.panY;
        }
        pinchStartFx = midX - pinchBaseCenterX;
        pinchStartFy = midY - pinchBaseCenterY;
      }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
      if (!pinchActive) return;
      if (e.touches.length === 2) {
        e.preventDefault();
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const currDist = Math.max(10, Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY));
        const midX = (t0.clientX + t1.clientX) * 0.5;
        const midY = (t0.clientY + t1.clientY) * 0.5;

        const rawZoom = pinchStartZoom * (currDist / pinchStartDist);
        const nextZoom = Math.max(0.4, Math.min(4.0, rawZoom));
        const ratio = nextZoom / pinchStartZoom;
        const currFx = midX - pinchBaseCenterX;
        const currFy = midY - pinchBaseCenterY;

        state.zoom = Number(nextZoom.toFixed(2));
        if (state.zoom <= 1.02 && !state.manualMode) {
          state.interactionMode = 'rotate';
          state.panX = 0;
          state.panY = 0;
        } else {
          if (state.zoom > 1.02 && !state.manualMode) {
            state.interactionMode = 'pan';
          }
          state.panX = currFx - (pinchStartFx - pinchStartPanX) * ratio;
          state.panY = currFy - (pinchStartFy - pinchStartPanY) * ratio;
        }
        applyCameraTransform(container, state);
      }
    }, { passive: false });

    const endPinch = (e) => {
      if (!pinchActive) return;
      if (!e.touches || e.touches.length < 2) {
        pinchActive = false;
        state.isPinching = false;
        state.pinchCooldownUntil = Date.now() + 180;
        cancelSingleDrag();
      }
    };

    container.addEventListener('touchend', endPinch);
    container.addEventListener('touchcancel', endPinch);

    container.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const viewport = e.target.closest('.iso-stage-viewport');
      if (!viewport) return;
      if (pinchActive || state.isPinching || Date.now() < state.pinchCooldownUntil) return;
      if (pointerDown && e.pointerType === 'touch') {
        cancelSingleDrag();
        return;
      }

      state.scrollZoomActive = true;
      pointerDown = true;
      activePointerId = e.pointerId;
      state.isDragging = false;
      dragMode = (e.shiftKey || e.altKey)
        ? (getEffectiveMode(state) === 'pan' ? 'rotate' : 'pan')
        : getEffectiveMode(state);
      startX = e.clientX;
      startY = e.clientY;
      startYaw = state.yaw;
      startPitch = state.pitch;
      startPanX = state.panX;
      startPanY = state.panY;
    });

    window.addEventListener('pointermove', (e) => {
      if (pinchActive || state.isPinching) return;
      if (!pointerDown || e.pointerId !== activePointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!state.isDragging && Math.hypot(dx, dy) > 6) {
        state.isDragging = true;
        const viewport = container.querySelector('.iso-stage-viewport');
        if (viewport) viewport.style.cursor = dragMode === 'pan' ? 'grabbing' : 'grabbing';
      }
      if (state.isDragging) {
        if (dragMode === 'pan') {
          state.panX = startPanX + dx;
          state.panY = startPanY + dy;
          applyCameraTransform(container, state);
        } else {
          state.yaw = startYaw - dx * 0.009;
          state.pitch = Math.max(0.34, Math.min(0.66, startPitch + dy * 0.0025));
          scheduleRotationFrame(container, state);
        }
      }
    });

    const endDrag = (e) => {
      if (!pointerDown || (e && activePointerId !== null && e.pointerId !== activePointerId)) return;
      pointerDown = false;
      activePointerId = null;
      syncCameraToolbarUI(container, state);
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
    const zoomPct = Math.round(state.zoom * 100);
    const effectiveMode = getEffectiveMode(state);
    const viewportTouchAction = (effectiveMode === 'pan' || state.zoom > 1.02) ? 'none' : 'pan-y';
    const viewportCursor = effectiveMode === 'pan' ? 'move' : 'grab';
    const scalerStyle = `width:100%;max-width:${baseWidth}px;transform:translate3d(${state.panX.toFixed(2)}px, ${state.panY.toFixed(2)}px, 0) scale(${state.zoom.toFixed(4)});transform-origin:50% 50%;`;

    container.innerHTML = `
      <div class="iso-forest-stage" data-empty="${geom.orderedItems.length === 0 ? 'true' : 'false'}">
        <div class="iso-stage-toolbar">
          <div class="iso-stage-summary">
            <span class="iso-summary-count">${geom.orderedItems.length}</span> ${geom.orderedItems.length === 1 ? 'tree' : 'trees'} planted
            <span class="iso-inspector-sep">·</span>
            <span>${N}×${N} grove</span>
          </div>
          <div class="iso-toolbar-actions">
            <div class="iso-mode-controls" role="group" aria-label="Interaction mode">
              <button type="button" class="iso-mode-btn ${effectiveMode === 'rotate' ? 'is-active' : ''}" data-interaction-mode="rotate" title="Drag to rotate forest" aria-pressed="${effectiveMode === 'rotate'}">Rotate</button>
              <button type="button" class="iso-mode-btn ${effectiveMode === 'pan' ? 'is-active' : ''}" data-interaction-mode="pan" title="Drag to move across forest" aria-pressed="${effectiveMode === 'pan'}">Move</button>
            </div>
            <div class="iso-zoom-controls" role="group" aria-label="Forest zoom controls">
              <button type="button" class="iso-zoom-btn" data-zoom-delta="-0.2" title="Zoom out" aria-label="Zoom out">−</button>
              <button type="button" class="iso-zoom-btn iso-zoom-reset" data-zoom-reset="1" title="Reset zoom" aria-label="Reset zoom">${zoomPct}%</button>
              <button type="button" class="iso-zoom-btn" data-zoom-delta="0.2" title="Zoom in" aria-label="Zoom in">+</button>
            </div>
          </div>
        </div>

        <div class="iso-stage-viewport" style="cursor:${viewportCursor};user-select:none;touch-action:${viewportTouchAction};">
          <div class="iso-island-scaler" style="${scalerStyle}">
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

    const modeBtns = container.querySelectorAll('.iso-mode-btn');
    modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextMode = btn.getAttribute('data-interaction-mode');
        if (nextMode === 'rotate' || nextMode === 'pan') {
          state.interactionMode = nextMode;
          state.manualMode = true;
          syncCameraToolbarUI(container, state);
        }
      });
    });

    const zoomBtns = container.querySelectorAll('.iso-zoom-btn');
    zoomBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.zoomReset) {
          state.zoom = 1.0;
          state.panX = 0;
          state.panY = 0;
          state.manualMode = false;
          state.interactionMode = 'rotate';
          applyCameraTransform(container, state);
        } else {
          const delta = parseFloat(btn.dataset.zoomDelta || '0');
          setCameraZoom(container, state, state.zoom + delta);
        }
      });
    });

    const treeNodes = container.querySelectorAll('.iso-plant-pin');
    treeNodes.forEach((node) => {
      const selectTree = () => {
        if (state.isDragging || state.isPinching || Date.now() < state.pinchCooldownUntil) return;
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
    if (container.querySelector('.iso-island-scaler')) {
      setCameraZoom(container, state, state.zoom + delta);
      return;
    }
    state.zoom = Math.max(0.4, Math.min(4.0, Number((state.zoom + delta).toFixed(2))));
    if (Array.isArray(items)) {
      renderForestDiorama(container, items);
    }
  }

  root.renderForestDiorama = renderForestDiorama;
  root.adjustDioramaZoom = adjustDioramaZoom;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
