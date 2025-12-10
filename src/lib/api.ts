import axios from 'axios';

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:3001';

// 모든 요청에서 /api prefix 사용
export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('testnav_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // 만료된 토큰 정리
      localStorage.removeItem('testnav_token');
    }
    return Promise.reject(error);
  }
);

export default api;
