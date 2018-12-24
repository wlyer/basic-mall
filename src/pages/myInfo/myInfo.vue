<template>
  <section class="my-info">
    <img class="user-poster" src="https://img.yzcdn.cn/public_files/2017/10/23/8690bb321356070e0b8c4404d087f8fd.png">
    <van-row class="user-links">
      <van-col span="6">
        <van-icon name="pending-payment" />
        待付款
      </van-col>
      <van-col span="6">
        <van-icon name="tosend" />
        待发货
      </van-col>
      <van-col span="6">
        <van-icon name="logistics" />
        待收货
      </van-col>
      <van-col span="6">
        <van-icon name="cash-back-record" />
        退款
      </van-col>
    </van-row>

    <van-cell-group class="user-group">
      <van-cell icon="records" title="全部订单" is-link />
    </van-cell-group>

    <van-cell-group>
      <van-cell icon="setting-o" title="系统设置" is-link />
      <van-cell icon="volume-o" title="系统公告" is-link />
      <van-cell icon="points" title="我的红包" is-link />
      <van-cell icon="phone-circle-o" title="联系我们" is-link />
    </van-cell-group>
  </section>
</template>

<script>
  import { Row, Col, Icon, Cell, CellGroup } from 'vant';
  export default {
      name: 'myInfo',
    components: {
      [Row.name]: Row,
      [Col.name]: Col,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup
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
