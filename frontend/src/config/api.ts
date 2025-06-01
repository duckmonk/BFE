// API基础URL
export const BASE_URL = 'http://localhost:8080/api';

// API路径配置
export const API_PATHS = {
  CONTACT: `/contact-me`,
  INQUIRY: `/inquiry`,
  INFO_COLL: `/info-coll`,
  CLIENT_CASE: `/client-case`,
  TASK: `/task`,
  // 其他API路径可以在这里添加
  // AUTH: `${BASE_URL}/auth`,
  // USER: `${BASE_URL}/user`,
  // 等等...
} as const;

