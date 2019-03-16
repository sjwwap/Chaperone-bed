<template>
  <div class="map">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="mapView">
      <div id="allmap"></div>
      <div class="dingwei iconfont icon-dingwei" @click="dingwei"></div>
          <mu-button @click="gocode" fab large color="primary">
            <p class="iconfont icon-saoyisao"></p>
            <span>扫码使用</span>
            </mu-button>
    </div>
    <div class="homeDetailed" v-if="homeDetailedBox">
      <div class="homeDetailedTitle"><h3>{{selecttxt}}</h3><i @click="bodyrgbaClose" class="iconfont icon-quxiao"></i></div>
      <div class="homeDetailedPosition"><div><h3>{{defaulttitle}}</h3><p>{{defauladdress}}</p></div><div @click="toherf" class="toherf"><em class="iconfont icon-dingwei"></em><p>到这去</p></div></div>
      <div class="homeDetailedCont">
        <li>
          <h4>500</h4>
          <p>医院投放</p>
        </li>
        <li>
          <h4>85</h4>
          <p>大堂</p>
        </li>
        <li>
          <h4>500</h4>
          <p>医院其他地方</p>
        </li>
      </div>
      <div class="homeDetailedBut">
      <mu-button color="primary" @click="userGo">确定用床</mu-button>
      </div>
    </div>
    <Loading v-show="loadingState" :message="Msg"></Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading'
