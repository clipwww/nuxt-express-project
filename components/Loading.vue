<template lang="pug">
  div(class="loading" v-if="isLoading")
    v-progress-circular(indeterminate color="primary" size="100")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Loading extends Vue {
  isLoading: boolean = false;

  start() {
    this.isLoading = true;
  }

  finish() {
    this.isLoading = false;
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}
</style>
