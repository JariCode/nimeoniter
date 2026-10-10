import { useSyncExternalStore } from 'react';
import SurvivorFace from '../Assistant/SurvivorFace';
import { getHoliday } from '../../data/holiday';
import './RotateNotice.css';

// Nimeoniter is designed for landscape on phones: the whole game (tasks +
// world) must fit on one screen side by side, which portrait can't do.
// The companion character delivers the message. App passes the player's
// world once it is known; before that it falls back to the default
// (medieval) look. The holiday costume is date-based, so it always applies.
//
// Only MOUNTED while a phone is held upright (not just hidden with CSS):
// SurvivorFace's SVG uses fixed gradient ids (#hood, #skin, ...), and a
// second, display:none copy earlier in the DOM would "own" those ids and
// leave the in-game assistant's fills blank. Mounting only in portrait
// keeps a single SurvivorFace on screen in landscape, exactly as before.

// Must match the media query in RotateNotice.css
const PORTRAIT_PHONE = '(orientation: portrait) and (max-width: 600px)';

function subscribe(callback) {
  const mq = window.matchMedia(PORTRAIT_PHONE);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia(PORTRAIT_PHONE).matches;
}

function RotateNotice({ world = 'medieval' }) {
  // Re-renders automatically when the device is rotated
  const isPortraitPhone = useSyncExternalStore(subscribe, getSnapshot);
  if (!isPortraitPhone) return null;

  return (
    <div className="rotate-notice" role="alert" aria-live="polite">
      <div className="rotate-notice-bubble">
        <p className="rotate-notice-title">Turn your device sideways.</p>
        <p className="rotate-notice-text">
          This place only makes sense in landscape.
        </p>
        <svg
          className="rotate-notice-phone"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <rect x="14" y="6" width="20" height="36" rx="3" />
          <line x1="21" y1="37" x2="27" y2="37" />
        </svg>
      </div>

      <div className="rotate-notice-figure" aria-hidden="true">
        <SurvivorFace speaking holiday={getHoliday()} world={world} />
      </div>
    </div>
  );
}

export default RotateNotice;