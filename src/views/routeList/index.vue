<template>
  <div class="route-list">

    <div class="list-content">
      <van-loading
        color="#409eff"
        type="spinner"
        size="24px"
        v-show="showLoading"
      />
      <van-tabs
        v-model="activeTab"
        sticky
        @click="onClick"
      >
        <van-tab title="找车主">
          <van-pull-refresh v-model="refcarLoading" @refresh="caronRefresh">
            <van-list
              v-model="carlistLoading"
              :finished="carfinished"
              finished-text="没有更多了"
              @load="carReloadList"
              :immediate-check="false"
            >
              <van-empty
                image="search"
                description="您还没有发布，快去发布一条吧"
                v-show="showcarEmpty"
              />
              <div
                class="list-box"
                v-for="(item, index) in cardataList"
                :key="index"
              >
                <div class="list-item" @click="goDetails(item)">
                  <span class="person-num">{{ item.residueSeat }}人</span>

                  <div class="item-left">{{ item.showName }}</div>
                  <div class="item-right">
                    <div class="place-info">
                      {{ item.startAddress }}->>{{ item.endAddress }}
                    </div>
                    <div class="phone-info">
                      <div class="thank-info">{{ item.driverRemark }}</div>
                      <a
                        style="color: #409eff"
                        :href="'tel:' + item.driverPhone"
                        @click.stop="stopBubbling"
                        >{{ item.driverPhone }}</a
                      >
                    </div>
                    <div class="updata-info">
                      <div class="updata-time">
                        {{ item.showStarttime }}&nbsp;~&nbsp;{{
                          item.showEndtime
                        }}
                      </div>
                      <div class="updata-time">{{ item.showPubt }}发布</div>
                    </div>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="找乘客">
          <van-pull-refresh v-model="refperLoading" @refresh="peronRefresh">
            <van-list
              v-model="perlistLoading"
              :finished="perfinished"
              finished-text="没有更多了"
              @load="perReloadList"
              :immediate-check="false"
            >
              <van-empty
                image="search"
                description="您还没有发布，快去发布一条吧"
                v-show="showperEmpty"
              />
              <div
                class="list-box"
                v-for="(item, index) in perdataList"
                :key="index"
              >
                <div class="list-item" @click="goDetails(item)">
                  <span class="person-num">{{ item.quantity }}人</span>

                  <div class="item-left">{{ item.showName }}</div>
                  <div class="item-right">
                    <div class="place-info">
                      {{ item.startAddress }}->>{{ item.endAddress }}
                    </div>
                    <div class="phone-info">
                      <div class="thank-info">{{ item.userRemark }}</div>
                      <a
                        style="color: #409eff"
                        :href="'tel:' + item.userPhone"
                        @click.stop="stopBubbling"
                        >{{ item.userPhone }}</a
                      >
                    </div>
                    <div class="updata-info">
                      <div class="updata-time">
                        {{ item.showStarttime }}&nbsp;~&nbsp;{{
                          item.showEndtime
                        }}
                      </div>
                      <div class="updata-time">{{ item.showPubt }}发布</div>
                    </div>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <template #nav-right>
          <PersonCenter />
        </template>
      </van-tabs>
    </div>
    <div class="bottom-btn">
      <van-button type="info" @click="gootherPage">
        发布{{ buttonName }}信息
      </van-button>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import {
  tripListCars,
  tripListPerson,
  getCarOwnerInfo,
  getPassengerInfo,
  current,
  personInfo,
} from "@/services/index";
import { setToken } from '@/utils/auth.js'

