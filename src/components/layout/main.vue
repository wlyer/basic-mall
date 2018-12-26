/**
 * @author wly
 * @date 2018/12/5
 * @Description: 主结构
*/
<template>
  <section class="main">
    <v-header v-if="!isHaveRight()"/>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
    <v-menu :menuActive="menuActive" v-if="isParentRouter()"/>
  </section>
</template>

<script>
  import Header from '@/components/layout/header';
  import Menu from '@/components/layout/menu';
  export default {
    name: 'my-main',
    components: {
      'v-header': Header,
      'v-menu': Menu
    },
    data () {
      return {
        menuActive: 0
      };
    },
    methods: {
      // 有右侧操作按钮的头部页面
      isHaveRight () {
        let flag = false;
        if (this.$route.name === '购物车') {
          flag = true;
        }
        return flag;
      },
      // 判断是否是顶层路由
      isParentRouter () {
        let flag = false;
        if (this.$route.name === '首页' || this.$route.name === '购物车' || this.$route.name === '个人中心') {
          flag = true;
        }
        return flag;
      }
    },
    watch: {
      // 监听路由区分模块
      '$route' () {
        let path = this.$route.matched[0].path;
        switch (path) {
          case '/home':
            this.menuActive = 0;
            break;
          case '/mall':
            this.menuActive = 1;
            break;
          case '/myInfo':
            this.menuActive = 2;
            break;
          case '/aboutUs':
            this.menuActive = 3;
            break;
          default:
            this.menuActive = 0;
            break;
        }
      }
    }
  };
</script>

<style scoped lang="scss">
.main{

}
</style>
