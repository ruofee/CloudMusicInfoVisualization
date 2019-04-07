<template>
  <div id="app">
    <nav-bar
      title="网易云音乐"
      @click-left="goBack"
      left-arrow>
    </nav-bar>
    <router-view/>
  </div>
</template>

<script>
  import {NavBar} from 'vant';

  export default {
    name: 'app',
    components: {
      NavBar
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    }
  };
</script>


<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>
