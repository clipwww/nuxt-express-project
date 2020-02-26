import $ from 'cheerio';
import fs from 'fs';
import path from 'path';
import m3u8stream from 'm3u8stream';
import { ResultVM, ResultListGenericVM, ResultCode } from '../view-models/result.vm';
import axios from './axios.util';

export namespace NSAnime1 {

  export const config = {
    domain: 'https://anime1.me/'
  }

  export interface ListData {
    id: string;
    name: string;
    description?: string;
  }

  export interface BangumiData {
    id: string;
    name: string;
    type: 'mp4' | 'm3u8';
    m3u8Url?: string;
    mp4Url?: string;
    iframeSrc?: string;
    datePublished?: string;
  }

  export const getList = async (): Promise<ResultListGenericVM<ListData>> => {
    const result = new ResultListGenericVM<ListData>();

    try {
      const { data: htmlString } = await axios.get<string>(config.domain);

      const $html = $(htmlString);

      const names = $html.find('#tablepress-1 .column-1 a');
      const descriptions = $html.find('#tablepress-1 td.column-2');
      result.items = names.map((i, el) => {
        const $el = $(el);
        return {
          id: ($el.attr('href') || '').replace('/?cat=', ''),
          name: $el.text(),
          description: $(descriptions[i]).text()
        } as ListData
      }).get();

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }

  export const getBangumi = async (id: string): Promise<ResultListGenericVM<BangumiData>> => {
    const result = new ResultListGenericVM<BangumiData>();
    result.items = [];

    try {
      result.items.push(...await getAnimate(`${config.domain}/?cat=${id}`));

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }

  export const getAnimate = async (url: string): Promise<BangumiData[]> => {
    try {
      const { data: htmlString } = await axios.get<string>(url, {
        headers: {
          Cookie: "videopassword=1"
        },
        withCredentials: true
      });

      const items: BangumiData[] = [];
      const $html = $(htmlString);

      const bangumis = $html.find('[id*="post-"]');

      for (let i = 0; i < bangumis.length; i++) {
        const $el = $(bangumis[i]);
        const hasIframe = !!$el.find('iframe').length;
        const iframeSrc = hasIframe ? $el.find('iframe').attr('src') : $el.find('.loadvideo').attr('data-src');
        const type = hasIframe ? 'mp4' : 'm3u8';



        items.push({
          id: ($el.attr('id') || '').replace('post-', ''),
          name: $el.find('.entry-title').text(),
          type,
          iframeSrc,
          datePublished: $el.find('.published').attr('datetime') || null,
        } as BangumiData)
      }

      if ($html.has('.nav-previous')) {
        items.push(...await getAnimate($html.find('.nav-previous a').attr('href') as string))
      }

      return items;
    } catch (err) {
      return [];
    }
  }

  export const getM3u8Url = async (src: string): Promise<string> => {
    try {
      const { data: htmlString } = await axios.get<string>(src, {
        withCredentials: true
      });

      const $html = $(htmlString);
      const m3u8Url = $html.find('source').attr('src')

      return m3u8Url || '';
    } catch (err) {
      return '';
    }
  }

  export const getMp4Url = async (url: string): Promise<string> => {
    const { data: htmlString } = await axios.get<string>(url);

    // const mathArr = htmlString.match(/(https|http):\/\/([\w-]+\.)+[\w-]+([\w-./?%&=]*)\.mp4?/)
    // return mathArr ? mathArr[0] : '';

    const matchArr = htmlString.match(/d=([\S]+)\'/);
    const d = matchArr ? matchArr[0].replace('\'', '') : '';

    try {
      const { data: ret } = await axios.post('https://v.anime1.me/apiv2', d, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      if (!ret.success) {
        return '';
      }

      return `https:${ret.sources[0].file}`;
    } catch (err) {
      console.log(err.response.data);
      return '';
    }
  }


  export const m3u8toMP4 = async (m3u8Url: string): Promise<string> => {
    return new Promise((resolve) => {
      const timestamp = +new Date();
      const filePath = path.join(__dirname, `../video/${timestamp}.mp4`);
      const stream = m3u8stream(m3u8Url);

      stream.on('progress', (segment, totalSegments, downloaded) => {
        console.log(
          `${segment.num} of ${totalSegments} segments ` +
          `(${(segment.num / totalSegments * 100).toFixed(2)}%) ` +
          `${(downloaded / 1024 / 1024).toFixed(2)}MB downloaded`);
      });

      stream.on('end', () => {
        resolve(filePath);
      });

      stream.pipe(fs.createWriteStream(filePath))
    })

  }
}
