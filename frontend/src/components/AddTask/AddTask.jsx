import { useState } from 'react';
import { TASK_CATALOG } from '../../data/taskCatalog';
import './AddTask.css';

function AddTask({ addedKeys, onAdd }) {
  const [open, setOpen] = useState(false);

  // Show only tasks not already added today
  const available = TASK_CATALOG.filter(
    (task) => !addedKeys.includes(task.key)
  );

  return (
    <div className="add-task">
      <button className="add-task-button" onClick={() => setOpen(true)}>
        ＋ Add task
      </button>

      {open && (
        // Overlay covers the screen; clicking the dim background closes it
        <div className="add-task-overlay" onClick={() => setOpen(false)}>
          {/* Stop clicks inside the panel from closing it */}
          <div className="add-task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-task-modal-header">
              <p className="add-task-title">CHOOSE A TASK</p>
              <button
                className="add-task-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {available.length === 0 ? (
              <p className="add-task-empty">All tasks added for today.</p>
            ) : (
              <ul className="add-task-options">
                {available.map((task) => (
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

            <button className="add-task-done" onClick={() => setOpen(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddTask;