<template>
  <div class="line choose-time">
    <van-field
      readonly
      clickable
      :disabled="disabled"
      :rules="rules"
      right-icon="arrow"
      :required="required"
      :name="name"
      :value="value"
      :label="label"
      placeholder="请选择时间"
      @click="showPickerfun"
    />
    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        :formatter="formatter"
        :filter="filter || defaultFilter"
        v-model="currentDate"
        :min-date="minDate"
        type="datetime"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>
<script>
export default {
  props: [
    "rules",
    "name",
    "label",
    "required",
    "initValue",
    "filter",
    "disabled",
    "minDate",
  ],
  name: "picker",
  data() {
    return {
      detail: {},
      value: "",
      showPicker: false,
      setPickerVal: "",
      currentDate: "",
      formatter(type, value) {
        if (type === "year") {
          return `${value}年`;
        } else if (type === "month") {
          return `${value}月`;
        } else if (type === "day") {
          return `${value}日`;
        } else if (type === "hour") {
          return `${value}时`;
        } else if (type === "minute") {
          return `${value}分`;
        } else if (type === "second") {
          return `${value}秒`;
        }

        return value;
      },
    };
  },
  watch: {
    showPicker: {
      handler(val) {
        if (val === true) {
          if (this.value) {
            const yy = new Date(this.value).getFullYear();
            const mm = new Date(this.value).getMonth();
            const dd = new Date(this.value).getDate();
            const hh = new Date(this.value).getHours();
            const mf = new Date(this.value).getMinutes();
            // let ss = new Date(this.value).getSeconds();
            this.currentDate = new Date(yy, mm, dd, hh, mf);
          } else {
            this.currentDate = new Date();
          }
        }
      },
    },
    initValue: {
      handler(val) {
        this.value = val;
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    showPickerfun() {
      if (this.disabled) return;
      this.showPicker = true;
    },
    defaultFilter(type, options) {
      if (type === "minute") {
        return ["00", "30"];
      }
      return options;
    },
    onConfirm(value) {
      // let setHoursVal = value.setHours(value.getHours() + 1);
      // this.value = this.$moment(setHoursVal).format("YYYY-MM-DD HH:mm:ss");
      // let nowMonth = new Date().getMonth() + 1;
      // let selectMonth = new Date(this.value).getMonth() + 1;
      // if (selectMonth < nowMonth) {
      //   let setYear = new Date(this.value).setFullYear(
      //     new Date(this.value).getFullYear() + 1
      //   );
      //   this.value = this.$moment(setYear).format("YYYY-MM-DD HH:mm:ss");
      // }
      this.value = this.$moment(value).format("YYYY-MM-DD HH:mm:ss");
      this.showPicker = false;
      this.$emit("savePicker", this.value);
    },
    clearTime() {
      this.value = "";
    },
  },
};
</script>
<style lang="scss" scoped>
.line {
  position: relative;
}
.line::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 16px;
  bottom: 0;
  left: 16px;
  border-bottom: 1px solid #f2f2f2;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.choose-time {
  ::v-deep .van-field__label {
    width: 8.2em;
  }
}
</style>
