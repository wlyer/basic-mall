/**
 * @author wly
 * @date 2018/12/5
 * @Description: 登录
*/
<template>
  <section class="login">
    <img class="logo" src="../assets/images/logo.png"/>

  </section>
</template>

<script>
  export default {
    name: 'login'
  };
</script>

<style scoped lang="scss">
.login{
  height: 100%;
  background: url('../assets/images/login_bg.png') center no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .logo{
    width:100px;
    height: 100px;
  }
}
</style>
