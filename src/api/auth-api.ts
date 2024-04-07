import axios from 'axios';
import { GenericResponse, ILoginResponse, IUserResponse, LoginInput, RegisterInput } from './types';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

authApi.defaults.headers.common['Content-Type'] = 'application/json';

export const refreshAccessTokenFn = async () => {
  const response = await authApi.get<ILoginResponse>('auth/refresh-token');
  return response.data;
};

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errMessage = error.response.data.message as string;
    if (errMessage.includes('not logged in') && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessTokenFn();
      return authApi(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const signUpUserFn = async (user: RegisterInput) => {
  const response = await authApi.post<GenericResponse>('auth/register', user);
  return response.data;
};

export const loginUserFn = async (user: LoginInput) => {
  const response = await authApi.post<ILoginResponse>('auth/login', user);
  return response.data;
};


export const logoutUserFn = async () => {
  const response = await authApi.get<GenericResponse>('auth/logout');
  return response.data;
};


export const getMeFn = async () => {
  const response = await authApi.get<IUserResponse>('auth/me');
  return response.data;
};