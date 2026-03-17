import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_URL = "http://localhost:3001/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("civicUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("civicToken") || null;
  });

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("civicUser", JSON.stringify(user));
      localStorage.setItem("civicToken", token);
    } else {
      localStorage.removeItem("civicUser");
      localStorage.removeItem("civicToken");
    }
  }, [user, token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      if (res.data.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
    return { success: false, message: "Login failed" };
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/signup`, { username, email, password, role: "user" });
      if (res.data.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Signup failed" };
    }
    return { success: false, message: "Signup failed" };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const getToken = () => token;

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, getToken, isAdmin: user?.role === "admin" || user?.isAdmin || false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
