<template>
    <section class="my-change-info">
      <van-cell-group class="mb10">
        <van-cell title="头像" class="bb pic-icon">
          <el-upload
            class="avatar-uploader"
            :action="url"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgUrl" :src="imgUrl" class="person-icon">
            <img v-else src="../../../assets/images/icon/person.png" class="person-icon">
          </el-upload>
        </van-cell>
        <van-field
          v-model="userForm.nickname"
          clearable
          input-align="right"
          label="昵称"
          placeholder="请输入昵称"
          class="bb"
        />
        <van-field
          v-model="userForm.userName"
          required
          clearable
          input-align="right"
          label="姓名"
          placeholder="请输入姓名"
          class="bb"
          :error-message="errorMsg.userName"
        />
        <div @click="showSex = true">
          <van-field
            v-model="userForm.sex"
            required
            clearable
            disabled
            input-align="right"
            label="性别"
            placeholder="请选择性别"
            class="bb"
          />
        </div>
        <van-field
          v-model="userForm.age"
          required
          clearable
          input-align="right"
          label="年龄"
          placeholder="请输入年龄"
          class="bb"
        />
        <van-field
          v-model="userForm.phone"
          type="tel"
          required
          clearable
          label="手机号"
          input-align="right"
          placeholder="请输入手机号"
          class="bb"
          :error-message="errorMsg.phone"
        />
        <van-field
          v-model="userForm.idCard"
          clearable
          input-align="right"
          label="身份证"
          placeholder="请输入身份证"
          class="bb"
          :error-message="errorMsg.idCard"
        />
        <van-field
          v-model="userForm.wechatCode"
          clearable
          input-align="right"
          label="微信号"
          placeholder="请输入微信号"
          class="bb"
        />
        <div @click="checkArea">
          <van-field
            v-model="userForm.area"
            disabled
            required
            label="所属地区"
            placeholder="请选择省/市/区"
            class="bb"
          />
        </div>
        <van-field
          v-model="userForm.address"
          clearable
          input-align="right"
          label="详细地址"
          placeholder="请选择详细地址"
          class="bb"
        />
        <div @click="checkSArea">
          <van-field
            v-model="userForm.sArea"
            disabled
            label="收货地区"
            placeholder="请选择省/市/区"
            class="bb"
          />
        </div>
        <van-field
          v-model="userForm.sAddress"
          clearable
          input-align="right"
          label="收货详细地址"
          placeholder="请选择收货详细地址"
          class="bb"
        />
        <van-field
          v-model="userForm.aphorism"
          label="励志格言"
          type="textarea"
          input-align="right"
          placeholder="请输入励志格言"
          class="bb"
          rows="1"
          autosize
        />
      </van-cell-group>
      <van-button class="operation-btn" type="danger" @click="changeInfo">确认</van-button>
      <!--选择地址-->
      <van-popup v-model="showArea" position="bottom" :overlay="false">
        <van-area :area-list="areaList" v-model="area" :value="area" @confirm="setArea" @cancel="showArea = false"/>
      </van-popup>
      <!--选择收货地址-->
      <van-popup v-model="showSArea" position="bottom" :overlay="false">
        <van-area :area-list="areaList" v-model="sArea" :value="sArea" @confirm="setSArea" @cancel="showSArea = false"/>
      </van-popup>
      <!--选择性别-->
      <van-popup v-model="showSex" position="bottom" :overlay="false">
        <van-picker :columns="columns" @change="onChangeSex" />
      </van-popup>
    </section>
</template>

