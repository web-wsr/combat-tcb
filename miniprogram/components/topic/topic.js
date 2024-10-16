Component({
    properties: {
        topics: {
            type: Array,
            value:[]
        }
    },
    data: {
        fullScreen: false
    },
    methods: {
        handlePreviewImage: function(event){
            // console.log(event);
            let url = event.currentTarget.dataset.url
            wx.previewImage({
              urls: [url],
              current: url
            })
          },
        handlePreviewVideo: function(event){
          console.log(this);
            let id = event.currentTarget.dataset.id
            let videoCtx = wx.createVideoContext(id, this)
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
    }
})