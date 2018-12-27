/**
 * @author wly
 * @date 2018/12/26
 * @Description: 地址管理
*/
<template>
  <section class="shop-address">
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      show-set-default
      @save="onSave"
      @change-area="changeArea"
    />
  </section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import areaList from '@/utils/area.js';
  import { AddressEdit } from 'vant';
  export default {
    name: 'shopAddress',
    components: {
      [AddressEdit.name]: AddressEdit
    },
    computed: {
      ...mapGetters([
        'addressInfo'
      ])
    },
    data () {
      return {
        areaList: areaList,
        sPostalCode: ''
      };
    },
    mounted () {
    },
    methods: {
      // 改变地址
      changeArea (data) {
        this.sPostalCode = data[0].code + '-' + data[1].code + '-' + data[2].code;
      },
      onSave (data) {
        let address = {
          id: this.$user.id,
          name: data.name,
          tel: data.tel,
          addressDetail: data.addressDetail,
          areaCode: data.areaCode,
          address: data.province + data.city + data.county + data.addressDetail,
          areaName: data.province + data.city + data.county
        };
        this.$store.dispatch('addAddressInfo', address);
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
      }
    }
  };
</script>

<style scoped lang="scss">
.shop-address{

}
</style>
