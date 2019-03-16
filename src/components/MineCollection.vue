<template>
  <div class="MineCollection">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="MineCollectionBox">
      <div class="MineCollectionNoData" v-if="!this.goodsSc">
        <img src="static/img/MineCollectionNo.png" width="60%" alt="">
        <p>您还没有任何收藏哦</p>
      </div>
      <div class="projectGoods" v-else>
        <a class="scHtml" v-for="(item,index) in goodsSc" :key="index">
          <em @click="removecollect(index,$event)" class="iconfont icon-collection-b active"></em>
          <router-link :to="{path:'/',query:{id:item.id,name:item.product_name}}" ><img :src="'../../'+item[0].product_picture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null" width="100%"></router-link>
          <p>{{item[0].product_name}}</p>
        </a>
      </div>
    </div>
  <Waitting v-if="waittinglook"></Waitting>
  </div>
</template>

<script>
import Nav from '@/components/nav'
import Waitting from '@/components/waitting'
import { watch } from 'fs';
export default {
  name: 'MineCollection',
  components:{Nav,Waitting},
  data () {
    return {
    // 我的收藏
    goodsSc:[],
    waittinglook:true,
    // 已收藏字符串
    collectionList:"",
    newCollectionList:[],
    // 用户Id
    userId:"",
    // 选中索引
    thisIndex:""
    }

  },
  created(){
    // 获取userId
    this.userId = this.getCookie("userId")
      let $this = this
            // 查询收藏
            this.$http.get('/palladium/inter/collections//selectAllCollections?userId='+ this.userId)
            .then(function (res) {
                $this.goodsSc = res.data.data
                $this.waittinglook = false
                if ($this.goodsSc == null) {
                } else {
                }
            })
            .catch(function (error) {
            })
  },


  methods:{
// 取消收藏
    removecollect(i,j){

       // 查询收藏
            let $this = this
            this.$http.get('/palladium/inter/collections//selectAllCollections?userId=' + this.userId)
            .then(function (res) {
                $this.getgoodsSc = res.data.data
                  
                  //获取收藏字符串
                  let str = "";
                  for (const item of $this.getgoodsSc) {
                    str += item[0].id + ",";
                  }
                  if (str.length > 0) {
                      str = str.substr(0,str.length - 1);
                  }
                  $this.collectionList = str
                  // 字符串转数组
                  $this.newCollectionList = $this.collectionList.split(",");

                  $this.newCollectionList.forEach( ( itBs, n ) => {
                      if (itBs == $this.goodsSc[i][0].id) {
                        $this.thisIndex = n
                       
                    } else {}
                  })

                  $this.newCollectionList.splice($this.thisIndex,1)
                  // 数组转字符串
                  $this.collectionList = $this.newCollectionList.join(",")

                  // 取消收藏请求
               $this.$http.get('/palladium/inter/collections/addCollections?userId='+ $this.userId +'&productId=' + $this.collectionList)
                    .then(function (res) {
                      if (res.data.code == 200) {
                        
                        $(j.target).parents(".scHtml").hide()
                      } else {
                        alert("内部服务器错误！")
                      }
                    })
                    .catch(function (error) {
                    })

            })
            .catch(function (error) {
              console.log(error.msg)
            })
    }
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.MineCollection{position: absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6;display: flex;flex-direction: column;}
.MineCollection{width:100%;height:100%;position: relative;overflow: hidden;overflow-y: auto;flex: 1;}


/* 产品列表 */
.projectGoods{display: flex;justify-content: space-between;flex-wrap:wrap;padding:0 .6rem;}
.projectGoods-y{overflow: hidden;height: 100%; overflow-y: auto;}
.projectGoods>a{display: block; width: 48%;background: #fff;border-radius: 10px;height: 10rem; margin: .5rem 0;text-align: center; position: relative;display: flex;flex-direction: column;
background: -webkit-linear-gradient(#fff, #e6e6e6); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#fff, #e6e6e6); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#fff, #e6e6e6); /* Firefox 3.6 - 15 */
    background: linear-gradient(#fff, #e6e6e6); /* 标准的语法 */}
     .projectGoods>a img{width: 70%}

.projectGoods>a em{padding: .4rem .8rem;font-size: 1.1rem;width: 3rem;position: absolute;top: 0;left: 0;}
.projectGoods>a em:active{transform:scale(1.2,1.2);}
.projectGoods>a em.active{color: #405efe;}
.projectGoods>a div{width: 100%;height: 100%;padding:0 2rem;height: 6rem;overflow: hidden;    justify-content: center;align-items: center;display: flex;margin-top: 1rem;}
.projectGoods>a p{text-align: center;padding: .8rem .4rem;color: #333;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.projectGoods-y>a p{font-size: .9rem;}






/* 无数据 */
.MineCollectionNoData{text-align: center;}
.MineCollectionNoData img{margin-top: 30%;}
.MineCollectionNoData p{margin-top: 1rem;font-size: .9rem;}






</style>


<style>
.mu-dialog-wrapper .searchDiong{background:#f0f0f0;}
</style>


