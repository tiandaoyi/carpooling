export default (Vue) => {
  Vue.directive("debounce", {
    inserted: function (el, binding) {
      const findEle = (parent, type) => {
        return parent.tagName.toLowerCase() === type
          ? parent
          : parent.querySelector(type);
      };
      const eve = findEle(el, "input") ? "keyup" : "click";
      let timer;
      el.addEventListener(eve, () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(() => {
          binding.value();
        }, 500);
      });
    },
  });

  Vue.directive("emoji", {
    bind: function (el, binding, vnode) {
      const findEle = (parent, type) => {
        return parent.tagName.toLowerCase() === type
          ? parent
          : parent.querySelector(type);
      };
      const trigger = (el, type) => {
        const e = document.createEvent("HTMLEvents");
        e.initEvent(type, true, true);
        el.dispatchEvent(e);
      };
      const bindVal = binding.value;
      const inputTag = "input";
      const $inp = findEle(el, inputTag);
      el.$inp = $inp;
      $inp.handle = function () {
        const val = $inp.value;
        const maxNum = Math.pow(10, bindVal.maxNum) - 0.01;
        const reg1 = new RegExp(
          "^\\d*(.?\\d{0," + bindVal.decimalNum + "})",
          "g"
        );
        const reg2 = new RegExp(
          "([0-9]+.[0-9]{" + bindVal.decimalNum + "})[0-9]*",
          "g"
        );
        let formateValue = "" + val;
        if (bindVal.isN) {
          formateValue =
            formateValue
              // eslint-disable-next-line no-useless-escape
              .replace(/[^\d^\.]+/g, "")
              .replace(/^0+(\d)/, "$1")
              .replace(/^\./, "0.")
              .replace(/^\.+(\d)/, "0.")
              .match(reg1)[0] || "";
        } else {
          formateValue = formateValue
            // eslint-disable-next-line no-useless-escape
            .replace(/[^\d^\.^\-]+/g, "")
            .replace(/^0+(\d)/, "$1")
            // eslint-disable-next-line no-useless-escape
            .replace(/^\-+([^\d])/, "")
            .replace(/^\./, "0.")
            .replace(/^\.+(\d)/, "0.")
            .replace(reg2, "$1");
          // eslint-disable-next-line no-useless-escape
          const minusLength = formateValue.replace(/[^\-]/g, "").length;
          const minusIndex = formateValue.indexOf("-");
          // eslint-disable-next-line no-useless-escape
          const pointLength = formateValue.replace(/[^\.]/g, "").length;
          if (minusLength > 1 || minusIndex > 0 || pointLength > 1) {
            // 含两个及以上.或-
            formateValue = "";
          }
        }
        const isMinus = val.indexOf("-") > -1;
        const abs = Math.abs(val) > maxNum;
        const than = val > maxNum;
        formateValue =
          isMinus && abs ? "" : !isMinus && than ? maxNum : formateValue;
        $inp.value = formateValue;
        trigger($inp, "input");
      };
      $inp.addEventListener("keyup", $inp.handle);
    },
    unbind: function (el) {
      el.$inp.removeEventListener("keyup", el.$inp.handle);
    },
  });
};
