import './Header.css';

function Header({ name, level }) {
  return (
    <header className="header">
      <p className="header-greeting">GOOD MORNING, {name}</p>
      <div className="header-level">
        <span className="header-level-label">LEVEL</span>
        <span className="header-level-number">{level}</span>
      </div>
    </header>
  );
}

export default Header;