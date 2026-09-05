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
      {/* Always reserve this row's space (visibility, not display) so the
          header's height — and the divider line below it — stays the same
          whether or not there's a streak to show. */}
      <div
        className="header-streak"
        style={{ visibility: streak > 0 ? 'visible' : 'hidden' }}
        title={streak > 0 ? `${streak} day streak` : undefined}
      >
        <span className="header-streak-fire">🔥</span>
        <span className="header-streak-count">{streak}</span>
        <span className="header-streak-label">
          DAY{streak === 1 ? '' : 'S'}
        </span>
      </div>
    </header>
  );
}

export default Header;