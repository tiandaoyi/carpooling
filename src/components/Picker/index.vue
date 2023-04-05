<template>
  <div class="line">
    <van-field
      readonly
      :disabled="disable"
      clickable
      :rules="rules"
      :required="required"
      :name="name"
      right-icon="arrow"
      v-model="setValue"
      :label="label"
      placeholder="请选择"
      @click="showPopup"
    >
      <template #button v-if="showClear">
        <van-icon
          name="close"
          @click.stop="
            () => {
              $emit('clearClick', '');
            }
          "
        />
      </template>
    </van-field>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        :default-index="getDefaultIndex"
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
    "columns",
    "label",
    "required",
    "initValue",
    "initCode",
    "disable",
    "showClear",
  ],
  name: "picker",
  data() {
    return {
      detail: {},
      value: "",
      showPicker: false,
      getDefaultIndex: "",
      setValue: "",
    };
  },
  watch: {
    showPicker: {
      handler(val) {
        if (val === true) {
          this.columns.forEach((item, index) => {
            item.setIndex = index;
          });
          const getFindItem = this.columns.find((item) => {
            return item.code === this.initCode;
          });
          if (getFindItem) {
            this.getDefaultIndex = getFindItem.setIndex;
          }
        }
      },
    },
    initValue: {
      handler(val) {
        this.setValue = val;
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    onConfirm(value) {
      this.setValue = value.text;
      this.showPicker = false;
      this.$emit("savePicker", value);
    },
    showPopup() {
      if (this.disable) {
        return false;
      }
      this.showPicker = true;
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
</style>
