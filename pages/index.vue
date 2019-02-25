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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { komicaSVC } from '~/utilities/service';
import { NSKomica } from '~/utilities/komica.util';

@Component({
  head() {
    return {
      title: 'Users',
    };
  },
})
export default class IndexPage extends Vue {
  posts: NSKomica.IPostData[] = [];
  isLoading: boolean = false;

  headers = [
    { text: '標題', value: 'title', align: 'center', sortable: false },
    { text: '開版圖', value: 'sImg', align: 'center', sortable: false },
    { text: 'Id', value: 'userId', align: 'center', sortable: false },
    { text: '日期&時間', value: 'dateTime', align: 'center', sortable: false },
  ];

  async created() {
    this.isLoading = true;
    const ret = await komicaSVC.getLiveList(1);
    this.isLoading = false;
    console.log(ret);
    this.posts = [...ret.items];
  }
}
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
