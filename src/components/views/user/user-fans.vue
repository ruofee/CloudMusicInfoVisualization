<template>
  <div class="fans" v-if="finished">
    <section class="section">
      <p class="title">
        <span>关注了</span>
        <span class="text-main">{{follows}}</span>
        <span>位用户, 收获了</span>
        <span class="text-main">{{fans}}</span>
        <span>位粉丝</span>
      </p>
    </section>
    <section class="section">
      <p class="subtitle">关注的人中, 以下用户最为活跃:</p>
      <div
        class="content"
        v-for="follower of resolveFollows.activestUsers"
        :key="follower.id">
        <div class="content-header">
          <div class="img-wrap" @click="() => preview(follower.avatarUrl)">
            <img class="img" :src="follower.avatarUrl" alt="头像">
          </div>
        </div>
        <div class="content-body">
          <span class="text-main name" @click="() => gotoUser(follower.userId, follower.nickname)">{{follower.nickname}}</span>
          <div class="content-count">
            <span>共发布了</span>
            <span class="text-main">{{follower.eventCount}}</span>
            <span>条动态</span>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <p class="subtitle">粉丝中, 以下用户最为活跃:</p>
      <div
        class="content"
        v-for="fan of resolveFans.activestUsers"
        :key="fan.id">
        <div class="content-header">
          <div class="img-wrap" @click="() => preview(fan.avatarUrl)">
            <img class="img" :src="fan.avatarUrl" alt="头像">
          </div>
        </div>
        <div class="content-body">
          <span class="text-main name" @click="() => gotoUser(fan.userId, fan.nickname)">{{fan.nickname}}</span>
          <div class="content-count">
            <span>共发布了</span>
            <span class="text-main">{{fan.eventCount}}</span>
            <span>条动态</span>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <p class="subtitle">关注的人中, 以下用户最受欢迎:</p>
      <div
        class="content"
        v-for="follower of resolveFollows.popularUsers"
        :key="follower.id">
        <div class="content-header">
          <div class="img-wrap" @click="() => preview(follower.avatarUrl)">
            <img class="img" :src="follower.avatarUrl" alt="头像">
          </div>
        </div>
        <div class="content-body">
          <span class="text-main name" @click="() => gotoUser(follower.userId, follower.nickname)">{{follower.nickname}}</span>
          <div class="content-count">
            <span>粉丝数: </span>
            <span class="text-main">{{follower.followeds}}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <p class="subtitle">粉丝中, 以下用户最受欢迎:</p>
      <div
        class="content"
        v-for="fan of resolveFans.popularUsers"
        :key="fan.id">
        <div class="content-header">
          <div class="img-wrap" @click="() => preview(fan.avatarUrl)">
            <img class="img" :src="fan.avatarUrl" alt="头像">
          </div>
        </div>
        <div class="content-body">
          <span class="text-main name" @click="() => gotoUser(fan.userId, fan.nickname)">{{fan.nickname}}</span>
          <div class="content-count">
            <span>粉丝数: </span>
            <span class="text-main">{{fan.followeds}}</span>
          </div>
        </div>
      </div>
    </section>
    <footer class="footer">
      提示: 点击用户名称可查看到用户的云音乐信息
    </footer>
  </div>
  <div class="fans" v-else>
    <the-loading height="200px"></the-loading>
  </div>
</template>

