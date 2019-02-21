import axios from 'axios';

const service = axios.create({
  baseURL: '',
  timeout: 15000,
});

export default service;
