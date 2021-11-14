/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1636596855904_3918';

  // add your middleware config here
  config.middleware = [];

  // close csrf
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // mysql 连接参数
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'hongxinjianfa',
      database: 'carpooling',
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
  };

  config.cluster = {
    listen: {
      path: '',
      port: 7002,
      hostname: '0.0.0.0',
    },
  };

  // 单数据库信息配置
  // config.sequelize = {
  //   dialect: 'mysql',
  //   host: 'localhost',
  //   port: 3306,
  //   database: 'carpooling',
  // };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.static = {
    prefix: '/public',
    dir: path.join(appInfo.baseDir, '/app/public'),
  };

  return {
    ...config,
    ...userConfig,
  };
};
