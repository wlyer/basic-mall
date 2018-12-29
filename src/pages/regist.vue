/**
 * @author wly
 * @date 2018/12/5
 * @Description: 注册
*/
<template>
  <section class="regist dColumn">
    <img class="logo" src="../assets/images/logo.jpg"/>
    <div class="form-box">
      <div class="login-form bb">
        <div><i class="iconfont login-icon">&#xe633;</i><input type="text" v-model="registForm.userCode" class="flex1 login-input" placeholder="请输入账号"/></div>
        <div class="tip-red">{{errorMsg.userCode}}</div>
      </div>
      <div class="login-form bb">
        <div><i class="iconfont login-icon">&#xe7ba;</i><input type="password" v-model="registForm.dlwPsw" class="flex1 login-input" placeholder="请输入新密码"/></div>
        <div class="tip-red">{{errorMsg.dlwPsw}}</div>
      </div>
      <div class="login-form bb">
        <div><i class="iconfont login-icon">&#xe7ba;</i><input type="password" v-model="registForm.reDlwPsw" class="flex1 login-input" placeholder="请输入确认密码"/></div>
        <div class="tip-red">{{errorMsg.reDlwPsw}}</div>
      </div>
      <!--<div class="login-form bb">
        <i class="iconfont login-icon">&#xe7ba;</i><input type="password" v-model="registForm.shareCode" class="flex1 login-input" placeholder="请输入确认密码"/>
      </div>-->
      <div class="login-form bb">
        <div class="flex1">
          <i class="iconfont login-icon">&#xe7ba;</i><input type="text" v-model="registForm.verificationCode" class="flex1 login-input" placeholder="请输入确认密码"/>
          <van-button :disabled="isSendCode" size="small" @click="sendCode" type="danger"><span v-if="isSendCode">{{seconds}}</span>发送验证码</van-button>
        </div>
        <div class="tip-red">{{errorMsg.verificationCode}}</div>
      </div>
      <van-button class="login-btn operation-btn" type="danger" @click="doRegist">注册</van-button>
    </div>
  </section>
</template>

<script>
  import { Button } from 'vant';
  const TIME = 60;
  export default {
    name: 'regist',
    components: {
      [Button.name]: Button
    },
    data () {
      const checkPsw = (rule, value, callback) => {
        /* eslint-disable */
        if (value !== this.pswForm.reDlwPsw) {
          callback('两次密码输入不一致');
        } else {
          callback();
        }
        /* eslint-enable */
      };
      const checkRePsw = (rule, value, callback) => {
        /* eslint-disable */
        if (this.pswForm.newDlwPsw !== value) {
          callback('两次密码输入不一致');
        } else {
          callback();
        }
        /* eslint-enable */
      };
      const checkUserCode = (rule, value, callback) => {
        /* eslint-disable */
        this.$store.dispatch('getUserByUserCode', { userCode: value }).then((res) => {
          if (res.result) { // 用户存在
            callback('账号已存在');
          } else {
            callback();
          }
        });
        /* eslint-enable */
      };
      return {
        validator: null,
        isExistUserCode: false, // 账号是否已存在
        isSendCode: false, // 能否发送短信验证码，60秒倒计时
        seconds: TIME,
        registForm: {
          userCode: '',
          dlwPsw: '',
          phone: '',
          reDlwPsw: '',
          shareCode: '',
          verificationCode: ''
        },
        errorMsg: {
          userCode: '111',
          dlwPsw: '111',
          reDlwPsw: '11',
          verificationCode: '11'
        },
        rules: {
          userCode: [
            { required: true, message: '请输入账号' },
            { pattern: this.$regular.phone, message: this.$regular.phoneMsg, trigger: 'blur' },
            { validator: checkUserCode, trigger: 'blur' }
          ],
          dlwPsw: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 18, message: '用户名长度为6-18', trigger: 'blur' },
            { validator: checkPsw, trigger: 'blur' }
          ],
          reDlwPsw: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { min: 6, max: 18, message: '用户名长度为6-18', trigger: 'blur' },
            { validator: checkRePsw, trigger: 'blur' }
          ]/* ,
          verificationCode: [
            { required: true, message: '请输入短信验证码' }
          ] */
        }
      };
    },
    created () {
      this.validator = this.$validator.validatorConstruct(this.rules, this.pswForm);
    },
    mounted () {
    },
    methods: {
      // 倒计时
      num: function (n) {
        return n < 10 ? '0' + n : '' + n;
      },
      add () {
        let _this = this;
        let time = window.setInterval(function () {
          if (_this.isSubmit || _this.seconds === 0) {
            window.clearInterval(time);
          } else {
            _this.seconds -= 1;
          }
        }, 1000);
      },
      // 发送验证码
      sendCode () {
        this.$validator.validateForm(this.validator, this.errorMsg, (errors, fields) => {
          if (errors) {
            return;
          }
          this.$store.dispatch('sendCode', { phone: this.registForm.userCode, type: 0 });
          this.isSendCode = true;
          this.add();
        });
      },
      doRegist () {
        this.$validator.validateForm(this.validator, this.errorMsg, (errors, fields) => {
          if (errors) {
            return;
          }
          if (!this.registForm.verificationCode) {
            this.errorMsg.verificationCode = '请输入验证码';
            return;
          } else {
            this.errorMsg.verificationCode = '';
          }
          let params = Object.assign({}, this.registForm);
          delete params.reDlwPsw;
          this.$store.dispatch('register', params).then((res) => {
            if (res.result) {
              this.$toast.tipMsg('注册成功');
              localStorage.setItem('user', JSON.stringify(res.map.info));
            } else {
              this.$toast.tipMsg('验证码错误');
            }
          });
        });
      }
    },
    watch: {
      second: {
        handler (newVal) {
          this.num(newVal);
          if (newVal === '00') {
            this.isSendCode = false;
          }
        }
      }
    },
    computed: {
      second () {
        return this.num(this.seconds);
      }
    }
  };
</script>

<style scoped lang="scss">
.regist{
  background-color: #FFFFFF;
  height: 100%;
  /*background: url('../assets/images/login_bg.png') center no-repeat;*/
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .logo{
    width: 90px;
    height: 90px;
    margin-bottom: 50px;
  }
  .form-box{
    width: 80%;
    .login-form{
      /*height: 45px;*/
      line-height: 45px;
      margin-bottom: 10px;
      .tip-red{
        color: red;
        line-height: 20px;
        margin-left: 40px;
      }
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
