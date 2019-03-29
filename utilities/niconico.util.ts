import { ResultCode, ResultListGenericVM, ResultGenericVM } from '../view-models/result.vm';
import axios from './axios.util';
import { AxiosError } from 'axios';
import moment from 'moment';
import xmlParser from 'xml2json';
import $ from 'cheerio';

export namespace NSNiconico {

  const config = {
    domain: 'http://www.nicovideo.jp',
    getUrl(service: string, id: string) {
      switch (service) {
        case 'user':
          return `${this.domain}/user/${id}/video?rss=2.0`;
        case 'mylist':
          return `${this.domain}/mylist/${id}?rss=2.0`;
        case 'ranking':
        default:
          return `${this.domain}/ranking/fav/${id}/all?rss=2.0`;
      }
    }
  };

  export type Service =
    'video' | 'live' | 'illust' | 'manga' | 'channel' |
    'channelarticle' | 'news' | 'game' | 'license_search' |
    'mylist_video' | 'summary' | 'community' | 'commons';

  export interface Query {
    q: string;
    targets: string; // title,description,tags
    _sort: string;
    _context: string;
    fields?: string;
    filters?: string;
    jsonFilter?: string;
    _offset?: number;
    _limit?: number;
  }

  export interface SearchData {
    contentId: string;
    title: string; // 標題
    description: string; // 說明
    tags: string; // 標籤
    categoryTags: string; // 類別標籤
    viewCounter: number; // 再生數（或生放入場數）
    mylistCounter: number; // 加入最愛的數量
    commentCounter: number; // 留言數
    startTime: string; // 投稿時間（或生放開始時間）
    lastCommentTime: number; // 最後留言時間
    lengthSeconds: number; // 再生時間
    thumbnailUrl: string; // 縮圖URL
    communityIcon?: string; // 社群Icon？
    scoreTimeshiftReserved?: number; // 生放送預約數
    liveStatus?: 'past' | 'onair' | 'reserved'; // 生放送狀態

  }

  export interface Channel {
    title: string;
    link: string;
    description: string;
    pubDate: moment.Moment | string;
    lastBuildDate: moment.Moment | string;
    generator: string;
    copyright: string;
    item: Video[];
  }

  export interface Video {
    title: string;
    thumbnailSrc: string;
    link: string;
    description: string;
    originDescription: string;
    memo: string;
    timeLength: string;
    pubDate: moment.Moment | string;
    nicoInfoDate: string;

  }

  interface SearchResult {
    meta: {
      status: number;
      id?: string;
      totalCount?: string;
      errorCode?: string;
      errorMessage?: string;
    };
    data?: SearchData[];
  }

  export const searchResult = async (service: Service, query: Query | any): Promise<ResultListGenericVM<SearchData>> => {
    const result = new ResultListGenericVM<SearchData>();

    try {
      const { data: ret }: { data: SearchResult } = await axios.get(`https://api.search.nicovideo.jp/api/v2/${service}/contents/search`, {
        params: {
          ...query
        },
      }).catch((err: AxiosError) => err.response || { data: { meta: { status: 500, errorMessage: err.message } } });

      if (ret.meta.status !== 200) {
        return result.setResultValue(false, `${ret.meta.status}`, `${ret.meta.errorCode} ; ${ret.meta.errorMessage}`);
      }

      result.items = ret.data || [];

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  };

  export const getXmlToJsonData = async (service: string, id: string): Promise<any> => {
    const result = new ResultGenericVM<Channel>();

    try {
      const { data: ret } = await axios.get(config.getUrl(service, id));

      const { rss } = JSON.parse(xmlParser.toJson(ret)) as { rss: { channel: Channel } };

      rss.channel.pubDate = moment(rss.channel.pubDate);
      rss.channel.lastBuildDate = moment(rss.channel.lastBuildDate);
      rss.channel.item = rss.channel.item.map(item => {
        const $el = $(`<div>${item.description}</div>`);

        return {
          ...item,
          pubDate: moment(item.pubDate),
          description: $el.find('.nico-description').html() || '',
          originDescription: item.description,
          memo: $el.find('.nico-memo').text() || '',
          timeLength: $el.find('.nico-info-length').text() || '',
          nicoInfoDate: $el.find('.nico-info-date').text() || '',
          thumbnailSrc: $el.find('.nico-thumbnail img').attr('src') || '',
        };
      });

      result.item = rss.channel;

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }

  };
}
