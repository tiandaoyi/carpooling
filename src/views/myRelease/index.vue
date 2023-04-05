<template>
  <div class="route-list">

    <div class="list-content">
      <van-loading
        color="#409eff"
        type="spinner"
        size="24px"
        v-show="showLoading"
      />
        <!-- offset-top="1.23rem" -->

      <van-tabs
        v-model="activeTab"
        sticky
        @click="onClick"
      >
        <van-tab title="找车主">
          <ListComponents
            :dataList="cardataList"
            :type="0"
            @cancelRelease="cancelRelease"
          ></ListComponents>
        </van-tab>
        <van-tab title="找乘客">
          <ListComponents
            :dataList="perdataList"
            :type="1"
            @cancelRelease="cancelRelease"
          ></ListComponents>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import ListComponents from "./listComponents.vue";
import { getCookie } from "@/utils/cookie";

import {
  tripListCars,
  tripListPerson,
  cancelFindPassenger,
  cancelFindCar,
} from "@/services/index";
import { Toast } from "vant";

export default {
  data() {
    return {
      showLoading: true,
      titleName: "我的发布",
      activeTab: 0, // tabs激活项
      cardataList: [],
      perdataList: [],
      loginPhone: "",
      account: ''
    };
  },
  components: {
    ListComponents,
  },
  created() {
    // this.loginPhone = '15248134634';
    // this.loginPhone = getCookie("loginPhone");
    this.account = getCookie('account')
    this.getCardata();
  },
  mounted() {},
  methods: {
    cancelFindCar(item) {
      cancelFindCar({ id: item.id })
        .then((res) => {
          if (res?.data) {
            Toast("取消成功");
            this.getCardata();
          }
        })
        .catch((err) => {
          console.log(111, err);
          this.showLoading = false;
        });
    },
    cancelFindPassenger(item) {
      cancelFindPassenger({ id: item.id })
        .then((res) => {
          if (res?.data) {
            Toast("取消成功");
            this.getPerdata();
          }
        })
        .catch((err) => {
          console.log(111, err);
          this.showLoading = false;
        });
    },
    cancelRelease(item, type) {
      console.log(item, type);
      if (type === 0) {
        this.cancelFindCar(item);
      } else if (type === 1) {
        this.cancelFindPassenger(item);
      }
    },
    clockTime(timestamp) {
      // 返回中间的时间
      return timestamp.substr(5, 11);

      // // 实例化当前时间
      // const time = new Date(timestamp);
      // // 年月日周
      // // const y = time.getFullYear();
      // const m = time.getMonth() + 1;
      // const day = time.getDate();
      // // 小时，分钟，秒
      // const h = time.getHours();
      // const miu = time.getMinutes();
      // // const s = time.getSeconds();
      // // const ms = time.getMilliseconds();
      // const resultTimne = `${m}.${day}-${h}:${miu}`;
      // return resultTimne;
    },
    onClick(name, title) {
      if (this.activeTab === 0) {
        this.getCardata();
      } else if (this.activeTab === 1) {
        this.getPerdata();
      }
    },
    getCardata() {
      this.showLoading = true;
      tripListCars({
        pageSize: 99,
        startPage: 1,
        // driverPhone: this.loginPhone,// 这里用的不是saas的手机号，是当前用户信息表的手机号
        account: this.account,
        state: 2,
      })
        .then((res) => {
          if (res?.data) {
            const datalist = res.data.list.map((ele) => {
              const end = ele.driverGender === 0 ? "先生" : "女士";
              ele.showName = ele.driverName.substr(0, 1) + end;
              ele.showStarttime = this.clockTime(ele.startTime);
              ele.showEndtime = this.clockTime(ele.endTime);
              ele.showPubt = this.$moment(ele.publishTime).fromNow(true);
              return ele;
            });
            this.cardataList = datalist
              .filter((item) => item.state === 1)
              .concat(datalist.filter((item) => item.state === 0));
            this.showLoading = false;
          }
        })
        .catch((err) => {
          console.log(111, err);
          this.showLoading = false;
          this.cardataList = [];
        });
    },
    getPerdata() {
      this.showLoading = true;
      tripListPerson({
        pageSize: 99,
        startPage: 1,
        // userPhone: this.loginPhone,
        account: this.account,
        state: 2,
      })
        .then((res) => {
          if (res?.data) {
            const datalist = res.data.list.map((ele) => {
              const end = ele.userGender === 0 ? "先生" : "女士";
              ele.showName = ele.userName.substr(0, 1) + end;
              ele.showStarttime = this.clockTime(ele.startTime);
              ele.showEndtime = this.clockTime(ele.endTime);
              ele.showPubt = this.$moment(ele.publishTime).fromNow(true);
              return ele;
            });
            this.perdataList = datalist
              .filter((item) => item.state === 1)
              .concat(datalist.filter((item) => item.state === 0));
            this.showLoading = false;
          }
        })
        .catch((err) => {
          console.log(111, err);
          this.showLoading = false;
          this.perdataList = [];
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.route-list {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  position: relative;
  .list-content {
    height: calc(100vh - 90px);
    overflow: auto;
  }
  ::v-deep .van-tabs__nav--line {
    width: 100%;
    padding-right: 40%;
    overflow-x: hidden;
  }
  ::v-deep .van-tab {
    width: 66px;
    flex: none;
  }
  ::v-deep .van-tabs--line .van-tabs__wrap {
    border-bottom: 1px solid #e8e8e8;
  }
  ::v-deep .van-tab__text--ellipsis {
    font-size: 14px;
  }
  ::v-deep .van-button--normal {
    width: 100%;
  }
  ::v-deep .van-loading--spinner {
    position: absolute;
    top: 45%;
    left: calc(50vw - 12px);
  }
}
</style>
