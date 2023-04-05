<template>
  <div class="list-div">
    <van-empty
      image="search"
      description="您还没有发布，快去发布一条吧"
      v-show="showEmpty"
    />
    <div class="list-box" v-for="(item, index) in dataList" :key="index">
      <div
        class="list-item"
        @click="goDetails(item)"
        :class="item.state === 0 ? 'putash' : ''"
      >
        <span class="person-num" v-show="type === 1"
          >{{ item.quantity }}人</span
        >
        <span class="person-num" v-show="type === 0"
          >{{ item.residueSeat }}人</span
        >

        <div class="item-left">{{ item.showName }}</div>
        <div class="item-right">
          <div class="place-info">
            {{ item.startAddress }}->>{{ item.endAddress }}
          </div>
          <div class="phone-info" v-show="type === 0">
            <div class="thank-info">{{ item.driverRemark }}</div>
            <span v-show="item.state === 0">{{ item.driverPhone }}</span>
            <a
              v-show="item.state === 1"
              class="acolor"
              :href="'tel:' + item.driverPhone"
              @click.stop="stopBubbling"
              >{{ item.driverPhone }}</a
            >
          </div>
          <div class="phone-info" v-show="type === 1">
            <div class="thank-info">{{ item.userRemark }}</div>
            <span v-show="item.state === 0">{{ item.userPhone }}</span>
            <a
              v-show="item.state === 1"
              class="acolor"
              :href="'tel:' + item.userPhone"
              @click.stop="stopBubbling"
              >{{ item.userPhone }}</a
            >
          </div>
          <div class="updata-info" :class="item.state === 0 ? 'putash' : ''">
            <div class="updata-time">
              {{ item.showStarttime }}&nbsp;~&nbsp;{{ item.showEndtime }}
            </div>
            <div class="updata-time">{{ item.showPubt }}发布</div>
          </div>
          <div class="cancel-release" v-show="item.state === 1">
            <van-button
              type="warning"
              size="mini"
              @click.stop="cancelRelease(item)"
              >取消发布</van-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog } from "vant";

export default {
  data() {
    return {
      showLoading: false,
      showEmpty: false,
    };
  },
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    dataList: {
      handler(val, oldVal) {
        if (val.length === 0) {
          this.showEmpty = true;
        } else {
          this.showEmpty = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    cancelRelease(item) {
      Dialog.confirm({
        title: "取消发布确认",
        message: "您确定要取消本次行程吗",
      })
        .then(() => {
          this.$emit("cancelRelease", item, this.type);
        })
        .catch(() => {
          // on cancel
        });
    },
    stopBubbling() {},
    goDetails(item) {
      if (this.type === 0) {
        item.genderName = item.driverGender === 0 ? "男" : "女";
      } else if (this.type === 1) {
        item.genderName = item.userGender === 0 ? "男" : "女";
      }
      this.$router.push({
        path: "/routeDetails",
        name: "routeDetails",
        params: {
          item,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.list-div {
  height: calc(100vh - 140px);
  overflow: auto;
  .list-box {
    width: 100%;
    padding: 10px 14px 0 14px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .list-item {
      width: 100%;
      padding: 4px 0;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      align-items: center;
      position: relative;
      .person-num {
        max-width: 60px;
        font-size: 10px;
        position: absolute;
        top: 4px;
        left: 0;
        padding: 2px 6px;
        background-color: red;
        color: #fff;
        border-radius: 0 10px 10px 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
      .item-left {
        width: 90px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        background-color: #fafafa;
      }
      .item-right {
        flex: 1;
        height: 100px;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .place-info {
          width: 100%;
          font-weight: bold;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .phone-info {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .thank-info {
            width: 80px;
            color: #666;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }
        }
        .updata-info {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #333;
          .updata-time {
          }
        }
        .cancel-release {
          text-align: right;
        }
      }
    }
  }
  .putash {
    color: #999 !important;
  }
  .acolor {
    color: #409eff;
  }
  ::v-deep .van-loading--spinner {
    position: absolute;
    top: 45%;
    left: calc(50vw - 12px);
  }
}
</style>
