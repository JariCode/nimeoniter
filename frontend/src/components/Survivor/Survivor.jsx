import './Survivor.css';

// The in-world companion figure. `world` picks which pose/outfit renders:
// 'medieval' (default) is the original hooded survivor, seated by the fire,
// unchanged. 'city' is a standing figure in front of the diner, wearing the
// same city outfit SurvivorFace already knows (black coat, blue jeans,
// black shoes, sunglasses — no purple), holding a small coffee cup. Both
// share the same outer scale/anchor so the figure's on-screen size and
// ground position stay identical between worlds — only the art changes.
function Survivor({ world = 'medieval' }) {
  if (world === 'city') {
    return (
      <g className="survivor">
        <g transform="translate(243,221) scale(0.7) translate(-243,-221)">
          {/* Ground shadow */}
          <ellipse cx="246" cy="221" rx="14" ry="3.4" fill="#000" opacity="0.5" />

          <g className="survivor-body--city">
            {/* Shoes */}
            <ellipse cx="239" cy="221" rx="4.2" ry="2.1" fill="#0c0c0e" />
            <ellipse cx="253" cy="221" rx="4.2" ry="2.1" fill="#0c0c0e" />

            {/* Legs (blue jeans), standing with a small natural stance */}
            <path d="M 236 200 L 235 220 L 242 220 L 243 200 Z" fill="#2a4a78" stroke="#15161e" strokeWidth="0.7" />
            <path d="M 244 200 L 247 220 L 254 220 L 250 200 Z" fill="#24406a" stroke="#15161e" strokeWidth="0.7" />
            {/* Jean seam highlights */}
            <line x1="239" y1="203" x2="238" y2="218" stroke="#4a6ea6" strokeWidth="0.7" opacity="0.5" />
            <line x1="248" y1="203" x2="250" y2="218" stroke="#4a6ea6" strokeWidth="0.7" opacity="0.35" />

            {/* Far arm hanging at the side */}
            <path d="M 234 188 L 230 199 L 233 202 L 237 190 Z" fill="#1c1c20" stroke="#0c0c0e" strokeWidth="0.6" />
            <circle cx="231" cy="202" r="2.3" fill="#8a7361" />

            {/* Torso (black coat) */}
            <path d="M 233 187 Q 232 178 245 176 Q 258 178 257 187 L 259 202 Q 246 207 233 202 Z" fill="#1c1c20" stroke="#0c0c0e" strokeWidth="0.8" />
            {/* Coat lapels */}
            <path d="M 241 179 L 245 189 L 249 179" fill="none" stroke="#0c0c0e" strokeWidth="1.1" opacity="0.7" />
            {/* Coat highlight */}
            <path d="M 236 186 Q 235 194 237 201" stroke="#38383e" strokeWidth="1.1" fill="none" opacity="0.5" />

            {/* Near arm, bent, holding a small coffee cup at chest height */}
            <g>
              <path d="M 256 189 L 263 195 L 260 199 L 254 193 Z" fill="#1c1c20" stroke="#0c0c0e" strokeWidth="0.6" />
              <path d="M 260 196 L 266 200 L 263 204 L 258 200 Z" fill="#1c1c20" stroke="#0c0c0e" strokeWidth="0.6" />
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
            {/* Aviator sunglasses */}
            <ellipse cx="243" cy="170" rx="2.6" ry="2.1" fill="#0c0c0e" />
            <ellipse cx="249" cy="170" rx="2.6" ry="2.1" fill="#0c0c0e" />
            <line x1="245.6" y1="169.8" x2="246.4" y2="169.8" stroke="#0c0c0e" strokeWidth="1" />
            <path d="M 240.5 169.3 Q 242.5 168 245 169.3" stroke="#5c6270" strokeWidth="0.5" opacity="0.6" fill="none" />
            {/* Beard, matching the AI companion's grey beard */}
            <path d="M 242.8 173.5 Q 246 178.5 249.2 173.5 Q 248.5 176.8 246 177.5 Q 243.5 176.8 242.8 173.5 Z" fill="#8a8a7c" opacity="0.85" />
          </g>
        </g>
      </g>
    );
  }

  // Hooded survivor by the fire, scaled to 70% and colored military khaki-green.
  // The transform scales around the seated base point (243,221) so the feet
  // stay on the ground line. Faces right toward the fire.
  return (
    <g className="survivor">
      <g transform="translate(243,221) scale(0.7) translate(-243,-221)">
        {/* Ground shadow */}
        <ellipse cx="243" cy="221" rx="22" ry="4.5" fill="#000" opacity="0.5" />

        <g className="survivor-body">
          {/* Back leg folded */}
          <path d="M 234 221 Q 232 212 241 209 L 253 212 Q 251 217 250 221 Z" fill="#34351f" stroke="#15110a" strokeWidth="0.8" opacity="0.98" />

          {/* Front thigh + knee + shin + foot */}
          <path d="M 232 217 L 256 208 Q 260 207 261 211 L 241 221 Z" fill="#4a4b32" stroke="#15110a" strokeWidth="0.8" />
          <circle cx="258" cy="210" r="3.5" fill="#5e6040" />
          <path d="M 255 210 L 261 209 L 263 220 L 257 221 Z" fill="#34351f" />
          <path d="M 255 219 L 267 219 L 267 222 L 254 222 Z" fill="#211c11" opacity="0.95" />

          {/* Torso */}
          <path d="M 231 216 Q 224 199 235 187 Q 242 184 247 189 Q 244 202 246 216 Z" fill="#4a4b32" stroke="#15110a" strokeWidth="0.8" />
          {/* Fold shadow */}
          <path d="M 240 190 Q 238 202 242 215" stroke="#2c2d1a" strokeWidth="1.6" fill="none" opacity="0.85" />
          {/* Cool lit edge on the back */}
          <path d="M 233 189 Q 227 200 232 214" stroke="#5e6040" strokeWidth="1.4" fill="none" opacity="0.5" />

          {/* Upper arm + forearm reaching to fire — occasionally pokes it */}
          <g className="survivor-arm">
            <path d="M 240 192 L 252 197 L 250 201 L 238 197 Z" fill="#5e6040" stroke="#15110a" strokeWidth="0.6" />
            <path d="M 250 197 L 265 203 L 263 207 L 248 202 Z" fill="#4a4b32" stroke="#15110a" strokeWidth="0.6" />
            {/* Hand */}
            <circle cx="267" cy="205" r="2.8" fill="#6e5943" />
          </g>

          {/* Head */}
          <circle cx="240" cy="178" r="8" fill="#6e5943" stroke="#15110a" strokeWidth="0.8" />
          {/* Face profile: nose + chin facing fire */}
          <path d="M 248 174 Q 250 177 248 180 L 251 182 Q 248 184 247 185 Q 249 187 245 189"
            fill="none" stroke="#211a12" strokeWidth="1.6" opacity="0.9" />
          {/* Hood over the back of the head */}
          <path d="M 244 169 Q 229 169 230 184 Q 231 191 238 190 Q 231 179 241 169 Z" fill="#262716" stroke="#15110a" strokeWidth="0.8" />

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
