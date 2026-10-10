/** Botanical Plant Definition: Marigold (सयपत्री) — enhanced */
(function(root) {
function createMarigoldDefinition() {
	const defs = `<defs>
    <linearGradient id="stem" x1="0" x2="1"><stop stop-color="#224c24"/><stop offset=".45" stop-color="#72994a"/><stop offset="1" stop-color="#345f2d"/></linearGradient>
    <linearGradient id="leaf" x1="0" y1="1" x2=".7" y2="0"><stop stop-color="#173f26"/><stop offset=".5" stop-color="#397339"/><stop offset="1" stop-color="#75954a"/></linearGradient>
    <linearGradient id="petal" x1="0" y1="1" x2=".25" y2="0"><stop stop-color="#bd4c08"/><stop offset=".45" stop-color="#ef8b12"/><stop offset=".82" stop-color="#ffc637"/><stop offset="1" stop-color="#ffdc62"/></linearGradient>
    <linearGradient id="dry" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#674b31"/><stop offset="1" stop-color="#b39c64"/></linearGradient>
    <radialGradient id="earth"><stop stop-color="#5c6350" stop-opacity=".17"/><stop offset="1" stop-color="#5c6350" stop-opacity="0"/></radialGradient>
  </defs>`;
	const soil = `<ellipse cx="50" cy="91" rx="29" ry="4" fill="url(#earth)"/>`;
	function leaf(x, y, angle, scale = 1, dry = false) {
		let parts = `<path d="M0 0 Q8 -1 20 -1" fill="none" stroke="${dry ? "#82734a" : "#567941"}" stroke-width=".45"/>`;
		for (let i = 0; i < 5; i++) {
			const px = 3 + i * 3.1;
			const length = 8 - i * .65;
			for (const side of [-1, 1]) {
				parts += `<g transform="translate(${px} -.5) scale(1 ${side}) rotate(${-32 + i * 2})"><path d="M0 0 Q2 -2.5 4 -3 L4.5 -4 L5.2 -3.8 L6 -4.5 L6.4 -3.6 L${length} -3.3 L${length + 2} -2.4 L${length} -1.2 L6.6 -.9 L6 -.2 L5.2 -.6 L4.5 .2 Q2 .4 0 0" fill="url(#${dry ? "dry" : "leaf"})"/><path d="M.5 -.2 L${length + 1} -2.4" stroke="${dry ? "#c1ab73" : "#98af63"}" stroke-width=".16" opacity=".6"/></g>`;
			}
		}
		parts += `<path d="M16 -1 Q21 -5 25 -1 Q21 2 16 -1" fill="url(#${dry ? "dry" : "leaf"})"/>`;
		return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">${parts}</g>`;
	}
	function flower(x, y, size, dry = false) {
		// Only the overlapping petals define the silhouette: no disk or clipping boundary.
		let petals = "";
		for (let ring = 0; ring < 7; ring++) {
			const count = 32 - ring * 3;
			const radius = 17 - ring * 2.3;
			for (let i = 0; i < count; i++) {
				const angle = i * 360 / count + ring * 18 + Math.sin(i * 3.7) * 5;
				const width = (2.2 - ring * .13) * (1 + Math.sin(i * 4.3 + ring) * .18);
				const length = 5.1 - ring * .35 + Math.sin(i * 2.9) * 1.2;
				const irregularRadius = radius + (Math.sin(i * 2.37 + ring * 1.9) * 1.35 + Math.sin(i * .83 + ring) * 1.1) * (1 - ring * .09);
				const tip = 1.2 + (1 + Math.sin(i * 3.13 + ring)) * .8;
				petals += `<g transform="rotate(${angle}) translate(0 ${-irregularRadius}) rotate(${Math.sin(i * 1.8 + ring) * 22})"><path d="M0 ${length} C${-width} ${length * .6} ${-width - .4} .6 ${-width} -.4 L${-width * 1.1} ${-tip * .7} L${-width * .82} ${-tip * 1.15} L${-width * .6} ${-tip * .65} Q${-width * .43} ${-tip * 1.4} ${-width * .25} ${-tip * 1.2} L${-width * .12} ${-tip * .55} L${width * .15} ${-tip * 1.35} L${width * .32} ${-tip * .9} L${width * .55} ${-tip * 1.18} L${width * .68} ${-tip * .6} L${width * .92} ${-tip} L${width} -.5 C${width + .3} 1 ${width * .65} ${length * .8} 0 ${length}Z" fill="url(#${dry ? "dry" : "petal"})"/><path d="M0 ${length * .85} Q-.6 1 .1 ${-tip * .65}" fill="none" stroke="${dry ? "#d0b986" : "#ffe57e"}" stroke-width=".22" opacity=".55"/></g>`;
			}
		}
		return `<g transform="translate(${x} ${y}) scale(${size})">${petals}</g>`;
	}
	const sprout = `${defs}${soil}<path d="M50 90 Q48 79 50 69" stroke="url(#stem)" stroke-width="1.5" fill="none"/><path d="M50 73 C43 66 36 66 35 68 C35 73 46 76 50 73" fill="url(#leaf)"/><path d="M50 73 C56 65 64 65 65 67 C65 73 55 76 50 73" fill="url(#leaf)"/>${leaf(50, 69, -50, .27)}${leaf(50, 70, -142, .23)}`;
	const growing = `${defs}${soil}<path d="M50 90 Q48 73 50 56 Q51 51 50 47" fill="none" stroke="url(#stem)" stroke-width="2"/>${leaf(50, 79, -157, .8)}${leaf(50, 76, -22, .9)}${leaf(50, 65, -143, .65)}${leaf(50, 60, -33, .6)}<path d="M50 49 C42 47 42 36 47 33 Q50 30 53 33 C59 38 57 47 50 49" fill="url(#leaf)"/><path d="M45 38 Q45 30 49 31 Q50 28 52 31 Q55 30 56 38 L54 41 L47 40Z" fill="url(#petal)"/><path d="M46 38 L49 47 M50 39 L50 48 M54 38 L52 47" stroke="#9caa57" stroke-width=".45" fill="none"/>`;
	const mature = `${defs}${soil}<path d="M50 90 Q47 71 49 55 L49 31" fill="none" stroke="url(#stem)" stroke-width="2.4"/><path d="M49 65 Q63 57 69 44 M49 76 Q34 63 30 51" fill="none" stroke="url(#stem)" stroke-width="1.3"/>${leaf(49, 82, -158, 1)}${leaf(49, 76, -23, 1.12)}${leaf(49, 64, -151, .98)}${leaf(56, 60, -14, .82)}${leaf(48, 50, -141, .78)}${leaf(66, 49, -38, .52)}<path d="M43 34 Q49 45 55 34 L52 27 L46 27Z" fill="url(#leaf)"/><path d="M65 46 Q69 52 74 45 L71 39 L67 39Z" fill="url(#leaf)"/>${flower(69, 40, .47)}<path d="M27 53 Q23 45 28 42 Q32 40 34 45 Q36 49 31 54Z" fill="url(#leaf)"/><path d="M27 44 Q28 39 31 42 L33 46Z" fill="url(#petal)"/>${flower(49, 27, 1)}`;
	const withered = `${defs}${soil}<path d="M50 90 Q46 70 48 53 Q49 40 58 44 L63 49" fill="none" stroke="url(#dry)" stroke-width="1.8"/>${leaf(48, 77, 155, .85, true)}${leaf(48, 68, 28, .8, true)}${leaf(48, 57, 174, .55, true)}<path d="M57 46 Q65 43 69 51 L62 57Z" fill="url(#dry)"/><g transform="rotate(24 66 55)">${flower(66, 55, .64, true)}</g><path d="M56 65 Q61 70 59 72 M72 68 L75 72" stroke="url(#dry)" stroke-width="1" fill="none"/>`;
	return {
		id: 33,
		slug: "marigold",
		english: "Marigold",
		nepali: "सयपत्री",
		scientific: "Tagetes erecta",
		category: "Flower",
		icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" stroke-dasharray="2 2"/></svg>',
		desc: "The glorious hundred-petaled (सयपत्री) golden-orange flower essential to Tihar garlands and sacred blessings.",
		stages: {
			sprout,
			growing,
			mature,
			withered
		}
	};
}
root.NEPAL_PLANTS_REGISTRY = root.NEPAL_PLANTS_REGISTRY || {};
root.NEPAL_PLANTS_REGISTRY.marigold = createMarigoldDefinition();
})(typeof globalThis !== 'undefined' ? globalThis : window);
