import './Header.css';
import { getTimeOfDay, GREETINGS } from '../../data/timeOfDay';

function Header({ name, level, streak }) {
  const greeting = GREETINGS[getTimeOfDay()];

  return (
    <header className="header">
      <p className="header-greeting">{greeting}</p>
      <div className="header-level">
        <span className="header-level-label">LEVEL</span>
        <span className="header-level-number">{level}</span>
      </div>
      {streak > 0 && (
        <div className="header-streak" title={`${streak} day streak`}>
          <span className="header-streak-fire">🔥</span>
          <span className="header-streak-count">{streak}</span>
          <span className="header-streak-label">
            DAY{streak === 1 ? '' : 'S'}
          </span>
        </div>
      )}
    </header>
  );
}

export default Header;