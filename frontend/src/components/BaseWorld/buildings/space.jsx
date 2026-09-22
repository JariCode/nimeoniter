// World-3 (space colony) building SVGs, following the exact same pattern as
// city.jsx: pure components taking only `justBuilt` (the stage key just
// built, for the pop-in animation); the has('key')/world gating stays in
// BaseWorld at the call site. These render inside BaseWorld's shared <svg>,
// so gradient/filter ids (spaceMetal, reactorCore, ...) resolve against
// BaseWorld's shared <defs>, and CSS classes (neon-pulse, reactor-pulse,
// christmas-light-glow, ...) live in BaseWorld.css.
//
// Depth composition: like the city (skyscraper back, apartment/hotel mid,
// casino/theater front, each wrapped in its own translate+scale), each
// space building below is wrapped in an outer translate+scale group that
// repositions its own ground-anchor (the shadow ellipse) onto one of three
// depth rows and rescales it — back row smaller (0.85x) and drawn first,
// mid row at 1.1x, front row biggest (1.15-1.5x) and drawn last so it
// overlaps the rows behind it, the same front-over-back/mid depth cue the
// city's casino/apartment and casino/skyscraper pairs use. Within each
// cluster the three rows are staggered in x too (not stacked on one line),
// so the composition reads as a spread-out compound rather than two flat
// walls hugging the canvas edges: left cluster runs lab (x60, innermost) ->
// greenhouse (x75, front) -> comms-tower (x130, back) -> habitat (x150,
// outermost); right cluster runs solar-array (x320, innermost) ->
// command-tower (x330, back) -> reactor (x360, front, outermost). Both
// clusters stay clear of the survivor's spot (~x220-270) and the
// NIMEONITER sign (~x216-304).

