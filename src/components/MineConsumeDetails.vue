<template>
  <div class="MineConsumeDetails">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="MineConsumeDetailsBox">

    <div class="OrderDetailsBox" v-if="this.$route.params.clickTo == 0">
      <div class="mineConsumerTitle">消费记录</div>
      <div class="orderDiv">
        <img :src="'../../'+this.$route.params.RecordLRouteTo.productPicture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null" width="50px">
        <p v-if="this.$route.params.RecordLRouteTo.statu == 2">￥{{this.$route.params.RecordLRouteTo.money}}</p>
        <p v-else></p>
      </div>
      <div class="orderDetailsUl">
        <li>
          <em>当前状态</em>
          <em v-if="this.$route.params.RecordLRouteTo.statu == 0">已创建</em>
          <em v-if="this.$route.params.RecordLRouteTo.statu == 1">未完成</em>
          <em v-if="this.$route.params.RecordLRouteTo.statu == 2">已完成</em>
        </li>
        <li>
          <em>商品名称</em><em>{{this.$route.params.RecordLRouteTo.productName}}</em>
        </li>
        <li v-if="this.$route.params.RecordLRouteTo.orderTimeStatu == 0">
          <em>租赁类型</em><em>长租</em>
        </li>
        <li v-if="this.$route.params.RecordLRouteTo.orderTimeStatu == 1">
          <em>租赁类型</em><em>短租</em>
        </li>
        <li v-if="this.$route.params.RecordLRouteTo.statu == 2">
          <em>结束时间</em><em>{{this.$route.params.RecordLRouteTo.createTime}}</em>
        </li>
        <li v-else>
          <em>创建时间</em><em>{{this.$route.params.RecordLRouteTo.createTime}}</em>
        </li>
        <li>
          <em>支付方式</em><em v-if="this.$route.params.RecordLRouteTo.manyType == 0">微信</em><em v-if="this.$route.params.RecordLRouteTo.manyType == 1">支付宝</em>
        </li>
        <li>
          <em>订单编号</em><em>{{this.$route.params.RecordLRouteTo.idd}}</em>
        </li>
        <li v-if="this.$route.params.RecordLRouteTo.statu == 2">
          <em>消费流水</em><em>{{this.$route.params.RecordLRouteTo.transactionId}}</em>
        </li>
      </div>
    </div>

    <!-- 押金查询 -->
    <div class="OrderDetailsBox" v-if="this.$route.params.clickTo == 0 && this.$route.params.securityOrderNo > 0">
      <div class="mineConsumerTitle">押金记录</div>
      <div class="orderDiv">
        <img :src="'../../'+ detailsListView.productPicture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null" width="50px">
        <p>￥{{detailsListView.money}}</p>
      </div>
      <div class="orderDetailsUl">
        <li>
          <em>押金状态</em>
          <em v-if="this.detailsListView.statu == 0">保证中</em>
          <em v-if="this.detailsListView.statu == 1">已退还</em>
        </li>
        <li>
          <em>商品名称</em><em>{{detailsListView.productName}}</em>
        </li>
        
        <li v-if="this.detailsListView.statu == 1">
          <em>退还时间</em><em>{{detailsListView.createTime}}</em>
        </li>
        <li v-else>
          <em>创建时间</em><em>{{detailsListView.createTime}}</em>
        </li>
        <li>
          <em>退款账户</em><em v-if="this.detailsListView.manyType == 0">微信</em><em v-if="this.detailsListView.manyType == 1">支付宝</em>
        </li>
        <li>
          <em>押金单号</em><em>{{detailsListView.securityOrderNo}}</em>
        </li>
      </div>
    </div>

      <!-- 押金单独 -->
    <div class="OrderDetailsBox" v-if="this.$route.params.clickTo == 1">
      <div class="mineConsumerTitle">押金记录</div>
      <div class="orderDiv">
        <img :src="'../../'+this.$route.params.RecordRRouteTo.productPicture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null" width="50px">
        <p>￥{{this.$route.params.RecordRRouteTo.money}}</p>
      </div>
      <div class="orderDetailsUl">
        <li>
          <em>押金状态</em>
          <em v-if="this.$route.params.RecordRRouteTo.statu == 0">保证中</em>
          <em v-if="this.$route.params.RecordRRouteTo.statu == 1">已退还</em>
        </li>
        <li>
          <em>商品名称</em><em>{{this.$route.params.RecordRRouteTo.productName}}</em>
        </li>
        
        <li v-if="this.$route.params.RecordRRouteTo.statu == 1">
          <em>退还时间</em><em>{{this.$route.params.RecordRRouteTo.createTime}}</em>
        </li>
        <li v-else>
          <em>创建时间</em><em>{{this.$route.params.RecordRRouteTo.createTime}}</em>
        </li>
        <li>
          <em>退款账户</em><em v-if="this.$route.params.RecordRRouteTo.manyType == 0">微信</em><em v-if="this.$route.params.RecordRRouteTo.manyType == 1">支付宝</em>
        </li>
        <li>
          <em>押金单号</em><em>{{this.$route.params.securityOrderNo}}</em>
        </li>
      </div>
    </div>

 
     

    </div>
  </div>
