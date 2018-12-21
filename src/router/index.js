const Login = resolve => require(['@/pages/login.vue'], resolve);// 登入
const Regist = resolve => require(['@/pages/regist.vue'], resolve);// 注册
const ForgetPassword = resolve => require(['@/pages/forgetPassword.vue'], resolve);// 忘记密码
const Main = resolve => require(['@/components/layout/main.vue'], resolve);// 主结构
const Home = resolve => require(['@/pages/home.vue'], resolve);// 主页
let routers = [
  {
    path: '/',
    name: '',
    redirect: '/home'
  },
  {
    path: '/home',
    name: '',
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
    path: '*',
    redirect: { path: '/' }
  }
];

export default routers;
