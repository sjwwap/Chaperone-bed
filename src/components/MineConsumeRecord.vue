<template>
  <div class="minecnsumeRecord">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="minecnsumeRecordBox">
      <div class="homeSelect" @click="homeSelect">
        {{selectTxt}}<i class="iconfont icon-sanjiaoshang"></i>
      </div>
      <div class="bodyrgba" @click="bodyrgbaCloseMc"></div>
      <ul class="homeSelectUl">
        <li @click="bodyrgbaCloseAll"><em>查看全部</em></li>
          <li @click="bodyrgbaClose($event,index)" v-for="(item,index) in selectList" :key="index"><em>{{item}}</em></li>
      </ul>
      
      <mu-tabs class="mineConsumerTab" :value.sync="active1" inverse color="primary" indicator-color="primary" full-width text-color="rgba(0, 0, 0, .54)"  center>
    <mu-tab>消费记录</mu-tab>/
    <!-- <mu-tab>退款记录</mu-tab>/ -->
    <mu-tab>押金记录</mu-tab>/
    <mu-tab>违约记录</mu-tab>
    </mu-tabs>
       <div class="mineConsumerBox" v-if="active1 === 0">
         <div v-if="this.RecordL == 0" style="text-align:center;padding-top:20%;">
          暂无消费记录！
         </div>
         <a class="mineConsumerList" @click="toconsumDetails($event,index)" v-for="(item,index) in RecordL" :key="index" v-else>
         <div>
           <div class="mineConsumerTitle">{{item.productName}}</div>
           <div class="mineConsumerCont">
             <div class="mineConsumerFlex">
             <div class="mineConsumerImg"><img :src="'../../'+item.productPicture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null" alt="" width="100%"></div>
             <div class="mineConsumerTxt">
               <p>订单编号：{{item.idd}}</p>
               <p v-if="item.statu == 2">结束时间：{{item.createTime}}</p>
               <p v-else>创建时间：{{item.createTime}}</p>
               <p v-if="item.statu == 0">订单状态：已创建</p>
               <p v-if="item.statu == 1">订单状态：未完成</p>
               <p v-if="item.statu == 2">订单状态：已完成</p>
               <p v-if="item.statu == 2">订单消费：{{item.money}}</p>
               <p v-else></p>
             </div>
             </div>
             <div class="mineConsumerBut">
               <div v-if="item.refundOrderType == 1">
               <mu-button  color="info" small>退款</mu-button>
               </div>
               <div v-if="item.securityOrderType == 1">
               <mu-button  color="primary" small>押金</mu-button>
               </div>
             </div>
           </div>
           </div>
         </a>
         <Waitting v-if="waittinglook"></Waitting>
       </div>

       <div class="mineConsumerBox" v-if="active1 === 1">
         <div v-if="this.RecordR == 0" style="text-align:center;padding-top:20%;">
          暂无押金记录！
         </div>
         <a class="mineConsumerList" @click="depositDetails($event,index)"  v-for="(item,index) in RecordR" :key="index" v-else>
           <div class="mineConsumerTitle">{{item.productName}}</div>
           <div class="mineConsumerCont">
             <div class="mineConsumerFlex">
             <div class="mineConsumerImg"><img :src="'../../'+item.productPicture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null" alt="" width="100%"></div>
             <div class="mineConsumerTxt mineCondepositTxt">
               <p>押金单号：{{item.securityOrderNo}}</p>
               <p v-if="item.statu == 1">退还时间：{{item.createTime}}</p>
               <p v-else>创建时间：{{item.createTime}}</p>
               <p v-if="item.statu == 0">押金状态：保证中</p>
               <p v-if="item.statu == 1">押金状态：已退还</p>
               <p>押金金额：{{item.money}}</p>
             </div>
             </div>
            
           </div>
         </a>
       </div>
       <div class="mineConsumerBox" v-if="active1 === 2">
         
        <div v-if="this.RecordW == 0" style="text-align:center;padding-top:20%;">
          暂无违约记录！
         </div>
         <a class="mineConsumerList" @click="abnormalDetails($event,index)"  v-for="(item,index) in RecordW" :key="index" v-else>
           <div>
           <div class="mineConsumerTitle">{{item.productName}}</div>
           <div class="mineConsumerCont">
             <div class="mineConsumerFlex">
             <div class="mineConsumerImg"><img :src="'../../'+item.productPicture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null" alt="" width="100%"></div>
             <div class="mineConsumerTxt">
               <p>订单编号：{{item.idd}}</p>
               <p>订单时间：{{item.createTime}}</p>
               <p v-if="item.statu == 0">订单状态：已创建</p>
               <p v-if="item.statu == 1">订单状态：未完成</p>
               <p v-if="item.statu == 2">订单状态：已完成</p>
               <p v-if="item.money==null">订单消费：￥0</p>
               <p v-else>订单消费：￥{{item.money}}</p>
             </div>
             </div>
           </div>
           </div>
         </a>
        
       </div>
    </div>
  </div>
</template>

