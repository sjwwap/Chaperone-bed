<template>
  <div class="home">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="homeMap">
      <div
        class="homeSelect"
        v-if="this.defaultListData == 200"
        @click="homeSelect"
      >{{selectTxt}}<i class="iconfont icon-sanjiaoshang"></i>
      </div>
      <div
        class="bodyrgba"
        @click="bodyrgbaClose"
      ></div>
      <ul class="homeSelectUl">
        <li
          @click="ChoicePro(index,$event)"
          v-for="(item,index) in defaultList"
          :key="index"
        ><img
            :src="'../../'+item.product_picture"
            onerror="javascript:this.src='static/img/logo.png';this.onerror = null"
          ><em>{{item.product_name}}</em></li>
      </ul>
      <div id="allmap"></div>
      <div class="homeBg"></div>
      <div
        class="dingwei iconfont icon-dingwei"
        @click="dingwei"
      ></div>
      <mu-button
        @click="gocode"
        :disabled="sysBut"
        fab
        large
        color="primary"
      >
        <p class="iconfont icon-saoyisao"></p>扫码使用
      </mu-button>
    </div>
    <div
      class="homeDetailed"
      v-if="homeDetailedBox"
    >
      <div class="homeDetailedTitle">
        <h3>{{selecttxt}}</h3><i
          @click="bodyrgbaClose"
          class="iconfont icon-quxiao"
        ></i>
      </div>
      <div class="homeDetailedPosition">
        <div>
          <h3>{{defaulttitle}}</h3>
          <p>{{defauladdress}}</p>
        </div>
        <div
          @click="toherf"
          class="toherf"
        ><em class="iconfont icon-dingwei"></em>
          <p>到这去</p>
        </div>
      </div>
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
        <mu-button
          color="primary"
          @click="userGo"
        >确定用床</mu-button>
      </div>
    </div>
    <!-- <Loading v-show="loadingState" :message="Msg"></Loading> -->
    <Nav></Nav>
  </div>
