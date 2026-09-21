// World-2 (city) building SVGs, extracted from BaseWorld.jsx as a pure move
// — same coordinates, same gradients, same markup. Each component only
// needs `justBuilt` (the stage key just built, for the pop-in animation);
// the has('key')/world gating stays in BaseWorld at the call site, and the
// gradient/filter ids (cityGlass, neonPinkGlow, ...) resolve against
// BaseWorld's shared <defs> since these components render inside the same
// <svg>. CSS classes (neon-pulse, skyscraper-beacon, ...) stay in
// BaseWorld.css.

// SKYSCRAPER — back-right tower, the city world's final build, occupying
// the same back-layer real estate as the wall+tower. Wrapped in a scale
// (pivoting on its own ground anchor at 352,222) to grow it in proportion
// to the survivor figure without touching any of its inner coordinates.
export function Skyscraper({ justBuilt }) {
  return (
    <g transform="translate(-52.8,-33.3) scale(1.15)">
    <g className={justBuilt === 'skyscraper' ? 'building-pop' : undefined}>
      <ellipse cx="352" cy="222" rx="30" ry="6" fill="#000" opacity="0.45" />
      {/* main glass shaft, reaching high into the sky */}
      <rect x="326" y="42" width="52" height="180" fill="url(#cityGlass)" />
      <rect x="326" y="42" width="52" height="180" fill="none" stroke="#0c0d16" strokeWidth="1" opacity="0.5" />
      {/* setback crown */}
      <rect x="333" y="26" width="38" height="18" fill="url(#cityGlassDark)" />
      <rect x="340" y="12" width="24" height="16" fill="url(#cityGlassDark)" />
      {/* window grid, lit in a scattered pattern like a real skyline */}
      {Array.from({ length: 12 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => {
          const lit = (row * 5 + col) % 3 !== 0;
          return (
            <rect
              key={`${row}-${col}`}
              x={331 + col * 9.5}
              y={50 + row * 13.5}
              width="6.5"
              height="8"
              fill={lit ? '#ffd97a' : '#14172a'}
              opacity={lit ? 0.9 : 0.7}
            />
          );
        })
      )}
      {/* vertical neon strip running down the corner */}
      <rect x="378" y="30" width="2.4" height="192" fill="#ff3d9a" className="neon-pulse" opacity="0.9" />
      <rect x="323" y="30" width="2.4" height="192" fill="#3de0ff" className="neon-pulse" opacity="0.9" />
      {/* rooftop antenna with a blinking beacon */}
      <line x1="352" y1="12" x2="352" y2="-8" stroke="#1c1e2c" strokeWidth="1.6" />
      <circle cx="352" cy="-9" r="2.2" fill="#ff3d9a" className="skyscraper-beacon" />
      <circle cx="352" cy="-9" r="6" fill="url(#neonPinkGlow)" className="skyscraper-beacon" />
    </g>
    </g>
  );
}

// APARTMENT — mid-left block of flats, lit windows in mixed colors,
// rooftop water tank. Wrapped in a scale+reposition (pivoting on its own
// ground anchor at 90,222, target 100,222) to grow it and shift it right a
// touch, since the front-layer Casino now overlaps its left side for depth.
export function Apartment({ justBuilt }) {
  return (
    <g transform="translate(-17,-66.6) scale(1.3)">
    <g className={justBuilt === 'apartment' ? 'building-pop' : undefined}>
    <g>
      <ellipse cx="90" cy="222" rx="48" ry="8" fill="#000" opacity="0.4" />
      <rect x="56" y="162" width="70" height="60" fill="url(#cityConcrete)" />
      <rect x="56" y="162" width="70" height="60" fill="none" stroke="#100f18" strokeWidth="1" opacity="0.5" />
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => {
          const lit = (row + col) % 2 === 0;
          return (
            <rect
              key={`${row}-${col}`}
              x={61 + col * 13}
              y={168 + row * 13}
              width="9"
              height="9"
              fill={lit ? '#ffd97a' : '#3de0ff'}
              opacity={lit ? 0.9 : 0.55}
            />
          );
        })
      )}
      {/* rooftop water tank */}
      <rect x="66" y="148" width="14" height="12" rx="2" fill="url(#cityConcrete)" />
      <path d="M 66 148 L 73 140 L 80 148 Z" fill="#1c1a28" />
      {/* small neon "APT" sign, shifted toward the right edge of the
          facade so the now much-further-left Casino doesn't cover it */}
      <rect x="100" y="210" width="16" height="12" fill="#0d0c14" />
      <text x="108" y="219" fontFamily="Georgia, serif" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#3de0ff" className="neon-pulse">APT</text>
    </g>
    </g>
    </g>
  );
}

