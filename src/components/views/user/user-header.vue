<template>
  <header class="header" :style="`background-image: url(${user.backgroundUrl})`">
    <div class="card">
      <div class="img-wrap">
        <img class="img" :src="user.avatarUrl" @click="showImg(user.avatarUrl)" alt="头像">
      </div>
    </div>
    <div class="content">
      <section class="name">{{user.nickname}}</section>
      <section class="signature">{{user.signature}}</section>
    </div>
  </header>
</template>

<script>
  import {ImagePreview} from 'vant';

  export default {
    name: 'user-header',
    props: {
      user: {
        type: Object,
        default() {
          return {
            avatarUrl: 'http://img.ruofee.cn/headImage?imageslim',
            nickname: '我没有名称哦',
            signature: '是不是不写签名你就不爱我了',
            backgroundImgIdStr: ''
          };
        }
      }
    },
    methods: {
      showImg(url) {
        ImagePreview({
          images: [url]
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .header {
    display: flex;
    height: 250px;
    padding: 20px 10px;
    background-position: center;
    background-size: 100% 150%;
    color: #fff;
    .card {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      .img-wrap {
        width: 80px;
        height: 80px;
        overflow: hidden;
        border-radius: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .content {
      display: flex;
      justify-content: center;
      flex-direction: column;
      flex: 2;
      .name {
        font-size: 1.5em;
        font-weight: 700;
        line-height: 50px;
      }
      .signature {
        font-size: .9em;
      }
    }
  }
</style>
