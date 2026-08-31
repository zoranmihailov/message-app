import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data);
    return data;
  };

  const register = async (fields) => {
    const data = await registerUser(fields);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
    return useContext(AuthContext)
}
