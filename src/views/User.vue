<template>
  <div>
    <user-header :user="user.profile"></user-header>
    <Tabs v-model="tab" sticky animated>
      <Tab title="日记">
        <keep-alive>
          <user-profile v-if="tab === 0" :user="userProfile"></user-profile>
        </keep-alive>
      </Tab>
      <Tab title="歌单">
        <keep-alive>
          <user-play-list v-if="tab === 1" :id="userId"></user-play-list>
        </keep-alive>
      </Tab>
      <Tab title="音乐">
        <keep-alive>
          <user-music v-if="tab === 2" :id="userId"></user-music>
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
  import {Tabs, Tab} from 'vant';

  export default {
    name: 'view-user',
    components: {
      userHeader,
      userProfile,
      userPlayList,
      userMusic,
      Tabs,
      Tab
    },
    data() {
      return {
        tab: '日记',
        user: {}
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
          });
      }
    },
    created() {
      this.getUserDetail();
    }
  };
</script>