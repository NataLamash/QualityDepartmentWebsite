export interface StoredAuthData {
    token: string;
    username: string;
    roles: string[];
}

export const AUTH_STORAGE_KEY = 'qualitydepartment.admin.auth';

export const saveAuthData = (data: StoredAuthData) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
};

export const getAuthData = (): StoredAuthData | null => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) return null;

    try {
        return JSON.parse(raw) as StoredAuthData;
    } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
    }
};

export const clearAuthData = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
};

const parseJwtPayload = (token: string): { exp?: number } | null => {
    try {
        const payload = token.split('.')[1];
        if (!payload) return null;

        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
        const decoded = atob(padded);

        return JSON.parse(decoded) as { exp?: number };
    } catch {
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    const payload = parseJwtPayload(token);

    if (!payload?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
};