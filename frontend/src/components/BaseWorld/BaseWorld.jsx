import './BaseWorld.css';
import Survivor from '../Survivor/Survivor';

// Determine base stage from level
function getStage(level) {
  if (level >= 30) return 'fortress';
  if (level >= 20) return 'homestead';
  if (level >= 10) return 'shelter';
  return 'camp';
}

const STAGE_RANK = { camp: 0, shelter: 1, homestead: 2, fortress: 3 };

function BaseWorld({ stageKey }) {
  const rank = STAGE_RANK[stageKey] ?? 0;

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

          {/* Wood tones */}
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

        {/* --- FORTRESS: wall (rank >= 3), far left/right --- */}
        {rank >= 3 && (
          <g>
            <rect x="10" y="182" width="380" height="40" fill="#2b2823" />
            <rect x="10" y="182" width="380" height="7" fill="#37332c" />
            <rect x="14" y="174" width="16" height="10" fill="#2b2823" />
            <rect x="50" y="174" width="16" height="10" fill="#2b2823" />
            <rect x="352" y="174" width="16" height="10" fill="#2b2823" />
            {/* Stone seams */}
            <line x1="10" y1="200" x2="390" y2="200" stroke="#1f1c18" strokeWidth="1" />
          </g>
        )}

        {/* --- FORTRESS: tower (rank >= 3), far right --- */}
        {rank >= 3 && (
          <g>
            <ellipse cx="350" cy="222" rx="26" ry="6" fill="#000" opacity="0.4" />
            <rect x="334" y="118" width="34" height="104" fill="#38332b" />
            <rect x="334" y="118" width="34" height="9" fill="#443e34" />
            <rect x="334" y="110" width="9" height="10" fill="#38332b" />
            <rect x="349" y="110" width="9" height="10" fill="#38332b" />
            {/* Stone seams */}
            <line x1="334" y1="150" x2="368" y2="150" stroke="#2b2621" strokeWidth="1" />
            <line x1="334" y1="180" x2="368" y2="180" stroke="#2b2621" strokeWidth="1" />
            <rect x="346" y="145" width="9" height="13" rx="2" fill="#f0b429" opacity="0.85" />
          </g>
        )}

        {/* --- HOMESTEAD: house (rank >= 2), center-left, moved away from tent --- */}
        {rank >= 2 && (
          <g>
            <ellipse cx="90" cy="222" rx="46" ry="8" fill="#000" opacity="0.4" />
            {/* Body */}
            <rect x="58" y="172" width="66" height="50" fill="url(#wood)" />
            {/* Plank lines */}
            <line x1="58" y1="188" x2="124" y2="188" stroke="#241c12" strokeWidth="1" />
            <line x1="58" y1="204" x2="124" y2="204" stroke="#241c12" strokeWidth="1" />
            {/* Roof */}
            <path d="M 50 174 L 91 142 L 132 174 Z" fill="#2b2318" />
            <path d="M 91 142 L 132 174 L 124 174 L 91 150 Z" fill="#221b11" />
            {/* Door */}
            <rect x="84" y="194" width="16" height="28" rx="1" fill="#0d0b07" />
            <circle cx="97" cy="208" r="1.2" fill="#6b5836" />
            {/* Windows with warm light */}
            <rect x="66" y="182" width="12" height="12" rx="1" fill="#f0b429" opacity="0.8" />
            <rect x="104" y="182" width="12" height="12" rx="1" fill="#f0b429" opacity="0.8" />
          </g>
        )}

        {/* --- HOMESTEAD: fence (rank >= 2), right of center --- */}
        {rank >= 2 && (
          <g stroke="#2a2018" strokeWidth="3" opacity="0.9">
            <line x1="150" y1="216" x2="150" y2="202" />
            <line x1="164" y1="216" x2="164" y2="202" />
            <line x1="178" y1="216" x2="178" y2="202" />
            <line x1="145" y1="208" x2="183" y2="208" />
          </g>
        )}

        {/* --- SHELTER: wooden hut (rank >= 1), left side, clear of tent --- */}
        {rank >= 1 && (
          <g transform="translate(0, 34)">
            <ellipse cx="70" cy="222" rx="32" ry="7" fill="#000" opacity="0.4" />
            {/* Body */}
            <rect x="46" y="190" width="48" height="32" fill="url(#wood)" />
            {/* Plank line */}
            <line x1="46" y1="206" x2="94" y2="206" stroke="#241c12" strokeWidth="1" />
            {/* Roof */}
            <path d="M 40 192 L 70 170 L 100 192 Z" fill="#241d13" />
            <path d="M 70 170 L 100 192 L 92 192 L 70 177 Z" fill="#1c160e" />
            {/* Door */}
            <rect x="63" y="204" width="14" height="18" fill="#0d0b07" />
          </g>
        )}

        {/* --- CAMP: tent (always), center --- */}
        <g transform="translate(0, 18)">
          <ellipse cx="175" cy="222" rx="44" ry="8" fill="#000" opacity="0.4" />
          {/* Back panel */}
          <path d="M 140 220 L 175 165 L 210 220 Z" fill="#43371f" />
          {/* Front shaded panel */}
          <path d="M 175 165 L 175 220 L 210 220 Z" fill="#2b2318" />
          {/* Ridge pole line */}
          <line x1="175" y1="165" x2="175" y2="220" stroke="#1c160e" strokeWidth="1" />
          {/* Seam lines */}
          <line x1="175" y1="165" x2="150" y2="220" stroke="#372c19" strokeWidth="1" />
          {/* Opening */}
          <path d="M 175 200 L 166 220 L 184 220 Z" fill="#0d0b07" />
          {/* Support pole */}
          <line x1="175" y1="165" x2="175" y2="158" stroke="#2a2018" strokeWidth="2" />
        </g>

        {/* --- CAMP: survivor by the fire (always) --- */}
        <g transform="translate(0, 20)">
          <Survivor />
        </g>

        {/* --- CAMP: campfire with glow (always), right of tent --- */}
        <g transform="translate(0, 20)">
          <g filter="url(#glow)">
            <rect x="268" y="212" width="24" height="5" rx="2" fill="#2a2018" transform="rotate(12 280 214)" />
            <rect x="268" y="212" width="24" height="5" rx="2" fill="#2a2018" transform="rotate(-12 280 214)" />
            <path d="M 280 189 C 270 205, 274 214, 280 214 C 286 214, 290 205, 280 189 Z" fill="#c8641e" />
            <path d="M 280 197 C 275 206, 277 213, 280 213 C 283 213, 285 206, 280 197 Z" fill="#f0b429" />
          </g>

          {/* Warm light pool from fire */}
          <ellipse cx="280" cy="216" rx="55" ry="12" fill="#c8641e" opacity="0.14" />
        </g>
      </svg>

            <p className="base-world-stage">{stageKey.toUpperCase()}</p>
    </div>
  );
}

export default BaseWorld;