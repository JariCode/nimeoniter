import './DailyProgress.css';

function DailyProgress({ xp, done = 0, total = 0 }) {
  return (
    <div className="daily-progress">
      <span className="daily-progress-label">XP EARNED TODAY</span>
      {total > 0 && (
        <span className="daily-progress-tasks">
          {done}/{total} TASKS
        </span>
      )}
      <span className="daily-progress-value">⭐ {xp}</span>
    </div>
  );
}

export default DailyProgress;