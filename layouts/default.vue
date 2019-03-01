<template lang="pug">
  v-app(dark)
    SideMenu(v-model="drawer")
    
    v-toolbar(app fixed)
      v-toolbar-side-icon(v-show="!isDetails" @click.stop="drawer = !drawer")
      v-btn(v-show="isDetails" 
        small icon
        @click="$router.go(-1)")
        v-icon arrow_back
      v-toolbar-title Application
      v-spacer
      

    v-content
      nuxt
    v-footer(app inset height="auto")
      v-layout(justify-center row wrap)
        v-flex(text-xs-center white--text xs12) &copy;2019 - clipwww

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SideMenu from '~/components/SideMenu.vue';

@Component({
  components: {
    SideMenu,
  },
})
export default class DefaultLayout extends Vue {
  drawer: boolean = false;

  get isDetails(): boolean {
    return this.$route.name.includes('-id') && !!this.$route.params.id;
  }
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
