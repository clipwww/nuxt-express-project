<template lang="pug">
  div
    NiconicoList(:channel="channel")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { niconicoSVC } from '~/utilities/service';
import { NSNiconico } from '~/utilities/niconico.util';
import NiconicoList from '~/components/Niconico/List.vue';

@Component({
  components: {
    NiconicoList,
  },
})
export default class NiconicoRankingPage extends Vue {
  channel: NSNiconico.Channel | null = null;

  async getRanking() {
    const ret = await niconicoSVC.getList('ranking', 'daily');

    if (!ret.success) return;

    this.channel = ret.item;
  }

  created() {
    this.getRanking();
  }
}
</script>

<style>
</style>
