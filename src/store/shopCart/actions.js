import { get, post, del } from '../../api/api';
const url = 'daliweb/shoppingCart/';
export default {
  // 新增
  addShopCart  ({ commit }, params) {
    return new Promise((resolve, reject) => {
      post(url + 'addShoppingCart', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 修改
  editShopCartNum ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'editShoppingCart', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 分页查询
  getShopCarts ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'getShoppingCarts', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 删除
  delShopCart ({ commit }, params) {
    return new Promise((resolve, reject) => {
      del(url + 'delShoppingCart', params)
        .then(res => {
          resolve(res);
        });
    });
  }
};
