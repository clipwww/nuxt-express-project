import server from './server';

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
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
    '~/assets/css/main.css'
  ],

  plugins: ['plugins/vuetify'],

  modules: [
    '@nuxtjs/style-resources'
  ],

  router: {
    middleware: 'global'
  },

  styleResources: {
    scss: ['./assets/scss/variables.scss', './assets/scss/mixin.scss']
  },

  serverMiddleware: [
    server
  ],

  build: {
    postcss: [
      require('autoprefixer')({
        browsers: ['last 5 version', 'iOS >=8', 'Safari >=8']
      })
    ]
    // extend(config, ctx) { },
  }
};
