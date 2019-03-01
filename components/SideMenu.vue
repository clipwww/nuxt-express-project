<template lang="pug">
  v-navigation-drawer(v-model="drawer" class="elevation-5" app fixed floating)
    v-img(:aspect-ratio="16/9" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg")
    v-list
      v-list-tile(@click="$router.push('/')")
        v-list-tile-action
          v-icon home
        v-list-tile-title 首頁
      v-list-group(prepend-icon="grade")
        v-list-tile(slot="activator")
          v-list-tile-title Komica
        v-list-tile(@click="$router.push('/komica/new')")
          v-list-tile-action
            v-icon bookmark_border
          v-list-tile-title 新番捏他
        v-list-tile(@click="$router.push('/komica/live')")
          v-list-tile-action
            v-icon bookmark_border
          v-list-tile-title 新番實況
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class SideMenu extends Vue {
  @Prop({ type: Boolean, required: true }) value!: boolean;

  get drawer(): boolean {
    return this.value;
  }
  set drawer(bool: boolean) {
    this.$emit('input', bool);
  }
}
</script>

<style>
</style>
