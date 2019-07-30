<template>
  <div>
    <section>
      <navigation-bar :title="videoTitle" :navBackgroundColor="'#434343'" :back-visible="true"></navigation-bar>
    </section>
    <ul class="uls">
      <scroll-view
        scroll-y
        style="height: 100vh;"
        @scrolltoupper="upper"
        @scrolltolower="lower"
        @scroll="scroll"
      >
        <li
          v-for="(item,index) in moreArr"
          :key="index"
          class="lis"
          :class="{'dynamicBefor':videoTitle == '全部动态','appointmentBefor':videoTitle == '全部预约','serviceBefor':videoTitle == '全部服务'}"
        >
          <span class="title" v-if="videoTitle == '全部动态'">{{item.send_time}} {{item.content}}</span>
          <span class="title" v-if="videoTitle == '全部预约'">xxxx</span>
          <span
            class="title"
            v-if="videoTitle == '全部服务'"
          >合同号：{{item.long_contract_number}} 客户：{{item.client_name}} 办案：{{item.case_handler}}</span>
          <span
            class="btn"
            @click="look(item)"
            :class="{'dynamic':videoTitle == '全部动态','appointment':videoTitle == '全部预约','service':videoTitle == '全部服务'}"
          >查看详情</span>
        </li>
      </scroll-view>
    </ul>
  </div>
</template>
<script>
import navigationBar from "../../components/navigationBar";
export default {
  data() {
    return {
      videoTitle: "元甲服务小程序",
      userInfo: null,
      toView: "red",
      scrollTop: 100,
      page: 1,
      moreArr: []
    };
  },
  components: { navigationBar },
  onLoad(option) {
    if (option.type == 1) {
      this.videoTitle = "全部动态";
    } else if (option.type == 2) {
      this.videoTitle = "全部预约";
    } else {
      this.videoTitle = "全部服务";
    }
  },
  mounted() {
    this.page = 1;
    this.init();
  },
  methods: {
    init(page = 1) {
      if (this.videoTitle == "全部动态") this.initDyn(page);
      else if (this.videoTitle == "全部预约") {
      } else this.initSer(page);
    },
    upper: function(e) {},
    lower: function(e) {
      let count = Math.ceil(this.count / 15);
      this.page++;
      if (this.page <= count) {
        this.init(this.page);
      } else return;
    },
    scroll: function(e) {},
    async initDyn(page = 1) {
      const res = await this.axios.get({
        url: "/msg/message_center/",
        data: { unionid: wx.getStorageSync("unionid"), page: page }
      });
      if (res.code == 0) {
        this.count = res.data.count;
        this.moreArr = res.data.results.concat(this.moreArr);
      }
    },
    async initSer(page = 1) {
      const res = await this.axios.get({
        url: "/trans/service/",
        data: { wx_unionid: wx.getStorageSync("unionid"), page: page }
      });

      if (res.code == 0) {
        this.moreArr = res.data.results;
        this.count = res.data.count;
      }
    },
    look(item) {
      if (this.videoTitle == "全部动态") {
        wx.navigateTo({
          url: `../newDetails/main?uuid=${item.msg_uuid}&type=1`
        });
      } else if (this.videoTitle == "全部预约") {
        wx.navigateTo({
          url: "../mackInformation/main"
        });
      } else {
        wx.navigateTo({
          url: `../newDetails/main?uuid=${item.i_code}&type=2`
        });
      }
    }
  }
};
</script>
<style scoped="scoped">
.uls {
  background: rgb(245, 245, 245);
  height: 100vh;
}
.lis {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 35rpx 30rpx;
  box-sizing: border-box;
  margin-bottom: 10rpx;
  background: white;
}
.title {
  font-size: 28rpx;
  font-weight: 400;
  width: 80%;
  color: #b8b8b8;
}
.btn {
  display: block;
  width: 100rpx;
  height: 35rpx;
  border-radius: 4rpx;
  text-align: center;
  line-height: 35rpx;
  font-size: 20rpx;
  color: white;
}
.dynamic {
  background: #fd657e;
}
.appointment {
  background: #64c8cf;
}
.service {
  background: #ffb13f;
}
.dynamicBefor::before {
  content: "";
  width: 10rpx;
  height: 10rpx;
  background: #fd657e;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 10rpx;
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
  left: 10rpx;
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
  left: 10rpx;
  transform: translateY(-50%);
}
</style>

