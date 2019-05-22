import $ from 'cheerio';
import moment from 'moment';
import { groupBy as _groupBy } from 'lodash';

import { ResultCode, ResultListGenericVM, ResultVM } from '../view-models/result.vm';
import axios from './axios.util';

export namespace NSMovie {

  const config = {
    domain: 'http://www.atmovies.com.tw',
    getUrl(service) {
      return `${this.domain}/${service}`;
    }
  };

  export interface MovieInfo {
    id: string;
    name: string;
    description: string;
    runtime: number;
    poster: string;
    currentDate: string;
    releaseDate: string;
  }

  export interface Theater {
    id: string;
    name: string;
    versions: {
      name: string;
      times: string[];
    }[];
  }

  export class MovieTimesResult extends ResultVM {
    item!: MovieInfo;
    items!: Theater[];
  }

  export async function getMovieList(): Promise<ResultListGenericVM<{ id: string, name: string }>> {
    const result = new ResultListGenericVM<{ id: string, name: string }>();

    try {
      const { data: htmlString } = await axios.get(config.getUrl('home/quickSelect.html'));

      const $el = $(htmlString);

      result.items = $el.find('select[name=select2] option').filter((_i, el) => {
        return !!el.attribs.value;
      }).map((_i, el) => {
        const valueArr = el.attribs.value.split('/')
        return {
          id: valueArr[2],
          name: $(el).text(),
        };
      }).get();

      return result.setResultValue(true, ResultCode.success);

    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }

  export async function getCityList(): Promise<ResultListGenericVM<{ id: string, name: string }>> {
    const result = new ResultListGenericVM<{ id: string, name: string }>();

    try {
      const { data: htmlString } = await axios.get(config.getUrl('home/quickSelect.html'));

      const $el = $(htmlString);

      result.items = $el.find('select[name=area] option').filter((_i, el) => {
        return !!el.attribs.value;
      }).map((_i, el) => {
        return {
          id: el.attribs.value,
          name: $(el).text().trim(),
        };
      }).get();

      return result.setResultValue(true, ResultCode.success);

    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }

  export async function getTheaterList(cityId: string): Promise<ResultListGenericVM<{ id: string, name: string }>> {
    const result = new ResultListGenericVM<{ id: string, name: string }>();

    try {
      const { data: htmlString } = await axios.get(`${config.getUrl('showtime')}/${cityId}`);

      const $el = $(htmlString);

      result.items = $el.find(`#theaterList a[href*="/showtime/"]`).map((_i, el) => {
        return {
          id: $(el).attr('href').split('/')[2],
          name: $(el).text().trim(),
        };
      }).get();

      return result.setResultValue(true, ResultCode.success);

    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }

  export async function getMovieTimes(movieId: string, cityId: string): Promise<MovieTimesResult> {
    const result = new MovieTimesResult();

    try {
      const { data: htmlString } = await axios.get(`${config.getUrl('showtime')}/${movieId}/${cityId}/`);

      const $el = $(htmlString);

      const movieInfoArr = $el.find('.runtimeText').text().split(' ');
      const ldJson = JSON.parse($el.find('[type=\'application/ld+json\']').html() || '{}');

      result.item = {
        id: movieId,
        name: (ldJson || '').name,
        runtime: +(movieInfoArr.find(str => str.includes('片長')) || '0').replace(/片長：|分/g, '').trim(),
        poster: (ldJson.image || '').trim(),
        description: ldJson.description,
        currentDate: moment().format('YYYY/MM/DD'),
        releaseDate: (movieInfoArr.find(str => str.includes('上映日期：')) || '').replace(/上映日期：/g, '').trim()
      };

      const tempArr = $el.find('#filmShowtimeBlock > ul').map((_i, el) => {
        const $theater = $(el).find('.theaterTitle');

        return {
          theaterId: $theater.find('a').attr('href').split('/')[2],
          theaterName: $theater.text(),
          versionName: $(el).find('.filmVersion').text().trim(),
          time: $(el).find('li').filter((_i, el) => $(el).text().includes('：')).map((_i, el) => $(el).text()).get(),
        };
      }).get();

      const tempObject = _groupBy(tempArr, 'theaterId');

      result.items = Object.keys(tempObject).map<Theater>(key => {
        const versionObj = {};
        tempObject[key].forEach((obj: { versionName: string, time: string[] }) => {
          const name = obj.versionName || '一般';
          if (versionObj[name]) {
            versionObj[name] = [...versionObj[name], ...obj.time];
          } else {
            versionObj[name] = [...obj.time];
          }
        });

        return {
          id: key,
          name: tempObject[key][0].theaterName,
          versions: Object.keys(versionObj).map(vKey => {
            return {
              name: vKey,
              times: versionObj[vKey]
            };
          })
        };
      });

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }
}
