/**
 * 根据域名，获取本应用的发布版本
 * sit-hxjf.hongxinshop.com
 * mit-hxjf.hongxinshop.com
 * hxjf.hongxinshop.com
 **/

const getEnv = (mark = 'hxjf') => {
  const reg = new RegExp('.*(?=' + mark + ')');
  const tag = window.location.hostname.match(reg);
  return !tag ? 'local' : tag[0] ? tag[0].replace('-', '') : 'production';
};
// 注册到全局
window.NODE_ENV = getEnv();

// 等域名统一后再使用此方法
export const getBaseUrl = (env = 'sit') => {
  return window.NODE_ENV === 'local' ? `/${env}-api` : '/vue-api';
};
