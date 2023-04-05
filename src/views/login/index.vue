<template>
  <div class="login-wraper">
    <section>
      <h1 class="title">拼车系统</h1>
      <van-field
        left-icon="smile-o"
        right-icon="warning-o"
        v-model="loginPhone"
        type="tel"
        maxlength="11"
        clearable
        label="手机号"
        placeholder="请输入手机号"
        style="border-radius: 5px; border: 1px solid #d9d0d0"
      />
    </section>
    <van-button class="submit-btn" type="info" @click="submit"
      >快速登录</van-button
    >
  </div>
</template>
<script>
import { Toast } from "vant";
import { setCookie } from "@/utils/cookie";
export default {
  data() {
    return {
      loginPhone: "",
    };
  },
  methods: {
    submit() {
      if (!this.loginPhone) {
        Toast("请输入手机号");
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.loginPhone)) {
        Toast("手机号码不合法，请重新输入");
        return;
      }
      setCookie("loginPhone", this.loginPhone, 24 * 7);
      this.$router.push({
        name: "routeList",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login-wraper {
  height: 100vh;
  background-color: #ede5e500;
  opacity: 0.8;
  font-size: 14px;
  text-align: center;
  // background-image: url('../../assets/images/bg.jpg');
  background-image: url("../../assets/images/bg.png");
  background-size: 100%;
  section {
    width: 90%;
    margin: 0 auto;
    position: relative;
    top: 50%;

    // transform: translateY(-50%);
    .title {
      margin-bottom: 20px;
      font-size: 40px;
      border: 1px solid black;
      border-radius: 5px;
      display: inline-block;
      padding: 0 10px;
      border-style: double;
      background-color: #ffffffa8;
      color: #454545;
      font-size: 36px;
    }
  }
}
.submit-btn {
  position: relative;
  width: 90%;
  top: 45%;
  // left: calc(50vw - 50px);
}
</style>
