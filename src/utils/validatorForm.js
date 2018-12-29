/**
 * @author wly
 * @date 2018/12/28
 * @Description: 表单校验封装
*/
import asyncValidator from 'async-validator';
const regular = {
  // 验证自然数
  naturalNumber: /^(([0-9]*[1-9][0-9]*)|(0+))$/,
  naturalNumberMsg: '请输入自然数',
  // 英文
  english: /^.[A-Za-z]+$/,
  englishMsg: '请输入英文字符',
  // 手机号
  phone: /^[1][0-9]{10}$/,
  phoneMsg: '请输入正确的手机号',
  // 座机
  telephone: /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/,
  telephoneMsg: '请输入正确的座机号',
  // 银行卡号码
  bankCard: /^[1-9]\d{9,19}$/,
  bankCardMsg: '请输入正确的银行卡号',
  // 证件号码
  IDNumber: /^[a-z0-9A-Z]{0,50}$/,
  IDNumberMsg: '请输入正确的证件号',
  // 身份证号码,包括15位和18位的
  IDCard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{7}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
  IDCardMsg: '请输入正确的身份证号',
  // QQ号码
  qq: /^[1-9]\d{4,11}$/,
  qqMsg: '请输入正确的QQ号',
  // 网址, 仅支持http和https开头的
  url: /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/,
  urlMsg: '请输入以http和https开头的网址',
  // 0到20位的英文字符和数字
  enNum0to20: /^[a-z0-9A-Z]{0,20}$/,
  enNum0to20Msg: '请输入20位以内的英文字符和数字',
  // 2到100位的中英文字符和空格
  cnEnSpace2to100: /^[a-zA-Z\u4E00-\u9FA5\s*]{2,100}$/,
  cnEnSpace2to100Msg: '请输入2到100位的中英文字符和空格',
  // 数字和换行符
  numLinefeed: /^[0-9\n*]+$/,
  numLinefeedMsg: '请输入数字和换行符',
  // 255位以内的字符
  char0to255: /^.{0,255}$/,
  char0to255Msg: '请输入255位以内的字符'
};
/* eslint-disable */
class validator {
  /**
   * 构造
   * @param rules object async-validator rules
   * @param data  初始对象
   */
  constructor (rules, data) {
    this.setData(data);
    this.setRules(rules);
  }

  /**
   * 重新定义初始对象
   * 也可以直接修改实例的data
   * validator.data = newData
   * @param data
   */
  setData (data) {
    this.data = data;
  }

  /**
   * 设定规则
   * @param rules rules object async-validator rules
   * @param cover 是否替换旧规则
   */
  setRules (rules, { cover } = {}) {
    if (cover === undefined || cover) {
      this.validators = {};
    }
    for (let attr in rules) {
      const rule = {};
      rule[attr] = rules[attr];
      this.validators[attr] = new asyncValidator(rule);
    }
  }

  /**
   * 执行验证
   * @param callback(errors, fields)
   * @param data 可选 传空将验证构造data 传string或数组验证构造data的响应字段
   * 以上参数顺序可互转
   */
  validate (callback, data) {
    let cb, d;
    if (typeof callback === 'function') {
      cb = callback;
      d = data;
    } else if (typeof data === 'function') {
      cb = data;
      d = callback;
    }

    let _d = d;

    if (this.data) {
      if (!d) {
        _d = this.data;
      } else if (typeof d === 'string') {
        _d = {};
        _d[d] = this.data[d];
      } else if (Array.isArray(d)) {
        _d = {};
        d.forEach(attr => {
          _d[attr] = this.data[attr];
        });
      }
    }

    const err = [];

    if (_d) {
      for (let attr in _d) {
        if (this.validators[attr]) {
          const o = {};
          o[attr] = _d[attr];
          this.validators[attr].validate(o, (error) => {
            if (error) {
              err.push(error[0]);
            }
          });
        }
      }
    }

    cb && cb(err.length > 0, err);
  }
}
/* eslint-enable */
export default {
  // 正则常用参数
  regular,
  // 构造函数
  validatorConstruct (rules, data) {
    return new validator(rules, data); // eslint-disable-line
  },
  /**
   * 清除验证提示
   * @param attrs
   */
  resetField (errorMsg, attrs) {
    attrs = !attrs ? Object.keys(errorMsg) : (Array.isArray(attrs) ? attrs : [attrs]);
    attrs.forEach(attr => {
      errorMsg[attr] = '';
    });
    return errorMsg;
  },
  /**
   * 验证方法
   * @param callback
   * @param data
   */
  validateForm (validator, errorMsg, callback, data) {
    validator.validate((errors, fields) => {
      errorMsg = this.resetField(errorMsg);
      if (errors) {
        fields.forEach(item => {
          errorMsg[item.field] = item.message;
        });
      }
      callback && callback(errors, fields);
    }, data);
  }
};
