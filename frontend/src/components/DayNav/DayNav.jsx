import './DayNav.css';
import { relativeLabel, readableDate, addDays } from '../../data/dateUtils';

function DayNav({ selectedDate, onChange }) {
  const label = relativeLabel(selectedDate);
  const dateText = readableDate(selectedDate);

  return (
    <div className="day-nav">
      <button
        className="day-nav-arrow"
        onClick={() => onChange(addDays(selectedDate, -1))}
        aria-label="Previous day"
      >
        ‹
      </button>

      <div className="day-nav-center">
        {label && <span className="day-nav-label">{label}</span>}
        <span className="day-nav-date">{dateText}</span>
      </div>

      <button
        className="day-nav-arrow"
        onClick={() => onChange(addDays(selectedDate, 1))}
        aria-label="Next day"
      >
        ›
      </button>
    </div>
  );
}

export default DayNav;