"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import {
  PropsWithChildren,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";

type UserData = {
  userId: string;
  isAdmin: boolean;
};
type AuthContextType = {
  user: UserData | null;
  tokenChecker: (_token: string) => Promise<void>;
};
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  const tokenChecker = async (token: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // 10 seconds timeout
        }
      );
      console.log("response", response.data.destructToken.userId);

      setUser({
        userId: response.data.destructToken.userId,
        isAdmin: response.data.destructToken.isAdmin,
      });
    } catch (err: any) {
      console.error("Token verification failed:", err);
      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNREFUSED") {
          console.error(
            "Backend server is not running. Please start the server."
          );
        } else if (err.code === "ERR_NETWORK") {
          console.error("Network error. Please check your connection.");
        } else if (err.response?.status === 401) {
          console.error("Token is invalid or expired");
          localStorage.removeItem("token");
          router.push("/login");
        }
      }
    }
  };
  console.log(user);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      tokenChecker(token);
    } else {
      // router.push("/login");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, tokenChecker }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext<AuthContextType>(AuthContext);
