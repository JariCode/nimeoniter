import './MissionList.css';

function MissionList({ missions, onComplete, onRemove }) {
  return (
    <div className="mission-list">

      {missions.length === 0 ? (
        <p className="mission-list-empty">
          No tasks yet. Add your first task below.
        </p>
      ) : (
        <ul className="mission-list-items">
          {missions.map((mission) => (
            <li
              key={mission.id}
              className={`mission ${mission.done ? 'mission-done' : ''}`}
            >
              <span
                className="mission-check"
                onClick={() => onComplete(mission.id)}
              >
                {mission.done ? '☑' : '☐'}
              </span>
              <span
                className="mission-name"
                onClick={() => onComplete(mission.id)}
              >
                {mission.icon} {mission.name}
              </span>
              <span className="mission-xp">+{mission.xp} XP</span>
              <button
                className="mission-remove"
                onClick={() => onRemove(mission.id)}
                aria-label="Remove task"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MissionList;