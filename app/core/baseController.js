'use strict';

const Controller = require('egg').Controller;
// 接收、校验、处理 HTTP 请求参数
// 向下调用服务（Service）处理业务
// 通过 HTTP 将结果响应给用户
class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  success(data, msg = '') {
    this.ctx.body = { msg, data, code: 200 };
  }

  error(msg = '', code = -1) {
    this.ctx.body = { msg, code };
  }

  notFount(msg) {
    this.ctx.throw(404, msg || 'not fount');
  }


}

module.exports = BaseController;
