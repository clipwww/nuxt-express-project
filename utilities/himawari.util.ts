import $ from 'cheerio';
import xmlParser from 'xml2json';
import moment from 'moment';

import axios from './axios.util';
import { ResultGenericVM, ResultCode, ResultListGenericVM } from '../view-models/result.vm';

const BASE_URL = 'http://himado.in/';

export type SortType = 'today_view_cnt' | 'movie_id' | 'total_view_cnt';

export interface HimawariList {

}

export const crawlerHimawariList = async ({ sort = 'today_view_cnt', keyword = '', cat, page }) => {
  const result = new ResultListGenericVM<any>();

  try {
    const { data: xmlString } = await axios.get(BASE_URL, {
      params: {
        sort,
        keyword,
        cat,
        page: page > 1 ? page : null,
        rss: 1,
      }
    })

    const xml = JSON.parse(xmlParser.toJson(xmlString));
    const { item: items, ...channel } = xml.rss.channel;

    result.item = {
      ...channel
    };

    result.items = items ? items.map(item => {
      const $d = $.load(item.description);

      return {
        id: item.link.replace(BASE_URL, ''),
        title: item.title,
        link: item.link,
        image: $d('img').attr('src'),
        description: $d('.riRssContributor').html(),
        datePublish: moment(item.pubDate).toISOString(),
      }
    }) : []

    return result.setResultValue(true, ResultCode.success);
  } catch (err) {
    console.log(err)
    return result.setResultValue(false, ResultCode.error, err.message);
  }
}

export const crawlerHimawariDetails = async (id: string) => {
  const result = new ResultGenericVM<any>();

  try {
    const { data: htmlString } = await axios.get(BASE_URL, {
      params: {
        id,
        mode: 'movie',
      }
    })


    const $xml = $.load(htmlString, {
      xmlMode: true,
    });

    const xml = JSON.parse(xmlParser.toJson($xml.xml()));
    result.item = {
      ...xml.movie
    };

    return result.setResultValue(true, ResultCode.success);
  } catch (err) {
    console.log(err)
    return result.setResultValue(false, ResultCode.error, err.message);
  }
}
