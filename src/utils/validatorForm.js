/* eslint-disable */

export default {
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
  validateForm (validator, errorMsg, callback, data ) {
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
}
