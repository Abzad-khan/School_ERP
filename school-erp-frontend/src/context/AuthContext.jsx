import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (data) => {
    const res = await api.post("/auth/login", data);
    setUser(res.data);
    return res.data;
  };

  const register = async (data) => {
    return api.post("/auth/register", data);
  };

  return (
    <AuthContext.Provider value={{ user, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
