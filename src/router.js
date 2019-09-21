import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: {
        name: 'Search'
      },
      meta: {
        title: '首页'
      },
      component: () => import('./views/Home')
    },
    {
      path: '/search',
      name: 'Search',
      meta: {
        title: '搜索'
      },
      component: () => import('./views/Search')
    },
    {
      path: '/user/:id',
      name: 'User',
      meta: {
        title: '用户主页'
      },
      component: () => import('./views/User')
    },
    {
      path: '/report',
      name: 'Report',
      meta: {
        title: '报告'
      },
      component: () => import('./views/Report')
    }
  ]
});

router.beforeEach((to, _, next) => {
  document.title = to.meta.title
  next();
});

export default router;