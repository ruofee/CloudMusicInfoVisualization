<template>
  <div id="app">
    <nav-bar
      v-if="!isWechat"
      :title="title"
      @click-left="goBack"
      left-arrow>
    </nav-bar>
    <router-view/>
  </div>
</template>

<script>
  import {NavBar} from 'vant';
  import {isWechat} from '@/util';

  export default {
    name: 'app',
    components: {
      NavBar
    },
    watch: {
      '$route'() {
        this.title = document.title;
      }
    },
    data() {
      return {
        title: document.title
      };
    },
    computed: {
      isWechat() {
        return isWechat();
      }
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
