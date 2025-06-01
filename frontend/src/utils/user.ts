interface UserInfo {
  userId: number;
  userName: string;
  userType: string;
  userEmail: string;
}

export const saveUserInfo = (data: any) => {
  localStorage.setItem('user', JSON.stringify({
    userId: data.userId,
    userName: data.userName,
    userType: data.userType,
    userEmail: data.userEmail
  }));
};

export const getUserInfo = (): UserInfo | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

export const getUserType = () => {
  const userInfo = getUserInfo();
  return userInfo?.userType || null;
};

export const getUserEmail = () => {
  const userInfo = getUserInfo();
  return userInfo?.userEmail || '';
};

export const getUserName = () => {
  const userInfo = getUserInfo();
  return userInfo?.userName || '';
};

export const clearUserInfo = () => {
  localStorage.removeItem('user');
}; 