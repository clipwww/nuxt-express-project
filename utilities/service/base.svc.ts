import axios from '../axios.util';
import { ResultVM } from '../../view-models/result.vm';
import { AxiosInstance, AxiosError } from 'axios';

export class BaseSVC {
  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios;

    this.axiosInstance.interceptors.response.use(res => res, (err: AxiosError) => {
      const ret = new ResultVM();
      return ret.setResultValue(false, err.code, err.message);
    });
  }
}
