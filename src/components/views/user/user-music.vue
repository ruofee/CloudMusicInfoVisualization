<template>
  <div class="music" v-if="finished">
    <section class="section">
      <p class="title">
        <span>总共喜欢</span>
        <span class="text-main">{{likeList.length}}</span>
        <span>首音乐</span>
      </p>
    </section>
    <section class="section">
      <p class="subtitle">
        <span>在你喜欢的歌曲中, 最老的歌曲是</span>
        <span class="text-main">{{oldestSong.name}}</span>
        <span>, 发布时间为</span>
        <span class="text-main">{{oldestSong.time}}</span>
        <span>; 最新的歌曲是</span>
        <span class="text-main">{{youngestSong.name}}</span>
        <span>, 发布时间为</span>
        <span class="text-main">{{youngestSong.time}}</span>
      </p>
    </section>
    <section class="section">
      <p class="subtitle">
        最近喜欢听
        <span class="text-main">{{songDetail[0] ? songDetail[0].name : ' ' }}</span>
        , 以下是这首歌的前五热评:
      </p>
      <div
        class="comment"
        v-for="(comment, index) of lastSongComments"
        :key="index">
        <div class="comment-content">
          {{comment.content}}
        </div>
        <div class="comment-footer">
          <span>--</span>
          <div class="img-wrap" @click="() => preview(comment.user.avatarUrl)">
            <img class="img" :src="comment.user.avatarUrl" alt="头像">
          </div>
          <span class="text-main">{{comment.user.name}}</span>
          <Icon class="comment-icon" name="like"></Icon>
          <span class="text-main">{{comment.likedCount}}</span>
        </div>
      </div>
    </section>
    <section class="section">
      <p class="subtitle">
        <span>最喜欢的歌手是</span>
        <span class="text-main">{{favouriteArtists.artist ? favouriteArtists.artist.name : ''}}</span>
      </p>
      <section class="chart-wrap">
        <ve-histogram v-bind="chartArtists"></ve-histogram>
      </section>
      <p class="subtitle"></p>
    </section>
    <section class="section">
      <p class="subtitle">
        <span>关于</span>
        <span class="text-main">{{favouriteArtists.artist ? favouriteArtists.artist.name : ''}}</span>
      </p>
      <div class="artist">
        <div class="header">
          <div class="img-wrap" @click="() => preview(favouriteArtists.artist ? favouriteArtists.artist.img1v1Url : '')">
            <img class="img" :src="favouriteArtists.artist ? favouriteArtists.artist.img1v1Url : ''" alt="头像">
          </div>
        </div>
        <p class="content">{{favouriteArtists.artist ? favouriteArtists.artist.briefDesc : ''}}</p>
        <div>
          <p class="subtitle">
            <span>该歌手Top5歌曲</span>
          </p>
          <ul class="songs">
            <li
              :class="`song song-${index + 1}`"
              v-for="(song, index) of (favouriteArtists.hotSongs ? favouriteArtists.hotSongs.slice(0, 5) : [])"
              :key="song.privilege.id">
              <span class="index">{{index + 1}}. </span>
              <span>{{song.name}}</span>
              <a :href="`https://music.163.com/#/song?id=${song.privilege.id}`"><span class="play">播放</span></a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
  <div class="music" v-else>
    <the-loading height="200px"></the-loading>
  </div>
</template>

