<template>
  <ul class="profile">
    <li class="section">
      <span class="header"></span>
      <span>你好呀, 我是</span>
      <span v-if="isBoy">宇宙第一帅气而又谦虚的</span>
      <span v-else>无敌温柔可爱善良甜美得冒气泡的</span>
      <span class="text-main">{{user.nickname}}</span>
      <span>~</span>
    </li>
    <li class="section">
      <span class="header"></span>
      <span v-if="isBoy">
        <span>先偷偷告诉你个小秘密, </span>
        <span class="text-main">{{user.birthday}}</span>
        <span>是我人生中最重要的日子! 为什么呢? 因为这天我登陆了这个美好的世界~</span>
      </span>
      <span v-else>
        <span>偷偷跟你讲, </span>
        <span class="text-main">{{user.birthday}}</span>
        <span>那天! 有霞光从天而降, 听说这是仙女下凡的征兆, 我就是当天出生的, 所以我一直怀疑我是个仙女( 认真脸 )</span>
      </span>
    </li>
    <li class="section">
      <span class="header"></span>
      <span class="text-main">{{user.createTime}}</span>
      <span>, 那天我第一次来到网易云, 仔细数数, 已经过了</span>
      <span class="text-main">{{user.createDays}}</span>
      <span>天了~</span>
      <span>时间过得好快呀, 泪流满面状...</span>
    </li>
    <li class="section">
      <span class="header"></span>
      <span>掰掰手指数一数, </span>
      <span v-if="isListenSongTalent">哇, 我原来是个听歌达人了呀! 累计听了</span>
      <span v-else>咦, 原来我听歌数量这么少呀, 才听了</span>
      <span class="text-main">{{user.listenSongs}}</span>
      <span>首歌~</span>
      <span>对了, 我还创建了</span>
      <span class="text-main">{{user.playlistCount}}</span>
      <span>个歌单呢, 你等会可得点一下收藏呀~</span>
    </li>
    <li class="section">
      <span class="header"></span>
      <span v-if="isSendAction">
        <span>嘻嘻, 既然你都帮我收藏了歌单了, ( 可爱脸 ), 我还发了</span>
        <span class="text-main">{{user.eventCount}}</span>
        <span>条动态呢, 也得帮我点个赞哦~</span>
      </span>
      <span v-else>
        <span>别看我这么</span>
        <span v-if="isBoy">帅气谦虚善良</span>
        <span v-else>无敌温柔可爱善良甜美</span>
        <span>, 其实我是个不喜欢发动态的人呢~</span>
      </span>
    </li>
    <li class="section">
      <span class="header"></span>
      <span v-if="isFollowedTalent">
        <span>都怪网易云太迷人了, 这</span>
        <span class="text-main">{{user.createDays}}</span>
        <span>天我关注了</span>
        <span class="text-main">{{user.followeds}}</span>
        <span>位小哥哥小姐姐</span>
      </span>
      <span v-else>
        <span>还有还有, 我也是个高冷的人呢, 从不主动关注别人~</span>
      </span>
    </li>
    <li class="section">
      <span class="header"></span>
      <span v-if="isFollowTalent">
        <span>emmmmm, 话说我有多少粉丝呢~还不错, 原来我有</span>
        <span class="text-main">{{user.followeds}}</span>
        <span>个粉丝, 唉, 都怪我抑制不住自身的魅力~</span>
      </span>
      <span v-else>
        <span>突然想起来, 我还没看过我的粉丝列表呢, 满怀期待~</span>
        <span>啊! 晴天霹雳, 我怎么才一个粉丝呀...我是被世界遗忘了吗</span>
      </span>
    </li>
    <li class="section">
      <span class="header"></span>
      <span>很高兴很高兴认识你, 可以请你帮个忙吗? </span>
      <span>送颗星星给这个Github项目: </span>
      <a class="link" href="https://github.com/ruofee/CloudMusicInfoVisualization">云音乐用户信息可视化</a>
    </li>
  </ul>
</template>

<script>
  import day from 'dayjs';
  import area from '@/assets/area.json';

  export default {
    name: 'user-profile',
    props: {
      user: {
        type: Object,
        default() {
          return {
            createDays: 0,
            createTime: day(Date.now()).format('YYYY.MM.DD'),
            listenSongs: 0,
            birthday: day(Date.now()).format('YYYY.MM.DD'),
            follows: 0,
            followeds: 0,
            gender: 1,
            playlistCount: 0,
            eventCount: 0,
            nickname: '该账号已注销',
            province: '440000',
            city: '440100'
          };
        }
      }
    },
    computed: {
      isBoy() {
        return this.user.gender === 1;
      },
      isListenSongTalent() {
        return this.user.listenSongs > 2000;
      },
      isSendAction() {
        return this.user.eventCount !== 0;
      },
      isFollowedTalent() {
        return this.user.followeds > 0;
      },
      isFollowTalent() {
        return this.user.follows > 1;
      },
      origin() {
        return {
          province: area[this.user.province],
          city: area[this.user.city]
        };
      }
    }
  };
</script>

<style lang="scss" scoped>
  .profile {
    padding: 30px 15px;
    .section {
      line-height: 24px;
      .header {
        margin-left: 30px;
      }
      .text-main {
        color: #3396fb;
      }
      .link {
        color: #5fadfc;
      }
    }
  }
</style>