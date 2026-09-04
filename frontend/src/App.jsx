import { useState, useEffect, useRef } from 'react';
import Landing from './components/Landing/Landing';
import Header from './components/Header/Header';
import EnergyBar from './components/EnergyBar/EnergyBar';
import DailyProgress from './components/DailyProgress/DailyProgress';
import DayNav from './components/DayNav/DayNav';
import MissionList from './components/MissionList/MissionList';
import AddTask from './components/AddTask/AddTask';
import ResourceBar from './components/ResourceBar/ResourceBar';
import BaseStatus from './components/BaseStatus/BaseStatus';
import LevelUp from './components/LevelUp/LevelUp';
import Achievement from './components/Achievement/Achievement';
import { xpForLevel, BUILD_STAGES } from './data/gameConfig';
import { ACHIEVEMENTS } from './data/achievements';
import { todayKey } from './data/dateUtils';
import './App.css';

function App() {
  // Landing shows first; the start button switches to the game
  const [started, setStarted] = useState(false);

  const [totalXp, setTotalXp] = useState(0);
  const [resources, setResources] = useState({ wood: 0, stone: 0, food: 0 });
  const [baseStageIndex, setBaseStageIndex] = useState(-1);
  const [justBuilt, setJustBuilt] = useState(null); // key of the building just built, for the pop animation
  const [missions, setMissions] = useState([]);

  // Which day the user is currently viewing
  const [selectedDate, setSelectedDate] = useState(todayKey());

  // Level-up detection
  const [levelUpShown, setLevelUpShown] = useState(null);
  const prevLevel = useRef(1);

  // Achievement detection
  const [achievementShown, setAchievementShown] = useState(null);
  const unlockedAchievements = useRef(new Set());

  function addTask(task) {
    setMissions((prev) => [
      ...prev,
      {
        id: Date.now(),
        date: selectedDate, // task belongs to the day being viewed
        key: task.key,
        name: task.name,
        icon: task.icon,
        xp: task.xp,
        resources: task.resources,
        done: false,
      },
    ]);
  }

  function completeMission(id) {
    setMissions((prev) =>
      prev.map((mission) => {
        if (mission.id !== id || mission.done) return mission;
        setTotalXp((xp) => xp + mission.xp);
        setResources((res) => ({
          wood: res.wood + (mission.resources?.wood || 0),
          stone: res.stone + (mission.resources?.stone || 0),
          food: res.food + (mission.resources?.food || 0),
        }));
        return { ...mission, done: true };
      })
    );
  }

  function removeMission(id) {
    setMissions((prev) =>
      prev.filter((mission) => mission.id !== id || mission.done)
    );
  }

  // Work out level, progress within the level, and XP needed for the next
  function levelFromXp(xp) {
    let level = 1;
    let consumed = 0;
    while (xp >= consumed + xpForLevel(level)) {
      consumed += xpForLevel(level);
      level += 1;
    }
    return { level, xpIntoLevel: xp - consumed, xpForNext: xpForLevel(level) };
  }

  const { level, xpIntoLevel, xpForNext } = levelFromXp(totalXp);
  const levelProgress = Math.round((xpIntoLevel / xpForNext) * 100);

  // When level increases, show the level-up notice
  useEffect(() => {
    if (level > prevLevel.current) {
      setLevelUpShown(level);
    }
    prevLevel.current = level;
  }, [level]);

  const nextStage = BUILD_STAGES[baseStageIndex + 1] || null;

  const canBuild =
    !!nextStage &&
    level >= nextStage.requiredLevel &&
    resources.wood >= nextStage.cost.wood &&
    resources.stone >= nextStage.cost.stone &&
    resources.food >= nextStage.cost.food;

  function build() {
    if (!canBuild) return;
    setResources((res) => ({
      wood: res.wood - nextStage.cost.wood,
      stone: res.stone - nextStage.cost.stone,
      food: res.food - nextStage.cost.food,
    }));
    setBaseStageIndex((i) => i + 1);
    // Trigger the pop animation on the newly built building
    setJustBuilt(nextStage.key);
    setTimeout(() => setJustBuilt((cur) => (cur === nextStage.key ? null : cur)), 900);
  }

  const baseStageKey =
    baseStageIndex >= 0 ? BUILD_STAGES[baseStageIndex].key : 'camp';

  // Player stats for achievements
  const tasksDone = missions.filter((m) => m.done).length;
  const buildingsBuilt = baseStageIndex + 1;
  const buildingsTotal = BUILD_STAGES.length;

  // Detect newly unlocked achievements (show one at a time, once each)
  useEffect(() => {
    const stats = { tasksDone, level, buildingsBuilt, buildingsTotal };
    for (const a of ACHIEVEMENTS) {
      if (!unlockedAchievements.current.has(a.id) && a.check(stats)) {
        unlockedAchievements.current.add(a.id);
        setAchievementShown(a);
        break; // show one; the next will appear on the following change
      }
    }
  }, [tasksDone, level, buildingsBuilt, buildingsTotal]);

  // Tasks for the day being viewed
  const dayMissions = missions.filter((m) => m.date === selectedDate);

  // XP earned from the viewed day's completed tasks
  const todayXp = dayMissions
    .filter((m) => m.done)
    .reduce((sum, m) => sum + m.xp, 0);

  // Which task types are already added on the viewed day (AddTask hides these)
  const addedKeys = dayMissions.map((m) => m.key);

  return (
    <>
      {!started && <Landing onStart={() => setStarted(true)} />}

      {levelUpShown && (
        <LevelUp level={levelUpShown} onDone={() => setLevelUpShown(null)} />
      )}

      {achievementShown && (
        <Achievement
          achievement={achievementShown}
          onDone={() => setAchievementShown(null)}
        />
      )}

      <div className="app">
        <div className="app-left">
          <Header name="SURVIVOR" level={level} />
          <EnergyBar energy={levelProgress} />
          <DailyProgress xp={todayXp} />
          <DayNav selectedDate={selectedDate} onChange={setSelectedDate} />
          <MissionList
            missions={dayMissions}
            onComplete={completeMission}
            onRemove={removeMission}
          />
          <AddTask addedKeys={addedKeys} onAdd={addTask} />
          <ResourceBar resources={resources} />
        </div>

        <div className="app-right">
          <BaseStatus
            stageKey={baseStageKey}
            justBuilt={justBuilt}
            nextStage={nextStage}
            resources={resources}
            level={level}
            canBuild={canBuild}
            onBuild={build}
          />
        </div>
      </div>
    </>
  );
}

export default App;