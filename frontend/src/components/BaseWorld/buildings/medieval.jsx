// World-1 (medieval) building SVGs, extracted from BaseWorld.jsx as a pure
// move — same coordinates, same gradients, same markup. Each component only
// needs `justBuilt` (the stage key just built, for the pop-in animation);
// the has('key')/world gating stays in BaseWorld at the call site, and the
// gradient/filter ids (wood, roof, stone, ...) resolve against BaseWorld's
// shared <defs> since these components render inside the same <svg>.

// Seam positions across the palisade wall, plus a small dome height per seam
// so the top edge reads as rounded log ends rather than a flat rectangle —
// all still drawn in one continuous fill so the wall stays solid and gray.
const WALL_SEAMS = Array.from({ length: 19 }, (_, i) => {
  const x = 10 + i * 20;
  const domeH = i % 3 === 0 ? 7 : i % 3 === 1 ? 4 : 5.5;
  return { x, domeH };
});

// WALL + big corner tower — final build
export function Wall({ justBuilt }) {
  return (
    <g className={justBuilt === 'wall' ? 'building-pop' : undefined}>
    <>
      <g>
        {/* solid wall body, one continuous fill so it reads as a single structure */}
        <rect x="10" y="182" width="380" height="40" fill="#2b2823" />
        <rect x="10" y="182" width="380" height="7" fill="#37332c" />
        {/* rounded log-top silhouette, same fill as the body — no gaps to the sky */}
        {WALL_SEAMS.slice(0, -1).map(({ x, domeH }) => (
          <path
            key={x}
            d={`M ${x} 182 Q ${x + 10} ${182 - domeH} ${x + 20} 182 Z`}
            fill="#2b2823"
          />
        ))}
        {/* seam lines mark the log divisions without breaking the surface */}
        {WALL_SEAMS.map(({ x }) => (
          <line key={x} x1={x} y1="176" x2={x} y2="222" stroke="#201c16" strokeWidth="1" opacity="0.35" />
        ))}
        {/* gate */}
        <rect x="182" y="176" width="36" height="46" fill="#1c160e" />
        <path d="M 182 176 Q 200 162 218 176 Z" fill="#241d13" />
        <line x1="200" y1="176" x2="200" y2="222" stroke="#0d0a06" strokeWidth="1.5" />
        <rect x="178" y="174" width="6" height="48" fill="#241f18" />
        <rect x="216" y="174" width="6" height="48" fill="#241f18" />
        {/* lashing beams */}
        <line x1="10" y1="200" x2="390" y2="200" stroke="#1f1c18" strokeWidth="2" opacity="0.7" />
        <line x1="10" y1="212" x2="390" y2="212" stroke="#1f1c18" strokeWidth="1.5" opacity="0.5" />
        {/* merlons, same gray family as the tower cap — overlap the wall top so they read as part of it */}
        <rect x="14" y="172" width="16" height="13" fill="#443e34" />
        <rect x="120" y="172" width="16" height="13" fill="#443e34" />
        <rect x="260" y="172" width="16" height="13" fill="#443e34" />
      </g>
      <g>
        <ellipse cx="350" cy="222" rx="28" ry="6" fill="#000" opacity="0.4" />
        {/* cross-brace at the base */}
        <line x1="334" y1="222" x2="368" y2="188" stroke="#241d13" strokeWidth="2.5" opacity="0.7" />
        <line x1="368" y1="222" x2="334" y2="188" stroke="#241d13" strokeWidth="2.5" opacity="0.7" />
        {/* tower shaft */}
        <rect x="334" y="118" width="34" height="104" fill="#38332b" />
        <line x1="342" y1="120" x2="342" y2="220" stroke="#241d13" strokeWidth="1" opacity="0.5" />
        <line x1="351" y1="120" x2="351" y2="220" stroke="#241d13" strokeWidth="1" opacity="0.5" />
        <line x1="360" y1="120" x2="360" y2="220" stroke="#241d13" strokeWidth="1" opacity="0.5" />
        <rect x="334" y="118" width="34" height="9" fill="#443e34" />
        <line x1="334" y1="150" x2="368" y2="150" stroke="#2b2621" strokeWidth="1" />
        <line x1="334" y1="180" x2="368" y2="180" stroke="#2b2621" strokeWidth="1" />
        {/* deck merlons */}
        <rect x="334" y="110" width="9" height="10" fill="#38332b" />
        <rect x="349" y="110" width="9" height="10" fill="#38332b" />
        <rect x="359" y="110" width="9" height="10" fill="#38332b" />
        {/* peaked lookout roof */}
        <path d="M 328 112 L 351 90 L 374 112 Z" fill="url(#roof)" />
        <path d="M 351 90 L 374 112 L 366 112 L 351 97 Z" fill="#1c150d" opacity="0.6" />
        <line x1="351" y1="90" x2="351" y2="112" stroke="#1c150d" strokeWidth="1" opacity="0.5" />
        {/* flagpole + flag */}
        <line x1="351" y1="90" x2="351" y2="70" stroke="#241d13" strokeWidth="1.5" />
        <path className="flag" d="M 351 71 L 366 76 L 351 81 Z" fill="#e8a23d" opacity="0.9" />
        {/* lantern */}
        <circle cx="351" cy="151" r="10" fill="url(#lanternGlow)" filter="url(#softGlow)" />
        <rect x="346" y="145" width="10" height="13" rx="2" fill="url(#paneGlow)" opacity="0.9" />
      </g>
    </>
    </g>
  );
}

