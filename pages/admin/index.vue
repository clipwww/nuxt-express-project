<template>
  <div>ADMIN
    <nuxt-link class="button" to="/">Homepage</nuxt-link>
  </div>
</template>

<script>
export default {
  asyncData(context) {
    console.log(context.isClient);
    return {
      name: 'YOOOO',
    };
  },
  fetch() {
    console.log('fetch');
  },
  head() {
    return {
      title: 'ADMIN',
    };
  },
  validate(content) {
    console.log(content);
    return true;
  },
};
</script>

<style lang="scss" scoped>
</style>