<script>
  import theLoading from '@/components/the-loading';
  import {ImagePreview, Dialog} from 'vant';

  export default {
    name: 'user-fans',
    props: {
      id: [Number, String],
      follows: {
        type: [Number, String],
        default: 0
      },
      fans: {
        type: [Number, String],
        default: 0
      }
    },
    components: {
      theLoading
    },
    data() {
      return {
        finished: false,
        followsDetail: [],
        fansDetail: []
      };
    },
    computed: {
      resolveFollows() {
        let activestUsers = [];
        let popularUsers = [];
        this.followsDetail.sort((x, y) => y.eventCount - x.eventCount);
        activestUsers = this.followsDetail.slice(0, 5).filter(value => {
          return !!value.eventCount;
        });
        this.followsDetail.sort((x, y) => y.followeds - x.followeds);
        popularUsers = this.followsDetail.slice(0, 5).filter(value => {
          return !!value.followeds;
        });
        if (this.follows < this.fans) {
          const followEach = [];
          this.followsDetail.forEach(follower => {
            if (follower.followed) {
              followEach.push(follower);
            }
          });
          return {
            activestUsers,
            followEach,
            popularUsers
          };
        }
        return {
          activestUsers,
          popularUsers
        };
      },
      resolveFans() {
        let activestUsers = [];
        let popularUsers = [];
        this.fansDetail.sort((x, y) => y.eventCount - x.eventCount);
        activestUsers = this.fansDetail.slice(0, 5).filter(value => {
          return !!value.eventCount;
        });
        this.fansDetail.sort((x, y) => y.followeds - x.followeds);
        popularUsers = this.fansDetail.slice(0, 5).filter(value => {
          return !!value.followeds;
        });
        if (this.follows > this.fans) {
          const followEach = [];
          this.fansDetail.forEach(fan => {
            if (fan.followed) {
              followEach.push(fan);
            }
          });
          return {
            activestUsers,
            followEach,
            popularUsers
          };
        }
        return {
          activestUsers,
          popularUsers
        };
      },
      followEach() {
        if ((
          this.resolveFollows.followEach && this.resolveFollows.followEach.length !== 0
        ) || (
          this.resolveFans.followEach && this.resolveFans.followEach.length !== 0
        )) {
          return this.resolveFollows.followEach || this.resolveFans.followEach;
        }
        return false;
      }
    },
    methods: {
      getFollows(id) {
        return this.$http({
          method: 'GET',
          url: 'getFollows',
          params: {
            id,
            limit: this.follows
          }
        });
      },
      getFans(id) {
        return this.$http({
          method: 'GET',
          url: 'getFans',
          params: {
            id,
            limit: this.fans
          }
        });
      },
      preview(url) {
        ImagePreview([url]);
      },
      gotoUser(id, name) {
        Dialog.confirm({
          title: '提示',
          message: `是否查看${name}的网易云信息?`
        }).then(() => {
          this.$router.push({
            name: 'User',
            params: {
              id
            }
          });
        }).catch(() => {});
      }
    },
    async created() {
      const result = (await Promise.all([this.getFollows(this.id), this.getFans(this.id)]));
      this.followsDetail = result[0].data.follow;
      this.fansDetail = result[1].data.followeds;
      this.finished = true;
    }
  };
</script>

<style lang="scss" scoped>
  .fans {
    padding: 30px 15px;
    .section {
      margin-top: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      .content {
        display: flex;
        align-items: center;
        margin-top: 10px;
        padding: 10px;
        color: #555;
        font-size: .8em;
        border: 1px solid #d8d8d8;
        border-radius: 5px;
        .content-header {
          width: 30px;
          .img-wrap {
            .img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .content-body {
          position: relative;
          display: flex;
          flex-grow: 1;
          margin-left: 10px;
          .content-count {
            display: flex;
            flex-grow: 1;
            justify-content: flex-end;
          }
        }
      }
      .content:first-child {
        margin-top: 0px;
      }
      .title {
        margin: 0;
        font-size: 1.1em;
        font-weight: 700;
      }
      .subtitle {
        margin: 0;
      }
      .text-main {
        margin-left: 2px;
        margin-right: 2px;
        color: #3396fb;
      }
      .name {
        cursor: pointer;
      }
      .chart-wrap {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .section:first-child {
      margin-top: 0;
    }
    .footer {
      display: flex;
      align-items: center;
      height: 50px;
      color: #999;
      font-size: .7em;
    }
  }
</style>
