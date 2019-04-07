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
        <span>最喜欢的歌手是</span>
        <span class="text-main">{{resolveData.artists[0] ? resolveData.artists[0].name : ''}}</span>
      </p>
      <section class="chart-wrap">
          <ve-histogram v-bind="chartArtists"></ve-histogram>
        </section>
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
  </div>
  <div class="music" v-else>
    <the-loading height="200px"></the-loading>
  </div>
</template>

<script>
  import theLoading from '@/components/the-loading';
  import day from 'dayjs';
  import {catchStr} from '@/util';

  export default {
    name: 'user-music',
    props: {
      id: [Number, String]
    },
    components: {
      theLoading
    },
    data() {
      return {
        likeList: [],
        songDetail: [],
        artistsMax: 20,
        timesMax: 20,
        finished: false,
        format: 'YYYY-MM-DD'
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
              resultArtists[subItem.name]++;
            } else {
              resultArtists[subItem.name] = 1;
            }
          });
        });
        const artists = Object.keys(resultArtists).map(name => {
          return {
            name,
            number: resultArtists[name]
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
    }
    .section:first-child {
      margin-top: 0;
    }
  }
</style>
