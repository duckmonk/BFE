import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { getUserInfo, clearUserInfo } from '../utils/user';

// 使用与UserInfo相同的类型定义
interface User {
  userId: number;
  userName: string;
  userType: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      // 将UserInfo转换为User类型
      const user: User = {
        userId: userInfo.userId,
        userName: userInfo.userName,
        userType: userInfo.userType
      };
      setUser(user);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await userApi.login(email, password);
      // 确保API返回的数据符合User类型
      const user: User = {
        userId: response.data.userId,
        userName: response.data.userName,
        userType: response.data.userType
      };
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    userApi.logout().catch(console.error);
    clearUserInfo();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('context', context);
  return context;
}; 