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
  }

  export interface BangumiData {
    id: string;
    name: string;
    type: 'mp4' | 'm3u8';
    m3u8Url?: string;
    mp4Url?: string;
  }

  export const getList = async (): Promise<ResultListGenericVM<ListData>> => {
    const result = new ResultListGenericVM<ListData>();

    try {
      const { data: htmlString } = await axios.get<string>(config.domain);

      const $html = $(htmlString);

      const names = $html.find('#tablepress-1 .column-1 a');
      result.items = names.map((_i, el) => {
        const $el = $(el);
        return {
          id: ($el.attr('href') || '').replace('/?cat=', ''),
          name: $el.text(),
        } as ListData
      }).get();

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }

  export const getBangumi = async (id: string): Promise<ResultListGenericVM<BangumiData>> => {
    const result = new ResultListGenericVM<BangumiData>();

    try {
      const { data: htmlString } = await axios.get<string>(`${config.domain}/?cat=${id}`, {
        headers: {
          Cookie: "videopassword=1"
        },
        withCredentials: true
      });

      const $html = $(htmlString);

      const bangumis = $html.find('[id*="post-"]');

      result.items = bangumis.map((_i, el) => {
        const $el = $(el);
        const iframeSrc = $el.find('iframe').attr('src');
        const type = iframeSrc.includes('watch?v=') ? 'mp4' : 'm3u8';

        return {
          id: ($el.attr('id') || '').replace('post-', ''),
          name: $el.find('.entry-title').text(),
          type,
          m3u8Url: type === 'm3u8' ? iframeSrc + '.m3u8' : null,
          mp4Url: type === 'mp4' ? iframeSrc : null,
        } as BangumiData
      }).get();

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }

  export const getMp4Url = async (url: string): Promise<string> => {
    const { data: htmlString } = await axios.get<string>(url);

    const mathArr = htmlString.match(/(https|http):\/\/([a-z0-9|-]+\.)anime1(|\.[a-z0-9]+)\/\d{0,}\/\d\.mp4/)

    return mathArr ? mathArr[0] : '';
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