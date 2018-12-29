<template>
    <section class="commodity-detail">
      <div class="commodity-top">
        <van-swipe :autoplay="3000" class="banner">
          <van-swipe-item v-for="(item, index) in commodity.pic" :key="index">
            <img :src="$urls.goodsDownload + item" />
          </van-swipe-item>
        </van-swipe>
        <div class="commodity-info ly-card-p10">
          <h2 class="commodity-title mb10 t1">{{commodity.name}}</h2>
          <div class="commodity-detail mb10 t2">{{commodity.description}}</div>
          <div class="commodity-row mb10 clearfix">
            <span class="price">￥{{commodity.price}}</span>
            <span class="sales t2">销量 {{commodity.sham + sales}} 笔</span>
          </div>
          <div class="mb10 sales t2">
            库存{{sku.stock_num}}件
          </div>
          <div class="commodity-row">
            红包最多可抵扣：<span class="welfare">￥{{((commodity.deduction/100)*commodity.price).toFixed(2)}}</span>
          </div>
        </div>
      </div>
      <div class="commodity-pic-detail">
        <h2 class="pic-detail-title t1">- 图文详情 -</h2>
        <img :src="$urls.goodsDownload + item" v-for="(item,index) in commodity.descPic || []" :key="index" @click="toShowPic(item)">
      </div>
      <div class="no-more"></div>
      <div class="operation">
        <van-goods-action>
          <van-goods-action-mini-btn icon="chat-o" text="客服" @click="toCustomerService" />
          <van-goods-action-mini-btn icon="cart-o" text="购物车" @click="toShopCart" />
          <van-button class="action-btn" type="warning" :disabled="sku.stock_num<=0" @click="addShopCart">加入购物车</van-button>
          <van-button class="action-btn" type="danger"  :disabled="sku.stock_num<=0" @click="toBuy">立即购买</van-button>
        </van-goods-action>
        <van-sku
          v-model="showBase"
          :sku="sku"
          :goods="goods"
          :goods-id="commodity.id"
          :hide-stock="sku.hide_stock"
          :close-on-click-overlay="true"
          :show-add-cart-btn="sku.show_add_cart"
          @buy-clicked="onBuyClicked"
          @add-cart="onAddCartClicked"
          @stepper-change="onStepperChangeClicked"
        >
          <!-- 自定义 sku actions -->
          <template slot="sku-actions" slot-scope="props">
            <div class="van-sku-actions">
              <van-button type="primary" bottom-action @click="props.skuEventBus.$emit('sku:buy')">确定</van-button>
            </div>
          </template>
        </van-sku>
      </div>
      <van-popup class="show-pop" v-model="showPic">
        <img class="show-pop--img" :src="picUrl" alt="" @click="showPic = false">
      </van-popup>
    </section>
</template>

