<template>
  <div>
    <section class="sec-nav">
      <navigation-bar :title="videoTitle" :navBackgroundColor="'#434343'" :back-visible="true"></navigation-bar>
    </section>
    <div v-for="(item,index) in progressive" :key="index">
      <header class="header">
        <p>委托人：{{item.client_name}}</p>
        <p>合同号：{{item.long_contract_number}}</p>
      </header>
      <div class="steps">
        <van-steps
          :steps="item.progress"
          :active="item.active.length - 1"
          direction="vertical"
          active-color="#FD657E"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { transition } from "../../../dist/wx/vant/mixins/transition";
import navigationBar from "../../components/navigationBar";
export default {
  data() {
    return {
      currentTab: 0,
      duration: 300, //滑动动画时长
      active: 0,
      progressive: [],
      imgUrls: [],
      unionid: "",
      isHide: false,
      msg: "",
      navH: "",
      videoTitle: "案件进度"
    };
  },
  components: { navigationBar },
  onLoad(option) {
    this.pro(option.type == 1 ? "msg_uuid" : "case_i_code", option.uuid);
  },
  methods: {
    login() {
      let _this = this;
      wx.checkSession({
        success(res) {
          _this.isHide = true;
        },
        fail(res) {
          _this.isHide = false;
          wx.reLaunch({
            url: "../authorization/main" //重新授权
          });
        }
      });
    },
    makePhoneCall(tel) {
      //拨打电话
      wx.makePhoneCall({
        phoneNumber: tel
      });
    },
    previewImage(url) {
      //照片预览
      wx.previewImage({
        current: url,
        urls: this.imgUrls
      });
    },
    switchItem(res) {
      let oIndex = res.mp.detail.current;
      this.currentTab = oIndex;
    },
    pro(key, val) {
      //案件进度
      this.axios
        .get({
          url: `/trans/case/progress/?${key}=${val}`
        })
        .then(res => {
          if (res.code == 0) {
            this.progressive = res.data;
            this.progressive.forEach((item, index) => {
              // if (wx.getStorageSync("long_contract_number")) {
              //   if (
              //     item.long_contract_number ==
              //     wx.getStorageSync("long_contract_number")
              //   ) {
              //     this.currentTab = index;
              //   }
              // }
              // this.information(item, v => {
              //   this.$set(item, "information", v);
              //   this.imgUrls.push(v.avatar);
              // });
              this.progress(item.case_progress, v => {
                this.$set(item, "progress", v);
              });
              this.$set(item, "active", this.currently(item.progress));
            });
          } else if (res.code == 2) {
            wx.reLaunch({
              url: "../authorization/main" //重新授权
            });
          } else if (res.code == 1) {
            this.isHide = true;
            this.msg = res.msg;
          }
        });
    },
    currently(item) {
      //案件当前状态
      let currently = [];
      item.forEach((it, id) => {
        if (it.desc != "等待执行...") {
          currently.push(it);
        }
      });
      return currently;
    },
    progress(item, callback) {
      let proArr = [];
      item.forEach((it, ind) => {
        let proObj = Object.assign({});
        proObj.text = Object.keys(it).join("");
        if (Object.values(it).join(""))
          proObj.desc = Object.values(it).join("");
        else proObj.desc = "等待执行...";
        proArr.push(proObj);
      });
      callback(proArr);
    },
    information(item, callback) {
      //跟案律师的基本信息
      this.axios
        .get({
          url: "/account/calling_card/",
          data: {
            staff_id: item.case_handler_id,
            case_type_id: item.case_type_id
          }
        })
        .then(res => {
          if (res.code == 0) callback(res.data);
          else callback(null);
        });
    }
  }
};
</script>

<style scoped="scoped">
.header {
  padding: 37rpx 29rpx;
  box-sizing: border-box;
  background: #f6424f;
}
.header > p {
  font-size: 34rpx;
  color: white;
  font-weight: 600;
}
.steps {
  padding: 50rpx;
  box-sizing: border-box;
}
</style>

