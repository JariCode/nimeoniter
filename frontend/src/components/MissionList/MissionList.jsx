import { useState } from 'react';
import './MissionList.css';

function MissionList({ missions, onComplete, onRemove }) {
  // Tracks which task just got completed, to show a floating "+XP"
  const [poppingId, setPoppingId] = useState(null);

  function handleComplete(mission) {
    // Only pop when going from not-done to done
    if (!mission.done) {
      setPoppingId(mission.id);
      // Clear after the animation so it can fire again later
      setTimeout(() => setPoppingId((cur) => (cur === mission.id ? null : cur)), 900);
    }
    onComplete(mission.id);
  }

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
                onClick={() => handleComplete(mission)}
              >
                {mission.done ? '☑' : '☐'}
              </span>
              <span
                className="mission-name"
                onClick={() => handleComplete(mission)}
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

              {/* Floating reward that pops when completed */}
              {poppingId === mission.id && (
                <span className="mission-pop">+{mission.xp} XP</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MissionList;