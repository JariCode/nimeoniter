import './Landing.css';

// Landing page: hooded survivor image fading into darkness,
// title + punchline below, and a themed start button.
function Landing({ onStart }) {
  return (
    <div className="landing">
      <div className="landing-inner">
        <div className="landing-image-wrap">
          <img
            src="/img/Nimeoniter-Landing-Page.png"
            alt="A lone survivor by a campfire in the dark"
            className="landing-image"
          />
        </div>

        <h1 className="landing-title">NIMEONITER</h1>
        <p className="landing-punchline">Do your tasks. Survive. Build your world.</p>

        <button className="landing-start" onClick={onStart}>
          Light the fire
        </button>
      </div>
    </div>
  );
}

export default Landing;