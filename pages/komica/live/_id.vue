<template lang="pug">
  v-container(fluid grid-list-lg)
    v-layout(row wrap)
      v-flex(xs12)
        v-card
          v-card-title(primary-title)
            div
              span(class="grey--text") {{ post.userId }}
              div(class="headline") {{ post.title }}
              span(class="grey--text") {{ post.email }}
          v-container
            v-layout(row)
              v-flex(v-if="post.sImg" xs4)
                v-img(:src="post.sImg")
              v-flex()
                span(class="grey--text") {{ post.name }}
                span(class="break-all" v-html="post.text")
          v-card-actions
            span(class="grey--text") {{ post.dateTime }}

      v-flex(xs12 sm6 md4 v-for="item in post.reply" :key="item.id")
        v-card(color="blue-grey darken-2")
          v-container
            div
              span(class="grey--text") {{ item.userId }}
              span(class="grey--text") {{ item.title }}
              v-layout(row)
                v-flex(v-if="item.sImg" xs4)
                  v-img(:src="item.sImg")
                v-flex()
                  span(class="grey--text") {{ item.email }}
                  span(class="grey--text") {{ item.name }}
                  div(class="break-all" v-html="item.text")
          v-card-actions
            span(class="grey--text") {{ item.dateTime }}

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { komicaSVC } from '~/utilities/service';
import { NSKomica } from '~/utilities/komica.util';

@Component
export default class KomicaLiveDetailsPage extends Vue {
  post: NSKomica.IPostData = {
    id: '',
    userId: '',
    name: '',
    title: '',
    text: '',
    email: '',
    oImg: '',
    sImg: '',
    reply: [],
    warnText: '',
    dateTime: '',
  };

  async getPostData(): Promise<void> {
    const ret = await komicaSVC.getLiveDetails(this.$route.params.id);

    this.post = ret.item;
  }

  created() {
    this.getPostData();
  }
}
</script>

<style>
</style>
