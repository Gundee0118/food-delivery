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
        }
      );
      console.log("response", response.data.destructToken.userId);

      setUser({
        userId: response.data.destructToken.userId,
        isAdmin: response.data.destructToken.isAdmin,
      });
    } catch (err: any) {
      // router.push("/login");
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
