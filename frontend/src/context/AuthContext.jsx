import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ssp_token'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('ssp_token')));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getProfile()
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('ssp_token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleAuthSuccess = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem('ssp_token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (payload) => {
    const { data } = await authApi.login(payload);
    handleAuthSuccess(data);
    return data;
  };

  const verifyRegistration = async (payload) => {
    const { data } = await authApi.verifyRegisterOtp(payload);
    handleAuthSuccess(data);
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // No-op if token already expired.
    } finally {
      localStorage.removeItem('ssp_token');
      setToken(null);
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    const { data } = await authApi.getProfile();
    setUser(data.user);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const { data } = await authApi.updateProfile(payload);
    setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token),
        login,
        verifyRegistration,
        logout,
        refreshProfile,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
