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
import Notice from './components/Notice/Notice';
import Assistant from './components/Assistant/Assistant';
import { todayKey } from './data/dateUtils';
import { getHoliday } from './data/holiday';
import { fetchConfig, fetchState, addTaskApi, completeTaskApi, uncompleteTaskApi, removeTaskApi, buildApi, askAssistantApi, fetchAssistantHistory } from './lib/api';
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
  // Achievement display data (id -> {icon,title,desc,reward}) from the backend
  const [achievementsById, setAchievementsById] = useState({});
  const [streak, setStreak] = useState(0);

  // AI assistant: whether the chat is open, the saved conversation, whether a
  // request is in flight, and whether the figure's mouth is animating.
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantHistory, setAssistantHistory] = useState([]);
  const [assistantBusy, setAssistantBusy] = useState(false);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const greetedRef = useRef(false); // greet only once per session

  // Apply a state object returned by the backend
  function applyState(data) {
    setStreak(data.streak ?? 0);
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
        setAchievementsById(
          Object.fromEntries((config.achievements || []).map((a) => [a.id, a]))
        );
        const token = await getToken();
        const data = await fetchState(token);
        applyState(data);

        // Seed the level-up baseline from the state we just loaded, so a
        // returning player's existing level doesn't trigger a level-up popup
        // on sign-in. Achievements are granted by the backend, so there is
        // nothing to seed for them here.
        prevLevel.current = levelFromXp(data.totalXp ?? 0).level;
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

  // Achievements are granted by the backend, which returns the ids newly
  // unlocked by a completion/build in its `unlockedNow` field. We queue those
  // ids and show them one popup at a time.
  const [achievementShown, setAchievementShown] = useState(null);
  const [achievementQueue, setAchievementQueue] = useState([]);
  const dismissAchievement = useCallback(() => setAchievementShown(null), []);

  // Enqueue any ids the backend says were just unlocked (looked up for display).
  function queueUnlocked(unlockedNow) {
    if (!Array.isArray(unlockedNow) || unlockedNow.length === 0) return;
    const items = unlockedNow
      .map((id) => achievementsById[id])
      .filter(Boolean);
    if (items.length) setAchievementQueue((q) => [...q, ...items]);
  }

  // Small dark-themed notice for backend errors the player should see
  // (e.g. the daily completion limit), instead of a silent console.error.
  const [noticeShown, setNoticeShown] = useState(null);
  const dismissNotice = useCallback(() => setNoticeShown(null), []);

  // Send one turn to the companion and fold the reply into the saved chat. The
  // backend is authoritative: it reads the saved state, returns text only, and
  // persists the conversation — this never touches XP, resources or buildings.
  const talkToAssistant = useCallback(async (mode, question) => {
    setAssistantBusy(true);
    // Optimistically show the player's own turn right away for typed questions.
    if (mode === 'question' && question) {
      setAssistantHistory((h) => [...h, { role: 'user', content: question }]);
    }
    try {
      const token = await getToken();
      const data = await askAssistantApi(token, mode, question, getHoliday(), todayKey());
      // The backend returns the authoritative, trimmed history including this
      // turn — use it as the source of truth for what to show.
      if (Array.isArray(data.history)) {
        setAssistantHistory(data.history);
      } else if (data.message) {
        setAssistantHistory((h) => [...h, { role: 'assistant', content: data.message }]);
      }
      setAssistantSpeaking(true);
      const readMs = Math.min(9000, 1800 + (data.message?.length || 0) * 45);
      setTimeout(() => setAssistantSpeaking(false), readMs);
    } catch (err) {
      console.error('Assistant failed:', err);
    } finally {
      setAssistantBusy(false);
    }
  }, [getToken]);

  // Open the chat and load the saved conversation. Greeting is handled by the
  // sign-in effect, so opening by click never triggers another greeting.
  const openAssistant = useCallback(async () => {
    setAssistantOpen(true);
    try {
      const token = await getToken();
      const data = await fetchAssistantHistory(token);
      if (Array.isArray(data.history)) setAssistantHistory(data.history);
    } catch (err) {
      console.error('Assistant history failed:', err);
    }
  }, [getToken]);

  // Greet automatically once per browser tab session — not on every refresh.
  // sessionStorage holds only a tiny non-sensitive flag ("have we greeted in
  // this tab yet"): no tokens, no game data. It clears when the tab closes, so
  // a real sign-in (fresh tab/session) greets, while a page refresh within the
  // same tab does not. The backend stays the source of truth for everything.
  useEffect(() => {
    if (!isSignedIn) return;
    if (missions.length === 0 && totalXp === 0) return; // wait until state is in
    if (sessionStorage.getItem('nimeoniter_greeted') === '1') return;
    sessionStorage.setItem('nimeoniter_greeted', '1');
    openAssistant();
    talkToAssistant('greeting');
  }, [isSignedIn, missions.length, totalXp, openAssistant, talkToAssistant]);

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
      const data = await completeTaskApi(token, id, todayKey());
      applyState(data);
      queueUnlocked(data.unlockedNow);
    } catch (err) {
      console.error('Complete task failed:', err);
      if (err.message === 'Daily completion limit reached') {
        setNoticeShown("Today's quota of 30 tasks is done. Rest up, more awaits tomorrow.");
      }
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
      queueUnlocked(data.unlockedNow);
    } catch (err) {
      console.error('Build failed:', err);
    }
  }

  const baseStageKey =
    baseStageIndex >= 0 && buildStages[baseStageIndex]
      ? buildStages[baseStageIndex].key
      : 'camp';

  // Show queued achievement popups one at a time: when nothing is showing and
  // the queue has items, pop the first off the queue and display it.
  useEffect(() => {
    if (achievementShown || achievementQueue.length === 0) return;
    setAchievementShown(achievementQueue[0]);
    setAchievementQueue((q) => q.slice(1));
  }, [achievementShown, achievementQueue]);

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

      {noticeShown && <Notice message={noticeShown} onDone={dismissNotice} />}

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
                       light background and renders near-black text — Clerk's
                       own [data-color] attribute selector out-specifies a
                       plain .cl-menuItem override, so !important is needed
                       even for the resting state, not just :hover. */
                    /* The "..." trigger button itself, separate from the
                       dropdown it opens — also needs an explicit color or
                       its icon renders dark-on-dark and disappears. */
                    menuButtonEllipsis: {
                      color: '#999999 !important',

                      '&:hover': {
                        color: '#e6e0d2 !important',
                      },
                    },

                    menuList: {
                      background: '#1c1c1c',
                      border: '1px solid #444444',
                    },

                    menuItem: {
                      color: '#e6e0d2 !important',

                      '&:hover': {
                        color: '#e6e0d2 !important',
                        background: '#2a2418',
                      },
                    },

                    menuItem__connectedAccounts: {
                      color: '#e6e0d2 !important',

                      '&:hover': {
                        color: '#e6e0d2 !important',
                        background: '#2a2418',
                      },
                    },

                    /* "Primary" badge color is handled globally in App.css
                       (.cl-badge[data-color='primary']) instead of here —
                       this appearance prop didn't reliably reach every
                       modal instance (e.g. after an OAuth-cancel redirect). */

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
              <Header name="SURVIVOR" level={level} streak={streak} />
              <EnergyBar energy={levelProgress} xpInto={xpIntoLevel} xpFor={xpForNext} />
              <DailyProgress
                xp={todayXp}
                done={dayMissions.filter((m) => m.done).length}
                total={dayMissions.length}
              />
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

          <Assistant
            open={assistantOpen}
            speaking={assistantSpeaking}
            history={assistantHistory}
            busy={assistantBusy}
            onOpen={openAssistant}
            onClose={() => { setAssistantOpen(false); setAssistantSpeaking(false); }}
            onSend={talkToAssistant}
          />
        </>
      )}
    </>
  );
}

export default App;