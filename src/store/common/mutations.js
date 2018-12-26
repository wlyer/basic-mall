import { ADDRESSINFO } from './types';

export default {
  [ADDRESSINFO] (state, data) {
    state.addressInfo = data;
  }
};
