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

  interface Movie {
    movieId: string;
    movieName: string;
  }

  interface City {
    cityId: string;
    cityName: string;
  }

  interface Theater {
    theaterId: string;
    theaterName: string;
    movieVersions: {
      versionName: string;
      times: string[];
    }[];
  }

  export class MovieTimesResult extends ResultVM {
    item!: {
      date: string;
      movieName: string;
      movieRuntime: number;
      releaseDate: string;
    };
    items!: Theater[];
  }

  export async function getMovieList(): Promise<ResultListGenericVM<Movie>> {
    const result = new ResultListGenericVM<Movie>();

    try {
      const { data: htmlString } = await axios.get(config.getUrl('movie'));

      const $el = $(htmlString);

      result.items = $el.find('select[name=film_id] option').filter((_i, el) => {
        return !!el.attribs.value;
      }).map((_i, el) => {
        return {
          movieId: el.attribs.value,
          movieName: $(el).text(),
        };
      }).get();

      return result.setResultValue(true, ResultCode.success);

    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }

  export async function getCityList(): Promise<ResultListGenericVM<City>> {
    const result = new ResultListGenericVM<City>();

    try {
      const { data: htmlString } = await axios.get(config.getUrl('movie'));

      const $el = $(htmlString);

      result.items = $el.find('select[name=area] option').filter((_i, el) => {
        return !!el.attribs.value;
      }).map((_i, el) => {
        return {
          cityId: el.attribs.value,
          cityName: $(el).text(),
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

      result.item = {
        date: moment().format('YYYY-MM-DD'),
        movieName: $el.find('h2').text().trim(),
        movieRuntime: +(movieInfoArr.find(str => str.includes('片長')) || '0').replace(/片長：|分/g, '').trim(),
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
          theaterId: key,
          theaterName: tempObject[key][0].theaterName,
          movieVersions: Object.keys(versionObj).map(vKey => {
            return {
              versionName: vKey,
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
