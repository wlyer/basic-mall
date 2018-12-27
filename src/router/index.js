const Login = resolve => require(['@/pages/login.vue'], resolve);// 登入
const Regist = resolve => require(['@/pages/regist.vue'], resolve);// 注册
const ForgetPassword = resolve => require(['@/pages/forgetPassword.vue'], resolve);// 忘记密码
const Main = resolve => require(['@/components/layout/main.vue'], resolve);// 主结构
const Home = resolve => require(['@/pages/home.vue'], resolve);// 主页

// 个人中心
const MyInfo = resolve => require(['@/pages/myInfo/myInfo.vue'], resolve);// 个人中心
const MySetting = resolve => require.ensure([], () => resolve(require('@/pages/myInfo/mySetting/mySetting.vue')), 'group-mySetting');// 我的设置
const MyChangeInfo = resolve => require.ensure([], () => resolve(require('@/pages/myInfo/mySetting/changeInfo.vue')), 'group-mySetting');// 编辑用户
const MyChangePsw = resolve => require.ensure([], () => resolve(require('@/pages/myInfo/mySetting/changePsw.vue')), 'group-mySetting');// 修改密码
const MyOrder = resolve => require.ensure([], () => resolve(require('@/pages/myInfo/myOrder/myOrder.vue')), 'group-myOrder');// 我的订单
const MyOrderDetail = resolve => require.ensure([], () => resolve(require('@/pages/myInfo/myOrder/myOrderDetail.vue')), 'group-myOrder');// 订单详情
const MyRebackDetail = resolve => require.ensure([], () => resolve(require('@/pages/myInfo/myOrder/myRebackDetail.vue')), 'group-myOrder');// 申请退款

/* 商城 */
const ShopCart = resolve => require(['@/pages/mall/shopCart/shopCart.vue'], resolve);// 购物车
const CommodityDetail = resolve => require(['@/pages/mall/commodity/commodityDetail.vue'], resolve);// 商品详情
const CommoditySearch = resolve => require(['@/pages/mall/commodity/commoditySearch.vue'], resolve);// 商品检索
const ShopOrder = resolve => require.ensure([], () => resolve(require('@/pages/mall/shopOrder/shopOrder.vue')), 'group-shopOrder');// 提交订单
const ShopAddress = resolve => require.ensure([], () => resolve(require('@/pages/mall/shopOrder/shopAddress.vue')), 'group-shopOrder');// 编辑地址
const PaySuccess = resolve => require(['@/pages/mall/pay/paySuccess.vue'], resolve);// 支付成功
const PayError = resolve => require(['@/pages/mall/pay/payError.vue'], resolve);// 支付失败
const PayWechat = resolve => require(['@/pages/mall/pay/wechat.vue'], resolve);// 微信回调页面
let routers = [
  {
    path: '/',
    name: '',
    redirect: '/home'
  },
  {
    path: '/home',
    name: '首页',
    component: Main,
    children: [
      { path: '', component: Home, name: '首页', meta: { requireAuth: false, userAuth: true } }
    ]
  },
  {
    path: '/login',
    name: '登录',
    component: Login,
    meta: { requireAuth: false, userAuth: true }
  },
  {
    path: '/regist',
    name: '注册',
    component: Regist,
    meta: { requireAuth: false, userAuth: true }
  },
  {
    path: '/forget',
    name: '忘记密码',
    component: ForgetPassword,
    meta: { requireAuth: false, userAuth: true }
  },
  {
    path: '/mall',
    component: Main,
    children: [
      { path: 'commodityDetail', component: CommodityDetail, name: '商品详情', meta: { requireAuth: false, userAuth: true } },
      { path: 'commoditySearch', component: CommoditySearch, name: '商品检索', meta: { requireAuth: false, userAuth: true } },
      { path: 'shopOrder', component: ShopOrder, name: '提交订单', meta: { requireAuth: true, userAuth: true } },
      { path: 'editAddress', component: ShopAddress, name: '编辑地址', meta: { requireAuth: true, userAuth: true } },
      { path: 'shopCart', component: ShopCart, name: '购物车', meta: { requireAuth: true, userAuth: true } }
    ]
  },
  {
    path: '/pay',
    component: Main,
    children: [
      { path: 'paySuccess', component: PaySuccess, name: '支付成功', meta: { requireAuth: false, userAuth: true } },
      { path: 'payError', component: PayError, name: '支付失败', meta: { requireAuth: false, userAuth: true } },
      { path: 'payWechat', component: PayWechat, name: '微信回调', meta: { requireAuth: true, userAuth: true } }
    ]
  },
  {
    path: '/myInfo',
    component: Main,
    children: [
      { path: '', component: MyInfo, name: '个人中心', meta: { requireAuth: false, userAuth: true } },
      { path: 'mySetting', component: MySetting, name: '我的设置', meta: { requireAuth: true, userAuth: true } },
      { path: 'myChangeInfo', component: MyChangeInfo, name: '编辑用户', meta: { requireAuth: true, userAuth: true } },
      { path: 'myChangePsw', component: MyChangePsw, name: '修改密码', meta: { requireAuth: true, userAuth: true } },
      { path: 'myOrder', component: MyOrder, name: '我的订单', meta: { requireAuth: true, userAuth: true } },
      { path: 'myOrderDetail', component: MyOrderDetail, name: '订单详情', meta: { requireAuth: true, userAuth: true } },
      { path: 'myRebackDetail', component: MyRebackDetail, name: '申请退款', meta: { requireAuth: true, userAuth: true } }
    ]
  },
  {
    path: '*',
    redirect: { path: '/' }
  }
];

export default routers;
