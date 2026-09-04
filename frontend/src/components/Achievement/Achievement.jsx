import { useEffect } from 'react';
import './Achievement.css';

function Achievement({ achievement, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="achievement" onClick={onDone}>
      <span className="achievement-icon">{achievement.icon}</span>
      <div className="achievement-text">
        <p className="achievement-label">ACHIEVEMENT UNLOCKED</p>
        <p className="achievement-title">{achievement.title}</p>
        <p className="achievement-desc">{achievement.desc}</p>
      </div>
    </div>
  );
}

export default Achievement;