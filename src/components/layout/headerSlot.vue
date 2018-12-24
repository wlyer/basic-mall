/**
 * @author wly
 * @date 2018/12/5
 * @Description: 头部
*/
<template>
  <section class="header">
    <van-nav-bar
      :title="$route.name"
      :left-text="isParentRouter() ? '' : '返回'"
      :left-arrow="!isParentRouter()"
      @click-left="onClickLeft"
    >
      <div slot="right">
        <slot>
          <van-icon name="search" @click="onClickRight"/>
        </slot>
      </div>
    </van-nav-bar>
  </section>
</template>

<script>
  import { NavBar, Search, Icon } from 'vant';
  export default {
    name: 'my-header',
    components: {
      [NavBar.name]: NavBar,
      [Search.name]: Search,
      [Icon.name]: Icon
    },
    data () {
      return {
      };
    },
    mounted () {
    },
    methods: {
      // 判断是否是顶层路由
      isParentRouter () {
        let flag = false;
        if (this.$route.name === '首页' || this.$route.name === '购物车' || this.$route.name === '个人中心') {
          flag = true;
        }
        return flag;
      },
      onClickLeft() {
        this.$router.go(-1);
        /* if (this.$route.name === '检索') {
          let path = this.$route.matched[this.$route.matched.length - 2].path;
          this.$router.replace(path);
        } else {
          this.$router.go(-1);
        } */
      },
      onClickRight() {
        this.$router.push('/search');
      }
    }
  };
</script>

<style scoped lang="scss">
.header{
}
</style>
