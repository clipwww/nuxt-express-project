<template lang="pug">
  div
    KomicaList(board="new")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import KomicaList from '~/components/Komica/List.vue';

@Component({
  head() {
    return {
      title: '新番捏他',
    };
  },
  components: {
    KomicaList,
  },
})
export default class KomicaNewPage extends Vue {}
</script>

<style lang="scss" scoped>
</style>
