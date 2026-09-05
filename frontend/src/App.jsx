import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useAuth, UserButton } from '@clerk/react';
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
import { ACHIEVEMENTS } from './data/achievements';
import { todayKey } from './data/dateUtils';
import { fetchConfig, fetchState, addTaskApi, completeTaskApi, uncompleteTaskApi, removeTaskApi, buildApi } from './lib/api';
import './App.css';

function App() {
  // Check Clerk authentication status
  const { isLoaded, isSignedIn } = useUser();
  const hasLoadedOnce = useRef(false);
  if (isLoaded) hasLoadedOnce.current = true;

  // Landing shows first; the start button switches to the game
  const [started, setStarted] = useState(false);

  const [totalXp, setTotalXp] = useState(0);
  const [resources, setResources] = useState({ wood: 0, stone: 0, food: 0 });
  const [baseStageIndex, setBaseStageIndex] = useState(-1);
  const [justBuilt, setJustBuilt] = useState(null); // key of the building just built, for the pop animation
  const [gain, setGain] = useState(null); // { wood, stone, food } just earned, for the resource pop
  const [missions, setMissions] = useState([]);

  // Auth token getter for backend calls
  const { getToken } = useAuth();

  // Task catalog and build stages come from the backend (single source of truth)
  const [taskCatalog, setTaskCatalog] = useState([]);
  const [buildStages, setBuildStages] = useState([]);

  // Apply a state object returned by the backend
  function applyState(data) {
    setTotalXp(data.totalXp ?? 0);
    setResources(data.resources ?? { wood: 0, stone: 0, food: 0 });
    setBaseStageIndex(data.baseStageIndex ?? -1);
    setMissions(Array.isArray(data.missions) ? data.missions : []);
  }

  // Load config once, and the player's state on sign-in
  const hasLoaded = useRef(false);
  useEffect(() => {
    if (!isSignedIn || hasLoaded.current) return;
    hasLoaded.current = true;
    (async () => {
      try {
        const config = await fetchConfig();
        setTaskCatalog(config.taskCatalog || []);
        setBuildStages(config.buildStages || []);
        const token = await getToken();
        const data = await fetchState(token);
        applyState(data);

        // Seed the level-up/achievement baselines from the state we just
        // loaded, so a returning player's existing progress doesn't look
        // like a brand-new level-up or achievement unlock on sign-in.
        const doneCount = Array.isArray(data.missions)
          ? data.missions.filter((m) => m.done).length
          : 0;
        const builtCount = (data.baseStageIndex ?? -1) + 1;
        prevLevel.current = levelFromXp(data.totalXp ?? 0).level;
        const stats = {
          tasksDone: doneCount,
          level: prevLevel.current,
          buildingsBuilt: builtCount,
          buildingsTotal: (config.buildStages || []).length,
        };
        for (const a of ACHIEVEMENTS) {
          if (a.check(stats)) unlockedAchievements.current.add(a.id);
        }
      } catch (err) {
        console.error('Load failed:', err);
      }
    })();
  }, [isSignedIn, getToken]);

  // Which day the user is currently viewing
  const [selectedDate, setSelectedDate] = useState(todayKey());

  // Level-up detection
  const [levelUpShown, setLevelUpShown] = useState(null);
  const prevLevel = useRef(1);
  // Stable reference: LevelUp's auto-dismiss effect depends on this prop, so
  // a new function identity on every render would keep resetting its timer.
  const dismissLevelUp = useCallback(() => setLevelUpShown(null), []);

  // Achievement detection
  const [achievementShown, setAchievementShown] = useState(null);
  const unlockedAchievements = useRef(new Set());
  // Same reasoning as dismissLevelUp above.
  const dismissAchievement = useCallback(() => setAchievementShown(null), []);

  async function addTask(task) {
    try {
      const token = await getToken();
      const data = await addTaskApi(token, task.key, selectedDate);
      applyState(data);
    } catch (err) {
      console.error('Add task failed:', err);
    }
  }

  async function completeMission(id) {
    const mission = missions.find((m) => m.id === id);
    if (!mission) return;

    // Already done: clicking again undoes it and revokes the rewards
    if (mission.done) {
      try {
        const token = await getToken();
        const data = await uncompleteTaskApi(token, id);
        applyState(data);
      } catch (err) {
        console.error('Uncomplete task failed:', err);
      }
      return;
    }

    // Show the resource gain pop immediately for responsiveness
    const gainId = Date.now();
    setGain({
      wood: mission.resources?.wood || 0,
      stone: mission.resources?.stone || 0,
      food: mission.resources?.food || 0,
      id: gainId,
    });
    setTimeout(() => setGain((cur) => (cur && cur.id === gainId ? null : cur)), 900);

    // The backend grants the rewards and returns the authoritative state
    try {
      const token = await getToken();
      const data = await completeTaskApi(token, id);
      applyState(data);
    } catch (err) {
      console.error('Complete task failed:', err);
    }
  }

  async function removeMission(id) {
    try {
      const token = await getToken();
      const data = await removeTaskApi(token, id);
      applyState(data);
    } catch (err) {
      console.error('Remove task failed:', err);
    }
  }

  async function removeMission(id) {
    try {
      const token = await getToken();
      const data = await removeTaskApi(token, id);
      applyState(data);
    } catch (err) {
      console.error('Remove task failed:', err);
    }
  }

  // Local copy of the XP curve, for DISPLAY only (backend is authoritative)
  function xpForLevel(lvl) {
    return lvl * 100;
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

  const nextStage = buildStages[baseStageIndex + 1] || null;

  const canBuild =
    !!nextStage &&
    level >= nextStage.requiredLevel &&
    resources.wood >= nextStage.cost.wood &&
    resources.stone >= nextStage.cost.stone &&
    resources.food >= nextStage.cost.food;

  async function build() {
    if (!canBuild) return;
    const builtKey = nextStage.key;
    setJustBuilt(builtKey);
    setTimeout(() => setJustBuilt((cur) => (cur === builtKey ? null : cur)), 900);
    try {
      const token = await getToken();
      const data = await buildApi(token);
      applyState(data);
    } catch (err) {
      console.error('Build failed:', err);
    }
  }

  const baseStageKey =
    baseStageIndex >= 0 && buildStages[baseStageIndex]
      ? buildStages[baseStageIndex].key
      : 'camp';

  // Player stats for achievements
  const tasksDone = missions.filter((m) => m.done).length;
  const buildingsBuilt = baseStageIndex + 1;
  const buildingsTotal = buildStages.length;

  // Detect newly unlocked achievements (show one at a time, once each).
  // Undoing a task can revoke the stats an achievement was earned from
  // (fewer tasks done, a lower level, a building undone) — when that
  // happens the achievement is un-marked so it pops again if re-earned,
  // instead of silently staying "seen" until the page is refreshed.
  useEffect(() => {
    const stats = { tasksDone, level, buildingsBuilt, buildingsTotal };
    for (const a of ACHIEVEMENTS) {
      if (unlockedAchievements.current.has(a.id) && !a.check(stats)) {
        unlockedAchievements.current.delete(a.id);
      }
    }
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

  // Wait until Clerk has finished checking the authentication state, but
  // only on the very first load. Clerk briefly flips isLoaded back to
  // false while a sign-in/sign-out is completing; blanking the screen
  // every time that happens is what caused Landing to flash back in.
  if (!isLoaded && !hasLoadedOnce.current) {
    return null;
  }

  // Clerk's own layout doesn't respond to short landscape viewports, so
  // shrink its spacing/font scale directly for that case (spacing and
  // fontSize are Clerk's official theme variables — see Landing.jsx).
  const isCompactLandscape = window.matchMedia(
    '(orientation: landscape) and (max-height: 500px)'
  ).matches;
  const clerkCompactVars = isCompactLandscape
    ? { spacing: '0.5rem', fontSize: '0.7rem' }
    : {};

  return (
    <>
      {!started && !isSignedIn && <Landing onStart={() => setStarted(true)} />}

      {levelUpShown && <LevelUp level={levelUpShown} onDone={dismissLevelUp} />}

      {achievementShown && (
        <Achievement achievement={achievementShown} onDone={dismissAchievement} />
      )}

      {(started || isSignedIn) && (
        <>
          <div className="user-menu">
            <UserButton
              appearance={{
                variables: {
                  colorBackground: '#151515',
                  colorForeground: '#e6e0d2',
                  colorMutedForeground: '#999999',
                  colorPrimary: '#c58a22',
                  colorPrimaryForeground: '#111111',
                  colorBorder: '#8a641c',
                  ...clerkCompactVars,
                },

                elements: {
                  userButtonAvatarBox: {
                    background: '#151515',
                    border: '1px solid #c58a22',
                  },

                  userButtonAvatarImage: {
                    filter: 'grayscale(1) sepia(1) saturate(3) hue-rotate(350deg)',
                  },

                  userButtonPopoverCard: {
                    background: '#151515',
                    border: '1px solid #8a641c',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                  },

                  userButtonPopoverActionButton: {
                    background: 'transparent',
                    color: '#e6e0d2',

                    '&:hover': {
                      background: '#2a2418',
                      color: '#e6e0d2',
                    },
                  },

                  userButtonPopoverActionButtonIcon: {
                    color: '#c58a22',
                  },

                  userPreviewMainIdentifier: {
                    color: '#e6e0d2',
                  },

                  userPreviewSecondaryIdentifier: {
                    color: '#999999',
                  },

                  userPreviewAvatarBox: {
                    background: '#151515',
                    border: '1px solid #c58a22',
                  },

                  userPreviewAvatarImage: {
                    filter: 'grayscale(1) sepia(1) saturate(3) hue-rotate(350deg)',
                  },
                },
              }}

              userProfileProps={{
                appearance: {
                  variables: {
                    colorBackground: '#151515',
                    colorForeground: '#e6e0d2',
                    colorMutedForeground: '#999999',
                    colorPrimary: '#c58a22',
                    colorPrimaryForeground: '#111111',
                    colorBorder: '#8a641c',
                    ...clerkCompactVars,
                  },

                  elements: {
                    card: {
                      background: '#151515',
                      border: '1px solid #8a641c',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
                    },

                    navbar: {
                      background: '#111111',
                    },

                    navbarButton: {
                      color: '#999999',
                    },

                    navbarButton__active: {
                      color: '#e6e0d2',
                      background: '#2a2418',
                    },

                    headerTitle: {
                      color: '#e6e0d2',
                    },

                    headerSubtitle: {
                      color: '#999999',
                    },

                    profileSectionTitle: {
                      color: '#e6e0d2',
                    },

                    profileSectionContent: {
                      color: '#e6e0d2',
                    },

                    socialButtonsBlockButton: {
                      background: '#1c1c1c',
                      color: '#e6e0d2',
                      border: '1px solid #444444',
                    },

                    socialButtonsBlockButtonText: {
                      color: '#e6e0d2',
                    },

                    /* Row-style buttons (connected accounts, devices, etc.)
                       render with a "neutral" data-color that assumes a
                       light background and renders near-black text —
                       force it light so it's visible on our dark theme. */
                    menuItem: {
                      color: '#e6e0d2',
                    },

                    menuItem__connectedAccounts: {
                      color: '#e6e0d2',
                    },

                    profileSectionPrimaryButton: {
                      color: '#c58a22',
                    },

                    avatarImageActionsUpload: {
                      color: '#c58a22',
                    },

                    formFieldLabel: {
                      color: '#e6e0d2',
                    },

                    formFieldInput: {
                      background: '#1c1c1c',
                      color: '#e6e0d2',
                      border: '1px solid #444444',
                    },

                    formButtonPrimary: {
                      background: '#c58a22',
                      color: '#111111',
                    },

                    footer: {
                      background: '#111111',
                    },

                    avatarBox: {
                      background: '#151515',
                      border: '1px solid #c58a22',
                    },

                    avatarImage: {
                      filter: 'grayscale(1) sepia(1) saturate(3) hue-rotate(350deg)',
                    },
                  },
                },
              }}
            />
          </div>

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
              <AddTask catalog={taskCatalog} addedKeys={addedKeys} onAdd={addTask} />
              <ResourceBar resources={resources} gain={gain} />
            </div>

            <div className="app-right">
              <BaseStatus
                stageKey={baseStageKey}
                buildStages={buildStages}
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
      )}
    </>
  );
}

export default App;