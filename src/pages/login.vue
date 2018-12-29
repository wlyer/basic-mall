/**
 * @author wly
 * @date 2018/12/5
 * @Description: 登录
*/
<template>
  <section class="login dColumn">
    <div class="login-header">
      <img class="logo" src="../assets/images/logo.png"/>
      <div class="login-operation clearfix">
        <div class="fl">登录</div>
        <div class="rl" @click="toRegist">注册</div>
      </div>
    </div>
    <div class="form-box ly-card-radius-p10">
      <div class="login-form bb">
        <i class="iconfont login-icon">&#xe633;</i><input type="text" v-model="loginForm.userCode" class="flex1 login-input" placeholder="请输入账号"/>
      </div>
      <div class="login-form bb">
        <i class="iconfont login-icon">&#xe7ba;</i><input type="password" v-model="loginForm.dlwPsw" class="flex1 login-input" placeholder="请输入密码"/>
      </div>
      <van-button class="login-btn operation-btn" round type="danger" @click="doLogin">登录</van-button>
      <van-button class="forget-btn operation-btn" round @click="toForget">忘记密码</van-button>
      <div class="other-login">
        <div class="other-login-txt mb20" >--- 第三方登录 ---</div>
        <img src="../assets/images/icon/phone.png"/>
        <img src="../assets/images/icon/wechat.png"/>
        <img src="../assets/images/icon/qq.png"/>
      </div>
    </div>
  </section>
</template>

<script>
  import { Button } from 'vant';
  export default {
    name: 'login',
    components: {
      [Button.name]: Button
    },
    data () {
      return {
        loginForm: {
          userCode: '',
          dlwPsw: '',
          isFront: 1
        }
      };
    },
    mounted () {
    },
    methods: {
      // 登录
      doLogin () {
        this.$store.dispatch('requestLogin', this.loginForm).then((data) => {
          if (data.result) {
            this.$toast.tipMsg('登录成功！');
            localStorage.setItem('user', JSON.stringify(data.map.info));
            this.$router.replace({ path: '/' });
          } else {
            this.$toast.tipMsg(data.message);
          }
        });
      },
      // 立即注册
      toRegist () {
        this.$router.replace({ path: '/regist' });
      },
      // 忘记密码
      toForget () {
        this.$router.replace({ path: '/forget' });
      }
    }
  };
</script>

<style scoped lang="scss">
.login{
  height: 100%;
  background-color: #F0F0F0 ;
  .login-header{
    height: 320px;
    background: url('../assets/images/login_bg.png') center no-repeat;
    background-size: 100% 100%;
  }
  .logo{
    width: 150px;
    margin: 0 auto;
    padding: 60px 0 20px;
    display: block;
  }
  .login-operation{
    width: calc(100% - 100px);
    margin: 0 auto;
    color: #FFFFFF;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
    font-size: 1rem;
  }
  .form-box{
    width: calc(100% - 100px);
    margin: -120px auto 0;
    padding: 30px 20px;
    .login-form{
      height: 45px;
      line-height: 45px;
      margin-bottom: 20px;
      .login-icon {
        width: 30px;
        height: 30px;
        display: inline-block;
        line-height: 30px;
      }
      .login-input {
        padding: 0 10px;
        border: none;
        background: none;
        height: 30px;
        line-height: 30px;
        width: calc(100% - 50px);
      }
    }
    .login-btn{
      margin-top: 20px;
    }
    .forget-btn{
      margin-top: 20px;
      border-color: $my-danger-color;
      color: $my-danger-color;
    }
    .other-login{
      margin-top: 50px;
      text-align: center;
      color: $my-tiny-color;
      img{
        width: 45px;
        height: 45px;
        margin-right: 40px;
      }
      img:last-child{
        margin-right: 0;
      }
    }
  }
}
</style>
