<template>
  <div>
    <section>
      <navigation-bar :title="videoTitle" :navBackgroundColor="'#434343'" :back-visible="true"></navigation-bar>
    </section>
    <section class="box">
      <ul class="boxInfo">
        <li class="infoLis">
          <span class="title">预约时间：</span>
          <span class="content">2019年6月24日 下午3:00</span>
        </li>
        <li class="infoLis">
          <span class="title">邀约人：</span>
          <span class="content">张嘉娱</span>
        </li>
        <li class="infoLis">
          <span class="title">备注事项：</span>
          <span class="content">
            案件材料需要补充，请携带
            相关材料前往律所并提交给
            律师
          </span>
        </li>
        <li class="infoLis">
          <span class="title">地点：</span>
          <span class="content">
            北京市东三环建外SOHO东
            区B座0703
          </span>
        </li>
      </ul>
      <div class="boxMap" id="boxMap">
        <map
          id="map"
          longitude="116.4593940000"
          latitude="39.9056990000"
          scale="17"
          bindcontroltap="controltap"
          :markers="markers"
          @markertap="markertap"
          :polyline="polyline"
          @regionchange="regionchange"
          show-location
          style="width: 100%; height: 100%;"
        ></map>
      </div>
      <p class="footerTitle">路线指示：地铁10号线，国贸站，C口出</p>
    </section>
  </div>
</template>
<script>
import navigationBar from "../../components/navigationBar";

export default {
  data() {
    return {
      videoTitle: "预约信息",
      start: "39.8932800000,116.6464200000",
      dest: "39.905699,116.459394",
      from: {
        latitude: "39.8932800000",
        longitude: "116.6464200000"
      },
      to: {
        latitude: 39.905699,
        longitude: 116.459394
      },
      markers: [
        //坐标地点
        {
          iconPath: "../../../static/images/map.png",
          id: 0,
          latitude: 39.905699,
          longitude: 116.459394,
          width: 16,
          height: 16
        }
      ],
      polyline: [
        //路线吗
        {
          points: [
            {
              longitude: wx.setStorageSync("longitude"), //开始地点
              latitude: wx.setStorageSync("latitude")
            },
            {
              longitude: 116.459394, //终点
              latitude: 39.905699
            }
          ],
          color: "#FF0000DD",
          width: 3,
          dottedLine: true
        }
      ]
      // controls: [
      //   {
      //     id: 1,
      //     iconPath: "../../../static/images/map.png",
      //     position: {
      //       left: 0,
      //       top: 300 - 50,
      //       width: 50,
      //       height: 50
      //     },
      //     clickable: true
      //   }
      // ]
    };
  },
  components: { navigationBar },
  methods: {
    formSubmit(e) {
      wx.request({
        url: `https://apis.map.qq.com/ws/direction/v1/transit/?from=${
          this.start
        }&to=${
          this.dest
        }&key=SPFBZ-FOCWK-N5PJC-A4246-VAYO5-QSBHQ&output=json&callback=cb`,
        header: {
          "content-type": "application/json" // 默认值
        },
        success: res => {
          console.log(res.data);
        }
      });
    },
    regionchange(e) {
      console.log(e);
    },
    markertap(e) {
      console.log(e, e.mp.markerId);
    },
    controltap(e) {
      console.log(e.controlId);
    }
  }
};
</script>
<style scoped="scoped">
.box {
  padding: 60rpx 30rpx;
  box-sizing: border-box;
}
.boxInfo {
  margin-bottom: 57rpx;
}
.infoLis {
  position: relative;
  display: flex;
  margin-bottom: 45rpx;
}
.title {
  display: block;
  width: 150rpx;
  line-height: 50rpx;
  color: #fd657e;
  font-size: 30rpx;
  font-weight: 400;
  text-align: right;
  margin-right: 28rpx;
}
.content {
  display: block;
  width: 370rpx;
  color: #222222;
  font-size: 30rpx;
  font-weight: 400;
  line-height: 50rpx;
}
.boxMap {
  height: 350rpx;
}
.footerTitle {
  color: #b8b8b8;
  font-size: 24rpx;
  text-align: center;
  font-weight: 400;
  margin-top: 57rpx;
}
</style>

