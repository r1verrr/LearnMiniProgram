import {
  getMultiData, getGoodsData
}from '../../service/home.js'


const types = ["pop",'new','sell']

const TOP_DISTANCE = 1000;

Page({
  data:{
    banners:[],
    recommends:[],
    titles:["流行","新款","精选"],
    goods:{
      'pop':{page:0 , list:[],},
      'new':{page:0 , list:[],},
      'sell':{page:0 , list:[],}
    },
    currentType:"pop",
    showBackTop:false,
    isTabFixed:false,
    tabScrollTop: 0

  },
  onLoad:function(options){
    //请求轮播图以及推荐数据
    this._getMultiData( )
    // 请求商品函数
    this._getGoodsData("pop")
    this._getGoodsData("sell")
    this._getGoodsData("new")

  },


  // ------------网络请求函数---------
  _getMultiData() {
    getMultiData().then(res => {
      //取出轮播图和推荐的数据
      const banners = res.data.data.banner.list;
      const recommends = res.data.data.recommend.list

      // 将 banners 
      this.setData({
        banners,
        recommends
      })
    })
  },

_getGoodsData(type){
  // 获取页码
  const page = this.data.goods[type].page+1;

  //发送网络请求

  getGoodsData (type,page).then(res =>{
      // 取出数据
      const list = res.data.data.list;

      // 将数据设置到对应type的list中
      const oldList = this.data.goods[type].list;
      oldList.push(...list);
    

      // 将数据设置到data中的goods中
      const typeKey = `goods.${type}.list`;
      const pageKey = `goods.${type}.page`
      this.setData({
        [typeKey]:oldList,
        [pageKey]:page
      })
  
  })
},




// ------------------事件监听函数------------------  
  handleTabClick(event){
    // 取出index
    const index = event.detail.index
  
    
    // 设置currentType

  this.setData(
    {
        currentType: types[index]
    }
  )
  },
  handleImageLoad(){
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
      this.data.tabScrollTop = rect.top
    }).exec()
  },
  onReachBottom(){
    // 上拉加载更多
    this._getGoodsData(this.data.currentType)
  },


  onPageScroll(option){
    // 取出scrollTop
    const scrollTop= option.scrollTop;

    // 修改showBackTop属性
    // 官方 不要在滚动的函数中频繁调用this.setData
    const flag = scrollTop >= TOP_DISTANCE
    if(flag != this.data.showBackTop){
      this.setData({
        showBackTop: flag
      })
    }
  // 修改isTabFixed属性
  const flag2 = scrollTop >= this.data.tabScrollTop;
    if (flag2 != this.data.isTabFixed) {
      this.setData({
        isTabFixed: flag2
      })
    }
  }
})