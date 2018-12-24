import { get, post } from '../../api/api';
const url = 'daliweb/order/';
export default {
  // 新增
  addOrder ({ commit }, params) {
    return new Promise((resolve, reject) => {
      post(url + 'addOrder', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 校验订单
  vaildOrder ({ commit }, params) {
    return new Promise((resolve, reject) => {
      post(url + 'vaildOrder', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 修改订单状态
  editStatus ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'editStatus', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 修改订单状态
  editDetailStatus ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'editDetailStatus', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 获取单个信息
  getOrder ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'getOrderById', params)
        .then(res => {
          resolve(res);
        });
      });
  },
  // 分页查询
  getOrders ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'getOrders', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 获取商品销量
  getSales ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'getNumByCommodityId', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 获取退款
  getRebackOrder ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'getOrderDetails', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 获取订单数量（个人中心页）
  getOrderNumByUserCode ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'getOrderNumByUserCode', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 点击退货，跳转至退货详情获取订单商品信息
  getOrderDetailById ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'getOrderDetailById', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 微信支付
  payWechat ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'wxpay', params)
        .then(res => {
          resolve(res);
        });
    });
  },

  // 支付宝支付
  payAlipay ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'alipay', params)
        .then(res => {
          resolve(res);
        });
    });
  },

  // 微信支付微信公众号
  wxgzpay ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'wxgzpay', params)
        .then(res => {
          resolve(res);
        });
    });
  }

};