// HOTEL — mid tower, taller than the apartment, vertical neon sign running
// down its face. Wrapped in a scale (pivoting on its own ground anchor at
// 195,222) to grow it in proportion to the survivor figure.
export function Hotel({ justBuilt }) {
  return (
    <g transform="translate(-48.75,-55.5) scale(1.25)">
    <g className={justBuilt === 'hotel' ? 'building-pop' : undefined}>
    <g>
      <ellipse cx="195" cy="222" rx="30" ry="6" fill="#000" opacity="0.4" />
      <rect x="172" y="140" width="46" height="82" fill="url(#cityGlass)" />
      <rect x="172" y="140" width="46" height="82" fill="none" stroke="#0c0d16" strokeWidth="1" opacity="0.5" />
      {Array.from({ length: 6 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => {
          const lit = (row * 3 + col) % 4 !== 1;
          return (
            <rect
              key={`${row}-${col}`}
              x={177 + col * 14}
              y={146 + row * 12}
              width="10"
              height="7"
              fill={lit ? '#fff3b0' : '#151628'}
              opacity={lit ? 0.85 : 0.6}
            />
          );
        })
      )}
      {/* vertical "HOTEL" neon sign down the left edge */}
      <rect x="163" y="140" width="9" height="70" fill="#0d0c14" />
      {'HOTEL'.split('').map((ch, i) => (
        <text
          key={i}
          x="167.5"
          y={152 + i * 12}
          fontFamily="Georgia, serif"
          fontSize="7"
          fontWeight="bold"
          textAnchor="middle"
          fill="#ffd23d"
          className="neon-pulse"
        >
          {ch}
        </text>
      ))}
    </g>
    </g>
    </g>
  );
}

// SHOP — small storefront, lit awning and a neon window sign, kept at its
// original horizontal spot next to the hotel's foot but brought further
// forward (bigger, lower) onto the near side of the street, close to the
// NIMEONITER sign's depth, so it reads as street-level rather than a
// background silhouette.
export function Shop({ justBuilt }) {
  return (
    <g transform="translate(104,-196) scale(2)">
    <g className={justBuilt === 'shop' ? 'building-pop' : undefined}>
    <g transform="translate(-2,-2)">
      <ellipse cx="35" cy="241" rx="18" ry="4.5" fill="#000" opacity="0.4" />
      <rect x="20" y="216" width="30" height="24" fill="url(#cityConcrete)" />
      <rect x="24" y="222" width="22" height="14" fill="#151628" />
      <rect x="26" y="224" width="8" height="10" fill="#fff3b0" opacity="0.85" />
      <rect x="36" y="224" width="8" height="10" fill="#3de0ff" opacity="0.7" />
      {/* striped awning */}
      <path d="M 18 216 L 52 216 L 48 208 L 22 208 Z" fill="#ff3d9a" opacity="0.9" />
      <path d="M 22 208 L 26 216 M 30 208 L 34 216 M 38 208 L 42 216 M 46 208 L 50 216"
        stroke="#0d0c14" strokeWidth="2" opacity="0.35" />
      {/* small neon "SHOP" sign */}
      <text x="35" y="214.5" fontFamily="Georgia, serif" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#fff6d8" opacity="0.95">SHOP</text>
    </g>
    </g>
    </g>
  );
}

