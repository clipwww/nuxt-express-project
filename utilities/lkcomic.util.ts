import $ from 'cheerio';
import moment from 'moment';
import { tify } from 'chinese-conv';

import { ResultListGenericVM, ResultCode } from '../view-models/result.vm';
import axios from './axios.util';

export namespace NSLKComic {
  export const config = {
    domain: 'https://www.lightnovel.cn'
  }

  export class DetailsResultVM<T> extends ResultListGenericVM<T> {
    item!: {
      title: string;
    }
  }

  export const getList = async (page: number = 1): Promise<ResultListGenericVM<any>> => {
    const result = new ResultListGenericVM<any>();

    try {

      const { data: htmlString } = await axios.get<string>(`${config.domain}/forum-141-${page}.html`);

      const $html = $(htmlString);
      const $tbodys = $html.find(`[id^=normalthread_]`);
      result.items = $tbodys.map((i, el) => {
        const $el = $(el);
        const $aTag = $el.find(`a[onclick*=atarget]`);

        return {
          id: ($aTag.attr('href') || '').replace('.html', ''),
          title: tify($aTag.text()), // 轉繁體中文
          originUrl: `${config.domain}/${$aTag.attr('href')}`,
          datePost: moment($el.find('.by .xi1').text(), 'YYYY-MM-DD HH:mm'),
        }
      }).get();


      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }

  export const getDetails = async (id: string): Promise<DetailsResultVM<{ id: string; src: string }>> => {
    const result = new DetailsResultVM<{ id: string; src: string }>();

    try {

      const { data: htmlString } = await axios.get<string>(`${config.domain}/${id}.html`);
      const $html = $(htmlString);
      const $imgs = $html.find('img.zoom');

      result.items = $imgs.map((i, el) => {
        const $el = $(el);

        return {
          id: $el.attr('id'),
          src: $el.attr('file') || $el.attr('src'),
        }
      }).get();

      result.item = {
        title: $html.find('#thread_subject').text()
      }

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }
}
