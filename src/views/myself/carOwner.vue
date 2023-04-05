<template>
  <div>
    <van-form
      label-width="90px"
      :show-error-message="false"
      :scroll-to-error="true"
      ref="form1"
      class="owner"
    >
      <van-loading
        color="#409eff"
        type="spinner"
        size="24px"
        v-show="showLoading"
      />
      <van-field
        v-model="myInfo.driverPhone"
        clearable
        name="driverPhone"
        label="车主电话"
        type="tel"
        placeholder="请输入车主电话"
        required
        :rules="[{ required: true, message: '请填写车主电话' }]"
      />
      <van-field
        v-model="myInfo.driverName"
        clearable
        name="driverName"
        label="车主姓名"
        placeholder="请输入车主姓名"
        maxlength="10"
        required
        :rules="[{ required: true, message: '请填写车主姓名' }]"
      />
      <van-field
        v-model="myInfo.plateNumber"
        clearable
        name="plateNumber"
        label="车牌号"
        placeholder="请输入车牌号"
        maxlength="20"
        required
        :rules="[{ required: true, message: '请填写车牌号' }]"
      />
      <van-field
        v-model="myInfo.vehicleBrand"
        clearable
        name="vehicleBrand"
        label="车辆品牌"
        placeholder="请输入车辆品牌"
        maxlength="20"
        required
        :rules="[{ required: true, message: '请填写车辆品牌' }]"
      />
      <van-field
        v-model="myInfo.driverSeating"
        clearable
        name="driverSeating"
        type="digit"
        label="座位数"
        placeholder="请输入座位数"
        maxlength="2"
        required
        :rules="[{ required: true, message: '请填写座位数' }]"
      />
      <Picker
        :required="true"
        label="性别"
        name="userGender"
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
import { getCarOwnerInfo } from "@/services/index";
export default {
  mixins: [myInfo],
  data() {
    return {
      componentKey: 1,
      myInfo: {},
    };
  },
  created() {
    const { type = "" } = this.$route.query;
    if (!type) {
      this.getCarOwnerInfo();
    }
  },
  methods: {
    // 获取车主信息
    getCarOwnerInfo() {
      this.showLoading = true;
      getCarOwnerInfo()
        .then((res) => {
          this.myInfo = res?.data || {};
          this.driverGenderText = this.userGenderEnums.find(
            (v) => v.value === this.myInfo.driverGender
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
      this.myInfo.driverGender = value;
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
.owner {
  padding-bottom: 80px;
  background: #fff;
}
</style>
