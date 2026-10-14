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
  const figureRef = useRef(null);
  const wasOpenRef = useRef(open);
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
  // busy: while the greeting loads the input is disabled (busy=true), so
  // focus lands once busy flips back to false.
  useEffect(() => {
    if (open && !busy && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, busy]);

  // Close on Escape from anywhere in the chat, not just the input.
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Return focus to the companion button when the chat closes, but not on
  // the initial render (before it has ever been open).
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      figureRef.current?.focus();
    }
    wasOpenRef.current = open;
  }, [open]);

  // In the narrow landscape/tablet layouts (Assistant.css), the resting
  // companion fills whatever real gap exists between the world image and
  // the build button — sizes that depend on rendered text and borders,
  // not just the CSS values that produced them. Measure that gap in the
  // DOM instead of guessing it, and publish it as CSS custom properties
  // Assistant.css's narrow-layout rules read. Doesn't touch React state —
  // this only affects the companion's own layout, nothing else.
  useEffect(() => {
    function measure() {
      const button =
        document.querySelector('.base-build-button') ||
        document.querySelector('.base-build-complete');
      const world = document.querySelector('.base-world-svg');
      if (!button || !world) return;

      const buttonTop = button.getBoundingClientRect().top;
      const worldBottom = world.getBoundingClientRect().bottom;

      const bottom = window.innerHeight - buttonTop + 4;
      const maxHeight = Math.max(40, buttonTop - worldBottom - 8);

      document.documentElement.style.setProperty('--companion-bottom', `${bottom}px`);
      document.documentElement.style.setProperty('--companion-max-height', `${maxHeight}px`);
    }

    measure();
    window.addEventListener('resize', measure);

    // The game (and so .base-build-button/.base-world-svg) only appears
    // once auth and state have loaded, so watch .app itself — it exists
    // from the first render — for the size changes that come with that.
    const target = document.querySelector('.app') || document.body;
    const observer = new ResizeObserver(measure);
    observer.observe(target);

    return () => {
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
  }, []);

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
          ref={figureRef}
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