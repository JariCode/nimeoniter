import './ResourceBar.css';

function ResourceBar({ resources, gain }) {
  const items = [
    { icon: '🪵', label: 'WOOD', value: resources.wood, gain: gain?.wood || 0 },
    { icon: '🪨', label: 'STONE', value: resources.stone, gain: gain?.stone || 0 },
    { icon: '🍖', label: 'FOOD', value: resources.food, gain: gain?.food || 0 },
  ];

  return (
    <div className="resource-bar">
      {items.map((item) => (
        <div key={item.label} className="resource">
          <span className="resource-icon">{item.icon}</span>
          <span className="resource-value">{item.value}</span>
          <span className="resource-label">{item.label}</span>
          {item.gain > 0 && (
            <span key={gain.id} className="resource-gain">+{item.gain}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default ResourceBar;
