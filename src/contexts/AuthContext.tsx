import { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserData extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, resetCode: string, newPassword: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  forgotPassword: async () => false,
  resetPassword: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage for user session on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem('users') || '[]') as UserData[];
    const user = users.find((u) => u.email === email);
    
    if (user && user.password === password) {
      const userData = { id: user.id, name: user.name, email: user.email };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]') as UserData[];
    
    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return false;
    }
    
    // Create new user
    const newUser: UserData = {
      id: `user_${Date.now()}`,
      name,
      email,
      password, // In a real app, this would be hashed
    };
    
    // Save to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after registration
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem('users') || '[]') as UserData[];
    const user = users.find((u) => u.email === email);
    
    if (user) {
      // In a real app, this would send an email with a reset link
      // For demo purposes, we'll store a reset code in localStorage
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem(`resetCode_${email}`, resetCode);
      console.log(`Reset code for ${email}: ${resetCode}`);
      return true;
    }
    
    return false;
  };

  const resetPassword = async (email: string, resetCode: string, newPassword: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check reset code
    const storedResetCode = localStorage.getItem(`resetCode_${email}`);
    if (!storedResetCode || storedResetCode !== resetCode) {
      return false;
    }
    
    // Update password
    const users = JSON.parse(localStorage.getItem('users') || '[]') as UserData[];
    const userIndex = users.findIndex((u) => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.removeItem(`resetCode_${email}`);
      return true;
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      forgotPassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};