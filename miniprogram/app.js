// app.js
App({
  onLaunch: function () {
    this.cloudInit();
    // this.getUserInfo();
    // console.log(this.globalData);
    // if (wx.getUserProfile) {
    //   this.globalData.canIUseGetUserProfile = true
    // }
  },
  cloudInit: function(){
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        traceUser: true,
      });
    }
  },
  // getUserInfo: function(cb){
  //   wx.getSetting({
  //     success: res => {
  //       if(res.authSetting['scope.userInfo']){
  //         wx.getUserProfile({
  //           desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //           success: res => {
  //             this.getOpenid();
  //             this.globalData.userInfo = res.userInfo;
  //             this.globalData.hasUserInfo = true;
  //             typeof cb === 'function' && cb(res)
  //           }
  //         })
  //       }else{
  //         console.log('用户未授权');
  //       }
  //     }
  //   })
  // },
  // getOpenid: function(){
  //   wx.cloud.callFunction({
  //     name:'login',
  //     data:{},
  //     success: res => {
  //       console.log('[云函数] [login] user openid: ', res.result.openid);
  //       this.globalData.openid = res.result.openid
  //     },
  //     fail: err => {
  //       console.log('[云函数] [login] 调用失败 ', err);
  //     }
  //   })
  // },
  // 用于存放全局数据
  globalData:{}
});
