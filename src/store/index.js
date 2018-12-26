import Vue from 'vue';
import Vuex from 'vuex';
import common from './common';
import user from './user';
import order from './order';
import commodity from './commodity';
import shopCart from './shopCart';
Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
      common,
      user,
      order,
      commodity,
      shopCart
    }
});