export default {
  name: "routeList",
  data() {
    return {
      showcarEmpty: true,
      showperEmpty: true,
      showLoading: false,
      buttonName: "乘客",
      activeTab: 0, // tabs激活项
      cardataList: [],
      perdataList: [],
      refcarLoading: true,
      refperLoading: true,
      carlistLoading: false,
      carfinished: false,
      perfinished: false,
      perlistLoading: false,
      pageInittype: "",
      carstartPage: 1,
      perstartPage: 1,
      carTotal: 0,
      perTotal: 0,

      sassUserId: null,
    };
  },
  watch: {
    cardataList: {
      handler(val, oldVal) {
        if (val.length === 0) {
          this.showcarEmpty = true;
        } else {
          this.showcarEmpty = false;
        }
      },
      deep: true,
      immediate: true,
    },
    perdataList: {
      handler(val, oldVal) {
        if (val.length === 0) {
          this.showperEmpty = true;
        } else {
          this.showperEmpty = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    // 挂载前 我需要开始请求sass拿到基本信息
    if (!this.sassUserId) {
      await this.getCurrent();
    }

    // 默认是tab第一页，找车主
    this.pageInittype = this.$route.query.type || "car";
    if (this.pageInittype === "person") {
      this.activeTab = 1;
    }
    // 获取列表信息
    this.getListdata();
  },

  methods: {
    stopBubbling() {},
    goDetails(item) {
      if (this.activeTab === 0) {
        item.genderName = item.driverGender === 0 ? "男" : "女";
      } else if (this.activeTab === 1) {
        item.genderName = item.userGender === 0 ? "男" : "女";
      }
      this.$router.push({
        path: "/routeDetails",
        name: "routeDetails",
        query: {
          ...item,
        },
      });
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
    gootherPage() {
      if (this.activeTab === 0) {
        getPassengerInfo()
          .then((res) => {
            if (res?.data) {
              this.goInfopage();
            } else {
              this.goPerfectpage();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        getCarOwnerInfo()
          .then((res) => {
            if (res?.data) {
              this.goInfopage();
            } else {
              this.goPerfectpage();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    goPerfectpage() {
      const type = this.activeTab === 0 ? "passenger" : "carOwner";
      this.$router.push({
        path: "/toPerfectTip",
        name: "toPerfectTip",
        query: { type },
      });
    },
    goInfopage() {
      const type = this.activeTab === 0 ? "passenger" : "carOwner";
      this.$router.push({
        path: "/routeInfo",
        name: "routeInfo",
        query: { type },
      });
    },
    clearPage() {
      this.perfinished = false;
      this.carfinished = false;
      this.carstartPage = 1;
      this.perstartPage = 1;
    },
    onClick(name, title) {
      this.clearPage();
      if (this.activeTab === 0) {
        this.getCardata();
        this.buttonName = "乘客";
      } else if (this.activeTab === 1) {
        this.getPerdata();
        this.buttonName = "车主";
      }
    },
    caronRefresh() {
      this.getCardata(1);
    },
    peronRefresh() {
      this.getPerdata(1);
    },
    carReloadList() {
      if (this.carfinished) return;
      if (this.carTotal <= this.cardataList.length) {
        this.carfinished = true;
        this.carlistLoading = false;
      } else {
        this.carfinished = false;
        this.carlistLoading = true;
        this.carstartPage = this.carstartPage + 1;
        this.regetCardata();
      }
    },
    perReloadList() {
      if (this.perfinished) return;
      if (this.perTotal <= this.perdataList.length) {
        this.perfinished = true;
        this.perlistLoading = false;
      } else {
        this.perfinished = false;
        this.perlistLoading = true;
        this.perstartPage = this.perstartPage + 1;
        this.regetPerdata();
      }
    },
    getListdata() {
      if (this.pageInittype === "car") {
        this.getCardata();
      } else if (this.pageInittype === "person") {
        this.getPerdata();
      }
    },
    regetCardata() {
      this.showLoading = true;
      tripListCars({ pageSize: 10, startPage: this.carstartPage })
        .then((res) => {
          if (res?.data) {
            res.data.list.map((ele) => {
              const end = ele.driverGender === 0 ? "先生" : "女士";
              ele.showName = ele.driverName.substr(0, 1) + end;
              ele.showStarttime = this.clockTime(ele.startTime);
              ele.showEndtime = this.clockTime(ele.endTime);
              ele.showPubt = this.$moment(ele.publishTime).fromNow(true);
              return ele;
            });
            this.cardataList.push(...res.data.list);
            this.carlistLoading = false;
            this.showLoading = false;
          }
        })
        .catch((err) => {
          console.log(111, err);
          this.showLoading = false;
          this.carlistLoading = false;
          this.cardataList = [];
        });
    },
    regetPerdata() {
      this.showLoading = true;
      tripListPerson({ pageSize: 10, startPage: this.perstartPage })
        .then((res) => {
          if (res?.data) {
            res.data.list.map((ele) => {
              const end = ele.userGender === 0 ? "先生" : "女士";
              ele.showName = ele.userName.substr(0, 1) + end;
              ele.showStarttime = this.clockTime(ele.startTime);
              ele.showEndtime = this.clockTime(ele.endTime);
              ele.showPubt = this.$moment(ele.publishTime).fromNow(true);
              return ele;
            });
            this.perdataList.push(...res.data.list);
            this.perlistLoading = false;
            this.showLoading = false;
          }
        })
        .catch((err) => {
          console.log(111, err);
          this.showLoading = false;
          this.perlistLoading = false;
          this.perdataList = [];
        });
    },
    getCardata(refresh) {
      this.showLoading = true;
      tripListCars({ pageSize: 10, startPage: 1 })
        .then((res) => {
          if (res?.data) {
            this.carTotal = res.data.total;
            this.cardataList = res.data.list.map((ele) => {
              const end = ele.driverGender === 0 ? "先生" : "女士";
              ele.showName = ele.driverName.substr(0, 1) + end;
              ele.showStarttime = this.clockTime(ele.startTime);
              ele.showEndtime = this.clockTime(ele.endTime);
              ele.showPubt = this.$moment(ele.publishTime).fromNow(true);
              return ele;
            });
            this.showLoading = false;
            if (refresh && refresh === 1) {
              Toast("刷新成功");
              this.refcarLoading = false;
            }
          }
        })
        .catch((err) => {
          console.log(111, err);
          this.showLoading = false;
          this.cardataList = [];
          if (refresh && refresh === 1) {
            this.refcarLoading = false;
          }
        });
    },
    getPerdata(refresh) {
      this.showLoading = true;
      tripListPerson({ pageSize: 10, startPage: 1 })
        .then((res) => {
          if (res?.data) {
            this.perTotal = res.data.total;
            this.perdataList = res.data.list.map((ele) => {
              const end = ele.userGender === 0 ? "先生" : "女士";
              ele.showName = ele.userName.substr(0, 1) + end;
              ele.showStarttime = this.clockTime(ele.startTime);
              ele.showEndtime = this.clockTime(ele.endTime);
              ele.showPubt = this.$moment(ele.publishTime).fromNow(true);
              return ele;
            });
            this.showLoading = false;
            if (refresh && refresh === 1) {
              Toast("刷新成功");
              this.refperLoading = false;
            }
          }
        })
        .catch((err) => {
          console.log(111, err);
          this.showLoading = false;
          this.perdataList = [];
          if (refresh && refresh === 1) {
            this.refperLoading = false;
          }
        });
    },
    async getCurrent() {
      this.showLoading = true;
      try {
        const currentUserInfo = await current({})
        this.sassUserId = currentUserInfo.id
        if (currentUserInfo.aesPhone) {
          // eslint-disable-next-line no-undef
          currentUserInfo.truePhone = hx.decryptData(currentUserInfo.aesPhone);
          // 基于历史原因，使用saas的手机号，代替loginPhone
          // setToken(currentUserInfo.truePhone)
        }
        setToken(currentUserInfo.username)
        const personInfoData = await personInfo({ id: currentUserInfo.personId })
        currentUserInfo.sex = personInfoData.data.sex;
        currentUserInfo.sexName = currentUserInfo.sex === 0 ? "女" : "男";
        console.log('currentUserInfo', currentUserInfo)
        this.$store.commit("baseInfo/mutations_base_data", currentUserInfo);
      } catch {
        this.showLoading = false;
      }
      this.showLoading = false;
    }
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
    height: calc(100vh - 44px);
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
          height: 80px;
          line-height: 80px;
          text-align: center;
          background-color: #fafafa;
        }
        .item-right {
          flex: 1;
          height: 80px;
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
        }
      }
    }
  }
  .bottom-btn {
    width: 100%;
    height: 43px;
    position: absolute;
    bottom: 0;
    left: 0;
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
