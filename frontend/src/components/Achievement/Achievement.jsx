import { useEffect } from 'react';
import './Achievement.css';

// Formats a reward object into a short line like "+40 XP · 10 wood · 5 stone".
// Zero amounts are skipped so the line only shows what was actually granted.
function rewardLine(reward) {
  if (!reward) return null;
  const parts = [];
  if (reward.xp) parts.push(`+${reward.xp} XP`);
  if (reward.wood) parts.push(`${reward.wood} wood`);
  if (reward.stone) parts.push(`${reward.stone} stone`);
  if (reward.food) parts.push(`${reward.food} food`);
  return parts.length ? parts.join(' · ') : null;
}

function Achievement({ achievement, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  const reward = rewardLine(achievement.reward);

  return (
    <div className="achievement" onClick={onDone}>
      <span className="achievement-icon">{achievement.icon}</span>
      <div className="achievement-text">
        <p className="achievement-label">ACHIEVEMENT UNLOCKED</p>
        <p className="achievement-title">{achievement.title}</p>
        <p className="achievement-desc">{achievement.desc}</p>
        {reward && <p className="achievement-reward">{reward}</p>}
      </div>
    </div>
  );
}

export default Achievement;