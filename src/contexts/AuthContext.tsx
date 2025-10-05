
import { createContext, useState } from "react";

interface User {
  userId: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  creditPoints?: number;
  currentRank?: string;
  farmHealth?: number;
  activeNeighbors?: number;
  nearestMarket?: { name: string; distance: number };
}

export const AuthContext = createContext<{
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => void;
} | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (userData: User) => {
    setUser(userData);
    // Fetch additional user profile data after login
    await fetchUserProfile(userData.userId);
  };

  const logout = () => {
    setUser(null);
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/dashboard/${userId}`);
      if (response.ok) {
        const profileData = await response.json();
        setUser((prevUser: any) => prevUser ? ({
          ...prevUser,
          ...profileData
        }) : null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
