<template>
	<section class="commodity-list">
    <div class="commodity-item dbox bb" v-for="(item,index) in dataList" :key="index" @click="toDetail(item.id)">
      <div class="box">
        <img class="row-img  flex1" :src="url + item.pic.split(',')[0]"/>
        <span v-if="item.isVip" class="study-commodity">学</span>
      </div>
      <div class="commodity-info flex2">
        <span class="commodity-name">{{item.name}}</span>
        <div class="price">￥{{item.price}}</div>
      </div>
    </div>
	</section>
</template>

<script>
export default {
  name: 'App',
  props: [
    'dataList'
  ],
  data () {
    return {
    };
  },
  methods: {
    toDetail (commodityId) {
      this.$router.push({ path: '/shopping/commodityDetail', query: { id: commodityId } });
    }
  },
  computed: {
    url () {
      return this.$urls.goodsDownload;
    }
  }
};
</script>

<style scoped lang="scss">
.commodity-list{
  .commodity-item{
    .box{
      position: relative;
      width: 33%;
      height: 0;
      padding-bottom: 33%;
      img{
        position:  absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    }
    padding: 10px;
    .commodity-info{
      margin-left: 10px;
      .commodity-name{
        width: 100%;
        @include fn-ellpisis(2,25px)
      }
      .price{
        margin-top: 30px;
      }
    }
  }
}
</style>
