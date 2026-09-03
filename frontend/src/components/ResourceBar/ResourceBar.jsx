import './ResourceBar.css';

function ResourceBar({ resources }) {
  const items = [
    { icon: '🪵', label: 'WOOD', value: resources.wood },
    { icon: '🪨', label: 'STONE', value: resources.stone },
    { icon: '🍖', label: 'FOOD', value: resources.food },
  ];

  return (
    <div className="resource-bar">
      {items.map((item) => (
        <div key={item.label} className="resource">
          <span className="resource-icon">{item.icon}</span>
          <span className="resource-value">{item.value}</span>
          <span className="resource-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default ResourceBar;