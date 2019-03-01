<template lang="pug">
  v-container(fluid grid-list-lg)
    v-layout(row wrap)
      v-flex(xs12 sm6 offset-sm3)
        v-card
          v-card-title(primary-title)
            div
              span(class="grey--text") {{ post.userId }}
              div(class="headline") {{ post.title }}
              span(class="grey--text") {{ post.email }}
          v-container
            v-layout(row)
              v-flex(v-if="post.sImg" xs4)
                v-img(:src="post.sImg" :lazy-src="post.sImg")
              v-flex()
                span(class="grey--text") {{ post.name }}
                span(class="break-all" v-html="post.text")
          v-card-actions
            span(class="grey--text") {{ post.dateTime }}

      v-flex(xs12 sm6 offset-sm3 v-for="item in post.reply" :key="item.id")
        v-card(color="blue-grey darken-2")
          v-container
            div
              span(class="grey--text") {{ item.userId }}
              span(class="grey--text") {{ item.title }}
              v-layout(row)
                v-flex(v-if="item.sImg" xs4)
                  v-img(:src="item.sImg" :lazy-src="item.sImg")
                v-flex()
                  span(class="grey--text") {{ item.email }}
                  span(class="grey--text") {{ item.name }}
                  div(class="break-all" v-html="item.text")
          v-card-actions
            span(class="grey--text") {{ item.dateTime }}
    v-speed-dial(v-model="fab" transition="scale-transition" direction="top" fixed bottom right)
      template(v-slot:activator)
        v-btn(v-model="fab" color="blue darken-2" dark fab)
          v-icon extension
          v-icon close
      v-btn(color="light-green darken-4" small fab
        @click="scrollTo('bottom')")
        v-icon vertical_align_bottom
      v-btn(color="orange darken-4" small fab
        @click="scrollTo('top')")
        v-icon vertical_align_top
      v-btn(color="blue darken-4" small fab
        @click="getPostData")
        v-icon refresh

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { komicaSVC } from '~/utilities/service';
import { NSKomica } from '~/utilities/komica.util';

@Component
export default class KomicaDetails extends Vue {
  @Prop({ type: String, required: true }) board!: string;

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
  fab: boolean = false;

  async getPostData(): Promise<void> {
    const ret = await komicaSVC.getDetails(this.board, this.$route.params.id);

    this.post = ret.item;
  }

  scrollTo(action: string): void {
    switch (action) {
      case 'top':
        window.scrollTo(0, 0);
        break;
      case 'bottom':
        window.scrollTo(0, document.body.clientHeight);
        break;
    }
  }

  created() {
    this.getPostData();
  }
}
</script>

<style>
</style>