</template>
<script>
import Nav from "@/components/nav";
import Loading from "@/components/loading";
export default {
  name: "Home",
  components: { Nav, Loading },
  data() {
    return {
      // 扫码按钮
      sysBut: true,
      loadingState: false,
      Msg: "定位中.",
      selecttxt: "请选择您要使用的产品...",
      usertoken: [],
      homeDetailedBox: false,

      dw: 0,

      // 点击按钮
      addclick: 0,

      // 默认展示产品
      procodemr: "",

      // 授权信息
      access_token: "",
      expires_in: "",
      openid: "",
      refresh_token: "",
      scope: "",

      // 签名
      noncestr: "",
      signature: "",
      timestamp: "",
      ticket: "",
      appid: "",

      // cookie
      openId: "",
      userId: "",
      init: "",
      deviceCode: "",
      latitude: "",
      longitude: "",

      // 首页产品默认参数
      defaultList: [],
      selectTxt: "请选择您要使用的产品...",
      defaultListData: null,

      // 当前产品定位及信息
      defaulttitle: "",
      defauladdress: "",
      defaultlongitude: "",
      defaultlatitude: "",

      projectLi: {
        address: "", //详细地址
        create_time: "",
        create_user: "",
        customer_service_phone: "",
        distance: "",
        father_id: "",
        id: "",
        latitude: "",
        longitude: "",
        name: "", //项目名称
        operator_id: "",
        person_name: "",
        person_phone: "",
        product_id: "",
        state: "",
        update_time: "",
        update_user: ""
      }
    };
  },

  watch: {
    dw: {
      deep: true,
      handler(val) {
        var x = this.latitude; //获取纬度
        var y = this.longitude; //获取经度

        // 获取首页产品
        var $that = this;
        const url = "/palladium/inter/product/productListByIdAndName";
        let postData = this.$qs.stringify({
          openId: $that.openId
        });
        this.$http({
          method: "post",
          url: url,
          data: postData
        }).then(res => {
          $that.sysBut = false;
          if (res.data.code == 300) {
            $that.defaultListData = res.data.code;
            var map = new BMap.Map("allmap");
            map.enableScrollWheelZoom(true);
            var point = new BMap.Point($that.longitude, $that.latitude);
            map.centerAndZoom(point, 16);
            //定位
            var pt = new BMap.Point($that.longitude, $that.latitude);
            var marker = new BMap.Marker(pt);
            map.addOverlay(marker);
            marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            // 地图样式
            var styleJson = [{"featureType":"land","elementType":"geometry","stylers":{"color":"#f5f6f7ff"}},{"featureType":"water","elementType":"geometry","stylers":{"color":"#c4d7f5ff"}},{"featureType":"green","elementType":"geometry","stylers":{"color":"#dcf2d5ff"}},{"featureType":"highway","elementType":"geometry.fill","stylers":{"color":"#ffe59eff"}},{"featureType":"highway","elementType":"geometry.stroke","stylers":{"color":"#f5d48cff"}},{"featureType":"nationalway","elementType":"geometry.fill","stylers":{"color":"#fff6ccff"}},{"featureType":"provincialway","elementType":"geometry.fill","stylers":{"color":"#fff6ccff"}},{"featureType":"cityhighway","elementType":"geometry.fill","stylers":{"color":"#fff6ccff"}},{"featureType":"arterial","elementType":"geometry.fill","stylers":{"color":"#fff6ccff"}},{"featureType":"nationalway","elementType":"geometry.stroke","stylers":{"color":"#f2dc9dff"}},{"featureType":"provincialway","elementType":"geometry.stroke","stylers":{"color":"#f2dc9dff"}},{"featureType":"cityhighway","elementType":"geometry.stroke","stylers":{"color":"#f2dc9dff"}},{"featureType":"arterial","elementType":"geometry.stroke","stylers":{"color":"#f2dc9dff"}},{"featureType":"building","elementType":"geometry.fill","stylers":{"color":"#e6ebf0ff"}},{"featureType":"building","elementType":"geometry.stroke","stylers":{"color":"#d8e2ebff"}},{"featureType":"tertiaryway","elementType":"geometry.fill","stylers":{"color":"#ffffffff"}},{"featureType":"tertiaryway","elementType":"geometry.stroke","stylers":{"color":"#dfe4ebff"}},{"featureType":"fourlevelway","elementType":"geometry.fill","stylers":{"color":"#ffffffff"}},{"featureType":"fourlevelway","elementType":"geometry.stroke","stylers":{"color":"#dfe4ebff"}},{"featureType":"local","elementType":"geometry.fill","stylers":{"color":"#ffffffff"}},{"featureType":"local","elementType":"geometry.stroke","stylers":{"color":"#dfe4ebff"}},{"featureType":"scenicspotsway","elementType":"geometry.fill","stylers":{"color":"#ffffffff"}},{"featureType":"scenicspotsway","elementType":"geometry.stroke","stylers":{"color":"#dfe4ebff"}},{"featureType":"universityway","elementType":"geometry.stroke","stylers":{"color":"#dfe4ebff"}},{"featureType":"universityway","elementType":"geometry.fill","stylers":{"color":"#ffffffff"}},{"featureType":"vacationway","elementType":"geometry.stroke","stylers":{"color":"#dfe4ebff"}},{"featureType":"vacationway","elementType":"geometry.fill","stylers":{"color":"#ffffffff"}},{"featureType":"town","elementType":"labels.text","stylers":{"fontsize":18}},{"featureType":"town","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"town","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"highway","elementType":"labels.text.fill","stylers":{"color":"#c0792dff"}},{"featureType":"highway","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"nationalway","elementType":"labels.text.fill","stylers":{"color":"#c0792dff"}},{"featureType":"nationalway","elementType":"labels.text.stroke","stylers":{"color":"#ffffff6"}},{"featureType":"provincialway","elementType":"labels.text.fill","stylers":{"color":"#c0792dff"}},{"featureType":"provincialway","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"cityhighway","elementType":"labels.text.fill","stylers":{"color":"#c0792dff"}},{"featureType":"cityhighway","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"arterial","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"arterial","elementType":"labels.text.fill","stylers":{"color":"#c0792dff"}},{"featureType":"arterial","elementType":"labels.text","stylers":{"fontsize":24}},{"featureType":"cityhighway","elementType":"labels.text","stylers":{"fontsize":24}},{"featureType":"provincialway","elementType":"labels.text","stylers":{"fontsize":24}},{"featureType":"nationalway","elementType":"labels.text","stylers":{"fontsize":24}},{"featureType":"highway","elementType":"labels.text","stylers":{"fontsize":24}},{"featureType":"scenicspotslabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"scenicspotslabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"scenicspotslabel","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"educationlabel","elementType":"labels.icon","stylers":{"visibility":"on"}},{"featureType":"educationlabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"educationlabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"medicallabel","elementType":"labels.icon","stylers":{"visibility":"on"}},{"featureType":"medicallabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"medicallabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"entertainmentlabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"entertainmentlabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"estatelabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"estatelabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"estatelabel","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"entertainmentlabel","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"businesstowerlabel","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"businesstowerlabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"businesstowerlabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"companylabel","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"companylabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"companylabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"governmentlabel","elementType":"labels.icon","stylers":{"visibility":"on"}},{"featureType":"governmentlabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"governmentlabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"restaurantlabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"restaurantlabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"restaurantlabel","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"hotellabel","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"hotellabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff00"}},{"featureType":"hotellabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"shoppinglabel","elementType":"labels.icon","stylers":{"visibility":"on"}},{"featureType":"shoppinglabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"shoppinglabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"lifeservicelabel","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"lifeservicelabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"lifeservicelabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"carservicelabel","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"carservicelabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"carservicelabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"transportationlabel","elementType":"labels.icon","stylers":{"visibility":"on"}},{"featureType":"transportationlabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"transportationlabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"financelabel","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"financelabel","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"financelabel","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"tertiaryway","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"tertiaryway","elementType":"labels.text.stroke","stylers":{"color":"#ffffff00"}},{"featureType":"tertiaryway","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"fourlevelway","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"fourlevelway","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"fourlevelway","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"local","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"local","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"local","elementType":"labels.icon","stylers":{"visibility":"off"}},{"featureType":"companylabel","elementType":"labels","stylers":{"visibility":"off"}},{"featureType":"lifeservicelabel","elementType":"labels","stylers":{"visibility":"off"}},{"featureType":"carservicelabel","elementType":"labels","stylers":{"visibility":"off"}},{"featureType":"financelabel","elementType":"labels","stylers":{"visibility":"off"}},{"featureType":"scenicspotslabel","elementType":"labels","stylers":{"visibility":"on"}},{"featureType":"manmade","elementType":"geometry","stylers":{"color":"#f5f6f7ff"}},{"featureType":"subway","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,13","level":"12"}},{"featureType":"subway","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,13","level":"13"}},{"featureType":"subway","elementType":"geometry","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,13","level":"12"}},{"featureType":"subway","elementType":"geometry","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,13","level":"13"}},{"featureType":"subwaylabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,13","level":"13"}},{"featureType":"subwaylabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,13","level":"13"}},{"featureType":"subwaylabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,13","level":"13"}},{"featureType":"railway","elementType":"geometry","stylers":{"visibility":"off"}},{"featureType":"scenicspotslabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"10,15","level":"10"}},{"featureType":"scenicspotslabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"10,15","level":"11"}},{"featureType":"scenicspotslabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"10,15","level":"12"}},{"featureType":"scenicspotslabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"10,15","level":"13"}},{"featureType":"scenicspotslabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"10,15","level":"14"}},{"featureType":"scenicspotslabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"10,15","level":"15"}},{"featureType":"scenicspotslabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"10,15","level":"10"}},{"featureType":"scenicspotslabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"10,15","level":"11"}},{"featureType":"scenicspotslabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"10,15","level":"12"}},{"featureType":"scenicspotslabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"10,15","level":"13"}},{"featureType":"scenicspotslabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"10,15","level":"14"}},{"featureType":"scenicspotslabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"10,15","level":"15"}},{"featureType":"scenicspotslabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"10,15","level":"10"}},{"featureType":"scenicspotslabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"10,15","level":"11"}},{"featureType":"scenicspotslabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"10,15","level":"12"}},{"featureType":"scenicspotslabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"10,15","level":"13"}},{"featureType":"scenicspotslabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"10,15","level":"14"}},{"featureType":"scenicspotslabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"10,15","level":"15"}},{"featureType":"district","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"district","elementType":"labels.text.stroke","stylers":{"color":"#ffffffff"}},{"featureType":"city","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"city","elementType":"labels.text.stroke","stylers":{"color":"#ffffffff"}},{"featureType":"city","elementType":"labels.icon","stylers":{"visibility":"on"}},{"featureType":"country","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"country","elementType":"labels.text.stroke","stylers":{"color":"#ffffffff"}},{"featureType":"continent","elementType":"labels.text.fill","stylers":{"color":"#a77726ff"}},{"featureType":"continent","elementType":"labels.text.stroke","stylers":{"color":"#ffffffff"}},{"featureType":"medicallabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,16","level":"13"}},{"featureType":"medicallabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,16","level":"14"}},{"featureType":"medicallabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,16","level":"15"}},{"featureType":"medicallabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,16","level":"16"}},{"featureType":"medicallabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"13"}},{"featureType":"medicallabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"14"}},{"featureType":"medicallabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"15"}},{"featureType":"medicallabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"16"}},{"featureType":"medicallabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"13"}},{"featureType":"medicallabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"14"}},{"featureType":"medicallabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"15"}},{"featureType":"medicallabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"16"}},{"featureType":"entertainmentlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,17","level":"12"}},{"featureType":"entertainmentlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,17","level":"13"}},{"featureType":"entertainmentlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,17","level":"14"}},{"featureType":"entertainmentlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,17","level":"15"}},{"featureType":"entertainmentlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,17","level":"16"}},{"featureType":"entertainmentlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,17","level":"17"}},{"featureType":"entertainmentlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,17","level":"12"}},{"featureType":"entertainmentlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,17","level":"13"}},{"featureType":"entertainmentlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,17","level":"14"}},{"featureType":"entertainmentlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,17","level":"15"}},{"featureType":"entertainmentlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,17","level":"16"}},{"featureType":"entertainmentlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,17","level":"17"}},{"featureType":"entertainmentlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,17","level":"12"}},{"featureType":"entertainmentlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,17","level":"13"}},{"featureType":"entertainmentlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,17","level":"14"}},{"featureType":"entertainmentlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,17","level":"15"}},{"featureType":"entertainmentlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,17","level":"16"}},{"featureType":"entertainmentlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,17","level":"17"}},{"featureType":"estatelabel","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"estatelabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,16","level":"13"}},{"featureType":"estatelabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,16","level":"14"}},{"featureType":"estatelabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,16","level":"15"}},{"featureType":"estatelabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,16","level":"16"}},{"featureType":"estatelabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"13"}},{"featureType":"estatelabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"14"}},{"featureType":"estatelabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"15"}},{"featureType":"estatelabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"16"}},{"featureType":"estatelabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"13"}},{"featureType":"estatelabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"14"}},{"featureType":"estatelabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"15"}},{"featureType":"estatelabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,16","level":"16"}},{"featureType":"businesstowerlabel","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"businesstowerlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,16","level":"12"}},{"featureType":"businesstowerlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,16","level":"13"}},{"featureType":"businesstowerlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,16","level":"14"}},{"featureType":"businesstowerlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,16","level":"15"}},{"featureType":"businesstowerlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,16","level":"16"}},{"featureType":"businesstowerlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,16","level":"12"}},{"featureType":"businesstowerlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,16","level":"13"}},{"featureType":"businesstowerlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,16","level":"14"}},{"featureType":"businesstowerlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,16","level":"15"}},{"featureType":"businesstowerlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,16","level":"16"}},{"featureType":"businesstowerlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,16","level":"12"}},{"featureType":"businesstowerlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,16","level":"13"}},{"featureType":"businesstowerlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,16","level":"14"}},{"featureType":"businesstowerlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,16","level":"15"}},{"featureType":"businesstowerlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,16","level":"16"}},{"featureType":"governmentlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,17","level":"13"}},{"featureType":"governmentlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,17","level":"14"}},{"featureType":"governmentlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,17","level":"15"}},{"featureType":"governmentlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,17","level":"16"}},{"featureType":"governmentlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,17","level":"17"}},{"featureType":"governmentlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,17","level":"13"}},{"featureType":"governmentlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,17","level":"14"}},{"featureType":"governmentlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,17","level":"15"}},{"featureType":"governmentlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,17","level":"16"}},{"featureType":"governmentlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,17","level":"17"}},{"featureType":"governmentlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,17","level":"13"}},{"featureType":"governmentlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,17","level":"14"}},{"featureType":"governmentlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,17","level":"15"}},{"featureType":"governmentlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,17","level":"16"}},{"featureType":"governmentlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,17","level":"17"}},{"featureType":"restaurantlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,18","level":"13"}},{"featureType":"restaurantlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,18","level":"14"}},{"featureType":"restaurantlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,18","level":"15"}},{"featureType":"restaurantlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,18","level":"16"}},{"featureType":"restaurantlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,18","level":"17"}},{"featureType":"restaurantlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"13,18","level":"18"}},{"featureType":"restaurantlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,18","level":"13"}},{"featureType":"restaurantlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,18","level":"14"}},{"featureType":"restaurantlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,18","level":"15"}},{"featureType":"restaurantlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,18","level":"16"}},{"featureType":"restaurantlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,18","level":"17"}},{"featureType":"restaurantlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,18","level":"18"}},{"featureType":"restaurantlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,18","level":"13"}},{"featureType":"restaurantlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,18","level":"14"}},{"featureType":"restaurantlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,18","level":"15"}},{"featureType":"restaurantlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,18","level":"16"}},{"featureType":"restaurantlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,18","level":"17"}},{"featureType":"restaurantlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"13,18","level":"18"}},{"featureType":"hotellabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"14,16","level":"14"}},{"featureType":"hotellabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"14,16","level":"15"}},{"featureType":"hotellabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"14,16","level":"16"}},{"featureType":"hotellabel","elementType":"labels.text","stylers":{"fontsize":22,"curZoomRegionId":"0","curZoomRegion":"14,16","level":"14"}},{"featureType":"hotellabel","elementType":"labels.text","stylers":{"fontsize":22,"curZoomRegionId":"0","curZoomRegion":"14,16","level":"15"}},{"featureType":"hotellabel","elementType":"labels.text","stylers":{"fontsize":22,"curZoomRegionId":"0","curZoomRegion":"14,16","level":"16"}},{"featureType":"hotellabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"14,16","level":"14"}},{"featureType":"hotellabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"14,16","level":"15"}},{"featureType":"hotellabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"14,16","level":"16"}},{"featureType":"hotellabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"14,16","level":"14"}},{"featureType":"hotellabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"14,16","level":"15"}},{"featureType":"hotellabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"14,16","level":"16"}},{"featureType":"shoppinglabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"11,16","level":"11"}},{"featureType":"shoppinglabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"11,16","level":"12"}},{"featureType":"shoppinglabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"11,16","level":"13"}},{"featureType":"shoppinglabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"11,16","level":"14"}},{"featureType":"shoppinglabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"11,16","level":"15"}},{"featureType":"shoppinglabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"11,16","level":"16"}},{"featureType":"shoppinglabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,16","level":"11"}},{"featureType":"shoppinglabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,16","level":"12"}},{"featureType":"shoppinglabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,16","level":"13"}},{"featureType":"shoppinglabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,16","level":"14"}},{"featureType":"shoppinglabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,16","level":"15"}},{"featureType":"shoppinglabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,16","level":"16"}},{"featureType":"shoppinglabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,16","level":"11"}},{"featureType":"shoppinglabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,16","level":"12"}},{"featureType":"shoppinglabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,16","level":"13"}},{"featureType":"shoppinglabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,16","level":"14"}},{"featureType":"shoppinglabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,16","level":"15"}},{"featureType":"shoppinglabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,16","level":"16"}},{"featureType":"shoppinglabel","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"hotellabel","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"restaurantlabel","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"governmentlabel","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"companylabel","elementType":"labels.text","stylers":{"fontsize":24}},{"featureType":"entertainmentlabel","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"medicallabel","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"educationlabel","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"scenicspotslabel","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"airportlabel","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"water","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"water","elementType":"labels.text.stroke","stylers":{"color":"#ffffffff"}},{"featureType":"manmade","elementType":"labels.text.fill","stylers":{"color":"#9ca0a3ff"}},{"featureType":"manmade","elementType":"labels.text.stroke","stylers":{"color":"#ffffff0"}},{"featureType":"education","elementType":"labels","stylers":{"visibility":"on"}},{"featureType":"transportationlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,13","level":"12"}},{"featureType":"transportationlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"12,13","level":"13"}},{"featureType":"transportationlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,13","level":"12"}},{"featureType":"transportationlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,13","level":"13"}},{"featureType":"transportationlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,13","level":"12"}},{"featureType":"transportationlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"12,13","level":"13"}},{"featureType":"educationlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"11,14","level":"11"}},{"featureType":"educationlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"11,14","level":"12"}},{"featureType":"educationlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"11,14","level":"13"}},{"featureType":"educationlabel","stylers":{"curZoomRegionId":"0","curZoomRegion":"11,14","level":"14"}},{"featureType":"educationlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,14","level":"11"}},{"featureType":"educationlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,14","level":"12"}},{"featureType":"educationlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,14","level":"13"}},{"featureType":"educationlabel","elementType":"labels","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,14","level":"14"}},{"featureType":"educationlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,14","level":"11"}},{"featureType":"educationlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,14","level":"12"}},{"featureType":"educationlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,14","level":"13"}},{"featureType":"educationlabel","elementType":"labels.icon","stylers":{"visibility":"off","curZoomRegionId":"0","curZoomRegion":"11,14","level":"14"}},{"featureType":"transportationlabel","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"manmade","elementType":"labels.text","stylers":{"fontsize":23}},{"featureType":"scenicspots","elementType":"labels.text.fill","stylers":{"color":"#ab76b6ff"}},{"featureType":"scenicspots","elementType":"labels.text","stylers":{"fontsize":23}}]
	          map.setMapStyleV2({styleJson:styleJson});

            $that.sysBut = false;
          } else {
            $that.defaultListData = res.data.code;
            $that.defaultList = res.data.data;

            if ($that.$route.query.id == undefined) {
              $that.procodemr = res.data.data[0].id;
            } else {
              $that.selectTxt = $that.$route.query.name;
              $that.procodemr = $that.$route.query.id;
            }
            // 默认显示产品
            $that.$http
              .get(
                "/palladium/inter/product/projectByPidAndLonAndLat?openId=" +
                  $that.openId +
                  "&productId=" +
                  $that.procodemr +
                  "&longitude=" +
                  $that.longitude +
                  "&latitude=" +
                  $that.latitude +
                  ""
              )
              .then(function(response) {
                $that.sysBut = false;
                var map = new BMap.Map("allmap");
                map.enableScrollWheelZoom(true);

                var point = new BMap.Point($that.longitude, $that.latitude);
                map.centerAndZoom(point, 16);
                //定位
                var pt = new BMap.Point($that.longitude, $that.latitude);
                var marker = new BMap.Marker(pt);
                map.addOverlay(marker);
                marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                // 创建标注
                function addMarker(x, y, name, address) {
                  this.pt = new BMap.Point(x, y);
                  this.myIcon = new BMap.Icon(
                    "static/img/icon/mapPro.png",
                    new BMap.Size(32, 38)
                  );
                  this.marker2 = new BMap.Marker(this.pt, {
                    icon: this.myIcon
                  });
                  map.addOverlay(this.marker2);
                  // 设置地图点击事件
                  this.marker2.addEventListener("click", attribute);
                  function attribute() {
                    $that.homeDetailedBox = true;
                    $that.defaulttitle = name;
                    $that.defauladdress = address;
                    $that.defaultlongitude = x;
                    $that.defaultlatitude = y;
                    // var point = new BMap.Point(x,y-0.0003);  //设置地图中心坐标
                    // map.centerAndZoom(point,18);
                  }
                }

                for (const item of response.data.data) {
                  const Public = new addMarker(
                    item.longitude,
                    item.latitude,
                    item.name,
                    item.address
                  );
                }
                // 关闭loading
                $that.loadingState = false;
              })
              .catch(function(error) {
                console.log(error.msg);
              });
          }
        });
      }
    }
  },

  created() {
    this.openId = this.getCookie("openId");

    // init扫码
    this.init = this.getCookie("init");
    if (this.init == 1) {
      this.deviceCode = this.getCookie("deviceCode");
      document.cookie = "init=0";
      this.$router.push({
        name: "UsePro",
        params: {
          codenum: this.deviceCode
        }
      });
    }

    // 微信登陆并获取地理位置
    if (this.openId == undefined) {
      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa458a437c5eb240b&redirect_uri=http://pd.haokuaichong.cn/palladium/web/author?appId=wxa458a437c5eb240b&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
    } else {
      this.Msg = "定位中."
      this.loadingState = true
      this.position()
    }
  },
  methods: {
    // 选择产品
    homeSelect: function() {
      if ($(".homeSelectUl").css("display") == "none") {
        $(".bodyrgba").fadeIn();
        $(".homeSelect").addClass("homeSelectActive");
        // $(".homeSelect i").css("transform","rotate(180deg)")
        this.homeDetailedBox = false;
        $(".homeSelectUl").fadeIn(0);
      } else {
        $(".bodyrgba").fadeOut();
        $(".homeSelect").removeClass("homeSelectActive");
        // $(".homeSelect i").css("transform","rotate(0)")
        $(".homeSelectUl").fadeOut(0);
      }
    },
    // 选择产品
    ChoicePro(e, s) {
      this.selectTxt = this.defaultList[e].product_name;
      this.Msg = "加载中.";
      this.loadingState = true;
      // 获取首页产品
      var $thats = this;
      const url = "/palladium/inter/product/productListByIdAndName";
      let postData = this.$qs.stringify({
        openId: this.openId
      });
      this.$http({
        method: "post",
        url: url,
        data: postData
      }).then(res => {
        $thats.defaultList = res.data.data;
        $thats.procodemr = res.data.data[e].id;
        $thats.selecttxt = res.data.data[e].product_name;
        // 默认显示产品
        $thats.$http
          .get(
            "/palladium/inter/product/projectByPidAndLonAndLat?productId=" +
              $thats.procodemr +
              "&longitude=" +
              $thats.longitude +
              "&latitude=" +
              $thats.latitude +
              ""
          )
          .then(function(response) {
            $thats.loadingState = false
            var map = new BMap.Map("allmap")
            map.enableScrollWheelZoom(true)

            var point = new BMap.Point($thats.longitude, $thats.latitude)
            map.centerAndZoom(point, 16)

            //我的定位
            var pt = new BMap.Point($thats.longitude, $thats.latitude)
            var marker = new BMap.Marker(pt)
            map.addOverlay(marker)
            marker.setAnimation(BMAP_ANIMATION_BOUNCE)
            //创建标注
            function addMarker(x, y, name, address) {
              this.pt = new BMap.Point(x, y);
              this.myIcon = new BMap.Icon(
                "static/img/icon/mapPro.png",
                new BMap.Size(32, 38)
              );
              this.marker2 = new BMap.Marker(this.pt, { icon: this.myIcon });
              map.addOverlay(this.marker2);
              // 设置地图点击事件
              this.marker2.addEventListener("click", attribute);
              function attribute() {
                $thats.homeDetailedBox = true;
                $thats.defaulttitle = name;
                $thats.defauladdress = address;
                $thats.defaultlongitude = x;
                $thats.defaultlatitude = y;
              }
            }
            // 遍历多点定位
            for (const item of response.data.data) {
              const Public = new addMarker(
                item.longitude,
                item.latitude,
                item.name,
                item.address
              );
            }
          })
          .catch(function(error) {
            console.log(error.msg);
          });
      });
      // 关闭下拉及遮罩層
      $(".bodyrgba").fadeOut(0);
      $(".homeSelect").removeClass("homeSelectActive");
      $(".homeSelectUl").hide(0);
      this.homeDetailedBox = false;
    },
    bodyrgbaClose: function() {
      $(".bodyrgba").fadeOut(0);
      $(".homeSelect").removeClass("homeSelectActive");
      $(".homeSelectUl").hide(0);
      this.homeDetailedBox = false;
    },
    // 去使用并调用扫一扫
    userGo: function() {
      this.gosysstate = false;
      this.sys();
    },
    // 调用扫一扫
    gocode() {
      this.sys();
    },
    // 定位
    dingwei() {
      this.position();
    },
    toherf() {
      //  $that.defaultlongitude = x
      //  $that.defaultlatitude = y
      window.location.href =
        "http://api.map.baidu.com/direction?origin=latlng:" +
        this.latitude +
        "," +
        this.longitude +
        "|name:我的位置&destination=latlng:" +
        this.defaultlatitude +
        "," +
        this.defaultlongitude +
        "|name:" +
        this.defauladdress +
        "&mode=driving&region=深圳&output=html&src=webapp.baidu.openAPIdemo"
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home{position: absolute;top:0;bottom:0;left:0;right:0;background:#fff;display: flex;flex-direction: column;}
.homeMap{width:100%;height:100%;position: relative;overflow: hidden; background-size:100% 120%;background:#fff url(../../static/img/5-120601094354-50.gif)}
.homeMap button{width:5.8rem;height:5.8rem;text-align:center; display:block;color:#fff;border-radius:100%;font-size: .8rem;position: fixed;left: 50%; bottom: 5rem;margin-left: -2.9rem;}
.homeMap p{font-size: 1.8rem;margin-bottom: .5rem;}
#container {width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
.homeSelect{width: 94%;height: 3rem;position: absolute;top: 1rem;left: 3%; background: #fff;z-index: 99999;border-radius:50px;line-height: 3.1rem;text-indent: 1rem;font-size: .9rem;color: #999;border-bottom: 1px solid #f0f0f0;}
.homeSelect i{position: absolute;right: 1rem;transform: rotate(180deg);}
.homeSelectActive{border-bottom-left-radius: 0;border-bottom-right-radius: 0;border-top-left-radius: 0px;border-top-right-radius: 0px;}
.bodyrgba{position: fixed;top: 0;bottom: 0;right: 0;left: 0;background: rgba(0,0,0,0.2);z-index: 99996;display: none;}
.homeSelectUl{width: 94%;position: absolute; max-height: 22rem;background: #fff;left: 3%;top:4rem;z-index: 99999;border-radius: 0px;overflow: hidden;overflow-y: auto;display: none;}
.homeSelectUl li{padding: 1rem;font-size: .9rem;display: flex;justify-content: flex-start;border-bottom: 1px solid #f8f8f8;align-items: center;}
.homeSelectUl li:active{background: #f0f0f0;}
.homeSelectUl li img{width: 2rem;max-height: 2rem;}
.homeSelectUl li em{padding-left: .5rem;font-size: .9rem;color: #000;}


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
.homeBg{width: 100%;height: 4.5rem;position: absolute;bottom: 0;left: 0;background:url(../../static/img/home_bg.png) no-repeat; background-size: 100% auto;}
.dingwei{width:2.2rem;height: 2.2rem;background: #fff;position: fixed;right: 1rem;bottom: 7rem;border-radius: 100%;text-align: center;line-height: 2.2rem;color: #3166fd;font-size: 1.3rem; }
.shuaxin{width:2.2rem;height: 2.2rem;background: #fff;position: fixed;right: 1rem;bottom: 7rem;border-radius: 100%;text-align: center;line-height: 2.2rem;color: #3166fd;font-size: 1.3rem; box-shadow: 0 0 5px #dedede;}
</style>
<style>
.BMap_cpyCtrl {display: none;}
.anchorBL {display: none;}
.homeMap button .mu-button-wrapper{flex-direction: column;}
</style>

