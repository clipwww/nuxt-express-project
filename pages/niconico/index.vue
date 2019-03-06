<template lang="pug">
  div()
    div {{ ranking.title }}
    div(v-for="item in ranking.item" :key="item.link")
      div {{ item.title }}
      div(v-html="item.description")
      div {{ item.pubDate }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { niconicoSVC } from '~/utilities/service';
import { NSNiconico } from '~/utilities/niconico.util';

@Component
export default class NicoNicoPage extends Vue {
  ranking: NSNiconico.IChannel = {
    title: '',
    generator: '',
    link: '',
    description: '',
    pubDate: '',
    lastBuildDate: '',
    copyright: '',
    item: [],
  };

  async created() {
    const ret = await niconicoSVC.getList('mylist', '6345211');
    if (!ret.success) return;
    this.ranking = ret.item;
  }
}
</script>

<style>
</style>
