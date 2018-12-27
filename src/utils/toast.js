import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);
export default {
  loadingMsg (msg = '加载中') {
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: msg
    });
  },
  close () {
    Toast.clear();
  },
  tipMsg (msg = '该功能暂未开放') {
    Toast({
      message: msg
    });
  },
  success (msg = '成功') {
    Toast.success(msg);
  },
  error (msg = '失败') {
    Toast.fail(msg);
  },
  countDownLoadding (msg = '加载中', time = 10) {
    const toast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: msg + time + ' 秒'
    });
    const timer = setInterval(() => {
      time--;
      if (time) {
        toast.message = `倒计时 ${time} 秒`;
      } else {
        clearInterval(timer);
        Toast.clear();
      }
    }, 1000);
  }
};