<script>
import Waitting from '@/components/waitting'
export default {
  name: 'minecnsumeRecord',
  components:{Waitting},
  data () {
    return {
      waittinglook:false,
      active1: 0,
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


      selectTxt:"请选择产品分类...",


      // 用户信息
      userId:"",
      
      RecordLi:[],

      // 数组去重
      RecordArr:[],
      selectList:[],

      RecordL:[],
      RecordC:[],
      RecordR:[],
      RecordW:[],



      // 筛选
      RecordLs:[]



    }
  },

  created(){

    this.waittinglook = true

        // 获取userid
    this.userId = this.getCookie("userId")
    // this.userId = 114
    

          let $this = this
          this.$http.get('/palladium/inter/consumRecord/selectRecord?userId=' + this.userId +'')
                    .then(function (response) {
                      console.log(response)
                      $this.RecordLi = response.data.data
                      // 数组去重
                      for (var i=0;i<$this.RecordLi.length;i++){
                        $this.RecordArr.push($this.RecordLi[i].productName)
                      }
                      $this.selectList = $this.RecordArr.filter(function(element,index,self){
                      return self.indexOf(element) === index;
                      });

                      for (var i=0;i<$this.RecordLi.length;i++){
                        if ($this.RecordLi[i].remark == "消费") {
                          $this.RecordL.push($this.RecordLi[i])
                        } else if($this.RecordLi[i].remark == "退款"){
                          $this.RecordC.push($this.RecordLi[i])
                        }else if($this.RecordLi[i].remark == "押金"){
                          $this.RecordR.push($this.RecordLi[i])
                        }else{
                          $this.RecordW.push($this.RecordLi[i])
                        }
                        }

                        console.log($this.RecordW)
                        $this.waittinglook = false

                    })
                    .catch(function (error) {
                      console.log(error.msg)
                    })
  },
  methods:{

        homeSelect:function(){
      if ($(".homeSelectUl").css('display')=='none') {
        $(".bodyrgba").fadeIn();
        $(".homeSelect").addClass("homeSelectActive")
        // $(".homeSelect i").css("transform","rotate(180deg)")
        $(".homeSelectUl").fadeIn(0);
      } else {
        $(".bodyrgba").fadeOut();
        $(".homeSelect").removeClass("homeSelectActive")
        // $(".homeSelect i").css("transform","rotate(0)")
        $(".homeSelectUl").fadeOut(0);
      }
      
    },
    bodyrgbaCloseMc(){

      $(".bodyrgba").fadeOut(0);
      $(".homeSelect").removeClass("homeSelectActive")
      $(".homeSelectUl").hide(0);

    },
    bodyrgbaClose:function(e,s){

      this.selectTxt = this.selectList[s]

      this.RecordLs.splice(0)

      for (var a=0;a<this.RecordLi.length;a++){

          if (this.RecordLi[a].productName == $(e.target).text()) {
            this.RecordLs.push(this.RecordLi[a])
          }else{}

          }

          this.RecordL.splice(0)
          this.RecordC.splice(0)
          this.RecordR.splice(0)
          
          for (var i=0;i<this.RecordLs.length;i++){
              if (this.RecordLs[i].remark == "消费") {
                this.RecordL.push(this.RecordLs[i])
              } else if(this.RecordLs[i].remark == "退款"){
                this.RecordC.push(this.RecordLs[i])
              }else{
                this.RecordR.push(this.RecordLs[i])
              }
              }
     

      $(".bodyrgba").fadeOut(0);
      $(".homeSelect").removeClass("homeSelectActive")
      $(".homeSelectUl").hide(0);
    },

     bodyrgbaCloseAll(){

        this.selectTxt = "全部"

          this.RecordL.splice(0)
          this.RecordC.splice(0)
          this.RecordR.splice(0)

         for (var i=0;i<this.RecordLi.length;i++){
                        if (this.RecordLi[i].remark == "消费") {
                          this.RecordL.push(this.RecordLi[i])
                        } else if(this.RecordLi[i].remark == "退款"){
                          this.RecordC.push(this.RecordLi[i])
                        }else{
                          this.RecordR.push(this.RecordLi[i])
                        }
                        }

       $(".bodyrgba").fadeOut(0);
      $(".homeSelect").removeClass("homeSelectActive")
      $(".homeSelectUl").hide(0);
    
  },


  // 消费记录传值
  toconsumDetails(e,index){

    let RecordLRouteTo = {}
    RecordLRouteTo.money = this.RecordL[index].money
    RecordLRouteTo.statu = this.RecordL[index].statu
    RecordLRouteTo.productName = this.RecordL[index].productName
    RecordLRouteTo.createTime = this.RecordL[index].createTime
    RecordLRouteTo.manyType = this.RecordL[index].manyType
    RecordLRouteTo.idd = this.RecordL[index].idd
    RecordLRouteTo.transactionId = this.RecordL[index].transactionId
    RecordLRouteTo.productPicture = this.RecordL[index].productPicture
    RecordLRouteTo.orderTimeStatu = this.RecordL[index].orderTimeStatu
    
    console.log(RecordLRouteTo)
        this.$router.push({
              name:"MineConsumeDetails",
              params:{
                RecordLRouteTo:RecordLRouteTo,
                securityOrderNo:this.RecordL[index].securityOrderNo,
                userId:this.userId,
                clickTo:0,
              }
            });
  },


   // 异常订单传值
  abnormalDetails(e,index){

    let RecordLRouteTo = {}
    RecordLRouteTo.money = this.RecordW[index].money
    RecordLRouteTo.statu = this.RecordW[index].statu
    RecordLRouteTo.productName = this.RecordW[index].productName
    RecordLRouteTo.createTime = this.RecordW[index].createTime
    RecordLRouteTo.manyType = this.RecordW[index].manyType
    RecordLRouteTo.idd = this.RecordW[index].idd
    RecordLRouteTo.transactionId = this.RecordW[index].transactionId
    RecordLRouteTo.productPicture = this.RecordW[index].productPicture
    RecordLRouteTo.orderTimeStatu = this.RecordW[index].orderTimeStatu
    
    console.log(RecordLRouteTo)
        this.$router.push({
              name:"MineConsumeDetails",
              params:{
                RecordLRouteTo:RecordLRouteTo,
                securityOrderNo:this.RecordW[index].securityOrderNo,
                userId:this.userId,
                clickTo:0,
              }
            });
  },


  // 押金记录传值
  depositDetails(e,index){

    let RecordRRouteTo = {}
    RecordRRouteTo.money = this.RecordR[index].money
    RecordRRouteTo.statu = this.RecordR[index].statu
    RecordRRouteTo.productName = this.RecordR[index].productName
    RecordRRouteTo.createTime = this.RecordR[index].createTime
    RecordRRouteTo.manyType = this.RecordR[index].manyType
    RecordRRouteTo.idd = this.RecordR[index].idd
    RecordRRouteTo.transactionId = this.RecordR[index].transactionId
    RecordRRouteTo.productPicture = this.RecordR[index].productPicture

        this.$router.push({
              name:"MineConsumeDetails",
              params:{
                RecordRRouteTo:RecordRRouteTo,
                securityOrderNo:this.RecordR[index].securityOrderNo,
                userId:this.userId,
                clickTo:1
              }
            });
    
  },



  

    
  },

 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.minecnsumeRecord{position: absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6;display: flex;flex-direction: column;}
.minecnsumeRecordBox{width:100%;height:100%;position: relative;overflow: hidden; background: #f6f6f6;display: flex;flex-direction: column;}



.homeSelect{width: 94%;height: 3rem;position: absolute;top: 1rem;left: 3%; background: #fff;z-index: 99999;border-radius:50px;line-height: 3.1rem;text-indent: 1rem;font-size: .9rem;color: #999;border-bottom: 1px solid #f0f0f0;}
.homeSelect i{position: absolute;right: 1rem;transform: rotate(180deg);}
.homeSelectActive{border-bottom-left-radius: 0;border-bottom-right-radius: 0;border-top-left-radius: 0px;border-top-right-radius: 0px;}


.bodyrgba{position: fixed;top: 0;bottom: 0;right: 0;left: 0;background: rgba(0,0,0,0.2);z-index: 99996;display: none;}
.homeSelectUl{width: 94%;position: absolute; max-height: 22rem;background: #fff;left: 3%;top:4rem;z-index: 99999;border-radius: 0px;overflow: hidden;overflow-y: auto;display: none;}
.homeSelectUl li{padding: 1rem;font-size: .9rem;display: flex;justify-content: flex-start;border-bottom: 1px solid #f8f8f8;}
.homeSelectUl li:active{background: #f0f0f0;}
.homeSelectUl li img{width: 2rem;height: 2rem;}
.homeSelectUl li em{padding-top: .3rem;padding-left: .5rem;font-size: .9rem;color: #000;}


.mineConsumerTab{margin: 0 .2rem; padding-top: 4.8rem;background: transparent;}
.mineConsumerBox{padding: .8rem .5rem;height: 100%;overflow: hidden;overflow-y: auto;margin-top: .4rem;}
.mineConsumerBox a{background: #fff;display: block;display: flex;flex-direction: column;margin-bottom: .7rem;}
.mineConsumerTitle{font-size: .9rem;color: #333333;padding: .8rem;}
.mineConsumerCont{display: flex;justify-content: space-between;padding: .8rem .8rem;padding-top: 0;}
.mineConsumerFlex{display: flex;justify-content:flex-start;width: 80%;}
.mineConsumerImg{min-width: 4rem;max-width: 4rem; height: 4rem;background: #f6f6f6;overflow: hidden;display: flex; align-items: center;}
.mineConsumerTxt{padding-left: .5rem;line-height: 1rem;width: 75%;}
.mineCondepositTxt{width: 100%;}
.mineConsumerTxt p{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.mineConsumerBut{display: flex;justify-content: center;flex-direction: column;}
.mineConsumerBut button{margin-top: .4rem;}
</style>


