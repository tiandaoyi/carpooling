import { httpPost, httpGet } from "../utils/request";
import { getBaseUrl } from '@/utils/env';

const baseUrl = window.location.origin + getBaseUrl(); // /mit-api /sit-api
console.log('baseUrl: ', baseUrl)

const proxyBaseUrl = process.env.NODE_ENV !== 'development' ? '/carpooling-api' : '/local-carpooling-api';
// const proxyBaseUrl = '/carpooling-api';
console.log('proxyBaseUrl: ', proxyBaseUrl)
// const proxyBaseUrl = 'http://hxpc-ui.hongxinshop.com/' + 'carpooling-api'
// 保存乘客信息
export const savePassengerInfo = (params = {}) =>
  httpPost({
    url: `${proxyBaseUrl}/savePassengerInfo`,
    data: params,
  });
// 获取乘客信息
export const getPassengerInfo = (params = {}) =>
  httpGet({
    url: `${proxyBaseUrl}/getPassengerInfo`,
    params: params,
  });
// 保存车主信息
export const saveCarOwnerInfo = (params = {}) =>
  httpPost({
    url: `${proxyBaseUrl}/saveOwnerInfo`,
    data: params,
  });
// 获取车主信息
export const getCarOwnerInfo = (params = {}) =>
  httpGet({
    url: `${proxyBaseUrl}/getOwnerInfo`,
    params: params,
  });
// 行程列表---乘客
export const tripListPerson = (params = {}) =>
  httpPost({
    url: `${proxyBaseUrl}/getPassengerSearching`,
    data: params,
  });
// 行程列表---车主
export const tripListCars = (params = {}) =>
  httpPost({
    url: `${proxyBaseUrl}/getCarSearching`,
    data: params,
  });

// 发布乘客行程
export const publishedFindPassenger = (params = {}) =>
  httpPost({
    url: `${proxyBaseUrl}/publishedFindPassenger`,
    data: params,
  });

// 发布车辆行程
export const publishedFindCar = (params = {}) =>
  httpPost({
    url: `${proxyBaseUrl}/publishedFindCar`,
    data: params,
  });
// 失效乘客行程
export const cancelFindCar = (params = {}) =>
httpPost({
  url: `${proxyBaseUrl}/cancelFindCar`,
  data: params,
});

// 失效车辆行程
export const cancelFindPassenger = (params = {}) =>
httpPost({
  url: `${proxyBaseUrl}/cancelFindPassenger`,
  data: params,
});
// sass登录的时候 获取基本信息的
export const current = (params = {}) =>
httpPost({
  url: `${baseUrl}/api-u/api/saas/user/current`,
  data: params,
});
// sass获取性别
export const personInfo = (params = {}) =>
httpPost({
  url: `${baseUrl}/api-u/api/saas/user/personInfoManage/personInfo`,
  data: params,
});
