import './Survivor.css';

// The in-world companion figure. `world` picks which pose/outfit renders:
// 'medieval' (default) is the original hooded survivor, seated by the fire,
// unchanged. 'city' is a standing figure in front of the diner, wearing the
// same city outfit SurvivorFace already knows (black coat, blue jeans,
// black shoes, sunglasses — no purple), holding a small coffee cup. 'space'
// reuses the city pose's exact stance/leg/torso geometry (same ground spot,
// only the art changes) in a spacesuit, with the near arm raised in a wave
// instead of holding a cup, and a full-face visor helmet instead of
// sunglasses. All three share the same outer scale/anchor so the figure's
// on-screen size and ground position stay identical between worlds.
// `holiday` layers a seasonal costume on top of the current world's pose;
// currently only 'medieval' + 'christmas', 'medieval' + 'newyear',
// 'medieval' + 'valentines', 'medieval' + 'easter', 'city' + 'halloween',
// 'city' + 'christmas', and 'city' + 'newyear' are implemented, every other
// combination renders exactly as before.
function Survivor({ world = 'medieval', holiday = null }) {
  if (world === 'space') {
    return (
      <g className="survivor">
        <g transform="translate(243,221) scale(0.7) translate(-243,-221)">
          {/* Ground shadow */}
          <ellipse cx="246" cy="221" rx="14" ry="3.4" fill="#000" opacity="0.5" />

          <g className="survivor-body--space">
            {/* Boots — white, not the other worlds' dark shoes */}
            <ellipse cx="239" cy="221" rx="4.2" ry="2.1" fill="#eef0f3" stroke="#aab0ba" strokeWidth="0.6" />
            <ellipse cx="253" cy="221" rx="4.2" ry="2.1" fill="#eef0f3" stroke="#aab0ba" strokeWidth="0.6" />

            {/* Legs (pale suit fabric), same stance as the city pose */}
            <path d="M 236 200 L 235 220 L 242 220 L 243 200 Z" fill="#d4d8de" stroke="#5a6068" strokeWidth="0.7" />
            <path d="M 244 200 L 247 220 L 254 220 L 250 200 Z" fill="#c6cad2" stroke="#5a6068" strokeWidth="0.7" />
            {/* Orange ID stripes, a classic suit accent */}
            <line x1="239" y1="203" x2="238" y2="218" stroke="#e8a23d" strokeWidth="1" opacity="0.8" />
            <line x1="248" y1="203" x2="250" y2="218" stroke="#e8a23d" strokeWidth="1" opacity="0.7" />

            {/* Far arm hanging at the side, with a clearly defined glove
                (lighter than the sleeve, with its own outline) so it reads
                as a hand rather than fading into the torso */}
            <path d="M 234 188 L 230 199 L 233 202 L 237 190 Z" fill="#c6cad2" stroke="#5a6068" strokeWidth="0.6" />
            <circle cx="231" cy="202" r="2.5" fill="#eef0f3" stroke="#5a6068" strokeWidth="0.6" />

            {/* Torso (suit) */}
            <path d="M 233 187 Q 232 178 245 176 Q 258 178 257 187 L 259 202 Q 246 207 233 202 Z" fill="#d4d8de" stroke="#5a6068" strokeWidth="0.8" />
            {/* Chest seam */}
            <path d="M 241 179 L 245 189 L 249 179" fill="none" stroke="#5a6068" strokeWidth="1.1" opacity="0.6" />
            {/* Suit highlight */}
            <path d="M 236 186 Q 235 194 237 201" stroke="#eef0f3" strokeWidth="1.1" fill="none" opacity="0.6" />
            {/* Life-support chest light, softly glowing */}
            <circle cx="246" cy="193" r="1.6" fill="#3de0ff" opacity="0.9" filter="url(#glow)" />

            {/* Near arm, raised in a wave toward the viewer instead of
                holding anything. Built as two clean tapered segments that
                share their elbow edge (same construction as the other
                poses' limbs) so the bend reads naturally: upper arm rises
                from the shoulder, forearm continues up and back in past the
                shoulder line to bring the hand up beside the helmet. */}
            <g className="survivor-wave">
              <path d="M 257.9 188.7 L 261.9 178.3 L 258.1 177 L 254.1 187.3 Z" fill="#d4d8de" stroke="#5a6068" strokeWidth="0.6" />
              <path d="M 261.8 177.7 L 259.8 165.9 L 256.2 166.5 L 258.2 178.3 Z" fill="#eef0f3" stroke="#5a6068" strokeWidth="0.6" />
              {/* Glove */}
              <circle cx="258" cy="166" r="2.4" fill="#eef0f3" stroke="#5a6068" strokeWidth="0.6" />
            </g>

            {/* Head, visible through the visor */}
            <circle cx="246" cy="170" r="7.2" fill="#8a7361" stroke="#0c0c0e" strokeWidth="0.8" />
            {/* Eyes — bold dark dots so the face reads even at the figure's
                small in-game size; the other poses hide these behind a
                hood/sunglasses, but the space visor is meant to show them */}
            <circle cx="243.2" cy="169" r="1.3" fill="#221a12" />
            <circle cx="248.4" cy="169" r="1.3" fill="#221a12" />
            {/* Beard, matching the other worlds' companion — bigger and
                outlined for contrast, so it stays readable through the
                tinted visor rather than blending into the similarly-warm
                skin tone */}
            <path d="M 241.5 172.5 Q 246 179.5 250.5 172.5 Q 249.4 177.3 246 178.2 Q 242.6 177.3 241.5 172.5 Z" fill="#9a9a90" stroke="#3a352c" strokeWidth="0.5" opacity="0.95" />

            {/* Helmet shell behind the head, a rounded dome reaching past
                the head's silhouette so it reads as a full helmet */}
            <circle cx="246" cy="169" r="9.6" fill="none" stroke="#aab0ba" strokeWidth="1.6" opacity="0.9" />
            {/* Neck collar ring where the helmet meets the suit */}
            <path d="M 239 176 Q 246 181 253 176 L 253 179 Q 246 184 239 179 Z" fill="#c6cad2" stroke="#5a6068" strokeWidth="0.6" />
            {/* Small collar indicator lights */}
            <circle cx="242" cy="178.5" r="0.9" fill="#ffd97a" opacity="0.9" />
            <circle cx="250" cy="178.5" r="0.9" fill="#3de0ff" opacity="0.9" />

            {/* Visor: translucent amber, covering the whole face — kept
                light enough that the eyes/beard stay clearly visible
                underneath, just tinted, rather than being washed out —
                drawn last, over the head, per a real open-space helmet. */}
            <ellipse cx="246" cy="170.5" rx="7.6" ry="8" fill="#f0c860" opacity="0.18" />
            <ellipse cx="246" cy="170.5" rx="7.6" ry="8" fill="none" stroke="#f6d888" strokeWidth="0.8" opacity="0.6" />
            {/* Glossy highlight streak on the visor */}
            <path d="M 240.5 165.5 Q 239 170 240.5 175" stroke="#fff6d8" strokeWidth="1.1" fill="none" opacity="0.45" strokeLinecap="round" />
          </g>
        </g>
      </g>
    );
  }

  if (world === 'city') {
    // Halloween: the black city outfit stays exactly as-is — only the
    // sunglasses are swapped for a skull mask over the face.
    const isHalloween = holiday === 'halloween';
    // Christmas: the opposite approach — the outfit recolors (same
    // red-tier palette the village uses) and a Santa hat is added, but the
    // face (sunglasses + beard) stays untouched, since Christmas doesn't
    // touch the face.
    const isChristmas = holiday === 'christmas';
    // New Year: like the village, just a gold party hat added on top — no
    // outfit recolor, face stays untouched.
    const isNewyear = holiday === 'newyear';
    // Outfit fills: black coat/arms and blue jeans swapped for Christmas
    // red when active. Jeans and coat start as different base colors, so
    // each needs its own fallback even though both become the same red.
    const coatFill = isChristmas ? '#8a2f2a' : '#1c1c20'; // torso + both arms
    const legFillLight = isChristmas ? '#8a2f2a' : '#2a4a78'; // front leg
    const legFillDark = isChristmas ? '#6e231f' : '#24406a'; // back leg
    const legSeamHighlight = isChristmas ? '#a8453d' : '#4a6ea6'; // jean seam highlights
    const coatHighlightStroke = isChristmas ? '#a8453d' : '#38383e'; // coat sheen stroke
    return (
      <g className="survivor">
        <g transform="translate(243,221) scale(0.7) translate(-243,-221)">
          {/* Ground shadow */}
          <ellipse cx="246" cy="221" rx="14" ry="3.4" fill="#000" opacity="0.5" />

          <g className="survivor-body--city">
            {/* Shoes */}
            <ellipse cx="239" cy="221" rx="4.2" ry="2.1" fill="#0c0c0e" />
            <ellipse cx="253" cy="221" rx="4.2" ry="2.1" fill="#0c0c0e" />

            {/* Legs (blue jeans, or Christmas red), standing with a small natural stance */}
            <path d="M 236 200 L 235 220 L 242 220 L 243 200 Z" fill={legFillLight} stroke="#15161e" strokeWidth="0.7" />
            <path d="M 244 200 L 247 220 L 254 220 L 250 200 Z" fill={legFillDark} stroke="#15161e" strokeWidth="0.7" />
            {/* Jean seam highlights */}
            <line x1="239" y1="203" x2="238" y2="218" stroke={legSeamHighlight} strokeWidth="0.7" opacity="0.5" />
            <line x1="248" y1="203" x2="250" y2="218" stroke={legSeamHighlight} strokeWidth="0.7" opacity="0.35" />

            {/* Far arm hanging at the side */}
            <path d="M 234 188 L 230 199 L 233 202 L 237 190 Z" fill={coatFill} stroke="#0c0c0e" strokeWidth="0.6" />
            <circle cx="231" cy="202" r="2.3" fill="#8a7361" />

            {/* Torso (black coat, or Christmas red) */}
            <path d="M 233 187 Q 232 178 245 176 Q 258 178 257 187 L 259 202 Q 246 207 233 202 Z" fill={coatFill} stroke="#0c0c0e" strokeWidth="0.8" />
            {/* Coat lapels */}
            <path d="M 241 179 L 245 189 L 249 179" fill="none" stroke="#0c0c0e" strokeWidth="1.1" opacity="0.7" />
            {/* Coat highlight */}
            <path d="M 236 186 Q 235 194 237 201" stroke={coatHighlightStroke} strokeWidth="1.1" fill="none" opacity="0.5" />

            {/* Near arm, bent, holding a small coffee cup at chest height */}
            <g>
              <path d="M 256 189 L 263 195 L 260 199 L 254 193 Z" fill={coatFill} stroke="#0c0c0e" strokeWidth="0.6" />
              <path d="M 260 196 L 266 200 L 263 204 L 258 200 Z" fill={coatFill} stroke="#0c0c0e" strokeWidth="0.6" />
              {/* Hand */}
              <circle cx="266" cy="201" r="2.2" fill="#8a7361" />
              {/* Small coffee cup, a reasonable hand-held size (not a giant prop) */}
              <rect x="264.5" y="197.5" width="4.2" height="4.2" rx="0.7" fill="#e8e4d8" />
              <ellipse cx="266.6" cy="197.5" rx="2.2" ry="0.9" fill="#4a2f1a" />
              <path d="M 268.7 198.5 Q 270.8 199 268.7 200.2" fill="none" stroke="#c8c2b2" strokeWidth="0.7" />
              {/* Thin steam wisp */}
              <path d="M 266 196 Q 264 192 266 188" stroke="#e8e4d8" strokeWidth="1" strokeLinecap="round" opacity="0.45" className="coffee-steam" />
            </g>

            {/* Head */}
            <circle cx="246" cy="170" r="7.2" fill="#8a7361" stroke="#0c0c0e" strokeWidth="0.8" />
            {/* Aviator sunglasses — withheld on Halloween, replaced by the skull mask below */}
            {!isHalloween && (
              <>
                <ellipse cx="243" cy="170" rx="2.6" ry="2.1" fill="#0c0c0e" />
                <ellipse cx="249" cy="170" rx="2.6" ry="2.1" fill="#0c0c0e" />
                <line x1="245.6" y1="169.8" x2="246.4" y2="169.8" stroke="#0c0c0e" strokeWidth="1" />
                <path d="M 240.5 169.3 Q 242.5 168 245 169.3" stroke="#5c6270" strokeWidth="0.5" opacity="0.6" fill="none" />
              </>
            )}
            {/* Beard, matching the AI companion's grey beard */}
            <path d="M 242.8 173.5 Q 246 178.5 249.2 173.5 Q 248.5 176.8 246 177.5 Q 243.5 176.8 242.8 173.5 Z" fill="#8a8a7c" opacity="0.85" />

            {isHalloween && (
              // Bone-white skull mask, same technique as the assistant's own
              // Halloween mask: an opaque shape over the whole head/jaw area
              // (covering the beard below it, same as the assistant does),
              // with dark eye sockets, a triangular nasal cavity, and a
              // faint mouth line — no detailed teeth, too small to read.
              <g className="survivor-skull-mask">
                <path
                  d="M 246 162.5 Q 239 163 239 170 Q 239 177 246 179 Q 253 177 253 170 Q 253 163 246 162.5 Z"
                  fill="#e8e4d8"
                  stroke="#b0a996"
                  strokeWidth="0.5"
                />
                {/* Dark eye sockets, same position as the sunglasses lenses */}
                <ellipse cx="243" cy="170" rx="2.4" ry="2.7" fill="#1a1712" />
                <ellipse cx="249" cy="170" rx="2.4" ry="2.7" fill="#1a1712" />
                {/* Triangular nasal cavity */}
                <path d="M 246 171.5 L 244.7 174.3 L 247.3 174.3 Z" fill="#1a1712" />
                {/* Faint mouth hint — a closed line with a couple of tooth
                    gaps, not full teeth, since they wouldn't read at this size */}
                <line x1="243.5" y1="176.8" x2="248.5" y2="176.8" stroke="#1a1712" strokeWidth="0.6" />
                <line x1="245.3" y1="176.3" x2="245.3" y2="177.3" stroke="#1a1712" strokeWidth="0.4" />
                <line x1="246.7" y1="176.3" x2="246.7" y2="177.3" stroke="#1a1712" strokeWidth="0.4" />
              </g>
            )}

            {isChristmas && (
              // Santa hat, same shape/color technique as the village's own
              // Christmas hat (red cone + white pompom + white fur trim),
              // but drawn front-on since this figure faces the camera
              // rather than showing the back of its head — the cone leans
              // and flops to one side instead of tilting backward.
              <g className="survivor-santa-hat-city">
                <path
                  d="M 241 165 Q 244 152 250 150 Q 256 149 253 156 Q 250 161 251 165 Z"
                  fill="#b5342c"
                  stroke="#4a1512"
                  strokeWidth="0.5"
                />
                {/* White pompom at the flopped-over tip */}
                <circle cx="253" cy="156.5" r="1.8" fill="#f4f4f0" stroke="#cfcfc2" strokeWidth="0.3" />
                {/* White fur trim band at the base */}
                <path d="M 240 165 Q 246 160.5 252 165" fill="none" stroke="#f4f4f0" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}

            {isNewyear && (
              // Same gold party hat as the village (same shape, same
              // scaled-up-to-head-size tip/star/sparkle technique), but
              // with NO rotate transform: this figure faces the camera
              // straight-on, so the hat sits straight up on the crown
              // instead of leaning back like the village's does.
              <g className="survivor-newyear-hat-city">
                {/* Small gold cone, sized to sit on the crown of the head (r=7.2) */}
                <path
                  d="M 241 165 L 244 156 L 251 165 Z"
                  fill="#f0c14a"
                  stroke="#a8842a"
                  strokeWidth="0.45"
                />
                {/* Diagonal shine/shadow stripes */}
                <path d="M 242.4 162.8 L 243.8 158.3" stroke="#f7d97a" strokeWidth="0.7" opacity="0.5" strokeLinecap="round" />
                <path d="M 249.6 162.8 L 245.1 158.3" stroke="#c89a2e" strokeWidth="0.7" opacity="0.5" strokeLinecap="round" />
                {/* Small star at the tip, in place of a pompom */}
                <path
                  d="M 244.2 153.4 L 244.6 154.3 L 245.4 154.7 L 244.6 155.1 L 244.2 156.1 L 243.8 155.1 L 243 154.7 L 243.8 154.3 Z"
                  fill="#f7d97a"
                  stroke="#c89a2e"
                  strokeWidth="0.3"
                />
                {/* Faint gold sparkles twinkling around the hat */}
                <g className="survivor-sparkle">
                  <circle cx="237" cy="159.2" r="0.6" fill="#f7d97a" />
                  <circle cx="252.3" cy="161" r="0.6" fill="#f7d97a" />
                  <circle cx="244.2" cy="151.1" r="0.55" fill="#f7d97a" />
                </g>
              </g>
            )}
          </g>
        </g>
      </g>
    );
  }

  // Hooded survivor by the fire, scaled to 70% and colored military khaki-green
  // (or a holiday color, see below). The transform scales around the seated
  // base point (243,221) so the feet stay on the ground line. Faces right
  // toward the fire.
  //
  // Christmas/Valentine's/Easter outfits: this pose only ever shows the back
  // of the head (hood + a sliver of profile toward the fire) — the face
  // itself never renders — so holiday costumes here are limited to
  // recoloring the outfit, plus headwear for Christmas/New Year/Easter.
  // No masks/glasses/face props, since there's no face to put them on.
  const isChristmas = holiday === 'christmas';
  const isNewyear = holiday === 'newyear';
  const isValentines = holiday === 'valentines';
  const isEaster = holiday === 'easter';
  // Outfit fills: khaki-green swapped for a holiday color when active,
  // leaving every other color (skin, outlines, campfire rim light)
  // untouched. Valentine's pink and Easter yellow match the assistant's own
  // tones for those holidays.
  const bodyFill = isChristmas ? '#8a2f2a' : isValentines ? '#d9425e' : isEaster ? '#c99328' : '#4a4b32';
  const bodyDark = isChristmas ? '#6e231f' : isValentines ? '#8a2f45' : isEaster ? '#8a661a' : '#34351f';
  const bodyLight = isChristmas ? '#a8453d' : isValentines ? '#ec7a95' : isEaster ? '#f7dd6e' : '#5e6040';
  const hoodFill = isChristmas ? '#5c1f1a' : isValentines ? '#6e2439' : isEaster ? '#6b4f14' : '#262716';
  const foldShadow = isChristmas ? '#3a1613' : isValentines ? '#4a1626' : isEaster ? '#4a3610' : '#2c2d1a';

  return (
    <g className="survivor">
      <g transform="translate(243,221) scale(0.7) translate(-243,-221)">
        {/* Ground shadow */}
        <ellipse cx="243" cy="221" rx="22" ry="4.5" fill="#000" opacity="0.5" />

        <g className="survivor-body">
          {/* Back leg folded */}
          <path d="M 234 221 Q 232 212 241 209 L 253 212 Q 251 217 250 221 Z" fill={bodyDark} stroke="#15110a" strokeWidth="0.8" opacity="0.98" />

          {/* Front thigh + knee + shin + foot */}
          <path d="M 232 217 L 256 208 Q 260 207 261 211 L 241 221 Z" fill={bodyFill} stroke="#15110a" strokeWidth="0.8" />
          <circle cx="258" cy="210" r="3.5" fill={bodyLight} />
          <path d="M 255 210 L 261 209 L 263 220 L 257 221 Z" fill={bodyDark} />
          <path d="M 255 219 L 267 219 L 267 222 L 254 222 Z" fill="#211c11" opacity="0.95" />

          {/* Torso */}
          <path d="M 231 216 Q 224 199 235 187 Q 242 184 247 189 Q 244 202 246 216 Z" fill={bodyFill} stroke="#15110a" strokeWidth="0.8" />
          {/* Fold shadow */}
          <path d="M 240 190 Q 238 202 242 215" stroke={foldShadow} strokeWidth="1.6" fill="none" opacity="0.85" />
          {/* Cool lit edge on the back */}
          <path d="M 233 189 Q 227 200 232 214" stroke={bodyLight} strokeWidth="1.4" fill="none" opacity="0.5" />

          {/* Upper arm + forearm reaching to fire — occasionally pokes it */}
          <g className="survivor-arm">
            <path d="M 240 192 L 252 197 L 250 201 L 238 197 Z" fill={bodyLight} stroke="#15110a" strokeWidth="0.6" />
            <path d="M 250 197 L 265 203 L 263 207 L 248 202 Z" fill={bodyFill} stroke="#15110a" strokeWidth="0.6" />
            {/* Hand */}
            <circle cx="267" cy="205" r="2.8" fill="#6e5943" />
          </g>

          {/* Head */}
          <circle cx="240" cy="178" r="8" fill="#6e5943" stroke="#15110a" strokeWidth="0.8" />
          {/* Face profile: nose + chin facing fire */}
          <path d="M 248 174 Q 250 177 248 180 L 251 182 Q 248 184 247 185 Q 249 187 245 189"
            fill="none" stroke="#211a12" strokeWidth="1.6" opacity="0.9" />
          {/* Hood over the back of the head */}
          <path d="M 244 169 Q 229 169 230 184 Q 231 191 238 190 Q 231 179 241 169 Z" fill={hoodFill} stroke="#15110a" strokeWidth="0.8" />

          {isChristmas && (
            // Nudged down (translate) so the hat sits deeper into the head
            // rather than floating above it, then rotated around the head's
            // own center (240,178) so the tip and pompom droop toward the
            // back of the head (left, away from the fire), matching the 3/4
            // back profile.
            <g className="survivor-santa-hat" transform="rotate(-20 240 178) translate(0 4)">
              {/* Red cone, leaning back over the hood and drooping down past
                  its far (back) edge. Base (right end) nudged slightly
                  toward the forehead (247 -> 252) to meet the white band's
                  own right end below, so the two pieces read as connected. */}
              <path
                d="M 252 172 Q 240 156 224 158 Q 208 160 213 180 Q 221 171 230 167 Z"
                fill="#b5342c"
                stroke="#4a1512"
                strokeWidth="0.6"
              />
              {/* White pompom at the drooping tip */}
              <circle cx="213" cy="181" r="2.3" fill="#f4f4f0" stroke="#cfcfc2" strokeWidth="0.4" />
              {/* White fur trim band at the base, covering the seam between
                  the cone and the head/hood */}
              <path
                d="M 229 169 Q 239 163 251 171 Q 240 173 229 169 Z"
                fill="#f4f4f0"
                stroke="#cfcfc2"
                strokeWidth="0.4"
              />
            </g>
          )}

          {isNewyear && (
            // Same rotate scheme as the Christmas hat so it leans back
            // toward the back of the head the same way; no extra vertical
            // nudge needed for this small cone.
            <g className="survivor-newyear-hat" transform="rotate(-20 240 178)">
              {/* Small gold cone, sized to sit on the crown of the head
                  (r=8) rather than towering over it */}
              <path
                d="M 234 172 L 238 162 L 246 172 Z"
                fill="#f0c14a"
                stroke="#a8842a"
                strokeWidth="0.5"
              />
              {/* Diagonal shine/shadow stripes, matching the assistant's own party hat */}
              <path d="M 236 170 L 237.5 165" stroke="#f7d97a" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
              <path d="M 244 170 L 239 165" stroke="#c89a2e" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
              {/* Small star at the tip, in place of a pompom */}
              <path
                d="M 238 159.6 L 238.4 160.6 L 239.3 161 L 238.4 161.4 L 238 162.5 L 237.6 161.4 L 236.7 161 L 237.6 160.6 Z"
                fill="#f7d97a"
                stroke="#c89a2e"
                strokeWidth="0.35"
              />
              {/* Faint gold sparkles twinkling around the hat, same technique
                  as the assistant's own hat sparkles */}
              <g className="survivor-sparkle">
                <circle cx="230" cy="166" r="0.7" fill="#f7d97a" />
                <circle cx="247" cy="168" r="0.7" fill="#f7d97a" />
                <circle cx="238" cy="157" r="0.6" fill="#f7d97a" />
              </g>
            </g>
          )}

          {isEaster && (
            // Unlike the Christmas/New Year headwear, these stand upright
            // rather than leaning back — no rotate transform, just placed
            // on the same spot on the crown.
            <g className="survivor-bunny-ears">
              {/* Left ear — cream outer, pink inner, the assistant's own
                  bunny-ear palette scaled down to the figure's head (r=8).
                  Nearly vertical (only a slight curve), with its base
                  overlapping the right ear's base at x=243 so the pair reads
                  as close together rather than splayed apart, shifted
                  toward the forehead (right) to sit more over the crown. */}
              <path d="M 240 172 Q 239.3 163 241.5 156 Q 243.7 163 243 172 Z" fill="#efe7d8" stroke="#b0a68e" strokeWidth="0.4" />
              <path d="M 240.6 171 Q 240.1 163 241.5 157.5 Q 242.9 163 242.4 171 Z" fill="#f6b8ce" />
              {/* Right ear */}
              <path d="M 243 172 Q 242.3 163 244.5 156 Q 246.7 163 246 172 Z" fill="#efe7d8" stroke="#b0a68e" strokeWidth="0.4" />
              <path d="M 243.6 171 Q 243.1 163 244.5 157.5 Q 245.9 163 245.4 171 Z" fill="#f6b8ce" />
            </g>
          )}

          {/* Crisp warm rim light on the fire-facing side, tracing the head and torso silhouette */}
          <path d="M 246 189 Q 244 202 246 216" stroke="#f0a83a" strokeWidth="2.1" fill="none" opacity="0.9" />
          <path d="M 245.1 171.9 A 8 8 0 0 1 244 184.9" stroke="#f0a83a" strokeWidth="1.7" fill="none" opacity="0.9" />
          {/* Brightest highlight on the face */}
          <path d="M 248 174 Q 250 177 248 180 L 251 182" stroke="#ffcf6b" strokeWidth="1.4" fill="none" opacity="0.95" />
        </g>
      </g>
    </g>
  );
}

export default Survivor;
