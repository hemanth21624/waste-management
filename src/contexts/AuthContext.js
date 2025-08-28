
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wm_user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("wm_user", JSON.stringify(user));
    else localStorage.removeItem("wm_user");
  }, [user]);

  
  const login = async ({ username, remember }) => {
    
    await new Promise((r) => setTimeout(r, 400));
    const profile = {
      name: username,
      points: (JSON.parse(localStorage.getItem("wm_profile") || "{}").points) || 0,
      loggedAt: Date.now(),
    };
    setUser(profile);
    if (remember) localStorage.setItem("wm_user", JSON.stringify(profile));
    return profile;
  };

  const logout = () => {
    setUser(null);
  
    localStorage.removeItem("wm_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
