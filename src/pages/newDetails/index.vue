<template>
  <div>
    <section>
      <navigation-bar :title="videoTitle" :navBackgroundColor="'#434343'" :back-visible="true"></navigation-bar>
    </section>
    <section class="box" v-if="details">
      <header class="header">
        <p>委托人：{{details[0].client_name}}</p>
        <p>合同号：{{details[0].long_contract_number}}</p>
      </header>
      <section class="current">
        <div class="current_left">
          <div class="left">
            <div class="current_left_logo">
              <img src="../../../static/images/current.png" alt />
            </div>
            <span>当前阶段</span>
          </div>
          <div class="right">{{details[0].gress.time}} {{details[0].gress.title}}</div>
        </div>
        <span class="btn" @click="lookAllow">查看全部</span>
      </section>
      <section class="project">
        <div class="projectHeader">
          <div class="project_logo">
            <img src="../../../static/images/project.png" alt />
          </div>
          <span>专案组信息</span>
        </div>
        <ul class="project_uls">
          <li v-for="(item,index) in  personnelArr" :key="index">
            <div class="projectLis_photo">
              <img :src="item.photo" alt />
            </div>
            <p class="lis_title">{{item.name}}</p>
            <p class="lis_title">{{item.position}}</p>
          </li>
        </ul>
      </section>
      <section class="project">
        <div class="projectHeader">
          <div class="project_logo">
            <img src="../../../static/images/case.png" alt />
          </div>
          <span>案件材料</span>
        </div>
        <ul class="case_uls">
          <li
            class="case_lis"
            @click="caseTem(index)"
            v-for="(item,index) in caseList"
            :key="index"
          >
            <span>{{item.title}}</span>
            <div class="rightArrowId">
              <img src="../../../static/images/rightArrowId.png" alt />
            </div>
          </li>
        </ul>
      </section>
    </section>
  </div>
