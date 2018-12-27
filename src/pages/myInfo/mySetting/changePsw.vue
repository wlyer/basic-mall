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
  import validator from '@/utils/validator.js';
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
      return {
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
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  // eslint-disable-next-line
                  callback('请输入密码');
                } else if (value.length < 6) {
                  // eslint-disable-next-line
                  callback('请输入大于等于六位的登录密码');
                } else {
                  // eslint-disable-next-line
                  callback();
                }
              }
            }
          ],
          newDlwPsw: [
            {
              validator: (rule, value, callback) => {
                /* eslint-disable */
                if (!value) {
                  callback('请输入密码');
                } else if (value.length < 6) {
                  callback('请输入大于等于六位的登录密码');
                } else if (value !== this.pswForm.reDlwPsw) {
                  callback('两次密码输入不一致');
                } else {
                  callback();
                }
                /* eslint-enable */
              }
            }
          ],
          reDlwPsw: [
            {
              validator: (rule, value, callback) => {
                /* eslint-disable */
                if (!value) {
                  callback('请输入密码');
                } else if (value.length < 6) {
                  callback('请输入大于等于六位的确认密码');
                } else if (this.pswForm.newDlwPsw !== value) {
                  callback('两次密码输入不一致');
                } else {
                  callback();
                }
                /* eslint-enable */
              }
            }
          ]
        }
      };
    },
    created () {
      this.validator = validator(this.rules, this.pswForm);
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
