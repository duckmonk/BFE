import axios from 'axios';
import { API_PATHS, BASE_URL } from '../config/api';

// 创建axios实例
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 关键配置
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在这里可以添加token等认证信息
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 统一错误处理
    const message = error.response?.data?.message || '请求失败，请稍后重试';
    return Promise.reject(new Error(message));
  }
);

// API方法
export const contactApi = {
  submit: async (data: any): Promise<any> => {
    return api.post(`${API_PATHS.CONTACT}/save`, data);
  },
};

// API方法
export const inquiryApi = {
  submit: async (data: any): Promise<any> => {
    return api.post(`${API_PATHS.INQUIRY}/save`, data);
  },
  getInquiries: (params?: { dateStart?: number; dateEnd?: number }) => {
    return api.get(`${API_PATHS.INQUIRY}/page`, { params });
  }
};

export const clientCaseApi = {
  getCurrentCase: async (): Promise<any> => {
    return api.get(`${API_PATHS.CLIENT_CASE}/current`);
  },
  getCaseByUserId: async (userId: number): Promise<any> => {
    return api.get(`${API_PATHS.CLIENT_CASE}/user/${userId}`);
  },
  getCaseById: async (clientCaseId: number): Promise<any> => {
    return api.get(`${API_PATHS.CLIENT_CASE}/${clientCaseId}`);
  },
  getCases: async (params?: { current?: number; size?: number; dateStart?: number; dateEnd?: number }): Promise<any> => {
    return api.get(`${API_PATHS.CLIENT_CASE}/page`, { params });
  }
};

export const infoCollApi = {
  submitBasicInfo: async (data: any): Promise<any> => {
    return api.post(`${API_PATHS.INFO_COLL}/basic-info/upsert`, data);
  },
  getBasicInfo: async (clientCaseId: number): Promise<any> => {
    return api.get(`${API_PATHS.INFO_COLL}/basic-info/case/${clientCaseId}`);
  },
  submitSpouseInfo: async (data: any): Promise<any> => {
    return api.post(`${API_PATHS.INFO_COLL}/spouse-info/upsert`, data);
  },
  getSpouseInfo: async (clientCaseId: number): Promise<any> => {
    return api.get(`${API_PATHS.INFO_COLL}/spouse-info/case/${clientCaseId}`);
  },
  submitChildrenInfo: async (data: any): Promise<any> => {
    return api.post(`${API_PATHS.INFO_COLL}/children-info/upsert`, data);
  },
  getChildrenInfo: async (clientCaseId: number): Promise<any> => {
    return api.get(`${API_PATHS.INFO_COLL}/children-info/case/${clientCaseId}`);
  },
  submitResume: async (data: any): Promise<any> => {
    return api.post(`${API_PATHS.INFO_COLL}/resume/upsert`, data);
  },
  getResume: async (clientCaseId: number): Promise<any> => {
    return api.get(`${API_PATHS.INFO_COLL}/resume/case/${clientCaseId}`);
  },
  getAcademicHistory: (clientCaseId: number) => {
    return api.get(`${API_PATHS.INFO_COLL}/academic-history/case/${clientCaseId}`);
  },
  submitAcademicHistory: (data: any) => {
    return api.post(`${API_PATHS.INFO_COLL}/academic-history/upsert`, data);
  },
  getEmploymentHistory: async (clientCaseId: number): Promise<any> => {
    return api.get(`${API_PATHS.INFO_COLL}/employment-history/case/${clientCaseId}`);
  },
  submitEmploymentHistory: async (data: any): Promise<any> => {
    return api.post(`${API_PATHS.INFO_COLL}/employment-history/upsert`, data);
  },
  getRecommender: async (clientCaseId: number): Promise<any> => {
    return api.get(`${API_PATHS.INFO_COLL}/recommender/case/${clientCaseId}`);
  },
  submitRecommender: async (data: {
    id?: number;
    clientCaseId: number;
    recommenders: Array<{
      id?: number;
      clientCaseId: number;
      name: string;
      resume: string;
      type: string;
      code: string;
      pronoun: string;
      note: string;
      linkedContributions: string[];
      relationship: string;
      relationshipOther: string;
      company: string;
      department: string;
      title: string;
      meetDate: Date | null;
      evalAspects: string[];
      evalAspectsOther: string;
      independentEval: string;
      characteristics: string;
      relationshipStory: string;
    }>;
  }): Promise<any> => {
    return api.post(`${API_PATHS.INFO_COLL}/recommender/upsert`, data);
  },
  getRecommenderNames: (clientCaseId: number) => {
    return api.get(`${API_PATHS.INFO_COLL}/recommender/names/${clientCaseId}`);
  },
  getNiwPetition: async (clientCaseId: number): Promise<any> => {
    return api.get(`${API_PATHS.INFO_COLL}/niw-petition/case/${clientCaseId}`);
  },
  submitNiwPetition: async (data: {
    id?: number;
    clientCaseId: number;
    userPath: string;
    contributions: Array<{
      id?: number;
      contributionTitle: string;
      fundingReceived: string;
      impact: string;
      industryAdoption: string;
      publication: string;
      fundings?: Array<{
        id?: number;
        fundingCategory: string;
        fundingLinks: string;
        fundingAttachments: string;
        fundingRemarks: string;
      }>;
    }>;
  }): Promise<any> => {
    return api.post(`${API_PATHS.INFO_COLL}/niw-petition/upsert`, data);
  },
  getContributions: async (clientCaseId: number): Promise<any> => {
    return api.get(`${API_PATHS.INFO_COLL}/niw-petition/contributions/${clientCaseId}`);
  },
  getFinalQuestionnaire: async (clientCaseId: number): Promise<any> => {
    return api.get(`${API_PATHS.INFO_COLL}/final-questionnaire/case/${clientCaseId}`);
  },
  submitFinalQuestionnaire: async (data: {
    id?: number;
    clientCaseId: number;
    respondents: string;
    changesSelected: string[];
    passportChanges: string;
    passportDocuments: string;
    addressChanges: string;
    employerChanges: string;
    i94Changes: string;
    i94Documents: string;
    marriageStatus: string;
    spouseSubmission: string;
    childrenStatus: string;
    childrenSubmission: string;
    immigrationUpdates: string;
    immigrationDocuments: string;
  }): Promise<any> => {
    return api.post(`${API_PATHS.INFO_COLL}/final-questionnaire/upsert`, data);
  },
};