<script>
  import { Swipe, SwipeItem, GoodsAction, GoodsActionBigBtn, GoodsActionMiniBtn, Sku, Button, Popup } from 'vant';
  export default {
    name: 'commodityDetail',
    components: {
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      [Button.name]: Button,
      [Sku.name]: Sku,
      [Popup.name]: Popup,
      [GoodsAction.name]: GoodsAction,
      [GoodsActionBigBtn.name]: GoodsActionBigBtn,
      [GoodsActionMiniBtn.name]: GoodsActionMiniBtn
    },
    data () {
      return {
        showPic: false,
        picUrl: '',
        id: '',
        user: '',
        showBase: false,
        sales: 0, // 销量
        buyNum: 1,
        clickFlag: 0, // 0-点击购物车弹窗，1-点击立即购买弹窗
        commodity: {
          sham: 0
        },
        sku: {
          tree: [],
          price: '0', // 默认价格（单位元）
          stock_num: 0, // 商品总库存
          none_sku: true, // 是否无规格商品
          hide_stock: false, // 是否隐藏剩余库存
          show_add_cart: false
        },
        goods: {
          title: '',
          picture: ''
        }
      };
    },
    computed: {
    },
    mounted () {
      const { id } = this.$route.query;
      let user = localStorage.getItem('user');
      if (user) {
        this.user = user = JSON.parse(user);
      }
      this.id = id;
      this.getCommodity(id);
      this.getSales(id);
    },
    methods: {
      toShowPic (name) {
        this.picUrl = this.$urls.goodsDownload + name;
        this.showPic = true;
      },
      getCommodity (id) {
        this.$toast.loadingMsg();
        let params = {
          ids: id
        };
        this.$store.dispatch('getCommodity', params).then((data) => {
          if (data.result) {
            this.$toast.close();
            let commodity = data.map.info[0];
            let pics = commodity.pic.split(',');
            pics.shift();
            this.commodity = Object.assign({}, commodity, { pic: pics, descPic: commodity.descPic.split(',') });
            this.goods = {
              title: commodity.name,
              picture: this.$urls.goodsDownload + this.commodity.pic[0]
            };
            // 规格
            let v = [];
            let list = [];
            let price = commodity.price * 100;
            let totalNum = commodity.totalNum;
            let specificationList = [];
            if (commodity.specificationList) {
              if (commodity.specificationList.indexOf(',') > -1) {
                specificationList = commodity.specificationList.split(',');
              } else {
                specificationList = [commodity.specificationList];
              }
            }
            specificationList.map((item) => {
              v.push({
                id: item,
                name: item
              });
              list.push({
                id: item, // skuId，下单时后端需要
                price: price, // 价格（单位分）
                s1: item, // 规格类目 k_s 为 s1 的对应规格值 id
                stock_num: totalNum // 当前 sku 组合对应的库存
              });
            });
            this.sku = {
              tree: [{
                k: '规格', // skuKeyName：规格类目名称
                v: v,
                k_s: 's1' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
              }],
              // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
              list: list,
              price: commodity.price.toFixed(2), // 默认价格（单位元）
              stock_num: commodity.totalNum, // 商品总库存
              none_sku: false, // 是否无规格商品
              hide_stock: false, // 是否隐藏剩余库存
              show_add_cart: false
            };
          }
        });
      },
      // 获取销量
      getSales (id) {
        let params = {
          ids: id
        };
        this.$store.dispatch('getSales', params).then((data) => {
          if (data.result) {
            this.sales = data.map.info;
          }
        });
      },
      // 客服
      toCustomerService () {
        // eslint-disable-next-line
        // ysf.open();
        this.$toast.tip();
      },
      // 去购物车
      toShopCart () {
        this.$router.push({ path: '/mall/shopCart' });
      },
      // 加入购物车
      addShopCart () {
        this.clickFlag = 0;
        this.showBase = true;
        // this.buyNum = 1;
      },
      // 立即购买
      toBuy () {
        this.clickFlag = 1;
        this.showBase = true;
      },
      // 购物车弹框中点击加入购物车，计入数据库
      onAddCartClicked (data) {

      },
      // 购物车弹框中点击确定（立即购买）
      onBuyClicked (data) {
        if (this.clickFlag === 0) { // 点击购物车，里面点击确定
          if (this.user === '') {
            // 未登录
            this.$router.push({ path: '/login' });
            return;
          }
          let params = {
            commodityId: this.id,
            num: this.buyNum,
            createBy: this.user.userCode,
            specification: data.selectedSkuComb.id
          };
          this.$store.dispatch('addShopCart', params);
          this.$toast.success('加入购物车');
          this.showBase = false;
        } else { // 点击立即购买，里面点击确定
          this.showBase = false;
          // 跳转至订单支付
          let params2 = [
            {
              id: this.id,
              num: this.buyNum,
              specification: data.selectedSkuComb.id
            }
          ];
          this.$store.dispatch('addOrderCommodities', params2);
          this.$router.push({ path: '/mall/shopOrder', query: { isShopCart: 0 } });
        }
      },
      // 购买数量变化时触发
      onStepperChangeClicked (num) {
        this.buyNum = num;
      }
    }
  };
</script>

<style scoped lang="scss">
.commodity-detail{
  .commodity-top{
    .commodity-info{
      padding: 10px;
      .price{
        font-style: $my-max-font-size;
        margin-top: 5px;
      }
      .commodity-title{
        line-height: 25px;
        font-weight: bold;
        width: 100%;
        display: block;
      }
      .sales{
        float: right;
      }
      .welfare{
        color:$my-theme-color;
      }
    }
  }
  .buy-info{
    padding: 10px;
  }
  .commodity-pic-detail{
    margin-bottom: 50px;
    .pic-detail-title{
      text-align: center;
      font-weight: bold;
      padding: 10px 0;
    }
    img{
      height: 100%;
      width: 100%;
    }
  }
  .action-btn{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    padding: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    border: 0;
    border-radius: 0;
    font-size: 16px;
    color: #fff;
  }
  .operation{
    background-color: #ffffff;
  }
  .van-button--danger.van-button--disabled {
    opacity: 1;
    background-color: #fc9f9f;
    border: 1px solid #fc9f9f;
  }
  .van-button--warning.van-button--disabled {
    opacity: 1;
    background-color: #f5a887;
    border: 1px solid #f5a887;
  }
}
</style>
