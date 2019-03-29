<template lang="pug">
  div
    v-container(fluid grid-list-lg)
      v-layout(row wrap)
        v-flex(xs12 v-for="(item, index) in items" :key="item.link")
          v-card
            v-layout(justify-center)
              v-img(:src="item.thumbnailSrc" :lazy-src="item.thumbnailSrc" max-width="130")
            v-card-title(primary-title)
              div
                div(class="grey--text") {{ item.pubDate }}
                div(class="headline mb-2") {{ item.title }}
                div(class="grey--text mb-2" v-html="item.description")
                div(class="caption") {{ item.timeLength }}
            v-divider(light)
            v-card-actions

      div(v-if="!items.length" class="no-more-data")
        span No Data.
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { NSNiconico } from '~/utilities/niconico.util';

@Component
export default class NiconicoList extends Vue {
  @Prop({ type: Object, default: {} }) channel!: NSNiconico.Channel;

  get items() {
    return this.channel ? this.channel.item : [];
  }
}
</script>

<style>
</style>
