import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import agent, { type AuthResponseDto, type LoginDto } from '../../api/agent';
import {
    clearAuthData,
    getAuthData,
    isTokenExpired,
    saveAuthData,
    type StoredAuthData,
} from '../../utils/authStorage';

interface AuthContextValue {
    user: StoredAuthData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginDto) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<StoredAuthData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = getAuthData();

        if (!stored || isTokenExpired(stored.token)) {
            clearAuthData();
            setUser(null);
            setIsLoading(false);
            return;
        }

        setUser(stored);
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginDto) => {
        const response = await agent.Auth.login(credentials);
        const authData: AuthResponseDto = response.data;

        const normalized: StoredAuthData = {
            token: authData.token,
            username: authData.username,
            roles: authData.roles,
        };

        saveAuthData(normalized);
        setUser(normalized);
    };

    const logout = () => {
        clearAuthData();
        setUser(null);
    };

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: !!user && !isTokenExpired(user.token),
            isLoading,
            login,
            logout,
        }),
        [user, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};