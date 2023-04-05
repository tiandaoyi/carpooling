import { Toast } from "vant";
import { savePassengerInfo, saveCarOwnerInfo } from "@/services/index";
import { getToken } from "@/utils/auth";
export default {
  props: {
    toSave: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Number,
    },
  },
  data() {
    return {
      showLoading: false,
      userGenderEnums: [
        {
          text: "男",
          value: 0,
        },
        {
          text: "女",
          value: 1,
        },
      ],
      driverGenderText: "",
    };
  },
  watch: {
    toSave: {
      handler(val) {
        if (val) {
          this.validate();
        }
      },
    },
  },
  methods: {
    validate() {
      const { type = "" } = this.$route.query;
      if (this.componentKey === this.active) {
        this.$refs[`form${this.active}`]
          .validate()
          .then((res) => {



            if (this.active === 0 && this.checkPhone(this.myInfo.phone)) {
              // if (getToken() !== this.myInfo.phone) {
              //   this.$Toast.fail('乘客电话必须与saas个人手机号一致')
              //   return
              // }
              const request = {
                ...this.myInfo,
              };
              delete request.id;
              savePassengerInfo(request).then(() => {
                Toast.success("提交成功");
                this.jumpPage(type);
              });
            } else if (
              this.active === 1 &&
              this.checkPhone(this.myInfo.driverPhone)
            ) {
              // if (getToken() !== this.myInfo.driverPhone) {
              //   this.$Toast.fail('车主电话必须与saas个人手机号一致')
              //   return
              // }
              const request = {
                ...this.myInfo,
              };
              delete request.id;
              saveCarOwnerInfo(request).then(() => {
                Toast.success("提交成功");
                this.jumpPage(type);
              });
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            if (type) {
              this.$parent.toSave = false;
            } else {
              this.$parent.$parent.$parent.$parent.toSave = false;
            }
          });
      }
    },
    checkPhone(phone) {
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        Toast("手机号码不合法，请重新输入");
        return false;
      } else {
        return true;
      }
    },
    jumpPage(type) {
      if (type) {
        // 跳转发布信息页面
        this.$router.push({
          name: "routeInfo",
          query: {
            type,
          },
        });
      }
    },
  },
};
