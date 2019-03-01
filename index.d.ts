import { IExtraVue } from 'view-models/nuxt.vm';

declare global {
  interface Window {
    $nuxt: IExtraVue;
  }
}