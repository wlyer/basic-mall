<template>
    <section class="search-main">
      <van-search
        v-model="keyWord"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
      >
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
      <div class="list-content" id="list-content">
        <van-list
          v-model="loading"
          :finished="finished"
          :offset="10"
          @load="onLoad"
        >
          <v-list-card :dataList="commodities"/>
        </van-list>
        <div class="no-more" v-if="commodities.length===0  || finished">没有更多数据哦~</div>
      </div>
    </section>
</template>

<script>
  import ListCard from '@/components/listCard';
  import { Search, List } from 'vant';
  export default {
    name: 'search',
    components: {
      [Search.name]: Search,
      [List.name]: List,
      'v-list-card': ListCard
    },
    data () {
      return {
        keyWord: '',
        loading: false,
        finished: true,
        commodities: [],
        page: 1,
        totalPage: 0
      };
    },
    mounted () {
      let winHeight = document.documentElement.clientHeight; // 视口大小
      document.getElementById('list-content').style.height = (winHeight - 46 * 2) + 'px'; // 调整上拉加载框高度
    },
    methods: {
      getCommodities () {
        const _this = this;
        let params = {
          page: this.page,
          pageSize: 20,
          name: this.keyWord,
          type: -1,
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
      onSearch () {
        this.page = 1;
        this.finished = false;
        this.commodities = [];
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
.search-main{
}
</style>
