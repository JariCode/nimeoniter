// World-3 (space colony) holiday decorations, split out of BaseWorld.jsx
// following the same pattern as buildings/space.jsx: pure components that
// render inside BaseWorld's shared <svg>, so gradient/filter ids
// (softGlow, neonCyanGlow, glow, ...) resolve against BaseWorld's shared
// <defs>, and CSS classes (hologram-flicker, ghost-float,
// valentine-heart-float, newyear-rocket-trail, newyear-firework,
// newyear-sparkle, newyear-bubble-rise, christmas-light-glow,
// candle-flame, ...) live in BaseWorld.css.
//
// Split into three components, one per layer, so each can be dropped into
// BaseWorld at the exact spot the original inline blocks occupied:
//  - SpaceHolidaysSky: sky-layer glow/star/garland/floating decorations,
//    rendered before the BACK LAYER (buildings).
//  - SpaceHolidaysGround: ground-layer decorations sitting on the
//    landing-pad deck / beside the survivor, rendered after the buildings
//    (reactor/greenhouse) so they aren't clipped by them.
//  - SpaceHolidaysFront: the two Halloween jack-o'-lanterns tucked against
//    the NIMEONITER sign, rendered after the sign so they draw on top of
//    its panel instead of being clipped by it.
//
// The isSpace world gate and BaseWorld's shared <defs> stay in BaseWorld;
// the gate is applied at each call site (`{isSpace && <SpaceHolidaysSky
// .../>}`), so every component here only checks `holiday`.

import {
  SPACE_HALLOWEEN_GLOW, SPACE_HALLOWEEN_HOLO_WEB, SPACE_HALLOWEEN_HOLO_SKELETON,
  SPACE_HALLOWEEN_HOLO_GHOSTS, SPACE_HALLOWEEN_HOLO_PUMPKINS,
  SPACE_CHRISTMAS_GLOW, SPACE_CHRISTMAS_HOLO_STAR, SPACE_CHRISTMAS_HOLO_ELVES,
  SPACE_CHRISTMAS_HOLO_TREE, SPACE_CHRISTMAS_HOLO_LIGHTS, SPACE_CHRISTMAS_HOLO_SNOWFLAKES,
  SPACE_CHRISTMAS_HOLO_GIFTS, SPACE_CHRISTMAS_HOLO_CANDLES,
  SPACE_NEWYEAR_GLOW, SPACE_NEWYEAR_HOLO_FIREWORKS, SPACE_NEWYEAR_HOLO_SPARKLES, SPACE_NEWYEAR_HOLO_TOASTS,
  SPACE_VALENTINES_GLOW, SPACE_VALENTINES_HOLO_HEARTS_SKY, SPACE_VALENTINES_HOLO_HEARTS_GROUND,
  SPACE_VALENTINES_HOLO_ROBOT,
  SPACE_EASTER_GLOW, SPACE_EASTER_HOLO_EGGS_SKY, SPACE_EASTER_HOLO_EGGS_GROUND,
  SPACE_EASTER_HOLO_BUNNY, SPACE_EASTER_HOLO_CHICK,
} from '../../../data/spaceHolidayDecorations';

// Shared heart shape (roughly 16 wide, 18 tall), centered on its bottom
// point — same path as BaseWorld.jsx's own HEART_PATH (used there for the
// village/city Valentine's decorations). Duplicated here (rather than
// imported from BaseWorld.jsx) to avoid a circular import between the two
// files.
const HEART_PATH = 'M 0 6 C -2 3 -8 -1 -8 -6 C -8 -10 -4 -12 0 -8 C 4 -12 8 -10 8 -6 C 8 -1 2 3 0 6 Z';

// Ray angles for a firework burst (8 evenly spaced spokes radiating out) —
// same as BaseWorld.jsx's own FIREWORK_RAY_ANGLES (used there for the
// village/city fireworks). Duplicated here for the same reason as
// HEART_PATH above.
const FIREWORK_RAY_ANGLES = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);

