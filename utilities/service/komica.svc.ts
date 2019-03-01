import { BaseSVC } from './base.svc';
import { NSKomica } from '../komica.util';

export class KomicaSVC extends BaseSVC {
  baseURL = '/api/komica';

  /**
   * [GET] /api/komica/:board
   * 取得某看板討論串列表
   * @param {number} p 頁數
   */
  async getList(board: string, p = 1) {
    const ret = await this.axiosInstance.get<NSKomica.ListResultVM>(`${this.baseURL}/${board}`, {
      params: {
        p,
      }
    });
    return ret.data;
  }

  /**
   * [GET] /api/komica/:board/:id
   * 取得某看板討論串Details
   * @param {string} id 文章id
   */
  async getDetails(board: string, id: string) {
    const ret = await this.axiosInstance.get<NSKomica.DetailsResultVM>(`${this.baseURL}/${board}/${id}`);
    return ret.data;
  }
}
