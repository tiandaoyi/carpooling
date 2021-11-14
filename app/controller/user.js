'use strict';

// const Controller = require('egg').Controller;
const Controller = require('../core/baseController');
// 接收、校验、处理 HTTP 请求参数
// 向下调用服务（Service）处理业务
// 通过 HTTP 将结果响应给用户
class UserController extends Controller {
  async getPassengerInfo() {
    const { ctx } = this;
    // 临时把loginPhone当token
    const loginPhone = this.ctx.cookies.get('loginPhone', { signed: false });
    const data = await ctx.service.user.getPassengerInfo(loginPhone);
    this.success(data);
  }

  async getOwnerInfo() {
    const { ctx } = this;
    // 临时把loginPhone当token
    const loginPhone = this.ctx.cookies.get('loginPhone', { signed: false });
    const data = await ctx.service.user.getOwnerInfo(loginPhone);
    this.success(data);
  }

  async savePassengerInfo() {
    const { ctx } = this;
    const params = ctx.request.body;

    // 临时把loginPhone当token
    params.loginPhone = ctx.cookies.get('loginPhone', { signed: false });
    const data = await ctx.service.user.savePassengerInfo(params);
    this.success(data);
  }

  async saveOwnerInfo() {
    const { ctx } = this;
    const params = ctx.request.body;
    // 临时把loginPhone当token
    params.loginPhone = ctx.cookies.get('loginPhone', { signed: false });
    console.log(params);
    const data = await ctx.service.user.saveOwnerInfo(params);
    this.success(data);
  }
}

module.exports = UserController;
