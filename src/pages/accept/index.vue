<template>
  <div>测试12312</div>
</template>
<script>
export default {
  data() {
    return {};
  },
  onLoad(options) {
    if (options.long_contract_number) {
      wx.setStorageSync("long_contract_number", options.long_contract_number);
      wx.reLaunch({
        url: "../index/main"
      });
    }
  }
};
</script>