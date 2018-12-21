/**
 * @author wly
 * @date 2018/12/5
 * @Description: 主结构
*/
<template>
  <section class="main">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'my-main'
  };
</script>

<style scoped lang="scss">
.main{

}
</style>
