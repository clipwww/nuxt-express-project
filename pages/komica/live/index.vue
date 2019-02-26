<template lang="pug">
  div
    v-container(fluid grid-list-lg)
      v-layout(row wrap)
        v-flex(xs12 sm6 md4 v-for="(item, index) in posts" :key="item.id")
          v-card
            v-img(:src="item.sImg")
              v-layout(fill-height pa-3 align-start)
                span {{ item.id }}

            v-card-title(primary-title)
              span(class="grey--text") {{ item.dateTime }}
              div(class="headline") {{ item.title }}
              span(class="grey--text" v-html="handleHtmlText(item.text)")
              span(class="caption") {{ item.warnText }}

            v-card-actions
              v-btn(color="primary" small @click="$router.push({ name: 'komica-live-id', params: { id: item.id } })") 返信
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
                          v-img(:src="re.sImg")
                        v-flex()
                          div(class="break-all" v-html="re.text")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { komicaSVC } from '~/utilities/service';
import { NSKomica } from '~/utilities/komica.util';

@Component({
  head() {
    return {
      title: '新番實況',
    };
  },
})
export default class KomicaLivePage extends Vue {
  posts: NSKomica.IPostData[] = [];
  pages: string[] = [];
  page: number = 1;
  isLoading: boolean = false;
  showId: string = '';

  handleHtmlText(htmlText: string): string {
    return htmlText.replace(/<br\/>|<br>|\\n/g, '');
  }

  async getListData(page = 1): Promise<void> {
    this.isLoading = true;
    const ret = await komicaSVC.getLiveList(page);
    this.isLoading = false;

    console.log(ret);
    if (!ret.success) return;

    if (page === 1) {
      this.posts = ret.items;
    } else {
      this.posts = [...this.posts, ...ret.items];
    }

    this.page++;
    this.pages = ret.pages;
  }

  handleScroll(_e: Event) {
    const wh = window.innerHeight;
    const wsy = window.scrollY || window.pageYOffset;
    const ftop = document.body.clientHeight - 100;
    console.log(wh, wsy, ftop, wh + wsy > ftop);

    if (wh + wsy > ftop && this.page <= this.pages.length && !this.isLoading) {
      this.getListData(this.page);
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
</style>
