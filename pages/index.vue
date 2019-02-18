<template lang="pug">
  section()
    div()
      img(src="/S__20168849.jpg" alt="pepe" class="pepe" width="200")

      v-data-table(class="elevation-2" :headers="headers" :items="posts" :loading="isLoading" hide-actions disable-initial-sort)
        template(slot="items" slot-scope="props")
          td {{ props.item.title }}
          td
            img(:src="props.item.sImg" style="max-width: 100px;")
          td {{ props.item.userId }}
          td {{ props.item.dateTime }}


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

      headers: [
        { text: '標題', value: 'title', align: 'center', sortable: false },
        { text: '開版圖', value: 'sImg', align: 'center', sortable: false },
        { text: '使用者ID', value: 'userId', align: 'center', sortable: false },
        {
          text: '日期&時間',
          value: 'dateTime',
          align: 'center',
          sortable: false,
        },
      ],
    };
  },
  methods: {},
  async created() {
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
