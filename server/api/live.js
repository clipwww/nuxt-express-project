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

const links = [
  "index.html",
  "1.htm",
  "2.htm",
  "3.htm",
  "4.htm",
  "pixmicat.php?page_num=5",
  "pixmicat.php?page_num=6",
  "pixmicat.php?page_num=7"
]


router.get("/komica/live/:id", async (req, res, next)=>{
  const id = parseInt(req.params.id);

  if(id < 0 || id > 7){
    res.sendStatus(404);
  }

  const link = links[id];

  let apiJsonData = await axios.get(`${apiUrl.komica.live}/${link}`, (res) => {
    return res.data;
  });

  let postData = [];
  let $html = $(apiJsonData.data);

  let pages = [];
  $html.find("#page_switch").find("a").each((i, el) => {
    pages.push($(el).attr("href"));
  });

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

  res.json({
    success: true,
    data: postData,
    pages,
  });
})


export default router
