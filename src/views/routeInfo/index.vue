<template>
  <div class="add-form">
    <van-tabs v-model="type" class="content-box" v-if="isShowAll">
      <van-tab title="乘客">
        <PassengerForm></PassengerForm>
      </van-tab>
      <van-tab title="车主">
        <CarOwnerForm></CarOwnerForm>
      </van-tab>
    </van-tabs>
    <!-- 车主/乘客 -->
    <component :is="currentComponent" :isShowAll="isShowAll" v-else></component>
  </div>
</template>

<script>
import PassengerForm from "./passengerForm.vue";
import CarOwnerForm from "./carOwnerForm.vue";

export default {
  components: {
    PassengerForm,
    CarOwnerForm,
  },
  data() {
    return {
      type: 0,
      isShowAll: false, // 是否展示全部表单
      currentComponent: "",
    };
  },

  methods: {
    getQueryData() {
      const { type = "" } = this.$route.query;
      if (type) {
        const componentKey = {
          carOwner: "CarOwnerForm",
          passenger: "PassengerForm",
        };
        this.currentComponent = componentKey[type];
        this.isShowAll = false;
        this.type = type === "carOwner" ? 1 : 0;
      } else {
        this.isShowAll = true;
      }
    },
  },
  mounted() {
    // this.getQueryData();
  },
  activated() {
    this.getQueryData()
  }
};
</script>

<style lang="scss" scoped>
.add-form {
  background-color: #fff;
}
.content-box {
  height: calc(100vh - 46px);
  overflow: auto;
}
::v-deep {
  .van-tab {
    flex: inherit;
    flex-basis: 20%;
  }
}
</style>
