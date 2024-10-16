// pages/my_reply/my_reply.js
// 引用全局对象
let APP = getApp();
const db = wx.cloud.database();
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    replies: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options);
    this.getReplies()
    
    
  },
 
  getReplies: function(){
    db.collection('reply').orderBy('createTime', 'desc').where({
      _openid : APP.globalData.cur_user._openid
    }).get({
      success: (res) => {
        let replies = res.data;
        this.setData({ replies })
      },
      fail: error =>{
        console.log(error);
      }
    })
  },
  // 回复数递增
  incReply: function(topic_id){
    wx.cloud.callFunction({
      name: 'incReply',
      data: {
        topic_id: topic_id
      },
      success: res =>{
        console.log('[云函数] [addReply] user openid: ', res.result)
      },
      fail: error => {
        console.error('[云函数] [addReply] 调用失败', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})