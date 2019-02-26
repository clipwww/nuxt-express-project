<template lang="pug">
  v-app(dark)
    v-navigation-drawer(v-model="drawer" class="elevation-5" app fixed floating)
      v-list
        v-list-tile(@click="$router.push('/')")
          v-list-tile-action
            v-icon home
          v-list-tile-title 首頁
        v-list-group(prepend-icon="grade")
          v-list-tile(slot="activator")
            v-list-tile-title Komica
          v-list-tile(@click="$router.push('/komica/live')")
            v-list-tile-title 新番實況


    v-toolbar(app fixed)
      v-toolbar-side-icon(@click.stop="drawer = !drawer")
      v-toolbar-title Application
    v-content
      nuxt
    v-footer(app inset height="auto")
      v-layout(justify-center row wrap)
        v-flex(text-xs-center white--text xs12) &copy;2019 - clipwww

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DefaultLayout extends Vue {
  drawer: boolean = false;
}
</script>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.5s; // cubic-bezier(.47,1.28,.81,1.29);
}
.page-enter, .page-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0;
}
</style>
