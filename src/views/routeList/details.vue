<template>
  <div class="passenger-form">
    <van-loading
      color="#409eff"
      type="spinner"
      size="24px"
      v-show="showLoading"
    />
    <van-form class="form-content all-height" ref="form">
      <van-field
        v-model="form.startAddress"
        name="startAddress"
        required
        label="出发地"
        placeholder="出发地"
        :disabled="disabledType"
        :rules="[{ required: true, message: '请填写出发地' }]"
      >
        <template #button>
          <van-icon name="location-o" @click="checkAddress(form.departLatitude, form.departLongitude, form.startAddress)" />
        </template>
      </van-field>
      <van-field
        v-model="form.endAddress"
        name="endAddress"
        required
        :disabled="disabledType"
        label="到达地"
        placeholder="到达地"
        :rules="[{ required: true, message: '请填写到达地' }]"
      >
        <template #button>
          <van-icon name="location-o" @click="checkAddress(form.arriveLatitude, form.arriveLongitude,form.endAddress)" />
        </template>
      </van-field>
      <Picker
        :required="true"
        label="性别"
        name="driverGender"
        :disable="disabledType"
        :initValue="form.genderName"
        :columns="driverGenderEnums"
        @savePicker="saveDriverGender"
        :rules="[{ required: true, message: '请选择性别' }]"
      >
      </Picker>
      <van-field
        name="residueSeat"
        required
        :disabled="disabledType"
        label="可乘车人数"
        placeholder="可乘车人数"
        :rules="[{ required: true, message: '请填写可乘车人数' }]"
      >
        <template #input>
          <van-stepper
            v-model="form.showNumber"
            integer
            min="1"
            max="8"
            :disabled="disabledType"
          />
        </template>
      </van-field>
      <DateTime
        label="开始找车时间"
        name="startTime"
        :required="true"
        :filter="filter"
        :disabled="disabledType"
        :initValue="form.startTime"
        @savePicker="saveStartTime"
        :rules="[{ required: true, message: '请选择开始找车时间' }]"
      ></DateTime>
      <DateTime
        label="停止找车时间"
        name="endTime"
        :required="true"
        :filter="filter"
        :disabled="disabledType"
        :initValue="form.endTime"
        @savePicker="saveEndTime"
        :rules="[{ required: true, message: '请选择停止找车时间' }]"
      ></DateTime>
      <van-field
        v-model="form.showRemark"
        name="driverRemark"
        required
        label="备注"
        type="textarea"
        :disabled="disabledType"
        maxlength="200"
        show-word-limit
        placeholder="备注"
        :rules="[{ required: true, message: '请填写备注' }]"
      />
    </van-form>
    <div class="form-btns" v-if="showBtn">
      <van-button round block type="info" @click="onSubmit"
        >取消发布</van-button
      >
    </div>
  </div>
</template>

<script>
import { cancelFindPassenger, cancelFindCar } from "@/services";
import { getCookie } from "@/utils/cookie";
import { Toast, Dialog } from "vant";

export default {
  data() {
    return {
      form: {
        driverName: "",
        driverPhone: "",
        startAddress: "",
        endAddress: "",
        driverGender: "",
        driverRemark: "",
        residueSeat: 1,
        startTime: "",
        endTime: "",
      },
      showBtn: false,
      showLoading: false,
      disabledType: true,
      driverGenderEnums: [
        {
          text: "男",
          value: 0,
        },
        {
          text: "女",
          value: 1,
        },
      ],
    };
  },
  methods: {
    checkAddress(lat, lng, address) {
      this.$router.push({
        name: "address",
        query: { lat, lng, address },
      });
    },
    clickRight() {
      // console.log(2222222222);
    },
    // 默认过滤器
    filter(type, options) {
      if (type === "minute") {
        return options.filter((option) => option % 5 === 0);
      }
      return options;
    },
    saveDriverGender(obj) {
      const { value } = obj;
      this.form.driverGender = value;
    },
    saveStartTime(str) {
      this.form.startTime = str;
    },
    saveEndTime(str) {
      this.form.endTime = str;
    },
    cancelFindCar() {
      cancelFindCar({ id: this.form.id })
        .then((res) => {
          if (res?.data) {
            Toast("取消成功");
            this.showBtn = false;
            this.showLoading = false;
          }
        })
        .catch((err) => {
          console.log(111, err);
          this.showLoading = false;
        });
    },
    cancelFindPassenger() {
      cancelFindPassenger({ id: this.form.id })
        .then((res) => {
          if (res?.data) {
            Toast("取消成功");
            this.showBtn = false;
            this.showLoading = false;
          }
        })
        .catch((err) => {
          console.log(111, err);
          this.showLoading = false;
        });
    },
    onSubmit() {
      Dialog.confirm({
        title: "取消发布确认",
        message: "您确定要取消本次行程吗",
      })
        .then(() => {
          this.showLoading = true;
          if (this.form.driverName) {
            this.cancelFindCar();
          } else {
            this.cancelFindPassenger();
          }
        })
        .catch(() => {
          // on cancel
        });
    },
  },
  mounted() {
    console.log(this.$route.params?.item);
    const loginPhone = getCookie("loginPhone");
    this.form = {...this.$route.query}
    this.form.showRemark = this.form?.userRemark || this.form?.driverRemark;
    this.form.showNumber = this.form.quantity || this.form.residueSeat;

    const itemPhone = this.form?.driverPhone || this.form.userPhone;
    if (loginPhone === itemPhone && this.form.state === 1) {
      this.showBtn = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.passenger-form {
  position: relative;
  font-size: 12px;
  .form-content {
    overflow: auto;
  }
  .all-height {
    height: calc(100vh - 90px);
  }
  .form-btns {
    box-sizing: border-box;
    width: 100%;
    padding: 0 16px;
  }
  ::v-deep .van-loading--spinner {
    position: absolute;
    top: 45%;
    left: calc(50vw - 12px);
    z-index: 99;
  }
  ::v-deep .van-field__control:disabled {
    color: #646566;
    -webkit-text-fill-color: #646566;
  }
  ::v-deep .van-field--disabled .van-field__label {
    color: #646566;
  }
}
</style>
