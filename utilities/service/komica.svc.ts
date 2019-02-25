import { BaseSVC } from './base.svc';
import { NSKomica } from '../komica.util';

export class KomicaSVC extends BaseSVC {
  baseURL = '/api/komica';

  /**
   * [GET] /api/komica/live
   * 取得新番實況列表
   * @param {number} p 頁數
   */
  async getLiveList(p = 1) {
    const ret = await this.axiosInstance.get<NSKomica.ListResultVM>(`${this.baseURL}/live`, {
      params: {
        p,
      }
    });
    return ret.data;
  }
}
