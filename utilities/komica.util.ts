import { ResultVM, ResultCode } from '../view-models/result.vm';
import axios from './axios.util';
import $ from 'cheerio';

export namespace NSKomica {
  export const config = {
    domain: 'http://2cat.komica.org',
    live: 'https://2cat.komica.org/~tedc21thc/live/pixmicat.php',
    new: 'https://2cat.komica.org/~tedc21thc/new/pixmicat.php',
  };

  export type boardType = 'live' | 'new';

  export class ListResultVM extends ResultVM {
    items!: IPostData[];
    pages!: string[];
  }

  export class DetailsResultVM extends ResultVM {
    item!: IPostData;
  }

  export const pageMapping = {
    1: 'index.html',
    2: '1.htm',
    3: '2.html',
    4: '3.html',
    5: 'pixmicat.php?page_num=5'
  };

  export interface IPostData {
    id: string;
    title: string;
    text: string;
    email: string;
    oImg: string;
    sImg: string;
    name: string;
    dateTime: string;
    userId: string;
    warnText: string;
    reply: IPostData[];
  }

  const getPostData = ($el: Cheerio): IPostData => {
    const id = $el.attr('id').replace('r', '') || '';
    const title = $el.find('.title').text() || '';
    const text = $el.find('.quote').html() || '';
    const email = deCodeMailProtection($el.find('a[href*="email"]').attr('href'));
    const oImg = $el.find('a[href*=\'src\']').attr('href')
      ? `${config.domain}${$el.find('a[href*=\'src\']').attr('href')}`
      : '';
    const sImg = $el.find('img.img').attr('src') ? `${config.domain}${$el.find('img.img').attr('src')}` : '';
    const name = $el.find('.name').text() || '';
    const label = $el
      .find(`label[for="${id}"]`)
      .text()
      .replace(title, '') || '';
    const dateTime = label.slice(label.indexOf('[') + 1, label.indexOf('ID') - 1) || '';
    const userId = label.slice(label.indexOf('ID') + 3, label.indexOf(']')) || '';
    const warnText = $el.find('.warn_txt2').text() || '';

    return {
      id,
      title,
      text: text.replace(/onclick/g, str => `__${str}`),
      email,
      oImg,
      sImg,
      name,
      dateTime,
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

      const { data: htmlString } = await axios.get<string>(config[type], {
        params: {
          page_num: page,
        }
      });

      const postDatas: IPostData[] = [];
      const $html = $(htmlString);

      $html.find('.threadpost').each((_i, el) => {
        const $el = $(el);
        const temp = getPostData($el);
        const reply: IPostData[] = [];

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
      const { data: htmlString } = await axios.get<string>(config[type], {
        params: {
          res: resId,
        }
      });

      const $html = $(htmlString);
      const postData: IPostData = getPostData($html.find('.threadpost'));

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
