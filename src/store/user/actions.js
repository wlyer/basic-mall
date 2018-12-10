import { get, post } from '../../api/api';
const url = 'daliweb/user/';
export default {
  // 获取信息列表()荣誉
  getUsersByHonor ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'getUsersByHonor', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 获取信息列表
  getUsers ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'getUsers', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 获取单个信息
  getUser ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(url + 'getUserById', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 获取单个信息
  getUserByUserCode ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get('daliweb/user/getUserByUserCode', params)
        .then(res => {
          resolve(res);
        });
    });
  },

  // 修改
  editUser ({ commit }, params) {
    return new Promise((resolve, reject) => {
      post(url + 'editUser', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 修改密码
  changeUserPsw ({ commit }, params) {
    return new Promise((resolve, reject) => {
      post(url + 'editPsw', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 登入
  requestLogin ({ commit }, params) {
    return new Promise((resolve, reject) => {
      post('login', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 注册
  register ({ commit }, params) {
    return new Promise((resolve, reject) => {
      post('register', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 获取好友列表
  getMyFriends ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get('daliweb/user/getRecommendByUserCode', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 验证码
  sendCode ({ commit }, params) {
    return new Promise((resolve, reject) => {
      get('daliweb/user/sendMessage', params)
        .then(res => {
          resolve(res);
        });
    });
  },
  // 忘记密码
  forgetPsw ({ commit }, params) {
    return new Promise((resolve, reject) => {
      post('daliweb/user/forgetPsw', params)
        .then(res => {
          resolve(res);
        });
    });
  }
};
