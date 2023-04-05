<template>
  <div class="myself-wraper">
    <div class="user">
      <p class="com-title"><span class="com-title-left">用户信息</span><span  class="com-title-right" @click="goTolist">返回列表</span></p>
      <ul class="user-main">
        <li>
          <span class="main-left"> 姓名 </span>
          <span class="main-right">
            {{ sassBaseData.name }}
          </span>
        </li>
        <li>
          <span class="main-left"> 性别 </span>
          <span class="main-right">
            {{ sassBaseData.sexName }}
          </span>
        </li>
        <li>
          <span class="main-left"> 人员编号 </span>
          <span class="main-right">
            {{ sassBaseData.jobNumber }}
          </span>
        </li>
        <li>
          <span class="main-left"> 个人手机(sass) </span>
          <span class="main-right">
            {{ sassBaseData.truePhone }}
          </span>
        </li>
        <li>
          <span class="main-left"> 邮箱 </span>
          <span class="main-right">
            {{ sassBaseData.email }}
          </span>
        </li>
      </ul>
    </div>
    <div class="empty"></div>
    <template v-if="!isToPublish">
      <van-tabs v-model="active">
        <van-tab title="乘客">
          <Passenger
            :toSave="toSave"
            :active="active"
            class="content"
          ></Passenger>
        </van-tab>
        <van-tab title="车主">
          <CarOwner
            :toSave="toSave"
            :active="active"
            class="content"
          ></CarOwner>
        </van-tab>
      </van-tabs>
    </template>
    <!-- 车主/乘客 -->
    <component
      :is="currentComponent"
      :toSave="toSave"
      :active="active"
      class="content"
      v-else
    ></component>
    <van-button class="submit-btn" round type="info" size="large" @click="save"
      >保存</van-button
    >
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Passenger from "./passenger";
import CarOwner from "./carOwner.vue";
export default {
  components: { Passenger, CarOwner },
  data() {
    return {
      active: 0,
      carInfoForm: {},
      toSave: false,
      isToPublish: false,
      currentComponent: "Passenger",
    };
  },
  created() {
    const { type = "" } = this.$route.query;
    if (type) {
      const componentKey = {
        carOwner: "CarOwner",
        passenger: "Passenger",
      };
      this.currentComponent = componentKey[type];
      this.isToPublish = true;
      this.active = type === "carOwner" ? 1 : 0;
    }
  },
  computed: {
    ...mapGetters({
      sassBaseData: "baseInfo/sassBaseData",
    }),
  },
  methods: {
    save() {
      this.toSave = true;
    },
    goTolist() {
      this.$router.push({name: 'routeList'})
    }
  },
};
</script>
<style lang="scss" scoped>
.myself-wraper {
  padding-top: 10px;
  height: 100vh;
  background-color: #fff;
  ::v-deep .van-tabs__wrap {
    width: 50%;
  }
  .content {
    margin-top: 20px;
    position: relative;
  }
}
.submit-btn {
  position: fixed;
  bottom: 10px;
  left: 0;
  width: 90%;
  margin-left: 5%;
}
.user {
  margin: 0 10px;
  .com-title {
    border-radius: 6px 6px 0px 0px;
    background: url(../../assets/images/combj.png) no-repeat;
    background-size: 100%;
    font-size: 16px;
    text-align: left;
    height: 43px;
    line-height: 43px;
    text-indent: 7px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 550;
    color: #333333;
    display: flex;
    justify-content: space-between;
    padding: 0 2px;

    &-right {
      color: #0066ff;
    }
  }
  .user-main {
    font-size: 14px;
    color: #90949e;
    li {
      display: flex;
      justify-content: space-between;
      padding: 10px 10px;
      border-bottom: 1px solid #f7f8fa;
    }
  }
}
.empty {
  border-bottom: 6px solid #f7f8fa;
  margin-top: 10px;
}
</style>
