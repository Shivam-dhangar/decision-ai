import { Decision } from '@/types/decision';
import { DEMO_DECISION } from '@/lib/data/demoDecision';
import { calculateDecisionResults } from '@/lib/engine/decisionEngine';

const DECISIONS_STORAGE_KEY = 'decisionlens_decisions_v1';
const STORAGE_EVENT_NAME = 'decisionlens_storage_updated';

// Safe check for window
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Dispatches custom event to notify React components across tabs/pages
 */
function notifyStorageUpdate() {
  if (!isClient()) return;
  try {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT_NAME));
  } catch (e) {
    console.error('Failed to dispatch storage event', e);
  }
}

/**
 * Safely reads all decisions from LocalStorage.
 * If empty, automatically seeds with the realistic demo decision.
 */
export function getDecisions(): Decision[] {
  if (!isClient()) return [DEMO_DECISION];

  try {
    const raw = localStorage.getItem(DECISIONS_STORAGE_KEY);
    if (!raw) {
      // Seed with demo decision
      const initialList = [DEMO_DECISION];
      localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(initialList));
      return initialList;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('Corrupted decisions storage; resetting to demo state.');
      const fallback = [DEMO_DECISION];
      localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }

    // Auto calculate results if missing
    return parsed.map((d: Decision) => {
      if (!d.results && d.options?.length && d.criteria?.length) {
        d.results = calculateDecisionResults(d.options, d.criteria, d.scores) || undefined;
      }
      return d;
    });
  } catch (error) {
    console.error('Error reading decisions from LocalStorage:', error);
    return [DEMO_DECISION];
  }
}

/**
 * Get a single decision by its unique ID
 */
export function getDecisionById(id: string): Decision | null {
  const decisions = getDecisions();
  const found = decisions.find((d) => d.id === id);
  if (!found) return null;

  // Ensure results are calculated
  if (!found.results && found.options?.length && found.criteria?.length) {
    found.results = calculateDecisionResults(found.options, found.criteria, found.scores) || undefined;
  }
  return found;
}

/**
 * Saves or updates a decision in LocalStorage
 */
export function saveDecision(decision: Decision): Decision {
  if (!isClient()) return decision;

  try {
    const decisions = getDecisions();
    const updated = {
      ...decision,
      updatedAt: new Date().toISOString(),
    };

    // Calculate deterministic results automatically
    if (updated.options?.length && updated.criteria?.length) {
      const calc = calculateDecisionResults(updated.options, updated.criteria, updated.scores);
      if (calc) {
        updated.results = calc;
      }
    }

    const existingIndex = decisions.findIndex((d) => d.id === decision.id);

    let newList: Decision[];
    if (existingIndex >= 0) {
      newList = [...decisions];
      newList[existingIndex] = updated;
    } else {
      newList = [updated, ...decisions];
    }

    localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(newList));
    notifyStorageUpdate();
    return updated;
  } catch (error) {
    console.error('Error saving decision to LocalStorage:', error);
    throw new Error('Failed to save decision locally. Storage quota may be full.');
  }
}

/**
 * Deletes a decision by its ID
 */
export function deleteDecision(id: string): boolean {
  if (!isClient()) return false;

  try {
    const decisions = getDecisions();
    const filtered = decisions.filter((d) => d.id !== id);
    localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(filtered));
    notifyStorageUpdate();
    return true;
  } catch (error) {
    console.error('Error deleting decision:', error);
    return false;
  }
}

/**
 * Deletes all stored decisions and resets to empty state
 */
export function clearAllDecisions(): boolean {
  if (!isClient()) return false;

  try {
    localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify([]));
    notifyStorageUpdate();
    return true;
  } catch (error) {
    console.error('Error clearing decisions:', error);
    return false;
  }
}

/**
 * Resets the demo decision in LocalStorage
 */
export function resetDemoDecision(): Decision {
  if (!isClient()) return DEMO_DECISION;

  try {
    const decisions = getDecisions().filter((d) => d.id !== DEMO_DECISION.id);
    const newList = [DEMO_DECISION, ...decisions];
    localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(newList));
    notifyStorageUpdate();
    return DEMO_DECISION;
  } catch (error) {
    console.error('Error resetting demo decision:', error);
    return DEMO_DECISION;
  }
}

/**
 * Exports all user decisions as a JSON formatted string
 */
export function exportAllDecisionsJSON(): string {
  const decisions = getDecisions();
  return JSON.stringify(
    {
      app: 'DecisionLens AI',
      exportedAt: new Date().toISOString(),
      version: 1,
      decisions,
    },
    null,
    2
  );
}

/**
 * Validates and imports decisions from a JSON formatted string
 */
export function importDecisionsJSON(jsonString: string): { success: boolean; count: number; error?: string } {
  if (!isClient()) return { success: false, count: 0, error: 'Browser storage unavailable.' };

  try {
    const parsed = JSON.parse(jsonString);
    const items: Decision[] = Array.isArray(parsed) ? parsed : parsed.decisions;

    if (!Array.isArray(items)) {
      return { success: false, count: 0, error: 'Invalid JSON file structure.' };
    }

    const current = getDecisions();
    const currentMap = new Map(current.map((d) => [d.id, d]));

    let importedCount = 0;
    items.forEach((item) => {
      if (item && item.id && item.title) {
        currentMap.set(item.id, item);
        importedCount++;
      }
    });

    const merged = Array.from(currentMap.values());
    localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(merged));
    notifyStorageUpdate();

    return { success: true, count: importedCount };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Failed to parse JSON file.' };
  }
}

/**
 * Helper hook / event listener subscriber for reactive updates across components
 */
export function subscribeToStorageUpdates(callback: () => void): () => void {
  if (!isClient()) return () => {};

  const handler = () => callback();
  window.addEventListener(STORAGE_EVENT_NAME, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(STORAGE_EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
