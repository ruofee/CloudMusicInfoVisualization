<template>
  <div class="play-list">
    <section class="section">
      <p class="title">
        <span>歌单总数量为</span>
        <span class="text-main">{{playList.length}}</span>
      </p>
    </section>
    <section class="section">
      <p class="subtitle">
        <span>创建了</span>
        <span class="text-main">{{playListCreate.length}}</span>
        <span>个歌单, 收藏了</span>
        <span class="text-main">{{playListCollection.length}}</span>
        <span>个歌单</span>
      </p>
      <div class="chart-wrap">
        <ve-pie v-bind="chartType"></ve-pie>
      </div>
    </section>
    <section class="section">
      <p class="subtitle">
        <span>你似乎很喜欢</span>
        <span class="text-main">{{favouriteTags.items.join(', ')}}</span>
        <span v-if="favouriteTags.isMore">这几种类型的歌单~</span>
        <span v-else>类型的歌单~</span>
      </p>
      <div class="chart-wrap">
        <ve-histogram v-bind="chartTag"></ve-histogram>
      </div>
    </section>
    <section class="section">
      <p class="subtitle">
        <span>在你所有的歌单中, 最受欢迎的是</span>
        <span class="text-main">{{favouriteList.items[0]}}</span>
        <span >这张歌单, 被收藏了</span>
        <span class="text-main">{{favouriteList.count}}</span>
        <span>次</span>
      </p>
      <div class="chart-wrap">
        <ve-histogram v-bind="chartSubscribedCount"></ve-histogram>
      </div>
    </section>
  </div>
</template>

<script>
  import {removeDuplicatedItem, catchStr} from '@/util';

  export default {
    name: 'user-play-list',
    props: {
      id: [Number, String]
    },
    data() {
      return {
        playList: [],
        tagsMax: 20,
        subscribedMax: 20
      };
    },
    computed: {
      playListCreate() {
        return this.playList.filter(item => {
          return Number(item.creator.userId) === Number(this.id);
        });
      },
      playListCollection() {
        return this.playList.filter(item => {
          return Number(item.creator.userId) !== Number(this.id);
        });
      },
      playListTags() {
        const result = {};
        this.playList.forEach(item => {
          const tags = item.tags;
          tags.forEach(tag => {
            if (result[tag]) {
              result[tag]++;
            }
            else {
              result[tag] = 1;
            }
          });
        });
        const resolveArr = Object.keys(result).map(tag => {
          return {
            tag,
            number: result[tag]
          };
        });
        resolveArr.sort((x, y) => {
          return y.number - x.number;
        });
        return resolveArr;
      },
      subscribedRank() {
        const result = this.playList.map(item => {
          return {
            name: item.name,
            number: item.subscribedCount
          };
        });
        result.sort((x, y) => {
          return y.number - x.number;
        });
        return result;
      },
      favouriteList() {
        const favouriteList = [];
        favouriteList.push(...this.subscribedRank.slice(0, 1));
        return {
          items: favouriteList.map(item => item.name),
          count: favouriteList[0] ? favouriteList[0].number : 0
        };
      },
      favouriteTags() {
        const favouriteTags = [];
        if (this.playListTags.length >= 4) {
          favouriteTags.push(...this.playListTags.slice(0, 5));
        } else {
          favouriteTags.push(...this.playListTags);
        }
        return {
          items: favouriteTags.map(item => item.tag),
          isMore: favouriteTags.length > 1
        };
      },
      chartType() {
        /**
         * 歌单类型 扇形图
         */
        const data = {
          columns: ['类型', '数量'],
          rows: [
            {'类型': '创建', '数量': this.playListCreate.length},
            {'类型': '收藏', '数量': this.playListCollection.length}
          ]
        };
        return this.createPieChart('歌单来源', data, true);
      },
      chartTag() {
        /**
         * 歌单标签 扇形图
         */
        const resolveArr = this.playListTags.slice(0, this.tagsMax);
        const rows = resolveArr.map(item => {
          return {
            '标签': item.tag,
            '数量': item.number
          };
        });
        const data = {
          columns: ['标签', '数量'],
          rows
        };
        return this.createLineChart('歌单类型Top20', data, false);
      },
      chartSubscribedCount() {
        /**
         * 歌单收藏数
         */
        const resolveArr = this.subscribedRank.slice(0, this.subscribedMax);
        const rows = resolveArr.map(item => {
          return {
            '歌单名': item.name,
            '收藏数': item.number
          };
        });
        const data = {
          columns: ['歌单名', '收藏数'],
          rows
        };
        return this.createLineChart('歌单收藏数Top20', data, false);
      }
    },
    methods: {
      getPlayList(page) {
        return this.$http({
          method: 'GET',
          url: 'getPlayList',
          params: {
            id: this.id,
            limit: 100,
            page
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
              center: ['50%', 150]
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
          height: '300px',
          settings: {
            roseType: 'radius',
            radius: 100
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
                  return catchStr(value, 16);
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
    created() {
      this.getPlayList(1)
        .then(res => {
          const result = res.data.playlist;
          this.playList = result;
        });
    }
  };
</script>

<style lang="scss" scoped>
  .play-list {
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