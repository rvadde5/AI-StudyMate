import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user._id,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? normalizeUser(JSON.parse(stored)) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI
        .getProfile()
        .then((res) => {
          const normalized = normalizeUser(res.data.data.user);
          setUser(normalized);
          localStorage.setItem('user', JSON.stringify(normalized));
          if (typeof normalized?.preferences?.darkMode === 'boolean') {
            localStorage.setItem('darkMode', JSON.stringify(normalized.preferences.darkMode));
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const persistUser = (userData) => {
    const normalized = normalizeUser(userData);
    localStorage.setItem('user', JSON.stringify(normalized));
    setUser(normalized);
    return normalized;
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { user: userData, token } = res.data.data;
    localStorage.setItem('token', token);
    const normalized = persistUser(userData);
    if (typeof normalized?.preferences?.darkMode === 'boolean') {
      localStorage.setItem('darkMode', JSON.stringify(normalized.preferences.darkMode));
    }
    return normalized;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { user: userData, token } = res.data.data;
    localStorage.setItem('token', token);
    return persistUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = normalizeUser({ ...prev, ...updates });
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateUser, isAdmin: user?.role === 'admin' }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
