<template>
    <section class="shop-order">
      <div class="order" v-if="!showAddress">
        <van-nav-bar
          title="确认订单"
          left-arrow
          left-text="返回"
          @click-left="$router.go(-1)"
          class="top"
        />
        <div class="content">
          <!--收货地址-->
          <div class="get-goods-address" v-if="commodityType == 0">
            <van-cell-group>
              <van-cell @click="showAddress = true">
                <template slot="title">
                  <i class="iconfont position-icon">&#xe60f;</i>
                  <div  class="address">
                    <div>姓名:{{addressInfo.name}}</div>
                    <div>电话:{{addressInfo.tel}}</div>
                    <div>地址:{{addressInfo.address}}</div>
                  </div>
                  <i class="iconfont arrow-icon">&#xe633;</i>
                </template>
              </van-cell>
            </van-cell-group>
          </div>
          <div class="color-line" v-if="commodityType == 0"></div>
          <div class="line2" v-if="commodityType == 0"></div>
          <div class="commodity-info">
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
              <div slot="footer" class="deduction">
               红包最多可抵扣: ￥{{$utils.cheng($utils.chu(item.deduction, 100), item.price)}}
              </div>
            </van-card>
          </div>
          <div class="line"></div>
          <van-cell-group>
            <van-cell clickable :title="`可抵扣金额 ：${orderForm.deductionMonry}`" >
              <van-checkbox v-model="isFree" />
            </van-cell>
            <div class="line"></div>
            <van-field
              v-model="orderForm.description"
              label="备注"
              type="textarea"
              placeholder="请输入备注"
              rows="1"
              autosize
            />
          </van-cell-group>
          <div class="line2"></div>
          <div class="pay-way">
            <van-radio-group v-model="payWay">
              <van-cell-group>
                <van-cell title="支付宝" clickable @click="payWay = '1'" v-if="!$wechat.isWechat()">
                  <img class="icon-pay" src="../../assets/images/icon/alipay.png" slot="icon"/>
                  <van-radio name="1" />
                </van-cell>
                <van-cell title="微信" clickable @click="payWay = '2'" v-if="$wechat.isWechat()">
                  <img class="icon-pay" src="../../assets/images/icon/wechat.png" slot="icon"/>
                  <van-radio name="2" />
                </van-cell>
              </van-cell-group>
            </van-radio-group>
            <div class="line"></div>
            <div class="question p10"><span class="links bb" @click="showPop">如何挣红包？</span></div>
          </div>
        </div>
        <van-submit-bar
          class="operation"
          :price="sumPrice"
          :loading="loading"
          button-text="提交订单"
          @submit="onSubmitOrder"
          :disabled="commodities.length===0"
        />
      </div>
      <div v-if="showAddress">
        <van-nav-bar
          title="编辑地址"
          left-arrow
          left-text="返回"
          @click-left="showAddress = false"
          class="top"
        />
        <van-address-edit
          :area-list="areaList"
          :address-info="addressInfo"
          show-set-default
          @save="onSave"
          @change-area="changeArea"
        />
      </div>
      <van-popup v-model="show">
        <div class="get-welfare-desc">
          <i class="iconfont close" @click="show = false">&#xe639;</i>
          <div class="pop-header bb">如何挣红包</div>
          <div class="p10">
            <p class="mb10">1.用户可以通过分享答题来挣取红包，在该分享链接中，答题者每答对一题，会赢得1-50元不等额度红包；于此同时，该链接对应的分享者也享有同等额度的红包。</p>
            <p class="mb20">2.红包可用于购买商品时进行抵扣，抵扣的金额根据商品的不同有所区别。</p>
            <p class="mb20">3.用户可通过保存二维码分享、点击去分享答题页按钮两种方式进行分享答题。</p>
            <div class="qrcode">
              <div id="qrcode" class="qrcode" ref="qrcode"></div>
              长按二维码保存，并分享答题链接
            </div>
          </div>
        </div>
        <van-button class="operation-btn" type="danger" @click="toShareSubject">去分享答题页</van-button>
      </van-popup>
    </section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Vue from 'vue';
  import areaList from '@/utils/area.js';
  import QRCode from 'qrcodejs2';
  import { Popup, Cell, CellGroup, Card, Field, SubmitBar, AddressEdit, NavBar, Icon, RadioGroup, Radio, Toast, Checkbox, CheckboxGroup } from 'vant';
  Vue.use(AddressEdit);
  Vue.use(NavBar);
  Vue.use(Icon);
  Vue.use(Cell).use(CellGroup);
  Vue.use(Card);
  Vue.use(Field);
  Vue.use(SubmitBar);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(Toast);
  Vue.use(Checkbox).use(CheckboxGroup);
  export default {
    name: 'shopOrder',
    components: {
      [Popup.name]: Popup,
      QRCode
    },
    data () {
      return {
        commodityType: 1, // 0 普通商品，1 虚拟商品
        show: false,
        isStart: true, // 第一次进来
        isShopCart: 0, // 0 商品直接点击购买过来的，1-购物车过来的
        isFree: true,
        myMoney: 0, // 我的红包，现在默认0
        welfareMoneys: [], // 每个商品抵扣红包的金额
        realMoneys: [], // 每个商品实际付的金额，（即总金额-红包）
        areaList: areaList,
        loading: false,
        showAddress: false,
        commodities: [], // 每个商品抵扣红包的金额
        nums: [],
        payWay: this.$wechat.isWechat() ? '2' : '1',
        orderForm: {
          description: '',
          deductionMonry: 0
        },
        addressInfo: {},
        sPostalCode: '',
        specificationList: [] // 规格列表
      };
    },
    mounted () {
      const { isShopCart } = this.$route.query;
      this.isShopCart = isShopCart;
      this.handleCommodity();
      this.getAddress();
      this.getWelfare();
    },
    computed: {
      ...mapGetters([
      ]),
      // 价格计算统计
      sumPrice () {
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
      }
    },
    watch: {
    },
    methods: {
      getWelfare () {
        let params = {
          userCode: this.$user.userCode
        };
        this.$store.dispatch('getWelfareDetail', params).then((res) => {
          this.myMoney = res.map.totalMoney;
        });
      },
      changeArea (data) {
        this.sPostalCode = data[0].code + '-' + data[1].code + '-' + data[2].code;
      },
      onSave (data) {
        this.addressInfo = {
          id: this.$user.id,
          name: data.name,
          tel: data.tel,
          addressDetail: data.addressDetail,
          areaCode: data.areaCode,
          address: data.province + data.city + data.county + data.addressDetail,
          areaName: data.province + data.city + data.county
        };
        this.showAddress = false;
        if (data.isDefault) { // 设为默认地址
          let params = {
            id: this.$user.id
          };
          this.$store.dispatch('getUser', params).then((data) => {
            if (data.result) {
              let address = {
                userName: this.addressInfo.name,
                sArea: this.addressInfo.areaName,
                sAddress: this.addressInfo.addressDetail,
                sPostalCode: this.sPostalCode,
                phone: this.addressInfo.tel
              };
              let user = Object.assign({}, data.map.info, address);
              this.$store.dispatch('editUser', user).then((data) => {
                if (data.result) {
                  localStorage.setItem('user', JSON.stringify(user));
                }
              });
            }
          });
        }
      },
      // 获取收货地址
      getAddress () {
        this.addressInfo = {
          id: this.$user.id,
          name: this.$user.userName || '',
          tel: this.$user.phone || '',
          addressDetail: this.$user.sAddress || '',
          areaCode: this.$user.sPostalCode ? this.$user.sPostalCode.split('-')[2] : '',
          address: (this.$user.sArea || '') + (this.$user.sAddress || ''),
          areaName: this.$user.sArea || ''
        };
      },
      // 处理订单数据
      handleCommodity () {
        const { info } = this.$route.query;
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
          Toast('没有需要购买的商品');
          return;
        }
        // 普通商品才需要收货地址
        if ((this.commodityType === 0) && (this.addressInfo.name === '' || this.addressInfo.tel === '' || this.addressInfo.address === '')) {
          Toast('请填写收货地址');
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
                // Toast('提交成功');
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
                    this.$toast.tipMsg('微信授权中……');
                    let currentUrl = encodeURIComponent('http://www.dali5.com/shopping/wechat');
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8ca5f07c892b9380&redirect_uri=' + currentUrl + '&response_type=code&scope=snsapi_base&state=snsapi_base#wechat_redirect';
                  } else {
                    window.location.href = this.$urls.wxpayHost + data.map.orderId + '&money=0';
                  }
                }
              } else {
                Toast('提交订单失败！');
              }
            });
          } else {
            Toast('库存不足，提交订单失败！');
          }
        });
      },
      showPop () {
        this.show = true;
        if (this.show && this.isStart) {
          this.isStart = false;
          this.$nextTick(function () {
            this.qrcode();
          });
        }
      },
      // 去分享答题页
      toShareSubject () {
        this.$router.replace({ path: '/subjectShare', query: { code: this.$user.shareCode, tjr: this.$user.userCode } });
      },
      qrcode () {
        // eslint-disable-next-line
        let qrcode = new QRCode('qrcode', {
          width: 180,
          height: 180, // 高度
          text: 'http://' + window.location.host + '/subjectShare?code=' + this.$user.shareCode + '&tjr=' + this.$user.userCode // 二维码内容
        });
      }
    },
    destroyed () {
      /* if (this.$utils.isWechat()) {
        this.show = true;
      } else {
        this.show = false;
      } */
    }
  };
</script>
<style scoped lang="scss">
.shop-order{
  .order{
    .get-goods-address{
      position: relative;
      padding: 0 10px;
      .position-icon{
        width: 30px;
        height: 30px;
        position: absolute;
        top:30px;
        left:0;
      }
      .arrow-icon{
        width: 20px;
        height: 20px;
        position: absolute;
        top:30px;
        right:0;
      }
      .address{
        margin-left:40px;
      }
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
  .mask{
    background-color: rgba(0, 0, 0, 0.7);
    width: 308px;
    height: 24px;
    filter: alpha(opacity=70);
    text-align: center;
    color: #fff;
  }
}
</style>
