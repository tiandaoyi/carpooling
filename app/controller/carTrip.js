'use strict';

// const Controller = require('egg').Controller;
const Controller = require('../core/baseController');
// 接收、校验、处理 HTTP 请求参数
// 向下调用服务（Service）处理业务
// 通过 HTTP 将结果响应给用户
class CarTripController extends Controller {

  async getCarSearching() {
    const { ctx } = this;
    const data = await ctx.service.carTrip.find();
    this.success(data);
  }

  async publishedFindCar() {
    const { ctx } = this;
    const params = ctx.request.body;
    // 临时把loginPhone当token
    // params.loginPhone = ctx.cookies.get('loginPhone');
    // console.log('loginPhone', ctx.cookies.get('loginPhone'));
    const data = await ctx.service.carTrip.save(params);
    this.success(data);
  }
}

module.exports = CarTripController;
