import { ExtraVue } from 'view-models/nuxt.vm';

declare global {
  interface Window {
    $nuxt: ExtraVue;
  }
}
