import './Assistant.css';

// The face and bust. Detail and grime come from gradients, uneven shapes and
// stray stubble strokes rather than clean symmetrical paths. `speaking`
// drives the mouth animation.
function SurvivorFace({ speaking, holiday = null, world = 'medieval' }) {
  // Short stubble strokes high on the cheeks, above the beard line.
  const stubble = [
    [76, 142, 78, 148], [72, 134, 74, 140], [80, 138, 82, 143],
    [124, 142, 122, 148], [128, 134, 126, 140], [120, 138, 118, 143],
  ];

  const isChristmas = holiday === 'christmas';
  const isValentines = holiday === 'valentines';
  const isEaster = holiday === 'easter';
  // True whenever world 2 (city) is active, regardless of holiday. The city
  // black coat is world 2's own "default look", so holidays that don't
  // supply their own hood/jacket color (halloween, new year) should still
  // get the city black rather than falling back to the medieval green —
  // holiday costumes build ON TOP of the city look, they don't replace it.
  // Holidays that DO supply their own color (christmas/valentines/easter)
  // still take priority in the ternaries below, in both worlds — this only
  // changes what the *fallback* is when a holiday doesn't paint the outfit.
  const isCityWorld = world === 'city';
  // Sunglasses are world 2's other "default" costume piece. They're drawn
  // for every city holiday except the two that already cover the eyes
  // themselves: halloween's skull mask has its own eye sockets, and
  // valentines has its own heart-shaped lenses.
  const showCitySunglasses = isCityWorld && holiday !== 'halloween' && !isValentines;
  // Hood/jacket fill swaps to a holiday-specific gradient only while that
  // holiday is active; any other value (including null) falls back to the
  // city black in world 2, or the normal green in the medieval world.
  const hoodFill = isChristmas
    ? 'url(#hoodXmas)'
    : isValentines
    ? 'url(#hoodValentines)'
    : isEaster
    ? 'url(#hoodEaster)'
    : isCityWorld
    ? 'url(#hoodCity)'
    : 'url(#hood)';
  const jacketFill = isChristmas
    ? 'url(#jacketXmas)'
    : isValentines
    ? 'url(#jacketValentines)'
    : isEaster
    ? 'url(#jacketEaster)'
    : isCityWorld
    ? 'url(#jacketCity)'
    : 'url(#jacket)';

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
        {/* Christmas-red hood fabric, swapped in only for the christmas holiday */}
        <linearGradient id="hoodXmas" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#c2453b" />
          <stop offset="50%" stopColor="#a8322c" />
          <stop offset="100%" stopColor="#6b1f1a" />
        </linearGradient>
        {/* Christmas-red jacket, a touch darker than the hood */}
        <linearGradient id="jacketXmas" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#a8322c" />
          <stop offset="55%" stopColor="#8a2420" />
          <stop offset="100%" stopColor="#551713" />
        </linearGradient>
        {/* Golden party hat for New Year, only used for that holiday */}
        <linearGradient id="newyearHat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7d97a" />
          <stop offset="55%" stopColor="#f0c14a" />
          <stop offset="100%" stopColor="#c89a2e" />
        </linearGradient>
        {/* Valentine's-pink hood fabric, swapped in only for that holiday */}
        <linearGradient id="hoodValentines" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#ec7a95" />
          <stop offset="50%" stopColor="#d9425e" />
          <stop offset="100%" stopColor="#8a2f45" />
        </linearGradient>
        {/* Valentine's-pink jacket, a touch darker than the hood */}
        <linearGradient id="jacketValentines" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#d9425e" />
          <stop offset="55%" stopColor="#b83552" />
          <stop offset="100%" stopColor="#6e2439" />
        </linearGradient>
        {/* Easter chick-yellow hood fabric, swapped in only for that holiday */}
        <linearGradient id="hoodEaster" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#f7dd6e" />
          <stop offset="50%" stopColor="#f0d24a" />
          <stop offset="100%" stopColor="#c99328" />
        </linearGradient>
        {/* Easter chick-yellow jacket, a touch darker than the hood */}
        <linearGradient id="jacketEaster" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#e8b23a" />
          <stop offset="55%" stopColor="#c99328" />
          <stop offset="100%" stopColor="#8a661a" />
        </linearGradient>
        {/* City-world black coat fabric (hood stands in for the raised collar) */}
        <linearGradient id="hoodCity" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#3a3a42" />
          <stop offset="50%" stopColor="#242428" />
          <stop offset="100%" stopColor="#101012" />
        </linearGradient>
        {/* City-world black coat, a touch darker than the collar */}
        <linearGradient id="jacketCity" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#2c2c32" />
          <stop offset="55%" stopColor="#1c1c20" />
          <stop offset="100%" stopColor="#0c0c0e" />
        </linearGradient>
      </defs>

      <g className="face__breathe">
        {/* ---------- Shoulders / jacket (bust, cropped at bottom) ---------- */}
        <path
          d="M14 260 Q18 208 44 189 Q64 174 84 168 L116 168 Q136 174 156 189
             Q182 208 186 260 Z"
          fill={jacketFill}
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
          fill={hoodFill}
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
          fill={hoodFill}
          stroke="#121809"
          strokeWidth="2.5"
        />

        {/* ---------- Holiday costume: worn over the finished face, never
             altering it when no holiday is active ---------- */}
        {isChristmas && (
          <g className="face__costume face__costume--christmas">
            {/* Fluffy white fur trim along the hood's front rim, following the
                same inner curve as the rim above it */}
            <path
              d="M55 114 Q62 88 100 78 Q138 88 145 114"
              stroke="#f0ede6"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
            {/* Rounded tufts along the trim for a pom-pom fur texture */}
            <g fill="#f0ede6">
              <circle cx="57" cy="109" r="6" />
              <circle cx="69" cy="93" r="6.3" />
              <circle cx="84" cy="82" r="6.3" />
              <circle cx="100" cy="78" r="6.6" />
              <circle cx="116" cy="82" r="6.3" />
              <circle cx="131" cy="93" r="6.3" />
              <circle cx="143" cy="109" r="6" />
            </g>
          </g>
        )}
        {holiday === 'halloween' && (
          <g className="face__costume">
            {/* Bone-white skull mask, same silhouette as the skin beneath it */}
            <path
              d="M66 112 Q64 80 100 74 Q136 80 134 112 Q134 138 121 160
                 Q111 176 100 178 Q89 176 79 160 Q66 138 66 112 Z"
              fill="#e8e4d8"
              stroke="#b0a996"
              strokeWidth="1.5"
            />
            {/* cheekbone shading for a little dimension */}
            <path d="M71 128 Q77 143 87 151" stroke="#c4bda8" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
            <path d="M129 128 Q123 143 113 151" stroke="#c4bda8" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
            {/* dark eye sockets over the eyes */}
            <ellipse cx="84" cy="123" rx="11" ry="13" fill="#1a1712" />
            <ellipse cx="116" cy="123" rx="11" ry="13" fill="#1a1712" />
            {/* triangular nasal cavity */}
            <path d="M100 116 L92 141 L108 141 Z" fill="#1a1712" />
            {/* jaw cavity, tapering to the chin */}
            <path d="M81 150 Q100 176 119 150 Z" fill="#1a1712" />
            {/* upper teeth row sitting across the top of the jaw cavity */}
            <path
              d="M83 150 Q100 158 117 150 L115 161 Q100 167 85 161 Z"
              fill="#f4f0e4"
              stroke="#b0a996"
              strokeWidth="0.8"
            />
            {/* gaps between the teeth */}
            <g stroke="#1a1712" strokeWidth="1">
              <line x1="90" y1="152" x2="89" y2="164" />
              <line x1="96" y1="155" x2="95" y2="165" />
              <line x1="100" y1="156" x2="100" y2="166" />
              <line x1="104" y1="155" x2="105" y2="165" />
              <line x1="110" y1="152" x2="111" y2="164" />
            </g>
          </g>
        )}
        {holiday === 'newyear' && (
          <g className="face__costume face__costume--newyear">
            {/* Golden party hat, resting on top of the hood */}
            <path
              d="M78 78 Q100 66 122 78 L108 34 Q100 28 92 34 Z"
              fill="url(#newyearHat)"
              stroke="#a8842a"
              strokeWidth="1.5"
            />
            {/* diagonal stripes for a little texture */}
            <path d="M85 71 L97 39" stroke="#c89a2e" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
            <path d="M100 75 L104 36" stroke="#fff4d0" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
            <path d="M115 71 L106 41" stroke="#c89a2e" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
            {/* a small star at the tip in place of a pom-pom */}
            <path
              d="M100 22 L102.5 26.5 L107 29 L102.5 31.5 L100 36 L97.5 31.5 L93 29 L97.5 26.5 Z"
              fill="#fff4d0"
              stroke="#c89a2e"
              strokeWidth="0.8"
            />
            {/* a few faint sparkles twinkling around the hat */}
            <g className="face__sparkle">
              <circle cx="66" cy="56" r="2" fill="#fff4d0" />
              <circle cx="134" cy="58" r="2" fill="#fff4d0" />
              <circle cx="100" cy="18" r="1.6" fill="#fff4d0" />
            </g>
          </g>
        )}
        {isValentines && (
          <g className="face__costume face__costume--valentines">
            {/* Heart-shaped sunglasses sitting over the eyes */}
            <path
              d="M75 124 L66 120 M125 124 L134 120"
              stroke="#a8335a"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* bridge across the nose, linking the two lenses */}
            <path d="M93 121 Q100 118 107 121" stroke="#a8335a" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* left heart lens */}
            <path
              d="M84 133 C75 124 75 114 84 119.4 C93 114 93 124 84 133 Z"
              fill="#f08aa0"
              fillOpacity="0.9"
              stroke="#a8335a"
              strokeWidth="2"
            />
            {/* right heart lens */}
            <path
              d="M116 133 C107 124 107 114 116 119.4 C125 114 125 124 116 133 Z"
              fill="#f08aa0"
              fillOpacity="0.9"
              stroke="#a8335a"
              strokeWidth="2"
            />
            {/* small glossy highlight on each lens */}
            <circle cx="80" cy="121" r="1.6" fill="#fce4e9" opacity="0.85" />
            <circle cx="112" cy="121" r="1.6" fill="#fce4e9" opacity="0.85" />
          </g>
        )}
        {isEaster && (
          <g className="face__costume face__costume--easter">
            {/* Bunny ears rising from the top of the hood */}
            <path
              d="M75 78 Q70 45 78 18 Q82 8 86 18 Q94 45 89 78 Q82 84 75 78 Z"
              fill="#efe7d8"
              stroke="#b0a68e"
              strokeWidth="1.5"
            />
            <path
              d="M125 78 Q130 45 122 18 Q118 8 114 18 Q106 45 111 78 Q118 84 125 78 Z"
              fill="#efe7d8"
              stroke="#b0a68e"
              strokeWidth="1.5"
            />
            {/* pink inner ear on each */}
            <path d="M78 74 Q74 48 80 26 Q82 20 84 26 Q90 48 86 74 Q82 78 78 74 Z" fill="#f6b8ce" />
            <path d="M122 74 Q126 48 120 26 Q118 20 116 26 Q110 48 114 74 Q118 78 122 74 Z" fill="#f6b8ce" />
          </g>
        )}
        {showCitySunglasses && (
          <g className="face__costume face__costume--city">
            {/* Black aviator sunglasses sitting over the eyes */}
            <path d="M75 122 L67 119 M125 122 L133 119" stroke="#0c0c0e" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M93 120 Q100 117 107 120" stroke="#0c0c0e" strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="84" cy="124" rx="10.5" ry="8.5" fill="#14141a" stroke="#0c0c0e" strokeWidth="1.6" />
            <ellipse cx="116" cy="124" rx="10.5" ry="8.5" fill="#14141a" stroke="#0c0c0e" strokeWidth="1.6" />
            <path d="M78 120 Q82 118 87 120" stroke="#6a7080" strokeWidth="1.2" opacity="0.6" fill="none" />
            <path d="M110 120 Q114 118 119 120" stroke="#6a7080" strokeWidth="1.2" opacity="0.6" fill="none" />
          </g>
        )}
      </g>
    </svg>
  );
}

export default SurvivorFace;