</template>

<script>
export default {
  name: 'MineConsumeDetails',
  data () {
    return {

      detailsListA:[],
      detailsListB:[],
      detailsListView:{
        productPicture:"",
        money:"",
        statu:"",
        productName:"",
        createTime:"",
        manyType:"",
        idd:""
        },

     
    }
  },
  created(){
    // this.$route.params.userId = 114
     let $this = this
     this.$http.get('/palladium/inter/consumRecord/selectRecordByOrderId?userId='+ this.$route.params.userId +'&securityOrderNo='+ this.$route.params.securityOrderNo +'')
                    .then(function (response) {
                       for (var i=0;i<response.data.data.length;i++){
                      if (response.data.data[i].remark == "退款") {
                        $this.detailsListA.push(response.data.data[i])
                      }else if(response.data.data[i].remark == "押金"){
                        $this.detailsListB.push(response.data.data[i])
                      }
                      }

                      $this.detailsListView.productPicture = $this.detailsListB[0].productPicture
                      $this.detailsListView.money = $this.detailsListB[0].money
                      $this.detailsListView.statu = $this.detailsListB[0].statu
                      $this.detailsListView.productName = $this.detailsListB[0].productName
                      $this.detailsListView.createTime = $this.detailsListB[0].createTime
                      $this.detailsListView.manyType = $this.detailsListB[0].manyType
                      $this.detailsListView.securityOrderNo = $this.detailsListB[0].securityOrderNo

                    })
                    .catch(function (error) {
                      console.log(error.msg)
                    })
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.MineConsumeDetails{position: absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6;display: flex;flex-direction: column;}
.MineConsumeDetailsBox{width:100%;height:100%;position: relative;overflow: hidden; background: #f6f6f6;padding: .5rem;overflow-y: auto;}

.OrderDetailsBox{ background: #fff;display: block; display: flex;flex-direction: column;margin-bottom: .7rem;padding: 0 .5rem;}
.mineConsumerTitle{font-size: .9rem;color: #333333;padding: .8rem;}
.mineConsumerCont{display: flex;justify-content: space-between;padding: .8rem .8rem;padding-top: 0;}


.orderDiv{border-bottom: 1px solid #eeeeee; text-align: center;padding-bottom: 2rem;}
.orderDiv p{font-size: 1rem;}
.orderDiv img{margin-top: 1rem;}

.orderDetailsUl{padding: 1rem .5rem;}
.orderDetailsUl li{display: flex;justify-content: space-between;padding: .6rem 0;}
.orderDetailsUl li em{font-size: .8rem;}

</style>


