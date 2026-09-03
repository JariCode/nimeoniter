import './Survivor.css';

// Hooded survivor by the fire, scaled to 70% and colored military khaki-green.
// The transform scales around the seated base point (243,221) so the feet
// stay on the ground line. Faces right toward the fire.
function Survivor() {
  return (
    <g className="survivor">
      <g transform="translate(243,221) scale(0.7) translate(-243,-221)">
        {/* Ground shadow */}
        <ellipse cx="243" cy="221" rx="22" ry="4.5" fill="#000" opacity="0.5" />

        <g className="survivor-body">
          {/* Back leg folded */}
          <path d="M 234 221 Q 232 212 241 209 L 253 212 Q 251 217 250 221 Z" fill="#34351f" />

          {/* Front thigh + knee + shin + foot */}
          <path d="M 232 217 L 256 208 Q 260 207 261 211 L 241 221 Z" fill="#4a4b32" />
          <circle cx="258" cy="210" r="3.5" fill="#5e6040" />
          <path d="M 255 210 L 261 209 L 263 220 L 257 221 Z" fill="#34351f" />
          <path d="M 255 219 L 267 219 L 267 222 L 254 222 Z" fill="#262715" opacity="0.9" />

          {/* Torso */}
          <path d="M 231 216 Q 224 199 235 187 Q 242 184 247 189 Q 244 202 246 216 Z" fill="#4a4b32" />
          {/* Fold shadow */}
          <path d="M 240 190 Q 238 202 242 215" stroke="#34351f" strokeWidth="1.6" fill="none" opacity="0.8" />
          {/* Cool lit edge on the back */}
          <path d="M 233 189 Q 227 200 232 214" stroke="#5e6040" strokeWidth="1.4" fill="none" opacity="0.5" />

          {/* Upper arm + forearm reaching to fire */}
          <path d="M 240 192 L 252 197 L 250 201 L 238 197 Z" fill="#5e6040" />
          <path d="M 250 197 L 265 203 L 263 207 L 248 202 Z" fill="#4a4b32" />
          {/* Hand */}
          <circle cx="267" cy="205" r="2.8" fill="#6e5943" />

          {/* Head */}
          <circle cx="240" cy="178" r="8" fill="#6e5943" />
          {/* Face profile: nose + chin facing fire */}
          <path d="M 248 174 Q 250 177 248 180 L 251 182 Q 248 184 247 185 Q 249 187 245 189"
            fill="none" stroke="#2e2318" strokeWidth="1.6" opacity="0.85" />
          {/* Hood over the back of the head */}
          <path d="M 244 169 Q 229 169 230 184 Q 231 191 238 190 Q 231 179 241 169 Z" fill="#2f301c" />

          {/* Warm rim light on the fire-facing side */}
          <path d="M 246 189 Q 244 202 246 216" stroke="#f0a83a" strokeWidth="1.8" fill="none" opacity="0.7" />
          <path d="M 244 169 Q 248 171 248 174" stroke="#f0a83a" strokeWidth="1.4" fill="none" opacity="0.7" />
          {/* Brightest highlight on the face */}
          <path d="M 248 174 Q 250 177 248 180 L 251 182" stroke="#ffcf6b" strokeWidth="1.3" fill="none" opacity="0.8" />
        </g>
      </g>
    </g>
  );
}

export default Survivor;