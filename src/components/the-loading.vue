<template>
  <div class="loading-wrap" :style="{height}">
    <Loading type="spinner"></Loading>
  </div>
</template>

<script>
  import {Loading} from 'vant';

  export default {
    name: 'the-loading',
    props: {
      height: {
        type: String,
        default: '50px'
      }
    },
    components: {
      Loading
    }
  };
</script>

<style scoped>
  .loading-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
