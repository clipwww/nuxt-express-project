<template>
  <section class="container">
    <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <el-button @click="$store.commit('increment')">默認按鈕</el-button><br/>
    <img src="/S__20168849.jpg" alt="pepe" class="pepe"/>
  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  async asyncData () {
    // let { data } = await axios.get('/api/users')
    // return { users: data }
  },
  head () {
    return {
      title: 'Users'
    }
  }
}
</script>

<style lang="scss" scoped>
  .title{
    margin: 30px 0;
  }
  .users{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .user{
    margin: 10px 0;
  }

  .pepe{
    transition: all .3s;
  }
</style>
