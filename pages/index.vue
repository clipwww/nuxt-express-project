<template lang="pug">
  section(class="container")
    div()
      img(src="/S__20168849.jpg" alt="pepe" class="pepe" width="200")
    el-table(:data="posts"
      v-loading="isLoading"
      element-loading-text="拼命加載中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      border
      stripe
      highlight-current-row
      row-key="id")
      el-table-column(prop="title" label="標題")
      el-table-column(prop="name" label="名稱")
      el-table-column(prop="userId" label="使用者ID")
      el-table-column(prop="dateTime" label="日期&時間")


</template>

<script>
import axios from '~/plugins/axios';

export default {
  // async asyncData() {
  //   let { data: posts } = await axios.get('/api/komica/live');
  //   return {
  //     posts,
  //   };
  // },
  head() {
    return {
      title: 'Users',
    };
  },
  data() {
    return {
      posts: [],
      isLoading: true,
    };
  },
  methods: {},
  async mounted() {
    this.isLoading = true;
    const ret = await axios.get('/api/komica/live').then(res => res.data);
    this.isLoading = false;
    console.log(ret);
    this.posts = [...ret.data];
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin: 30px 0;
}
.users {
  list-style: none;
  margin: 0;
  padding: 0;
}
.user {
  margin: 10px 0;
}

.pepe {
  transition: all 0.3s;
}
</style>
