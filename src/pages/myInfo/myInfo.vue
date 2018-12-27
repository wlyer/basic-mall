<template>
  <section class="my-info">
    <img class="user-poster" @click="toChangeInfo" src="https://img.yzcdn.cn/public_files/2017/10/23/8690bb321356070e0b8c4404d087f8fd.png">
    <div class="user-links">
      <van-tabbar v-model="orderState" @change="toMyOrder" :fixed="false">
        <van-tabbar-item icon="pending-payment" :info="orderNums.dfkNum" v-if="orderNums.dfkNum!=0">待付款</van-tabbar-item>
        <van-tabbar-item icon="pending-payment" v-else>待付款</van-tabbar-item>
        <van-tabbar-item icon="tosend" :info="orderNums.dfhNum" v-if="orderNums.dfhNum!=0">待发货</van-tabbar-item>
        <van-tabbar-item icon="tosend" v-else>待发货</van-tabbar-item>
        <van-tabbar-item icon="logistics" :info="orderNums.dshNum" v-if="orderNums.dshNum!=0">待收货</van-tabbar-item>
        <van-tabbar-item icon="logistics" v-else>待收货</van-tabbar-item>
        <van-tabbar-item icon="cash-back-record">退款</van-tabbar-item>
      </van-tabbar>
    </div>

    <van-cell-group class="user-group">
      <van-cell icon="records" title="全部订单" is-link @click="toMyOrder(-1)"/>
    </van-cell-group>

    <van-cell-group class="mb10">
      <van-cell icon="setting-o" title="系统设置" is-link to="/myInfo/myChangePsw"/>
      <van-cell icon="volume-o" title="系统公告" is-link />
      <van-cell icon="points" title="我的红包" is-link />
      <van-cell icon="phone-circle-o" title="联系我们" is-link />
    </van-cell-group>
    <van-button type="default" class="operation-btn" @click="logout" v-if="$user">退出登录</van-button>
  </section>
</template>

<script>
  import { Row, Col, Icon, Cell, CellGroup, Button, Tabbar, TabbarItem } from 'vant';
  export default {
      name: 'myInfo',
    components: {
      [Row.name]: Row,
      [Col.name]: Col,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Button.name]: Button,
      [Tabbar.name]: Tabbar,
      [TabbarItem.name]: TabbarItem
    },
    data () {
      return {
        orderState: -1,
        orderNums: {
          dfhNum: 0,
          dshNum: 0,
          tkNum: 0,
          dfkNum: 0
        }
      };
    },
    mounted () {
      this.getOrderInfo();
    },
    methods: {
      // 获取订单销量
      getOrderInfo () {
        this.$store.dispatch('getOrderNumByUserCode', { userCode: this.$user.userCode }).then((res) => {
          this.orderNums = res.map;
        });
      },
      // 去我的订单
      toMyOrder (index) {
        let status = index || this.orderState + 1;
        this.$router.push({ path: '/myInfo/myOrder', query: { status: status } });
      },
      // 去登录
      toLogin () {
        this.$router.push({ path: '/login' });
      },
      // 编辑用户信息
      toChangeInfo () {
        this.$router.push({ path: '/myInfo/myChangeInfo' });
      },
      // 登出
      logout () {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  };
</script>

<style scoped lang="scss">
.my-info{
  .user-poster{
    width: 100%;
    display: block;
  }
  .user-group{
    margin-bottom: 15px;
  }
  .user-links{
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 24px;
    }
  }
}
</style>
