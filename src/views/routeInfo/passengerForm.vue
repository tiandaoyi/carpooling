<template>
  <div class="passenger-form">
    <van-form
      class="form-content"
      ref="form"
      :class="[isShowAll ? 'all-height' : 'single-height']"
      :show-error-message="false"
    >
      <van-field
        v-model="form.startAddress"
        name="startAddress"
        readonly
        required
        label="出发地"
        placeholder="出发地"
        :rules="[{ required: true, message: '请填写出发地' }]"
      >
        <template #button>
          <van-icon name="location-o" @click="getAddress('startAddress')" />
        </template>
      </van-field>
      <van-field
        v-model="form.endAddress"
        name="endAddress"
        required
        readonly
        label="到达地"
        placeholder="到达地"
        :rules="[{ required: true, message: '请填写到达地' }]"
      >
        <template #button>
          <van-icon name="location-o" @click="getAddress('endAddress')" />
        </template>
      </van-field>
      <Picker
        :required="true"
        label="性别"
        name="userGender"
        :columns="userGenderEnums"
        :initValue="genderName"
        @savePicker="saveDriverGender"
        :rules="[{ required: true, message: '请选择性别' }]"
      >
      </Picker>
      <van-field
        name="quantity"
        required
        label="乘车人数"
        placeholder="乘车人数"
        :rules="[{ required: true, message: '请填写乘车人数' }]"
      >
        <template #input>
          <van-stepper v-model="form.quantity" integer min="1" max="8" />
        </template>
      </van-field>
      <DateTime
        label="出发时间"
        name="startTime"
        :required="true"
        :filter="filter"
        :initValue="form.startTime"
        :minDate="minDate"
        @savePicker="saveStartTime"
        :rules="[{ required: true, message: '请选择出发时间' }]"
      ></DateTime>
      <DateTime
        label="停止时间"
        name="endTime"
        :required="true"
        :filter="filter"
        :initValue="form.endTime"
        :minDate="minDate"
        @savePicker="saveEndTime"
        :rules="[{ required: true, message: '请选择停止时间' }]"
      ></DateTime>
      <van-field
        v-model="form.userRemark"
        name="userRemark"
        required
        label="备注"
        type="textarea"
        maxlength="200"
        show-word-limit
        placeholder="备注"
        :rules="[{ required: true, message: '请填写备注' }]"
      />
    </van-form>
    <div class="form-btns">
      <van-button round block type="info" @click="onSubmit">找车主</van-button>
    </div>
  </div>
</template>

<script>
import { publishedFindPassenger, getPassengerInfo } from "@/services";
import { getDifferDate } from "@/utils/public";
export default {
  props: {
    isShowAll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      form: {
        userName: "",
        userPhone: "",
        startAddress: "",
        endAddress: "",
        userGender: "",
        userRemark: "",
        quantity: 1,
        startTime: "",
        endTime: "",
        departLongitude:"",//出发地经纬度
        departLatitude:"",
        arriveLongitude:"",//到达地经纬度
        arriveLatitude:"",
      },
      userGenderEnums: [
        {
          text: "男",
          value: 0,
        },
        {
          text: "女",
          value: 1,
        },
      ],
      genderName: "",
      minDate: new Date(),
    };
  },
  watch: {
    $route() {
      const { startAddress = "", endAddress = "",arriveLongitude = "",arriveLatitude="" ,departLongitude="",departLatitude=""} = this.$route.query;
      if (startAddress) {
        this.form.startAddress = startAddress;
        this.form.departLongitude = departLongitude;
        this.form.departLatitude = departLatitude;
      }
      if (endAddress) {
        this.form.endAddress = endAddress;
        this.form.arriveLongitude = arriveLongitude;
        this.form.arriveLatitude = arriveLatitude;
      }
    },
  },
  activated() {
    const { from = "" } = this.$route.query;
    if (!from) {
      this.form = {
        ...this.form,
        startAddress: "",
        endAddress: "",
        userGender: "",
        userRemark: "",
        quantity: 1,
        startTime: "",
        endTime: "",
      };
      this.genderName = "";
    }
  },
  methods: {
    getAddress(addressType) {
      const { type = "" } = this.$route.query;
      const { startAddress, endAddress } = this.form;
      const initAddress = {
        startAddress,
        endAddress,
      };
      this.$router.push({
        name: "address",
        query: { addressType, type, initAddress },
      });
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
      this.form.userGender = value;
      this.genderName = this.userGenderEnums.find(
        (v) => v.value === value
      )?.text;
    },
    saveStartTime(str) {
      this.form.startTime = str;
    },
    saveEndTime(str) {
      this.form.endTime = str;
    },
    onSubmit() {
      this.$refs.form
        .validate()
        .then(() => {
          const { startTime, endTime } = this.form || {};
          const hoursDiff = getDifferDate(endTime, 2, startTime);
          if (hoursDiff <= 0) {
            return this.$Toast.fail("停止找车时间不能早于开始找车时间");
          }
          const request = {
            publishTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
            ...this.form,
          };
          publishedFindPassenger(request).then((res) => {
            this.$Toast.success("发布成功！");
            this.$router.push({
              path: "/routeList",
              query: {
                type: "person",
              },
            });
            console.log(res);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取乘客信息
    getPassengerInfo() {
      getPassengerInfo()
        .then(({ data }) => {
          this.form.userName = data.name || "";
          this.form.userPhone = data.phone || "";
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getPassengerInfo();
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
    height: calc(100vh - 135px);
  }

  .single-height {
    height: calc(100vh - 90px);
  }
  .form-btns {
    box-sizing: border-box;
    width: 100%;
    padding: 0 16px;
  }
  .van-icon-location-o {
    color: #1989fa;
    font-size: 18px;
  }
}
</style>
