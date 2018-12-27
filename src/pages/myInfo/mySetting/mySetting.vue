<template>
    <section class="my-setting">
      <van-cell-group>
        <van-cell title="修改密码" is-link to="/aboutUs/changePsw"/>
        <!--<van-cell title="更换绑定手机" is-link to="/aboutUs/changePhone"/>-->
      </van-cell-group>
    </section>
</template>

<script>
  import { Cell, CellGroup } from 'vant';
  export default {
    name: 'mySetting',
    components: {
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup
    },
    data () {
      return {

      };
    },
    computed: {
    },
    mounted () {
    },
    methods: {
    }
  };
</script>

<style scoped lang="scss">
.my-setting{

}
</style>
