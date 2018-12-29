<template>
	<section class="commodity-card ly-card-radius">
    <div class="commodity-item" @click="toDetail(data.id)">
      <div class="box mb10">
        <img :src="url + picName"/>
        <span v-if="data.isVip" class="study-commodity">学</span>
      </div>
      <div class="p10">
        <div class="title fn-text-2-50 mb10">{{data.name}}</div>
        <div class="price">￥{{data.price}}</div>
      </div>
    </div>
	</section>
</template>

<script>
export default {
  name: 'App',
  props: [
    'data'
  ],
  data () {
    return {
    };
  },
  methods: {
    toDetail (commodityId) {
      this.$router.push({ path: '/mall/commodityDetail', query: { id: commodityId } });
    }
  },
  computed: {
    url () {
      return this.$urls.goodsDownload;
    },
    picName () {
      return this.data.pic.split(',')[0];
    }
  }
};
</script>

<style scoped lang="scss">
.commodity-card{
 /* background-color: #FFFFFF;
  border-radius: 5px;*/
  .commodity-item{
    .box{
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      img{
        position:  absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 5px 5px 0 0;
      }
    }
  }
}
</style>
