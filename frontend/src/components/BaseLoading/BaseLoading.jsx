import './BaseLoading.css';

// Shown in place of BaseStatus during the very first load only (before
// stateLoaded flips true in App.jsx), never for later data fetches like
// build or completing a task. World-neutral — this renders before we know
// which world (village/city) the player is even in, so it mirrors the
// loaded layout (title, world window, build bar) without any of the
// loaded view's own classes, which Robot Framework tests use as buttons.
//
// A normal-speed load just shows the spinner. If loading crosses the
// "waking" threshold App.jsx tracks (a few seconds), the backend — hosted
// on Render's free tier — is most likely cold-starting, so an explanatory
// line and a soft glow pulse are added without removing the spinner.
function BaseLoading({ waking }) {
  return (
    <div
      className={`base-loading${waking ? ' base-loading--waking' : ''}`}
      role="status"
      aria-live="polite"
    >
      <h2 className="base-loading-title">YOUR WORLD</h2>

      <div className="base-loading-frame">
        <svg viewBox="0 0 400 300" className="base-loading-svg" aria-hidden="true" />

        <div className="base-loading-panel">
          <div className="base-loading-glow" aria-hidden="true" />
          <div className="base-loading-spinner" aria-hidden="true" />
          {waking && (
            <p className="base-loading-message">
              Waking up the server&hellip; this can take a moment.
            </p>
          )}
        </div>

        {/* Reserves the same vertical space .base-world-stage takes in the
            loaded view (margin-top + line height) so the build bar below
            doesn't jump up when the real stage name replaces this. */}
        <p className="base-loading-stage" aria-hidden="true">&nbsp;</p>
      </div>

      <div className="base-loading-build">
        <div className="base-loading-build-header">
          <span className="base-loading-build-label">NEXT: &hellip;</span>
        </div>

        <div className="base-loading-build-cost">
          <span className="cost-missing">🪵 0/&ndash;</span>
          <span className="cost-missing">🪨 0/&ndash;</span>
          <span className="cost-missing">🍖 0/&ndash;</span>
        </div>

        <button className="base-loading-build-button" disabled>
          LOADING&hellip;
        </button>
      </div>
    </div>
  );
}

export default BaseLoading;