// LANDING PAD — the colony's first build: a metal deck in true perspective,
// narrower at the back edge (inset from the canvas sides) and flaring
// wider toward the viewer (front edge bleeds past both canvas sides), so
// it reads as a landing strip coming toward the camera rather than a flat
// horizontal band. Occupies the same ground-level real estate the
// village's field/city's street once did. The front edge (300) reaches
// the very bottom of the viewBox, running the deck right up under the
// NIMEONITER sign's own ground shadow (cy 294 in BaseWorld).
const PAD_BACK = { y: 216, x0: 50, x1: 370 };
const PAD_FRONT = { y: 300, x0: -10, x1: 410 };
export function LandingPad({ justBuilt }) {
  const seamCount = 10;
  const stripeCount = 24;
  return (
    <g className={justBuilt === 'landing-pad' ? 'building-pop' : undefined}>
      <g>
        <path
          d={`M ${PAD_BACK.x0} ${PAD_BACK.y} L ${PAD_BACK.x1} ${PAD_BACK.y} L ${PAD_FRONT.x1} ${PAD_FRONT.y} L ${PAD_FRONT.x0} ${PAD_FRONT.y} Z`}
          fill="url(#spaceMetal)"
          opacity="0.9"
        />
        <path
          d={`M ${PAD_BACK.x0} ${PAD_BACK.y} L ${PAD_BACK.x1} ${PAD_BACK.y} L ${PAD_FRONT.x1} ${PAD_FRONT.y} L ${PAD_FRONT.x0} ${PAD_FRONT.y} Z`}
          fill="none"
          stroke="#12151c"
          strokeWidth="1"
          opacity="0.5"
        />
        {/* panel seams converging from the narrow back edge to the wide front edge */}
        {Array.from({ length: seamCount }, (_, i) => {
          const frac = i / (seamCount - 1);
          const backX = PAD_BACK.x0 + frac * (PAD_BACK.x1 - PAD_BACK.x0);
          const frontX = PAD_FRONT.x0 + frac * (PAD_FRONT.x1 - PAD_FRONT.x0);
          return <line key={i} x1={backX} y1={PAD_BACK.y} x2={frontX} y2={PAD_FRONT.y} stroke="#12151c" strokeWidth="0.8" opacity="0.4" />;
        })}
        {/* hazard stripe along the (wide) front edge */}
        {Array.from({ length: stripeCount }, (_, i) => (
          <rect
            key={i}
            x={PAD_FRONT.x0 + i * ((PAD_FRONT.x1 - PAD_FRONT.x0) / stripeCount)}
            y={PAD_FRONT.y - 6}
            width={(PAD_FRONT.x1 - PAD_FRONT.x0) / stripeCount * 0.55}
            height="4"
            fill={i % 2 === 0 ? '#f0c040' : '#1a1a22'}
            opacity="0.7"
          />
        ))}
        {/* central landing ring, glowing cyan, set toward the near half of the deck */}
        <circle cx="200" cy="248" r="34" fill="none" stroke="#3de0ff" strokeWidth="1.6" opacity="0.5" />
        <circle cx="200" cy="248" r="18" fill="none" stroke="#3de0ff" strokeWidth="1.3" opacity="0.85" className="neon-pulse" />
        {/* perimeter marker lights near the deck's back and front corners */}
        {[[64, 218], [356, 218], [4, 294], [396, 294]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#ffd97a" className="christmas-light-glow" style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
      </g>
    </g>
  );
}

// COMMAND TOWER — back row, right cluster (innermost of the three): the
// space world's final build, the same back-layer real estate the
// wall+tower/skyscraper occupy. Scaled down (0.85x) and drawn first so the
// taller/showier reactor in front of it partly covers its foot, leaving its
// dome and beacon rising above — the same relationship the city's
// skyscraper has with the casino at its feet.
export function CommandTower({ justBuilt }) {
  return (
    <g transform="translate(36.75,27.3) scale(0.85)">
    <g className={justBuilt === 'command-tower' ? 'building-pop' : undefined}>
      <ellipse cx="345" cy="222" rx="32" ry="6" fill="#000" opacity="0.45" />
      {/* main hull shaft */}
      <rect x="320" y="46" width="50" height="176" fill="url(#spaceMetal)" />
      <rect x="320" y="46" width="50" height="176" fill="none" stroke="#12151c" strokeWidth="1" opacity="0.5" />
      {/* tapered command dome on top */}
      <path d="M 320 46 L 330 20 L 360 20 L 370 46 Z" fill="url(#spaceMetalDark)" />
      <ellipse cx="345" cy="24" rx="14" ry="6" fill="url(#spaceGlassCyan)" opacity="0.9" />
      {/* window grid, lit in a scattered pattern */}
      {Array.from({ length: 12 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => {
          const lit = (row * 5 + col) % 3 !== 0;
          return (
            <rect
              key={`${row}-${col}`}
              x={325 + col * 9}
              y={52 + row * 13.5}
              width="6"
              height="8"
              fill={lit ? '#8fe0ff' : '#14172a'}
              opacity={lit ? 0.85 : 0.6}
            />
          );
        })
      )}
      {/* vertical status strip lights running the tower's height */}
      <rect x="317" y="46" width="2" height="176" fill="#3de0ff" className="neon-pulse" opacity="0.85" />
      <rect x="371" y="46" width="2" height="176" fill="#ff5a5a" className="neon-pulse" opacity="0.85" />
      {/* rooftop antenna with a blinking beacon */}
      <line x1="345" y1="14" x2="345" y2="-8" stroke="#1c1e2c" strokeWidth="1.6" />
      <circle cx="345" cy="-9" r="2.2" fill="#ff5a5a" className="skyscraper-beacon" />
      <circle cx="345" cy="-9" r="6" fill="url(#spaceBeaconGlow)" className="skyscraper-beacon" />
    </g>
    </g>
  );
}

// COMMS TOWER — back row, left cluster: a slim mast with a satellite dish
// and a blinking beacon. Scaled down (0.85x) like command tower — its thin
// mast/dish stay readable above the habitat/greenhouse in front of it.
export function CommsTower({ justBuilt }) {
  return (
    <g transform="translate(-44.25,27.3) scale(0.85)">
    <g className={justBuilt === 'comms-tower' ? 'building-pop' : undefined}>
      <ellipse cx="205" cy="222" rx="14" ry="4" fill="#000" opacity="0.4" />
      {/* base housing */}
      <rect x="196" y="205" width="18" height="17" fill="url(#spaceMetalDark)" />
      {/* mast */}
      <line x1="205" y1="205" x2="205" y2="70" stroke="#3a4048" strokeWidth="3" />
      {/* guy wires */}
      <line x1="205" y1="120" x2="188" y2="205" stroke="#3a4048" strokeWidth="0.8" opacity="0.6" />
      <line x1="205" y1="120" x2="222" y2="205" stroke="#3a4048" strokeWidth="0.8" opacity="0.6" />
      {/* satellite dish on a short strut */}
      <line x1="205" y1="72" x2="193" y2="58" stroke="#3a4048" strokeWidth="2" />
      <ellipse cx="193" cy="58" rx="16" ry="7" fill="url(#spaceGlassCyan)" opacity="0.85" stroke="#12151c" strokeWidth="1" transform="rotate(-20 193 58)" />
      {/* blinking beacon on top of the mast */}
      <circle cx="205" cy="68" r="2" fill="#ff5a5a" className="skyscraper-beacon" />
    </g>
    </g>
  );
}

// HABITAT — mid row, left cluster (innermost, closest to center): a
// cluster of round crew-quarters pods linked by a low connecting tube, lit
// portholes standing in for the city apartment's lit windows. Its left
// pod is partly covered by the greenhouse in front of it, the same way the
// city's apartment is partly covered by its casino, while its right pod
// stays clear, short of the survivor's spot.
export function Habitat({ justBuilt }) {
  return (
    <g transform="translate(16.9,-10.2) scale(1.1)">
    <g className={justBuilt === 'habitat' ? 'building-pop' : undefined}>
      <ellipse cx="121" cy="222" rx="55" ry="7" fill="#000" opacity="0.4" />
      {/* connecting tube along the ground */}
      <rect x="83" y="205" width="80" height="10" rx="5" fill="url(#spaceMetalDark)" />
      {/* two round habitat pods */}
      <circle cx="93" cy="188" r="26" fill="url(#spaceMetal)" />
      <circle cx="93" cy="188" r="26" fill="none" stroke="#12151c" strokeWidth="1" opacity="0.5" />
      <circle cx="156" cy="196" r="20" fill="url(#spaceMetal)" />
      <circle cx="156" cy="196" r="20" fill="none" stroke="#12151c" strokeWidth="1" opacity="0.5" />
      {/* lit portholes */}
      {[[83, 182], [100, 178], [88, 198], [148, 190], [164, 200]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4.4" fill="#0e1420" />
          <circle cx={x} cy={y} r="3.2" fill="#ffd97a" opacity="0.85" />
        </g>
      ))}
      {/* entry hatch on the connecting tube */}
      <rect x="118" y="205" width="10" height="14" rx="2" fill="#151628" />
    </g>
    </g>
  );
}

// GREENHOUSE — front row, left cluster: a translucent dome with plant
// silhouettes glowing inside, the space world's casino/theater-style
// showpiece on this side. Scaled up (1.5x) and drawn last so it sits in
// front of the habitat/comms-tower/lab behind it, closest to the viewer —
// its ground anchor sits further down (278) than the back/mid rows,
// pushed well forward to read as the near-camera showpiece.
export function Greenhouse({ justBuilt }) {
  return (
    <g transform="translate(-303,-55) scale(1.5)">
    <g className={justBuilt === 'greenhouse' ? 'building-pop' : undefined}>
      <ellipse cx="252" cy="222" rx="40" ry="6" fill="#000" opacity="0.4" />
      {/* base ring */}
      <rect x="216" y="210" width="72" height="12" fill="url(#spaceMetalDark)" />
      {/* translucent dome */}
      <path d="M 216 210 A 36 36 0 0 1 288 210 Z" fill="url(#greenhouseGlass)" stroke="#3de0ff" strokeWidth="1" opacity="0.9" />
      {/* dome frame ribs */}
      <path d="M 252 174 L 252 210 M 230 179 L 239 210 M 274 179 L 265 210" stroke="#12151c" strokeWidth="1" opacity="0.4" fill="none" />
      {/* plant silhouettes glowing inside */}
      <circle cx="234" cy="204" r="6" fill="#3a7a3a" opacity="0.85" />
      <circle cx="252" cy="200" r="8" fill="#4a9a4a" opacity="0.85" />
      <circle cx="270" cy="205" r="6" fill="#3a7a3a" opacity="0.85" />
    </g>
    </g>
  );
}

// SOLAR ARRAY — mid row, right cluster (innermost, closest to center):
// three angled panels on ground struts, a low-profile power installation
// standing in for the city's parked-car street prop. Its low profile sits
// well above the survivor's head height, so its left edge can safely reach
// toward the survivor's spot without visually crowding it.
export function SolarArray({ justBuilt }) {
  return (
    <g transform="translate(-54.2,-10.2) scale(1.1)">
    <g className={justBuilt === 'solar-array' ? 'building-pop' : undefined}>
      <ellipse cx="322" cy="222" rx="48" ry="5" fill="#000" opacity="0.35" />
      {[292, 322, 352].map((cx, i) => (
        <g key={i}>
          <line x1={cx} y1="222" x2={cx} y2="200" stroke="#3a4048" strokeWidth="2.4" />
          <rect x={cx - 15} y="188" width="30" height="13" fill="url(#solarPanel)" transform={`rotate(-12 ${cx} 195)`} />
          <line x1={cx - 15} y1="195" x2={cx + 15} y2="195" stroke="#6fb0e0" strokeWidth="0.6" opacity="0.5" transform={`rotate(-12 ${cx} 195)`} />
        </g>
      ))}
    </g>
    </g>
  );
}

// LAB — left cluster: a modest research module with a curved observation
// window and blinking instrument lights along its base. Uses the darker
// metal tone so it reads as a distinct structure next to the habitat
// pods' lighter gray. Pulled fully onto the canvas (it used to bleed off
// the left edge), then further toward center and forward so more of it
// shows past the greenhouse in front of it.
export function Lab({ justBuilt }) {
  return (
    <g transform="translate(46.6,-16.4) scale(1.2)">
    <g className={justBuilt === 'lab' ? 'building-pop' : undefined}>
      <ellipse cx="32" cy="222" rx="34" ry="7" fill="#000" opacity="0.4" />
      <rect x="0" y="188" width="64" height="34" fill="url(#spaceMetalDark)" />
      <rect x="0" y="188" width="64" height="34" fill="none" stroke="#12151c" strokeWidth="1" opacity="0.5" />
      {/* curved observation window */}
      <rect x="8" y="195" width="48" height="16" rx="8" fill="url(#spaceGlassCyan)" opacity="0.85" />
      {/* blinking instrument lights along the base */}
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={6 + i * 10} cy="216" r="1.6" fill={i % 2 === 0 ? '#3de0ff' : '#ffd97a'} className="christmas-light-glow" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
      {/* entry hatch */}
      <rect x="22" y="210" width="12" height="12" fill="#151628" />
    </g>
    </g>
  );
}

// REACTOR — front row, right cluster: the colony's showiest build, a
// glowing energy core in a metal containment housing, the space world's
// casino/theater equivalent. Scaled up the most (1.5x) and drawn last so
// it sits in front of the command tower's foot for the same front-over-back
// depth the city's casino/skyscraper pair uses — its ground anchor sits
// further down (266) and slightly left of the tower/solar-array behind it,
// closer toward the viewer.
export function Reactor({ justBuilt }) {
  return (
    <g transform="translate(-177.5,-67) scale(1.5)">
    <g className={justBuilt === 'reactor' ? 'building-pop' : undefined}>
      <ellipse cx="345" cy="222" rx="34" ry="7" fill="#000" opacity="0.45" />
      {/* containment housing */}
      <rect x="315" y="170" width="60" height="52" fill="url(#spaceMetalDark)" />
      <rect x="315" y="170" width="60" height="52" fill="none" stroke="#12151c" strokeWidth="1" opacity="0.5" />
      {/* support struts */}
      <line x1="320" y1="222" x2="330" y2="170" stroke="#3a4048" strokeWidth="1.4" />
      <line x1="370" y1="222" x2="360" y2="170" stroke="#3a4048" strokeWidth="1.4" />
      {/* containment rings around the glowing core */}
      <ellipse cx="345" cy="188" rx="26" ry="9" fill="none" stroke="#3de0ff" strokeWidth="1" opacity="0.6" />
      <ellipse cx="345" cy="188" rx="9" ry="26" fill="none" stroke="#3de0ff" strokeWidth="1" opacity="0.4" />
      {/* glowing energy core */}
      <circle cx="345" cy="188" r="18" fill="url(#reactorCore)" filter="url(#glow)" className="reactor-pulse" />
      <circle cx="345" cy="188" r="18" fill="none" stroke="#8fe0ff" strokeWidth="1.2" opacity="0.9" />
      {/* status lights along the housing base */}
      {Array.from({ length: 4 }, (_, i) => (
        <circle key={i} cx={322 + i * 12} cy="216" r="1.6" fill="#ff5a5a" className="christmas-light-glow" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </g>
    </g>
  );
}