// ===== SKY LAYER =====
// Rendered before the BACK LAYER (buildings), in the same spot the five
// inline `{isSpace && holiday === '...'}` blocks used to occupy in
// BaseWorld.jsx, interleaved among the village/city sky-layer holiday
// blocks that stayed behind.
export function SpaceHolidaysSky({ holiday }) {
  return (
    <>
      {/* ===== SPACE HALLOWEEN: sky-layer decorations (violet/green
           hologram glow) =====
           Space-only: a faint violet-green sky wash standing in for the
           village's warm orange tint and the city's violet neon tint —
           two soft blurred ellipses instead of a flat rect tint so it
           reads as drifting haze, kept clear of the background planet
           (SPACE_PLANET, x 261-349 / y 20-116). */}
      {holiday === 'halloween' && (
        <g>
          <ellipse cx="110" cy="90" rx="130" ry="80" fill={SPACE_HALLOWEEN_GLOW.violet} opacity="0.10" filter="url(#softGlow)" />
          <ellipse cx="70" cy="130" rx="100" ry="60" fill={SPACE_HALLOWEEN_GLOW.green} opacity="0.08" filter="url(#softGlow)" />
          {/* A holographic spiderweb projected in the top-left sky corner,
              the same double-stroke (blurred glow pass + crisp pass)
              technique as the city's neon web, recolored cyan and
              flickering like a projection instead of pulsing like neon.
              Kept small enough (scale 0.9) to stay clear of the floating
              ghosts, which are positioned toward the center of the sky
              for exactly this reason. */}
          <g transform={`translate(${SPACE_HALLOWEEN_HOLO_WEB.x}, ${SPACE_HALLOWEEN_HOLO_WEB.y}) scale(${SPACE_HALLOWEEN_HOLO_WEB.scale})`}>
            <circle cx="0" cy="0" r="72" fill="url(#neonCyanGlow)" opacity="0.22" />
            <g className="hologram-flicker">
              <g stroke="#3de0ff" strokeWidth="1.8" fill="none" filter="url(#softGlow)" opacity="0.7">
                <line x1="0" y1="0" x2="80" y2="14" />
                <line x1="0" y1="0" x2="72" y2="44" />
                <line x1="0" y1="0" x2="50" y2="70" />
                <line x1="0" y1="0" x2="16" y2="80" />
                <line x1="0" y1="0" x2="62" y2="56" />
                <path d="M 20 4 Q 24 22 6 24" />
                <path d="M 44 9 Q 51 40 13 47" />
                <path d="M 65 16 Q 72 58 18 69" />
              </g>
              <g stroke="#eafcff" strokeWidth="0.8" fill="none" opacity="0.9">
                <line x1="0" y1="0" x2="80" y2="14" />
                <line x1="0" y1="0" x2="72" y2="44" />
                <line x1="0" y1="0" x2="50" y2="70" />
                <line x1="0" y1="0" x2="16" y2="80" />
                <line x1="0" y1="0" x2="62" y2="56" />
                <path d="M 20 4 Q 24 22 6 24" />
                <path d="M 44 9 Q 51 40 13 47" />
                <path d="M 65 16 Q 72 58 18 69" />
              </g>
            </g>
          </g>
        </g>
      )}

      {/* ===== SPACE CHRISTMAS: sky-layer decorations (cyan/gold glow,
           star, floating lights, snowflakes) =====
           Space-only: same hologram technique as SPACE HALLOWEEN above
           (translucent fills, softGlow-filtered outlines, scan lines
           clipped to each shape, `.hologram-flicker`), in a cyan + warm
           gold palette instead of violet/green. */}
      {holiday === 'christmas' && (
        <g>
          <ellipse cx="110" cy="90" rx="130" ry="80" fill={SPACE_CHRISTMAS_GLOW.cyan} opacity="0.08" filter="url(#softGlow)" />
          <ellipse cx="70" cy="130" rx="100" ry="60" fill={SPACE_CHRISTMAS_GLOW.gold} opacity="0.07" filter="url(#softGlow)" />
          {/* Big holographic Christmas star, an 8-point burst with a soft
              glow halo underneath */}
          <g transform={`translate(${SPACE_CHRISTMAS_HOLO_STAR.x}, ${SPACE_CHRISTMAS_HOLO_STAR.y}) scale(${SPACE_CHRISTMAS_HOLO_STAR.scale})`}>
            <clipPath id="space-christmas-star-clip">
              <rect x="-20" y="-20" width="40" height="40" />
            </clipPath>
            <circle cx="0" cy="0" r="22" fill="url(#neonCyanGlow)" opacity="0.25" />
            <g className="hologram-flicker">
              <path
                d="M 0 -20 L 5 -5 L 20 0 L 5 5 L 0 20 L -5 5 L -20 0 L -5 -5 Z"
                fill={SPACE_CHRISTMAS_GLOW.gold}
                opacity="0.18"
              />
              <path
                d="M 0 -20 L 5 -5 L 20 0 L 5 5 L 0 20 L -5 5 L -20 0 L -5 -5 Z"
                fill="none"
                stroke="#eafcff"
                strokeWidth="1"
                opacity="0.85"
                filter="url(#softGlow)"
              />
              <g clipPath="url(#space-christmas-star-clip)" stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
                <line x1="-20" y1="-8" x2="20" y2="-8" />
                <line x1="-20" y1="0" x2="20" y2="0" />
                <line x1="-20" y1="8" x2="20" y2="8" />
              </g>
            </g>
          </g>
          {/* Small floating holo lights, cyan/gold alternating, twinkling
              like the village's wire-strung CHRISTMAS_LIGHTS but drifting
              free in the open sky instead of hanging from a wire */}
          {SPACE_CHRISTMAS_HOLO_LIGHTS.map((l, i) => (
            <circle
              key={i}
              cx={l.x}
              cy={l.y}
              r="3.4"
              fill={l.color}
              opacity="0.85"
              filter="url(#softGlow)"
              className="christmas-light-glow"
              style={{ animationDelay: `${l.delay}s` }}
            />
          ))}
          {/* Floating holo snowflakes, gently bobbing like the Halloween
              ghosts do */}
          {SPACE_CHRISTMAS_HOLO_SNOWFLAKES.map((s, i) => (
            <g key={i} transform={`translate(${s.x}, ${s.y}) scale(${s.scale})`}>
              <g className="ghost-float" style={{ animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}>
                <g className="hologram-flicker" stroke="#eafcff" strokeWidth="0.8" opacity="0.75" filter="url(#softGlow)">
                  <line x1="-5" y1="0" x2="5" y2="0" />
                  <line x1="0" y1="-5" x2="0" y2="5" />
                  <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" />
                  <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" />
                </g>
              </g>
            </g>
          ))}
        </g>
      )}

      {/* ===== SPACE NEW YEAR: sky-layer decorations (cyan/gold glow,
           fireworks, sparkles) =====
           Space-only: same hologram technique as SPACE HALLOWEEN/
           CHRISTMAS above (translucent fills, softGlow-filtered outlines,
           `.hologram-flicker`), reusing the village/city firework rise+
           burst animation classes (`.newyear-rocket-trail`,
           `.newyear-firework`, `.newyear-sparkle`) recolored cyan/gold. */}
      {holiday === 'newyear' && (
        <g>
          <ellipse cx="110" cy="90" rx="130" ry="80" fill={SPACE_NEWYEAR_GLOW.cyan} opacity="0.08" filter="url(#softGlow)" />
          <ellipse cx="70" cy="130" rx="100" ry="60" fill={SPACE_NEWYEAR_GLOW.gold} opacity="0.07" filter="url(#softGlow)" />
          {/* Scattered holo sparkle points */}
          {SPACE_NEWYEAR_HOLO_SPARKLES.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r="1.1"
              fill="#eafcff"
              opacity="0.9"
              filter="url(#softGlow)"
              className="newyear-sparkle"
              style={{ animationDelay: `${s.delay}s` }}
            />
          ))}
          {/* Holo fireworks: a rocket rises into each burst point, then a
              translucent ray-burst with scan lines flickers through it */}
          {SPACE_NEWYEAR_HOLO_FIREWORKS.map((f, i) => (
            <g key={i} transform={`translate(${f.x}, ${f.burstY})`}>
              <clipPath id={`space-newyear-firework-clip-${i}`}>
                <rect x="-13" y="-13" width="26" height="26" />
              </clipPath>
              <g
                className="newyear-rocket-trail"
                style={{ '--rise': `${f.rise}px`, animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
              >
                <path d="M 0 14 Q 1.5 7 0 0" fill="none" stroke={f.color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
                <circle cx="0" cy="0" r="1.3" fill="#eafcff" />
              </g>
              <g
                className="newyear-firework"
                style={{ animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
              >
                <g className="hologram-flicker">
                  {FIREWORK_RAY_ANGLES.map((a, j) => (
                    <line
                      key={j}
                      x1="0" y1="0"
                      x2={Math.cos(a) * 12}
                      y2={Math.sin(a) * 12}
                      stroke={f.color}
                      strokeWidth="1"
                      strokeLinecap="round"
                      opacity="0.75"
                      filter="url(#softGlow)"
                    />
                  ))}
                  {FIREWORK_RAY_ANGLES.map((a, j) => (
                    <circle key={j} cx={Math.cos(a) * 12} cy={Math.sin(a) * 12} r="0.8" fill={f.color} opacity="0.85" />
                  ))}
                  <circle cx="0" cy="0" r="1.6" fill="#eafcff" opacity="0.9" />
                  <g clipPath={`url(#space-newyear-firework-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.4" opacity="0.3">
                    <line x1="-13" y1="-6" x2="13" y2="-6" />
                    <line x1="-13" y1="0" x2="13" y2="0" />
                    <line x1="-13" y1="6" x2="13" y2="6" />
                  </g>
                </g>
              </g>
            </g>
          ))}
        </g>
      )}

      {/* ===== SPACE VALENTINE'S: sky-layer decorations (pink/cyan glow,
           floating hologram hearts) =====
           Space-only: same hologram technique as the other three space
           holidays above (translucent fill, `softGlow`-filtered glow
           pass, `.hologram-flicker`), reusing the village/city
           `.valentine-heart-float` rise-and-fade animation. */}
      {holiday === 'valentines' && (
        <g>
          <ellipse cx="110" cy="90" rx="130" ry="80" fill={SPACE_VALENTINES_GLOW.pink} opacity="0.08" filter="url(#softGlow)" />
          <ellipse cx="70" cy="130" rx="100" ry="60" fill={SPACE_VALENTINES_GLOW.cyan} opacity="0.07" filter="url(#softGlow)" />
          {SPACE_VALENTINES_HOLO_HEARTS_SKY.map((h, i) => (
            <g key={i} transform={`translate(${h.x}, ${h.y}) scale(0.55)`}>
              <g
                className="valentine-heart-float"
                style={{ animationDuration: `${h.duration}s`, animationDelay: `${h.delay}s` }}
              >
                <g className="hologram-flicker">
                  <path d={HEART_PATH} fill={h.color} opacity="0.22" />
                  <path d={HEART_PATH} fill="none" stroke={h.color} strokeWidth="1.2" opacity="0.8" filter="url(#softGlow)" />
                </g>
              </g>
            </g>
          ))}
        </g>
      )}

      {/* ===== SPACE EASTER: sky-layer decorations (pastel/cyan glow,
           floating hologram eggs) =====
           Space-only: same hologram technique as the other three space
           holidays above, reusing the village's egg-shape path and the
           `.ghost-float` gentle bob (already reduced-motion-safe). */}
      {holiday === 'easter' && (
        <g>
          <ellipse cx="110" cy="90" rx="130" ry="80" fill={SPACE_EASTER_GLOW.pastel} opacity="0.08" filter="url(#softGlow)" />
          <ellipse cx="70" cy="130" rx="100" ry="60" fill={SPACE_EASTER_GLOW.cyan} opacity="0.07" filter="url(#softGlow)" />
          {SPACE_EASTER_HOLO_EGGS_SKY.map((e, i) => (
            <g key={i} transform={`translate(${e.x}, ${e.y}) scale(0.7)`}>
              <g
                className="ghost-float"
                style={{ animationDuration: `${e.duration}s`, animationDelay: `${e.delay}s` }}
              >
                <g className="hologram-flicker">
                  <path d="M 0 -8 C 4 -8 5 -2 5 2 C 5 6 2.5 8 0 8 C -2.5 8 -5 6 -5 2 C -5 -2 -4 -8 0 -8 Z" fill={e.color} opacity="0.22" />
                  <path d="M 0 -8 C 4 -8 5 -2 5 2 C 5 6 2.5 8 0 8 C -2.5 8 -5 6 -5 2 C -5 -2 -4 -8 0 -8 Z" fill="none" stroke={e.color} strokeWidth="1" opacity="0.85" filter="url(#softGlow)" />
                </g>
              </g>
            </g>
          ))}
        </g>
      )}
    </>
  );
}

// ===== GROUND LAYER =====
// Rendered after the buildings (reactor/greenhouse), in the same spot the
// twelve inline `{isSpace && holiday === '...'}` blocks used to occupy in
// BaseWorld.jsx — a single contiguous run, not interleaved with any
// village/city block.
export function SpaceHolidaysGround({ holiday }) {
  return (
    <>
      {/* ===== SPACE CHRISTMAS: holo elves on the landing-pad deck =====
           Recognizable elf silhouette (pointed hat with pompom, round
           head, tunic, legs) reused from the village/city elves, recolored
           as a translucent cyan hologram with a warm holo-red hat accent,
           scan lines clipped to the figure, wrapped in `.hologram-flicker`.
           Drawn after the reactor so the two over its footprint sit in
           front of it rather than behind. */}
      {holiday === 'christmas' && SPACE_CHRISTMAS_HOLO_ELVES.map((e, i) => (
        <g key={i} transform={`translate(${e.x}, ${e.y}) scale(${e.scale})`}>
          <clipPath id={`space-christmas-elf-clip-${i}`}>
            <rect x="-8" y="-30" width="16" height="32" />
          </clipPath>
          <g className="hologram-flicker">
            {/* legs */}
            <rect x="-2.6" y="-8" width="2" height="8" rx="0.8" fill="#3de0ff" opacity="0.15" />
            <rect x="0.6" y="-8" width="2" height="8" rx="0.8" fill="#3de0ff" opacity="0.15" />
            <rect x="-2.6" y="-8" width="2" height="8" rx="0.8" fill="none" stroke="#8fe0ff" strokeWidth="0.5" opacity="0.6" />
            <rect x="0.6" y="-8" width="2" height="8" rx="0.8" fill="none" stroke="#8fe0ff" strokeWidth="0.5" opacity="0.6" />
            {/* tunic */}
            <path d="M -3.2 -8 Q 0 -6.4 3.2 -8 L 3 -16 Q 0 -17.4 -3 -16 Z" fill="#3de0ff" opacity="0.14" />
            <path d="M -3.2 -8 Q 0 -6.4 3.2 -8 L 3 -16 Q 0 -17.4 -3 -16 Z" fill="none" stroke="#8fe0ff" strokeWidth="0.7" opacity="0.75" filter="url(#softGlow)" />
            {/* arms */}
            <path d="M -3 -15 Q -6.5 -13 -6 -9" fill="none" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
            <path d="M 3 -15 Q 6.5 -13 6 -9" fill="none" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
            {/* head */}
            <circle cx="0" cy="-19" r="3.4" fill="#3de0ff" opacity="0.14" />
            <circle cx="0" cy="-19" r="3.4" fill="none" stroke="#eafcff" strokeWidth="0.7" opacity="0.8" />
            <circle cx="-1.2" cy="-19.4" r="0.5" fill="#eafcff" opacity="0.9" />
            <circle cx="1.2" cy="-19.4" r="0.5" fill="#eafcff" opacity="0.9" />
            {/* pointed hat, warm holo-red accent so the elf reads apart
                from the cyan-only decorations */}
            <path d="M -3.6 -21 Q -1 -29 5 -25 Q 1.5 -25.6 -1 -23.6 Q -2.6 -22.2 -3.6 -21 Z" fill="#ff6a4a" opacity="0.2" />
            <path d="M -3.6 -21 Q -1 -29 5 -25 Q 1.5 -25.6 -1 -23.6 Q -2.6 -22.2 -3.6 -21 Z" fill="none" stroke="#ff9a7a" strokeWidth="0.8" opacity="0.85" filter="url(#softGlow)" />
            <circle cx="5" cy="-25" r="1.1" fill="#eafcff" opacity="0.9" />
            {/* scan lines clipped to the figure's bounding box */}
            <g clipPath={`url(#space-christmas-elf-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
              <line x1="-8" y1="-24" x2="8" y2="-24" />
              <line x1="-8" y1="-16" x2="8" y2="-16" />
              <line x1="-8" y1="-8" x2="8" y2="-8" />
              <line x1="-8" y1="0" x2="8" y2="0" />
            </g>
          </g>
        </g>
      ))}

      {/* ===== SPACE CHRISTMAS: holo Christmas tree on the landing-pad
           deck ===== Same three-tier tree/ornaments/star shape as the
           village's CHRISTMAS_TREES, recolored as a translucent cyan
           hologram with warm gold holo ornaments. Sits over the reactor's
           footprint, pushed forward to clear its solid housing, kept
           clear of the elf beside it (x 350). */}
      {holiday === 'christmas' && SPACE_CHRISTMAS_HOLO_TREE.map((t, i) => (
        <g key={i} transform={`translate(${t.x}, ${t.y}) scale(${t.scale})`}>
          <clipPath id={`space-christmas-tree-clip-${i}`}>
            <rect x="-9" y="-27" width="18" height="27" />
          </clipPath>
          <g className="hologram-flicker">
            <rect x="-1.5" y="-4" width="3" height="4" fill="#3de0ff" opacity="0.3" />
            <path d="M -9 -4 L 0 -14 L 9 -4 Z" fill="#3de0ff" opacity="0.12" />
            <path d="M -7 -10 L 0 -19 L 7 -10 Z" fill="#3de0ff" opacity="0.12" />
            <path d="M -5 -15 L 0 -23 L 5 -15 Z" fill="#3de0ff" opacity="0.12" />
            <path d="M -9 -4 L 0 -14 L 9 -4 Z" fill="none" stroke="#8fe0ff" strokeWidth="0.8" opacity="0.7" filter="url(#softGlow)" />
            <path d="M -7 -10 L 0 -19 L 7 -10 Z" fill="none" stroke="#8fe0ff" strokeWidth="0.8" opacity="0.7" />
            <path d="M -5 -15 L 0 -23 L 5 -15 Z" fill="none" stroke="#8fe0ff" strokeWidth="0.8" opacity="0.7" />
            {/* ornaments — warm gold holo dots */}
            <circle cx="-4" cy="-6" r="1" fill="#f0c14a" opacity="0.9" />
            <circle cx="4" cy="-7" r="1" fill="#f0c14a" opacity="0.9" />
            <circle cx="-3" cy="-12" r="0.9" fill="#f0c14a" opacity="0.9" />
            <circle cx="3" cy="-13" r="0.9" fill="#f0c14a" opacity="0.9" />
            <circle cx="0" cy="-17" r="0.8" fill="#f0c14a" opacity="0.9" />
            {/* star on top */}
            <path
              d="M 0 -27 L 1.1 -24.3 L 4 -24 L 1.8 -22 L 2.4 -19.2 L 0 -20.7 L -2.4 -19.2 L -1.8 -22 L -4 -24 L -1.1 -24.3 Z"
              fill="#eafcff"
              opacity="0.9"
              filter="url(#softGlow)"
            />
            {/* scan lines clipped to the tree's bounding box */}
            <g clipPath={`url(#space-christmas-tree-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
              <line x1="-9" y1="-20" x2="9" y2="-20" />
              <line x1="-9" y1="-12" x2="9" y2="-12" />
              <line x1="-9" y1="-4" x2="9" y2="-4" />
            </g>
          </g>
        </g>
      ))}

      {/* ===== SPACE CHRISTMAS: holo gift boxes ===== Same box/ribbon/bow
           shape as the village's CHRISTMAS_GIFTS, recolored as a
           translucent cyan hologram with warm gold holo ribbon — small
           enough to tuck in at the foot of the tree/beside the corner elf
           without needing their own forward push to clear a building. */}
      {holiday === 'christmas' && SPACE_CHRISTMAS_HOLO_GIFTS.map((g, i) => (
        <g key={i} transform={`translate(${g.x}, ${g.y}) scale(${g.scale})`}>
          <g className="hologram-flicker">
            <rect x="-4" y="-6" width="8" height="6" rx="0.6" fill="#3de0ff" opacity="0.14" />
            <rect x="-4" y="-6" width="8" height="6" rx="0.6" fill="none" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.7" filter="url(#softGlow)" />
            <rect x="-1" y="-6" width="2" height="6" fill="#f0c14a" opacity="0.8" />
            <rect x="-4" y="-3.5" width="8" height="1.5" fill="#f0c14a" opacity="0.8" />
            <path d="M -2.2 -6 Q -3.2 -8 -0.6 -7.4 Z" fill="#f0c14a" opacity="0.85" />
            <path d="M 2.2 -6 Q 3.2 -8 0.6 -7.4 Z" fill="#f0c14a" opacity="0.85" />
          </g>
        </g>
      ))}

      {/* ===== SPACE CHRISTMAS: holo candles ===== Same wax-body shape as
           the village's HALLOWEEN_CANDLES/CHRISTMAS_CANDLES, recolored as
           a translucent cyan hologram with a warm gold flame (kept as the
           existing `.candle-flame` flicker rather than the hologram one,
           so it still reads as a flame). */}
      {holiday === 'christmas' && SPACE_CHRISTMAS_HOLO_CANDLES.map((c, i) => (
        <g key={i} transform={`translate(${c.x}, ${c.y}) scale(${c.scale})`}>
          <g className="hologram-flicker">
            <rect x="-1.6" y="-6" width="3.2" height="6" rx="0.6" fill="#3de0ff" opacity="0.16" />
            <rect x="-1.6" y="-6" width="3.2" height="6" rx="0.6" fill="none" stroke="#8fe0ff" strokeWidth="0.5" opacity="0.7" />
            <ellipse cx="0" cy="-6" rx="1.6" ry="0.6" fill="#eafcff" opacity="0.4" />
          </g>
          <path
            className="candle-flame"
            style={{ animationDelay: `${c.delay}s` }}
            d="M 0 -7.2 C 1.4 -8.6 1.2 -10.4 0 -11.6 C -1.2 -10.4 -1.4 -8.6 0 -7.2 Z"
            fill="#f0c14a"
            opacity="0.85"
            filter="url(#softGlow)"
          />
        </g>
      ))}

      {/* ===== SPACE NEW YEAR: holo champagne toasts ===== Same bottle +
           two clinking flutes shape as the village's NEWYEAR_TOASTS,
           recolored as a translucent cyan hologram with warm gold accents
           (cork, cap), scan lines clipped to the bounding box, wrapped in
           `.hologram-flicker`, plus a few rising `.newyear-bubble-rise`
           bubbles off the bottle neck. Drawn after every building so
           it's never clipped by the greenhouse/reactor it sits over. */}
      {holiday === 'newyear' && SPACE_NEWYEAR_HOLO_TOASTS.map((t, i) => (
        <g key={i} transform={`translate(${t.x}, ${t.y}) scale(${t.scale})`}>
          <clipPath id={`space-newyear-toast-clip-${i}`}>
            <rect x="-9" y="-28" width="25" height="28" />
          </clipPath>
          <g className="hologram-flicker">
            {/* Two clinking flutes: only on the toast(s) that keep them
                (`glasses !== false`) — a whole row of toasts all clinking
                glasses read as too busy, so most of this set is bottle-only. */}
            {t.glasses !== false && (
              <>
                {/* left flute */}
                <line x1="-6" y1="0" x2="-5" y2="-9" stroke="#8fe0ff" strokeWidth="1" opacity="0.7" />
                <ellipse cx="-6" cy="0" rx="2" ry="0.7" fill="#3de0ff" opacity="0.3" />
                <path d="M -7.2 -9 L -2.8 -9 L -3.6 -16.5 L -6.4 -15.5 Z" fill="#3de0ff" opacity="0.16" stroke="#8fe0ff" strokeWidth="0.6" />
                {/* right flute */}
                <line x1="4" y1="0" x2="3" y2="-9" stroke="#8fe0ff" strokeWidth="1" opacity="0.7" />
                <ellipse cx="4" cy="0" rx="2" ry="0.7" fill="#3de0ff" opacity="0.3" />
                <path d="M 2.8 -9 L 7.2 -9 L 6.4 -16.5 L 3.6 -16.5 Z" fill="#3de0ff" opacity="0.16" stroke="#8fe0ff" strokeWidth="0.6" />
                {/* clink spark, right where the two rims almost meet */}
                <path
                  d="M 0 -17.6 L 0.5 -16.3 L 1.8 -16 L 0.5 -15.7 L 0 -14.4 L -0.5 -15.7 L -1.8 -16 L -0.5 -16.3 Z"
                  fill="#eafcff"
                  className="newyear-sparkle"
                  style={{ animationDelay: '0.4s' }}
                />
              </>
            )}
            {/* champagne bottle, standing to the right */}
            <rect x="9" y="-18" width="5" height="15" rx="1" fill="#3de0ff" opacity="0.16" />
            <rect x="9" y="-18" width="5" height="15" rx="1" fill="none" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.7" filter="url(#softGlow)" />
            <rect x="10.3" y="-23" width="2.4" height="6" fill="#3de0ff" opacity="0.2" />
            <rect x="10" y="-24.5" width="3" height="2" fill="#f0c14a" opacity="0.85" />
            {/* cork-pop sparkle */}
            <path
              d="M 11.5 -25 L 11.9 -27.4 L 12.3 -25 L 14.5 -25.6 L 12.6 -24.4 L 14 -22.8 L 11.9 -23.7 L 11.5 -21.4 L 11.1 -23.7 L 9 -22.8 L 10.4 -24.4 L 8.5 -25.6 Z"
              fill="#f0c14a"
              className="newyear-sparkle"
              style={{ animationDelay: '0s' }}
            />
            {/* rising, fading bubbles above the bottle neck */}
            <circle className="newyear-bubble-rise" cx="11.5" cy="-25" r="0.6" fill="#8fe0ff" style={{ animationDelay: '0s' }} />
            <circle className="newyear-bubble-rise" cx="10.5" cy="-25" r="0.5" fill="#8fe0ff" style={{ animationDelay: '0.6s' }} />
            <circle className="newyear-bubble-rise" cx="12.5" cy="-25" r="0.45" fill="#8fe0ff" style={{ animationDelay: '1.2s' }} />
            {/* scan lines clipped to the toast's bounding box */}
            <g clipPath={`url(#space-newyear-toast-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
              <line x1="-9" y1="-22" x2="16" y2="-22" />
              <line x1="-9" y1="-14" x2="16" y2="-14" />
              <line x1="-9" y1="-6" x2="16" y2="-6" />
            </g>
          </g>
        </g>
      ))}

      {/* ===== SPACE VALENTINE'S: holo hearts on the landing-pad deck =====
           Same HEART_PATH shape the sky-layer hearts above use, larger
           and grounded rather than floating, wrapped in
           `.hologram-flicker` with scan lines clipped to the heart's own
           silhouette. Drawn after the buildings so it's never clipped by
           the greenhouse/reactor it sits over. */}
      {holiday === 'valentines' && SPACE_VALENTINES_HOLO_HEARTS_GROUND.map((h, i) => (
        <g key={i} transform={`translate(${h.x}, ${h.y}) scale(${h.scale})`}>
          <clipPath id={`space-valentines-heart-clip-${i}`}>
            <rect x="-8" y="-12" width="16" height="18" />
          </clipPath>
          <g className="hologram-flicker">
            <path d={HEART_PATH} fill="#ff6ab0" opacity="0.18" />
            <path d={HEART_PATH} fill="none" stroke="#ff9ac8" strokeWidth="1" opacity="0.8" filter="url(#softGlow)" />
            <g clipPath={`url(#space-valentines-heart-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
              <line x1="-8" y1="-4" x2="8" y2="-4" />
              <line x1="-8" y1="0" x2="8" y2="0" />
              <line x1="-8" y1="4" x2="8" y2="4" />
            </g>
          </g>
        </g>
      ))}

      {/* ===== SPACE VALENTINE'S: holo robot companion beside the
           survivor ===== A small, clearly-readable friendly robot — round
           head with antenna, boxy body, stub arms, a tiny held heart —
           recolored as a translucent cyan hologram with a pink/magenta
           chest light and heart accent. Stands beside the survivor, not
           on top of it (see SPACE_VALENTINES_HOLO_ROBOT for the
           clearance math), drawn after the buildings for the same reason
           as the hearts above. */}
      {holiday === 'valentines' && SPACE_VALENTINES_HOLO_ROBOT.map((r, i) => (
        <g key={i} transform={`translate(${r.x}, ${r.y}) scale(${r.scale})`}>
          <clipPath id={`space-valentines-robot-clip-${i}`}>
            <rect x="-9" y="-26" width="27" height="26" />
          </clipPath>
          <g className="hologram-flicker">
            {/* base/feet */}
            <ellipse cx="0" cy="0" rx="4" ry="1.5" fill="#3de0ff" opacity="0.15" />
            <rect x="-3" y="-3" width="2.4" height="3" rx="1" fill="#3de0ff" opacity="0.18" />
            <rect x="0.6" y="-3" width="2.4" height="3" rx="1" fill="#3de0ff" opacity="0.18" />
            {/* boxy body */}
            <rect x="-5" y="-14" width="10" height="11" rx="2" fill="#3de0ff" opacity="0.16" />
            <rect x="-5" y="-14" width="10" height="11" rx="2" fill="none" stroke="#8fe0ff" strokeWidth="0.7" opacity="0.8" filter="url(#softGlow)" />
            {/* chest light */}
            <circle cx="0" cy="-8" r="1.4" fill="#ff6ab0" opacity="0.85" />
            {/* stub arms */}
            <line x1="-5" y1="-10" x2="-8.5" y2="-6" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
            <line x1="5" y1="-10" x2="8" y2="-8" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
            {/* round head with two eye dots */}
            <circle cx="0" cy="-18" r="4.4" fill="#3de0ff" opacity="0.16" />
            <circle cx="0" cy="-18" r="4.4" fill="none" stroke="#eafcff" strokeWidth="0.7" opacity="0.85" />
            <circle cx="-1.6" cy="-18.5" r="0.8" fill="#eafcff" opacity="0.95" />
            <circle cx="1.6" cy="-18.5" r="0.8" fill="#eafcff" opacity="0.95" />
            {/* antenna */}
            <line x1="0" y1="-22.4" x2="0" y2="-25" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.7" />
            <circle cx="0" cy="-25" r="0.9" fill="#ff6ab0" opacity="0.9" />
            {/* held heart, out in front of the body where it reads clearly
                rather than tucked in against the arm */}
            <path d={HEART_PATH} transform="translate(-9, 7) scale(0.65)" fill="#ff6ab0" opacity="0.95" filter="url(#softGlow)" />
            <path d={HEART_PATH} transform="translate(-9, 7) scale(0.65)" fill="none" stroke="#ffc2e0" strokeWidth="0.6" opacity="0.9" />
            {/* scan lines clipped to the robot's bounding box */}
            <g clipPath={`url(#space-valentines-robot-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
              <line x1="-9" y1="-18" x2="11" y2="-18" />
              <line x1="-9" y1="-11" x2="11" y2="-11" />
              <line x1="-9" y1="-4" x2="11" y2="-4" />
            </g>
          </g>
        </g>
      ))}

      {/* ===== SPACE EASTER: holo eggs on the landing-pad deck ===== Same
           egg-shape path the sky-layer eggs above use, wrapped in
           `.hologram-flicker` with scan lines clipped to the egg's own
           silhouette. Drawn after the buildings so it's never clipped by
           the greenhouse/reactor it sits over. */}
      {holiday === 'easter' && SPACE_EASTER_HOLO_EGGS_GROUND.map((e, i) => (
        <g key={i} transform={`translate(${e.x}, ${e.y}) scale(${e.scale})`}>
          <clipPath id={`space-easter-egg-clip-${i}`}>
            <rect x="-5" y="-8" width="10" height="16" />
          </clipPath>
          <g className="hologram-flicker">
            <path d="M 0 -8 C 4 -8 5 -2 5 2 C 5 6 2.5 8 0 8 C -2.5 8 -5 6 -5 2 C -5 -2 -4 -8 0 -8 Z" fill={e.color} opacity="0.3" />
            <path d="M 0 -8 C 4 -8 5 -2 5 2 C 5 6 2.5 8 0 8 C -2.5 8 -5 6 -5 2 C -5 -2 -4 -8 0 -8 Z" fill="none" stroke="#8fe0ff" strokeWidth="0.8" opacity="0.8" filter="url(#softGlow)" />
            <g clipPath={`url(#space-easter-egg-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
              <line x1="-5" y1="-3" x2="5" y2="-3" />
              <line x1="-5" y1="1" x2="5" y2="1" />
              <line x1="-5" y1="5" x2="5" y2="5" />
            </g>
          </g>
        </g>
      ))}

      {/* ===== SPACE EASTER: holo bunny companion beside the survivor =====
           Same recognizable bunny shape (tail, body, ears, face) as the
           village's EASTER_BUNNIES, recolored as a translucent cyan
           hologram with pastel-pink inner-ear accents, scan lines clipped
           to the bounding box, wrapped in `.hologram-flicker`. Stands
           beside the survivor at the same corrected ground level (y 241)
           the Valentine's robot uses — see SPACE_VALENTINES_HOLO_ROBOT for
           the clearance math, which applies identically here. */}
      {holiday === 'easter' && SPACE_EASTER_HOLO_BUNNY.map((b, i) => (
        <g key={i} transform={`translate(${b.x}, ${b.y}) scale(${b.scale})`}>
          <clipPath id={`space-easter-bunny-clip-${i}`}>
            <rect x="-8" y="-30" width="16" height="30" />
          </clipPath>
          <g className="hologram-flicker">
            {/* tail */}
            <circle cx="-5.5" cy="-2" r="2" fill="#3de0ff" opacity="0.2" />
            {/* body */}
            <ellipse cx="0" cy="-7" rx="6" ry="7.5" fill="#3de0ff" opacity="0.16" />
            <ellipse cx="0" cy="-7" rx="6" ry="7.5" fill="none" stroke="#8fe0ff" strokeWidth="0.7" opacity="0.8" filter="url(#softGlow)" />
            {/* front paws */}
            <ellipse cx="-3" cy="-1.2" rx="1.8" ry="1.3" fill="#3de0ff" opacity="0.16" />
            <ellipse cx="3" cy="-1.2" rx="1.8" ry="1.3" fill="#3de0ff" opacity="0.16" />
            {/* ears, standing up */}
            <ellipse cx="-2.3" cy="-23" rx="1.6" ry="7" fill="#3de0ff" opacity="0.16" transform="rotate(-12 -2.3 -23)" />
            <ellipse cx="2.3" cy="-23" rx="1.6" ry="7" fill="#3de0ff" opacity="0.16" transform="rotate(12 2.3 -23)" />
            <ellipse cx="-2.3" cy="-23" rx="1.6" ry="7" fill="none" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.75" transform="rotate(-12 -2.3 -23)" />
            <ellipse cx="2.3" cy="-23" rx="1.6" ry="7" fill="none" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.75" transform="rotate(12 2.3 -23)" />
            <ellipse cx="-2.3" cy="-22" rx="0.8" ry="4.6" fill="#ff9ac8" opacity="0.6" transform="rotate(-12 -2.3 -22)" />
            <ellipse cx="2.3" cy="-22" rx="0.8" ry="4.6" fill="#ff9ac8" opacity="0.6" transform="rotate(12 2.3 -22)" />
            {/* head */}
            <circle cx="0" cy="-15.5" r="4.6" fill="#3de0ff" opacity="0.16" />
            <circle cx="0" cy="-15.5" r="4.6" fill="none" stroke="#eafcff" strokeWidth="0.7" opacity="0.85" />
            {/* face */}
            <circle cx="-1.6" cy="-15.5" r="0.6" fill="#eafcff" opacity="0.95" />
            <circle cx="1.6" cy="-15.5" r="0.6" fill="#eafcff" opacity="0.95" />
            <path d="M -0.6 -13.8 L 0.6 -13.8 L 0 -13 Z" fill="#ff9ac8" opacity="0.9" />
            {/* scan lines clipped to the bunny's bounding box */}
            <g clipPath={`url(#space-easter-bunny-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
              <line x1="-8" y1="-22" x2="8" y2="-22" />
              <line x1="-8" y1="-14" x2="8" y2="-14" />
              <line x1="-8" y1="-6" x2="8" y2="-6" />
            </g>
          </g>
        </g>
      ))}

      {/* ===== SPACE EASTER: holo chick beside the survivor's gap =====
           Same recognizable chick shape (round fluffy body, wings, head
           tuft, eyes, beak) as the city's CITY_EASTER_NEON_CHICK,
           recolored as a translucent cyan hologram with a pastel-yellow
           body accent, scan lines clipped to the bounding box, wrapped in
           `.hologram-flicker`. */}
      {holiday === 'easter' && SPACE_EASTER_HOLO_CHICK.map((c, i) => (
        <g key={i} transform={`translate(${c.x}, ${c.y}) scale(${c.scale})`}>
          <clipPath id={`space-easter-chick-clip-${i}`}>
            <rect x="-8" y="-19" width="16" height="21" />
          </clipPath>
          <g className="hologram-flicker">
            {/* legs and feet */}
            <line x1="-2" y1="0" x2="-2" y2="-3" stroke="#8fe0ff" strokeWidth="0.9" opacity="0.7" />
            <line x1="2" y1="0" x2="2" y2="-3" stroke="#8fe0ff" strokeWidth="0.9" opacity="0.7" />
            {/* wings */}
            <ellipse cx="-6" cy="-8" rx="2" ry="3.2" fill="#3de0ff" opacity="0.18" transform="rotate(-20 -6 -8)" />
            <ellipse cx="6" cy="-8" rx="2" ry="3.2" fill="#3de0ff" opacity="0.18" transform="rotate(20 6 -8)" />
            {/* round fluffy body */}
            <ellipse cx="0" cy="-9" rx="6.5" ry="6" fill="#fff0a8" opacity="0.2" />
            <ellipse cx="0" cy="-9" rx="6.5" ry="6" fill="none" stroke="#8fe0ff" strokeWidth="0.7" opacity="0.8" filter="url(#softGlow)" />
            {/* head fluff tuft */}
            <path d="M -1.2 -15.5 Q 0 -18.5 1.2 -15.5" fill="none" stroke="#8fe0ff" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
            {/* eyes */}
            <circle cx="-2.2" cy="-11" r="0.8" fill="#eafcff" opacity="0.9" />
            <circle cx="2.2" cy="-11" r="0.8" fill="#eafcff" opacity="0.9" />
            {/* beak */}
            <path d="M -1.6 -9 L 0 -7.5 L 1.6 -9 Z" fill="#ff9a4a" opacity="0.85" />
            {/* scan lines clipped to the chick's bounding box */}
            <g clipPath={`url(#space-easter-chick-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
              <line x1="-8" y1="-14" x2="8" y2="-14" />
              <line x1="-8" y1="-9" x2="8" y2="-9" />
              <line x1="-8" y1="-4" x2="8" y2="-4" />
            </g>
          </g>
        </g>
      ))}

      {/* ===== SPACE HALLOWEEN: floating holo ghosts (up in the sky) =====
           Same ghost silhouette and `.ghost-float` bob as the village's
           HALLOWEEN_GHOSTS, recolored as translucent holograms — a low-
           opacity fill pass plus a `softGlow`-filtered outline pass, each
           wrapped in `.hologram-flicker` for the unstable-projection
           flicker, with a few horizontal scan lines clipped to the
           ghost's own silhouette. One cyan/violet/green per ghost so the
           trio reads as separate projections. Rendered here (after the
           buildings) purely for code proximity to the other Halloween
           decorations — their sky position means draw order relative to
           the buildings no longer matters, same as the city's version. */}
      {holiday === 'halloween' && SPACE_HALLOWEEN_HOLO_GHOSTS.map((g, i) => (
        <g key={i} transform={`translate(${g.x}, ${g.y}) scale(${g.scale})`}>
          <clipPath id={`space-halloween-ghost-clip-${i}`}>
            <rect x="-8" y="-19" width="16" height="26" />
          </clipPath>
          <g
            className="ghost-float"
            style={{ animationDuration: `${g.duration}s`, animationDelay: `${g.delay}s` }}
          >
            <g className="hologram-flicker">
              <path
                d="M -7 -4 C -7 -13, -4 -18, 0 -18 C 4 -18, 7 -13, 7 -4 L 7 5
                   C 7 5, 5.5 2, 4 5 C 2.5 8, 1 3, 0 6
                   C -1 3, -2.5 8, -4 5 C -5.5 2, -7 5, -7 5 Z"
                fill={g.color}
                opacity="0.18"
              />
              <path
                d="M -7 -4 C -7 -13, -4 -18, 0 -18 C 4 -18, 7 -13, 7 -4 L 7 5
                   C 7 5, 5.5 2, 4 5 C 2.5 8, 1 3, 0 6
                   C -1 3, -2.5 8, -4 5 C -5.5 2, -7 5, -7 5 Z"
                fill="none"
                stroke={g.color}
                strokeWidth="1"
                opacity="0.75"
                filter="url(#softGlow)"
              />
              <ellipse cx="-2.5" cy="-8" rx="1" ry="1.3" fill={g.color} opacity="0.9" />
              <ellipse cx="2.5" cy="-8" rx="1" ry="1.3" fill={g.color} opacity="0.9" />
              <g clipPath={`url(#space-halloween-ghost-clip-${i})`} stroke={g.color} strokeWidth="0.5" opacity="0.35">
                <line x1="-8" y1="-15" x2="8" y2="-15" />
                <line x1="-8" y1="-9" x2="8" y2="-9" />
                <line x1="-8" y1="-3" x2="8" y2="-3" />
                <line x1="-8" y1="3" x2="8" y2="3" />
              </g>
            </g>
          </g>
        </g>
      ))}

      {/* ===== SPACE HALLOWEEN: holo skeleton on the landing-pad deck =====
           Same skull/ribcage/limb shapes as the village's
           HALLOWEEN_SKELETONS, recolored as a translucent cyan hologram
           instead of solid bone — low-opacity fills/strokes, a
           `softGlow`-filtered skull outline, and horizontal scan lines
           clipped to the figure's bounding box, all wrapped in
           `.hologram-flicker`. Drawn after the buildings so it isn't
           clipped by anything in the left cluster. */}
      {holiday === 'halloween' && SPACE_HALLOWEEN_HOLO_SKELETON.map((sk, i) => (
        <g key={i} transform={`translate(${sk.x}, ${sk.y}) scale(${sk.scale})`}>
          <clipPath id={`space-halloween-skeleton-clip-${i}`}>
            <rect x="-10" y="-13" width="20" height="21" />
          </clipPath>
          <g className="hologram-flicker">
            {/* faint ground glow — a hologram casts light, not shadow */}
            <ellipse cx="0" cy="5" rx="10" ry="2" fill="#3de0ff" opacity="0.12" />
            {/* skull */}
            <circle cx="0" cy="-10" r="4" fill="#3de0ff" opacity="0.14" />
            <circle cx="0" cy="-10" r="4" fill="none" stroke="#8fe0ff" strokeWidth="0.8" opacity="0.8" filter="url(#softGlow)" />
            <circle cx="-1.4" cy="-10.5" r="0.7" fill="#eafcff" opacity="0.9" />
            <circle cx="1.4" cy="-10.5" r="0.7" fill="#eafcff" opacity="0.9" />
            {/* ribcage */}
            <path d="M -3 -6 L -3.5 2 L 3.5 2 L 3 -6 Z" fill="#3de0ff" opacity="0.1" />
            <path d="M -3 -6 L -3.5 2 L 3.5 2 L 3 -6 Z" fill="none" stroke="#8fe0ff" strokeWidth="0.8" opacity="0.8" />
            <line x1="-2.6" y1="-4" x2="2.6" y2="-4" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.6" />
            <line x1="-2.8" y1="-2" x2="2.8" y2="-2" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.6" />
            <line x1="-3" y1="0" x2="3" y2="0" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.6" />
            {/* arms resting on the ground */}
            <line x1="-3" y1="-5" x2="-7" y2="2" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            <line x1="3" y1="-5" x2="6" y2="1" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            {/* legs, sitting pose */}
            <line x1="-2" y1="2" x2="-6" y2="5" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            <line x1="-6" y1="5" x2="-9" y2="4" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            <line x1="2" y1="2" x2="7" y2="4" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            {/* scan lines clipped to the figure's bounding box */}
            <g clipPath={`url(#space-halloween-skeleton-clip-${i})`} stroke="#eafcff" strokeWidth="0.5" opacity="0.3">
              <line x1="-10" y1="-9" x2="10" y2="-9" />
              <line x1="-10" y1="-4" x2="10" y2="-4" />
              <line x1="-10" y1="1" x2="10" y2="1" />
              <line x1="-10" y1="6" x2="10" y2="6" />
            </g>
          </g>
        </g>
      ))}
    </>
  );
}

// ===== FRONT LAYER (after the NIMEONITER sign) =====
// Rendered after the sign, in the same spot the inline
// `{isSpace && holiday === 'halloween'}` block used to occupy in
// BaseWorld.jsx — deliberately placed there (rather than alongside the
// rest of the Halloween decorations above) so the two pumpkins tucked in
// right against the sign's edge render on top of its panel instead of
// being clipped by it.
export function SpaceHolidaysFront({ holiday }) {
  return (
    <>
      {/* ===== SPACE HALLOWEEN: holo jack-o'-lanterns on the landing-pad
           deck ===== Same body/stalk/carved-face shapes as the village's
           HALLOWEEN_PUMPKINS, recolored as translucent cyan holograms
           with scan lines clipped to the body, wrapped in
           `.hologram-flicker`. Drawn after the NIMEONITER sign (rather
           than right after the reactor, where the rest of this file's
           other Halloween decorations sit) so the two pumpkins tucked in
           right against the sign's edge render on top of its panel
           instead of being clipped by it. */}
      {holiday === 'halloween' && SPACE_HALLOWEEN_HOLO_PUMPKINS.map((p, i) => (
        <g key={i} transform={`translate(${p.x}, ${p.y}) scale(${p.scale})`}>
          <clipPath id={`space-halloween-pumpkin-clip-${i}`}>
            <rect x="-10" y="-12" width="20" height="20" />
          </clipPath>
          <g className="hologram-flicker">
            <rect x="-1.5" y="-11" width="3" height="4" rx="1" fill="#3de0ff" opacity="0.4" />
            <ellipse cx="0" cy="0" rx="9" ry="7" fill="#3de0ff" opacity="0.14" />
            <ellipse cx="0" cy="0" rx="9" ry="7" fill="none" stroke="#8fe0ff" strokeWidth="1" opacity="0.7" filter="url(#softGlow)" />
            <path d="M -5 -2 L -2 -2 L -3.5 1 Z" fill="#eafcff" opacity="0.9" />
            <path d="M 5 -2 L 2 -2 L 3.5 1 Z" fill="#eafcff" opacity="0.9" />
            <path d="M -4 3 L -2 5 L 0 3 L 2 5 L 4 3 L 3 4.5 L -3 4.5 Z" fill="#eafcff" opacity="0.9" />
            <g clipPath={`url(#space-halloween-pumpkin-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
              <line x1="-10" y1="-7" x2="10" y2="-7" />
              <line x1="-10" y1="-2" x2="10" y2="-2" />
              <line x1="-10" y1="3" x2="10" y2="3" />
            </g>
          </g>
        </g>
      ))}
    </>
  );
}
