import { createContext, useContext, useState } from "react";
import { fakeLogin } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (username, password, role) => {
    const loggedInUser = await fakeLogin(username, password, role);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