// DINER — right behind where the survivor stands with a coffee cup, the
// city's version of the campfire hangout. Wrapped in a scale+reposition
// (pivoting on its own ground anchor, shifted slightly left) to grow it and
// keep it centered on the survivor's new standing position. Nudged back
// (up) an extra 22 units so its ground shadow clears the street band
// (y225-249) instead of sitting in the middle of the road.
export function Diner({ justBuilt }) {
  return (
    <g transform="translate(-66,-70.4) scale(1.2)">
    <g className={justBuilt === 'diner' ? 'building-pop' : undefined}>
    <g transform="translate(0, 20)">
      <ellipse cx="280" cy="222" rx="56" ry="8" fill="#000" opacity="0.35" />
      <rect x="235" y="175" width="90" height="45" fill="url(#cityConcrete)" />
      <rect x="235" y="175" width="90" height="45" fill="none" stroke="#100f18" strokeWidth="1" opacity="0.5" />
      {/* checkerboard trim along the base */}
      {Array.from({ length: 15 }, (_, i) => (
        <rect key={i} x={235 + i * 6} y="214" width="6" height="6" fill={i % 2 === 0 ? '#ffffff' : '#16151f'} opacity="0.85" />
      ))}
      {/* big front windows */}
      <rect x="245" y="183" width="34" height="20" fill="#151628" />
      <rect x="247" y="185" width="30" height="16" fill="#3de0ff" opacity="0.35" />
      <rect x="288" y="183" width="30" height="20" fill="#151628" />
      <rect x="290" y="185" width="26" height="16" fill="#ff3d9a" opacity="0.3" />
      {/* rooftop neon "DINER" sign */}
      <rect x="255" y="160" width="50" height="14" fill="#0d0c14" />
      <text x="280" y="170.5" fontFamily="Georgia, serif" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#ffd23d" className="neon-pulse">DINER</text>
    </g>
    </g>
    </g>
  );
}

// STREET — the city's first build: a paved lane with painted lines and a
// lamppost, laid across the foreground where the field once grew (occupies
// the same ground-level real estate)
export function Street({ justBuilt }) {
  return (
    <g className={justBuilt === 'street' ? 'building-pop' : undefined}>
    <g>
      <rect x="0" y="225" width="400" height="24" fill="#18161f" opacity="0.85" />
      <line x1="10" y1="237" x2="30" y2="237" stroke="#ffd97a" strokeWidth="2" opacity="0.8" />
      <line x1="50" y1="237" x2="70" y2="237" stroke="#ffd97a" strokeWidth="2" opacity="0.8" />
      <line x1="330" y1="237" x2="350" y2="237" stroke="#ffd97a" strokeWidth="2" opacity="0.8" />
      <line x1="370" y1="237" x2="390" y2="237" stroke="#ffd97a" strokeWidth="2" opacity="0.8" />
      {/* lamppost */}
      <line x1="24" y1="248" x2="24" y2="204" stroke="#1c1a28" strokeWidth="2.4" />
      <path d="M 24 204 Q 34 202 34 210" fill="none" stroke="#1c1a28" strokeWidth="2" />
      <circle cx="34" cy="211" r="4" fill="url(#neonCyanGlow)" filter="url(#softGlow)" />
      <circle cx="34" cy="211" r="2" fill="#3de0ff" opacity="0.9" />
    </g>
    </g>
  );
}

