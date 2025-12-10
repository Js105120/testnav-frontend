import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import api from "../lib/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    name: string,
    userType?: string
  ) => Promise<boolean>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "testnav_token";

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 최초 로드 시 토큰 검증
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get("/auth/me");

      if (data?.user) {
        setUser(normalizeUser(data.user));
      }
    } catch (error) {
      console.error("Error checking user:", error);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 로그인 함수
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", { email, password });

      if (data?.token && data?.user) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setUser(normalizeUser(data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 회원가입
  const register = async (
    email: string,
    password: string,
    name: string,
    userType: string = "student"
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/signup", {
        email,
        password,
        name,
        user_type: userType,
      });

      if (data?.token && data?.user) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setUser(normalizeUser(data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  // 🔥 관리자 판정 — user.user_type 만 사용해라
  const isAdmin = user?.user_type === "admin";

  // 🔥 user 데이터 정규화 — 백엔드 구조 그대로 사용
  const normalizeUser = (raw: any): User => ({
    id: String(raw.id),
    email: raw.email,
    name: raw.name,
    role: raw.user_type,
    user_type: raw.user_type,
    created_at: raw.created_at,
  });

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, loading, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}
