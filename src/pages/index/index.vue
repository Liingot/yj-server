<template>
  <div>
    <section class="sec-nav">
      <navigation-bar :title="videoTitle" :navBackgroundColor="'#434343'" :back-visible="false"></navigation-bar>
    </section>
    <div class="box" :class="progressive.length ? 'box' : 'white'">
      <swiper
        class="cont"
        v-if="progressive.length "
        :duration="duration"
        :previous-margin="'85rpx'"
        :next-margin="'85rpx'"
        @change="switchItem($event)"
        :current="currentTab"
        skip-hidden-item-layout="true"
      >
        <div v-for="(item,index) in progressive" :key="index">
          <swiper-item>
            <div
              :style="{
                        transform: currentTab===index?'scale(1)':'scale(.8)',
                        transitionDuration: '.3s',
                        transitionTimingFunction: 'ease',
                        background: 'white',
                    }"
            >
              <div class="information" v-if="item.information">
                <div class="information_left">
                  <img
                    :src="item.information.avatar + '?x-oss-process=image/resize,m_lfit,h_100,w_100'"
                    @click="previewImage(item.information.avatar)"
                    alt
                    v-if="item.information"
                  />
                </div>
                <div class="information_right" v-if="item.information">
                  <p>
                    {{item.information.name}}
                    <span v-if="item.information.position">|</span>
                    {{item.information.position ? item.information.position : ""}}
                  </p>
                  <p>{{item.information.company}}</p>
                  <p @click="makePhoneCall(item.information.phone)">
                    手机：
                    <span class="link">{{item.information.phone}}</span>
                  </p>
                  <p>地址：{{item.information.address}}</p>
                </div>
              </div>
              <p v-else class="waiting">等待分配跟案律师</p>
              <div class="content">
                <div class="text">
                  <p class="ps">合同号：{{item.long_contract_number}}</p>
                  <p class="ps">委托人：{{item.client_name}}</p>
                </div>
                <van-steps
                  :steps="item.progress"
                  :active="item.active.length - 1"
                  direction="vertical"
                  active-color="#FD657E"
                />
              </div>
            </div>
          </swiper-item>
        </div>
      </swiper>
      <h3 v-if="!progressive.length && isHide" class="h3">{{msg}}</h3>
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
      videoTitle: "元甲服务小程序"
    };
  },
  components: { navigationBar },
  onLoad(options) {
    // wx.showShareMenu({
    //   withShareTicket: true
    // });
    this.login();
  },
  onShow() {
    this.imgUrls = [];
    this.pro();
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
    pro() {
      //案件进度
      this.axios
        .get({
          url: "/trans/case/progress/",
          data: { unionid: wx.getStorageSync("unionid") }
        })
        .then(res => {
          if (res.code == 0) {
            this.progressive = res.data;
            this.progressive.forEach((item, index) => {
              if (wx.getStorageSync("long_contract_number")) {
                if (
                  item.long_contract_number ==
                  wx.getStorageSync("long_contract_number")
                ) {
                  this.currentTab = index;
                }
              }
              this.information(item, v => {
                this.$set(item, "information", v);
                this.imgUrls.push(v.avatar);
              });
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
  // "miniprogram": {
  // 		"current": 0,
  // 		"list": [
  // 			{
  // 				"id": 0,
  // 				"name": "测试",
  // 				"pathName": "pages/index/main",
  // 				"query": "long_contract_number=(京)交-11386",
  // 				"scene": 1043,
  // 				"referrerInfo": {
  // 					"appId": "wxd3e93a89eab59d7b"
  // 				}
  // 			}
  // 		]
  // 	}
};
</script>

<style scoped="scoped">
.box {
  padding: 20px 0;
  box-sizing: border-box;
  background: #f2f6fc;
}
.white {
  background: white;
}
.cont {
  width: 100%;
  height: 100vh;
}
.cont swiper-item {
  width: auto;
  height: 100%;
  font-size: 50rpx;
  box-sizing: border-box;
}
.information {
  width: 100%;
  height: 20vh;
  display: flex;
  padding: 10px;
  box-sizing: border-box;
}
.content {
  width: 100%;
  min-height: 75vh;
  padding-top: 30px;
  box-sizing: border-box;
}
.information_left {
  width: 100px;
  height: 100%;
  margin-right: 10px;
}
.information_left > img {
  width: 100%;
  height: 100%;
}
.information_right > p {
  font-size: 14px;
  color: #666;
  line-height: 20px;
}
.h3 {
  text-align: center;
  margin-top: 100px;
  font-size: 18px;
}
.link {
  color: #409eff !important;
  cursor: pointer;
}
.text {
  padding-left: 15px;
  box-sizing: border-box;
}
.ps {
  font-size: 14px;
}
.waiting {
  text-align: center;
  font-size: 14px;
  line-height: 50px;
}
</style>
<style lang="scss" scoped>
// .sec-nav {
//   position: fixed;
//   left: 0;
//   top: 0;
//   z-index: 999;
// }
// .sec-content {
//   width: 100vw;
//   height: 100vh;
//   video {
//     width: 100%;
//     height: 100%;
//     // object-fit: cover;
//   }
// }
</style>

