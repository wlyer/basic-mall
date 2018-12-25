const Login = resolve => require(['@/pages/login.vue'], resolve);// 登入
const Regist = resolve => require(['@/pages/regist.vue'], resolve);// 注册
const ForgetPassword = resolve => require(['@/pages/forgetPassword.vue'], resolve);// 忘记密码
const Main = resolve => require(['@/components/layout/main.vue'], resolve);// 主结构
const Home = resolve => require(['@/pages/home.vue'], resolve);// 主页

const MyInfo = resolve => require(['@/pages/myInfo/myInfo.vue'], resolve);// 个人中心

/* 商城 */
const ShopCart = resolve => require(['@/pages/mall/shopCart/shopCart.vue'], resolve);// 购物车
const CommodityDetail = resolve => require(['@/pages/mall/commodity/commodityDetail.vue'], resolve);// 商品详情
const CommoditySearch = resolve => require(['@/pages/mall/commodity/commoditySearch.vue'], resolve);// 商品检索
const ShopOrder = resolve => require(['@/pages/mall/shopOrder/shopOrder.vue'], resolve);// 提交订单
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
      { path: '', component: Home, name: '首页' }
    ]
  },
  {
    path: '/login',
    name: '登录',
    component: Login
  },
  {
    path: '/regist',
    name: '注册',
    component: Regist
  },
  {
    path: '/forgetPassword',
    name: '忘记密码',
    component: ForgetPassword
  },
  {
    path: '/mall',
    component: Main,
    children: [
      { path: 'commodityDetail', component: CommodityDetail, name: '商品详情' },
      { path: 'commoditySearch', component: CommoditySearch, name: '商品检索' },
      { path: 'addOrder', component: ShopOrder, name: '提交订单' },
      { path: 'shopCart', component: ShopCart, name: '购物车' }
    ]
  },
  {
    path: '/pay',
    component: Main,
    children: [
      { path: 'paySuccess', component: PaySuccess, name: '支付成功' },
      { path: 'payError', component: PayError, name: '支付失败' },
      { path: 'payWechat', component: PayWechat, name: '微信回调' }
    ]
  },
  {
    path: '/myInfo',
    component: Main,
    children: [
      { path: '', component: MyInfo, name: '个人中心' }
    ]
  },
  {
    path: '*',
    redirect: { path: '/' }
  }
];

export default routers;
