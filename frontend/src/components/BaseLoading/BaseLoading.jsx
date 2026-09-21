import './BaseLoading.css';

// Shown in place of BaseStatus during the very first load only (before
// stateLoaded flips true in App.jsx), never for later data fetches like
// build or completing a task. World-neutral — this renders before we know
// which world (village/city) the player is even in.
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
      <div className="base-loading-glow" aria-hidden="true" />
      <div className="base-loading-spinner" aria-hidden="true" />
      {waking && (
        <p className="base-loading-message">
          Waking up the server&hellip; this can take a little while on the free tier.
        </p>
      )}
    </div>
  );
}

export default BaseLoading;
