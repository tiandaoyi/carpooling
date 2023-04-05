<template>
  <div class="perfect-warper">
    <section class="position-center">
      <p>
        {{
          `${type === "carOwner" ? "车主" : "乘客"}基本信息不完善，请完善信息`
        }}
      </p>
      <p />
      <van-button
        class="perfect-btn"
        type="info"
        size="large"
        @click="toPerfect"
        >去完善</van-button
      >
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: "",
    };
  },
  methods: {
    toPerfect() {
      this.$router.push({
        name: "my-basic",
        query: {
          type: this.type,
        },
      });
    },
  },
  mounted() {
    const { type = "" } = this.$route.query;
    this.type = type;
  },
};
</script>
<style lang="scss" scoped>
.perfect-warper {
  height: 100vh;
  text-align: center;
  section {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    p {
      font-size: 23px;
    }
    .perfect-btn {
      width: 90%;
      margin-top: 60px;
    }
  }
}
</style>
