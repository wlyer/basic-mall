/**
 * @author wly
 * @date 2018/12/5
 * @Description: 底部导航
*/
<template>
  <section class="menu">
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o" to="/shopCart">购物车</van-tabbar-item>
      <van-tabbar-item icon="contact" to="/myInfo">我的</van-tabbar-item>
    </van-tabbar>
  </section>
</template>

<script>
  import { Tabbar, TabbarItem } from 'vant';
  export default {
    name: 'my-menu',
    props: ['menuActive'],
    components: {
      [Tabbar.name]: Tabbar,
      [TabbarItem.name]: TabbarItem
    },
    data () {
      return {
        active: this.menuActive
      };
    }
  };
</script>

<style scoped lang="scss">
.menu{

}
</style>
