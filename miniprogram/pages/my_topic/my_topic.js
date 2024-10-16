// pages/my_topic/my_topic.js
// 引用全局对象
let APP = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topics: [],
    fullScreen: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(APP.globalData);
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
    // this.setData({ user: APP.globalData.cur_user })
    console.log(APP.globalData);
    
  },
  getTopics: function(cb){
    db.collection('topic').orderBy('createTime', 'desc').where({
      _openid : APP.globalData.cur_user._openid
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        let topics = res.data
        this.setData({ topics })
        typeof cb === 'function' && cb();
      },
      fail: (error) => {
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        })
        console.error('[数据库] [查询记录] 失败：', error)
      }
    })
    
  },
   // 当用户点击图片时候，获取当前图片元素中 data-url 设置的图片地址
  // 然后使用 wx.previewImage API 预览展示。
  handlePreviewImage: function(event){
    // console.log(event);
    let url = event.currentTarget.dataset.url
    wx.previewImage({
      urls: [url],
      current: url
    })
  },
  // 当用户点击视频的 cover-view 时候，获取元素中 data-id 的 id 值
  // 然后通过 wx.createVideoContext 创建视频实例对象
  // 判断当前是否全屏
  // 如果是，就是暂停退出全屏
  // 如果不是，就打开全屏并播放
  handlePreviewVideo: function(event){
    let id = event.currentTarget.dataset.id
    let videoCtx = wx.createVideoContext(id)
    let fullScreen = this.data.fullScreen
    if(fullScreen){
      videoCtx.pause()
      videoCtx.exitFullScreen()
      this.setData({ fullScreen: false })
    }else{
      videoCtx.requestFullScreen()
      videoCtx.play()
      this.setData({ fullScreen: true })
    }
  },
  onPullDownRefresh: function(){
    this.getTopics(()=>{
      wx.stopPullDownRefresh()
    })
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