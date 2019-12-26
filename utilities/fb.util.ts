import $ from 'cheerio';
import axios from 'axios';
import moment from 'moment';

import { ResultVM, ResultCode } from '../view-models/result.vm';

export const crawlerFacebookFanPage = async (fbId: string) => {
  const result = new ResultVM();

  try {
    const { data: htmlString } = await axios.get<string>(`https://www.facebook.com/pg/${fbId}/posts`, {
      headers: {
        'Content-Language': 'zh-TW'
      }
    });

    const $html = $(htmlString);

    result['item'] = {
      id: $html.find('[data-referrerid]').attr('data-referrerid'),
      name: $html.find('.fwb').first().text(),
      logo: $html.find('.uiScaledImageContainer img').attr('src'),
      posts: $html.find('.userContentWrapper').map((_i, el) => {
        const $el = $(el);
        const utime = +($el.find('[data-utime]').attr('data-utime') || 0) * 1000;
        return {
          id: $el.find('.text_exposed_root').attr('id'),
          link: `https://www.facebook.com/${$el.find('a._5pcq').attr('href')}`,
          logo: $el.find('img').attr('src'),
          img: $el.find('.scaledImageFitHeight').attr('src') || $el.find('.scaledImageFitWidth').attr('src') || $el.find('._3chq').attr('src'),
          content: $el.find('[data-testid="post_message"]').html(),
          utime,
          formatTime: moment(utime).format('YYYY/MM/DD HH:mm'),
          timestampContent: $el.find('.timestampContent').text(),
        };
      }).get(),
    }

    return result.setResultValue(true, ResultCode.success);
  } catch (err) {
    return result.setResultValue(false, ResultCode.error, err.message);
  }
}
