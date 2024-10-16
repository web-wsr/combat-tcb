// pages/my/my.js


// 引用全局对象
const APP = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    nickName: "",
    logger: false,
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 从云函数中获取openid
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid);
          // 去uers表查询有没有这个openid的用户
          let openid = res.result.openid
          db.collection('users').where({
            _openid: openid
          }).get({
            success: res => {
              // 已经登录过
              if (res.data.length > 0) {
                let user = res.data[0]
                APP.globalData.cur_user = user
                this.setData({
                  avatarUrl: user.user_avatar,
                  nickName: user.user_nickName,
                  logger: true,
                  loading: false
                })
                // console.log('22222',this.data);
              }else{
                this.setData({
                  loading: false
                })
              }
            }
          })
        },
        fail: err => {
          console.log('[云函数] [login] 调用失败 ', err);
        },
        // complete: () => {
        //   wx.hideLoading()
        // }
      })
    
  },
  onChooseAvatar: function (event) {
    // console.log(event);
    let avatarUrl = event.detail.avatarUrl
    this.setData({
      avatarUrl
    })
  },
  valueInput: function (event) {
    // console.log(event.detail.value);
    let nickName = event.detail.value
    this.setData({
      nickName
    })
  },
  loginSys: function () {
    let {
      avatarUrl,
      nickName
    } = this.data
    if (!avatarUrl || !nickName) {
      wx.showToast({
        title: '更换头像和昵称',
        icon: 'error',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '登录中...',
      mask: true
    })
    wx.cloud.uploadFile({
      cloudPath: this.data.nickName + this.data.avatarUrl.substring(this.data.avatarUrl.lastIndexOf(".")),
      filePath: this.data.avatarUrl, // 文件路径
      success: async (res) => {
        // console.log(res.fileID)
        // 新增用户到uers表(user_nickName,user_avatar,created_time)
        let user = {
          user_nickName: this.data.nickName,
          user_avatar: res.fileID,
          created_time: new Date()
        }

        const dbres = await db.collection('users').add({
          // data 字段表示需新增的 JSON 数据
          data: user,
        })
        if (dbres) {
          this.setData({
            logger: true
          })
        }
        user.id = dbres._id
        APP.globalData.cur_user = user
      },
      fail: (error) => {
        // handle error
        wx.showToast({
          title: '登录失败',
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