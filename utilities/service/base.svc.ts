import axios from '../axios.util';
import { ResultVM } from '../../view-models/result.vm';
import { AxiosInstance, AxiosError } from 'axios';

export class BaseSVC {
  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios;

    this.axiosInstance.interceptors.request.use(config => {
      window.$nuxt.$loading.start();
      return config;
    },
      (err: AxiosError) => {
        const ret = new ResultVM();
        return ret.setResultValue(false, err.code, err.message);
      });

    this.axiosInstance.interceptors.response.use(res => {
      window.$nuxt.$loading.finish();
      return res;
    },
      (err: AxiosError) => {
        const ret = new ResultVM();
        return ret.setResultValue(false, err.code, err.message);
      });

  }
}
