<template>
  <div class="person-center">
    <van-icon class="center-btn" :name="require('@/assets/images/person-center.png')" size="0.75rem" @click="showCenter"/>
    <van-popup v-model="popShow" position="left" class="popup">
      <van-image
        round
        width="60px"
        height="60px"
        fit="cover"
        :src="showImgSrc"
      />
      <p style="margin-top: 10px">个人中心</p>
      <p class="center-greetings">
        {{ `${currLoginName ? currLoginName + "," : ""}${showCurrTime || ""}` }}
      </p>
      <section>
        <p @click="toBascInfo"><van-icon name="records" />基本信息</p>
        <p @click="toMyRelease"><van-icon name="orders-o" />我的发布</p>
        <p @click="switchUser"><van-icon name="user-circle-o" />切换账号</p>
      </section>
      <!-- <p class="logout" @click="logout">
        <van-icon name="user-circle-o" />退出系统
      </p> -->
    </van-popup>
  </div>
</template>

<script>
import { getCarOwnerInfo, getPassengerInfo } from "@/services";
import { delCookie } from "@/utils/cookie";
import { Dialog } from "vant";
import { mapGetters } from "vuex";
export default {
  name: "navBar",
  props: {
    
  },
  data() {
    return {
      popShow: false,
      currLoginName: "",
      currLoginGender: 1, // 默认女
      showImgSrc:require("@/assets/images/dog.jpg")
    };
  },
  mounted(){
    if(this.sassBaseData.avatar){
      // 获取基本信息头像
      this.showImgSrc = this.sassBaseData.avatar
    }
    if(this.sassBaseData.name){
      // 基本信息姓名
      this.currLoginName = this.sassBaseData.name
    }
  },
  computed: {
    showCurrTime() {
      const timeDis =
        this.$moment().startOf("day").valueOf() +
        12 * 60 * 60 * 1000 -
        new Date().valueOf();
      if (timeDis < 0) {
        return "下午好";
      }
      return "上午好";
    },
    // showImgSrc() {
    //   const map = {
    //     0: require("@/assets/images/dog.jpg"),
    //     1: require("@/assets/images/cat.jpeg"),
    //   };
    //   console.log('====')
    //   console.log(this.sassBaseData)
    //   return map[this.currLoginGender];
    // },
    ...mapGetters({
      sassBaseData: 'baseInfo/sassBaseData',
    }),
  },
  methods: {
    showCenter(){
      this.popShow = true;
    },
    async initCenter() {
      const passengerInfo = await this.getPassengerInfo();

      if (passengerInfo) {
        this.currLoginName = passengerInfo.name;
        this.currLoginGender = passengerInfo.gender;
      }

      if (!passengerInfo) {
        const carInfo = await this.getCarOwnerInfo();
        if (carInfo) {
          this.currLoginName = carInfo.driverName;
          this.currLoginGender = carInfo.driverGender;
        }
      }

      this.popShow = true;
    },
    // 获取车主信息
    getCarOwnerInfo() {
      return getCarOwnerInfo()
        .then(({ data }) => {
          return data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取乘客信息
    getPassengerInfo() {
      return getPassengerInfo()
        .then(({ data }) => {
          return data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 基本信息
    toBascInfo() {
      this.$router.push({
        name: "my-basic",
      });
    },
    // 我的发布
    toMyRelease() {
      this.$router.push({
        name: "myRelease",
      });
    },
    // 切换用户
    switchUser() {
      this.$router.push({
        name: "login",
      });
      delCookie({
        // name: "loginPhone",
        name: 'account'
      });
    },
    // 退出系统
    logout() {
      Dialog.confirm({
        message: "确认要退出系统吗?",
      })
        .then(() => {
          const userAgent = navigator.userAgent;
          if (
            userAgent.indexOf("Firefox") !== -1 ||
            userAgent.indexOf("Chrome") !== -1
          ) {
            window.location.href = "about:blank";
          } else if (
            userAgent.indexOf("Android") > -1 ||
            userAgent.indexOf("Linux") > -1
          ) {
            window.opener = null;
            window.open("about:blank", "_self", "").close();
          } else {
            window.opener = null;
            window.open("about:blank", "_self");
            window.close();
          }
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style lang="scss" scoped>
.popup {
  height: 100%;
  width: 110px;
  padding-top: 80px;
  text-align: center;
  font-size: 12px;
  .van-icon {
    margin-right: 5px;
  }
  .center-greetings {
    color: #79a2df;
    margin-top: 20px;
  }
  section {
    margin-top: 50px;
    p {
      color: #1989fa;
      cursor: pointer;
      margin: 30px 0;
    }
  }
  .logout {
    position: fixed;
    left: 20px;
    bottom: 80px;
  }
}
.person-center {
  min-height: 40px;
  display: flex;
  align-items: center;
  .center-btn{
    cursor: pointer;
    position: absolute;
    right: 160px;
    display: inline-block;
  }
}
</style>
