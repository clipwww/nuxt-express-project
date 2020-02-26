import dotenv from 'dotenv';
const result = dotenv.config();
const env = result.parsed;
console.log(env);

import server from './server';

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'J格4',
    titleTemplate: '這是什麼? | %s',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'bookmark', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    'material-design-icons-iconfont/dist/material-design-icons.css',
    'vuetify/dist/vuetify.min.css',
    '~/assets/scss/main.scss'
  ],

  loading: '~/components/Loading.vue',

  plugins: ['plugins/vuetify'],

  modules: [
    '@nuxtjs/style-resources',
    ['@nuxtjs/google-analytics', { id: 'UA-93335284-2' }],
  ],

  router: {
    middleware: 'global'
  },

  styleResources: {
    scss: ['./assets/scss/variables.scss']
  },

  serverMiddleware: [
    server
  ],

  buildModules: [
    ['@nuxt/typescript-build', {
      typeCheck: true,
      ignoreNotFoundWarnings: true
    }]
  ],
  build: {
    postcss: {
      'postcss-cssnext': {
        browsers: ['last 5 version', 'iOS >=8', 'Safari >=8']
      }
    },
    typescript: {
      typeCheck: false // or ForkTsChecker options
    }
    // extend(config, ctx) { },
  }
};
