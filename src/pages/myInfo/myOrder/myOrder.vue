<template>
    <section class="my-order">
      <van-tabs v-model="orderState" sticky @click="changeState">
        <van-tab title="全部"></van-tab>
        <van-tab title="待付款"></van-tab>
        <van-tab title="待发货"></van-tab>
        <van-tab title="待收货"></van-tab>
        <van-tab title="退款"></van-tab>
      </van-tabs>
      <div class="list-content" id="list-content" ref="listContent" v-if="orderState !== 4">
        <van-list
          v-model="loading"
          :finished="finished"
          :offset="100"
          @load="onLoad"
          ref="list"
        >
          <div class="order-item " v-for="(item,index1) in orderList" :key="index1">
            <div class="order-info bb">
              <span class="fl">订单编号:{{item.id}}</span>
              <span class="rl">{{orderStatus(item.status)}}</span>
            </div>
            <div @click="toOrderDetail(item.id)" class="bb">
              <van-card
                v-for="(commodity,index) in item.orderCommodities"
                :key="index"
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
                  <span class="reback-status" v-if="commodity.status === 1">退款中</span>
                  <span class="reback-status" v-if="commodity.status === 2">退款成功</span>
                  <span class="reback-status" v-if="commodity.status === 3">退款失败</span>
                  <span class="reback-status" v-if="commodity.status === 4">交易完成</span>
                </div>
              </van-card>
            </div>
            <div class="order-total">
              共{{item.orderCommodities.length}}件&nbsp;&nbsp;
              红包抵扣：￥{{item.deductionMonry}} &nbsp;&nbsp;
              合计：￥{{item.totalMoney}}
            </div>
            <div class="operation" v-if="item.status==0 || item.status==2">
              <van-button type="danger" @click="handleShowPayWay(item.id)" class="end-order" v-if="item.status==0">付款</van-button>
              <van-button type="danger" @click="editOrderStatus(item.id,3)" class="end-order" v-if="item.status==2">确认收货</van-button>
              <van-button  @click="editOrderStatus(item.id,6)" class="end-order" v-if="item.status==0">取消订单</van-button>
              <!--取消订单需要传6，因为需要考虑退库存，退红包。点击后，订单状态变成交易关闭，4、6现在都是交易关闭-->
            </div>
            <div class="line"></div>
          </div>
        </van-list>
        <div class="no-more-data" v-if="orderList.length===0  || finished"></div>
      </div>
      <!--退货单独-->
      <div class="order-item " v-for="(item,index) in rebackOrderList" v-if="orderState === 4">
        <div class="bb">
          <div class="order-info bb clearfix">
            <span class="rl">{{rebackStatus(item.status)}}</span>
          </div>
          <van-card
            :title="item.name"
            :desc="item.specification"
            :num="item.orderNum"
            :price="item.price"
            :thumb="$urls.goodsDownload + item.pic.split(',')[0]"
          >
            <div slot="tags" class="tags-type">
              {{item.type === 0 ? '普通商品' : '虚拟商品'}}
            </div>
          </van-card>
        </div>
        <div class="order-total">
          合计：￥{{item.price * item.orderNum}}
        </div>
        <div class="line"></div>
        <div class="no-more-data" v-if="orderState === 4 && index === rebackOrderList.length-1"></div>
      </div>
      <van-actionsheet
        v-model="showPayWay"
        :actions="actions"
        cancel-text="取消"
        @select="onSelectPayWay"
        @cancel="showPayWay = false"
      />
    </section>
</template>

