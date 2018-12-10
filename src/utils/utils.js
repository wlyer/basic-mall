export default {
  /**
   * 时间格式
   * @params t: 必传 时间，当前时间传false
   * @params current: 非必传 true：年月日，false：年月日时分秒
   * */
  format (t, current = false) {
    let time = t ? new Date(t) : new Date();
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let M = time.getMinutes();
    let s = time.getSeconds();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    h = h < 10 ? '0' + h : h;
    M = M < 10 ? '0' + M : M;
    s = s < 10 ? '0' + s : s;
    let ymd = y + '-' + m + '-' + d;
    let sfm = current ? '00:00:00' : h + ':' + M + ':' + s;
    return ymd + ' ' + sfm;
  },
  /**
   * 保留num位小数
   * @params data: 必传，转换的数字,number.如果data不是number则直接返回。
   * @params num： 非必传，不传默认保留两位小数。保留num位小数.number.
   * */
  toFixed (data, num = 2) {
    if (typeof (data) === 'number') {
      if (JSON.stringify(data).indexOf('.') > -1) {
        return data.toFixed(num);
      } else {
        let m = data + '.';
        for (let i = 0; i < num; i++) {
          m += '0';
        }
        return m;
      }
    } else {
      return data;
    }
  },
  // 除法
  chu (arg1, arg2) {
    if (!arg1) return '';
    if (!arg2) return '';
    let t1 = 0; let t2 = 0; let r1; let r2;
    try {
      t1 = arg1.toString().split('.')[1].length;
    } catch (e) {
    }
    try {
      t2 = arg2.toString().split('.')[1].length;
    } catch (e) {
    }
    r1 = Number(arg1.toString().replace('.', ''));
    r2 = Number(arg2.toString().replace('.', ''));
    return Number(((r1 / r2) * Math.pow(10, t2 - t1)).toFixed(2));
  },
  // 乘法
  cheng (arg1, arg2) {
    let m = 0; let s1 = arg1.toString(); let s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {
    }
    try {
      m += s2.split('.')[1].length;
    } catch (e) {
    }
    return Number((Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)).toFixed(2));
  },
  // 加法
  jia (arg1, arg2) {
    let r1, r2, m;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return Number(((arg1 * m + arg2 * m) / m).toFixed(2));
  },
  // 减法
  jian (arg1, arg2) {
    // let r1, r2, m, n;
    let r1, r2, m;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // 动态控制精度长度
    // n = (r1 >= r2) ? r1 : r2;
    // return ((arg1 * m - arg2 * m) / m).toFixed(n);
    return Number(((arg1 * m - arg2 * m) / m).toFixed(2));
  }
};
