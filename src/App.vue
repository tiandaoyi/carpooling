<template>
  <div id="app">
    <keep-alive> 
      <router-view v-if="$route.meta.keepAlive" :key="key" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" :key="key" />
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    key() {
      return this.$route.path;
    },
  },
  data() {
    return {
      // keepAlive: [],
    };
  },
};
</script>

<style>
body,
html {
  background: #f5f7fa;
}
* {
  margin: 0;
  padding: 0;
}
.van-dialog__confirm,
.van-dialog__confirm:active {
  color: #367ef5 !important;
}
.z-index {
  z-index: 999999 !important;
}
.foot {
  display: flex;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #f5f8fb;
}
</style>
