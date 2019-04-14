<template>
  <div class="home">
    <Search
      :placeholder="searchConfig.placeholder"
      v-model="searchConfig.keyword"
      @search="onSearch"
      show-action>
      <div slot="action" @click="onSearch">搜索</div>
    </Search>
    <div class="background" v-if="firstSearch"></div>
    <List
      v-else
      v-model="listConfig.loading"
      :immediate-check="false"
      :finished="listConfig.finished"
      :finished-text="listConfig.finishedText"
      :offset="listConfig.offset"
      @load="nextPage">
      <router-link v-for="user of users" :key="user.userId" :to="{name: 'User', params: {id: user.userId}}">
        <Card
          class="card"
          :desc="user.signature"
          :title="user.nickname"
          :thumb="user.avatarUrl">
        </Card>
      </router-link>
    </List>
  </div>
</template>

<script>
  import {Search, List, Card, Toast} from 'vant';
  export default {
    name: 'view-search',
    components: {
      Search,
      List,
      Card
    },
    data() {
      return {
        searchConfig: {
          keyword: '',
          placeholder: '请输入用户名'
        },
        listConfig: {
          loading: false,
          limit: 30,
          page: 1,
          offset: 50,
          finished: false,
          finishedText: '没有更多了'
        },
        users: [], // 搜索用户列表
        count: 0, // 用户总数
        firstSearch: true
      };
    },
    methods: {
      getUserList(page) {
        return this.$http({
          method: 'GET',
          url: 'getUser',
          params: {
            name: this.searchConfig.keyword,
            limit: this.listConfig.limit,
            page
          }
        });
      },
      onSearch() {
        if (!this.searchConfig.keyword) {
          Toast('关键字不能为空');
          return false;
        }
        if (this.firstSearch) {
          this.firstSearch = false;
        }
        this.listConfig.page = 1;
        const toast = Toast.loading({
          mask: true,
          message: '加载中...'
        });
        this.getUserList(this.listConfig.page)
          .then(res => {
            const result = res.data.result;
            const {userprofiles, userprofileCount} = result;
            this.users = userprofiles;
            this.count = userprofileCount;
            if (userprofiles.length < this.listConfig.limit) {
              this.listConfig.finished = true;
            }
          })
          .finally(() => {
            toast.clear();
          });
      },
      nextPage() {
        this.listConfig.page++;
        this.getUserList(this.listConfig.page)
          .then(res => {
            const userprofiles = res.data.result.userprofiles;
            this.listConfig.loading = false;
            if (userprofiles.length) {
              this.users.push(...userprofiles);
              if (userprofiles.length < this.listConfig.limit) {
                this.listConfig.finished = true;
              }
            } else {
              this.listConfig.finished = true;
            }
          });
      }
    }
  };
</script>

<style scoped>
  .background {
    height: calc(100vh - 100px);
    background-image: url('../assets/search.jpeg');
    background-size: 100%;
    background-repeat: no-repeat;
  }
  .card >>> .van-card__title {
    line-height: 28px;
    font-size: 1.2em;
  }
  .card >>> .van-card__desc {
    line-height: 24px;
    font-size: 1.1em;
  }
</style>
