import './DailyProgress.css';

function DailyProgress({ xp }) {
  return (
    <div className="daily-progress">
      <span className="daily-progress-label">XP EARNED TODAY</span>
      <span className="daily-progress-value">⭐ {xp}</span>
    </div>
  );
}

export default DailyProgress;