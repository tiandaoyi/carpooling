<template>
  <div class="search-main">
    <!-- <div class="search-top">
      <van-icon name="arrow-left" @click="toAddress" />
      <span>详细地址</span>
    </div> -->
    <div class="search-content">
      <!-- <van-icon name="revoke" @click="toBack" /> -->
      <van-search
        v-model="keys"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        id="suggestId"
        v-if="!isCheckModel"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
      <van-field
        v-if="isCheckModel"
        v-model="keys"
        id="suggestId"
      >
      </van-field>
    </div>
    <div class="search-center">
      <div id="container"></div>
      <van-radio-group v-model="radio" class="content" v-if="list.length > 0">
        <ul class="list">
          <li
            v-for="(item, index) in list"
            :key="index"
            @click="changeItem(item)"
          >
            <span
              ><van-radio :name="item.key" icon-size="16px"></van-radio>
            </span>
            <p class="list-right">
              <span class="title">{{ item.title }}</span
              ><br />
              <span class="specific">{{ item.address }}</span>
            </p>
          </li>
        </ul>
      </van-radio-group>
      <van-radio-group
        v-model="radio"
        class="content"
        v-if="listLocation.address && isOldLatLng == false"
      >
        <ul class="list">
          <li @click="changeItemLocation(listLocation)">
            <span><van-radio name="1" icon-size="16px"></van-radio> </span>
            <p class="list-right">
              <span class="specific">{{ listLocation.address }}</span>
            </p>
          </li>
        </ul>
      </van-radio-group>
      <van-radio-group
        v-model="radio"
        class="content"
        v-else-if="isOldLatLng && initLatLng.longitude && initLatLng.latitude"
      >
        <ul class="list" v-if="isMove">
          <li @click="changeItemLocation(listLocation)">
            <span><van-radio name="1" icon-size="16px"></van-radio> </span>
            <p class="list-right">
              <span class="specific">{{ listLocation.address }}</span>
            </p>
          </li>
        </ul>
        <ul class="list list-btn-content" v-else>
          <li
            @click="changeItemLocation(listLocation)"
            v-if="initLatLng.isFrom"
          >
            <span><van-radio name="1" icon-size="16px"></van-radio> </span>
            <p class="list-right">
              <span class="specific">{{ initLatLng.address }}</span>
            </p>
          </li>
          <li @click="changeItemOld()" v-else>
            <span><van-radio name="1" icon-size="16px"></van-radio> </span>
            <p class="list-right">
              <span class="specific">上海市</span>
            </p>
          </li>
        </ul>
        <div class="search-btn" v-if="isPosition == false">
          <van-button plain hairline type="info" class="cancel" @click="cancel"
            >取消</van-button
          >
          <van-button
            plain
            hairline
            type="info"
            class="confirm"
            @click="confirm"
            >确定</van-button
          >
        </div>
      </van-radio-group>
      <van-button
        v-if="initLatLng.longitude && initLatLng.latitude && isPosition"
        type="info"
        icon="location-o"
        class="ponit-address"
        size="mini"
        @click="selectSite"
        >手工选址</van-button
      >
    </div>
  </div>
