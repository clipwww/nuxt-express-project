<template lang="pug">
  div()
    v-toolbar(card dark prominent tabs)
      v-text-field(v-model="keyword" ppend-icon="mic" flat hide-details label="Search" prepend-inner-icon="search" solo-inverted @keyup.enter="search")
    //- div {{ ranking.title }}
    //- div(v-for="item in ranking.item" :key="item.link")
    //-   div {{ item.title }}
    //-   div(v-html="item.description")
    //-   div {{ item.pubDate }}
    div(v-for="item in searchList" :key="item.contentId")
      div {{ item.title }}
      img(:src="item.thumbnailUrl")
      div(v-html="item.description")
      div {{ item.startTime }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { niconicoSVC } from '~/utilities/service';
import { NSNiconico } from '~/utilities/niconico.util';

@Component
export default class NicoNicoPage extends Vue {
  keyword: string = 'ガルパン';

  ranking: NSNiconico.Channel = {
    title: '',
    generator: '',
    link: '',
    description: '',
    pubDate: '',
    lastBuildDate: '',
    copyright: '',
    item: [],
  };

  searchList: NSNiconico.SearchData[] = [];

  async search() {
    const ret = await niconicoSVC.search('video', {
      q: this.keyword,
      targets: 'tags',
      _sort: 'startTime',
      _context: 'apiguide',
      _limit: 100,
    });
    if (!ret.success) return;

    this.searchList = ret.items;
  }

  created() {
    // const ret = await niconicoSVC.getList('mylist', '6345211');
    // if (!ret.success) return;
    // this.ranking = ret.item;

    this.search();
  }
}
</script>

<style>
</style>
