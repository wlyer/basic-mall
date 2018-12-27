<template>
  <section class="shop-order">
    <!--收货地址-->
    <div class="get-goods-address dbox" @click="toEditAddress">
      <van-icon name="location-o" class="address-icon"/>
      <div  class="address flex1">
        <div>姓名:{{addressInfo.name}}</div>
        <div>电话:{{addressInfo.tel}}</div>
        <div class="van-ellipsis">地址:{{addressInfo.address}}</div>
      </div>
      <van-icon name="arrow" class="address-icon"/>
    </div>
    <div class="color-line mb10"></div>
    <div class="commodity-info ly-card-p10">
      <van-card
        v-for="(item,index) in commodities"
        :key="index"
        :title="item.name"
        :desc="specificationList[index]"
        :num="nums[index]"
        :price="item.price"
        :thumb="$urls.goodsDownload + item.pic.split(',')[0]"
      >
        <div slot="tags" class="tags-type">
          {{item.type === 0 ? '普通商品' : '虚拟商品'}}
        </div>
       <!-- <div slot="footer" class="deduction">
         红包最多可抵扣: ￥{{$utils.cheng($utils.chu(item.deduction, 100), item.price)}}
        </div>-->
      </van-card>
    </div>
    <!--<van-cell class="mb10" clickable :title="`可抵扣金额 ：${orderForm.deductionMonry}`" >
      <van-checkbox v-model="isFree" />
    </van-cell>-->
    <div class="pay-way mb10">
      <van-radio-group v-model="payWay">
        <van-cell-group>
          <van-cell title="支付方式" class="bb"></van-cell>
          <van-cell title="支付宝" clickable @click="payWay = '1'" v-if="!$wechat.isWechat()">
            <img class="icon-pay" src="../../../assets/images/icon/alipay.png" slot="icon"/>
            <van-radio name="1" />
          </van-cell>
          <van-cell title="微信" clickable @click="payWay = '2'" v-if="$wechat.isWechat()">
            <img class="icon-pay" src="../../../assets/images/icon/wechat.png" slot="icon"/>
            <van-radio name="2" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
    <van-field
      v-model="orderForm.description"
      label="备注"
      type="textarea"
      placeholder="请输入备注"
      :rows="1"
      autosize
    />
    <van-submit-bar
      class="operation"
      :price="sumPrice"
      :loading="loading"
      button-text="提交订单"
      @submit="onSubmitOrder"
      :disabled="commodities.length===0"
    />
  </section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { Cell, CellGroup, Card, Field, SubmitBar, Icon, RadioGroup, Radio, Checkbox, CheckboxGroup } from 'vant';
  export default {
    name: 'shopOrder',
    components: {
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Card.name]: Card,
      [Field.name]: Field,
      [SubmitBar.name]: SubmitBar,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Checkbox.name]: Checkbox,
      [CheckboxGroup.name]: CheckboxGroup
    },
    computed: {
      ...mapGetters([
        'addressInfo',
        'orderCommodities'
      ]),
      // 价格计算统计
      sumPrice () {
        this.jisuanPrice();
      }
    },
    data () {
      return {
        commodityType: 1, // 0 普通商品，1 虚拟商品
        isShopCart: 0, // 0 商品直接点击购买过来的，1-购物车过来的
        isFree: true,
        myMoney: 0, // 我的红包，现在默认0
        welfareMoneys: [], // 每个商品抵扣红包的金额
        realMoneys: [], // 每个商品实际付的金额，（即总金额-红包）
        loading: false,
        commodities: [], // 每个商品抵扣红包的金额
        nums: [],
        payWay: this.$wechat.isWechat() ? '2' : '1',
        orderForm: {
          description: '',
          deductionMonry: 0
        },
        specificationList: [] // 规格列表
      };
    },
    watch: {
    },
    mounted () {
      const { isShopCart } = this.$route.query;
      this.isShopCart = isShopCart;
      this.handleCommodity();
      // this.getWelfare();
      this.getAddressInfo();
    },
    methods: {
      // 计算价格
      jisuanPrice () {
        let welfareMoneys = []; // 每个商品抵扣红包的金额
        let realMoneys = []; // 每个商品实际付的金额，（即总金额-红包）
        // 可抵扣金额
        let freeMoney = 0;
        let totalWelfareMoney = this.myMoney;
        for (let i = 0; i < this.commodities.length; i++) {
          let money = 0;
          // let realMoney = (this.commodities[i].price * this.nums[i]);// 实际金额
          let realMoney = this.$utils.cheng(this.commodities[i].price, this.nums[i]);// 实际金额
          // money = (realMoney * (this.commodities[i].deduction) / 100);// 最多可抵扣商品的抵扣率
          money = this.$utils.cheng(realMoney, this.$utils.chu(this.commodities[i].deduction, 100));// 最多可抵扣商品的抵扣率
          if (totalWelfareMoney >= money) {
            // freeMoney += money;// 可抵扣的增加
            freeMoney = this.$utils.jia(money, freeMoney);// 可抵扣的增加
            // totalWelfareMoney -= money;// 红包减少
            totalWelfareMoney = this.$utils.jian(totalWelfareMoney, money);// 红包减少
            welfareMoneys.push(money);
            // realMoneys.push(realMoney - money);
            realMoneys.push(this.$utils.jian(realMoney, money));
          } else {
            if (totalWelfareMoney > 0) { // 剩下的即使不够，也全给了
              // freeMoney += totalWelfareMoney;// 可抵扣的增加
              freeMoney = this.$utils.jia(freeMoney, totalWelfareMoney);// 可抵扣的增加
              welfareMoneys.push(totalWelfareMoney);
              // realMoneys.push(realMoney - totalWelfareMoney);
              realMoneys.push(this.$utils.jian(realMoney, totalWelfareMoney));
              totalWelfareMoney = 0;// 红包减少
            } else {
              welfareMoneys.push(0);
              realMoneys.push(realMoney);
            }
          }
        }

        this.welfareMoneys = welfareMoneys;
        this.realMoneys = realMoneys;

        // this.orderForm.deductionMonry = freeMoney.toFixed(2); // 总红包抵扣金额
        this.orderForm.deductionMonry = freeMoney; // 总红包抵扣金额
        // 计算总金额
        let sum = 0;
        for (let i = 0; i < this.commodities.length; i++) {
          // sum += this.commodities[i].price * this.nums[i];
          sum = this.$utils.jia(sum, this.$utils.cheng(this.commodities[i].price, this.nums[i]));
        }
        // let result = sum * 100;
        let result = this.$utils.cheng(sum, 100);
        // 计算最终金额
        if (this.isFree) { // 使用红包
          // result = result - (this.orderForm.deductionMonry * 100);
          result = this.$utils.jian(result, this.$utils.cheng(this.orderForm.deductionMonry, 100));
        }
        return result;
      },
      // 获取红包数
      getWelfare () {
        let params = {
          userCode: this.$user.userCode
        };
        this.$store.dispatch('getWelfareDetail', params).then((res) => {
          this.myMoney = res.map.totalMoney;
        });
      },
      // 处理订单数据
      handleCommodity () {
        let info = this.orderCommodities;
        if (info.length === 0) { // 没有商品
          return;
        }
        let ids = [];
        let nums = [];
        let specificationList = [];
        for (let i = 0; i < info.length; i++) {
          ids.push(info[i].id);
          nums.push(info[i].num);
          specificationList.push(info[i].specification);
        }
        let params = {
          ids: ids.toString()
        };
        this.$store.dispatch('getCommodity', params).then((data) => {
          if (data.result) {
            this.commodities = data.map.info;
            this.commodityType = data.map.info.length > 0 ? data.map.info[0].type : 1; // 如果是普通商品就是0 ，虚拟商品是1 ，没有商品也默认是1
            this.nums = nums;
            this.specificationList = specificationList;
          }
        });
      },
      // 提交订单
      onSubmitOrder () {
        if (this.commodities.length <= 0) {
          this.$toast.tipMsg('没有需要购买的商品');
          return;
        }
        // 普通商品才需要收货地址
        if ((this.commodityType === 0) && (this.addressInfo.name === '' || this.addressInfo.tel === '' || this.addressInfo.address === '')) {
          this.$toast.tipMsg('请填写收货地址');
          return;
        }
        this.loading = true;
        let orderDetailSaveReqs = [];
        let nums = 0;
        for (let i = 0; i < this.commodities.length; i++) {
          nums += this.nums[i];
          orderDetailSaveReqs.push({
            commodityId: this.commodities[i].id,
            orderNum: this.nums[i],
            money: this.realMoneys[i],
            specification: this.specificationList[i]
          });
        };
        let totalMoney = this.$utils.chu(this.sumPrice, 100);
        let aSqzwx = this.$md5((totalMoney * 100) + '' + nums + this.$md);
        let params = {
          receiver: this.commodityType === 0 ? this.addressInfo.name : '',
          phone: this.commodityType === 0 ? this.addressInfo.tel : '',
          area: this.commodityType === 0 ? this.addressInfo.areaName : '',
          address: this.commodityType === 0 ? this.addressInfo.addressDetail : '',
          postalCode: this.commodityType === 0 ? (this.sPostalCode ? this.sPostalCode : this.$user.sPostalCode) : '',
          description: this.orderForm.description,
          totalMoney: totalMoney,
          deductionMonry: this.orderForm.deductionMonry,
          feeMoney: 0,
          status: 0,
          createBy: this.$user.userCode,
          orderDetailSaveReqs: orderDetailSaveReqs,
          isShoppingCart: this.isShopCart,
          aSqzwx: aSqzwx,
          orderPostalCode: this.$user.postalCode
        };
        this.$store.dispatch('vaildOrder', params).then((res) => {
          if (res.result) { // 库存够了，去提交订单
            this.$store.dispatch('addOrder', params).then((data) => {
              if (data.result) {
                this.loading = false;
                // 新增红包记录
                if (this.orderForm.deductionMonry > 0) {
                  let welfareParams = {
                    type: 2,
                    money: '-' + this.orderForm.deductionMonry,
                    answerUserCode: '',
                    orderNo: data.map.orderId,
                    createBy: this.$user.userCode
                  };
                  this.$store.dispatch('addWelfare', welfareParams);
                }
                // 去支付
                if (this.payWay === '1') { // 0-支付宝，1-微信
                  window.location.href = this.$urls.alipayHost + data.map.orderId + '&money=0';
                } else {
                  if (this.$wechat.isWechat()) {
                    localStorage.setItem('orderId', data.map.orderId);
                    localStorage.setItem('orderType', 0);
                    localStorage.setItem('money', 0);
                    // this.$toast.tipMsg('微信授权中……');
                    let currentUrl = encodeURIComponent('http://www.dali5.com/shopping/wechat');
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8ca5f07c892b9380&redirect_uri=' + currentUrl + '&response_type=code&scope=snsapi_base&state=snsapi_base#wechat_redirect';
                  } else {
                    window.location.href = this.$urls.wxpayHost + data.map.orderId + '&money=0';
                  }
                }
              } else {
                this.$toast.tipMsg('提交订单失败！');
              }
            });
          } else {
            this.$this.$toast.tipMsg.tipMsg('库存不足，提交订单失败！');
          }
        });
      },
      // 获取地址信息
      getAddressInfo () {
        let address = {
          id: this.$user.id,
          name: this.$user.userName || '',
          tel: this.$user.phone || '',
          addressDetail: this.$user.sAddress || '',
          areaCode: this.$user.sPostalCode ? this.$user.sPostalCode.split('-')[2] : '',
          address: (this.$user.sArea || '') + (this.$user.sAddress || ''),
          areaName: this.$user.sArea || ''
        };
        this.$store.dispatch('addAddressInfo', address);
      },
      // 去编辑地址页
      toEditAddress () {
        this.$router.push('/mall/editAddress');
      }
    },
    destroyed () {
    }
  };
</script>
<style scoped lang="scss">
.shop-order{
    .get-goods-address{
      position: relative;
      line-height: 30px;
      height: 120px;
      background-color: #FFFFFF;
      padding: 10px;
      .address-icon{
        line-height: 100px;
      }
      .address{
        margin:0 20px;
      }
    }
    .color-line{
      background: url('../../../assets/images/icon/address-line.png') repeat-x center;
      height: 3px;
      width: 100%;
    }
    .pay-way{
      img{
        height: 25px;
        width: 25px;
        margin-right: 5px;
      }
    }
    .commodity-info{
      margin-top: 10px;
      .deduction {
        color: #e63955;
        font-size:12px;
      }
    }
    .operation{
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 50px;
      z-index:999;
      line-height: 50px;
      background: #ffffff;
    }
}
</style>
