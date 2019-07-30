<template>
  <div>
    <section>
      <navigation-bar
        :title="videoTitle"
        :navBackgroundColor="'#434343'"
        :back-visible="true"
        :homeIshide="true"
      ></navigation-bar>
    </section>
    <ul class="photo">
      <li
        class="photoLis"
        v-for="(item,index) in photoList"
        @click="previewImage(item)"
        :key="index"
      >
        <img :src="item" alt />
      </li>
    </ul>
  </div>
</template>
<script>
import navigationBar from "../../components/navigationBar";
export default {
  data() {
    return {
      videoTitle: "",
      photoList: []
    };
  },
  components: { navigationBar },
  onLoad(options) {
    this.photoList = JSON.parse(options.photoList);
    if (options.type == 0) this.videoTitle = "合同";
    if (options.type == 1) this.videoTitle = "调解协议";
    if (options.type == 2) this.videoTitle = "判决书";
    if (options.type == 3) this.videoTitle = "和解协议";
  },
  mounted() {},
  methods: {
    previewImage(url) {
      wx.previewImage({
        current: url,
        urls: this.photoList
      });
    }
  }
};
</script>
<style scoped="scoped">
.photo {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  box-sizing: border-box;
}
.photoLis {
  width: 150px;
  height: 150px;
  margin: 0 10px 10px 0;
}
.photoLis > img {
  width: 100%;
  height: 100%;
}
</style>