<script>
  import areaList from '@/utils/area';
  import { Cell, CellGroup, Field, Area, Uploader, Popup, Button, Picker } from 'vant';
  export default {
    name: 'changeInfo',
    components: {// 写法2
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Area.name]: Area,
      [Uploader.name]: Uploader,
      [Field.name]: Field,
      [Popup.name]: Popup,
      [Button.name]: Button,
      [Picker.name]: Picker
    },
    data () {
      return {
        validator: null,
        imgUrl: '',
        url: this.$urls.Host + `daliweb/user/fileUpload`,
        areaList: areaList,
        showArea: false,
        showSArea: false,
        showSex: false,
        columns: ['女', '男'],
        sArea: '',
        area: '',
        userForm: {
          age: '',
          sex: '',
          pic: '',
          nickName: '',
          userName: '',
          idCard: '',
          wechatCode: '',
          area: '',
          address: '',
          sArea: '',
          sAddress: '',
          aphorism: '',
          phone: ''
        },
        errorMsg: {
          userName: '',
          idCard: '',
          phone: ''
        },
        rules: {
          userName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          area: [
            { required: true, message: '请选择所属地区', trigger: 'blur' }
          ],
          idCard: [
            { pattern: this.$regular.IDCard, message: this.$regular.IDCardMsg, trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: this.$regular.phone, message: this.$regular.phoneMsg, trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
    },
    created () {
      this.userForm = Object.assign({}, this.$user, { sex: this.$user.sex === 0 ? '女' : '男' });
      this.validator = this.$validator.validatorConstruct(this.rules, this.userForm);
    },
    mounted () {
      this.area = (this.$user.postalCode && this.$user.postalCode.indexOf('-')) ? this.$user.postalCode.split('-')[2] : '';
      this.sArea = (this.$user.sPostalCode && this.$user.sPostalCode.indexOf('-')) ? this.$user.sPostalCode.split('-')[2] : '';
      if (this.$user.pic) {
        this.imgUrl = this.$urls.userDownload + this.$user.pic;
      }
    },
    methods: {
      onChangeSex (picker, value, index) {
        this.showSex = false;
        this.userForm.sex = value;
      },
      handleAvatarSuccess (res, file) {
        // eslint-disable-next-line
        let index = res.map.fileName.lastIndexOf('\/');
        let picName = res.map.fileName.substring(index + 1, res.map.fileName.length);
        this.userForm.pic = picName;
        this.imgUrl = this.$urls.userDownload + picName;
      },
      beforeAvatarUpload (file) {
        const isPng = file.type === 'image/png';
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG && !isPng) {
          this.$toast.tipMsg('上传头像图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$toast.tipMsg('上传头像图片大小不能超过 2MB!');
        }
        return (isJPG || isPng) && isLt2M;
      },
      uploadPic () {

      },
      checkArea () {
       this.showArea = true;
      },
      checkSArea () {
        this.showSArea = true;
      },
      setArea (data) {
        this.userForm.area = data[0].name + data[1].name + data[2].name;
        this.userForm.postalCode = data[0].code + '-' + data[1].code + '-' + data[2].code;
        this.showArea = false;
      },
      setSArea (data) {
        this.userForm.sArea = data[0].name + data[1].name + data[2].name;
        this.userForm.sPostalCode = data[0].code + '-' + data[1].code + '-' + data[2].code;
        this.showSArea = false;
      },
      onRead (file) {
        this.$refs.userPic.src = file.content;
      },
      changeInfo () {
        this.$validator.validateForm(this.validator, this.errorMsg, (errors, fields) => {
          if (errors) {
            return;
          }
          let params = Object.assign({}, this.$user, this.userForm, { sex: this.userForm.sex === '女' ? 0 : 1 });
          this.$store.dispatch('editUser', params).then((data) => {
            if (data.result) {
              let params1 = {
                id: this.$user.id
              };
              this.$store.dispatch('getUser', params1).then((data) => {
                localStorage.setItem('user', JSON.stringify(data.map.info));
                this.$router.push({ path: '/myInfo/myInfo' });
              });
            } else {
              this.$toast.tipMsg('信息有误，修改失败哦');
            }
          });
        });
      }
    }
  };
</script>
<style lang="scss">
.my-change-info {
  input.van-field__control {
    text-align: right !important;
  }
  .van-field__error-message {
    text-align: right;
  }
}
</style>
<style scoped lang="scss">
.my-change-info{
  .pic-icon{
    line-height: 45px;
    height: 60px;
  }
  .person-icon{
    display: block;
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
}
</style>