// THEATER — showy marquee, kept at its original horizontal spot to the
// right of the diner but brought further forward (bigger, lower) onto the
// near side of the street, close to the NIMEONITER sign's depth — its back
// half still overlapping the skyscraper for depth. Wrapped in a further
// scale+reposition (pivoting on its own current ground anchor) on top of
// its existing inner transform.
export function Theater({ justBuilt }) {
  return (
    <g transform="translate(-251.75,-221.05) scale(1.75)">
    <g className={justBuilt === 'theater' ? 'building-pop' : undefined}>
    <g transform="translate(-37,-11) scale(1.2)">
      <ellipse cx="315" cy="243" rx="30" ry="6" fill="#000" opacity="0.4" />
      <rect x="288" y="212" width="47" height="30" fill="url(#cityConcrete)" />
      {/* triangular marquee roof, edged in bulbs */}
      <path d="M 284 214 L 311 190 L 339 214 Z" fill="url(#cityGlassDark)" />
      <path d="M 284 214 L 311 190 L 339 214" fill="none" stroke="#ff3d9a" strokeWidth="1.5" opacity="0.9" />
      {Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        const x = 284 + (339 - 284) * t;
        const y = t < 0.5 ? 214 - (214 - 190) * (t / 0.5) : 190 + (214 - 190) * ((t - 0.5) / 0.5);
        return <circle key={i} cx={x} cy={y} r="1.6" fill="#ffd23d" className="christmas-light-glow" style={{ animationDelay: `${i * 0.15}s` }} />;
      })}
      {/* marquee sign board */}
      <rect x="293" y="217" width="37" height="12" fill="#0d0c14" />
      <text x="311.5" y="226" fontFamily="Georgia, serif" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#b24bf3" className="neon-pulse">THEATER</text>
      {/* entrance */}
      <rect x="304" y="230" width="15" height="12" fill="#151628" />
      <rect x="288" y="212" width="47" height="30" fill="none" stroke="#100f18" strokeWidth="1" opacity="0.5" />
    </g>
    </g>
    </g>
  );
}

// CASINO — the city's showiest building, kept at its original front-left
// spot but nudged a little further right (just enough that its vertical
// "CASINO" marquee, which sits left of the building's own ground anchor,
// clears the left edge of the viewBox with a comfortable margin instead of
// clipping off it) and brought further forward (bigger, lower) like the
// other two. It overlaps the apartment behind it, the same front-over-mid
// depth layering the medieval world already uses (e.g. house sitting in
// front of the wall).
export function Casino({ justBuilt }) {
  return (
    <g transform="translate(-615.1,-140.7) scale(1.85)">
    <g className={justBuilt === 'casino' ? 'building-pop' : undefined}>
    <g>
      <ellipse cx="366" cy="222" rx="26" ry="5" fill="#000" opacity="0.4" />
      <rect x="345" y="150" width="42" height="72" fill="url(#cityGlass)" />
      <rect x="345" y="150" width="42" height="72" fill="none" stroke="#0c0d16" strokeWidth="1" opacity="0.5" />
      {Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => {
          // skip the bottom-row middle window — it sits right where the
          // entrance opening cuts into the facade below
          if (row === 4 && col === 1) return null;
          return (
            <rect
              key={`${row}-${col}`}
              x={349 + col * 12}
              y={155 + row * 11}
              width="8"
              height="7"
              fill={(row + col) % 2 === 0 ? '#ff3d9a' : '#3de0ff'}
              opacity="0.6"
            />
          );
        })
      )}
      {/* crown of chasing bulbs along the roofline */}
      <rect x="343" y="146" width="46" height="5" fill="#0d0c14" />
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={346 + i * 4.5} cy="148.5" r="1.3" fill="#ffd23d" className="christmas-light-glow" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
      {/* vertical "CASINO" marquee down the left edge */}
      <rect x="333" y="150" width="10" height="56" fill="#0d0c14" />
      {'CASINO'.split('').map((ch, i) => (
        <text
          key={i}
          x="338"
          y={160 + i * 8.5}
          fontFamily="Georgia, serif"
          fontSize="7"
          fontWeight="bold"
          textAnchor="middle"
          fill="#ff3d9a"
          className="neon-pulse"
        >
          {ch}
        </text>
      ))}
      {/* entrance glow — narrowed so it no longer overlaps the bottom-row
          side windows (col 0 at x349-357, col 2 at x373-381) */}
      <rect x="361" y="200" width="10" height="22" fill="#151628" />
      <circle cx="366" cy="210" r="10" fill="url(#neonPurpleGlow)" filter="url(#softGlow)" />
    </g>
    </g>
    </g>
  );
}
