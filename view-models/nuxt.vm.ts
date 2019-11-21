import Vue from 'vue';
import { Context } from '@nuxt/types';

interface NuxtLoading {
  start(): void;
  finish(): void;
}

export interface ExtraVue extends Vue {
  $loading: NuxtLoading;
}

export interface NuxtContext extends Context {

}
