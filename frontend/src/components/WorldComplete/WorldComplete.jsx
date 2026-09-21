import { useEffect } from 'react';
import './WorldComplete.css';

// Shown once, right when the last stage of the current world gets built.
// Worlds are nameless, so this never names the one just finished — it only
// celebrates the milestone and teases that more lies beyond it, unnamed.
// Moving into that next world still happens the normal way, through the
// Build button — this overlay only celebrates and hints, it never builds.
function WorldComplete({ onDone }) {
  // Auto-dismiss after a few seconds, same pattern as LevelUp
  useEffect(() => {
    const timer = setTimeout(onDone, 4200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="worldcomplete-overlay" onClick={onDone}>
      <div className="worldcomplete-card">
        <div className="worldcomplete-burst" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className="worldcomplete-ray" style={{ '--angle': `${i * 36}deg` }} />
          ))}
        </div>
        <p className="worldcomplete-label">WORLD COMPLETE</p>
        <p className="worldcomplete-sub">Every corner of it stands finished.</p>
        <div className="worldcomplete-horizon" aria-hidden="true" />
        <p className="worldcomplete-teaser">
          &ldquo;...something's glowing, out past the edge of what we've built.&rdquo;
        </p>
      </div>
    </div>
  );
}

export default WorldComplete;
