/**
 * Isometric Forest Platform Diorama Renderer
 * Renders the revamped floating isometric grassland & soil platform while preserving
 * the original botanical plant UI from /plants/registry.js (getBotanicalPlotIconSvg).
 */
(function (root) {
  'use strict';

  const TILE_W = 68;
  const TILE_H = 34;
  const WALL_DEPTH = 42;
  const PADDING_X = 72;
  const PADDING_TOP = 104;
  const PADDING_BOTTOM = 74;
  const PLANT_SVG_UNITS = 84;

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
    return Math.min(20, Math.ceil(Math.sqrt(count * 1.15)));
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

  function isoCenter(r, c, originX, originY) {
    return {
      x: originX + (c - r) * (TILE_W / 2),
      y: originY + (c + r) * (TILE_H / 2)
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

  function renderSoilStones(edgePoints, isRightFace, gridSize) {
    const p0 = edgePoints[0];
    const p1 = edgePoints[1];
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const numStones = Math.max(8, Math.min(28, gridSize * 3));
    const stones = [];

    for (let i = 0; i < numStones; i++) {
      const t = 0.05 + seededRand(i * 41 + (isRightFace ? 900 : 100)) * 0.90;
      const depth = 0.25 + seededRand(i * 73 + (isRightFace ? 500 : 200)) * 0.58;
      const cx = p0.x + dx * t;
      const cy = p0.y + dy * t + depth * WALL_DEPTH;
      const rx = 3.5 + seededRand(i * 19 + 7) * 5.8;
      const ry = rx * (0.45 + seededRand(i * 23 + 3) * 0.25);
      const rot = (isRightFace ? -20 : 20) + (seededRand(i * 13) - 0.5) * 24;
      const fill = isRightFace
        ? (i % 3 === 0 ? '#704d34' : i % 3 === 1 ? '#4d301d' : '#65442b')
        : (i % 3 === 0 ? '#976f4e' : i % 3 === 1 ? '#6e492e' : '#8a6242');
      stones.push(
        `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})" fill="${fill}" opacity="0.88"/>`
      );
    }
    return stones.join('');
  }

  function renderScallopedTurfEdge(pStart, pEnd, isRightFace, gridSize) {
    const segments = Math.max(10, gridSize * 3);
    const dx = pEnd.x - pStart.x;
    const dy = pEnd.y - pStart.y;
    let d = `M ${pStart.x.toFixed(1)},${pStart.y.toFixed(1)}`;
    for (let i = 0; i < segments; i++) {
      const t1 = (i + 0.5) / segments;
      const t2 = (i + 1) / segments;
      const drop = 5 + seededRand(i * 29 + (isRightFace ? 77 : 11)) * 6.5;
      const mx = pStart.x + dx * t1;
      const my = pStart.y + dy * t1 + drop;
      const ex = pStart.x + dx * t2;
      const ey = pStart.y + dy * t2 + (i === segments - 1 ? 0 : 1.5);
      d += ` Q ${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
    }
    d += ` L ${pEnd.x.toFixed(1)},${(pEnd.y - 2).toFixed(1)} L ${pStart.x.toFixed(1)},${(pStart.y - 2).toFixed(1)} Z`;
    const shadowD = d.replace(/Z$/, '');
    const fill = isRightFace ? '#78b030' : '#96cf43';
    return `
      <path d="${shadowD}" fill="none" stroke="rgba(26,14,6,0.35)" stroke-width="3" transform="translate(0, 2)"/>
      <path d="${d}" fill="${fill}"/>
    `;
  }

  const containerStates = new WeakMap();

  function getContainerState(container) {
    let st = containerStates.get(container);
    if (!st) {
      st = {
        zoom: 1.0,
        selectedIdx: null,
        scrollZoomActive: false,
        scrollZoomBound: false,
        lastWheelZoomAt: 0,
        latestItems: [],
        latestOpts: {}
      };
      containerStates.set(container, st);
    }
    return st;
  }

  function bindContainerScrollZoom(container, state) {
    if (state.scrollZoomBound) return;
    state.scrollZoomBound = true;

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
      const nextZoom = Math.max(0.6, Math.min(2.2, Number((state.zoom + delta).toFixed(2))));
      if (nextZoom !== state.zoom) {
        state.zoom = nextZoom;
        renderForestDiorama(container, state.latestItems, state.latestOpts);
      }
    }, { passive: false });
  }

  function renderForestDiorama(container, filteredItems, options) {
    if (!container) return;
    const opts = options || {};
    const state = getContainerState(container);
    const items = Array.isArray(filteredItems) ? filteredItems : [];
    state.latestItems = items;
    state.latestOpts = opts;
    bindContainerScrollZoom(container, state);
    const N = computeGridSize(items.length);

    const diamondW = N * TILE_W;
    const diamondH = N * TILE_H;
    const svgW = diamondW + PADDING_X * 2;
    const svgH = diamondH + PADDING_TOP + WALL_DEPTH + PADDING_BOTTOM;
    const originX = svgW / 2;
    const originY = PADDING_TOP;

    const topV = { x: originX, y: originY };
    const rightV = { x: originX + (N * TILE_W) / 2, y: originY + (N * TILE_H) / 2 };
    const bottomV = { x: originX, y: originY + N * TILE_H };
    const leftV = { x: originX - (N * TILE_W) / 2, y: originY + (N * TILE_H) / 2 };

    const slots = buildTileSlots(N);
    const orderedItems = items.slice();
    const occupiedMap = new Map();
    orderedItems.forEach((item, idx) => {
      const slot = slots[idx % slots.length];
      occupiedMap.set(`${slot.r},${slot.c}`, { item, idx });
    });

    // Checkerboard grass platform tiles
    const tilesMarkup = [];
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const pt = isoCenter(r, c, originX, originY);
        const topPt = `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
        const rightPt = `${(pt.x + TILE_W / 2).toFixed(1)},${(pt.y + TILE_H / 2).toFixed(1)}`;
        const bottomPt = `${pt.x.toFixed(1)},${(pt.y + TILE_H).toFixed(1)}`;
        const leftPt = `${(pt.x - TILE_W / 2).toFixed(1)},${(pt.y + TILE_H / 2).toFixed(1)}`;
        const isEven = (r + c) % 2 === 0;
        const fill = isEven ? '#aedc56' : '#9bce44';
        const occ = occupiedMap.get(`${r},${c}`);
        const isSelected = occ && state.selectedIdx === occ.idx;

        tilesMarkup.push(
          `<polygon points="${topPt} ${rightPt} ${bottomPt} ${leftPt}" fill="${fill}" stroke="rgba(255,255,255,0.08)" stroke-width="0.6"/>`
        );
        if (isSelected) {
          tilesMarkup.push(
            `<polygon points="${topPt} ${rightPt} ${bottomPt} ${leftPt}" fill="rgba(255,248,180,0.42)" stroke="#fff59d" stroke-width="2"/>`
          );
        }
      }
    }

    // Terrain ground props on unoccupied tiles + original botanical plants positioned in painter's order
    const terrainPropsMarkup = [];
    const plantOverlays = [];

    const cells = [];
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        cells.push({ r, c, depth: r + c });
      }
    }
    cells.sort((a, b) => a.depth - b.depth || a.r - b.r);

    cells.forEach(({ r, c }) => {
      const pt = isoCenter(r, c, originX, originY);
      const cx = pt.x;
      const cy = pt.y + TILE_H / 2;
      const occ = occupiedMap.get(`${r},${c}`);

      if (occ) {
        const { item, idx } = occ;
        const isWith = !item.isHealthy;
        const stageInfo = typeof root.getPlantStageInfo === 'function'
          ? root.getPlantStageInfo(item)
          : { stage: item.stage || 'mature' };
        const iconContent = typeof root.getBotanicalPlotIconSvg === 'function'
          ? root.getBotanicalPlotIconSvg(item, isWith)
          : '';
        const formattedTime = formatItemDateTime(item.timestamp);
        const label = `${item.nepali || ''} (${item.english || ''}) - ${item.minutes || 0}m • ${formattedTime}`;
        const leftPct = ((cx / svgW) * 100).toFixed(4);
        const topPct = ((cy / svgH) * 100).toFixed(4);
        const widthPct = ((PLANT_SVG_UNITS / svgW) * 100).toFixed(4);
        const zIdx = 10 + (r + c) * 2 + (state.selectedIdx === idx ? 1 : 0);
        const isSel = state.selectedIdx === idx;

        plantOverlays.push(`
          <div class="iso-plant-pin planted-tree-item ${isWith ? 'withered' : ''} stage-${escapeHtml(stageInfo.stage)} ${isSel ? 'is-selected' : ''}"
               data-tree-idx="${idx}"
               role="button"
               tabindex="0"
               aria-label="${escapeHtml(label)}"
               title="${escapeHtml(label)}"
               style="left:${leftPct}%;top:${topPct}%;width:${widthPct}%;z-index:${zIdx};">
            <div class="planted-tree-icon">${iconContent}</div>
          </div>
        `);
      } else {
        const propSvg = renderTerrainProp(r * 97 + c * 193 + N * 31);
        if (propSvg) {
          terrainPropsMarkup.push(
            `<g transform="translate(${cx.toFixed(1)}, ${cy.toFixed(1)})" pointer-events="none">${propSvg}</g>`
          );
        }
      }
    });

    const leftWallPts = `${leftV.x.toFixed(1)},${leftV.y.toFixed(1)} ${bottomV.x.toFixed(1)},${bottomV.y.toFixed(1)} ${bottomV.x.toFixed(1)},${(bottomV.y + WALL_DEPTH).toFixed(1)} ${leftV.x.toFixed(1)},${(leftV.y + WALL_DEPTH).toFixed(1)}`;
    const rightWallPts = `${bottomV.x.toFixed(1)},${bottomV.y.toFixed(1)} ${rightV.x.toFixed(1)},${rightV.y.toFixed(1)} ${rightV.x.toFixed(1)},${(rightV.y + WALL_DEPTH).toFixed(1)} ${bottomV.x.toFixed(1)},${(bottomV.y + WALL_DEPTH).toFixed(1)}`;
    const shadowPts = `${leftV.x.toFixed(1)},${(leftV.y + WALL_DEPTH + 14).toFixed(1)} ${topV.x.toFixed(1)},${(topV.y + WALL_DEPTH + 14).toFixed(1)} ${rightV.x.toFixed(1)},${(rightV.y + WALL_DEPTH + 14).toFixed(1)} ${bottomV.x.toFixed(1)},${(bottomV.y + WALL_DEPTH + 14).toFixed(1)}`;

    const clipIdLeft = `soil-clip-l-${container.id || 'main'}`;
    const clipIdRight = `soil-clip-r-${container.id || 'main'}`;

    const selectedItem =
      state.selectedIdx !== null && orderedItems[state.selectedIdx]
        ? orderedItems[state.selectedIdx]
        : (orderedItems.length > 0 ? orderedItems[orderedItems.length - 1] : null);

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

    const baseWidth = Math.max(460, Math.min(920, svgW * 0.92));
    const zoomedWidth = Math.round(baseWidth * state.zoom);
    const zoomPct = Math.round(state.zoom * 100);
    const scalerStyle = state.zoom <= 1.0
      ? `width:${zoomedWidth}px;max-width:100%;`
      : `width:${zoomedWidth}px;max-width:none;`;

    container.innerHTML = `
      <div class="iso-forest-stage" data-empty="${orderedItems.length === 0 ? 'true' : 'false'}">
        <div class="iso-stage-toolbar">
          <div class="iso-stage-summary">
            <span class="iso-summary-count">${orderedItems.length}</span> ${orderedItems.length === 1 ? 'tree' : 'trees'} planted
            <span class="iso-inspector-sep">·</span>
            <span>${N}×${N} grove</span>
          </div>
          <div class="iso-zoom-controls" role="group" aria-label="Forest zoom controls">
            <button type="button" class="iso-zoom-btn" data-zoom-delta="-0.2" title="Zoom out" aria-label="Zoom out">−</button>
            <button type="button" class="iso-zoom-btn iso-zoom-reset" data-zoom-reset="1" title="Reset zoom" aria-label="Reset zoom">${zoomPct}%</button>
            <button type="button" class="iso-zoom-btn" data-zoom-delta="0.2" title="Zoom in" aria-label="Zoom in">+</button>
          </div>
        </div>

        <div class="iso-stage-viewport">
          <div class="iso-island-scaler" style="${scalerStyle}">
            <svg class="iso-island-svg" viewBox="0 0 ${svgW} ${svgH}" width="100%" height="auto" role="img" aria-label="Isometric forest platform with ${orderedItems.length} planted trees">
              <defs>
                <clipPath id="${clipIdLeft}">
                  <polygon points="${leftWallPts}"/>
                </clipPath>
                <clipPath id="${clipIdRight}">
                  <polygon points="${rightWallPts}"/>
                </clipPath>
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
              </defs>

              <polygon points="${shadowPts}" fill="rgba(7, 22, 16, 0.45)" filter="url(#isoIslandShadowBlur)"/>

              <polygon points="${leftWallPts}" fill="url(#isoSoilGradL)"/>
              <polygon points="${rightWallPts}" fill="url(#isoSoilGradR)"/>

              <g clip-path="url(#${clipIdLeft})">
                ${renderSoilStones([leftV, bottomV], false, N)}
              </g>
              <g clip-path="url(#${clipIdRight})">
                ${renderSoilStones([bottomV, rightV], true, N)}
              </g>

              <g class="iso-tiles-layer">
                ${tilesMarkup.join('')}
              </g>

              ${renderScallopedTurfEdge(leftV, bottomV, false, N)}
              ${renderScallopedTurfEdge(bottomV, rightV, true, N)}

              <g class="iso-terrain-props-layer">
                ${terrainPropsMarkup.join('')}
              </g>
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
    zoomBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.zoomReset) {
          state.zoom = 1.0;
        } else {
          const delta = parseFloat(btn.dataset.zoomDelta || '0');
          state.zoom = Math.max(0.6, Math.min(2.2, Number((state.zoom + delta).toFixed(2))));
        }
        renderForestDiorama(container, items, opts);
      });
    });

    const treeNodes = container.querySelectorAll('.iso-plant-pin');
    treeNodes.forEach(node => {
      const selectTree = () => {
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
    state.zoom = Math.max(0.6, Math.min(2.2, Number((state.zoom + delta).toFixed(2))));
    if (Array.isArray(items)) {
      renderForestDiorama(container, items);
    }
  }

  root.renderForestDiorama = renderForestDiorama;
  root.adjustDioramaZoom = adjustDioramaZoom;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
