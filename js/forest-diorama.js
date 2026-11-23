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
  const PADDING_TOP = 104;
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

  function renderScallopedTurfEdge(pStart, pEnd, isShaded, gridSize, seedBase) {
    const segments = Math.max(10, gridSize * 3);
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
    const half = N / 2;

    const slots = buildTileSlots(N);
    const orderedItems = items.slice();
    const occupiedMap = new Map();
    orderedItems.forEach((item, idx) => {
      const slot = slots[idx % slots.length];
      occupiedMap.set(`${slot.r},${slot.c}`, { item, idx });
    });

    // 4 platform corners in clockwise grid order
    const corners = [
      projectIso(-half, -half, centerX, centerY, cosA, sinA, pitch),
      projectIso(half, -half, centerX, centerY, cosA, sinA, pitch),
      projectIso(half, half, centerX, centerY, cosA, sinA, pitch),
      projectIso(-half, half, centerX, centerY, cosA, sinA, pitch)
    ];

    // Outward edge normals in (u, v) grid space
    const edgeDefs = [
      { idx: 0, a: corners[0], b: corners[1], nu: 0, nv: -1, stoneSeed: 100, turfSeed: 11 },
      { idx: 1, a: corners[1], b: corners[2], nu: 1, nv: 0, stoneSeed: 900, turfSeed: 77 },
      { idx: 2, a: corners[2], b: corners[3], nu: 0, nv: 1, stoneSeed: 350, turfSeed: 43 },
      { idx: 3, a: corners[3], b: corners[0], nu: -1, nv: 0, stoneSeed: 620, turfSeed: 99 }
    ];

    const visibleEdges = [];
    edgeDefs.forEach((edge) => {
      const nyScreen = edge.nu * sinA + edge.nv * cosA;
      const nxScreen = edge.nu * cosA - edge.nv * sinA;
      if (nyScreen > 0.005) {
        // Ensure left-to-right winding order for clean wall polygon & scalloped turf
        const leftPt = edge.a.x <= edge.b.x ? edge.a : edge.b;
        const rightPt = edge.a.x <= edge.b.x ? edge.b : edge.a;
        const isShaded = nxScreen >= 0;
        visibleEdges.push({
          ...edge,
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
      const wallPts = `${p0.x.toFixed(1)},${p0.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)} ${p1.x.toFixed(1)},${(p1.y + wallDepth).toFixed(1)} ${p0.x.toFixed(1)},${(p0.y + wallDepth).toFixed(1)}`;
      const clipId = `soil-clip-${state.uid}-e${edge.idx}`;
      const gradId = edge.isShaded ? 'isoSoilGradR' : 'isoSoilGradL';

      clipDefs.push(`<clipPath id="${clipId}"><polygon points="${wallPts}"/></clipPath>`);
      wallsMarkup.push(
        `<polygon points="${wallPts}" fill="url(#${gradId})"/>` +
        `<g clip-path="url(#${clipId})">${renderSoilStones(p0, p1, edge.isShaded, N, wallDepth, edge.stoneSeed)}</g>`
      );
      turfMarkup.push(renderScallopedTurfEdge(p0, p1, edge.isShaded, N, edge.turfSeed));
    });

    // Checkerboard grass platform tiles sorted back-to-front along rotated depth
    const cells = [];
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const cu = c + 0.5 - half;
        const cv = r + 0.5 - half;
        const depth = cu * sinA + cv * cosA;
        cells.push({ r, c, cu, cv, depth });
      }
    }
    cells.sort((a, b) => a.depth - b.depth || a.r - b.r || a.c - b.c);

    const tilesMarkup = [];
    const terrainPropsMarkup = [];
    const pinPositions = [];

    cells.forEach(({ r, c, cu, cv }, orderIdx) => {
      const u0 = c - half;
      const v0 = r - half;
      const p0 = projectIso(u0, v0, centerX, centerY, cosA, sinA, pitch);
      const p1 = projectIso(u0 + 1, v0, centerX, centerY, cosA, sinA, pitch);
      const p2 = projectIso(u0 + 1, v0 + 1, centerX, centerY, cosA, sinA, pitch);
      const p3 = projectIso(u0, v0 + 1, centerX, centerY, cosA, sinA, pitch);

      const polyPts = `${p0.x.toFixed(1)},${p0.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)} ${p3.x.toFixed(1)},${p3.y.toFixed(1)}`;
      const isEven = (r + c) % 2 === 0;
      const fill = isEven ? '#aedc56' : '#9bce44';
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

      const centerPt = projectIso(cu, cv, centerX, centerY, cosA, sinA, pitch);
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
      } else {
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
    const turfGroup = svg.querySelector('.iso-turf-layer');
    const propsGroup = svg.querySelector('.iso-terrain-props-layer');

    if (defsEl) defsEl.innerHTML = SVG_STATIC_DEFS + geom.clipDefs;
    if (shadowPoly) shadowPoly.setAttribute('points', geom.shadowPts);
    if (wallsGroup) wallsGroup.innerHTML = geom.wallsMarkup;
    if (tilesGroup) tilesGroup.innerHTML = geom.tilesMarkup;
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
