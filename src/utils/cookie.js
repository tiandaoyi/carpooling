import { getToken, setToken } from "./auth";
/**
 * cookie操作
 * 增 删 获取
 */

const setCookie = (name, value, expiresHours) => {
  setToken(value);
  // let cookieString = name + "=" + escape(value);
  // // 判断是否设置过期时间
  // if (expiresHours > 0) {
  //   // ;
  //   const date = new Date();
  //   date.setTime(date.getTime() + expiresHours * 60 * 60 * 1000);
  //   cookieString = cookieString + "; expires=" + date.toGMTString();
  // }
  // document.cookie = cookieString;
};

const getCookie = (name) => {
  return getToken(name);
  // const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  // const arr = document.cookie.match(reg);
  // if (arr) {
  //   return decodeURIComponent(arr[2]);
  // } else {
  //   return null;
  // }
};

const getCookieValue = (name) => {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  const arr = document.cookie.match(reg);
  if (arr) {
    return decodeURIComponent(arr[2]);
  } else {
    return null;
  }
};

const delCookie = ({ name, domain, path }) => {
  if (getCookie(name)) {
    document.cookie = name + "=; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
};

export { delCookie, getCookie, setCookie,getCookieValue };
