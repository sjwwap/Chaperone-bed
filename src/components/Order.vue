<template>
  <div class="order">
    <div v-wechat-title="$route.meta.title"></div>
    <mu-tabs class="orderTab" :value.sync="active1" inverse color="primary" indicator-color="primary" full-width text-color="rgba(0, 0, 0, .54)"  center>
    <mu-tab>进行中</mu-tab>
    <mu-tab>已完成</mu-tab>
  </mu-tabs>
    <div class="orderBox">

       
  <div class="demo-text" v-if="active1 === 0">

    
    
    
    <div v-if="this.OrderLiA.length > 0">
      <div v-for="(item,index) in OrderLeft" :key="index">
      <div class="orderTitle orderTitlea">
        <a><b>|</b>{{item.productName}}</a><a @click="orderPast($event)" class="iconfont icon-xiangyou-copy"></a>
      </div>
      <div class="orderUL">
        <a class="orderlist" @click="toorderDettailsA(item.data,drag)" v-for="(pri,drag) in item.data" :key="drag">
          <div style="width:100%;height:100%;padding:.5rem;">
          <div class="orderULtit">
            <img :src="'../../'+pri.productPicture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null" width="32px" height="32px">
            <h3>{{pri.productName}}{{pri.transactionId}}</h3>
          </div>
          <p>编号：{{pri.id}}</p>
          <p v-if="pri.statu == 0">状态：已创建</p>
          <p v-if="pri.statu == 1">状态：进行中</p>
          <p v-if="pri.statu == 2">状态：已完成</p>
          </div>
        </a>
      </div>
      </div>

    </div>
    <div v-else style="text-align:center;padding-top:20%;">
          暂无进行中订单！
    </div>

      






  </div>
  <div class="demo-text" v-if="active1 === 1">

    <div v-if="this.OrderLiB.length > 0">

         <div  v-for="(item,index) in OrderRight" :key="index">
      <div class="orderTitle orderTitleb">
        <a><b>|</b>{{item.productName}}</a><a @click="orderFold($event)" class="iconfont icon-xiangyou-copy"></a>
      </div>
      <div class="orderUL">
        <a class="orderlist" @click="toorderDettailsB(item.data,drag)" v-for="(pri,drag) in item.data" :key="drag">
        <div style="width:100%;height:100%;padding:.5rem;">
          <div class="orderULtit">
            <img :src="'../../'+pri.productPicture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null" width="32px" height="32px">
            <h3>{{pri.productName}}</h3>
          </div>
          <p>编号：{{pri.id}}</p>
          <p v-if="pri.statu == 0">状态：已创建</p>
          <p v-if="pri.statu == 1">状态：进行中</p>
          <p v-if="pri.statu == 2">状态：已完成</p>
          </div>
        </a>
      </div>
      </div>

    </div>

    <div v-else style="text-align:center;padding-top:20%;">
          暂无已完成订单！
    </div>
    
    

      <!-- <div class="orderTitle">
        <a><b>|</b>共享陪护床</a><a @click="orderFold($event)" class="iconfont icon-xiangyou-copy"></a>
      </div>
      <div class="orderUL orderUlColorA">
        <router-link to="/OrderDetails" v-for="(item,index) in orderList" :key="index">
          <div class="orderULtit">
            <img :src="item.srcurl" width="32px" height="32px">
            <h3>{{item.name}}</h3>
          </div>
          <p>编号：{{item.number}}</p>
          <p>状态：{{item.state}}</p>
        </router-link>
      </div> -->

  </div>


  <!-- 预加载 -->
      <div class="orderLoad" v-show="loadingState">
        <div class="orderLoadtitle"></div>
        <div class="orderLoadUl">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </div>
      </div>



    </div>
    <Nav></Nav>
    
  </div>
</template>

