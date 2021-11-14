'use strict';

// 处理复杂业务逻辑
// 调用数据库或第三方服务（例如 GitHub 信息获取等）
const Service = require('egg').Service;
const utils = require('../core/utils');
class UserService extends Service {
  async getOwnerInfo(loginPhone) {
    const object = await this.app.mysql.get('user_owner_info', { login_phone: loginPhone });
    if (!object) return null;
    const obj = {};
    Object.entries(object).forEach(childItem => {
      obj[utils.toHump(childItem[0])] = childItem[1];
    });
    return obj;
  }

  async getPassengerInfo(loginPhone) {
    const object = await this.app.mysql.get('user_passenger_info', { login_phone: loginPhone });
    if (!object) return null;
    const obj = {};
    Object.entries(object).forEach(childItem => {
      obj[utils.toHump(childItem[0])] = childItem[1];
    });
    return obj;
  }

  async saveOwnerInfo(data) {
    const obj = {};
    Object.entries(data).forEach(childItem => {
      obj[utils.toLine(childItem[0])] = childItem[1];
    });
    const result = await this.app.mysql.insert('user_owner_info', obj);
    return result;
  }

  async savePassengerInfo(data) {
    const obj = {};
    Object.entries(data).forEach(childItem => {
      obj[utils.toLine(childItem[0])] = childItem[1];
    });
    const result = await this.app.mysql.insert('user_passenger_info', obj);
    return result;
  }
}

module.exports = UserService;
