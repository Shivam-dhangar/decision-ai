export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserSession {
  isLoggedIn: boolean;
  email: string;
  name: string;
  isDemo: boolean;
  role?: string;
}

export interface ContactLead {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  useCase: string;
  createdAt: string;
}

const THEME_STORAGE_KEY = 'decisionlens_theme_mode';
const AUTH_STORAGE_KEY = 'decisionlens_user_session';
const CONTACT_LEADS_KEY = 'decisionlens_contact_leads';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function getStoredTheme(): ThemeMode {
  if (!isClient()) return 'system';
  try {
    const mode = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (mode === 'light' || mode === 'dark' || mode === 'system') {
      return mode;
    }
  } catch (e) {
    console.error('Failed to read theme preference', e);
  }
  return 'system';
}

export function setStoredTheme(mode: ThemeMode): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (e) {
    console.error('Failed to store theme preference', e);
  }
}

export function getStoredSession(): UserSession {
  if (!isClient()) {
    return { isLoggedIn: false, email: '', name: '', isDemo: false };
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.isLoggedIn === 'boolean') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read user session', e);
  }
  // Default: Not logged in so user must sign in or use demo credentials
  return {
    isLoggedIn: false,
    email: '',
    name: '',
    isDemo: false,
  };
}

export function setStoredSession(session: UserSession): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    window.dispatchEvent(new CustomEvent('decisionlens_auth_updated'));
  } catch (e) {
    console.error('Failed to store user session', e);
  }
}

export function clearStoredSession(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('decisionlens_auth_updated'));
  } catch (e) {
    console.error('Failed to clear user session', e);
  }
}

export function saveContactLead(lead: Omit<ContactLead, 'id' | 'createdAt'>): ContactLead {
  const newLead: ContactLead = {
    ...lead,
    id: `lead-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };

  if (!isClient()) return newLead;

  try {
    const raw = localStorage.getItem(CONTACT_LEADS_KEY);
    const list: ContactLead[] = raw ? JSON.parse(raw) : [];
    list.unshift(newLead);
    localStorage.setItem(CONTACT_LEADS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save contact lead', e);
  }

  return newLead;
}
