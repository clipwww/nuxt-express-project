module.exports = {
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
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-default/index.css',
    '~/assets/css/main.css',
  ],
  plugins: [
    'plugins/element-ui'
  ],
  router:{
      middleware: 'states',
  },
  build: {
    vendor: ['axios'],
    /*
    ** Run ESLINT on save
    */
    postcss: [
      require('autoprefixer')({
        browsers: ["last 5 version", "iOS >=8", "Safari >=8"],
      })
    ],
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
         //loader: 'eslint-loader',
          exclude: /(node_modules)/
        })

      }
    }
  }
}
