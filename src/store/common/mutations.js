import { ADDRESSINFO, ORDERCOMMODITIES } from './types';

export default {
  [ADDRESSINFO] (state, data) {
    state.addressInfo = data;
  },
  [ORDERCOMMODITIES] (state, data) {
    state.orderCommodities = data;
  }
};
