import { useEffect } from 'react';
import './LevelUp.css';

function LevelUp({ level, onDone }) {
  // Auto-dismiss after a few seconds
  useEffect(() => {
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="levelup-overlay" onClick={onDone}>
      <div className="levelup-card">
        <p className="levelup-label">LEVEL UP</p>
        <p className="levelup-number">{level}</p>
        <p className="levelup-sub">Your world grows stronger</p>
      </div>
    </div>
  );
}

export default LevelUp;