export default {
  name: 'Mapview',
  components:{Loading},
  data () {
    return {
      loadingState:false,
      Msg:"定位中.",
      selecttxt:"请选择您要使用的产品...",
      usertoken:[],
      homeDetailedBox:false,
       homeSelectUlList: [
        {url:"static/img/pro1.png",name:"共享陪护床"},
        {url:"static/img/pro2.png",name:"共享婴儿车"},
        {url:"static/img/pro3.png",name:"共享按摩椅"},
        {url:"static/img/pro4.png",name:"共享充电宝"},
        {url:"static/img/pro1.png",name:"共享陪护床"},
        {url:"static/img/pro2.png",name:"共享婴儿车"},
        {url:"static/img/pro3.png",name:"共享按摩椅"},
        {url:"static/img/pro4.png",name:"共享充电宝"},
      ],

      dw:0,


      // 点击按钮
      addclick:0,

      // 默认展示产品
      procodemr:"",


      // 授权信息
      access_token:"",
      expires_in:"",
      openid:"",
      refresh_token:"",
      scope:"",

      // 签名
      noncestr:"",
      signature:"",
      timestamp:"",
      ticket:"",
      appid:"",

      // cookie
      openId:"",
      userId:"",
      init:"",
      deviceCode:"",
      latitude:"",
      longitude:"",




      // 首页产品默认参数
      defaultList:[],
      selectTxt:"请选择您要使用的产品...",

      // 当前产品定位及信息
      defaulttitle:"",
      defauladdress:"",
      defaultlongitude:"",
      defaultlatitude:"",

      projectLi:{
        address: "",  //详细地址
        create_time: "",  
        create_user: "", 
        customer_service_phone: "", 
        distance: "",
        father_id: "",
        id: "",
        latitude: "",
        longitude: "",
        name: "",   //项目名称
        operator_id: "",
        person_name: "",
        person_phone: "",
        product_id: "",
        state: "",
        update_time: "",
        update_user: ""
      }

    }
  },

   watch:{
      dw: {
        deep: true,
        handler(val){

        var x=this.latitude;//获取纬度
        var y=this.longitude;//获取经度

          // 获取首页产品
        var $that = this
        const url ='/palladium/inter/product/productListByIdAndName';
        let postData = this.$qs.stringify({
            // openId:this.openId
            openId:'ou1V50-XP68wCFriI1sw-pIvRDdM'
            });
            this.$http({
                method: 'post',
                url:url,
                data:postData
            }).then((res)=>{
              
              // $that.selecttxt = res.data.data[0].product_name
              $that.defaultList = res.data.data
              if ($that.$route.query.id == undefined) {
              $that.procodemr = res.data.data[0].id
              } else {
                $that.selectTxt = $that.$route.query.name
                $that.procodemr = $that.$route.query.id
              }
              
              // 默认显示产品
           $that.$http.get('/palladium/inter/product/projectByPidAndLonAndLat?openId=ou1V50-XP68wCFriI1sw-pIvRDdM&productId='+ $that.procodemr +'&longitude='+$that.longitude+'&latitude='+$that.latitude+'')
                    .then(function (response) {
                var map = new BMap.Map("allmap");
                map.enableScrollWheelZoom(true); 
             
                var point = new BMap.Point($that.longitude,$that.latitude);
                map.centerAndZoom(point,16); 

              //我的定位
              var pt = new BMap.Point($that.longitude,$that.latitude); 
              var marker = new BMap.Marker(pt);
              map.addOverlay(marker); 
              marker.setAnimation(BMAP_ANIMATION_BOUNCE); 


              // 地图样式
              var styleJson = [
                    {
                      "featureType": "all",
                      "elementType": "geometry",
                      "stylers": {
                          "hue": "#007fff",
                          "saturation": 89
                      }
                    },
                    {
                      "featureType": "water",
                      "elementType": "all",
                      "stylers": {
                          "color": "#ffffff"
                      }
                    }
                  ]
                  map.setMapStyle({styleJson:styleJson});


                function addMarker(x,y,name,address){
                // 创建产品点
                this.pt = new BMap.Point(x,y);
                this.myIcon = new BMap.Icon("static/img/icon/mapPro.png", new BMap.Size(32,38));
                this.marker2 = new BMap.Marker(this.pt,{icon:this.myIcon});  // 创建标注
                map.addOverlay(this.marker2);              // 将标注添加到地图中

                // 设置地图点击事件
                this.marker2.addEventListener("click",attribute);
                function attribute(){
                  $that.homeDetailedBox = true
                  $that.defaulttitle = name
                  $that.defauladdress = address
                  $that.defaultlongitude = x
                  $that.defaultlatitude = y

                  }
                }
                
                for (const item of response.data.data) {
                  
                  const Public = new addMarker(item.longitude,item.latitude,item.name,item.address);
                  
                }
                // 关闭loading
                 $that.loadingState = false

                    })
                    .catch(function (error) {
                      console.log(error.msg)
                    })
          })
        }
      }
},



  created(){
      this.openId = this.getCookie("openId")
  },
  methods:{
    // 去使用并调用扫一扫
    userGo:function(){
    this.gosysstate = false
    this.sys()
    },
  // 调用扫一扫
    gocode(){
          this.sys()
    },
    // 定位
    dingwei(){
         this.position()
    },

    toherf(){
      window.location.href = "http://api.map.baidu.com/direction?origin=latlng:"+this.latitude+","+this.longitude+"|name:我的位置&destination=latlng:"+this.defaultlatitude+","+this.defaultlongitude+"|name:"+this.defauladdress+"&mode=driving&region=深圳&output=html&src=webapp.baidu.openAPIdemo"
    }
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map{position: absolute;top:0;bottom:0;left:0;right:0;background:#fff;display: flex;flex-direction: column;}
.mapView{width:100%;height:100%;position: relative;overflow: hidden; background-size:100% 120%;}
.mapView button{width:5.8rem;height:5.8rem;text-align:center; display:block;color:#fff;border-radius:100%;font-size: .8rem;position: fixed;left: 50%; bottom: 5rem;margin-left: -2.9rem;}
.mapView p{font-size: 1.8rem;margin-bottom: .5rem;}
#container {width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}


/* 首页弹出详情 */
.homeDetailed{width: 94%;background: #fff;border-radius: 10px;position: fixed;bottom: 1rem;left: 3%;box-shadow: 0 10px 5px #dedede;padding: .5rem 1rem;z-index: 99997;}
.homeDetailedTitle{display: flex;justify-content: space-between;font-size: .9rem;border-bottom: 1px solid #e6e6e6;padding: .7rem 0;}
.homeDetailedTitle i{color: #dedede;font-size: 1rem;}
.homeDetailedPosition{display: flex;justify-content: space-between;border-bottom: 1px solid #e6e6e6;padding: .7rem 0;}
.homeDetailedPosition h3{font-size: .9rem;font-weight: 500;color: #333;}
.homeDetailedPosition p{font-size: .7rem;font-weight: 500;color: #999;padding-top: .2rem;}
.homeDetailedPosition div.toherf{text-align: center;color: #666666;}
.homeDetailedPosition div.toherf em{font-size: 1.2rem;}
.homeDetailedPosition div.toherf p{padding-top: 0;}

.homeDetailedCont{display: flex;justify-content: space-around;padding: .5rem 0;}
.homeDetailedCont li h4{color: #405efe;font-weight: 700;font-size: 1.6rem;text-align: center;}
.homeDetailedCont li p{text-align: center;}
.homeDetailedBut{text-align: center;padding: 2rem 0;}


.login{width: 100%;height: 50px;display: block; background: #3166fd;position: fixed;z-index: 9999999;left: 0;top: 0;color: #fff;line-height: 50px;text-align: center;}


#allmap {width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";  background-size:100%;}
/* background:url(../static/img/home_map.jpg) no-repeat; */



.dingwei{width:2.2rem;height: 2.2rem;background: #fff;position: fixed;right: 1rem;bottom: 7rem;border-radius: 100%;text-align: center;line-height: 2.2rem;color: #3166fd;font-size: 1.3rem; box-shadow: 0 0 5px #dedede;}
.shuaxin{width:2.2rem;height: 2.2rem;background: #fff;position: fixed;right: 1rem;bottom: 7rem;border-radius: 100%;text-align: center;line-height: 2.2rem;color: #3166fd;font-size: 1.3rem; box-shadow: 0 0 5px #dedede;}
</style>
<style>
.BMap_cpyCtrl {display: none;}
.anchorBL {display: none;}
.mapView button .mu-button-wrapper{flex-direction: column;}
</style>

