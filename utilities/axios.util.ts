import axios, { AxiosRequestConfig } from 'axios';

const defaultConfig: AxiosRequestConfig = {
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  }
};

const service = axios.create(defaultConfig);

export default service;
