import Vue from "vue";
import Router from "vue-router";
import { getCookie } from "@/utils/cookie";

Vue.use(Router);

// 获取原型对象上的push函数
const originalPush = Router.prototype.push;
// 修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const constantRoutes = [
  {
    path: "/",
    redirect: {
      name: "routeList",
    },
  },
  // {
  //   path: "/login",
  //   name: "login",
  //   component: () => import("@/views/login/index.vue"),
  //   meta: {
  //     title: "登录",
  //     keepAlive: false,
  //   },
  // },
  {
    path: "/my-basic",
    name: "my-basic",
    component: () => import("@/views/myself/index.vue"),
    meta: {
      title: "基本信息",
      keepAlive: false,
    },
  },
  {
    path: "/toPerfectTip",
    name: "toPerfectTip",
    component: () => import("@/views/myself/toPerfectTip.vue"),
    meta: {
      title: "基本信息",
      keepAlive: false,
    },
  },
  {
    path: "/routeList",
    name: "routeList",
    component: () => import("@/views/routeList/index.vue"),
    meta: {
      title: "行程列表",
      keepAlive: false,
    },
  },
  {
    path: "/routeDetails",
    name: "routeDetails",
    component: () => import("@/views/routeList/details.vue"),
    meta: {
      title: "发布详情",
      keepAlive: false,
    },
  },
  {
    path: "/myRelease",
    name: "myRelease",
    component: () => import("@/views/myRelease/index.vue"),
    meta: {
      title: "我的发布",
      keepAlive: false,
    },
  },
  {
    path: "/routeInfo",
    name: "routeInfo",
    component: () => import("@/views/routeInfo/index.vue"),
    meta: {
      title: "发布信息/登记信息",
      keepAlive: true,
    },
  },
  {
    path: "/address",
    name: "address",
    component: () => import("@/components/detailAddress/index.vue"),
    meta: {
      title: "地图",
      keepAlive: false,
    },
  },
];
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    routes: constantRoutes,
  });
const router = createRouter();

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to?.meta?.title) {
    document.title = to.meta.title;
  }

  console.log(to,'to====');
  // 判断需要鉴权的页面
  if (to.meta.notRequireAuth) {
    next();
  } else {
    // 顶部增加如下代码并return掉
    if (window.isSSOLogin && window.isSSOLogin()) {
      // eslint-disable-next-line no-undef
      hx.login({ next });
      return;
    }
    next();
  }
  
});

export default router;