export const taskApi = {
  getEndeavorSubmission: async (clientCaseId: number): Promise<any> => {
    return api.get(`${API_PATHS.TASK}/endeavor-submission/case/${clientCaseId}`);
  },
  submitEndeavorSubmission: async (data: any): Promise<any> => {
    return api.post(`${API_PATHS.TASK}/endeavor-submission/upsert`, data);
  },
  getNationalImportance: async (clientCaseId: number): Promise<any> => {
    return api.get(`${API_PATHS.TASK}/national-importance/case/${clientCaseId}`);
  },
  submitNationalImportance: async (data: any): Promise<any> => {
    return api.post(`${API_PATHS.TASK}/national-importance/upsert`, data);
  },
  getFuturePlan: (clientCaseId: number) => {
    return api.get(`${API_PATHS.TASK}/future-plan/case/${clientCaseId}`);
  },
  submitFuturePlan: (data: {
    clientCaseId: number;
    futureplanDraft: string;
    futureplanShort: string;
    futureplanLong: string;
    futureplanReferees: string[];
    futureplanFeedback: string;
    futureplanSubmitDraft: string;
    futureplanConfirm: string;
  }) => {
    return api.post(`${API_PATHS.TASK}/future-plan/upsert`, data);
  },
  getSubstantialMerits: (clientCaseId: number) => {
    return api.get(`${API_PATHS.TASK}/substantial-merits/case/${clientCaseId}`);
  },
  submitSubstantialMerits: (data: {
    id?: number;
    clientCaseId: number;
    draft: string;
    overall: string;
    confirm: string;
  }) => {
    return api.post(`${API_PATHS.TASK}/substantial-merits/upsert`, data);
  },
  getRecommendationLetters: (clientCaseId: number) => {
    return api.get(`${API_PATHS.TASK}/recommendation-letter/case/${clientCaseId}`);
  },
  submitRecommendationLetters: (data: Array<{
    id?: number;
    refereeId?: number;
    clientCaseId: number;
    refereeName: string;
    rlDraft: string;
    rlOverallFeedback: string;
    rlConfirm: string;
    rlSignedLetter: string;
  }>) => {
    return api.post(`${API_PATHS.TASK}/recommendation-letter/upsert`, data);
  },
  getWellPositioned: (clientCaseId: number) => {
    return api.get(`${API_PATHS.TASK}/well-positioned/case/${clientCaseId}`);
  },
  submitWellPositioned: (data: {
    id?: number;
    clientCaseId: number;
    draft: string;
    overall: string;
    confirm: string;
  }) => {
    return api.post(`${API_PATHS.TASK}/well-positioned/submit`, data);
  },
  getBalancingFactors: (clientCaseId: number) => {
    return api.get(`${API_PATHS.TASK}/balancing-factors/case/${clientCaseId}`);
  },
  submitBalancingFactors: (data: {
    id?: number;
    clientCaseId: number;
    draft: string;
    overall: string;
    confirm: string;
  }) => {
    return api.post(`${API_PATHS.TASK}/balancing-factors/submit`, data);
  }
};

// 可以添加其他API模块
export const userApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.get(`/user/doLogin`, {
        params: {
          email,
          password
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  isLogin: async () => {
    return api.get(`/user/isLogin`);
  },
  logout: async () => {
    return api.get(`/user/logout`);
  },
  createUserByInquiry: async (data: { inquiryId: number; email: string; name: string }) => {
    return api.post('/user/createByInquiry', data);
  }
};

export const caseApi = {
  getCases: () => {
    return api.get('/api/cases');
  }
};

export const latexApi = {
  renderLatex: async (latex: string): Promise<{ png: string; pdf: string }> => {
    const response = await api.post('/latex/render', latex, {
      headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
  }
};
