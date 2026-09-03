import './EnergyBar.css';

function EnergyBar({ energy }) {
  return (
    <div className="energy-bar">
      <div className="energy-bar-label">
        <span className="energy-bar-icon">⚡</span>
        <span>{energy} ENERGY</span>
      </div>
      <div className="energy-bar-track">
        <div
          className="energy-bar-fill"
          style={{ width: `${energy}%` }}
        ></div>
      </div>
    </div>
  );
}

export default EnergyBar;