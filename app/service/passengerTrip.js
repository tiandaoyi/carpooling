'use strict';

// 处理复杂业务逻辑
// 调用数据库或第三方服务（例如 GitHub 信息获取等）
const Service = require('egg').Service;
const utils = require('../core/utils');
class PassengerTripService extends Service {
  async find() {
    const list = await this.app.mysql.select('passenger_searching');
    return (list || []).map(item => {
      const obj = {};
      Object.entries(item).forEach(childItem => {
        obj[utils.toHump(childItem[0])] = childItem[1];
      });
      return obj;
    });
  }

  // 发布乘客信息
  async save(data) {
    const obj = {};
    Object.entries(data).forEach(childItem => {
      obj[utils.toLine(childItem[0])] = childItem[1];
    });
    const result = await this.app.mysql.insert('passenger_searching', obj);
    return result;
  }
}

module.exports = PassengerTripService;