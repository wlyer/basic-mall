<template>
  <section class="wechat">
    <div class="wechat-pay">
      支付中,请稍后....
    </div>
  </section>
</template>

<script>
  export default {
    name: 'wechat',
    data () {
      return {
        code: ''
      };
    },
    mounted () {
      let _this = this;
      let code = this.$wechat.GetQueryString('code');
      if (code) {
        let orderId = localStorage.getItem('orderId');
        let orderType = localStorage.getItem('orderType');
        let money = localStorage.getItem('money');
        this.code = code;
        let aSqzwx = this.$md5((money * 100) + '' + this.$md);
        let params = {
          code: code,
          id: orderId,
          money: money,
          orderType: orderType,
          aSqzwx: aSqzwx
        };
        localStorage.removeItem('orderId');
        localStorage.removeItem('orderType');
        localStorage.removeItem('money');
        if (orderType === 0 || orderType === '0') { // 普通订单支付不要这两个参数
          delete params.orderType;
          delete params.aSqzwx;
        }
        this.$store.dispatch('wxgzpay', params).then((data) => {
          if (data.map.info.package === 'prepay_id=null') {
            _this.$toast.tipMsg('订单已失效，请取消订单重新购买!');
            return;
          }
          _this.$wechat.wexinPay(_this, data.map.info, function success (res) {
            _this.$toast.tipMsg('支付成功!');
            _this.$router.replace({ path: '/shopping/paySuccess' });
          }, function cancle () {
            _this.$toast.tipMsg('取消支付!');
            _this.$router.replace({ path: '/shopping/payError' });
          }, function error () {
            _this.$toast.tipMsg('支付失败!');
            _this.$router.replace({ path: '/shopping/payError' });
          });
        });
      } else {
        // 获取code失败
        this.$toast.tipMsg('微信授权失败');
      }
    }
  };
</script>

<style scoped lang="scss">
.wechat{
  padding-top: 50%;
  text-align: center;
  font-size: $my-max-font-size;
  font-weight: bold;
  .wechat-pay{

  }
}
</style>
