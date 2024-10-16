// pages/create/create.js
import { formatTime } from '../../utils/formatTime.js';
const APP = getApp();
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: '',
    videourl: '',
    content: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 实时监听输入的文本 
  handleChange: function(event){
    let content = event.detail.value
    this.setData({ content })
  },
  handleUpload: function(){
    wx.chooseMedia({
      count: 9,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      maxDuration: 30,
      camera: 'back',
      success:(res) => {
        // console.log(res.tempFiles[0].tempFilePath)
        // console.log(res.tempFiles[0].size)
        // console.log(res.tempFiles[0].fileType);
        // console.log(res);
        let filePath = res.tempFiles[0].tempFilePath
        let type = res.tempFiles[0].fileType
        this.uploadFile(type, filePath)
      }
    })
  },
   // 5. 上传功能，接收类型、资源地址两个参数
  // 根据 open_id 和时间戳拼接出文件名
  // 使用 wx.cloud.uploadFile 上传文件到云开发的存储管理内
  uploadFile: function(type, filePath){
    // console.log(APP.globalData.cur_user);
    let openid = APP.globalData.cur_user._openid
    let timestamp = Date.now()
    let postfix = filePath.match(/\.[^.]+?$/)[0];
    let cloudPath = `${openid}_${timestamp}${postfix}`
    wx.showLoading({
      title: '上传中...',
      mask: true
    })

    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: (res) => {
        if(type === 'video'){
          this.setData({ videourl: res.fileID })
        }else{
          this.setData({ imageUrl: res.fileID })
        }
      },
      fail: (error) => {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  //  6. 定义发布元素点击的回调函数
  // 当用户点击发布时候，判断文字、图片、视频资源最少有一个。
  // 然后使用 db.collection 连接 topic 数据库，再使用 add 方法为 topic 集合添加一条记录。
  // 记录包含 文字、图片、视频资源、用户信息、时间戳 和 显示时间。
  // 当成功添加后，从成功回调函数中的参数获取到当前记录的 id ，拼接地址，跳转到该 id 的详情页
  handleSubmit: function(){
    let date = new Date()
    let date_display = formatTime(date)
    let createTime = db.serverDate()
    let content = this.data.content
    let imageUrl = this.data.imageUrl
    let videoUrl = this.data.videourl
    let userInfo = APP.globalData.cur_user
    // console.log(date_display,userInfo);
    if(!content && !imageUrl && !videoUrl){
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask: true
    })
    db.collection('topic').add({
      data: {
        content, userInfo, createTime, date_display, imageUrl, videoUrl
      },
      success: (res) => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        let url = '/pages/detail/detail?id=' + res._id;
        wx.redirectTo({
          url
        })
      },
      fail: (error) => {
        wx.showToast({
          title: '发布失败',
          icon: 'none'
        })
      },
      complete: () => {
        wx.hideLoading()
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