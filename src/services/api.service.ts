/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useCookies } from 'vue3-cookies';
import { STORAGE_AUTH_TOKEN } from '@/utils/constants';
import router from '@/router';
import { useErrorNotification } from '@/composables/useErrorNotification';
import { Routes } from '@/router/router.links';

const { LOGIN } = Routes;
let redirecting401 = false;

const getAxiosConfig = (config: AxiosRequestConfig) => {
  const updatedConfig = { ...config };
  if (!updatedConfig.headers) {
    updatedConfig.headers = {};
  }

  const { cookies } = useCookies();
  updatedConfig.headers.Authorization = `Bearer ${cookies.get(STORAGE_AUTH_TOKEN)}`;

  return updatedConfig as InternalAxiosRequestConfig;
};

export const defaultErrorHandler = async (error: any) => {
  const { cookies } = useCookies();
  const response = error?.response;

  useErrorNotification().showErrorNotification(response?.data?.error_message || response?.data || error);

  if (response?.status === 401) {
    if (!redirecting401) {
      redirecting401 = true;
      cookies.remove(STORAGE_AUTH_TOKEN);

      try {
        if (router.currentRoute.value.name !== LOGIN.name) {
          await router.replace({ name: LOGIN.name });
        }
      } catch (navErr: any) {
        if (navErr.name !== 'NavigationDuplicated') {
          console.error('Redirect to login failed:', navErr);
        }
      } finally {
        redirecting401 = false;
      }
    }

    return Promise.reject(error);
  }
  return Promise.reject(response?.data ?? error);
};

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = Axios.create({
      baseURL: `${process.env.VUE_APP_BASE_URL_NEW}/api/v1`, // ToDo: add base url from env or config
    });

    this.axiosInstance.interceptors.request.use(
      getAxiosConfig,
      (error) => Promise.reject(error),
    );
  }

  public async get(url: string, params?: any, isSilent = false) {
    if (!url) {
      throw new Error('URL is required to make a request');
    }
    try {
      const { data } = await this.axiosInstance.get(url, { params });
      return data;
    } catch (error) {
      if (isSilent) {
        return Promise.reject(error);
      }
      return defaultErrorHandler(error);
    }
  }

  async post(url: string, data?: any) {
    if (!url) {
      throw new Error('URL is required to make a request');
    }
    try {
      return await this.axiosInstance.post(url, data);
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  async delete(url: string, config?: any) {
    if (!url) {
      throw new Error('URL is required to make a request');
    }
    try {
      return await this.axiosInstance.delete(url, config);
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  async put(url: string, data?: any, params?: any) {
    if (!url) {
      throw new Error('URL is required to make a request');
    }
    try {
      return await this.axiosInstance.put(url, data, { params });
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  async loadBlobData(url: string, params?: any) {
    if (!url) {
      throw new Error('URL is required to make a request');
    }
    try {
      const { data } = await this.axiosInstance.get(url, {
        params,
        responseType: 'blob',
      });
      return data;
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }
}

export const ApiServiceInstance = new ApiService();