</template>
<script>
// import { toFixed, reversePoints } from "@/utils/public";
// import { mapState, mapActions } from "vuex";
// import { searchCode, queryAllDistricts } from "@/http/index";
import { Toast } from "vant";
export default {
  data() {
    return {
      keys: "",
      list: [],
      radio: "",
      getMap: "",
      address_detail: null, // 详细地址
      userlocation: { lng: "", lat: "" },
      map: null,
      listLocation: {
        address: "",
      }, // 手工定位
      isLocation: false,
      getAreaList: [],
      initLatLng: {},
      isOldLatLng: false, // 是否手工选址
      isMove: false, // 是否移动了地图
      isPosition: true, // 点了手工定位之后显示取消确定按钮
      isCheckModel: false,
    };
  },

  mounted() {
    // this.queryAllDistricts();
    const { lat, lng, address  } = this.$route.query
    if (lat && lng) {
      this.isCheckModel = true
      // eslint-disable-next-line no-undef
      this.map = new BMap.Map("container");
      this.keys = address
      // eslint-disable-next-line no-undef
      this.map.centerAndZoom(new BMap.Point(+lng, +lat), 11);
      // eslint-disable-next-line no-undef
      this.map.addOverlay(new BMap.Marker({lng, lat}));
    } else {
      this.isCheckModel = false
      this.initMap();
    }

  },
  methods: {
    toBack() {
      this.$router.go(-1);
    },
    // ...mapActions("demand", ["actions_detial_address_from"]),
    onSearch() {
      if (!this.keys) {
        return false;
      }
      this.listLocation = {};
      this.isMove = false;
      this.initLatLng = {};
      const that = this;
      that.isLocation = false;
      that.isOldLatLng = false;
      that.radio = "";
      // eslint-disable-next-line no-var
      // eslint-disable-next-line no-undef
      var local = new BMap.LocalSearch(this.map, {
        // 智能搜索
        onSearchComplete: function (results) {
          // eslint-disable-next-line no-undef
          if (local.getStatus() === BMAP_STATUS_SUCCESS) {
            const s = [];
            for (let i = 0; i < results.getCurrentNumPois(); i++) {
              s.push(results.getPoi(i));
            }
            const pp = local.getResults().getPoi(0).point; // 获取第一个智能搜索的结果
            that.list = s;
            if (that.list.length > 0) {
              // eslint-disable-next-line array-callback-return
              that.list.map((item, index) => {
                item.key = index;
              });
            }
            that.initLatLng.latitude = that.list[0].point.lat;
            that.initLatLng.longitude = that.list[0].point.lng;
            that.initLatLng.address = that.list[0].title;
            that.initLatLng.isFrom = true;

            that.map.centerAndZoom(pp, 18);
            that.map.clearOverlays();
            // eslint-disable-next-line no-undef
            that.map.addOverlay(new BMap.Marker(pp)); // 添加标注
          }
        },
      });

      local.search(that.keys);
    },
    // queryAllDistricts() {
    //   queryAllDistricts().then((res) => {
    //     if (res.data.length > 0) {
    //       this.getAreaList = res.data;
    //     }
    //   });
    // },
    changeItem(item) {
      const { type = "", addressType = "" } = this.$route.query;
      let parms = { type, [addressType]: item.address, from: "detialAddress" };
      if (addressType === "startAddress") {
        parms.departLongitude = item.point.lng;
        parms.departLatitude = item.point.lat;
      } else if (addressType === "endAddress") {
        parms.arriveLongitude = item.point.lng;
        parms.arriveLatitude = item.point.lat;
      }
      this.$router.push({
        name: "routeInfo",
        query: parms,
      });
      // let gc = new BMap.Geocoder();
      // gc.getLocation(item.point, (rs) => {
      //   this.searchCode(rs, item);
      // });
    },
    changeItemLocation(item) {
      console.log(item);
      if (item.address) {
        const { type = "", addressType = "" } = this.$route.query;
        let parms = {
          type,
          [addressType]: item.address,
          from: "detialAddress",
        };
        if (addressType === "startAddress") {
          parms.departLongitude = item.point.lng;
          parms.departLatitude = item.point.lat;
        } else if (addressType === "endAddress") {
          parms.arriveLongitude = item.point.lng;
          parms.arriveLatitude = item.point.lat;
        }
        this.$router.push({
          name: "routeInfo",
          query: parms,
        });
        // this.searchCode(item, { title: item.address });
      } else {
        Toast("请您重新选择地址");
      }
    },
    initMap() {
      // eslint-disable-next-line no-undef
      this.map = new BMap.Map("container");
      const { initAddress = {}, addressType = "" } = this.$route.query;
      if (initAddress[addressType]) {
        this.keys = initAddress[addressType];
        this.onSearch();
      }
      const getInitAddress = { latitude: 31.231706, longitude: 121.472644 };
      if (getInitAddress.latitude && getInitAddress.longitude) {
        this.map.centerAndZoom(
          // eslint-disable-next-line no-undef
          new BMap.Point(getInitAddress.longitude, getInitAddress.latitude),
          11
        );
        // eslint-disable-next-line no-undef
        const mk = new BMap.Marker({
          lng: getInitAddress.longitude,
          lat: getInitAddress.latitude,
        });
        this.map.clearOverlays();
        this.map.addOverlay(mk);
        this.initLatLng = getInitAddress;
      } else {
        // eslint-disable-next-line no-undef
        this.map.centerAndZoom(new BMap.Point(121.472644, 31.231706), 11);
      }
    },
    toAddress() {
      this.$router.push("/address");
    },
    searchCode(rs, item) {
      if (this.getAreaList?.length > 0) {
        let getData = [];
        this.getAreaList.forEach((provinceItem) => {
          if (rs.addressComponents.province === provinceItem.name) {
            getData = [provinceItem];
          } else if (
            rs.addressComponents.province === "澳门" &&
            provinceItem.name === "澳门特别行政区"
          ) {
            getData = [provinceItem];
          } else if (
            rs.addressComponents.province === "香港" &&
            provinceItem.name === "香港特别行政区"
          ) {
            getData = [provinceItem];
          }
        });
        const provinceName = rs.addressComponents.province;
        let cityName = "";
        let districtName = "";
        const provinceCode = getData[0].code;
        const cityData = getData[0].subList;
        let cityCode = "";
        let districtCode = "";
        if (rs.addressComponents.city) {
          const cityObj = cityData?.find((item) => {
            return (
              item.name.substring(0, 2) ===
              rs.addressComponents.city.substring(0, 2)
            );
          });
          if (cityObj) {
            cityCode = cityObj.code;
            cityName = cityObj.name;

            const districObj = cityObj?.subList?.find((item) => {
              return item.name === rs.addressComponents.district;
            });
            if (districObj) {
              districtCode = districObj.code;
              districtName = districObj.name;
            }
          }
        }

        const getAddress = {
          province: provinceName,
          city: cityName,
          district: districtName,
          provinceCode: provinceCode,
          cityCode: cityCode,
          districtCode: districtCode,
          latitude: rs.point.lat,
          longitude: rs.point.lng,
          type: this.$route.query.type,
          address: item.title,
          isTransfer: false,
        };
        this.actions_detial_address_from(getAddress);
        this.$router.push({
          name: "address",
          query: { from: "detialAddress" },
        });
      }
    },
    location() {
      const that = this;
      that.isLocation = true;
      that.isOldLatLng = false;
      that.isPosition = true;
      that.list = [];
      that.keys = "";
      const offsetY = 10;
      // eslint-disable-next-line no-undef
      const geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function (r) {
        // eslint-disable-next-line no-undef
        if (this.getStatus() === BMAP_STATUS_SUCCESS) {
          // eslint-disable-next-line no-undef
          const mk = new BMap.Marker(r.point);
          that.map.clearOverlays();
          that.map.addOverlay(mk);
          // 将地图中心移动到可视区中点
          that.map.panTo(r.point);
          const centerPixel = that.map.pointToOverlayPixel(
            that.map.getCenter()
          );
          // 通过设置地图的中心点，使定位点显示在手机上部分区域
          that.map.setCenter(
            that.map.overlayPixelToPoint({
              x: centerPixel.x,
              y: centerPixel.y + offsetY,
            })
          );
          // eslint-disable-next-line no-undef
          const gc = new BMap.Geocoder();
          gc.getLocation(r.point, (rs) => {
            if (rs) {
              that.listLocation = {
                ...that.listLocation,
                ...rs,
              };
              that.initLatLng.latitude = rs.point.lat;
              that.initLatLng.longitude = rs.point.lng;
              that.initLatLng.address = rs.address;
              that.initLatLng.isFrom = true;
            }
          });
        } else {
          Toast("获取失败");
          // alert("failed" + this.getStatus());
        }
      });
    },
    selectSite() {
      // 进入手工选址模式
      const that = this;
      that.isOldLatLng = true;
      that.isPosition = false;
      that.list = [];
      const offsetY = 10;
      that.map.addEventListener("dragend", function dragendFun() {
        // 获得移动之后地图中心点的像素位置
        if (that.isOldLatLng === false || that.isPosition) {
          return false;
        }
        that.isMove = true;
        const pixel = that.map.pointToOverlayPixel(that.map.getCenter());
        // 获得定位图标所在位置在地图上的地理位置，实际上定位图标的像素位置就在地图中心像素位置相应的偏移量处
        const point = that.map.overlayPixelToPoint({
          x: pixel.x,
          y: pixel.y - offsetY,
        });
        // eslint-disable-next-line no-undef
        const mkn = new BMap.Marker(point);
        that.radio = "";
        that.map.clearOverlays();
        that.map.addOverlay(mkn);
        //  然后根据经纬度解析地址

        // eslint-disable-next-line no-undef
        const gc = new BMap.Geocoder();
        gc.getLocation(point, (rs) => {
          if (rs) {
            that.listLocation = {
              ...that.listLocation,
              ...rs,
            };
          }
        });
      });
    },
    cancel() {
      this.isOldLatLng = true;
      this.isMove = false;
      this.isPosition = true;
      // eslint-disable-next-line no-undef
      const point = new BMap.Point(
        this.initLatLng.longitude,
        this.initLatLng.latitude
      );
      // eslint-disable-next-line no-undef
      const mkn = new BMap.Marker(point);
      this.radio = "";
      this.map.clearOverlays();
      this.map.addOverlay(mkn);
      this.map.panTo(point);
      this.map.setCenter(point);
    },
    confirm() {
      this.isPosition = true;
      // if (this.isMove) {
      //   this.changeItemLocation(this.listLocation);
      // } else {
      //   this.changeItemOld();
      // }
    },
    changeItemOld() {
      const { type = "", addressType = "" } = this.$route.query;
       let parms = { type, [addressType]: "上海市", from: "detialAddress" };
      if (addressType === "startAddress") {
        parms.departLongitude = 121.472644;
        parms.departLatitude = 31.231706;
      } else if (addressType === "endAddress") {
        parms.arriveLongitude = 121.472644;
        parms.arriveLatitude = 31.231706;
      }
      
      this.$router.push({
        name: "routeInfo",
        query: parms,
      });
      // this.actions_detial_address_from(this.initLatLng);
      // this.$router.push({ name: "address", query: { from: "detialAddress" } });
    },
  },
};
</script>
<style lang="scss" scoped>
.search-main {
  background: #f5f7fa;
  .van-icon-revoke {
    position: absolute;
    color: #367ef5;
    font-size: 20px;
    top: 16px;
    left: 5px;
  }
  .search-top {
    background: linear-gradient(135deg, #367ef5 0%, #1664ff 100%);
    color: #fff;
    height: 45px;
    line-height: 45px;
    display: flex;
    align-items: center;
    font-size: 18px;
    padding: 0 10px;
    span {
      flex: 2;
    }
  }
  .search-content {
    box-shadow: 0px 0px 8px 0px rgba(60, 107, 240, 0.1);
    padding: 0 10px;
    background: #fff;
  }
  ::v-deep .van-search__content {
    background-color: #f5f7fa;
    border-radius: 100px;
  }
  ::v-deep.van-field__left-icon .van-icon,
  ::v-deep.van-field__right-icon .van-icon {
    color: #babfc9;
  }
  .van-search__action {
    color: #367ef5;
    font-weight: 500;
  }
  // .van-search {
  //   margin-left: 20px;
  // }
  .search-center {
    height: calc(100vh - 104px);
    background: #f5f7fa;
    overflow: hidden;
  }
  .content {
    position: fixed;
    bottom: 15px;
    width: 98%;
    background: #fff;
    left: 1%;
    border-radius: 6px;
    z-index: 999;
  }
  #container {
    height: 100%;
  }
  .list {
    margin: 8px 12px;
    background: #fff;
    line-height: 48px;
    font-weight: 400;
    border-radius: 6px;
    font-size: 16px;
    padding: 0 12px;
    max-height: 187.5px;

    overflow: auto;
    li {
      text-align: left;
      color: #333333;
      padding: 7.5px 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f2f2f2;
    }
    .list-right {
      line-height: 22.5px;
      padding-left: 11px;
      .title {
        color: #333333;

        font-weight: 400;
        font-size: 14px;
      }
      .specific {
        font-weight: 400;
        color: #90949e;
        font-size: 13px;
      }
    }
  }
  .ponit-position {
    position: fixed;
    top: 80px;
    right: 8px;
  }
  .ponit-address {
    position: fixed;
    top: 120px;
    // top: 80px;
    right: 8px;
  }
  .list-btn-content {
    margin: 0;
    li {
      height: 40px;
    }
  }
  .search-btn {
    display: flex;

    button {
      flex: 1;
      border: transparent;
      border-right: 1px solid #f2f3f5;
      line-height: 40px;
    }
    .cancel {
      color: #90949e;
    }
  }
}
</style>