<script>
  import theLoading from '@/components/the-loading';
  import day from 'dayjs';
  import {Icon, ImagePreview} from 'vant';
  import {catchStr} from '@/util';

  export default {
    name: 'user-music',
    props: {
      id: [Number, String]
    },
    components: {
      theLoading,
      Icon
    },
    data() {
      return {
        likeList: [],
        songDetail: [],
        artistsMax: 20,
        timesMax: 20,
        finished: false,
        format: 'YYYY-MM-DD',
        favouriteArtists: {},
        lastSongComments: []
      };
    },
    computed: {
      resolveData() {
        const resultArtists = {};
        const publishTime = [];
        this.songDetail.forEach(item => {
          publishTime.push({
            name: item.name,
            time: item.publishTime
          });
          item.ar.forEach(subItem => {
            if (resultArtists[subItem.name]) {
              resultArtists[subItem.name].number++;
            } else {
              resultArtists[subItem.name] = {
                number: 1,
                id: subItem.id
              };
            }
          });
        });
        const artists = Object.keys(resultArtists).map(name => {
          return {
            name,
            id: resultArtists[name].id,
            number: resultArtists[name].number
          };
        }).sort((x, y) => {
          return y.number - x.number;
        });
        const times = publishTime.sort((x, y) => {
          return y.time - x.time;
        });
        return {
          artists,
          times
        };
      },
      youngestSong() {
        const {name, time} = this.resolveData.times[0];
        return {
          name,
          time: day(time).format(this.format)
        };
      },
      oldestSong() {
        let i = this.resolveData.times.length - 1;
        while(i) {
          if (this.resolveData.times[i].time) {
            return {
              name: this.resolveData.times[i].name,
              time: day(this.resolveData.times[i].time).format(this.format)
            };
          }
          i--;
        }
        return {
          name: '没有',
          time: '未知'
        };
      },
      chartArtists() {
        const resolveArr = this.resolveData.artists.slice(0, this.artistsMax);
        const rows = resolveArr.map(item => {
          return {
            '明星': item.name,
            '歌曲数量': item.number
          };
        });
        const data = {
          columns: ['明星', '歌曲数量'],
          rows
        };
        return this.createLineChart('喜欢的歌手Top20', data, false);
      }
    },
    methods: {
      getLikeListId() {
        return this.$http({
          method: 'GET',
          url: 'getPlayList',
          params: {
            id: this.id,
            limit: 1,
            page: 1
          }
        });
      },
      getLikeList(likeId) {
        return this.$http({
          method: 'GET',
          url: 'getLikeList',
          params: {
            id: likeId
          }
        });
      },
      getSongDetail(ids) {
        return this.$http({
          method: 'GET',
          url: 'getSongDetail',
          params: {
            ids
          }
        });
      },
      getArtist(id) {
        return this.$http({
          method: 'GET',
          url: 'getArtist',
          params: {
            id
          }
        });
      },
      getCommentHot(id) {
        return this.$http({
          method: 'GET',
          url: 'getCommentHot',
          params: {
            id,
            type: 0,
            limit: 5
          }
        });
      },
      createPieChart(title, data, legendVisible = false) {
        return {
          title: {
            text: title,
            textStyle: {
              fontSize: 14
            }
          },
          extend: {
            series: {
              center: ['50%', 160]
            },
            legend: {
              show: legendVisible,
              right: 0,
              textStyle: {
                color: '#A0A0A0',
                fontSize: 12
              }
            }
          },
          height: '320px',
          settings: {
            // roseType: 'radius',
            radius: 90
          },
          data
        };
      },
      createLineChart(title, data, legendVisible = false) {
        return {
          title: {
            text: title,
            textStyle: {
              fontSize: 14
            }
          },
          extend: {
            legend: {
              show: legendVisible,
              right: 0,
              textStyle: {
                color: '#A0A0A0',
                fontSize: 12
              }
            },
            tooltip: {
              show: true,
              trigger: 'axis',
              axisPointer : {
                type : 'shadow'
              }
            },
            xAxis: {
              axisLabel: {
                formatter(value) {
                  return catchStr(value, 8);
                }
              }
            },
            grid: {
              left: '5%',
              right: '5%',
              bottom: '2%'
            },
            series: {
              itemStyle: {
                normal: {  
                  color(params) {
                    const colorList = ['#ff4844', '#9ac3e5', '#66ac52', '#ffc032', '#f47e39', '#549bd3'];
                    if (params.dataIndex > 4) {
                      return colorList[5];
                    }
                    return colorList[params.dataIndex];
                  }
                }
              }
            }
          },
          height: '320px',
          data
        };
      },
      preview(url) {
        ImagePreview([url]);
      }
    },
    async created() {
      const likeListId = (await this.getLikeListId()).data.playlist[0].id;
      const likeList = (await this.getLikeList(likeListId)).data;
      this.likeList = likeList;
      const ids = this.likeList.map(song => {
        return song.id
      });
      this.songDetail = (await this.getSongDetail(ids)).data.songs;
      this.favouriteArtists = (await this.getArtist(this.resolveData.artists[0].id)).data;
      this.lastSongComments = (await this.getCommentHot(this.songDetail[0].id)).data;
      this.finished = true;
    }
  };
</script>

<style lang="scss" scoped>
  .music {
    padding: 30px 15px;
    .section {
      margin-top: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
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
      .chart-wrap {
        padding-top: 10px;
        padding-bottom: 10px;
      }
      .comment {
        padding: 10px;
        margin-top: 10px;
        color: #555;
        font-size: .8em;
        border: 1px solid #d8d8d8;
        border-radius: 5px;
        .comment-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-top: 10px;
          .img-wrap {
            margin-left: 5px;
            margin-right: 5px;
            width: 25px;
            height: 25px;
            border-radius: 100%;
            overflow: hidden;
            .img {
              width: 100%;
              height: 100%;
            }
          }
          .comment-icon {
            margin-left: 10px;
            color: #f44;
            font-size: 16px;
          }
        }
      }
      .comment:first-child {
        margin-top: 0;
      }
      .artist {
        .header {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          .img-wrap {
            width: 120px;
            height: 120px;
            border-radius: 100%;
            overflow: hidden;
            .img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .content {
          margin-top: 10px;
          margin-bottom: 10px;
          padding: 10px;
          color: #555;
          font-size: .8em;
          border: 1px solid #d8d8d8;
          border-radius: 5px;
        }
        .songs {
          padding-left: 10px;
          margin-top: 10px;
          margin-bottom: 10px;
          .song {
            padding: 5px 0;
            font-size: .9em;
            line-height: 24px;
            border-bottom: 1px solid #d8d8d8;
            .index {
              margin-right: 10px;
            }
            .play {
              float: right;
              font-size: .9em;
              color: #555;
            }
          }
          .song-1 {
            color: #ff4844;
          }
          .song-2 {
            color: #9ac3e5;
          }
          .song-3 {
            color: #66ac52;
          }
          .song-4 {
            color: #ffc032;
          }
          .song-5 {
            color: #f47e39;
          }
        }
      }
    }
    .section:first-child {
      margin-top: 0;
    }
  }
</style>
