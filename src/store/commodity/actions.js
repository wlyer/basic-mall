import { get } from '../../api/api';
const url = 'daliweb/commodity/';
export default {

  // 根据商品编号获取商品
  getCommodity ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'getCommodityById', params)
        .then(res => {
          resolve(res);
        });
      });
  },

  // 分页查询商品
  getCommodities ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'getCommodities', params)
        .then(res => {
          resolve(res);
        });
    });
  }
};
