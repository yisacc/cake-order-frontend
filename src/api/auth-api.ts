import axios from 'axios';
import { GenericResponse, ILoginResponse, IUserResponse, LoginInput, RegisterInput } from './types';
const BASE_URL = import.meta.env.VITE_BASE_URL;

function getCookie(cname: string) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(name: string, value: string) {
  document.cookie = name + "=" + (value || "");
}

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const token = getCookie('access_token');
if (token) {
  authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
authApi.defaults.headers.common['Content-Type'] = 'application/json';

export const refreshAccessTokenFn = async () => {
  const refreshToken = getCookie('refresh_token');
  if (!refreshToken) {
    return;
  }
  const response = await authApi.post<ILoginResponse>('auth/refresh-tokens', { refreshToken: refreshToken });
  if (response.data.tokens.access.token) {
    setCookie('access_token', response.data.tokens.access.token);
    authApi.defaults.headers.common["Authorization"] = `Bearer ${response.data.tokens.access.token}`;
  }
  if (response.data.tokens.refresh.token) {
    setCookie('refresh_token', response.data.tokens.refresh.token);
  }
  return response.data;
};

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errMessage = error.response.data.message as string;
    if (errMessage.includes('Please authenticate') && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessTokenFn();
      return authApi(originalRequest);
    }
    return Promise.reject(error);
  }
);
export const signUpUserFn = async (user: RegisterInput) => {
  const response = await authApi.post<ILoginResponse>('auth/register', user);
  return response.data;
};

export const loginUserFn = async (user: LoginInput) => {
  const response = await authApi.post<ILoginResponse>('auth/login', user);
  return response.data;
};


export const logoutUserFn = async () => {
  const refreshToken = getCookie('refresh_token');
  if (!refreshToken) {
    return;
  }
  const response = await authApi.post<GenericResponse>('auth/logout', { refreshToken: refreshToken });
  return response.data;
};


export const getMeFn = async () => {
  const response = await authApi.get<IUserResponse>('auth/me');
  return response.data;
};