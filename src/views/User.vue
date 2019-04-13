<template>
  <div>
    <user-header :user="user.profile"></user-header>
    <Tabs v-model="tab" sticky animated>
      <Tab title="日记">
        <keep-alive>
          <user-profile v-show="tab === 0" :user="userProfile" v-if="!loading"></user-profile>
          <div v-else>
            <the-loading height="200px"></the-loading>
          </div>
        </keep-alive>
      </Tab>
      <Tab title="歌单">
        <keep-alive>
          <user-play-list v-show="tab === 1" :id="userId" v-if="!loading"></user-play-list>
          <div v-else>
            <the-loading height="200px"></the-loading>
          </div>
        </keep-alive>
      </Tab>
      <Tab title="音乐">
        <keep-alive>
          <user-music v-show="tab === 2" :id="userId"></user-music>
        </keep-alive>
      </Tab>
      <Tab title="关注/粉丝">
        <keep-alive>
          <user-fans
            v-show="tab === 3"
            :id="userId"
            :follows="userProfile.follows"
            :fans="userProfile.followeds">
          </user-fans>
        </keep-alive>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
  import day from 'dayjs';
  import userHeader from '@/components/views/user/user-header';
  import userProfile from '@/components/views/user/user-profile';
  import userPlayList from '@/components/views/user/user-play-list';
  import userMusic from '@/components/views/user/user-music';
  import userFans from '@/components/views/user/user-fans';
  import theLoading from '@/components/the-loading';
  import {Tabs, Tab} from 'vant';

  export default {
    name: 'view-user',
    components: {
      userHeader,
      userProfile,
      userPlayList,
      userMusic,
      userFans,
      theLoading,
      Tabs,
      Tab
    },
    watch: {
      '$route'() {
        this.$router.go(0);
      }
    },
    data() {
      return {
        tab: '日记',
        user: {},
        loading: false
      };
    },
    computed: {
      userId() {
        return this.$route.params.id;
      },
      playlistCount() {
        return this.user.profile ? this.user.profile.playlistCount : 0;
      },
      userProfile() {
        if (this.user.profile) {
          const {
            createTime,
            createDays,
            listenSongs,
            level,
            profile
          } = this.user;
          const {
            birthday,
            followeds,
            follows,
            gender,
            playlistCount,
            eventCount,
            nickname,
            province,
            city
          } = profile;
          return {
            createDays,
            createTime: day(createTime).format('YYYY.MM.DD'),
            listenSongs,
            birthday: day(birthday).format('YYYY.MM.DD'),
            follows,
            followeds,
            gender,
            playlistCount,
            eventCount,
            nickname,
            province,
            city
          };
        }
        return {};
      }
    },
    methods: {
      getUserDetail() {
        this.loading = true;
        return this.$http({
          method: 'GET',
          url: 'getUserInfo',
          params: {
            id: this.userId
          }
        })
          .then(res => {
            const result = res.data;
            this.user = result;
            this.loading = false;
          });
      }
    },
    created() {
      this.getUserDetail();
    }
  };
</script>