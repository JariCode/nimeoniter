import { useEffect } from 'react';
import './Notice.css';

// A small dark-themed notice for surfacing backend errors (e.g. the daily
// completion limit) that would otherwise only be logged to the console.
function Notice({ message, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="notice" onClick={onDone}>
      <span className="notice-icon">🌙</span>
      <p className="notice-text">{message}</p>
    </div>
  );
}

export default Notice;
