<template>
  <div class="passenger">
    <van-loading
      color="#409eff"
      type="spinner"
      size="24px"
      v-show="showLoading"
    />
    <van-form
      :show-error-message="false"
      :scroll-to-error="true"
      ref="form0"
    >
      <van-field
        v-model="myInfo.name"
        clearable
        name="name"
        label="联系人姓名"
        placeholder="请输入联系人姓名"
        maxlength="10"
        required
        :rules="[{ required: true, message: '请填写联系人姓名' }]"
      />
      <van-field
        v-model="myInfo.phone"
        clearable
        name="phone"
        label="联系人电话"
        type="tel"
        placeholder="请输入联系人电话"
        required
        :rules="[{ required: true, message: '请填写联系人电话' }]"
      />
      <Picker
        :required="true"
        label="性别"
        name="gender"
        :initValue="driverGenderText"
        :columns="userGenderEnums"
        @savePicker="saveUserGender"
        :rules="[{ required: true, message: '请选择性别' }]"
      >
      </Picker>
    </van-form>
  </div>
</template>
<script>
import myInfo from "@/utils/mixins/myInfo";
import { getPassengerInfo } from "@/services/index";
export default {
  mixins: [myInfo],
  data() {
    return {
      componentKey: 0,
      myInfo: {},
    };
  },
  created() {
    const { type = "" } = this.$route.query;
    if (!type) {
      this.getPassengerInfo();
    }
  },
  methods: {
    // 获取乘客信息
    getPassengerInfo() {
      this.showLoading = true;
      getPassengerInfo()
        .then((res) => {
          this.myInfo = res.data || {};
          this.driverGenderText = this.userGenderEnums.find(
            (v) => v.value === this.myInfo.gender
          )?.text;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.showLoading = false;
        });
    },
    // 选择性别
    saveUserGender(obj) {
      const { value } = obj;
      this.myInfo.gender = value;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .van-loading--spinner {
  position: absolute;
  top: 50vw;
  left: calc(50vw - 12px);
  z-index: 1;
}

.passenger ::v-deep .van-field--disabled .van-field__label {
  color: inherit;
}
</style>
