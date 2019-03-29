import Vue from 'vue';
import { Route } from 'vue-router';
import { Store } from 'vuex';
import { Request, Response } from 'express';

interface NuxtLoading {
  start(): void;
  finish(): void;
}

export interface ExtraVue extends Vue {
  $loading: NuxtLoading;
}

export interface NuxtContext {
  app?: ExtraVue;
  isDev?: boolean;
  isHMR?: boolean;
  route: Route;
  from?: Route;
  // TODO: refact vuex to typsecript
  store: Store<any>;
  env: object;
  params: object;
  query: object;
  /**
   * AVAILABLE: server
   *
   * @type {Request}
   */
  req?: Request;
  /**
   * AVAILABLE: server
   *
   * @type {Response}
   */
  res: Response;
  /**
   * AVAILABLE: client
   *
   * @type {object}
   */
  nuxtState?: object;
  redirect?(path: string, query: object): void;
  redirect?(status: number, path: string, query: object): void;
  error?(params: { statusCode: number, message: any }): void;

}
