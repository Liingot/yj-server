<template>
  <div class="autho">
    <section class="logoBox">
      <div class="logo">
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTIwNjA2MzA0MTIyMTFFODg1Q0I4REY4NEYwMDM3MEIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTIwNjA2MzE0MTIyMTFFODg1Q0I4REY4NEYwMDM3MEIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBMjA2MDYyRTQxMjIxMUU4ODVDQjhERjg0RjAwMzcwQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBMjA2MDYyRjQxMjIxMUU4ODVDQjhERjg0RjAwMzcwQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoIowO4AAAZPSURBVHja7FpZcxtF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"
          alt
        />
      </div>
      <h3 class="h3">元甲服务</h3>
      <p class="text">为确保服务安全，请在登录后查看</p>
    </section>
    <button open-type="getUserInfo" class="btn" @getuserinfo="bindGetUserInfo">确认登录</button>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  onLoad() {
    this.login();
  },
  methods: {
    bindGetUserInfo(e) {
      if (e.mp.detail.rawData) {
        // 用户点击授权;
        wx.login({
          //获取到code然后获取openid和sess_key
          success: res => {
            if (res.code) {
              this.axios
                .get({
                  url: `/account/get_wx_unionid/`,
                  data: { code: res.code }
                })
                .then(res => {
                  if (res.code == 0) {
                    wx.setStorageSync("unionid", res.data.unionid);
                    wx.reLaunch({
                      url: "../subject/main"
                    });
                  }
                });
            } else {
              console.log("登录失败！" + res.errMsg);
            }
          }
        });
      } else {
        //用户拒绝授权
        this.showModal(
          "警告",
          "您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!"
        );
      }
    },
    showModal(title, content) {
      wx.showModal({
        title: title,
        content: content,
        showCancel: false,
        confirmText: "返回授权",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击了“返回授权”");
          }
        }
      });
    },
    login() {
      wx.checkSession({
        success(res) {
          wx.reLaunch({
            url: "../subject/main" //跳转到首页
          });
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          wx.login(); //重新登录
        }
      });
    }
  }
};
</script>
<style scoped="scoped">
.autho {
  padding: 50px 10px;
  box-sizing: border-box;
}
.logo {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  border-radius: 5px;
}
.logo > img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.h3 {
  text-align: center;
  margin-top: 20px;
  font-size: 25px;
}
.text {
  text-align: center;
  font-size: 15px;
  color: #ccc;
  margin-top: 15px;
}
.btn {
  background: rgba(9, 187, 7, 1);
  text-align: center;
  color: white;
  margin-top: 30px;
}
</style>
