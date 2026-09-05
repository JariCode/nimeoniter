import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/react';
import { fetchState, saveState } from '../lib/api';

// Loads the player's state from the backend on sign-in, and saves the
// whole state back (debounced) whenever it changes. Keeps App.jsx clean.
export function useGameSync(state, applyLoadedState) {
  const { isSignedIn, getToken } = useAuth();
  const hasLoaded = useRef(false);
  const saveTimer = useRef(null);

  // --- Load once, when signed in ---
  useEffect(() => {
    if (!isSignedIn || hasLoaded.current) return;

    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const data = await fetchState(token);
        if (!cancelled) {
          applyLoadedState(data);
          hasLoaded.current = true;
        }
      } catch (err) {
        console.error('Load failed:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, getToken, applyLoadedState]);

  // --- Save (debounced) whenever state changes, after the first load ---
  useEffect(() => {
    if (!isSignedIn || !hasLoaded.current) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const token = await getToken();
        await saveState(token, state);
      } catch (err) {
        console.error('Save failed:', err);
      }
    }, 800);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, isSignedIn, getToken]);
}