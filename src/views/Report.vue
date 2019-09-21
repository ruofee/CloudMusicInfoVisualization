<template>
  <div class="report">
    <div class="chart-wrap">
      <ve-line v-bind="chartSearchTrend" :settings="chartSettings"></ve-line>
    </div>
    <div class="chart-wrap">
      <ve-pie v-bind="chartSearchGender"></ve-pie>
    </div>
  </div>
</template>

<script>
class createChartData {
  constructor(title = '', legendRight = false) {

    this.title = {
      text: title,
      textStyle: {
        fontSize: 14
      }
    };

    this.data = {
      columns: [],
      rows: []
    };

    this.extend = {
      series: {
        center: ['50%', 150]
      }
    };

    if (legendRight) {
      this.extend.legend = {
        right: 0,
        textStyle: {
          color: '#A0A0A0',
          fontSize: 12
        }
      };
    }
  }
} 

export default {
  name: 'view-report',
  data() {
    return {
      genderMap: {
        man: '男生',
        woman: '女生',
        other: '神秘人'
      },
      chartSettings: {
        xAxisType: 'time'
      },
      chartSearchTrend: new createChartData('搜索趋势图'),
      chartSearchGender: new createChartData('性别分布图', true)
    };
  },
  methods: {
    getSearchTrend() {
      return this.$http({
        method: 'GET',
        url: 'getSearchTrend'
      })
        .then(res => {
          const data = res.data;
          const columns = ['日期', '数量'];
          const rows = [];
          for (let date of Object.keys(data)) {
            rows.push({
              '日期': date,
              '数量': data[date]
            });
          }

          this.chartSearchTrend.data = {
            columns,
            rows
          };
        });
    },
    getSearchGender() {
      return this.$http({
        method: 'GET',
        url: 'getSearchGender'
      })
        .then(res => {
          const data = res.data;
          const columns = ['类型', '数量'];
          const rows = [];
          
          for (let type of Object.keys(data)) {
            rows.push({
              '类型': this.genderMap[type],
              '数量': data[type]
            });
          }

          this.chartSearchGender.data = {
            columns,
            rows
          };
        });
    }
  },
  created() {
    this.getSearchTrend();
    this.getSearchGender();
  }
}
</script>

<style lang="scss" scoped>
  .report {
    padding: 30px 25px;
    .chart-wrap {
      margin-top: 20px;
    }
    .chart-wrap:first-child {
      margin-top: 0;
    }
  }
</style>
