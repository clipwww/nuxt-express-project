<template lang="pug">
  div
    KomicaList(board="live")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import KomicaList from '~/components/Komica/List.vue';

@Component({
  head() {
    return {
      title: '新番實況',
    };
  },
  components: {
    KomicaList,
  },
})
export default class KomicaLivePage extends Vue {}
</script>

<style lang="scss" scoped>
</style>
