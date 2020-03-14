import $ from 'cheerio';
import moment, { Moment } from 'moment';

import { ResultVM, ResultCode, ResultListGenericVM } from '../view-models/result.vm';
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
    item?: {
      title: string,
      url: string;
    };
    items!: PostData[];
    pages!: string[];
    page?: {
      index: number;
      pageAmount: number;
    }
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
    url?: string;
  }

  const getPostData = ($el: Cheerio): PostData => {
    const id = ($el.attr('id') || '').replace('r', '') || '';
    const title = $el.find('.title').text() || '';
    const text = $el.find('.quote').html() || '';
    const email = deCodeMailProtection($el.find('a[href*="email"]').attr('href') as string);
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

  export const getKomicaListResult = async (type: boardType | string, page: number = 1): Promise<ListResultVM> => {
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
          pages.push($(el).attr('href') as string);
        });

      result.items = postDatas;
      result.pages = pages;
      result.page = {
        index: +page,
        pageAmount: pages.length
      }
      result.item = {
        title: $html.find('h1').text(),
        url: config.getUrl(type)
      }

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  };

  export const getKomicaAllPostResult = async (type: boardType | string, page = 1): Promise<ResultListGenericVM<any>> => {
    const result = new ResultListGenericVM<any>();

    try {

      const { data: htmlString } = await axios.get<string>(config.getUrl(type), {
        params: {
          mode: 'module',
          load: 'mod_threadlist',
          sort: 'date',
          page: page - 1,
        }
      });

      const $html = $(htmlString);
      const $tr = $html.find('form table tr:not(:nth-child(1))');

      result.item = {
        title: $html.find('h1').text(),
        url: config.getUrl(type) + `?mode=module&load=mod_threadlist&sort=date`,
      }
      result.items = $tr.map((i, el) => {
        const $el = $(el);
        const label = $el.find('td:nth-child(6)').text();
        const dateTime = label.slice(0, label.indexOf('ID') - 1) || '';

        const date = dateTime.slice(0, dateTime.indexOf('('));
        const time = dateTime.slice(dateTime.indexOf(')') + 1);
        const dateCreated = moment(`20${date.replace(/\//g, '-')}T${time}`);

        return {
          id: $el.find('input').attr('name'),
          title: $el.find('a').text(),
          replyCount: $el.find('td:nth-child(5)').text(),
          dateTime,
          dateCreated,
        }
      }).get();

      const $next = $html.find('#page_switch table tr td:last-child a');
      if ($next.length) {
        page += 1;
        const ret = await getKomicaAllPostResult(type, page);
        result.items = result.items.concat(ret.items);
      }

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  };

  export const getKomicaDetailsResult = async (type: boardType | string, resId: string): Promise<DetailsResultVM> => {

    const result = new DetailsResultVM();

    try {
      const { data: htmlString } = await axios.get<string>(config.getUrl(type), {
        params: {
          res: resId,
        }
      });

      const $html = $(htmlString);
      const $threadpost = $html.find('.threadpost');

      if (!$threadpost.length) {
        throw Error('該当記事がみつかりません');
      }

      const postData: PostData = getPostData($threadpost);

      $html.find('.reply').each((_i, rEl) => {
        const $rEl = $(rEl);

        postData.reply.push(getPostData($rEl));
      });

      result.item = postData;
      result.item['url'] = config.getUrl(type) + `?res=${resId}`

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  };
}
