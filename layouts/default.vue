<template lang="pug">
  v-app(dark)
    v-navigation-drawer(v-model="drawer" app fixed floating)
    v-toolbar(app fixed)
      v-toolbar-side-icon(@click.stop="drawer = !drawer")
      v-toolbar-title Application
    v-content
      v-container(fluid fill-height)
        nuxt
    v-footer(app inset)
</template>

<script>
export default {
  components: {},
  data() {
    return {
      drawer: true,
    };
  },
};
</script>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.5s; // cubic-bezier(.47,1.28,.81,1.29);
}
.page-enter, .page-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  transform: scale(2);
  opacity: 0;
}
</style>
