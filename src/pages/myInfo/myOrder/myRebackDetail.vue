<template>
    <section class="my-reback-detail">
        <van-card
          :title="commodityInfo.name"
          :desc="commodityInfo.specification"
          :num="commodityInfo.orderNum"
          :price="commodityInfo.price"
          :thumb="$urls.goodsDownload + (commodityInfo.pic?commodityInfo.pic.split(',')[0]:'')"
        />
      <div class="line"></div>
      <van-field
        v-model="totalPrice"
        label="退款金额"
        disabled
      />
      <div class="line"></div>
      <van-field
        v-model="rebackForm.refundReason"
        label="退款原因"
        type="textarea"
        placeholder="请输入退款原因"
        rows="1"
        autosize
      />
      <div class="line"></div>
      <div class="desc">注意事项:     购买商品所消耗的红包只有订单全额退款才允许退回！</div>
      <div class="line"></div>
      <van-button class="operation-btn" type="danger" @click="rebackGoods">确认</van-button>
    </section>
</template>

<script>
  import { Card, Button, Field } from 'vant';
  export default {
    name: 'myOrder',
    components: {
      [Card.name]: Card,
      [Button.name]: Button,
      [Field.name]: Field
    },
    data () {
      return {
        commodityInfo: {},
        rebackForm: {
          refundReason: '',
          money: '￥100'
        }
      };
    },
    computed: {
      totalPrice () {
        return '￥' + this.commodityInfo.money;
      }
    },
    mounted () {
      this.getOrderDetail();
    },
    methods: {
      getOrderDetail () {
        this.$toast.loading();
        const { id } = this.$route.query;
        let params = {
          id: id
        };
        this.$store.dispatch('getOrderDetailById', params).then((data) => {
          if (data.result) {
            this.$toast.endLoading();
            this.commodityInfo = data.map.info;
          }
        });
      },
      // 退货
      rebackGoods (id) {
         let params = {
          id: this.commodityInfo.detailId,
          status: 1,
          refundReason: this.rebackForm.refundReason
        };
        this.$store.dispatch('editDetailStatus', params).then((data) => {
          if (data.result) {
            this.$router.go(-1);
          }
        });
      }
    }
  };
</script>
<style lang="scss">
  .my-reback-detail {
    .van-field__control:disabled{
      color: $my-theme-color;
    }
  }
</style>
<style scoped lang="scss">
.my-reback-detail{
  .desc{
    color:$my-tiny-color;
    height: 45px;
    line-height: 45px;
    padding: 0 10px;
  }
}
</style>
