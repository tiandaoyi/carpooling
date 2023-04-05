// 时分秒转换
export function formatSeconds(value) {
  let theTime = parseInt(value); // 秒
  let middle = 0; // 分
  let hour = 0; // 小时
  if (theTime > 60) {
    middle = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (middle > 60) {
      hour = parseInt(middle / 60);
      middle = parseInt(middle % 60);
    }
  }
  let result = "" + parseInt(theTime) + "秒";
  if (middle > 0) {
    result = "" + parseInt(middle) + "分" + result;
  }
  if (hour > 0) {
    result = "" + parseInt(hour) + "小时" + result;
  }
  return result;
}
export function getlocalStorage(name) {
  if (
    localStorage.getItem(name) !== "undefined" &&
    localStorage.getItem(name)
  ) {
    const { expires } = JSON.parse(localStorage.getItem(name));
    if (expires && expires <= new Date().getTime()) {
      localStorage.removeItem(name);
      return null;
    }
    return JSON.parse(localStorage.getItem(name));
  } else {
    return null;
  }
}
export function setlocalStorage(name, data, time) {
  if (time) {
    data.expires = new Date().getTime() + time * 60 * 60 * 1000;
    // eslint-disable-next-line no-undef
    data.format = moment(data.expires);
  }
  localStorage.setItem(name, JSON.stringify(data));
}

// 时间间隔比较
export function getDifferDate(comparetime, differ, target) {
  // differ 相差天数：1、相差小时数：2、相差分钟数：3、相差秒数：4
  let format;
  // 获取转化比（天数跟毫秒数的比例）
  if (differ === 1) {
    format = parseFloat(24 * 60 * 60 * 1000);
  }
  // 获取转化比（小时数跟毫秒数的比例）
  else if (differ === 2) {
    format = parseFloat(60 * 60 * 1000);
  }
  // 获取转化比（分钟数跟毫秒数的比例）
  else if (differ === 3) {
    format = parseFloat(60 * 1000);
  }
  // 获取转化比（秒数跟毫秒数的比例）
  else if (differ === 4) {
    format = parseFloat(1000);
  }
  // 1)将两个日期字符串转化为日期对象
  const compareDate = new Date(comparetime);
  let nowDate;
  if (target) {
    nowDate = new Date(target);
  } else {
    nowDate = new Date();
  }
  // 2)计算两个日期相差的毫秒数
  const msecNum = compareDate.getTime() - nowDate.getTime();
  // 3)计算两个日期相差的天数
  const dayNum = Math.floor(msecNum / format);
  return dayNum;
}
