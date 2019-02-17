import { Router } from 'express'
import apiUrl from '../util/apiUrl'
import axios from 'axios'
import $ from 'cheerio'

interface IPostData {
  id: string
  title: string | null
  text: string | null
  oImg: string
  sImg: string
  name: string
  dateTime: string
  userId: string
  warnText: string | null
  reply: IPostData[]
}

const router = Router()

const getPostData = ($el: Cheerio): IPostData => {
  const id = $el.attr('id').replace('r', '')
  const title = $el.find('.title').text()
  const text = $el.find('.quote').html()
  const oImg = $el.find("a[href*='img']").attr('href')
    ? `${apiUrl.komica.domain}${$el.find("a[href*='img']").attr('href')}`
    : ''
  const sImg = $el.find('img.img').attr('src') ? `${apiUrl.komica.domain}${$el.find('img.img').attr('src')}` : ''
  const name = $el.find('.name').text()
  const label = $el
    .find(`label[for="${id}"]`)
    .text()
    .replace(title, '')
  const dateTime = label.slice(label.indexOf('[') + 1, label.indexOf('ID') - 1)
  const userId = label.slice(label.indexOf('ID') + 3, label.indexOf(']'))
  const warnText = $el.find('.warn_txt2').text()

  return {
    id,
    title,
    text,
    oImg,
    sImg,
    name,
    dateTime,
    userId,
    warnText,
    reply: []
  }
}

const request = async (link: string, isIndex = true): Promise<IPostData[]> => {
  console.log('link：', link)
  const apiJsonData: string = await axios.get(`${apiUrl.komica.live}/${link}`).then(res => res.data)

  const postData = []
  const $html = $(apiJsonData)

  $html.find('.threadpost').each((_i, el) => {
    const $el = $(el)
    const temp = getPostData($el)
    const reply: IPostData[] = []

    $html.find('.reply').each((_i, rEl) => {
      const $rEl = $(rEl)

      if ($rEl.find(`.qlink[href*="res=${temp.id}"]`).length > 0) {
        const temp2 = getPostData($rEl)
        reply.push(temp2)
      }
    })

    temp.reply = reply

    postData.push(temp)
  })

  const pages: string[] = []
  if (isIndex) {
    $html
      .find('#page_switch')
      .find('a')
      .each((_i, el) => {
        pages.push($(el).attr('href'))
      })
  }

  for (let i = 0; i < pages.length; i++) {
    postData.push(...(await request(pages[i], false)))
  }

  return postData
}

router.get('/komica/live', async (_req, res) => {
  res.json({
    success: true,
    data: await request('index.html')
  })
  return
})

export default router
