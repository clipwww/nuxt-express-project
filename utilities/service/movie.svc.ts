import { BaseSVC } from './base.svc';
import { NSMovie } from '../movie.util';
import { ResultListGenericVM } from '../../view-models/result.vm';

export class MovieSVC extends BaseSVC {
  baseURL = '/api/movie';

  /**
   * [GET] /api/movie/list
   * 取得上映中電影列表
   */
  async getList() {
    const ret = await this.axiosInstance.get<ResultListGenericVM<{ id: string, name: string }>>(`${this.baseURL}/list`);
    return ret.data;
  }

  /**
   * [GET] /api/movie/city
   * 取得開眼電影縣市列表
   */
  async getCity() {
    const ret = await this.axiosInstance.get<ResultListGenericVM<{ id: string, name: string }>>(`${this.baseURL}/city`);
    return ret.data;
  }

  /**
   * [GET] /api/movie/:movieId/:cityId
   * 取得某縣市某電影的各影院時刻表
   * @param {string} movieId
   * @param {string} cityId
   */
  async getTimes(movieId, cityId) {
    const ret = await this.axiosInstance.get<NSMovie.MovieTimesResult>(`${this.baseURL}/times/${movieId}/${cityId}`);
    return ret.data;
  }
}
