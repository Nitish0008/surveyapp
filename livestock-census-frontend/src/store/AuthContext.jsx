import { useEffect, useState } from 'react';
import { DEMO_USERS } from '../data/demoUsers';
import { AuthContext } from './authContextValue';

const STORAGE_KEY = 'assam_livestock_auth_user_v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(display-mode: standalone)').matches ||
        Boolean(window.navigator?.standalone)
      : false
  );
  const isSecureContext =
    typeof window !== 'undefined' ? Boolean(window.isSecureContext) : true;
  const isIos =
    typeof navigator !== 'undefined'
      ? /iphone|ipad|ipod/i.test(navigator.userAgent)
      : false;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const persistUser = (nextUser) => {
    setUser(nextUser);
    try {
      if (nextUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage quota errors in restricted browsers
    }
  };

  const login = async ({ identifier, password, remember = true }) => {
    const normalized = identifier.trim().toLowerCase();
    const matched = DEMO_USERS.find(
      (candidate) =>
        candidate.username.toLowerCase() === normalized ||
        candidate.employeeCode.toLowerCase() === normalized
    );

    if (!matched || matched.password !== password) {
      return {
        success: false,
        message: 'Invalid username/employee ID or password. Use a demo credential or quick sign-in below.',
      };
    }

    const { password: _removed, ...safeUser } = matched;
    const sessionUser = {
      ...safeUser,
      loginAt: new Date().toISOString(),
    };

    if (remember) {
      persistUser(sessionUser);
    } else {
      setUser(sessionUser);
    }

    return {
      success: true,
      message: 'Authenticated successfully',
      user: sessionUser,
    };
  };

  const loginAsDemoRole = (role) => {
    const matched = DEMO_USERS.find((candidate) => candidate.role === role);
    if (!matched) return null;
    const { password: _removed, ...safeUser } = matched;
    const sessionUser = {
      ...safeUser,
      loginAt: new Date().toISOString(),
    };
    persistUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    persistUser(null);
  };

  const triggerPwaInstall = async () => {
    if (!installPrompt) return false;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
    return outcome === 'accepted';
  };

  const getDefaultRouteForRole = () => {
    return '/dashboard';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isOnline,
        canInstallPwa: Boolean(installPrompt) && !isInstalled,
        isInstalled,
        isSecureContext,
        isIos,
        login,
        loginAsDemoRole,
        logout,
        triggerPwaInstall,
        getDefaultRouteForRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

