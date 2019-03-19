<template lang="pug">
div
  v-container(fluid grid-list-lg)
    v-layout(row wrap)
      v-flex(xs12 sm8 offset-sm2)
        v-card(v-if="movieInfo")
          v-card-title
            div(class="headline") {{ movieInfo.name }}
          v-layout(class="px-3 pb-3" row)
            v-flex(xs5)
              v-img(:src="movieInfo.poster")
            v-flex(class="pl-3" xs7)
              div {{ movieInfo.description }}
              v-select(v-model="cityId"
                :items="cityList"
                item-text="name"
                item-value="id"
                label="請選擇縣市"
                single-line)
  v-layout(row wrap)
    v-flex
      v-expansion-panel(popout)
        v-expansion-panel-content(v-for="(item, i) in theaterList" :key="item.id" ripple)
          template(v-slot:header)
            div {{ item.name }}
          v-card(class="pa-2")
            v-tabs(color="#263238" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows)
              v-tabs-slider(color="#fff")
              v-tab(v-for="(version, j) in item.versions" :href="`#tab-${j}`" :key="j") {{ version.name }}
              v-tabs-items
                v-tab-item(v-for="(version, k) in item.versions" :value="`tab-${k}`" :key="k")
                  v-card(flat)
                    v-layout(class="pa-2" style="max-height: 400px;" column wrap align-center)
                      v-flex(1 v-for="(time, index) in version.times" :key="index")
                        div {{ time }}
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { NSMovie } from '~/utilities/movie.util';
import { movieSVC } from '~/utilities/service';

@Component
export default class MovieIndexPage extends Vue {
  cityList: { id: string; name: string }[] = [];
  theaterList: NSMovie.Theater[] = [];
  movieInfo: NSMovie.MovieInfo | null = null;
  movieId = '';
  cityId = 'a02';
  active = false;

  @Watch('cityId')
  onCityIdChange(val: string) {
    console.log(val);
    this.getMovieTimes();
  }

  async getMovieTimes() {
    const ret = await movieSVC.getTimes(this.movieId, this.cityId);
    if (!ret.success) return;

    this.movieInfo = ret.item;
    this.theaterList = ret.items;
  }

  async getCityList() {
    const ret = await movieSVC.getCity();
    if (!ret.success) return;

    this.cityList = ret.items;
  }

  created() {
    this.movieId = this.$route.params.id;
    this.getMovieTimes();
    this.getCityList();
  }
}
</script>

<style>
</style>
