import './Assistant.css';

// The face and bust. Detail and grime come from gradients, uneven shapes and
// stray stubble strokes rather than clean symmetrical paths. `speaking`
// drives the mouth animation.
function SurvivorFace({ speaking }) {
  // Short stubble strokes high on the cheeks, above the beard line.
  const stubble = [
    [76, 142, 78, 148], [72, 134, 74, 140], [80, 138, 82, 143],
    [124, 142, 122, 148], [128, 134, 126, 140], [120, 138, 118, 143],
  ];

  return (
    <svg
      className={`face ${speaking ? 'face--speaking' : ''}`}
      viewBox="0 0 200 260"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Weathered, slightly pale skin — warm grey-brown, lit upper-left */}
        <radialGradient id="skin" cx="42%" cy="33%" r="78%">
          <stop offset="0%" stopColor="#cbb8a2" />
          <stop offset="42%" stopColor="#ad9883" />
          <stop offset="74%" stopColor="#877260" />
          <stop offset="100%" stopColor="#5c4c3f" />
        </radialGradient>
        {/* Green hood fabric */}
        <linearGradient id="hood" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#4c5c35" />
          <stop offset="50%" stopColor="#3a4826" />
          <stop offset="100%" stopColor="#232d16" />
        </linearGradient>
        {/* Green jacket, a touch darker than the hood */}
        <linearGradient id="jacket" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#41502f" />
          <stop offset="55%" stopColor="#2e3a1f" />
          <stop offset="100%" stopColor="#1b2311" />
        </linearGradient>
        {/* Deep shadow inside the hood, framing the face */}
        <linearGradient id="hoodInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2312" />
          <stop offset="100%" stopColor="#0c1007" />
        </linearGradient>
        {/* Soft brown shadow for eye sockets and cheek hollows */}
        <radialGradient id="hollow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4a3b2f" />
          <stop offset="100%" stopColor="#4a3b2f00" />
        </radialGradient>
        {/* Beard shading — grey with darker roots */}
        <linearGradient id="beard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a9e8a" />
          <stop offset="55%" stopColor="#868a76" />
          <stop offset="100%" stopColor="#b4b6a8" />
        </linearGradient>
      </defs>

      <g className="face__breathe">
        {/* ---------- Shoulders / jacket (bust, cropped at bottom) ---------- */}
        <path
          d="M14 260 Q18 208 44 189 Q64 174 84 168 L116 168 Q136 174 156 189
             Q182 208 186 260 Z"
          fill="url(#jacket)"
          stroke="#121809"
          strokeWidth="2.5"
        />
        {/* collar opening */}
        <path d="M82 170 Q100 188 118 170" stroke="#151c0c" strokeWidth="3.5" fill="none" opacity="0.85" />
        {/* jacket seams / folds */}
        <path d="M48 192 Q45 226 50 258" stroke="#18200f" strokeWidth="2.5" fill="none" opacity="0.55" />
        <path d="M152 192 Q155 226 150 258" stroke="#18200f" strokeWidth="2.5" fill="none" opacity="0.55" />
        <path d="M70 200 Q72 230 68 258" stroke="#18200f" strokeWidth="1.6" fill="none" opacity="0.4" />
        <path d="M130 200 Q128 230 132 258" stroke="#18200f" strokeWidth="1.6" fill="none" opacity="0.4" />
        {/* shoulder highlight */}
        <path d="M50 190 Q66 178 84 172" stroke="#55663c" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M150 190 Q134 178 116 172" stroke="#55663c" strokeWidth="2" fill="none" opacity="0.5" />

        {/* ---------- Hood draped over head, resting on the shoulders ---------- */}
        <path
          d="M56 190 Q36 150 46 112 Q54 70 100 62 Q146 70 154 112
             Q164 150 144 190 Q122 158 100 158 Q78 158 56 190 Z"
          fill="url(#hood)"
          stroke="#121809"
          strokeWidth="2.5"
        />
        {/* hood fabric folds */}
        <path d="M60 186 Q48 148 62 108" stroke="#1c2413" strokeWidth="3" fill="none" opacity="0.7" />
        <path d="M140 186 Q152 148 138 108" stroke="#1c2413" strokeWidth="3" fill="none" opacity="0.7" />
        {/* hood crown highlight (kept high on the fabric, clear of the face) */}
        <path d="M74 76 Q100 62 126 76" stroke="#5a6b3e" strokeWidth="2.5" fill="none" opacity="0.45" />

        {/* Inner hood shadow, cupping the face */}
        <path
          d="M58 116 Q56 78 100 70 Q144 78 142 116 Q140 150 100 152 Q60 150 58 116 Z"
          fill="url(#hoodInner)"
        />

        {/* ---------- Head / face ---------- */}
        <path
          d="M66 112 Q64 80 100 74 Q136 80 134 112 Q134 138 121 160
             Q111 176 100 178 Q89 176 79 160 Q66 138 66 112 Z"
          fill="url(#skin)"
        />

        {/* cheek + temple hollows */}
        <ellipse cx="78" cy="130" rx="11" ry="15" fill="url(#hollow)" opacity="0.85" />
        <ellipse cx="122" cy="130" rx="11" ry="15" fill="url(#hollow)" opacity="0.85" />

        {/* forehead creases */}
        <path d="M82 94 Q100 88 118 94" stroke="#6b5747" strokeWidth="1.6" fill="none" opacity="0.55" />
        <path d="M85 101 Q100 96 115 101" stroke="#6b5747" strokeWidth="1.4" fill="none" opacity="0.45" />

        {/* brows — heavy, furrowed */}
        <path d="M74 111 Q86 105 96 110" stroke="#3a2f24" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M104 110 Q114 105 126 111" stroke="#3a2f24" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        {/* frown crease between brows */}
        <path d="M98 109 L97 119 M102 109 L103 119" stroke="#5c4a3a" strokeWidth="1.4" opacity="0.6" />

        {/* eye sockets */}
        <ellipse cx="84" cy="123" rx="13" ry="9" fill="#3a2c22" />
        <ellipse cx="116" cy="123" rx="13" ry="9" fill="#3a2c22" />
        {/* heavy eye bags */}
        <path d="M74 129 Q84 134 94 129" stroke="#6b5747" strokeWidth="1.8" fill="none" opacity="0.7" />
        <path d="M106 129 Q116 134 126 129" stroke="#6b5747" strokeWidth="1.8" fill="none" opacity="0.7" />

        {/* eyes — tired, pale, small pupils */}
        <g className="face__eyes">
          <ellipse cx="84" cy="123" rx="6" ry="4" fill="#d8d2c2" />
          <ellipse cx="116" cy="123" rx="6" ry="4" fill="#d8d2c2" />
          <circle cx="85" cy="123" r="2.7" fill="#211a13" />
          <circle cx="115" cy="123" r="2.7" fill="#211a13" />
          {/* catchlights */}
          <circle cx="83.4" cy="121.4" r="0.9" fill="#f2eee2" />
          <circle cx="113.4" cy="121.4" r="0.9" fill="#f2eee2" />
        </g>

        {/* nose — long, shadowed */}
        <path d="M100 123 Q97 139 92 147 Q100 152 108 147 Q103 139 100 123 Z"
              fill="#8a7361" opacity="0.75" />
        <path d="M92 147 Q100 150 108 147" stroke="#4a3b2f" strokeWidth="1.4" fill="none" opacity="0.7" />
        {/* nostril hint */}
        <path d="M95 145 Q97 148 96 149 M105 145 Q103 148 104 149" stroke="#3a2c22" strokeWidth="1" fill="none" opacity="0.6" />

        {/* stray stubble high on the cheeks, above the beard line */}
        <g stroke="#8a806c" strokeWidth="1" opacity="0.5" strokeLinecap="round">
          {stubble.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>

        {/* mouth — a plain line under the beard (hidden), kept for realism */}
        <path
          d="M92 158 Q100 161 108 158"
          stroke="#2c2018"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* ---------- Beard — this is the group that animates: it nudges from
             its root while speaking, so the jaw appears to move ---------- */}
        <g className="face__mouth">
          {/* sideburns down the jaw to a short rounded chin beard */}
          <path
            d="M76 140 Q74 162 84 178 Q92 190 100 192 Q108 190 116 178
               Q126 162 124 140 Q118 154 110 156 Q104 152 100 152
               Q96 152 90 156 Q82 154 76 140 Z"
            fill="url(#beard)"
            stroke="#5f6350"
            strokeWidth="1.2"
          />
          {/* darker under-shadow for depth */}
          <path
            d="M86 158 Q84 178 100 188 Q116 178 114 158 Q107 164 100 164 Q93 164 86 158 Z"
            fill="#6f7360"
            opacity="0.45"
          />
          {/* moustache draping over the mouth */}
          <path
            d="M86 150 Q93 157 100 157 Q107 157 114 150 Q109 161 100 161 Q91 161 86 150 Z"
            fill="url(#beard)"
          />
          {/* a few hair strands for texture */}
          <path d="M92 164 Q93 178 96 188" stroke="#b4b6a8" strokeWidth="0.9" fill="none" opacity="0.5" />
          <path d="M100 164 Q100 178 100 190" stroke="#b4b6a8" strokeWidth="0.9" fill="none" opacity="0.5" />
          <path d="M108 164 Q107 178 104 188" stroke="#b4b6a8" strokeWidth="0.9" fill="none" opacity="0.5" />
        </g>

        {/* ---------- Hood front rim casting over the brow ---------- */}
        <path
          d="M52 116 Q56 72 100 64 Q144 72 148 116 Q148 102 136 90
             Q118 76 100 76 Q82 76 64 90 Q52 102 52 116 Z"
          fill="url(#hood)"
          stroke="#121809"
          strokeWidth="2.5"
        />
      </g>
    </svg>
  );
}

export default SurvivorFace;