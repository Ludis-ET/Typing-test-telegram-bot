export interface User {
  id: string;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
}
