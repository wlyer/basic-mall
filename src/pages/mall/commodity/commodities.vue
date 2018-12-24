<template>
    <section class="commodities">
      <div class="list-content" id="list-content">
        <van-list
          v-model="loading"
          :finished="finished"
          :offset="100"
          @load="onLoad"
        >
          <v-list-card :dataList="commodities"/>
        </van-list>
        <div class="no-more" v-if="commodities.length===0  || finished">没有更多数据哦~</div>
      </div>
    </section>
</template>

<script>
  import { List, Tab, Tabs } from 'vant';
  import ListCard from '@/components/listCard';
  export default {
    name: 'commodityDetail',
    components: {
      [List.name]: List,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      'v-list-card': ListCard
    },
    data () {
      return {
        total: 0,
        page: 1,
        commodities: [],
        loading: false,
        finished: false,
        type: 0
      };
    },
    computed: {
    },
    mounted () {
      let winHeight = document.documentElement.clientHeight; // 视口大小
      document.getElementById('list-content').style.height = (winHeight - 46 * 2) + 'px'; // 调整上拉加载框高度
      const { type } = this.$route.query;
      this.type = type;
      this.commodities = [];
      this.page = 1;
      this.finished = false;
    },
    methods: {
      changeState (index) {
        this.type = index;
        this.commodities = [];
        this.page = 1;
        this.totalPage = 0;
        this.finished = false;
        this.getCommodities();
      },
      getCommodities () {
        const _this = this;
        let params = {
          page: this.page,
          pageSize: 20,
          name: '',
          type: this.type,
          isVip: -1,
          status: 1,
          deleted: 0
        };
        this.$store.dispatch('getCommodities', params).then((data) => {
          if (data.result) {
            _this.totalPage = data.map.totalPage;
            _this.loading = false;
            if (data.map.pageNum === 1) {
              _this.commodities = data.map.info;
            } else {
              _this.commodities = _this.commodities.concat(data.map.info);
            }
            if (_this.page >= _this.totalPage) {
              _this.finished = true;
            }
            _this.page = _this.page + 1;
          }
        });
      },
      onLoad () {
        const _this = this;
        setTimeout(() => {
          _this.getCommodities();
        }, 500);
      }
    }
  };
</script>

<style scoped lang="scss">
  .commodities{

  }
</style>
