import { useState } from 'react';
import './AddTask.css';

function AddTask({ catalog = [], addedKeys, onAdd }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Tasks not already added today
  const available = catalog.filter((task) => !addedKeys.includes(task.key));

  // Live filter: keep tasks whose name contains the typed text (case-insensitive).
  // Purely client-side over the in-memory catalog — the text is never sent to the
  // backend, a database, or the DOM as HTML, so there's no injection surface here.
  const trimmedQuery = query.trim().toLowerCase();
  const filtered = available.filter((task) =>
    task.name.toLowerCase().includes(trimmedQuery)
  );

  // Reset the search when the modal closes
  function close() {
    setOpen(false);
    setQuery('');
  }

  return (
    <div className="add-task">
      <button className="add-task-button" onClick={() => setOpen(true)}>
        ＋ Add task
      </button>

      {open && (
        <div className="add-task-overlay" onClick={close}>
          <div className="add-task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-task-modal-header">
              <p className="add-task-title">CHOOSE A TASK</p>
              <button
                className="add-task-close"
                onClick={close}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Live search filter (client-side only) */}
            <input
              type="text"
              className="add-task-search"
              placeholder="Search tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') close(); }}
              maxLength={50}
              aria-label="Search tasks"
              autoFocus
            />

            {available.length === 0 ? (
              <p className="add-task-empty">All tasks added for today.</p>
            ) : filtered.length === 0 ? (
              <p className="add-task-empty">No tasks match "{query}".</p>
            ) : (
              <ul className="add-task-options">
                {filtered.map((task) => (
                  <li
                    key={task.key}
                    className="add-task-option"
                    onClick={() => onAdd(task)}
                  >
                    <span className="add-task-option-icon">{task.icon}</span>
                    <span className="add-task-option-name">{task.name}</span>
                    <span className="add-task-option-xp">+{task.xp} XP</span>
                  </li>
                ))}
              </ul>
            )}

            <button className="add-task-done" onClick={close}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddTask;