<template lang="pug">
  KomicaDetails(board="new")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import KomicaDetails from '~/components/Komica/Details.vue';

@Component({
  components: {
    KomicaDetails,
  },
})
export default class KomicaLiveDetailsPage extends Vue {}
</script>

<style>
</style>
