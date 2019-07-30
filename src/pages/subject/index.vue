<template>
  <div>
    <section>
      <navigation-bar
        :title="videoTitle"
        :navBackgroundColor="'#434343'"
        :back-visible="false"
        :homeIshide="false"
      ></navigation-bar>
    </section>
    <section class="main" v-if="isHide">
      <div class="banner">
        <div class="box" v-if="userInfo">
          <div class="acatar">
            <img :src="userInfo.avatarUrl" alt width="30" />
          </div>
          <p class="name">{{userInfo.nickName}}</p>
        </div>
      </div>
      <div>
        <section class="dynamic">
          <div class="dynamicTop">
            <div class="left">
              <div class="left_logo">
                <img src="../../../static/images/dynamic.png" alt />
              </div>
              <span class="title">最新动态</span>
            </div>
            <div class="more" @click="details(1)" v-if="dynLen> 3">
              <img src="../../../static/images/more.png" alt />
            </div>
          </div>
          <div class="dynamicBottom">
            <ul class="uls" v-if="dynLen">
              <li
                class="dynamicBefor"
                @click="listClick(1,item.msg_uuid)"
                v-for="(item,index) in dynArr"
                :key="index"
              >{{item.send_time}} {{item.content}}</li>
            </ul>
            <p class="inode" v-else>暂无数据</p>
          </div>
        </section>
        <section class="dynamic" style="margin:10px 0;">
          <div class="dynamicTop">
            <div class="left">
              <div class="left_logo">
                <img src="../../../static/images/appointment.png" alt />
              </div>
              <span class="title">我的预约</span>
            </div>
            <div class="more" @click="details(2)">
              <img src="../../../static/images/more.png" alt />
            </div>
          </div>
          <div class="dynamicBottom">
            <ul class="uls">
              <li class="appointmentBefor" @click="listClick(2)">2019年6月24 下午3:00 成功立案。</li>
              <li class="appointmentBefor">2019年6月24 下午3:00 成功立案。</li>
              <li class="appointmentBefor">2019年6月24 下午3:00 成功立案。</li>
            </ul>
          </div>
        </section>
        <section class="dynamic">
          <div class="dynamicTop">
            <div class="left">
              <div class="left_logo">
                <img src="../../../static/images/service.png" alt />
              </div>
              <span class="title">我的服务</span>
            </div>
            <div class="more" @click="details(3)" v-if="serLen > 3">
              <img src="../../../static/images/more.png" alt />
            </div>
          </div>
          <div class="dynamicBottom">
            <ul class="uls" v-if="serLen">
              <li
                class="serviceBefor"
                @click="listClick(3,item.i_code)"
                v-for="(item,index) in serArr"
                :key="index"
              >合同号：{{item.long_contract_number}} 客户：{{item.client_name}} 办案人员：{{item.case_handler}}</li>
            </ul>
            <p class="inode" v-else>暂无数据</p>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>
<script>
import navigationBar from "../../components/navigationBar";
export default {
  data() {
    return {
      videoTitle: "元甲服务小程序",
      userInfo: null,
      dynArr: [],
      dynLen: null,
      serArr: [],
      serLen: null,
      appArr: [],
      appLen: null,
      isHide: false
    };
  },
  components: { navigationBar },
  mounted() {
    this.login();
    this.infoAndMap();
    this.init();
  },
  methods: {
    init() {
      this.initDyn(); //动态
      this.initSer(); //服务
    },
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
    infoAndMap() {
      let _this = this;
      wx.getUserInfo({
        //获取头像
        success: res => {
          _this.userInfo = res.userInfo;
        },
        fail: res => {
          console.log(res, "获取用户信息失败");
        }
      });
      // wx.getLocation({
      //   //获取坐标
      //   success: res => {
      //     wx.setStorageSync("latitude", res.latitude);
      //     wx.setStorageSync("longitude", res.longitude);
      //   },
      //   fail: res => {
      //     console.log(res, "获取坐标失败");
      //   }
      // });
    },
    details(val) {
      wx.navigateTo({
        url: `../details/main?type=${val}`
      });
    },
    async initDyn() {
      const res = await this.axios.get({
        url: "/msg/message_center/",
        data: { unionid: wx.getStorageSync("unionid"), page: 1 }
      });
      if (res.code == 0) {
        this.dynArr = res.data.results.slice(0, 3);
        this.dynLen = res.data.count;
      } else if (res.code == 2) {
        wx.reLaunch({
          url: "../authorization/main" //重新授权
        });
      }
    },
    async initSer() {
      const res = await this.axios.get({
        url: "/trans/service/",
        data: { wx_unionid: wx.getStorageSync("unionid"), page: 1 }
      });

      if (res.code == 0) {
        this.serArr = res.data.results.slice(0, 3);
        this.serLen = res.data.count;
      }
    },
    listClick(val, uuid) {
      if (val == 1) {
        wx.navigateTo({
          url: `../newDetails/main?uuid=${uuid}&type=1`
        });
      } else if (val == 2) {
        wx.navigateTo({
          url: "../mackInformation/main"
        });
      } else {
        wx.navigateTo({
          url: `../newDetails/main?uuid=${uuid}&type=2`
        });
      }
    }
  }
};
</script>
<style scoped="scoped">
.banner {
  height: 400rpx;
  background: url(http://www.yuanjia101.cn/resources/img/login/index_banner.jpg)
    no-repeat;
  background-size: 100%;
  /* background: linear-gradient(
    0deg,
    rgba(255, 60, 60, 1) 0%,
    rgba(230, 0, 18, 1) 100%
  ); */
  display: flex;
  justify-content: center;
  align-items: center;
}
.main {
  background: rgb(245, 245, 245);
}
.acatar {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
}
.acatar > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.name {
  font-size: 34rpx;
  text-align: center;
  font-weight: 500;
  line-height: 100rpx;
  color: white;
}
.dynamic {
  height: 260rpx;
  background: white;
  padding: 17rpx 30rpx;
  box-sizing: border-box;
}
.dynamicTop {
  display: flex;
  justify-content: space-between;
}
.more {
  width: 20rpx;
  height: 20rpx;
}
.more > img {
  width: 100%;
  height: 100%;
}
.left {
  display: flex;
  align-items: center;
}
.left_logo {
  width: 60rpx;
  height: 60rpx;
}
.left_logo > img {
  width: 100%;
  height: 100%;
}
.title {
  margin-left: 22rpx;
  color: #222222;
  font-size: 36rpx;
  font-weight: bold;
}
.uls > li {
  position: relative;
  padding-left: 20rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  color: #b8b8b8;
  line-height: 50rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dynamicBefor::before {
  content: "";
  width: 10rpx;
  height: 10rpx;
  background: #fd657e;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
.appointmentBefor::before {
  content: "";
  width: 10rpx;
  height: 10rpx;
  background: #64c8cf;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
.serviceBefor::before {
  content: "";
  width: 10rpx;
  height: 10rpx;
  background: #ffb13f;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
.inode {
  text-align: center;
  font-size: 13px;
  color: #b8b8b8;
  line-height: 50px;
}
</style>



