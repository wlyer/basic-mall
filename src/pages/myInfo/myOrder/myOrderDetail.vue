<template>
    <section class="my-order-detail">
      <van-steps :active="stepActive" class="order-state" active-color="#e63955">
        <van-step>待付款</van-step>
        <van-step>待发货</van-step>
        <van-step>待收货</van-step>
        <van-step>交易完成</van-step>
        <van-step>交易关闭</van-step>
      </van-steps>
      <div class="line"></div>
      <div class="commodity-info bb" >
        <div
          v-for="(commodity,index) in orderInfo.orderCommodities"
          :key="index">
          <van-card
            :title="commodity.name"
            :desc="commodity.specification"
            :num="commodity.orderNum"
            :price="commodity.price"
            :thumb="$urls.goodsDownload + commodity.pic.split(',')[0]"
          >
            <div slot="tags" class="tags-type">
              {{commodity.type === 0 ? '普通商品' : '虚拟商品'}}
            </div>
            <div slot="footer">
              <van-button size="mini" @click="rebackGoods(commodity.detailId)" v-if="(orderInfo.status === 1 || orderInfo.status === 2 || orderInfo.status === 3) && commodity.status === 0">退款</van-button>
              <span class="reback-status" v-if="commodity.status === 1">退款中</span>
              <span class="reback-status" v-if="commodity.status === 2">退款成功</span>
              <span class="reback-status" v-if="commodity.status === 3">退款失败</span>
              <span class="reback-status" v-if="commodity.status === 4">交易完成</span>
            </div>
          </van-card>
        </div>
        <div class="order-total van-hairline--top">
          共{{totalNum}}件商品&nbsp;&nbsp;
          红包抵扣：￥{{orderInfo.deductionMonry}} &nbsp;&nbsp;
          {{orderInfo.status === 0 ? '待支付' : '实付'}}：<span class="price">￥{{orderInfo.totalMoney}}</span>
        </div>
      </div>
      <div class="line"></div>
      <div class="order-info">
        <div>订单编号：{{orderInfo.id}}</div>
        <div>创建时间：{{$utils.format(orderInfo.createTime)}}</div>
        <div>收货人：{{orderInfo.receiver}}</div>
        <div>联系电话：{{orderInfo.phone}}</div>
        <div>收货地址：{{orderInfo.area + orderInfo.address}}</div>
        <div>备注：{{orderInfo.description}}</div>
      </div>
    </section>
</template>

<script>
  import { Card, Button, Step, Steps } from 'vant';
  export default {
    name: 'myOrder',
    components: {
      [Card.name]: Card,
      [Button.name]: Button,
      [Step.name]: Step,
      [Steps.name]: Steps
    },
    computed: {
      totalNum () {
        let total = 0;
        if (this.orderInfo.orderCommodities) {
          total = this.orderInfo.orderCommodities.length;
        }
        return total;
      }
    },
    data () {
      return {
        stepActive: 0,
        orderState: 0,
        orderInfo: {}
      };
    },
    mounted () {
      this.getOrder();
    },
    methods: {
      getOrder () {
        this.$toast.loading();
        const { id } = this.$route.query;
        let params = {
          ids: id
        };
        this.$store.dispatch('getOrder', params).then((data) => {
          if (data.result) {
            this.$toast.endLoading();
            this.orderInfo = data.map.info[0];
            if (this.orderInfo.status === 5) {
              this.stepActive = 3;
            } else if (this.orderInfo.status === 6) {
              this.stepActive = 4;
            } else {
              this.stepActive = this.orderInfo.status;
            }
          }
        });
      },
      // 退货
      rebackGoods (detailId) {
        this.$router.push({ path: '/aboutUs/myRebackDetail', query: { id: detailId } });
      },
      toCommodity (id) {
        this.$router.push({ path: '/shopping/commodityDetail', query: { id: id } });
      }
    }
  };
</script>
<style scoped lang="scss">
.my-order-detail{
  .reback-status{
    font-size: 12px;
  }
  .commodity-info{
    margin: 10px 0 0;
  }
  .order-total{
    padding: 10px 15px;
    text-align: right;
  }
  .order-info{
    padding: 10px;
    div{
      padding-bottom:10px;
    }
  }
}
</style>
