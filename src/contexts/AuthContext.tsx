import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthState {
  isLoggedIn: boolean;
  role: "user" | "admin" | null;
  username: string | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem("healthwise_auth");
      return saved ? JSON.parse(saved) : { isLoggedIn: false, role: null, username: null };
    } catch {
      return { isLoggedIn: false, role: null, username: null };
    }
  });

  useEffect(() => {
    localStorage.setItem("healthwise_auth", JSON.stringify(auth));
  }, [auth]);

  const login = (username: string, password: string): boolean => {
    if (username === "user" && password === "123") {
      setAuth({ isLoggedIn: true, role: "user", username });
      return true;
    }
    if (username === "admin" && password === "123") {
      setAuth({ isLoggedIn: true, role: "admin", username });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, role: null, username: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
