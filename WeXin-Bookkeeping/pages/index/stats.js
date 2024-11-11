// pages/index/stats.js
Page({
  // 跳转到主页
  goToHome: function () {
    wx.navigateTo({
      url: '/pages/index/index' // 确保路径是正确的
    });
  },
  // 再次跳转到统计页面
  goToStats: function () {
    wx.navigateTo({
      url: '/pages/index/stats' // 确保路径是正确的
    });
  }
});