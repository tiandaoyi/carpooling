'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 车辆搜索列表
  router.get('/api/getCarSearching/', controller.carTrip.getCarSearching);
  // 发布车辆（匹配车辆搜索列表）
  router.post('/api/publishedFindCar/', controller.carTrip.publishedFindCar);
  // 发布找乘客信息
  router.post('/api/publishedFindPassenger/', controller.passengerTrip.publishedFindPassenger);
  // 乘客搜索列表
  router.get('/api/getPassengerSearching/', controller.passengerTrip.getPassengerSearching);

  // 获取乘客信息
  router.get('/api/getPassengerInfo/', controller.user.getPassengerInfo);
  // 获取车主信息
  router.get('/api/getOwnerInfo/', controller.user.getOwnerInfo);
  // 保存乘客信息
  router.post('/api/savePassengerInfo/', controller.user.savePassengerInfo);
  // 保存车主信息
  router.post('/api/saveOwnerInfo/', controller.user.saveOwnerInfo);
};
