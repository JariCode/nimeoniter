import './BaseStatus.css';
import BaseWorld from '../BaseWorld/BaseWorld';

function BaseStatus({ stageKey, nextStage, resources, level, canBuild, onBuild, justBuilt }) {
  return (
    <div className="base-status">
      <h2 className="base-status-title">YOUR WORLD</h2>

      <BaseWorld stageKey={stageKey} justBuilt={justBuilt} />

      {nextStage ? (
        <div className="base-build">
          <div className="base-build-header">
            <span className="base-build-label">NEXT: {nextStage.name}</span>
          </div>

          <div className="base-build-cost">
            {nextStage.cost.wood > 0 && (
              <span className={resources.wood >= nextStage.cost.wood ? 'cost-ok' : 'cost-missing'}>
                🪵 {resources.wood}/{nextStage.cost.wood}
              </span>
            )}
            {nextStage.cost.stone > 0 && (
              <span className={resources.stone >= nextStage.cost.stone ? 'cost-ok' : 'cost-missing'}>
                🪨 {resources.stone}/{nextStage.cost.stone}
              </span>
            )}
            {nextStage.cost.food > 0 && (
              <span className={resources.food >= nextStage.cost.food ? 'cost-ok' : 'cost-missing'}>
                🍖 {resources.food}/{nextStage.cost.food}
              </span>
            )}
          </div>

          <button
            className="base-build-button"
            onClick={onBuild}
            disabled={!canBuild}
          >
            {canBuild
              ? `BUILD ${nextStage.name}`
              : level < nextStage.requiredLevel
              ? `REACH LEVEL ${nextStage.requiredLevel} TO BUILD`
              : 'NOT ENOUGH RESOURCES'}
          </button>
        </div>
      ) : (
        <p className="base-build-complete">Your base is fully built.</p>
      )}
    </div>
  );
}

export default BaseStatus;