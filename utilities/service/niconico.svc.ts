import { BaseSVC } from './base.svc';
import { NSNiconico } from '../niconico.util';
import { ResultGenericVM } from '../../view-models/result.vm';

export class NiconicoSVC extends BaseSVC {
  baseURL = '/api/niconico';

  /**
   * [GET] /api/niconico/:service/:id
   * 取得[user|mylist|ranking]影片列表
   * @param {string} service 服務
   * @param {string} id 列表id
   */
  async getList(service: string, id: string) {
    const ret = await this.axiosInstance.get<ResultGenericVM<NSNiconico.IChannel>>(`${this.baseURL}/${service}/${id}`);
    return ret.data;
  }

  /**
   * [GET] /api/niconico/search/:service
   * 取得搜尋結果
   * @param {string} service 服務
   * @query {IQuery}
   */
  async search(service: string, params: NSNiconico.IQuery) {
    const ret = await this.axiosInstance.get<ResultGenericVM<NSNiconico.ISearchData>>(`${this.baseURL}/search/${service}`, {
      params,
    });
    return ret.data;
  }
}
