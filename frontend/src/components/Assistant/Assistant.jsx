import { useState, useRef, useEffect } from 'react';
import SurvivorFace from './SurvivorFace';
import { getHoliday } from '../../data/holiday';
import './Assistant.css';

// The survivor companion. Renders the shared SurvivorFace and a persistent
// chat: the player and the character trade messages in one scrolling log,
// with buttons for advice and the daily challenge. The backend is the source
// of truth: this component only shows the conversation and sends turns. It
// never computes rewards or game state.
function Assistant({ open, speaking, history, busy, onOpen, onClose, onSend, world }) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  // Active holiday costume, shared by the small icon and the opened figure
  // since both render the same SurvivorFace element below.
  const holiday = getHoliday();

  // Keep the chat scrolled to the newest message.
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, history, busy]);

  // Auto-focus the question input when the chat opens, so the player can
  // type immediately without clicking into the field first. Also re-run on
  // busy: an auto-opened chat greets with busy=true (input disabled), so
  // focus must land once busy flips back to false after the greeting.
  // The very first open in this tab session is the automatic login greeting,
  // so it is skipped; every open after that is user-initiated and gets focus.
  const firstOpenRef = useRef(true);
  useEffect(() => {
    if (open && !busy && inputRef.current) {
      if (firstOpenRef.current) {
        firstOpenRef.current = false;
        return;
      }
      inputRef.current.focus();
    }
  }, [open, busy]);

  function submitQuestion() {
    const q = draft.trim();
    if (!q || busy) return;
    setDraft('');
    onSend('question', q);
  }

  return (
    <div className={`assistant ${open ? 'assistant--open' : ''}`}>
      {open && <div className="assistant__backdrop" onClick={onClose} />}

      <div className="assistant__stage">
        {open && (
          <div className="assistant__chat">
            <div className="assistant__log" ref={scrollRef}>
              {history.length === 0 && !busy && (
                <div className="assistant__empty">Say something to the survivor.</div>
              )}
              {history.map((m, i) => (
                <div
                  key={i}
                  className={`chat-msg ${m.role === 'user' ? 'chat-msg--you' : 'chat-msg--them'}`}
                >
                  {m.content}
                </div>
              ))}
              {busy && <div className="chat-msg chat-msg--them chat-msg--typing">…</div>}
            </div>

            {/* Buttons drive the advice/daily-challenge modes; their replies
                land in the same log as typed questions. The backend answers
                from saved state only — it never changes the game. */}
            <div className="assistant__actions">
              <button type="button" className="assistant__chip" onClick={() => onSend('advice')} disabled={busy}>
                Advice
              </button>
              <button type="button" className="assistant__chip" onClick={() => onSend('daily_challenge')} disabled={busy}>
                Daily challenge
              </button>
            </div>

            <div className="assistant__ask">
              <input
                ref={inputRef}
                className="assistant__input"
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitQuestion(); }}
                placeholder="Ask the survivor..."
                maxLength={200}
                disabled={busy}
              />
              <button
                type="button"
                className="assistant__send"
                onClick={submitQuestion}
                disabled={busy}
                aria-label="Send question"
              >
                ›
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          className="assistant__figure"
          onClick={open ? onClose : onOpen}
          aria-label="Talk to your companion"
        >
          <SurvivorFace speaking={speaking} holiday={holiday} world={world} />
        </button>
      </div>
    </div>
  );
}

export default Assistant;