// HOUSE (original)
export function House({ justBuilt }) {
  return (
    <g className={justBuilt === 'house' ? 'building-pop' : undefined}>
    <g>
      <ellipse cx="90" cy="222" rx="48" ry="8" fill="#000" opacity="0.4" />
      {/* stone foundation */}
      <rect x="56" y="216" width="70" height="7" fill="url(#stone)" />
      <line x1="66" y1="216" x2="66" y2="223" stroke="#241f19" strokeWidth="1" opacity="0.6" />
      <line x1="80" y1="216" x2="80" y2="223" stroke="#241f19" strokeWidth="1" opacity="0.6" />
      <line x1="100" y1="216" x2="100" y2="223" stroke="#241f19" strokeWidth="1" opacity="0.6" />
      <line x1="114" y1="216" x2="114" y2="223" stroke="#241f19" strokeWidth="1" opacity="0.6" />
      {/* walls */}
      <rect x="58" y="172" width="66" height="46" fill="url(#wood)" />
      <line x1="58" y1="184" x2="124" y2="184" stroke="#241c12" strokeWidth="1" opacity="0.7" />
      <line x1="58" y1="196" x2="124" y2="196" stroke="#241c12" strokeWidth="1" opacity="0.7" />
      <line x1="58" y1="208" x2="124" y2="208" stroke="#241c12" strokeWidth="1" opacity="0.7" />
      <line x1="76" y1="172" x2="76" y2="218" stroke="#1c160e" strokeWidth="0.8" opacity="0.35" />
      <line x1="106" y1="172" x2="106" y2="218" stroke="#1c160e" strokeWidth="0.8" opacity="0.35" />
      {/* warm side rim light (fire is to the right) */}
      <rect x="118" y="172" width="6" height="46" fill="#f0a83a" opacity="0.12" />
      {/* roof */}
      <path d="M 48 174 L 91 138 L 134 174 Z" fill="url(#roof)" />
      <path d="M 91 138 L 134 174 L 122 174 L 91 148 Z" fill="#1c150d" opacity="0.55" />
      <path d="M 48 174 L 91 138 L 91 143 L 53 174 Z" fill="#3a2f1c" opacity="0.5" />
      <line x1="52" y1="172" x2="130" y2="172" stroke="#1c150d" strokeWidth="1.5" opacity="0.6" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${58 + i * 9} ${168 - i * 3} L ${63 + i * 9} ${168 - i * 3}`}
          stroke="#3a2f1c" strokeWidth="1" opacity="0.4" />
      ))}
      {/* chimney + smoke */}
      <rect x="106" y="145" width="8" height="16" fill="#3a3020" />
      <rect x="105" y="143" width="10" height="3" fill="#4a3d28" />
      <path d="M 110 141 Q 106 134 111 129 Q 107 124 112 118" fill="none" stroke="#a89a82" strokeWidth="2" opacity="0.28" strokeLinecap="round" />
      {/* door with small awning, flush against the door frame below it */}
      <rect x="82" y="187" width="18" height="5" fill="#241d13" />
      <rect x="83" y="192" width="16" height="26" rx="1" fill="#0d0b07" />
      <line x1="91" y1="192" x2="91" y2="218" stroke="#241d13" strokeWidth="0.8" />
      <circle cx="96" cy="206" r="1.2" fill="#8a7350" />
      {/* windows with warm glow */}
      <circle cx="70" cy="188" r="8" fill="url(#lanternGlow)" filter="url(#softGlow)" opacity="0.7" />
      <rect x="64" y="182" width="12" height="12" rx="1" fill="url(#paneGlow)" opacity="0.9" />
      <line x1="70" y1="182" x2="70" y2="194" stroke="#4a3410" strokeWidth="1" />
      <line x1="64" y1="188" x2="76" y2="188" stroke="#4a3410" strokeWidth="1" />
      <circle cx="110" cy="188" r="8" fill="url(#lanternGlow)" filter="url(#softGlow)" opacity="0.7" />
      <rect x="104" y="182" width="12" height="12" rx="1" fill="url(#paneGlow)" opacity="0.9" />
      <line x1="110" y1="182" x2="110" y2="194" stroke="#4a3410" strokeWidth="1" />
      <line x1="104" y1="188" x2="116" y2="188" stroke="#4a3410" strokeWidth="1" />
    </g>
    </g>
  );
}

// HUT (original, enlarged so the doorway reads against the survivor)
export function Hut({ justBuilt }) {
  return (
    <g className={justBuilt === 'hut' ? 'building-pop' : undefined}>
    <g transform="translate(-14,-10.4) scale(1.2)">
      <ellipse cx="70" cy="222" rx="34" ry="7" fill="#000" opacity="0.4" />
      <path d="M 45 191 Q 44 220 47 222 L 93 222 Q 96 220 95 191 Z" fill="url(#wood)" />
      <line x1="46" y1="206" x2="94" y2="206" stroke="#241c12" strokeWidth="1" opacity="0.6" />
      <line x1="58" y1="192" x2="56" y2="222" stroke="#1c160e" strokeWidth="0.7" opacity="0.35" />
      <line x1="82" y1="192" x2="84" y2="222" stroke="#1c160e" strokeWidth="0.7" opacity="0.35" />
      {/* thatch roof */}
      <path d="M 38 193 L 70 168 L 102 193 Z" fill="url(#thatch)" />
      <path d="M 70 168 L 102 193 L 92 193 L 70 176 Z" fill="#3a3018" opacity="0.55" />
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={i}
          x1={41 + i * 4.4}
          y1={190 - Math.abs(i - 3) * 6}
          x2={45 + i * 4.4}
          y2={195 - Math.abs(i - 3) * 6}
          stroke="#4a3d1e"
          strokeWidth="1"
          opacity="0.4"
        />
      ))}
      <line x1="70" y1="168" x2="70" y2="176" stroke="#2a2210" strokeWidth="1.5" opacity="0.5" />
      {/* doorway with hide flap */}
      <rect x="63" y="203" width="14" height="19" fill="#0d0b07" />
      <path d="M 63 203 Q 70 210 63 219 Z" fill="#241d13" opacity="0.7" />
    </g>
    </g>
  );
}

// WELL (brought forward and clear of the hut, shadow aligned to its base)
export function Well({ justBuilt }) {
  return (
    <g className={justBuilt === 'well' ? 'building-pop' : undefined}>
    <g transform="translate(-27,-79) scale(1.5)">
      <ellipse cx="35" cy="241" rx="18" ry="4.5" fill="#000" opacity="0.4" />
      <ellipse cx="35" cy="241" rx="13" ry="5" fill="url(#stone)" />
      <ellipse cx="35" cy="240" rx="10" ry="3.5" fill="#0d0b07" />
      <ellipse cx="33" cy="238.5" rx="4" ry="1.4" fill="#3a5a68" opacity="0.55" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={35 + Math.cos(a) * 9}
            y1={241 + Math.sin(a) * 3.5}
            x2={35 + Math.cos(a) * 13}
            y2={241 + Math.sin(a) * 5}
            stroke="#241f19"
            strokeWidth="0.8"
            opacity="0.5"
          />
        );
      })}
      <rect x="24" y="224" width="3.5" height="17" fill="url(#woodDark)" />
      <rect x="43" y="224" width="3.5" height="17" fill="url(#woodDark)" />
      <line x1="27" y1="230" x2="43" y2="230" stroke="#241d13" strokeWidth="1.2" />
      <line x1="35" y1="230" x2="35" y2="238" stroke="#8a7350" strokeWidth="0.6" />
      <rect x="32.5" y="235" width="5" height="4" fill="#3a3020" />
      <path d="M 21 226 L 35 216 L 49 226 Z" fill="url(#thatch)" />
      <path d="M 35 216 L 49 226 L 44 226 L 35 220 Z" fill="#2a230f" opacity="0.5" />
      <line x1="35" y1="216" x2="35" y2="220" stroke="#241d13" strokeWidth="1" opacity="0.5" />
    </g>
    </g>
  );
}

// FIELD (foreground, enlarged, shifted left so it stays clear of the survivor)
export function Field({ justBuilt }) {
  return (
    <g className={justBuilt === 'field' ? 'building-pop' : undefined}>
    <g transform="translate(-85,-80) scale(1.35)">
      <ellipse cx="200" cy="260" rx="50" ry="13" fill="#000" opacity="0.45" />
      <rect x="160" y="250" width="80" height="12" fill="#2e2416" />
      <line x1="160" y1="253" x2="240" y2="253" stroke="#241c12" strokeWidth="0.6" opacity="0.5" />
      <line x1="160" y1="259" x2="240" y2="259" stroke="#1a140c" strokeWidth="0.6" opacity="0.5" />
      <g>
        {[172, 186, 200, 214, 228].map((cx, i) => (
          <g key={cx}>
            <ellipse cx={cx} cy="251" rx="3.5" ry="6.5" fill={i % 2 === 0 ? '#5a6b30' : '#4c5c28'} />
            <ellipse cx={cx - 1} cy="248.5" rx="1.4" ry="3" fill="#7a8c44" opacity="0.7" />
          </g>
        ))}
      </g>
      <line x1="160" y1="256" x2="240" y2="256" stroke="#241c12" strokeWidth="1" />
      {/* fence corner post for scale */}
      <line x1="157" y1="240" x2="157" y2="262" stroke="url(#woodDark)" strokeWidth="3" />
    </g>
    </g>
  );
}

// STORAGE (drawn after the campfire so its glow stays behind the building)
export function Storage({ justBuilt }) {
  return (
    <g className={justBuilt === 'storage' ? 'building-pop' : undefined}>
    <g transform="translate(-37,-11) scale(1.2)">
      <ellipse cx="315" cy="243" rx="30" ry="6" fill="#000" opacity="0.4" />
      {/* barrels beside the shed */}
      <g>
        <rect x="277" y="224" width="12" height="16" rx="3" fill="url(#wood)" />
        <line x1="277" y1="229" x2="289" y2="229" stroke="#1c150d" strokeWidth="1" opacity="0.6" />
        <line x1="277" y1="235" x2="289" y2="235" stroke="#1c150d" strokeWidth="1" opacity="0.6" />
        <ellipse cx="283" cy="224" rx="6" ry="1.6" fill="#241d13" opacity="0.5" />
      </g>
      <rect x="295" y="212" width="40" height="30" fill="url(#wood)" />
      <line x1="295" y1="222" x2="335" y2="222" stroke="#241c12" strokeWidth="1" opacity="0.6" />
      <line x1="295" y1="232" x2="335" y2="232" stroke="#241c12" strokeWidth="1" opacity="0.6" />
      <line x1="312" y1="212" x2="312" y2="242" stroke="#1c160e" strokeWidth="0.6" opacity="0.3" />
      <path d="M 288 214 L 315 192 L 342 214 Z" fill="url(#roof)" />
      <path d="M 315 192 L 342 214 L 334 214 L 315 200 Z" fill="#1c150d" opacity="0.55" />
      <line x1="291" y1="212" x2="339" y2="212" stroke="#1c150d" strokeWidth="1.3" opacity="0.5" />
      <rect x="299" y="217" width="9" height="9" rx="1" fill="url(#paneGlow)" opacity="0.85" />
      <rect x="308" y="220" width="15" height="22" fill="#0d0b07" />
      <line x1="315.5" y1="220" x2="315.5" y2="242" stroke="#241c12" strokeWidth="0.8" />
    </g>
    </g>
  );
}

// FENCE (right against the front edge of the field, matching its width)
export function Fence({ justBuilt }) {
  return (
    <g className={justBuilt === 'fence' ? 'building-pop' : undefined}>
    <g transform="translate(-508,-157) scale(2.16,1.7)" stroke="#8a6f45" strokeWidth="3" opacity="0.95">
      <line x1="300" y1="262" x2="300" y2="246" strokeLinecap="round" />
      <line x1="314" y1="262" x2="314" y2="249" strokeLinecap="round" />
      <line x1="328" y1="262" x2="328" y2="246" strokeLinecap="round" />
      <line x1="342" y1="262" x2="342" y2="249" strokeLinecap="round" />
      <circle cx="300" cy="246" r="1.6" fill="#8a6f45" stroke="none" />
      <circle cx="328" cy="246" r="1.6" fill="#8a6f45" stroke="none" />
      <line x1="296" y1="254" x2="346" y2="254" />
      <line x1="298" y1="260" x2="344" y2="260" strokeWidth="2" opacity="0.7" />
    </g>
    </g>
  );
}

// WATCHTOWER (foreground, stays at the right edge)
export function Watchtower({ justBuilt }) {
  return (
    <g className={justBuilt === 'watchtower' ? 'building-pop' : undefined}>
    <g transform="translate(337,-7) scale(1.4)">
      <ellipse cx="32" cy="205" rx="15" ry="4" fill="#000" opacity="0.4" />
      <rect x="26" y="165" width="4" height="40" fill="#2e2418" transform="rotate(4 28 185)" />
      <rect x="35" y="165" width="4" height="40" fill="#2e2418" transform="rotate(-4 37 185)" />
      {/* X cross-bracing */}
      <line x1="24" y1="203" x2="41" y2="178" stroke="#241d13" strokeWidth="1.4" opacity="0.7" />
      <line x1="41" y1="203" x2="24" y2="178" stroke="#241d13" strokeWidth="1.4" opacity="0.7" />
      <line x1="25" y1="185" x2="40" y2="169" stroke="#241d13" strokeWidth="1.2" opacity="0.6" />
      <line x1="40" y1="185" x2="25" y2="169" stroke="#241d13" strokeWidth="1.2" opacity="0.6" />
      {/* deck */}
      <rect x="23" y="157" width="19" height="10" fill="url(#wood)" />
      <line x1="23" y1="157" x2="42" y2="157" stroke="#443e34" strokeWidth="1" opacity="0.6" />
      {/* rail posts */}
      <line x1="23" y1="150" x2="23" y2="157" stroke="#241d13" strokeWidth="1.2" />
      <line x1="42" y1="150" x2="42" y2="157" stroke="#241d13" strokeWidth="1.2" />
      <line x1="23" y1="151" x2="42" y2="151" stroke="#241d13" strokeWidth="1" opacity="0.7" />
      {/* roof + flag */}
      <path d="M 20 157 L 32 145 L 44 157 Z" fill="url(#roof)" />
      <path d="M 32 145 L 44 157 L 40 157 L 32 149 Z" fill="#1c150d" opacity="0.5" />
      <line x1="32" y1="145" x2="32" y2="136" stroke="#241d13" strokeWidth="1" />
      <path className="flag" d="M 32 137 L 42 141 L 32 145 Z" fill="#e8a23d" opacity="0.85" />
      {/* lantern */}
      <circle cx="32" cy="162" r="7" fill="url(#lanternGlow)" filter="url(#softGlow)" />
      <rect x="28" y="159" width="8" height="6" fill="url(#paneGlow)" opacity="0.85" />
    </g>
    </g>
  );
}
