"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  role: string | null;
  login: (role?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  initialLogin = false,
  initialRole = null,
}: {
  children: ReactNode;
  initialLogin?: boolean;
  initialRole?: string | null;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialLogin);
  const [role, setRole] = useState<string | null>(initialRole);

  const login = (roleParam?: string) => {
    setIsLoggedIn(true);
    if (roleParam) setRole(roleParam);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    // Hapus cookie saat logout
    document.cookie = "user_id=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
