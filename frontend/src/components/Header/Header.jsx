import './Header.css';
import { getTimeOfDay, GREETINGS } from '../../data/timeOfDay';

function Header({ name, level }) {
  const greeting = GREETINGS[getTimeOfDay()];

  return (
    <header className="header">
      <p className="header-greeting">{greeting}, {name}</p>
      <div className="header-level">
        <span className="header-level-label">LEVEL</span>
        <span className="header-level-number">{level}</span>
      </div>
    </header>
  );
}

export default Header;