/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PATHS } from "../app/Routes";

const AuthContext = createContext(null);

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";
const BAN_NOTICE_KEY = "banNotice";

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    });
    const [banNotice, setBanNotice] = useState(() => {
        const stored = localStorage.getItem(BAN_NOTICE_KEY);
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_KEY);
        }
    }, [user]);

    useEffect(() => {
        if (banNotice) {
            localStorage.setItem(BAN_NOTICE_KEY, JSON.stringify(banNotice));
        } else {
            localStorage.removeItem(BAN_NOTICE_KEY);
        }
    }, [banNotice]);

    useEffect(() => {
        function handleBanEvent(event) {
            setToken("");
            setUser(null);
            setBanNotice(event.detail ?? null);

            if (window.location.pathname !== PATHS.BANNED) {
                window.location.assign(PATHS.BANNED);
            }
        }

        window.addEventListener("auth:banned", handleBanEvent);
        return () => window.removeEventListener("auth:banned", handleBanEvent);
    }, []);

    function login(nextToken, nextUser) {
        setToken(nextToken);
        setUser(nextUser);
    }

    function logout() {
        setToken("");
        setUser(null);
    }

    function updateUser(nextUser) {
        setUser(nextUser);
    }

    function rememberBan(nextBanNotice) {
        setBanNotice(nextBanNotice);
    }

    function clearBanNotice() {
        setBanNotice(null);
    }

    const value = useMemo(
        () => ({
            token,
            user,
            banNotice,
            isLoggedIn: Boolean(token && user),
            login,
            logout,
            updateUser,
            rememberBan,
            clearBanNotice,
        }),
        [banNotice, token, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}