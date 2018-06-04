import { Router } from 'express'
import apiUrl from '../util/apiUrl'
import axios from 'axios'
import $ from 'cheerio'

const router = Router()

const getPostData = ($el) => {
  
  let id = $el.attr("id").replace('r', '');
  let title = $el.find('.title').text();
  let text = $el.find(".quote").html();
  let oImg = $el.find("a[href*='img']").attr('href') || "";
  let sImg = $el.find('img.img').attr('src') || "";
  let name = $el.find(".name").text();
  let label = $el.find(`label[for="${id}"]`).text().replace(title, "");
  let dateTime = label.slice(label.indexOf("[") + 1, label.indexOf("ID") - 1);
  let userId = label.slice(label.indexOf("ID") + 3, label.indexOf("]"));
  let warnText = $el.find(".warn_txt2").text() || undefined;
  
  return {
    id,
    title,
    text,
    oImg,
    sImg,
    name,
    dateTime,
    userId,
    warnText
  };

}

const request = async (link, isIndex = true) => {
  console.log('link：', link)
  let apiJsonData = await axios.get(`${apiUrl.komica.live}/${link}`, (res) => {
    return res.data;
  });

  let postData = [];
  let $html = $(apiJsonData.data);

  $html.find('.threadpost').each((i, el) => {
    let $el = $(el);
    let temp = getPostData($el);
    let reply = [];

    $html.find(".reply").each((i, rEl)=>{
      let $rEl = $(rEl);

      if($rEl.find(`.qlink[href*="res=${temp.id}"]`).length > 0){
        let temp2 = getPostData($rEl);
        reply.push(temp2);
      }
    });

    temp.reply = reply

    postData.push(temp)
  });

  let pages = [];
  if(isIndex) {
    $html.find("#page_switch").find("a").each((i, el) => {
      pages.push($(el).attr("href"));
    });
  }

  for(let i=0; i < pages.length; i++) {
    postData.push(...await request(pages[i], false))
  }

  
  return postData;
}
  


router.get("/komica/live", async (req, res, next)=>{
 
  res.json({
    success: true,
    data: await request('index.html'),
  });
})


export default router
