import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/Home')
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('./views/Search')
    },
    {
      path: '/user/:id',
      name: 'User',
      component: () => import('./views/User')
    }
  ]
});
