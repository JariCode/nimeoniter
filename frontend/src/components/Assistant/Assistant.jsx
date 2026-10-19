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
  // True when the chat was closed with the keyboard (Escape, or Enter/Space
  // on the companion). Only then does focus return to the companion button:
  // Safari treats a scripted focus() as keyboard focus and would draw the
  // focus ring after a mouse close too.
  const closedWithKeyboardRef = useRef(false);
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
      if (e.key === 'Escape') {
        closedWithKeyboardRef.current = true;
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Return focus to the companion button when the chat was closed with the
  // keyboard, but not on the initial render and not after a mouse or touch
  // close (see closedWithKeyboardRef).
  useEffect(() => {
    if (wasOpenRef.current && !open && closedWithKeyboardRef.current) {
      figureRef.current?.focus();
    }
    closedWithKeyboardRef.current = false;
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
      const worldRect = world.getBoundingClientRect();
      const worldBottom = worldRect.bottom;

      const bottom = window.innerHeight - buttonTop + 4;
      const gap = buttonTop - worldBottom - 8;
      // The figure's SVG (viewBox 0 0 200 260) is empty above the hood,
      // which starts at y≈62. On landscape phones the gap is small, so let
      // that transparent top part reach up beside the world image and keep
      // the visible hood ~4px below it. Tablets keep the plain gap height.
      const HOOD_TOP = 62 / 260;
      const maxHeight = window.innerHeight <= 500
        ? Math.max(40, Math.round(gap / (1 - HOOD_TOP)))
        : Math.max(40, gap);

      document.documentElement.style.setProperty('--companion-bottom', `${bottom}px`);
      document.documentElement.style.setProperty('--companion-max-height', `${maxHeight}px`);

      // App.css lines the user menu avatar up with the world image's right
      // edge on landscape phones; the image's width depends on the screen,
      // so publish its measured distance from the viewport's right edge.
      // clientWidth (not innerWidth) is the box position: fixed uses.
      const worldRightInset = document.documentElement.clientWidth - worldRect.right;
      document.documentElement.style.setProperty('--world-right-inset', `${worldRightInset}px`);
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
          onClick={(e) => {
            if (!open) {
              onOpen();
              return;
            }
            // e.detail is 0 when the button was pressed with Enter or Space
            closedWithKeyboardRef.current = e.detail === 0;
            onClose();
          }}
          aria-label="Talk to your companion"
        >
          <SurvivorFace speaking={speaking} holiday={holiday} world={world} />
        </button>
      </div>
    </div>
  );
}

export default Assistant;