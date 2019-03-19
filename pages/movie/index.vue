<template lang="pug">
  v-layout
    v-flex(xs12)
      v-toolbar(card prominent)
        v-text-field(v-model="keyword" ppend-icon="mic" flat hide-details label="搜尋" prepend-inner-icon="search" solo-inverted)
      v-list(one-line)
        template(v-for="(item, index) in filterMovieList")
          v-list-tile(:key="item.id" @click="")
            v-list-tile-content
              v-list-tile-title {{ item.name }}
            v-list-tile-action
              v-btn(icon ripple @click="$router.push({ name: 'movie-id', params: { id: item.id } })")
                v-icon info
          v-divider(:key="index")

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import { NSMovie } from '~/utilities/movie.util';
import { movieSVC } from '~/utilities/service';

@Component
export default class MovieIndexPage extends Vue {
  movieList: { id: string; name: string }[] = [];
  keyword = '';

  get filterMovieList(): { id: string; name: string }[] {
    return this.movieList.filter(obj =>
      this.keyword ? obj.name.toLowerCase().includes(this.keyword.toLowerCase()) : true
    );
  }

  async getMovieList() {
    const ret = await movieSVC.getList();
    if (!ret.success) return;

    this.movieList = ret.items;
  }

  created() {
    this.getMovieList();
  }
}
</script>

<style>
</style>
