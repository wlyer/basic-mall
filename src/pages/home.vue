/**
 * @author wly
 * @date 2018/12/5
 * @Description: 首页
*/
<template>
  <section class="home">
    <van-swipe class="banner" @change="onChange">
      <van-swipe-item v-for="(file, index) in banner" :key="index">
        <img v-if="file.type == 'image'" :src="file.url" />
        <video-player v-else class="video-player vjs-custom-skin"
                      ref="videoPlayer"
                      :playsinline="true"
                      :options="playerOptions"
                      @play="onPlayerPlay($event)"
                      @pause="onPlayerPause($event)"
        >
        </video-player>
      </van-swipe-item>
    </van-swipe>
    <div class="type dbox ly-card-p10">
      <div class="flex1" @click="toHot">
        <img class="ly-icon mb10" src="../assets/images/icon/icon_1.png"/>
        <div>热销</div>
      </div>
      <div class="flex1" @click="toNew">
        <img class="ly-icon mb10" src="../assets/images/icon/icon_5.png"/>
        <div>新品</div>
      </div>
      <div class="flex1" @click="toCheap">
        <img class="ly-icon mb10" src="../assets/images/icon/icon_6.png"/>
        <div>折扣</div>
      </div>
      <div class="flex1" @click="toType">
        <img class="ly-icon mb10" src="../assets/images/icon/icon_7.png"/>
        <div>分类</div>
      </div>
    </div>
    <div class="commodity-type-list">
      <van-tabs v-model="activeType" animated @click="changeType">
        <van-tab v-for="index in 2" :title="'分类' + index" :key="index">
        </van-tab>
      </van-tabs>
    </div>
    <div class="list-content" id="list-content">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="100"
        @load="onLoad"
      >
        <van-row class="commodity-list">
          <van-col span="12" class="commodity-item" v-for="(item,index) in commodityList" :key="index" >
            <v-card :data="item"/>
          </van-col>
        </van-row>
      </van-list>
      <div class="no-more" v-if="commodityList.length===0  || finished"></div>
    </div>
  </section>
</template>

<script>
  import { videoPlayer } from 'vue-video-player';
  import { Swipe, SwipeItem, Tab, Tabs, List, Row, Col } from 'vant';
  import Card from '@/components/card';
  export default {
    name: 'home',
    components: {
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [List.name]: List,
      [Row.name]: Row,
      [Col.name]: Col,
      videoPlayer,
      'v-card': Card
    },
    data() {
      return {
        banner: [
          { type: 'video', url: '../../static/video/banner/video_1.mp4' },
          { type: 'image', url: '../../static/images/banner/banner_1.jpg' },
          { type: 'image', url: '../../static/images/banner/banner_2.jpg' },
          { type: 'image', url: '../../static/images/banner/banner_3.jpg' },
          { type: 'image', url: '../../static/images/banner/banner_4.jpg' },
          { type: 'image', url: '../../static/images/banner/banner_5.jpg' },
          { type: 'image', url: '../../static/images/banner/banner_6.jpg' }
        ],
        playerOptions: {
//        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, // 如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: 'video/mp4',
            src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4' // 你的视频地址（必填）
            // http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4
          }],
          poster: '../../static/images/banner/banner_5.jpg', // 你的封面地址
          width: document.documentElement.clientWidth,
          notSupportedMessage: '当前视频暂时无法播放' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
//        controlBar: {
//          timeDivider: true,
//          durationDisplay: true,
//          remainingTimeDisplay: false,
//          fullscreenToggle: true  //全屏按钮
//        }
        },
        activeType: 0,
        commodityList: [],
        total: 0,
        page: 1,
        loading: false,
        finished: false
      };
    },
    mounted () {
      let winHeight = document.documentElement.clientHeight; // 视口大小
      document.getElementById('list-content').style.height = (winHeight - 46 * 2 - 550) + 'px'; // 调整上拉加载框高度
    },
    methods: {
      resetParams () {
        this.commodityList = [];
        this.page = 1;
        this.total = 0;
        this.finished = false;
      },
      // 切换分类
      changeType () {
        this.resetParams();
      },
      getCommodities () {
        const _this = this;
        let params = {
          page: this.page,
          pageSize: 20,
          name: '',
          type: this.activeType,
          isVip: -1,
          status: 1,
          deleted: 0
        };
        this.$store.dispatch('getCommodities', params).then((data) => {
          if (data.result) {
            _this.totalPage = data.map.totalPage;
            _this.loading = false;
            if (data.map.pageNum === 1) {
              _this.commodityList = data.map.info;
            } else {
              _this.commodityList = _this.commodityList.concat(data.map.info);
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
      },
      onPlayerPlay(player) {
      },
      onPlayerPause(player) {
      },
      onChange(index) {
        /* if (index === 1 || index === 6) {
          // eslint-disable-next-line
          this.$refs.videoPlayer.pause;
        } */
      },
      toHot () {
      },
      toNew () {
      },
      toCheap () {
      },
      toType () {
      }
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player;
      }
    }
  };
</script>

<style scoped lang="scss">
.home{
  .type{
    .flex1{
      text-align: center;
    }
  }
}
</style>