</template>
<script>
import navigationBar from "../../components/navigationBar";
export default {
  data() {
    return {
      videoTitle: "最新动态",
      userInfo: null,
      details: null,
      personnelArr: [],
      informationObj: null,
      caseList: [
        { title: "合同", id: 0 },
        { title: "调解协议", id: 1 },
        { title: "判决书", id: 2 },
        { title: "和解协议", id: 3 }
      ],
      type: null,
      uuid: null
    };
  },
  components: { navigationBar },
  onLoad(option) {
    this.type = option.type;
    this.uuid = option.uuid;
    this.init(option.uuid, option.type == 1 ? "msg_uuid" : "case_i_code"); //type是判断是动态还是服务
  },
  methods: {
    lookAllow() {
      wx.navigateTo({
        url: `../lookAllow/main?type=${this.type}&uuid=${this.uuid}`
      });
    },
    caseTem(index) {
      let photoList = [];
      let information = this.informationObj;
      if (index == 0) photoList = information.contract_img || [];
      if (index == 1) {
        if (
          //一审调解书和二审调解书
          information.first_instance_conciliation_img &&
          information.second_instance_conciliation_img
        )
          photoList =
            information.first_instance_conciliation_img.concat(
              information.second_instance_conciliation_img
            ) || [];
        else {
          if (information.first_instance_conciliation_img)
            //一审调解书
            photoList = information.first_instance_conciliation_img || [];
          if (information.second_instance_conciliation_img)
            //二审调解书
            photoList = information.second_instance_conciliation_img || [];
        }
      }
      if (index == 2) {
        if (information.first_instance_img && information.second_instance_img)
          //一审判决书和二审判决书
          photoList =
            information.first_instance_img.concat(
              information.second_instance_img
            ) || [];
        else {
          if (information.first_instance_img)
            //一审判决书
            photoList = information.first_instance_img || [];
          if (information.second_instance_img)
            //二审判决书
            photoList = information.second_instance_img || [];
        }
      }
      if (index == 3) photoList = information.reconciliation_img || [];
      if (photoList.length)
        wx.navigateTo({
          url: `../case/main?type=${index}&photoList=${JSON.stringify(
            photoList
          )}`
        });
      else {
        wx.showToast({
          title: "暂无数据",
          icon: "none",
          duration: 1000
        });
        return;
      }
    },
    async init(uuid, typeKey) {
      const res = await this.axios.get({
        url: `/trans/case/progress/?${typeKey}=${uuid}`
      });
      if (res.code == 0) {
        let infoCase = [];
        let gress;
        res.data[0].case_progress.forEach((item, index) => {
          if (Object.values(item).join(" ")) {
            let case_progress = Object.assign({});
            case_progress.title = Object.keys(item).join(" ");
            case_progress.time = Object.values(item).join(" ");
            infoCase.push(case_progress);
          }
        });
        this.details = res.data;
        this.personnel(this.details[0].i_code);
        this.information(this.details[0].i_code);
        gress = infoCase[infoCase.length - 1];
        this.$set(this.details[0], "gress", gress);
      } else if (res.code == 1) {
      }
    },
    async information(i_code) {
      const res = await this.axios.get({
        url: "/trans/related_material/?i_code=" + i_code
      });
      if (res.code == 0) {
        this.informationObj = res.data;
      }
    },
    async personnel(i_code) {
      const res = await this.axios.get({
        url: `/trans/related_personnel/?i_code=${i_code}`
      });
      if (res.code == 0) {
        let data = res.data;
        data.barrister_list.forEach((item, index) => {
          this.$set(item, "position", "出庭人员");
        });
        this.personnelArr = data.barrister_list;
        if (data.authenticate.hasOwnProperty("name")) {
          this.$set(data.authenticate, "position", "鉴定专员");
          this.personnelArr.push(data.authenticate);
        }
        if (data.case_handler.hasOwnProperty("name")) {
          this.$set(data.case_handler, "position", "主办人员");
          this.personnelArr.push(data.case_handler);
        }
        if (data.customer_service.hasOwnProperty("name")) {
          this.$set(data.customer_service, "position", "客户专员");
          this.personnelArr.push(data.customer_service);
        }
        if (data.perform_lawyer.hasOwnProperty("name")) {
          this.$set(data.perform_lawyer, "position", "执行专员");
          this.personnelArr.push(data.perform_lawyer);
        }
        if (data.salesman.hasOwnProperty("name")) {
          this.$set(data.salesman, "position", "理赔顾问");
          this.personnelArr.push(data.salesman);
        }
        if (data.leader.hasOwnProperty("name")) {
          this.$set(data.leader, "position", "跟案主管");
          this.personnelArr.push(data.leader);
        }
      }
    }
  }
};
</script>
<style scoped="scoped">
.box {
  height: 100vh;
  background: rgb(245, 245, 245);
}
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
.current {
  background: #f3e5c4;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  background: #fd657e;
}
.current_left {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.current_left_logo {
  width: 20rpx;
  height: 20rpx;
  display: flex;
  align-self: auto;
}
.current_left_logo > img {
  width: 100%;
  height: 100%;
}
.left {
  display: flex;
  align-items: center;
  padding-right: 15rpx;
  box-sizing: border-box;
}
.left > span {
  color: #f6424f;
  font-size: 20rpx;
  font-weight: 400;
  margin-left: 10rpx;
}
.right {
  font-size: 28rpx;
  color: #222222;
  padding-left: 15rpx;
  font-weight: 400;
  box-sizing: border-box;
  border-left: 1px solid rgb(255, 249, 234);
}
.project {
  padding: 30rpx 27rpx;
  box-sizing: border-box;
  background: white;
  margin-bottom: 10rpx;
}
.projectHeader {
  display: flex;
}
.project_logo {
  width: 40rpx;
  height: 40rpx;
}
.project_logo > img {
  width: 100%;
  height: 100%;
}
.projectHeader > span {
  margin-left: 5rpx;
  font-size: 34rpx;
  color: #c2b699;
  font-weight: bold;
}
.project_uls {
  margin-top: 44rpx;
  display: flex;
}
.project_uls > li {
  width: 33.3%;
  position: relative;
}
.projectLis_photo {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin: 0 auto;
}
.projectLis_photo > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.lis_title {
  font-size: 22rpx;
  color: #222222;
  font-weight: 400;
  margin-top: 18rpx;
  text-align: center;
}

.case_lis {
  border-bottom: 1px solid #c4c4c4;
  display: flex;
  justify-content: space-between;
  padding: 30rpx 25rpx;
  box-sizing: border-box;
}
.case_lis > span {
  color: #222222;
  font-size: 28rpx;
  font-weight: 400;
}
.rightArrowId {
  width: 20px;
  height: 20px;
}
.rightArrowId > img {
  width: 100%;
  height: 100%;
}
</style>

