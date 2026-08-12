const SESSION_KEY = "arxon_ambassador_portal_session";

export type StoredSession = {
  token: string;
  accountId: string;
  expiresAt: number;
};

export function loadSession(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed.token || parsed.expiresAt < Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(token: string, accountId: string, expiresInSec: number) {
  const payload: StoredSession = {
    token,
    accountId,
    expiresAt: Date.now() + expiresInSec * 1000,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
