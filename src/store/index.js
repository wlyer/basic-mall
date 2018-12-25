import Vue from 'vue';
import Vuex from 'vuex';
import user from './user';
import order from './order';
import commodity from './commodity';
import shopCart from './shopCart';
Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
      user,
      order,
      commodity,
      shopCart
    }
});
