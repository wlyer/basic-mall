/**
 * @author wly
 * @date 2018/12/5
 * @Description: 登录
*/
<template>
  <section class="login dColumn">
    <img class="logo" src="../assets/images/logo.png"/>
    <div class="form-box">
      <div class="login-form bb">
        <i class="iconfont login-icon">&#xe633;</i><input type="text" class="flex1 login-input" placeholder="请输入账号"/>
      </div>
      <div class="login-form bb">
        <i class="iconfont login-icon">&#xe7ba;</i><input type="password" class="flex1 login-input" placeholder="请输入密码"/>
      </div>
      <div class="login-form clearfix">
        <span class="links fl" @click="toRegist">立即注册</span>
        <span class="links rl" @click="toForget">忘记密码</span>
      </div>
      <van-button class="login-btn operation-btn" type="danger" @click="doLogin">登录</van-button>
      <!--<van-cell-group class="form">
        <van-field
          v-model="loginForm.userCode"
          placeholder="请输入账号"
          class="mb10 bb"
          :error-message="errorMsg.userCode">
          <i class="iconfont" slot="label">&#xe633;</i>
        </van-field>
        <van-field
          v-model="loginForm.dlwPsw"
          type="password"
          class="bb"
          placeholder="请输入密码"
          :error-message="errorMsg.dlwPsw">
          <i class="iconfont" slot="label">&#xe7ba;</i>
        </van-field>
      </van-cell-group>
      <van-button class="operation-btn" type="danger" @click="doLogin">登录</van-button>-->
    </div>
  </section>
</template>

<script>
  import { Cell, CellGroup, Field, Icon, Button } from 'vant';
  export default {
    name: 'login',
    components: {
      [Field.name]: Field,
      [Button.name]: Button,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup
    },
    data () {
      return {
        loginForm: {
          userCode: '',
          dlwPsw: '',
          isFront: 1
        },
        errorMsg: {
          userCode: '',
          dlwPsw: ''
        }
      };
    },
    mounted () {
    },
    methods: {
      // 登录
      doLogin () {
      },
      // 立即注册
      toRegist () {
      },
      // 忘记密码
      toForget () {
      }
    }
  };
</script>

<style scoped lang="scss">
.login{
  height: 100%;
 /* background: url('../assets/images/login_bg.png') center no-repeat;*/
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .logo{
    width:100px;
    height: 100px;
    margin-bottom: 30px;
  }
  .form-box{
    width: 80%;
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
        width: calc(100% - 30px);
      }
    }
    .login-btn{
      margin-top: 20px;
      border-radius: 25px;
      background-color: $my-theme-color;
      border-color: $my-theme-color;
    }
  }
}
</style>
