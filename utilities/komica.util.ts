import $ from 'cheerio';
import moment, { Moment } from 'moment';

import { ResultVM, ResultCode } from '../view-models/result.vm';
import axios from './axios.util';

export namespace NSKomica {
  export const config = {
    domain: 'http://2cat.komica.org',
    getUrl(board: string): string {
      return `${this.domain}/~tedc21thc/${board}/pixmicat.php`;
    }
  };

  export type boardType = 'live' | 'new';

  export class ListResultVM extends ResultVM {
    items!: PostData[];
    pages!: string[];
  }

  export class DetailsResultVM extends ResultVM {
    item!: PostData;
  }

  export interface PostData {
    id: string;
    title: string;
    text: string;
    email: string;
    oImg: string;
    sImg: string;
    name: string;
    dateTime: string;
    dateCreated: Moment | string;
    userId: string;
    warnText: string;
    reply: PostData[];
  }

  const getPostData = ($el: Cheerio): PostData => {
    const id = $el.attr('id').replace('r', '') || '';
    const title = $el.find('.title').text() || '';
    const text = $el.find('.quote').html() || '';
    const email = deCodeMailProtection($el.find('a[href*="email"]').attr('href'));
    const oImg = $el.find('a[href*=\'src\']').attr('href')
      ? `${config.domain}${$el.find('a[href*=\'src\']').attr('href')}`
      : '';
    let sImg = $el.find('img.img').attr('src') || '';
    if (sImg) {
      sImg = sImg.includes('nothumb') ? `${config.domain}/~tedc21thc/new/nothumb.gif` : `${config.domain}${sImg}`;
    }

    const name = $el.find('.name').text() || '';
    const label = $el
      .find(`label[for="${id}"]`)
      .text()
      .replace(title, '') || '';
    const dateTime = label.slice(label.indexOf('[') + 1, label.indexOf('ID') - 1) || '';
    const userId = label.slice(label.indexOf('ID') + 3, label.indexOf(']')) || '';
    const warnText = $el.find('.warn_txt2').text() || '';

    const date = dateTime.slice(0, dateTime.indexOf('('));
    const time = dateTime.slice(dateTime.indexOf(')') + 1);
    const dateCreated = moment(`20${date.replace(/\//g, '-')}T${time}`);

    return {
      id,
      title,
      text: text.replace(/onclick/g, str => `__${str}`),
      email,
      oImg,
      sImg,
      name,
      dateTime,
      dateCreated,
      userId,
      warnText,
      reply: []
    };
  };

  const deCodeMailProtection = (href: string): string => {
    if (!href) return '';

    const url = '/cdn-cgi/l/email-protection#';

    function r(e: string, t: number) {
      const r = e.substr(t, 2);
      return parseInt(r, 16);
    }
    function n(n: string, c: number) {
      let o = '';
      const a = r(n, c);
      for (let i = c + 2; i < n.length; i += 2) {
        const l = r(n, i) ^ a;
        o += String.fromCharCode(l);
      }

      return decodeURIComponent(escape(o));
    }

    return 'mailto: ' + n(href, url.length);
  };

  export const getKomicaListResult = async (type: boardType, page: number = 1): Promise<ListResultVM> => {
    const result = new ListResultVM();

    try {

      const { data: htmlString } = await axios.get<string>(config.getUrl(type), {
        params: {
          page_num: page - 1,
        }
      });

      const postDatas: PostData[] = [];
      const $html = $(htmlString);

      $html.find('.threadpost').each((_i, el) => {
        const $el = $(el);
        const temp = getPostData($el);
        const reply: PostData[] = [];

        $html.find('.reply').each((_i, rEl) => {
          const $rEl = $(rEl);

          if ($rEl.find(`.qlink[href*="res=${temp.id}"]`).length > 0) {
            const temp2 = getPostData($rEl);
            reply.push(temp2);
          }
        });

        temp.reply = reply;

        postDatas.push(temp);
      });

      const pages: string[] = [];
      $html
        .find('#page_switch')
        .find('a')
        .each((_i, el) => {
          pages.push($(el).attr('href'));
        });

      result.items = postDatas;
      result.pages = pages;

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  };

  export const getKomicaDetailsResult = async (type: boardType, resId: string): Promise<DetailsResultVM> => {

    const result = new DetailsResultVM();

    try {
      const { data: htmlString } = await axios.get<string>(config.getUrl(type), {
        params: {
          res: resId,
        }
      });

      const $html = $(htmlString);
      const postData: PostData = getPostData($html.find('.threadpost'));

      $html.find('.reply').each((_i, rEl) => {
        const $rEl = $(rEl);

        postData.reply.push(getPostData($rEl));
      });

      result.item = postData;

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  };
}
