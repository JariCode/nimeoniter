// World-3 (space colony) building SVGs, following the exact same pattern as
// city.jsx: pure components taking only `justBuilt` (the stage key just
// built, for the pop-in animation); the has('key')/world gating stays in
// BaseWorld at the call site. These render inside BaseWorld's shared <svg>,
// so gradient/filter ids (spaceMetal, reactorCore, ...) resolve against
// BaseWorld's shared <defs>, and CSS classes (neon-pulse, reactor-pulse,
// christmas-light-glow, ...) live in BaseWorld.css.

// LANDING PAD — the colony's first build, a metal deck spanning the full
// width with a glowing landing ring, occupying the same ground-level real
// estate the village's field/city's street once did.
export function LandingPad({ justBuilt }) {
  return (
    <g className={justBuilt === 'landing-pad' ? 'building-pop' : undefined}>
      <g>
        <rect x="0" y="225" width="400" height="24" fill="url(#spaceMetal)" opacity="0.9" />
        <rect x="0" y="225" width="400" height="24" fill="none" stroke="#12151c" strokeWidth="1" opacity="0.5" />
        {/* panel seams across the deck */}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={i * 40} y1="225" x2={i * 40} y2="249" stroke="#12151c" strokeWidth="0.8" opacity="0.4" />
        ))}
        {/* hazard stripe along the front edge */}
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={i} x={i * 20} y="245" width="10" height="4" fill={i % 2 === 0 ? '#f0c040' : '#1a1a22'} opacity="0.7" />
        ))}
        {/* central landing ring, glowing cyan */}
        <circle cx="200" cy="236" r="24" fill="none" stroke="#3de0ff" strokeWidth="1.4" opacity="0.5" />
        <circle cx="200" cy="236" r="13" fill="none" stroke="#3de0ff" strokeWidth="1.2" opacity="0.85" className="neon-pulse" />
        {/* perimeter marker lights */}
        {[30, 90, 310, 370].map((x, i) => (
          <circle key={i} cx={x} cy="236" r="2" fill="#ffd97a" className="christmas-light-glow" style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
      </g>
    </g>
  );
}

// COMMAND TOWER — back-right tower, the space world's final build, the same
// back-layer real estate the wall+tower/skyscraper occupy. Metal hull with a
// tapered command dome and a blinking rooftop beacon.
export function CommandTower({ justBuilt }) {
  return (
    <g className={justBuilt === 'command-tower' ? 'building-pop' : undefined}>
      <g>
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

// HABITAT — mid-left cluster of round crew-quarters pods linked by a low
// connecting tube, lit portholes standing in for the city apartment's lit
// windows.
export function Habitat({ justBuilt }) {
  return (
    <g className={justBuilt === 'habitat' ? 'building-pop' : undefined}>
      <g>
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

// COMMS TOWER — a slim mast with a satellite dish and a blinking beacon,
// medium height, standing between the habitat and greenhouse.
export function CommsTower({ justBuilt }) {
  return (
    <g className={justBuilt === 'comms-tower' ? 'building-pop' : undefined}>
      <g>
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

// GREENHOUSE — a translucent dome with plant silhouettes glowing inside,
// standing in for the city's ground-level storefronts.
export function Greenhouse({ justBuilt }) {
  return (
    <g className={justBuilt === 'greenhouse' ? 'building-pop' : undefined}>
      <g>
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

// SOLAR ARRAY — three angled panels on ground struts, a low-profile power
// installation standing in for the city's parked-car street prop.
export function SolarArray({ justBuilt }) {
  return (
    <g className={justBuilt === 'solar-array' ? 'building-pop' : undefined}>
      <g>
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

// LAB — a modest research module, far front-left (clear of the habitat
// cluster to its right), with a curved observation window and blinking
// instrument lights along its base. Uses the darker metal tone so it reads
// as a distinct structure next to the habitat pods' lighter gray.
export function Lab({ justBuilt }) {
  return (
    <g className={justBuilt === 'lab' ? 'building-pop' : undefined}>
      <g>
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

// REACTOR — the colony's showiest build, a glowing energy core in a metal
// containment housing, the space world's casino/theater equivalent. Sits in
// front of the command tower's foot for the same front-over-back depth the
// city's casino/skyscraper pair uses.
export function Reactor({ justBuilt }) {
  return (
    <g className={justBuilt === 'reactor' ? 'building-pop' : undefined}>
      <g>
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
