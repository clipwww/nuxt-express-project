import puppeteer from 'puppeteer';

import { ResultListGenericVM, ResultCode } from '../view-models/result.vm';

export interface IgVM {
  href: string;
  src: string;
}

export const crawlerInstagramFanPage = async (igId: string) => {
  const result = new ResultListGenericVM<IgVM>();

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(`https://www.instagram.com/${igId}`);
    await page.waitFor(1000);
    // try {
    //   await page.screenshot({ path: `static/screenshot/${igId}.png` });
    // } catch (err) {
    //   console.log(err);
    // }
    const ret = await page.evaluate(() => {
      const items: IgVM[] = [];

      document.querySelectorAll('article a').forEach(el => {
        const $img = el.querySelector('img[srcset]');
        const src = $img ? $img.getAttribute('src') || '' : '';
        items.push({
          href: `https://www.instagram.com${el.getAttribute('href')}`,
          src
        })
      })
      return {
        items
      }
    })

    await browser.close();

    result.items = ret.items;

    return result.setResultValue(true, ResultCode.success);
  } catch (err) {
    return result.setResultValue(false, ResultCode.error, err.message);
  }
}
