// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import Vuex from 'vuex';
/* import 'lib-flexible'; */
import store from './store/index';
import VueRouter from 'vue-router'; // 引入vue-router
import routes from '@/router';
import urls from '@/api/Host';
import toast from '@/utils/toast';
import utils from '@/utils/utils';
import '@/assets/styles/base_core.scss';
import VeeValidate from 'vee-validate';
import VideoPlayer from 'vue-video-player';
// 第一个是videoJs的样式，后一个是vue-video-player的样式，因为考虑到我其他业务组件可能也会用到视频播放，所以就放在了main.js内
import 'video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';
import '@/assets/styles/video.css';
import hls from 'videojs-contrib-hls';
Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VideoPlayer);
Vue.use(hls);
Vue.use(VeeValidate);
Vue.prototype.$urls = urls;
Vue.prototype.$user = '';
Vue.prototype.$utils = utils;
Vue.prototype.$toast = toast;
let router = new VueRouter({ // 新建router 并传入routes
  mode: 'history', // 去除#号
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes
});
/* 滚动条置顶 */
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});
/* 路由拦截 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    localStorage.removeItem('user');
    Vue.prototype.$user = '';
  }
  let user = JSON.parse(localStorage.getItem('user'));
  Vue.prototype.$user = user;
  if (!user && to.path !== '/login' && to.meta.requireAuth) {
    if (from.fullPath === '/') { // 解决分享导致的from页面是/问题
      next({ path: '/login', query: { redirect: to.fullPath }, replace: true });
    } else {
      next({ path: '/login', query: { redirect: from.fullPath }, replace: true });
    }
  } else {
    next();
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
