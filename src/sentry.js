// sentry监控
import Vue from "vue";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import config from "../package.json";
Vue.prototype.Sentry = Sentry;

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: "https://1ffb67ed69b94b67ba67264088951f6a@sentry-fe.hongxinshop.com/55",
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true,
        logErrors: true,
      }),
    ],
    environment: NODE_ENV,
    release: config.version,
  });
}
