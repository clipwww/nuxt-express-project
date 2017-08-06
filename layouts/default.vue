<template>
  <div>
    <nuxt/>
    <my-footer/>
  </div>
</template>

<script>
import MyFooter from '~/components/Footer.vue'

export default {
  components: {
    MyFooter
  }
}
</script>

<style lang="scss">
@import "../assets/scss/varibles.scss";
.container
{
  margin: 0;
  width: 100%;
  padding: 100px 15px;
  text-align: center;

}

.button, .button:visited
{
  display: inline-block;
  color: black;
  letter-spacing: 1px;
  background-color: #fff;
  border: 2px solid #000;
  text-decoration: none;
  text-transform: uppercase;
  padding: 15px 45px;
}

.button:hover, .button:focus
{
  color: #fff;
  background-color: #000;
}

.title
{
  color: #000;
  font-weight: 300;
  font-size: 2.5em;
  margin: 0;
}

.page-enter-active, .page-leave-active {
  transition: all .5s // cubic-bezier(.47,1.28,.81,1.29);
}
.page-enter, .page-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  transform: scale(0);
  opacity: 0;
}
</style>
