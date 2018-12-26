import { ADDRESSINFO } from './types';

export default {
  // 获取信息列表
  addAddressInfo ({ commit }, params) {
    commit(ADDRESSINFO, params);
  }
};
