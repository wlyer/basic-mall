<template>
  <section class="pay-success">
    <div class="status">
      <img class="icon" src="../../../assets/images/icon/pay_success.png">
      <!--<img class="icon" src="../../assets/images/icon/pay_error.png">-->
      <div class="">{{payStatus}}</div>
    </div>
    <van-button type="danger" plain class="operation-btn" @click="toHome">返回首页</van-button>
  </section>
</template>

<script>
  import Vue from 'vue';
  import { Button } from 'vant';
  Vue.use(Button);
  export default {
    name: 'paySuccess',
    data () {
      return {
        payStatus: '支付成功'
      };
    },
    methods: {
      toHome () {
        this.$router.push({ path: '/' });
      }
    }
  };
</script>

<style scoped lang="scss">
.pay-success{
  padding: 0 10px;
  .status{
    text-align: center;
    margin-top: 80px;
    margin-bottom: 40px;
    .icon{
      display: block;
      width: 60px;
      height: 60px;
      margin: 10px auto;
    }
  }
}
</style>
