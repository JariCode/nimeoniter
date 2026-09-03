import './BaseWorld.css';
import Survivor from '../Survivor/Survivor';
import { BUILD_STAGES } from '../../data/gameConfig';

// How many buildings are built, from the current stage key.
// 'camp' = 0 built; otherwise index in BUILD_STAGES + 1.
function builtCountFromKey(stageKey) {
  if (stageKey === 'camp') return 0;
  const i = BUILD_STAGES.findIndex((s) => s.key === stageKey);
  return i === -1 ? 0 : i + 1;
}

function BaseWorld({ stageKey }) {
  const built = builtCountFromKey(stageKey);
  const has = (key) => BUILD_STAGES.slice(0, built).some((s) => s.key === key);

  return (
    <div className="base-world">
      <svg
        viewBox="0 0 400 300"
        className="base-world-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="sky" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#2a2418" />
            <stop offset="45%" stopColor="#16140f" />
            <stop offset="100%" stopColor="#0b0a08" />
          </radialGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c1810" />
            <stop offset="100%" stopColor="#100d09" />
          </linearGradient>
          <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3c28" />
            <stop offset="100%" stopColor="#2e2418" />
          </linearGradient>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="400" height="300" fill="url(#sky)" />

        {/* Stars */}
        <circle cx="60" cy="40" r="1" fill="#e8dcc0" opacity="0.5" />
        <circle cx="130" cy="60" r="1.2" fill="#e8dcc0" opacity="0.4" />
        <circle cx="320" cy="35" r="1" fill="#e8dcc0" opacity="0.6" />
        <circle cx="360" cy="80" r="1" fill="#e8dcc0" opacity="0.3" />
        <circle cx="240" cy="50" r="0.8" fill="#e8dcc0" opacity="0.5" />
        <circle cx="90" cy="90" r="0.8" fill="#e8dcc0" opacity="0.35" />

        {/* Ground */}
        <rect x="0" y="220" width="400" height="80" fill="url(#ground)" />
        <ellipse cx="200" cy="220" rx="200" ry="18" fill="#221d13" opacity="0.6" />

        {/* ===== BACK LAYER ===== */}

        {/* WALL + big corner tower — final build */}
        {has('wall') && (
          <>
            <g>
              <rect x="10" y="182" width="380" height="40" fill="#2b2823" />
              <rect x="10" y="182" width="380" height="7" fill="#37332c" />
              <rect x="14" y="174" width="16" height="10" fill="#2b2823" />
              <rect x="50" y="174" width="16" height="10" fill="#2b2823" />
              <rect x="352" y="174" width="16" height="10" fill="#2b2823" />
              <line x1="10" y1="200" x2="390" y2="200" stroke="#1f1c18" strokeWidth="1" />
            </g>
            <g>
              <ellipse cx="350" cy="222" rx="26" ry="6" fill="#000" opacity="0.4" />
              <rect x="334" y="118" width="34" height="104" fill="#38332b" />
              <rect x="334" y="118" width="34" height="9" fill="#443e34" />
              <rect x="334" y="110" width="9" height="10" fill="#38332b" />
              <rect x="349" y="110" width="9" height="10" fill="#38332b" />
              <line x1="334" y1="150" x2="368" y2="150" stroke="#2b2621" strokeWidth="1" />
              <line x1="334" y1="180" x2="368" y2="180" stroke="#2b2621" strokeWidth="1" />
              <rect x="346" y="145" width="9" height="13" rx="2" fill="#f0b429" opacity="0.85" />
            </g>
          </>
        )}

        {/* ===== MID LAYER (original buildings, unchanged) ===== */}

        {/* HOUSE (original) */}
        {has('house') && (
          <g>
            <ellipse cx="90" cy="222" rx="46" ry="8" fill="#000" opacity="0.4" />
            <rect x="58" y="172" width="66" height="50" fill="url(#wood)" />
            <line x1="58" y1="188" x2="124" y2="188" stroke="#241c12" strokeWidth="1" />
            <line x1="58" y1="204" x2="124" y2="204" stroke="#241c12" strokeWidth="1" />
            <path d="M 50 174 L 91 142 L 132 174 Z" fill="#2b2318" />
            <path d="M 91 142 L 132 174 L 124 174 L 91 150 Z" fill="#221b11" />
            <rect x="84" y="194" width="16" height="28" rx="1" fill="#0d0b07" />
            <circle cx="97" cy="208" r="1.2" fill="#6b5836" />
            <rect x="66" y="182" width="12" height="12" rx="1" fill="#f0b429" opacity="0.8" />
            <rect x="104" y="182" width="12" height="12" rx="1" fill="#f0b429" opacity="0.8" />
          </g>
        )}

        {/* HUT (original, enlarged so the doorway reads against the survivor) */}
        {has('hut') && (
          <g transform="translate(-14,-10.4) scale(1.2)">
            <ellipse cx="70" cy="222" rx="32" ry="7" fill="#000" opacity="0.4" />
            <rect x="46" y="190" width="48" height="32" fill="url(#wood)" />
            <line x1="46" y1="206" x2="94" y2="206" stroke="#241c12" strokeWidth="1" />
            <path d="M 40 192 L 70 170 L 100 192 Z" fill="#241d13" />
            <path d="M 70 170 L 100 192 L 92 192 L 70 177 Z" fill="#1c160e" />
            <rect x="63" y="204" width="14" height="18" fill="#0d0b07" />
          </g>
        )}

        {/* WELL (brought forward and clear of the hut, shadow aligned to its base) */}
        {has('well') && (
          <g transform="translate(-27,-79) scale(1.5)">
            <ellipse cx="35" cy="241" rx="17" ry="4.5" fill="#000" opacity="0.4" />
            <ellipse cx="35" cy="241" rx="13" ry="5" fill="#3a3128" />
            <ellipse cx="35" cy="240" rx="10" ry="3.5" fill="#0d0b07" />
            <rect x="24" y="224" width="3.5" height="17" fill="#3a2c1a" />
            <rect x="43" y="224" width="3.5" height="17" fill="#3a2c1a" />
            <path d="M 21 226 L 35 218 L 49 226 Z" fill="#241d13" />
          </g>
        )}

        {/* ===== FRONT LAYER ===== */}

        {/* TENT (always, original) */}
        <g transform="translate(0, 18)">
          <ellipse cx="175" cy="222" rx="44" ry="8" fill="#000" opacity="0.4" />
          <path d="M 140 220 L 175 165 L 210 220 Z" fill="#43371f" />
          <path d="M 175 165 L 175 220 L 210 220 Z" fill="#2b2318" />
          <line x1="175" y1="165" x2="175" y2="220" stroke="#1c160e" strokeWidth="1" />
          <line x1="175" y1="165" x2="150" y2="220" stroke="#372c19" strokeWidth="1" />
          <path d="M 175 200 L 166 220 L 184 220 Z" fill="#0d0b07" />
          <line x1="175" y1="165" x2="175" y2="158" stroke="#2a2018" strokeWidth="2" />
        </g>

        {/* FIELD (foreground, enlarged, shifted left so it stays clear of the survivor) */}
        {has('field') && (
          <g transform="translate(-85,-80) scale(1.35)">
            <ellipse cx="200" cy="260" rx="48" ry="13" fill="#000" opacity="0.45" />
            <rect x="160" y="250" width="80" height="12" fill="#2e2416" />
            <g fill="#5a6b30">
              <ellipse cx="172" cy="251" rx="3.5" ry="6" />
              <ellipse cx="186" cy="251" rx="3.5" ry="6" />
              <ellipse cx="200" cy="251" rx="3.5" ry="6" />
              <ellipse cx="214" cy="251" rx="3.5" ry="6" />
              <ellipse cx="228" cy="251" rx="3.5" ry="6" />
            </g>
            <line x1="160" y1="256" x2="240" y2="256" stroke="#241c12" strokeWidth="1" />
          </g>
        )}

        {/* SURVIVOR (always) */}
        <g transform="translate(0, 20)">
          <Survivor />
        </g>

        {/* CAMPFIRE (always) */}
        <g transform="translate(0, 20)">
          <g filter="url(#glow)">
            <rect x="268" y="212" width="24" height="5" rx="2" fill="#2a2018" transform="rotate(12 280 214)" />
            <rect x="268" y="212" width="24" height="5" rx="2" fill="#2a2018" transform="rotate(-12 280 214)" />
            <path d="M 280 189 C 270 205, 274 214, 280 214 C 286 214, 290 205, 280 189 Z" fill="#c8641e" />
            <path d="M 280 197 C 275 206, 277 213, 280 213 C 283 213, 285 206, 280 197 Z" fill="#f0b429" />
          </g>
          <ellipse cx="280" cy="216" rx="55" ry="12" fill="#c8641e" opacity="0.14" />
        </g>

        {/* STORAGE (drawn after the campfire so its glow stays behind the building) */}
        {has('storage') && (
          <g transform="translate(-37,-11) scale(1.2)">
            <ellipse cx="315" cy="242" rx="26" ry="6" fill="#000" opacity="0.4" />
            <rect x="295" y="212" width="40" height="30" fill="#3a3020" />
            <path d="M 290 214 L 315 194 L 340 214 Z" fill="#241d13" />
            <rect x="308" y="220" width="15" height="22" fill="#0d0b07" />
            <line x1="295" y1="226" x2="335" y2="226" stroke="#241c12" strokeWidth="1" />
          </g>
        )}

        {/* FENCE (right against the front edge of the field, matching its width) */}
        {has('fence') && (
          <g transform="translate(-508,-157) scale(2.16,1.7)" stroke="#8a6f45" strokeWidth="3" opacity="0.95">
            <line x1="300" y1="262" x2="300" y2="248" />
            <line x1="314" y1="262" x2="314" y2="248" />
            <line x1="328" y1="262" x2="328" y2="248" />
            <line x1="342" y1="262" x2="342" y2="248" />
            <line x1="296" y1="254" x2="346" y2="254" />
          </g>
        )}

        {/* WATCHTOWER (foreground, stays at the right edge) */}
        {has('watchtower') && (
          <g transform="translate(337,-7) scale(1.4)">
            <ellipse cx="32" cy="205" rx="13" ry="4" fill="#000" opacity="0.4" />
            <rect x="26" y="165" width="4" height="40" fill="#2e2418" transform="rotate(4 28 185)" />
            <rect x="35" y="165" width="4" height="40" fill="#2e2418" transform="rotate(-4 37 185)" />
            <rect x="23" y="157" width="19" height="10" fill="#3a3020" />
            <path d="M 21 157 L 32 147 L 43 157 Z" fill="#241d13" />
            <rect x="28" y="159" width="8" height="6" fill="#f0b429" opacity="0.75" />
          </g>
        )}
      </svg>

      <p className="base-world-stage">{stageKey.toUpperCase()}</p>
    </div>
  );
}

export default BaseWorld;