<script>
import Nav from '@/components/nav'
export default {
  name: 'order',
  components:{Nav},
  data () {
    return {

      loadingState:true,

      active1: 0,
      openId:"",
      OrderLiA:[],
      OrderLiB:[],

      OrderLeft:[],
      OrderRight:[],

      userId:"",


      timeData:""
      

      
    }
  },
  created(){
    this.openId = this.getCookie("openId")
    this.userId = this.getCookie("userId")

    let $this = this
     this.$http.get('/palladium/inter/userOrdering/selectOrderingRecord?userId='+this.userId)
                    .then(function (response) {
                      console.log(response)
                      $this.OrderLiA = response.data.data
                      $this.OrderLiB = response.data.data2
                      var mapa = {},
                        OrderLeft = [];
                    for(var i = 0; i < $this.OrderLiA.length; i++){
                        var aia = $this.OrderLiA[i];
                        if(!mapa[aia.productName]){
                          OrderLeft.push({
                            productName: aia.productName,
                                data: [aia]
                            });
                            mapa[aia.productName] = aia;
                        }else{
                            for(var j = 0; j < OrderLeft.length; j++){
                                var dja = OrderLeft[j];
                                if(dja.productName == aia.productName){
                                    dja.data.push(aia);
                                    break;
                                }
                            }
                        }
                    }
                    $this.OrderLeft = OrderLeft



                     var mapb = {},
                        OrderRight = [];
                    for(var i = 0; i < $this.OrderLiB.length; i++){
                        var aib = $this.OrderLiB[i];
                        if(!mapb[aib.productName]){
                          OrderRight.push({
                            productName: aib.productName,
                                data: [aib]
                            });
                            mapb[aib.productName] = aib;
                        }else{
                            for(var j = 0; j < OrderRight.length; j++){
                                var djb = OrderRight[j];
                                if(djb.productName == aib.productName){
                                    djb.data.push(aib);
                                    break;
                                }
                            }
                        }
                    }
                    $this.OrderRight = OrderRight


                    $this.loadingState = false

                    })
                    .catch(function (error) {
                    })

   
  },
 
  methods:{


     // 进行中
      orderPast:function(event){
        let oRderButa =  $(event.target).parents(".orderTitlea").next()
        oRderButa.slideToggle(0)
        if (oRderButa.is(':hidden')) {
          $(event.target).css("transform","rotate(0deg)");
        } else {
          $(event.target).css("transform","rotate(90deg)");
        }
      },
    

      // 已完成
      orderFold:function(event){
        let oRderButb =  $(event.target).parents(".orderTitleb").next()
        oRderButb.slideToggle(0)
        if (oRderButb.is(':hidden')) {
          $(event.target).css("transform","rotate(0deg)");
        } else {
          $(event.target).css("transform","rotate(90deg)");
        }
      },

      // 进行中
      toorderDettailsA(thisData,i){
        let orderNo = thisData[i].id
          this.$router.push({
              name:"OrderDetails",
              params:{
                orderNo:orderNo,
                end:false
            }
            })
      },
      // 已完成
      toorderDettailsB(thisData,i){
        let orderNo = thisData[i].id
          this.$router.push({
              name:"OrderDetails",
              params:{
                orderNo:orderNo,
                end:true
              }
            })
      }

    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.order{position: absolute;top:0;bottom:0;left:0;right:0;background:#fff;display: flex;flex-direction: column;}
.orderBox{width:100%;height:100%;position: relative;overflow: hidden;overflow-y: auto; background: #fff;border-bottom: 1px solid #e6e6e6;}

/* 订单标题 */
.orderTitle{display: flex;justify-content: space-between;padding:.1rem .6rem;margin-top: 1rem;}
.orderTitle a{font-size: 1rem;color: #333;text-indent: .2rem;}
.orderTitle a b{font-size: 1.2rem;padding-right: .4rem}
.orderTitle a:nth-child(2){color: #999;font-weight: 700;width: 1.4rem;height: 1.4rem;transform:rotate(90deg);}

/* 订单列表 */
.orderUL{display: flex;justify-content: space-between;flex-wrap:wrap;padding:0 .6rem;margin-bottom: 2rem;}
.orderUL>a{width: 48.5%;border: 1px solid #e6e6e6;border-radius:5px; margin-top:.8rem;position: relative;display: flex;flex-direction: column;}
.orderULtit{display: flex;justify-content: flex-start;margin-bottom: .3rem;}
.orderULtit h3{font-size:.9rem;padding-top: .3rem;padding-left: .3rem;font-weight: 600;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.orderULtit img{border-radius: 100%;overflow: hidden;min-width: 32px;height: 32px;}
.orderUL p{overflow:hidden;white-space:nowrap;text-overflow:ellipsis; }







/* 预加载 */
.orderLoad{position: absolute; top: 0;left: 0;right: 0;bottom: 0;background: #fff;padding: 1rem;overflow: hidden;}
.orderLoadtitle{width: 100%;height: 2.4rem;background: #f7f7f7;}
.orderLoadUl{display: flex;justify-content: space-between;flex-wrap:wrap;padding:1rem 0;}
.orderLoadUl li{width: 48%;height:6rem;background: #f7f7f7;border-radius: 5px;margin-bottom: 1rem;}
</style>


