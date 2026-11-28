/**
 * Rotational 3D Mount Everest Expedition Diorama Renderer
 * Builds a geometrically accurate East-North-Elevation metric relief model
 * directly from the provided GeoJSON GPS track and landmark markers.
 */
(function (root) {
  'use strict';

  const DEFAULT_YAW = -0.58; // Classic SW approach looking up Western Cwm toward Everest Pyramid
  const DEFAULT_PITCH = 0.50;
  const SUMMIT_LON = 86.92524027674324;
  const SUMMIT_LAT = 27.988071283640686;
  const M_PER_LAT = 111320;
  const M_PER_LON = Math.cos((SUMMIT_LAT * Math.PI) / 180) * 111320;

  // Domain in meters relative to Summit (0, 0)
  const MIN_MX = -8250;
  const MAX_MX = 1650;
  const MIN_MY = -3150;
  const MAX_MY = 2450;
  const CENTER_MX = (MIN_MX + MAX_MX) * 0.5; // -3300 m
  const CENTER_MY = (MIN_MY + MAX_MY) * 0.5; // -350 m
  const BASE_ELE_M = 5020;
  const GRID_NX = 46;
  const GRID_NY = 28;
  const PLINTH_DEPTH_M = 580;

  const CAMP_METADATA = {
    'Base Camp': {
      eleM: 5364,
      shortName: 'Base Camp',
      zone: 'Khumbu Glacier Moraine',
      desc: 'Expedition staging camp at the foot of the Khumbu Icefall.'
    },
    'Khumbu Icefall': {
      eleM: 5620,
      shortName: 'Icefall',
      zone: 'Moving Glacial Seracs',
      desc: 'Treacherous river of shifting ice towers, crevasses, and aluminum ladders.'
    },
    'Camp I': {
      eleM: 6065,
      shortName: 'Camp I',
      zone: 'Western Cwm Gate',
      desc: 'Perched just above the top of the Khumbu Icefall entering the glacial valley.'
    },
    'Camp II': {
      eleM: 6400,
      shortName: 'Camp II',
      zone: 'Valley of Silence',
      desc: 'Advance Base Camp inside the sun-baked snow basin walled by Everest, Lhotse & Nuptse.'
    },
    'Camp III': {
      eleM: 7162,
      shortName: 'Camp III',
      zone: 'Lhotse Face',
      desc: 'Carved into ledges along the steep 40–50° blue-ice wall of the Lhotse Face.'
    },
    'Camp IV': {
      eleM: 7950,
      shortName: 'Camp IV',
      zone: 'South Col · Death Zone',
      desc: 'Wind-scoured saddle between Everest and Lhotse where the final summit push begins.'
    },
    'Hillary Step': {
      eleM: 8790,
      shortName: 'Hillary Step',
      zone: 'Southeast Ridge Crux',
      desc: 'High-altitude rock and snow step along the knife-edge ridge just below the summit.'
    },
    'Peak': {
      eleM: 8849,
      shortName: 'Summit',
      zone: 'Top of the World',
      desc: 'Sagarmatha / Chomolungma true summit at 8,848.86 m (29,031.7 ft).'
    }
  };

  function seededHash(x, y) {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
    return s - Math.floor(s);
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function toMetricXY(lon, lat) {
    return {
      mx: (lon - SUMMIT_LON) * M_PER_LON,
      my: (lat - SUMMIT_LAT) * M_PER_LAT
    };
  }

  function gaussianPeak(mx, my, px, py, height, rx, ry, rotRad) {
    const dx = mx - px;
    const dy = my - py;
    const c = Math.cos(rotRad || 0);
    const s = Math.sin(rotRad || 0);
    const u = (dx * c + dy * s) / rx;
    const v = (-dx * s + dy * c) / ry;
    return height * Math.exp(-(u * u + v * v));
  }

  function ridgeDrop(mx, my, x0, y0, x1, y1, width, height) {
    const vx = x1 - x0;
    const vy = y1 - y0;
    const len2 = vx * vx + vy * vy || 1;
    const t = Math.max(0, Math.min(1, ((mx - x0) * vx + (my - y0) * vy) / len2));
    const px = x0 + vx * t;
    const py = y0 + vy * t;
    const d = Math.hypot(mx - px, my - py);
    return height * (1 - t * 0.28) * Math.exp(-(d * d) / (width * width));
  }

  function distToSegmentSq(px, py, ax, ay, bx, by) {
    const vx = bx - ax;
    const vy = by - ay;
    const len2 = vx * vx + vy * vy || 1;
    const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / len2));
    const cx = ax + vx * t;
    const cy = ay + vy * t;
    const dx = px - cx;
    const dy = py - cy;
    return { d2: dx * dx + dy * dy, t };
  }

  function buildEverestModel(geojson) {
    const features = (geojson && Array.isArray(geojson.features)) ? geojson.features : [];
    const lineFeature = features.find((f) => f && f.geometry && f.geometry.type === 'LineString');
    const pointFeatures = features.filter((f) => f && f.geometry && f.geometry.type === 'Point');
    const rawCoords = lineFeature ? lineFeature.geometry.coordinates : [];

    // 1. Convert GPS trail to metric East/North (mx, my) & cumulative distance
    const trail = [];
    let cumDist = 0;
    for (let i = 0; i < rawCoords.length; i++) {
      const lon = rawCoords[i][0];
      const lat = rawCoords[i][1];
      const { mx, my } = toMetricXY(lon, lat);
      if (i > 0) {
        cumDist += Math.hypot(mx - trail[i - 1].mx, my - trail[i - 1].my);
      }
      trail.push({
        idx: i,
        lon,
        lat,
        mx,
        my,
        distM: cumDist,
        eleM: 5300
      });
    }

    // 2. Snap each landmark marker to nearest GPS trail vertex
    const camps = pointFeatures.map((pf) => {
      const title = (pf.properties && pf.properties.title) ? String(pf.properties.title) : 'Waypoint';
      const lon = pf.geometry.coordinates[0];
      const lat = pf.geometry.coordinates[1];
      const { mx, my } = toMetricXY(lon, lat);
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < trail.length; i++) {
        const d = Math.hypot(trail[i].mx - mx, trail[i].my - my);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      const meta = CAMP_METADATA[title] || {
        eleM: 6000,
        shortName: title,
        zone: 'Everest Route',
        desc: 'Expedition route waypoint.'
      };
      return {
        title,
        shortName: meta.shortName,
        zone: meta.zone,
        desc: meta.desc,
        lon,
        lat,
        mx,
        my,
        eleM: meta.eleM,
        trailIdx: bestIdx,
        distM: trail[bestIdx] ? trail[bestIdx].distM : 0
      };
    }).sort((a, b) => a.trailIdx - b.trailIdx);

    // 3. Interpolate surveyed expedition altitude curve cleanly across all 377 trail vertices
    const anchors = [];
    if (trail.length > 0) {
      anchors.push({ distM: 0, eleM: 5250 });
      camps.forEach((c) => {
        anchors.push({ distM: c.distM, eleM: c.eleM });
      });
      const lastD = trail[trail.length - 1].distM;
      if (anchors[anchors.length - 1].distM < lastD) {
        anchors.push({ distM: lastD, eleM: 8849 });
      }
    }

    for (let i = 0; i < trail.length; i++) {
      const d = trail[i].distM;
      let a0 = anchors[0];
      let a1 = anchors[anchors.length - 1];
      for (let k = 0; k < anchors.length - 1; k++) {
        if (d >= anchors[k].distM && d <= anchors[k + 1].distM) {
          a0 = anchors[k];
          a1 = anchors[k + 1];
          break;
        }
      }
      const span = a1.distM - a0.distM || 1;
      const t = Math.max(0, Math.min(1, (d - a0.distM) / span));
      // Smoothstep slightly so grade changes naturally at camps
      const smoothT = t * 0.72 + (t * t * (3 - 2 * t)) * 0.28;
      // Subtle Icefall serac undulation between Base Camp & Camp I
      const icefallWave = (d > 1100 && d < 5000) ? Math.sin(d * 0.015) * 14 : 0;
      trail[i].eleM = a0.eleM + (a1.eleM - a0.eleM) * smoothT + icefallWave;
    }

    // Ensure Summit & Camp elevations match exact anchor elevations
    camps.forEach((c) => {
      if (trail[c.trailIdx]) {
        c.eleM = CAMP_METADATA[c.title] ? CAMP_METADATA[c.title].eleM : trail[c.trailIdx].eleM;
      }
    });

    // 4. Build geometrically accurate Everest–Lhotse–Nuptse topographic heightfield
    function sampleSurroundingMassif(mx, my) {
      let e = 5160;
      // Gradual glacial valley floor sloping up eastward from Base Camp to Western Cwm
      const valleySlope = Math.max(0, Math.min(1, (mx + 7800) / 8600));
      e += valleySlope * 980;

      // Mount Everest Summit Pyramid (sharp pyramidal peak at 0, 0)
      e = Math.max(e, 5200 + gaussianPeak(mx, my, 0, 0, 3649, 1780, 1520, -0.25));
      // Everest West Ridge sweeping toward Lho La
      e = Math.max(e, 5200 + ridgeDrop(mx, my, 0, 0, -2950, 820, 760, 3260));
      // Everest North-East Ridge
      e = Math.max(e, 5200 + ridgeDrop(mx, my, 0, 0, 1750, 1180, 740, 3280));
      // Everest South-East Ridge (Peak -> Hillary Step -> South Col)
      e = Math.max(e, 5200 + ridgeDrop(mx, my, 0, 0, 480, -1620, 560, 3550));

      // Lhotse Peak & Lhotse Face rising south of South Col
      e = Math.max(e, 5200 + gaussianPeak(mx, my, 580, -3060, 3360, 1550, 1320, 0.15));
      e = Math.max(e, 5200 + ridgeDrop(mx, my, 520, -2900, 470, -1610, 780, 2940));
      // Lhotse Face icy wall sloping west into Camp II/III
      e = Math.max(e, 5200 + gaussianPeak(mx, my, -520, -1720, 2240, 1150, 920, -0.35));

      // Nuptse Ridge forming dramatic south wall of the Western Cwm
      e = Math.max(e, 5200 + ridgeDrop(mx, my, -1080, -2380, -3950, -1980, 720, 2740));
      e = Math.max(e, 5200 + gaussianPeak(mx, my, -3320, -1940, 2520, 960, 620, -0.15));

      // West Shoulder / Khumbutse north wall framing Khumbu Icefall & Western Cwm
      e = Math.max(e, 5200 + ridgeDrop(mx, my, -2950, 820, -5100, 1820, 840, 2180));
      e = Math.max(e, 5200 + gaussianPeak(mx, my, -4850, 2050, 1980, 1080, 740, -0.4));

      // Kala Patthar / Gorak Shep ridge west of Base Camp
      e = Math.max(e, 5200 + gaussianPeak(mx, my, -7750, -180, 640, 980, 920, 0.2));

      return e;
    }

    function evaluateTerrainElevation(mx, my) {
      // Find closest segment on GPS trail for exact route-terrain lock
      let minD2 = Infinity;
      let nearestEle = 5364;
      for (let i = 0; i < trail.length - 1; i++) {
        const a = trail[i];
        const b = trail[i + 1];
        const res = distToSegmentSq(mx, my, a.mx, a.my, b.mx, b.my);
        if (res.d2 < minD2) {
          minD2 = res.d2;
          nearestEle = a.eleM + (b.eleM - a.eleM) * res.t;
        }
      }
      const dTrail = Math.sqrt(minD2);
      const rawMassif = sampleSurroundingMassif(mx, my);

      // Subtle craggy Himalayan ridge texture damped right along the trail corridor
      const cragNoise =
        (Math.sin(mx * 0.0042 + my * 0.0031) * 58 +
          Math.cos(mx * 0.0085 - my * 0.0072) * 32 +
          Math.sin((mx - my) * 0.015) * 16) *
        Math.min(1, dTrail / 320);

      // Blend smoothly so the GPS route hugs the true terrain surface with zero floating gaps
      const trailLock = Math.exp(-(dTrail * dTrail) / (340 * 340));
      let ele = rawMassif * (1 - trailLock) + nearestEle * trailLock + cragNoise;

      // Carve subtle Khumbu Glacier / Western Cwm bowl along mid-trail below Camp III
      if (dTrail < 520 && nearestEle < 6650) {
        const valleyDip = Math.exp(-(dTrail * dTrail) / (260 * 260)) * (1 - trailLock) * 90;
        ele -= valleyDip;
      }

      // Pin Peak strictly to 8,849 m
      const dPeak = Math.hypot(mx, my);
      if (dPeak < 180) {
        const pW = Math.exp(-(dPeak * dPeak) / (95 * 95));
        ele = ele * (1 - pW) + 8849 * pW;
      }

      return Math.max(BASE_ELE_M + 85, Math.min(8865, ele));
    }

    // Build topographic vertex grid
    const grid = [];
    for (let r = 0; r <= GRID_NY; r++) {
      const row = [];
      const fy = r / GRID_NY;
      const my = MIN_MY + fy * (MAX_MY - MIN_MY);
      for (let c = 0; c <= GRID_NX; c++) {
        const fx = c / GRID_NX;
        const mx = MIN_MX + fx * (MAX_MX - MIN_MX);
        const eleM = evaluateTerrainElevation(mx, my);
        row.push({ r, c, mx, my, eleM });
      }
      grid.push(row);
    }

    // Build triangle facets with precomputed surface normals and rock/snow/glacier material hints
    const triangles = [];
    for (let r = 0; r < GRID_NY; r++) {
      for (let c = 0; c < GRID_NX; c++) {
        const v00 = grid[r][c];
        const v10 = grid[r][c + 1];
        const v11 = grid[r + 1][c + 1];
        const v01 = grid[r + 1][c];
        const diagA = (r + c) % 2 === 0;
        const pairs = diagA
          ? [[v00, v10, v11], [v00, v11, v01]]
          : [[v00, v10, v01], [v10, v11, v01]];

        pairs.forEach(([a, b, p3]) => {
          const ux = b.mx - a.mx;
          const uy = b.my - a.my;
          const uz = b.eleM - a.eleM;
          const vx = p3.mx - a.mx;
          const vy = p3.my - a.my;
          const vz = p3.eleM - a.eleM;
          let nx = uy * vz - uz * vy;
          let ny = uz * vx - ux * vz;
          let nz = ux * vy - uy * vx;
          if (nz < 0) {
            nx = -nx;
            ny = -ny;
            nz = -nz;
          }
          const nLen = Math.hypot(nx, ny, nz) || 1;
          nx /= nLen;
          ny /= nLen;
          nz /= nLen;

          const avgMx = (a.mx + b.mx + p3.mx) / 3;
          const avgMy = (a.my + b.my + p3.my) / 3;
          const avgEle = (a.eleM + b.eleM + p3.eleM) / 3;

          triangles.push({
            a,
            b,
            c: p3,
            avgMx,
            avgMy,
            avgEle,
            nx,
            ny,
            nz,
            slope: 1 - nz,
            jitter: seededHash(r * 37 + c, avgMx * 0.01)
          });
        });
      }
    }

    return {
      trail,
      camps,
      grid,
      triangles,
      totalDistM: cumDist,
      minEleM: trail.length ? Math.round(trail[0].eleM) : 5250,
      maxEleM: 8849
    };
  }

  function sampleTrailAtProgress(model, progress) {
    if (!model || !model.trail || !model.trail.length) return null;
    const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
    const trail = model.trail;
    const baseCamp = (model.camps || []).find((c) => c.title === 'Base Camp') || (model.camps && model.camps[0]) || trail[0];
    const startDistM = baseCamp ? baseCamp.distM : 0;
    const endDistM = model.totalDistM || trail[trail.length - 1].distM || 0;
    const spanDist = Math.max(0, endDistM - startDistM);
    const targetDistM = startDistM + spanDist * p;

    if (targetDistM <= trail[0].distM) {
      const pt = trail[0];
      return { ...pt, fracIdx: 0, progress: p, baseDistM: startDistM, endDistM };
    }
    const lastIdx = trail.length - 1;
    if (targetDistM >= trail[lastIdx].distM) {
      const pt = trail[lastIdx];
      return { ...pt, fracIdx: lastIdx, progress: p, baseDistM: startDistM, endDistM };
    }

    let segIdx = 0;
    for (let i = 0; i < lastIdx; i++) {
      if (targetDistM >= trail[i].distM && targetDistM <= trail[i + 1].distM) {
        segIdx = i;
        break;
      }
    }
    const a = trail[segIdx];
    const b = trail[segIdx + 1];
    const segSpan = (b.distM - a.distM) || 1;
    const t = Math.max(0, Math.min(1, (targetDistM - a.distM) / segSpan));

    return {
      idx: segIdx,
      fracIdx: segIdx + t,
      progress: p,
      baseDistM: startDistM,
      endDistM,
      distM: targetDistM,
      mx: a.mx + (b.mx - a.mx) * t,
      my: a.my + (b.my - a.my) * t,
      eleM: a.eleM + (b.eleM - a.eleM) * t,
      lon: a.lon + (b.lon - a.lon) * t,
      lat: a.lat + (b.lat - a.lat) * t
    };
  }

  // Project metric (mx, my, eleM) into canvas screen coordinates
  function makeProjector(svgW, svgH, yaw, pitch, scalePxPerKm) {
    const cosA = Math.cos(yaw);
    const sinA = Math.sin(yaw);
    const centerX = svgW * 0.5;
    const centerY = svgH * 0.56;
    const vertScale = (1.14 - pitch * 0.28) * scalePxPerKm * 1.18;

    return function project(mx, my, eleM) {
      const u = (mx - CENTER_MX) / 1000;
      const v = -(my - CENTER_MY) / 1000; // flip north-up so +North points away from viewer when yaw=0
      const zKm = (eleM - BASE_ELE_M) / 1000;
      const rotX = u * cosA - v * sinA;
      const depth = u * sinA + v * cosA;
      return {
        x: centerX + rotX * scalePxPerKm,
        y: centerY + depth * (scalePxPerKm * pitch) - zKm * vertScale,
        depth
      };
    };
  }

  function shadeFacetColor(tri) {
    // High-altitude sunlit WSW directional lighting
    const sunX = -0.58;
    const sunY = -0.34;
    const sunZ = 0.74;
    const diff = Math.max(-0.4, Math.min(1, tri.nx * sunX + tri.ny * sunY + tri.nz * sunZ));
    const light = Math.max(0.18, Math.min(1.0, 0.42 + diff * 0.62));

    const ele = tri.avgEle;
    const steep = tri.slope;

    // Classify into glacier ice, alpine rock cliff, or high Himalayan snowpack
    const isGlacierFloor = ele < 5720 && steep < 0.24;
    const isRockyFace =
      (ele < 5560 && steep > 0.14) ||
      (ele >= 5560 && steep > 0.25) ||
      (ele > 7500 && steep > 0.20);

    let r;
    let g;
    let b;

    if (isGlacierFloor) {
      // Khumbu Glacier / Icefall blue-grey glacial ice
      r = 148 + light * 74;
      g = 176 + light * 62;
      b = 204 + light * 48;
    } else if (isRockyFace) {
      // Dark Himalayan granite / yellow band / hornfel bedrock faces
      const warmBand = (ele > 8150 && ele < 8450) ? 16 : 0;
      r = 56 + warmBand + light * 76 + tri.jitter * 10;
      g = 62 + warmBand * 0.7 + light * 76 + tri.jitter * 9;
      b = 76 + light * 82 + tri.jitter * 10;
    } else {
      // Crisp alpine snowfields & sunlit ridge crests with cool blue shadow tones
      const snowBoost = Math.min(1, Math.max(0, (ele - 5500) / 2600));
      const shadowTint = 1 - light;
      r = (182 + snowBoost * 40) * light + 64 * shadowTint;
      g = (204 + snowBoost * 32) * light + 94 * shadowTint;
      b = (228 + snowBoost * 24) * light + 142 * shadowTint;
    }

    return `rgb(${Math.round(Math.min(252, r))}, ${Math.round(Math.min(254, g))}, ${Math.round(Math.min(255, b))})`;
  }

  function renderMountainCanvasAndPins(container, model, state) {
    const canvas = container.querySelector('.iso-mountain-canvas');
    const overlay = container.querySelector('.iso-camps-overlay');
    if (!canvas || !model) return;

    const viewW = 920;
    const viewH = 580;
    const dpr = Math.min(2, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
    if (canvas.width !== viewW * dpr || canvas.height !== viewH * dpr) {
      canvas.width = viewW * dpr;
      canvas.height = viewH * dpr;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, viewW, viewH);

    const scalePxPerKm = 68;
    const project = makeProjector(viewW, viewH, state.yaw, state.pitch, scalePxPerKm);

    // 1. Soft floating diorama drop shadow beneath plinth
    const cornersBottom = [
      project(MIN_MX, MIN_MY, BASE_ELE_M - PLINTH_DEPTH_M - 120),
      project(MAX_MX, MIN_MY, BASE_ELE_M - PLINTH_DEPTH_M - 120),
      project(MAX_MX, MAX_MY, BASE_ELE_M - PLINTH_DEPTH_M - 120),
      project(MIN_MX, MAX_MY, BASE_ELE_M - PLINTH_DEPTH_M - 120)
    ];
    ctx.save();
    ctx.fillStyle = 'rgba(4, 10, 22, 0.42)';
    ctx.beginPath();
    cornersBottom.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 2. Prepare Geological Cutaway Plinth Walls (drawn after terrain so foreground walls occlude interior valleys cleanly)
    const cosA = Math.cos(state.yaw);
    const sinA = Math.sin(state.yaw);
    const baseFloor = BASE_ELE_M - PLINTH_DEPTH_M;
    const grid = model.grid;

    const rimWalls = [
      {
        nyScreen: 0 * sinA + 1 * cosA,
        nxScreen: 0 * cosA - 1 * sinA,
        pts: Array.from({ length: GRID_NX + 1 }, (_, c) => grid[0][c])
      },
      {
        nyScreen: 0 * sinA + -1 * cosA,
        nxScreen: 0 * cosA - -1 * sinA,
        pts: Array.from({ length: GRID_NX + 1 }, (_, c) => grid[GRID_NY][GRID_NX - c])
      },
      {
        nyScreen: -1 * sinA + 0 * cosA,
        nxScreen: -1 * cosA - 0 * sinA,
        pts: Array.from({ length: GRID_NY + 1 }, (_, r) => grid[GRID_NY - r][0])
      },
      {
        nyScreen: 1 * sinA + 0 * cosA,
        nxScreen: 1 * cosA - 0 * sinA,
        pts: Array.from({ length: GRID_NY + 1 }, (_, r) => grid[r][GRID_NX])
      }
    ];

    const visibleWalls = rimWalls
      .filter((w) => w.nyScreen > 0.005)
      .sort((a, b) => {
        const ap = project(a.pts[Math.floor(a.pts.length / 2)].mx, a.pts[Math.floor(a.pts.length / 2)].my, baseFloor);
        const bp = project(b.pts[Math.floor(b.pts.length / 2)].mx, b.pts[Math.floor(b.pts.length / 2)].my, baseFloor);
        return ap.depth - bp.depth;
      });

    // 3. Project terrain triangles + 377-point GPS trail segments into unified back-to-front painter's queue
    const activeCamp = model.camps[state.selectedCampIdx] || model.camps[model.camps.length - 1];
    const climberPt = sampleTrailAtProgress(model, state.climberProgress);
    const climberFracIdx = climberPt ? climberPt.fracIdx : 0;
    const projectedTrail = model.trail.map((pt) => {
      const pGround = project(pt.mx, pt.my, pt.eleM + 10);
      const pElevated = project(pt.mx, pt.my, pt.eleM + 28);
      return { ...pt, x: pElevated.x, y: pElevated.y, gx: pGround.x, gy: pGround.y, depth: pElevated.depth };
    });

    const renderItems = model.triangles.map((tri) => {
      const pa = project(tri.a.mx, tri.a.my, tri.a.eleM);
      const pb = project(tri.b.mx, tri.b.my, tri.b.eleM);
      const pc = project(tri.c.mx, tri.c.my, tri.c.eleM);
      const avgDepth = (pa.depth + pb.depth + pc.depth) / 3;
      return { kind: 'tri', tri, pa, pb, pc, depth: avgDepth };
    });

    for (let i = 0; i < projectedTrail.length - 1; i++) {
      const a = projectedTrail[i];
      const b = projectedTrail[i + 1];
      let splitT = null;
      let isCompleted = false;
      if (i + 1 <= climberFracIdx) {
        isCompleted = true;
      } else if (i < climberFracIdx && i + 1 > climberFracIdx) {
        splitT = Math.max(0, Math.min(1, climberFracIdx - i));
      }
      renderItems.push({
        kind: 'trail',
        idx: i,
        a,
        b,
        isCompleted,
        splitT,
        depth: (a.depth + b.depth) * 0.5 + 0.14
      });
    }

    renderItems.sort((x, y) => x.depth - y.depth);

    renderItems.forEach((item) => {
      if (item.kind === 'tri') {
        const { tri, pa, pb, pc } = item;
        const col = shadeFacetColor(tri);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.lineTo(pc.x, pc.y);
        ctx.closePath();
        ctx.fillStyle = col;
        ctx.fill();
        ctx.strokeStyle = col;
        ctx.lineWidth = 0.65;
        ctx.stroke();

        if (
          (tri.a.eleM >= 8000 || tri.b.eleM >= 8000 || tri.c.eleM >= 8000) &&
          (tri.a.eleM < 8000 || tri.b.eleM < 8000 || tri.c.eleM < 8000)
        ) {
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.26)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      } else {
        const { a, b, isCompleted, splitT, idx } = item;
        ctx.beginPath();
        ctx.moveTo(a.gx, a.gy + 2);
        ctx.lineTo(b.gx, b.gy + 2);
        ctx.strokeStyle = 'rgba(8, 16, 32, 0.40)';
        ctx.lineWidth = 4.0;
        ctx.lineCap = 'round';
        ctx.stroke();

        if (isCompleted) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = '#ff6b35';
          ctx.lineWidth = 3.4;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else if (splitT !== null) {
          const mx = a.x + (b.x - a.x) * splitT;
          const my = a.y + (b.y - a.y) * splitT;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = '#ff6b35';
          ctx.lineWidth = 3.4;
          ctx.lineCap = 'round';
          ctx.stroke();

          if (idx % 2 === 0) {
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.86)';
            ctx.lineWidth = 2.2;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        } else if (idx % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.86)';
          ctx.lineWidth = 2.2;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }
    });

    // 4. Foreground Geological Cutaway Plinth Walls
    visibleWalls.forEach((wall) => {
      const isShaded = wall.nxScreen >= 0;
      const topPts = wall.pts.map((v) => project(v.mx, v.my, v.eleM));
      const botEnd = project(wall.pts[wall.pts.length - 1].mx, wall.pts[wall.pts.length - 1].my, baseFloor);
      const botStart = project(wall.pts[0].mx, wall.pts[0].my, baseFloor);

      const grad = ctx.createLinearGradient(0, topPts[0].y - 120, 0, botStart.y);
      if (isShaded) {
        grad.addColorStop(0, '#3e4654');
        grad.addColorStop(0.55, '#2b323d');
        grad.addColorStop(1, '#1c222b');
      } else {
        grad.addColorStop(0, '#5a6373');
        grad.addColorStop(0.55, '#3e4654');
        grad.addColorStop(1, '#282f3a');
      }

      ctx.beginPath();
      topPts.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.lineTo(botEnd.x, botEnd.y);
      ctx.lineTo(botStart.x, botStart.y);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      [0.35, 0.68].forEach((frac) => {
        ctx.beginPath();
        wall.pts.forEach((v, i) => {
          const eleBand = baseFloor + (v.eleM - baseFloor) * frac;
          const pt = project(v.mx, v.my, eleBand);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = isShaded ? 'rgba(15, 23, 42, 0.35)' : 'rgba(148, 163, 184, 0.22)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      ctx.beginPath();
      ctx.moveTo(botStart.x, botStart.y);
      ctx.lineTo(botEnd.x, botEnd.y);
      ctx.strokeStyle = 'rgba(148, 197, 255, 0.26)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // Active inspected camp highlight ring on trail
    if (activeCamp && projectedTrail[activeCamp.trailIdx]) {
      const ap = projectedTrail[activeCamp.trailIdx];
      ctx.beginPath();
      ctx.arc(ap.x, ap.y, 7.0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    // Live expedition climber beacon on canvas
    let projectedClimber = null;
    if (climberPt) {
      projectedClimber = project(climberPt.mx, climberPt.my, climberPt.eleM + 30);
      ctx.beginPath();
      ctx.arc(projectedClimber.x, projectedClimber.y, state.climberActive ? 10.5 : 8.5, 0, Math.PI * 2);
      ctx.fillStyle = state.climberActive ? 'rgba(250, 204, 21, 0.40)' : 'rgba(250, 204, 21, 0.28)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(projectedClimber.x, projectedClimber.y, 4.6, 0, Math.PI * 2);
      ctx.fillStyle = '#facc15';
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }

    ctx.restore();

    // 5. Position interactive HTML/SVG camp pins & climber pin cleanly in 3D projected coordinates
    if (overlay) {
      const pinEls = overlay.querySelectorAll('.iso-camp-pin');
      pinEls.forEach((btn) => {
        const idx = parseInt(btn.getAttribute('data-camp-idx'), 10);
        const camp = model.camps[idx];
        if (!camp) return;
        const p = project(camp.mx, camp.my, camp.eleM + 26);
        btn.style.left = `${((p.x / viewW) * 100).toFixed(4)}%`;
        btn.style.top = `${((p.y / viewH) * 100).toFixed(4)}%`;
        btn.style.zIndex = String(Math.round(50 + (p.depth + 8) * 10) + (idx === state.selectedCampIdx ? 100 : 0));
      });

      const climberPin = overlay.querySelector('.iso-climber-pin');
      if (climberPin && climberPt && projectedClimber) {
        climberPin.style.left = `${((projectedClimber.x / viewW) * 100).toFixed(4)}%`;
        climberPin.style.top = `${((projectedClimber.y / viewH) * 100).toFixed(4)}%`;
        climberPin.style.zIndex = String(Math.round(220 + (projectedClimber.depth + 8) * 10));
        const tag = climberPin.querySelector('.iso-climber-tag');
        if (tag) {
          const prefix = state.climberProgress >= 0.999 ? 'Summit' : 'Climber';
          tag.textContent = `${prefix} · ${Math.round(climberPt.eleM).toLocaleString()}m`;
        }
      }
    }
  }

  const containerStates = new WeakMap();

  function getContainerState(container) {
    let st = containerStates.get(container);
    if (!st) {
      st = {
        zoom: 1.0,
        panX: 0,
        panY: 0,
        interactionMode: 'rotate',
        manualMode: false,
        yaw: DEFAULT_YAW,
        pitch: DEFAULT_PITCH,
        selectedCampIdx: 7, // Default highlight Peak, or stepped by user
        climberProgress: 0,
        climberActive: false,
        activePreset: 'classic',
        scrollZoomActive: false,
        eventsBound: false,
        isDragging: false,
        isPinching: false,
        pinchCooldownUntil: 0,
        rafPending: false,
        model: null,
        onSelectCamp: null
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
    const scaler = container.querySelector('.iso-mountain-scaler');
    if (!viewport || !scaler) return { x: rawX, y: rawY };
    const vw = viewport.clientWidth || 320;
    const vh = viewport.clientHeight || 240;
    const sw = scaler.offsetWidth || vw;
    const sh = scaler.offsetHeight || vh;
    const maxX = sw * z > vw ? (sw * z - vw) * 0.5 + 24 : Math.max(24, (vw - sw * z) * 0.35);
    const maxY = sh * z > vh ? (sh * z - vh) * 0.5 + 20 : Math.max(16, (vh - sh * z) * 0.25);
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
    container.querySelectorAll('.iso-mode-btn').forEach((btn) => {
      const active = btn.getAttribute('data-interaction-mode') === effectiveMode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    container.querySelectorAll('.iso-preset-btn').forEach((btn) => {
      const active = btn.getAttribute('data-view-preset') === state.activePreset;
      btn.classList.toggle('is-active', active);
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
    const scaler = container.querySelector('.iso-mountain-scaler');
    if (scaler) {
      scaler.style.transform = `translate3d(${state.panX.toFixed(2)}px, ${state.panY.toFixed(2)}px, 0) scale(${state.zoom.toFixed(4)})`;
    }
    syncCameraToolbarUI(container, state);
  }

  function setCameraZoom(container, state, rawNextZoom, focalClientX, focalClientY) {
    const oldZoom = state.zoom;
    const nextZoom = Math.max(0.5, Math.min(3.5, Number(rawNextZoom.toFixed(3))));
    if (nextZoom === oldZoom && state.zoom <= 1.02) {
      applyCameraTransform(container, state);
      return;
    }

    let nextPanX = state.panX;
    let nextPanY = state.panY;

    if (nextZoom <= 1.02) {
      if (!state.manualMode) state.interactionMode = 'rotate';
      if (!state.manualMode || state.interactionMode === 'rotate') {
        nextPanX = 0;
        nextPanY = 0;
      }
    } else {
      if (!state.manualMode) state.interactionMode = 'pan';
      if (typeof focalClientX === 'number' && typeof focalClientY === 'number') {
        const scaler = container.querySelector('.iso-mountain-scaler');
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

  function updateInspectorBar(container, state) {
    const model = state.model;
    if (!model || !model.camps.length) return;
    const camp = model.camps[state.selectedCampIdx] || model.camps[0];
    const feet = Math.round(camp.eleM * 3.28084);
    const distKm = (camp.distM / 1000).toFixed(2);
    const idx = state.selectedCampIdx;

    const nameEl = container.querySelector('.iso-inspector-name');
    const altEl = container.querySelector('.iso-inspector-alt');
    const descEl = container.querySelector('.iso-inspector-desc');
    const coordsEl = container.querySelector('.iso-inspector-coords');
    const prevBtn = container.querySelector('[data-camp-step="-1"]');
    const nextBtn = container.querySelector('[data-camp-step="1"]');

    if (nameEl) nameEl.textContent = camp.title;
    if (altEl) altEl.textContent = `${Math.round(camp.eleM).toLocaleString()} m (${feet.toLocaleString()} ft) · ${distKm} km`;
    if (descEl) descEl.textContent = `${camp.zone} — ${camp.desc}`;
    if (coordsEl) coordsEl.textContent = `${camp.lat.toFixed(5)}°N, ${camp.lon.toFixed(5)}°E`;
    if (prevBtn) prevBtn.disabled = idx <= 0;
    if (nextBtn) nextBtn.disabled = idx >= model.camps.length - 1;

    container.querySelectorAll('.iso-camp-pin').forEach((btn) => {
      const bIdx = parseInt(btn.getAttribute('data-camp-idx'), 10);
      btn.classList.toggle('is-selected', bIdx === idx);
    });
  }

  function scheduleRedraw(container, state) {
    if (state.rafPending) return;
    state.rafPending = true;
    const raf = (typeof requestAnimationFrame === 'function') ? requestAnimationFrame : (fn) => setTimeout(fn, 16);
    raf(() => {
      state.rafPending = false;
      renderMountainCanvasAndPins(container, state.model, state);
      updateInspectorBar(container, state);
    });
  }

  function bindStageInteractions(container, state) {
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
      e.preventDefault();
      const nextZoom = e.ctrlKey
        ? state.zoom * Math.exp(-e.deltaY * 0.01)
        : state.zoom + (e.deltaY < 0 ? 0.2 : -0.2);
      setCameraZoom(container, state, nextZoom, e.clientX, e.clientY);
    }, { passive: false });

    let activeTouchMode = null;
    let pinchStartDist = 0;
    let pinchStartZoom = 1;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartPanX = 0;
    let touchStartPanY = 0;
    let touchStartYaw = 0;
    let touchStartPitch = 0;
    let pointerDragActive = false;
    let pointerMode = 'rotate';
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartPanX = 0;
    let dragStartPanY = 0;
    let dragStartYaw = 0;
    let dragStartPitch = 0;

    container.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return;
      if (e.button !== 0) return;
      if (e.target.closest('button')) return;
      const viewport = e.target.closest('.iso-stage-viewport');
      if (!viewport) return;

      state.scrollZoomActive = true;
      pointerDragActive = true;
      state.isDragging = false;
      pointerMode = getEffectiveMode(state);
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartPanX = state.panX;
      dragStartPanY = state.panY;
      dragStartYaw = state.yaw;
      dragStartPitch = state.pitch;
      viewport.style.cursor = 'grabbing';
      try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
    });

    container.addEventListener('pointermove', (e) => {
      if (!pointerDragActive || e.pointerType === 'touch') return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) state.isDragging = true;

      if (pointerMode === 'pan') {
        state.panX = dragStartPanX + dx;
        state.panY = dragStartPanY + dy;
        applyCameraTransform(container, state);
      } else {
        state.yaw = dragStartYaw + dx * 0.0085;
        state.pitch = Math.max(0.22, Math.min(0.95, dragStartPitch + dy * 0.0042));
        state.activePreset = '';
        syncCameraToolbarUI(container, state);
        scheduleRedraw(container, state);
      }
    });

    const endPointerDrag = () => {
      if (!pointerDragActive) return;
      pointerDragActive = false;
      syncCameraToolbarUI(container, state);
      setTimeout(() => { state.isDragging = false; }, 40);
    };
    container.addEventListener('pointerup', endPointerDrag);
    container.addEventListener('pointercancel', endPointerDrag);

    const getTouchDist = (t1, t2) => Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

    container.addEventListener('touchstart', (e) => {
      const viewport = e.target.closest('.iso-stage-viewport');
      if (!viewport) return;
      if (e.touches.length === 2) {
        activeTouchMode = 'pinch';
        state.isPinching = true;
        pinchStartDist = getTouchDist(e.touches[0], e.touches[1]);
        pinchStartZoom = state.zoom;
        e.preventDefault();
        return;
      }
      if (e.touches.length === 1 && !e.target.closest('button')) {
        const mode = getEffectiveMode(state);
        activeTouchMode = mode === 'pan' ? 'pan' : 'rotate';
        state.isDragging = false;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartPanX = state.panX;
        touchStartPanY = state.panY;
        touchStartYaw = state.yaw;
        touchStartPitch = state.pitch;
      }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
      if (activeTouchMode === 'pinch' && e.touches.length === 2) {
        e.preventDefault();
        const dist = getTouchDist(e.touches[0], e.touches[1]);
        if (pinchStartDist > 0) {
          const midX = (e.touches[0].clientX + e.touches[1].clientX) * 0.5;
          const midY = (e.touches[0].clientY + e.touches[1].clientY) * 0.5;
          setCameraZoom(container, state, pinchStartZoom * (dist / pinchStartDist), midX, midY);
        }
        return;
      }
      if ((activeTouchMode === 'pan' || activeTouchMode === 'rotate') && e.touches.length === 1) {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) state.isDragging = true;
        if (activeTouchMode === 'pan') {
          e.preventDefault();
          state.panX = touchStartPanX + dx;
          state.panY = touchStartPanY + dy;
          applyCameraTransform(container, state);
        } else if (Math.abs(dx) > Math.abs(dy) || state.isDragging) {
          e.preventDefault();
          state.yaw = touchStartYaw + dx * 0.009;
          state.pitch = Math.max(0.22, Math.min(0.95, touchStartPitch + dy * 0.0042));
          state.activePreset = '';
          syncCameraToolbarUI(container, state);
          scheduleRedraw(container, state);
        }
      }
    }, { passive: false });

    const endTouch = () => {
      if (state.isPinching) {
        state.isPinching = false;
        state.pinchCooldownUntil = Date.now() + 260;
      }
      activeTouchMode = null;
      setTimeout(() => { state.isDragging = false; }, 60);
    };
    container.addEventListener('touchend', endTouch);
    container.addEventListener('touchcancel', endTouch);
  }

  function renderMountainDiorama(container, geojson, opts) {
    if (!container) return null;
    const state = getContainerState(container);
    const options = opts || {};
    state.onSelectCamp = typeof options.onSelectCamp === 'function' ? options.onSelectCamp : null;

    if (geojson && !state.model) {
      state.model = buildEverestModel(geojson);
      if (state.selectedCampIdx >= state.model.camps.length) {
        state.selectedCampIdx = Math.max(0, state.model.camps.length - 1);
      }
    }
    const model = state.model;
    if (!model) return null;

    if (typeof options.selectedCampIdx === 'number') {
      state.selectedCampIdx = Math.max(0, Math.min(model.camps.length - 1, options.selectedCampIdx));
    }
    if (typeof options.climberProgress === 'number' && Number.isFinite(options.climberProgress)) {
      state.climberProgress = Math.max(0, Math.min(1, options.climberProgress));
    }
    if (typeof options.climberActive === 'boolean') {
      state.climberActive = options.climberActive;
    }

    bindStageInteractions(container, state);

    const zoomPct = Math.round(state.zoom * 100);
    const effectiveMode = getEffectiveMode(state);
    const viewportTouchAction = (effectiveMode === 'pan' || state.zoom > 1.02) ? 'none' : 'pan-y';
    const viewportCursor = effectiveMode === 'pan' ? 'move' : 'grab';
    const scalerStyle = `transform:translate3d(${state.panX.toFixed(2)}px, ${state.panY.toFixed(2)}px, 0) scale(${state.zoom.toFixed(4)});`;

    const campPinsHtml = model.camps.map((c, idx) => `
      <button type="button"
        class="iso-camp-pin ${idx === state.selectedCampIdx ? 'is-selected' : ''} ${c.title === 'Peak' ? 'is-peak' : ''}"
        data-camp-idx="${idx}"
        title="${escapeHtml(c.title)} (${Math.round(c.eleM)} m)">
        <span class="iso-camp-label">${escapeHtml(c.shortName)} · ${Math.round(c.eleM)}m</span>
        <span class="iso-camp-stem" aria-hidden="true"></span>
        <span class="iso-camp-dot" aria-hidden="true"></span>
      </button>
    `).join('');

    const climberPinHtml = `
      <div class="iso-climber-pin" aria-hidden="true">
        <span class="iso-climber-tag">Climber · 5,364m</span>
        <span class="iso-climber-marker"></span>
      </div>
    `;

    container.innerHTML = `
      <div class="iso-mountain-stage">
        <div class="iso-stage-toolbar">
          <div class="iso-stage-summary">
            <span class="iso-summary-count">Everest South Col</span>
            <span class="iso-inspector-sep">·</span>
            <span>${(model.totalDistM / 1000).toFixed(2)} km GPS track</span>
          </div>
          <div class="iso-toolbar-actions">
            <div class="iso-preset-controls" role="group" aria-label="Camera angle presets">
              <button type="button" class="iso-preset-btn ${state.activePreset === 'classic' ? 'is-active' : ''}" data-view-preset="classic">SW View</button>
              <button type="button" class="iso-preset-btn ${state.activePreset === 'south' ? 'is-active' : ''}" data-view-preset="south">Lhotse Face</button>
              <button type="button" class="iso-preset-btn ${state.activePreset === 'top' ? 'is-active' : ''}" data-view-preset="top">Top-Down</button>
            </div>
            <div class="iso-mode-controls" role="group" aria-label="Interaction mode">
              <button type="button" class="iso-mode-btn ${effectiveMode === 'rotate' ? 'is-active' : ''}" data-interaction-mode="rotate" aria-pressed="${effectiveMode === 'rotate'}">Rotate</button>
              <button type="button" class="iso-mode-btn ${effectiveMode === 'pan' ? 'is-active' : ''}" data-interaction-mode="pan" aria-pressed="${effectiveMode === 'pan'}">Move</button>
            </div>
            <div class="iso-zoom-controls" role="group" aria-label="Mountain zoom controls">
              <button type="button" class="iso-zoom-btn" data-zoom-delta="-0.2" aria-label="Zoom out">−</button>
              <button type="button" class="iso-zoom-btn iso-zoom-reset" data-zoom-reset="1" aria-label="Reset zoom">${zoomPct}%</button>
              <button type="button" class="iso-zoom-btn" data-zoom-delta="0.2" aria-label="Zoom in">+</button>
            </div>
          </div>
        </div>

        <div class="iso-stage-viewport" style="cursor:${viewportCursor};user-select:none;touch-action:${viewportTouchAction};">
          <div class="iso-mountain-scaler" style="${scalerStyle}">
            <canvas class="iso-mountain-canvas" width="920" height="580" role="img" aria-label="3D topographic Mount Everest expedition trail diorama"></canvas>
            <div class="iso-camps-overlay">${campPinsHtml}${climberPinHtml}</div>
          </div>
        </div>

        <div class="iso-inspector-bar">
          <div class="iso-inspector-primary">
            <div class="iso-inspector-title-row">
              <span class="iso-inspector-name"></span>
              <span class="iso-inspector-alt"></span>
            </div>
            <div class="iso-inspector-desc"></div>
          </div>
          <div class="iso-inspector-actions">
            <span class="iso-inspector-coords"></span>
            <button type="button" class="iso-step-btn" data-camp-step="-1">← Prev</button>
            <button type="button" class="iso-step-btn" data-camp-step="1">Next →</button>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.iso-preset-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-view-preset');
        state.activePreset = preset;
        if (preset === 'classic') {
          state.yaw = DEFAULT_YAW;
          state.pitch = DEFAULT_PITCH;
        } else if (preset === 'south') {
          state.yaw = 0.25;
          state.pitch = 0.44;
        } else if (preset === 'top') {
          state.yaw = 0.0;
          state.pitch = 0.94;
        }
        syncCameraToolbarUI(container, state);
        renderMountainCanvasAndPins(container, model, state);
      });
    });

    container.querySelectorAll('.iso-mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextMode = btn.getAttribute('data-interaction-mode');
        if (nextMode === 'rotate' || nextMode === 'pan') {
          state.interactionMode = nextMode;
          state.manualMode = true;
          syncCameraToolbarUI(container, state);
        }
      });
    });

    container.querySelectorAll('.iso-zoom-btn').forEach((btn) => {
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

    const selectCamp = (idx) => {
      state.selectedCampIdx = Math.max(0, Math.min(model.camps.length - 1, idx));
      renderMountainCanvasAndPins(container, model, state);
      updateInspectorBar(container, state);
      if (state.onSelectCamp) state.onSelectCamp(state.selectedCampIdx, model);
    };

    container.querySelectorAll('.iso-camp-pin').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (state.isDragging || state.isPinching || Date.now() < state.pinchCooldownUntil) return;
        const idx = parseInt(btn.getAttribute('data-camp-idx'), 10);
        if (!isNaN(idx)) selectCamp(idx);
      });
    });

    container.querySelectorAll('.iso-step-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.getAttribute('data-camp-step'), 10);
        if (!isNaN(step)) selectCamp(state.selectedCampIdx + step);
      });
    });

    renderMountainCanvasAndPins(container, model, state);
    updateInspectorBar(container, state);
    return model;
  }

  function selectMountainCamp(container, campIdx) {
    if (!container) return;
    const state = getContainerState(container);
    if (!state.model) return;
    state.selectedCampIdx = Math.max(0, Math.min(state.model.camps.length - 1, campIdx));
    renderMountainCanvasAndPins(container, state.model, state);
    updateInspectorBar(container, state);
  }

  function setMountainClimberProgress(container, progress, opts) {
    if (!container) return null;
    const state = getContainerState(container);
    const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
    state.climberProgress = p;
    if (opts && typeof opts.isActive === 'boolean') {
      state.climberActive = opts.isActive;
    }
    if (!state.model) return null;
    renderMountainCanvasAndPins(container, state.model, state);
    return sampleTrailAtProgress(state.model, p);
  }

  root.buildEverestModel = buildEverestModel;
  root.sampleEverestTrailAtProgress = sampleTrailAtProgress;
  root.renderMountainDiorama = renderMountainDiorama;
  root.selectMountainCamp = selectMountainCamp;
  root.setMountainClimberProgress = setMountainClimberProgress;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
