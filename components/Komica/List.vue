<template lang="pug">
  div
    v-container(fluid grid-list-lg)
      v-layout(row wrap)
        v-flex(xs12 sm6 md4 v-for="(item, index) in posts" :key="item.id")
          v-card
            v-img(:src="item.oImg" :lazy-src="item.sImg" :aspect-ratio="16/9"
              gradient="to top, rgba(0, 0, 0, .5), transparent")
              v-layout(fill-height pa-3 align-end)
                span {{ item.id }}

            v-card-title(primary-title)
              div
                div(class="grey--text") {{ item.dateTime }}
                div(class="headline mb-2") {{ item.title }}
                div(class="grey--text mb-2" v-html="handleHtmlText(item.text)")
                div(class="caption") {{ item.warnText }}

            v-card-actions
              v-btn(color="primary" small @click="$router.push({ name: `komica-${board}-id`, params: { id: item.id } })") 返信
              v-spacer
              v-btn(icon @click="showId = (showId === item.id ? '': item.id)")
                v-icon {{ showId === item.id ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}

            v-slide-y-transition
              div(v-show="showId === item.id")
                v-flex(v-for="re in item.reply" :key="re.id")
                  v-card(color="blue-grey darken-2")
                    v-container(fluid grid-list-lg)
                      v-layout(row)
                        v-flex(v-if="re.sImg" xs4)
                          v-img(:src="re.sImg" :lazy-src="re.sImg")
                        v-flex()
                          div(class="break-all" v-html="re.text")
      div(v-if="isLastPage" class="no-more-data")
        span 已經沒有更多資料囉！

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { komicaSVC } from '~/utilities/service';
import { NSKomica } from '~/utilities/komica.util';

@Component
export default class KomicaList extends Vue {
  @Prop({ type: String, required: true }) board!: string;
  posts: NSKomica.IPostData[] = [];
  pages: string[] = [];
  pageIndex: number = 1;
  isLoading: boolean = false;
  showId: string = '';

  get isLastPage(): boolean {
    return this.pageIndex > this.pages.length;
  }

  handleHtmlText(htmlText: string): string {
    return htmlText.replace(/<br\/>|<br>|\\n/g, '');
  }

  async getListData(page = 1): Promise<void> {
    this.isLoading = true;
    const ret = await komicaSVC.getList(this.board, page);
    this.isLoading = false;

    console.log(ret);
    if (!ret.success) return;

    if (page === 1) {
      this.posts = ret.items;
    } else {
      this.posts = [...this.posts, ...ret.items];
    }

    this.pageIndex++;
    this.pages = ret.pages;
  }

  handleScroll(_e: Event) {
    const wh = window.innerHeight;
    const wsy = window.scrollY || window.pageYOffset;
    const ftop = document.body.clientHeight - 100;
    // console.log(wh, wsy, ftop, wh + wsy > ftop);

    if (wh + wsy > ftop && this.pageIndex <= this.pages.length && !this.isLoading) {
      this.getListData(this.pageIndex);
    }
  }

  created() {
    this.getListData();

    window.addEventListener('scroll', this.handleScroll);
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style lang="scss" scoped>
.no-more-data {
  line-height: 50px;
  text-align: center;
  span {
    position: relative;
    &::before,
    &::after {
      content: '';
      height: 1px;
      background-color: #fff;
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    &::before {
      left: 105%;
    }
    &::after {
      right: 105%;
    }
  }
}
</style>
