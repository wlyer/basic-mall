<template>
    <section class="my-change-psw">
      <van-cell-group class="mb10">
        <van-field
          v-model="pswForm.oldDlwPsw"
          type="password"
          required
          clearable
          label="旧密码"
          placeholder="请输入旧密码"
          :error-message="errorMsg.oldDlwPsw"
        />

        <van-field
          v-model="pswForm.newDlwPsw"
          type="password"
          label="新密码"
          placeholder="请输入新密码"
          required
          :error-message="errorMsg.newDlwPsw"
        />
        <van-field
          v-model="pswForm.reDlwPsw"
          type="password"
          label="确认密码"
          placeholder="请输入确认密码"
          required
          :error-message="errorMsg.reDlwPsw"
        />
      </van-cell-group>
      <van-button class="operation-btn" type="danger" @click="changePsw">确认</van-button>
    </section>
</template>

<script>
  import { Cell, CellGroup, Button, Field } from 'vant';
  export default {
    name: 'changePsw',
    components: {// 写法2
      [Button.name]: Button,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Field.name]: Field
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
      return {
        validator: null,
        pswForm: {
          oldDlwPsw: '',
          newDlwPsw: '',
          reDlwPsw: ''
        },
        errorMsg: {
          oldDlwPsw: '',
          newDlwPsw: '',
          reDlwPsw: ''
        },
        rules: {
          oldDlwPsw: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 6, max: 18, message: '用户名长度为6-18', trigger: 'blur' }
          ],
          newDlwPsw: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 18, message: '用户名长度为6-18', trigger: 'blur' },
            { validator: checkPsw, trigger: 'blur' }
          ],
          reDlwPsw: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { min: 6, max: 18, message: '用户名长度为6-18', trigger: 'blur' },
            { validator: checkRePsw, trigger: 'blur' }
          ]
        }
      };
    },
    created () {
      this.validator = this.$validator.validatorConstruct(this.rules, this.pswForm);
    },
    computed: {
    },
    mounted () {
    },
    methods: {
      changePsw () {
        this.$validator.validateForm(this.validator, this.errorMsg, (errors, fields) => {
          if (errors) {
            return;
          }
          let params = {
            id: this.$user.id,
            oldDlwPsw: this.pswForm.oldDlwPsw,
            newDlwPsw: this.pswForm.newDlwPsw
          };
          this.$store.dispatch('changeUserPsw', params).then((data) => {
            if (data.result) {
              this.$router.push({ path: '/aboutUs/myInfo' });
            } else {
              this.$toast.tipMsg('旧密码错误');
            }
          });
        });
      }
    }
  };
</script>

<style scoped lang="scss">
.my-change-psw{
  padding: 10px;
}
</style>
