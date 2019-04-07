import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import http from '@/http';

import 'echarts/lib/component/title';
import VeLine from 'v-charts/lib/line.common';
import VePie from 'v-charts/lib/pie.common';
import VeHistogram from 'v-charts/lib/histogram.common';

Vue.component(VeLine.name, VeLine);
Vue.component(VePie.name, VePie);
Vue.component(VeHistogram.name, VeHistogram);
Vue.prototype.$http = http;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
