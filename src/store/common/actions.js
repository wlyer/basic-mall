import { ADDRESSINFO, ORDERCOMMODITIES } from './types';

export default {
  // 新增地址信息
  addAddressInfo ({ commit }, params) {
    commit(ADDRESSINFO, params);
  },
  // 新增订单商品
  addOrderCommodities ({ commit }, params) {
    commit(ORDERCOMMODITIES, params);
  }
};