<script>
  import { List, Card, Button, Tab, Tabs, Actionsheet } from 'vant';
  export default {
    name: 'myOrder',
    components: {
      [List.name]: List,
      [Card.name]: Card,
      [Button.name]: Button,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Actionsheet.name]: Actionsheet
    },
    data () {
      return {
        orderId: '',
        showPayWay: false,
        orderTotal: 0,
        orderPage: 1,
        orderList: [],
        rebackOrderList: [],
        loading: false,
        finished: false,
        orderState: 0,
        actions: [
          {
            name: '微信'
          },
          {
            name: '支付宝'
          }
        ]
      };
    },
    computed: {

    },
    mounted () {
      let winHeight = document.documentElement.clientHeight; // 视口大小
      document.getElementById('list-content').style.height = (winHeight - 46 * 2) + 'px'; // 调整上拉加载框高度
      const { status } = this.$route.query;
      this.orderState = status;
      this.orderList = [];
      this.rebackOrderList = [];
      if (this.orderState !== 4) {
        this.orderPage = 1;
        this.finished = false;
      } else {
        this.getRebackOrders();
      }
    },
    methods: {
      handleShowPayWay (orderId) {
        if (this.$wechat.isWechat()) {
          this.payOrder(1, orderId);
        } else {
          this.showPayWay = true;
          this.orderId = orderId;
        }
      },
      onSelectPayWay (item) {
        this.showPayWay = false;
        let payWay = 0;
        if (item.name === '微信') {
          payWay = 1;
        } else { // 支付宝
          payWay = 2;
        }
        this.payOrder(payWay, this.orderId);
      },
      orderStatus (status) {
        let str = '';
        switch (status) {
          case 0:
            str = '待付款';
            break;
          case 1:
            str = '待发货';
            break;
          case 2:
            str = '待收货';
            break;
          case 3:
            str = '交易完成';
            break;
          case 4:
            str = '交易关闭';
            break;
          case 5:
            str = '交易完成';
            break;
          case 6:
            str = '交易关闭';
            break;
          default:
            break;
        }
        return str;
      },
      rebackStatus (status) {
        let str = '';
        switch (status) {
          case 0:
            str = '正常';
            break;
          case 1:
            str = '退款中';
            break;
          case 2:
            str = '退款成功';
            break;
          case 3:
            str = '退款失败';
            break;
          case 4:
            str = '交易完成';
            break;
          default:
            break;
        }
        return str;
      },
      payOrder (payType, id) {
        // 去支付
        if (payType === 1) { // 微信
          if (this.$wechat.isWechat()) {
            localStorage.setItem('orderId', id);
            localStorage.setItem('orderType', 0);
            localStorage.setItem('money', 0);
            this.$toast.tipMsg('微信授权中……');
            let currentUrl = encodeURIComponent('http://www.dali5.com/shopping/wechat');
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8ca5f07c892b9380&redirect_uri=' + currentUrl + '&response_type=code&scope=snsapi_base&state=snsapi_base#wechat_redirect';
          } else {
            window.location.href = this.$urls.wxpayHost + id + '&money=0';
          }
        } else if (payType === 2) { // 支付宝
          window.location.href = this.$urls.alipayHost + id + '&money=0';
        }
      },
      editOrderStatus (id, status) {
        let params = {
          ids: id,
          status: status
        };
        this.$store.dispatch('editStatus', params).then((data) => {
          if (data.result) {
            this.orderList = [];
            this.totalPage = 0;
            this.orderPage = 1;
            this.finished = false;
            this.getOrders();
          }
        });
      },
      changeState (index) {
        this.orderList = [];
        this.rebackOrderList = [];
        if (index === 4) {
          this.getRebackOrders();
        } else {
          this.totalPage = 0;
          this.orderPage = 1;
          this.orderState = index;
          this.finished = false;
          this.getOrders();
        }
      },
      getRebackOrders () {
        let params = {
          userCode: this.$user.userCode,
          status: 0
        };
        this.$store.dispatch('getRebackOrder', params).then((data) => {
          if (data.result) {
            this.rebackOrderList = data.map.info;
          }
        });
      },
      // index 状态
      getOrders () {
        const _this = this;
        let status = -1;
        switch (this.orderState) {
          case 0:
            status = -1;// 全部
            break;
          case 1:
            status = 0;// 代付款
            break;
          case 2:
            status = 1;// 代发货
            break;
          case 3:
            status = 2;// 待收货
            break;
        }
        let params = {
          page: this.orderPage,
          pageSize: 20,
          id: '',
          area: '',
          payType: -1,
          status: status,
          createBy: this.$user.userCode
        };
        this.$store.dispatch('getOrders', params).then((data) => {
          if (data.result) {
            _this.orderTotalPage = data.map.totalPage;
            _this.loading = false;
            if (data.map.pageNum === 1) {
              _this.orderList = data.map.info;
            } else {
              _this.orderList = _this.orderList.concat(data.map.info);
            }
            if (_this.orderPage >= _this.orderTotalPage) {
              _this.finished = true;
            }
            _this.orderPage = _this.orderPage + 1;
          }
        });
      },
      onLoad () {
        const _this = this;
        setTimeout(() => {
          _this.getOrders();
        }, 500);
      },
      toOrderDetail (orderId) {
        this.$router.push({ path: '/aboutUs/myOrderDetail', query: { id: orderId } });
      }
    }
  };
</script>
<style lang="scss">
  .my-order {
    .van-card__title {
      margin-top: 5px !important;
    }
    .van-tabs__wrap--scrollable .van-tab {
      -ms-flex: 0 0 20% !important;
      flex: 0 0 20% !important;
    }
    button.end-order.van-button.van-button--danger.van-button--normal,button.end-order.van-button.van-button--default.van-button--normal {
      width: 60px;
      height: 30px;
      line-height: 30px;
      padding: 0 2px;
      font-size: 12px;
      margin-left: 5px;
    }
  }
</style>
<style scoped lang="scss">
.my-order{
  .order-item{
    .order-info{
      padding: 10px 15px;
      min-height: 40px;
      max-height: 40px;
      height: 40px;
    }
    .order-total{
      padding: 10px 5px;
      text-align: right;
    }
    .operation{
      text-align: right;
      padding: 10px;
    }
  }
}
</style>
