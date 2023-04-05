import axios from "axios";
import md5 from "js-md5";
import { Toast } from "vant";
import { getToken } from "@/utils/auth";
import { getBaseUrl } from '@/utils/env';

import { getCookieValue } from '@/utils/cookie';
// 从localStorage中获取token
function getLocalToken() {
  const accessToken = getCookieValue('access_token') || getCookieValue('purus_bpm_token');
  return accessToken;
}

// const baseUrl = `mit-api/api`;
const instance = axios.create({
  // baseURL: baseUrl,
  baseURL: '/',
  timeout: 10 * 1000,
});

// 判断api来源
// const urlFrom = function (config) {
//   if (config.url.indexOf("api-u") !== -1) {
//     config.baseURL = config.baseURL.replace("/api", "");
//     return config.baseURL;
//   }
//   return config.baseURL;
// };

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // config.baseURL = getBaseUrl();
    // const token = getToken();
    config.headers = {
      ...config.headers,
      Authorization: getLocalToken()
      ? `Bearer ${getLocalToken()}`
      : 'Bearer f45e96fc-f15c-4c5e-9a0b-b012f8f41499', // headers塞token
      // eslint-disable-next-line no-undef
      // ...hx.getSignHeaders({
      //   sign: {
      //     appid: 10003, // appid
      //     devKey: "a0f6483475c8fa48", // 非生产环境-项目key
      //     proKey: "2a4c2f6983f2880d", // 生产环境-项目key
      //   },
      //   config,
      // }),
      "Content-Type": "application/json",
      // Authorization: token || "",
    };
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);
// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      // 正确
      return Promise.resolve(response);
    } else {
      // 接口返回错误信息
      Toast(response.msg);
      return Promise.reject(response);
    }
  },
  (error) => {
    // 我们可以在这里对异常状态作统一处理
    try {
      if (
        error.response &&
        error.response.status &&
        error.response.status === 401
      ) {
        // 顶部增加如下代码并return掉
        if (window.isSSOLogin && window.isSSOLogin()) {
          // eslint-disable-next-line no-undef
          hx.login({ isExpired: true });
          return;
        }
        // 处理请求失败的情况
        // 对不同返回码对相应处理
        Toast("token失效");
        if (window.isApp) {
          const toast = Toast.loading({
            message: "用户信息已过期，重新获取中...",
            duration: 0, // 持续展示 toast
            forbidClick: true,
          });
          // eslint-disable-next-line no-undef
          hx.ready(function () {
            // eslint-disable-next-line no-undef
            hx.refreshToken({
              success: () => {
                toast.clear();
                window.location.reload();
              },
              fail: () => {
                Toast("获取用户信息失败,请刷新当前页面");
                toast.clear();
              },
            });
          });
        }
        return Promise.reject(error.response);
      } else {
        switch (error.response.status) {
          case 400:
            error.message = "请求错误(400)";
            break;
          case 403:
            error.message = "拒绝访问(403)";
            break;
          case 404:
            error.message = "请求出错(404)";
            break;
          case 408:
            error.message = "请求超时(408)";
            break;
          case 500:
            error.message = "服务器错误(500)";
            break;
          case 501:
            error.message = "服务未实现(501)";
            break;
          case 502:
            error.message = "网络错误(502)";
            break;
          case 503:
            error.message = "服务不可用(503)";
            break;
          case 504:
            error.message = "网络超时(504)";
            break;
          case 505:
            error.message = "HTTP版本不受支持(505)";
            break;
          default:
            error.message = `连接出错(${error.response.status})!`;
        }
        Toast(error.message);
        return Promise.reject(error);
      }
    } catch {
      Toast("网络不稳定，请稍后再试！");
    }
  }
);

// get 请求
export function httpGet({ url, params = {} }) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, {
        params,
      })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => {
        reject(err);
      });
  }).catch((error) => console.log(error));
}

// post请求
export function httpPost({ url, data = undefined, params = {} }) {
  return new Promise((resolve, reject) => {
    // const token = getToken();
    instance({
      headers: {
        // ...getSignHeaders(data || ''),
        // 'Content-Type': 'application/json',
        // 'Authorization': 'Bearer' + token || ''
      },
      url,
      method: "post",
      transformRequest: [
        function (data) {
          data = JSON.stringify(data);
          return data;
        },
      ],
      data,
      params,
    })
      .then((res) => {
        Toast.setDefaultOptions({
          className: "z-index",
        });
        if (res.data && res.data.code === 500) {
          const msg = res.data.msg || "网络不稳定，请稍后再试！";
          Toast(msg);
        } else if (res.data && res.data.code === 400) {
          Toast("网络不稳定，请稍后再试！");
        } else if (res.data && res.data.code === -1) {
          Toast(res.data.msg);
        } else if (res.data && res.data.code === 0) {
          Toast(res.data.msg);
        } else {
          if (res.data && res.data.code === 200) {
            resolve(res.data);
          }
        }
        if (res.data && res.data.code === undefined) {
          resolve(res.data);
        }
      })
      .then((res) => {
        reject(res);
      });
  });
}
// formdata
export function httpPostFormData({ url, data, params }) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    instance({
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token || "",
      },
      url,
      method: "post",
      transformRequest: [
        function (data) {
          return data;
        },
      ],
      data,
      params,
    })
      .then((res) => {
        resolve(res.data);
      })
      .then((res) => {
        reject(res);
      });
  });
}

// blob
export function httpPostBlob({ url, data, params }) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    instance({
      headers: {
        "Content-Disposition": "attachment;filename=ke.xlsx",
        "Content-Type": "multipart/form-data",
        Authorization: token || "",
      },
      url,
      method: "post",
      data,
      params,
      responseType: "blob",
    })
      .then((res) => {
        resolve(res.data);
        const data = res.data;
        const blob = data;
        const fileName = "文件导出.xlsx";
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      })
      .then((res) => {
        reject(res);
      });
  });
}

export function getSignHeaders(
  data = "",
  url = "",
  info = {
    proKey: "2a4c2f6983f2880d",
    devKey: "a0f6483475c8fa48",
    appid: 10003,
  }
) {
  const paramsIndex = url.indexOf("?");
  const params = url && paramsIndex > -1 ? url.slice(paramsIndex + 1) : "";
  const secertKey =
    window.NODE_ENV === "production" ? info.proKey : info.devKey;
  const timestamp = Date.parse(new Date()).toString().substr(0, 10);
  // params不存在则使用data
  const suffix = params
    ? `&${params}`
    : `${data ? "&" + JSON.stringify(data) : ""}`;
  const sign = `${info.appid}&${timestamp}&${secertKey}${suffix}`;
  return {
    appid: info.appid,
    timestamp,
    sign: md5(sign),
  };
}
