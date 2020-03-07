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

  interface MovieSimpleInfo {
    id: string,
    name: string,
    description: string,
    cerImg: string
  }

  export interface MovieInfo {
    id: string;
    name: string;
    description: string;
    runtime: number;
    poster: string;
    currentDate: string;
    releaseDate: string;
    cerImg: string;
    citys: Array<{ id: string, name: string }>
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

  interface TheaterMovie {
    id: string;
    title: string;
    image: string;
    runtime: string;
    cerImg: string;
    versions: Array<{
      name: string;
      times: string[];
    }>;
  }

  export class TheaterTimesResult extends ResultVM {
    item!: any;
    items!: Array<TheaterMovie>;
  }

  export async function getMovieList(): Promise<ResultListGenericVM<MovieSimpleInfo>> {
    const result = new ResultListGenericVM<MovieSimpleInfo>();

    try {
      const { data: htmlString } = await axios.get(config.getUrl('movie/now'));

      const $el = $(htmlString);

      result.items = $el.find('.filmListPA li').map((_i, el) => {
        const $li = $(el);
        const $a = $li.find('a');
        const $runtime = $li.find('.runtime');

        const valueArr = ($a.attr('href') || '/').split('/')
        return {
          id: valueArr[2],
          name: $a.text(),
          description: $runtime.text(),
          cerImg: config.getUrl($runtime.find('img').attr('src'))
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

      const citys: Array<{ id: string, name: string }> = [];
      $el.find('select[name=area] option').filter((_i, el) => {
        return !!el.attribs.value;
      }).each((_i, el) => {
        const id = el.attribs.value;
        if (!citys.find(c => c.id === id)) {
          citys.push({
            id: el.attribs.value,
            name: $(el).text().trim(),
          })
        }
      });

      result.items = citys;

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
          id: ($(el).attr('href') || '').split('/')[2],
          name: $(el).text().trim(),
        };
      }).get();

      return result.setResultValue(true, ResultCode.success);

    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }

  export async function getMovieTimes(movieId: string, cityId?: string): Promise<MovieTimesResult> {
    const result = new MovieTimesResult();

    try {
      const { data: htmlString } = await axios.get(`${config.getUrl('movie')}/${movieId}`);

      const $el = $(htmlString);

      const $movieInfoLi = $el.find('.runtime');
      const $theaterSelectOptions = $el.find('[name="FORMS"] option')

      result.item = {
        id: movieId,
        name: $el.find('.filmTitle').text().trim(),
        runtime: +($movieInfoLi.find('li:nth-child(1)').text() || '').replace(/片長：|分/g, '').trim(),
        poster: $el.find(".Poster img").attr('src') || '',
        description: $el.find("#filmTagBlock span").text().trim(),
        currentDate: moment().format('YYYY/MM/DD'),
        releaseDate: ($movieInfoLi.find('li:nth-child(2)').text() || '').replace(/上映日期：/g, '').trim(),
        cerImg: config.getUrl($el.find('.filmTitle img').attr('src')),
        citys: $theaterSelectOptions
          .map((i, el) => {
            const $option = $(el)
            return {
              id: ($option.attr('value') || '').split('/')[3],
              name: $option.text().trim()
            }
          }).get().filter((item) => item.id),
      };

      if (cityId) {
        const { data: htmlString } = await axios.get(`${config.getUrl('showtime')}/${movieId}/${cityId}/`);
        const $el = $(htmlString);
        const tempArr = $el.find('#filmShowtimeBlock > ul').map((_i, el) => {
          const $theater = $(el).find('.theaterTitle');

          return {
            theaterId: ($theater.find('a').attr('href') || '').split('/')[2],
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
      } else {
        result.items = [];
      }

      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }

  export async function getTheaterTimes(theaterId: string, cityId: string, date: string): Promise<MovieTimesResult> {
    const result = new TheaterTimesResult();

    try {
      const dateString = moment(date).isSame(moment(), 'day') ? '' : moment(date).format('YYYYMMDD');
      const { data: htmlString } = await axios.get(`${config.getUrl('showtime')}/${theaterId}/${cityId}/${dateString}`);

      const $el = $(htmlString);

      const ldJson = JSON.parse($el.find('[type=\'application/ld+json\']').html() || '{}');

      result.item = {
        id: theaterId,
        name: (ldJson || {}).name || '',
        url: (ldJson || {}).url || '',
        address: (ldJson || {}).address || '',
        geo: (ldJson || {}).geo,
        telephone: (ldJson || {}).telephone || '',
        openingHours: (ldJson || {}).openingHours || '',
      };

      const $movieList = $el.find('#theaterShowtimeBlock ul[id]');

      const movies: TheaterMovie[] = $movieList.map((_i, el) => {
        const $el = $(el);
        const $title = $el.find('.filmTitle a');
        const $version = $el.find('ul:nth-child(2)');
        const $info = $el.find('ul:nth-child(1)');

        return {
          id: ($title.attr('href') || '//').split('/')[2],
          title: $title.text(),
          image: $el.find('img[width]').attr('src'),
          runtime: +$info.text().replace(/片長：|分/g, '').trim(),
          cerImg: config.getUrl($info.find('li:nth-child(2) img').attr('src')),
          versions: $version.map((i, vel) => {
            const $vel = $(vel);

            return {
              name: $vel.find('.filmVersion').text(),
              times: $vel.find('li:not(.filmVersion, .theaterElse)')
                .map((i, tel) => $(tel).text().replace('☆訂票', '').trim()).get()
            }
          }).get()
        }
      }).get();

      const newMovies: TheaterMovie[] = [];
      movies.forEach(item => {
        const movie = newMovies.find(o => o.id === item.id);
        if (!!movie) {
          movie.versions = [
            ...movie.versions,
            ...item.versions,
          ]
        } else {
          newMovies.push(item);
        }
      })

      result.items = newMovies;



      return result.setResultValue(true, ResultCode.success);
    } catch (err) {
      return result.setResultValue(false, ResultCode.error, err.message);
    }
  }
}
