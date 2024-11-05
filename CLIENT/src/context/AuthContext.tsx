import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import queryString from "query-string";
import { getUserFromFirestore, addUserToFirestore } from "../utils/firestoreService";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { userId, userName } = queryString.parse(window.location.search);

      if (userId && userName) {
        const existingUser = await getUserFromFirestore(userId as string);
        if (existingUser) {
          setUser(existingUser as User);
        } else {
          await addUserToFirestore(userId as string, userName as string);
          setUser({ id: userId as string, username: userName as string });
        }
      }
    };
    fetchUser();
  }, []);

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;