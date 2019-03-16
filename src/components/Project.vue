<template>
  <div class="project">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="projectBoxdata" v-if="this.projectUl == null">
      <div class="MineCollectionNoData">
        <img src="static/img/MineCollectionNo.png" width="60%" alt="">
        <p>暂无产品数据！</p>
      </div>
    </div>

    <div class="projectBoxdata" v-else>
   <div class="search">
      <div class="searchBox" @click="toSearch"><em>请输入关键字</em><i class="iconfont icon-fangdajing"></i></div>
    </div>
    <div class="projectBox">

       <div class="projectUl" >
        <div v-for="(item,index) in projectUl" :key="index" @click="proAli(index)" class="projectLi">{{item.product_name}}<img src="static/img/icon/project-right.png"></div>
      </div>
      <div class="projectTitle" v-if="this.goodsScData == 200">我的收藏</div>
      <!-- Swiper -->
      <div class="swiper-container"  v-if="this.goodsScData == 200">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item,index) in goodsSc" :key="index">
            <img :src="'../../'+item[0].product_picture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null"><router-link :to="{path:'/',query:{id:item[0].id,name:item[0].product_name}}">#{{item[0].product_name}}#</router-link>
          </div>
        </div>
      </div>

      <div class="projectTitle">{{projectUltitle}}</div>

      <div class="nodata" v-if="!this.proList">
        无产品数据！{{proList}}
      </div>

      <div class="projectGoods" v-else>
        <a v-for="(item,index) in proList" :key="index">
          <em @click="removecollect(index)" v-if="item.scList == true" class="iconfont icon-collection-b active"></em>
          <em @click="addcollect(index)" v-else class="iconfont icon-collection-b"></em>
          <router-link :to="{path:'/',query:{id:item.id,name:item.product_name}}"><img :src="'../../'+item.product_picture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null" width="100%">
           </router-link>
         <p>{{item.product_name}}</p>
        </a>
      </div>
    </div>
    </div>
    <Nav></Nav>
    <Tips v-if="tipss" :message="messagetitle"></Tips>


    <!-- 搜索 -->
    <mu-dialog dialog-class="searchDiong" width="360" transition="slide-bottom" fullscreen :open.sync="searchbox">
    <div class="searchDiongBox">
      <div class="searchHead" style="padding:1rem 1rem 1rem 0rem">
      <a @click="closesearchDialog" class="iconfont icon-xiangyou-copy"></a>
      <div class="searchBox"><input class="searchPro" type="text" placeholder="请输入关键字" v-model="inputa"><i @click="search(inputa)" class="iconfont icon-fangdajing"></i></div>
      </div>

      <div class="projectGoods projectGoods-y">
      <div class="nodata" v-if="this.searchLi == null">
        无产品数据！
      </div>
        <a v-else v-for="(item,index) in searchLi" :key="index">
          <div><img :src="'../../'+item.product_picture" onerror="javascript:this.src='static/img/noimg.png';this.onerror = null" width="100%"></div>
          <p>{{item.product_name}}</p>
          <router-link :to="{path:'/',query:{id:item.id,name:item.product_name}}" class="iconfont icon-jiahao"></router-link>
        </a>
      </div>
      
    </div>
  </mu-dialog>

    <!-- 预加载 -->
      <div class="projectLoad"  v-show="loadingState">
        <div class="projectLoadsearch"></div>
        <div class="projectLoadUl">
          <li></li>
          <li></li>
          <li></li>
        </div>
        <div class="projectLoadTitle"></div>
        <div class="projectLoadBox">
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
</template>

<script>
import Nav from '@/components/nav'
import Tips from '@/components/tips'
import Loading from '@/components/loading'
import { watch } from 'fs';
export default {
  name: 'Home',
  components:{Nav,Tips,Loading},
  data () {
    return {
      // loading
      loadingState:false,

      // diong
      searchbox:false,

      // tips
      tipss:false,
      messagetitle:"",
      protitlename:"人气单品",
 
    inputa:"",
    projectUl:[],

    projectUltitle:"共享充电桩",

    proList:[],


    // 我的收藏
    goodsSc:[],
    goodsScData:null,

    // 搜索结果
    searchLi:[],

    // 产品Id
    proid:"",

    // 已收藏字符串
    collectionList:"",
    newCollectionList:[],

    // cookie
      userId:"",


      goodScstate:0


   
    }

  },
  created(){

   this.loadingState = true
        // userId
    this.userId = this.getCookie("userId")


      // 查询分类
      let $this = this
      this.$http.get('/palladium/inter/product/productList')
            .then(function (response) {
              
              $this.projectUl = response.data.data
              if (response.data.code == 300) {
                alert("分类无数据！")
              } else {
                
            // 查询收藏
            $this.$http.get('/palladium/inter/collections//selectAllCollections?userId='+ $this.userId)
            .then(function (res) {
              console.log(res)
              
                if (res.data.code == 300) {
                  $this.goodsScData = res.data.code
                } else {
                  $this.goodsScData = res.data.code
                  $this.goodsSc = res.data.data
                  // 获取收藏字符串
                  let str = "";
                  for (const item of $this.goodsSc) {
                    str += item[0].id + ",";
                  }
                  if (str.length > 0) {
                      str = str.substr(0,str.length - 1);
                  }
                  $this.collectionList = str
                  // 字符串转数组
                  $this.newCollectionList = $this.collectionList.split(",");
                }
                  
                 // 展示默认分类
            $this.$http.get('/palladium/inter/product/productListByPid?parentProductId='+$this.projectUl[0].id)
            .then(function (res) {
              $this.loadingState = false
              $this.proList = res.data.data
              // 查询是否收藏
              let haveNumber = "a"
              for(let i=0; i<$this.proList.length; i++){
                let str = ""
                str += $this.proList[i].id
                haveNumber = $this.newCollectionList.indexOf(str)
                if (haveNumber > 0 || haveNumber == 0) {
                  $this.$set($this.proList[i],"scList", true)
              } else if(haveNumber == -1){
                 $this.$set($this.proList[i],"scList", false)
              }
              }

              
            })
            .catch(function (error) {
            })

              // 渲染swiper
              $(function(){
              var swiper = new Swiper('.swiper-container', {
                  spaceBetween: 8,
                  slidesPerView: 2.4,
                  centeredSlides: false,
                  grabCursor: true,
                })
              })




                


                
            })
            .catch(function (error) {
            })





                
              }


            



           


            })
            .catch(function (error) {
              console.log(error.msg)
            })


            
            

   
  },
mounted(){
    

   
  
},



  methods:{


    // 添加收藏
    addcollect(i){
      this.$set(this.proList[i],"scList", true)
      // 查询收藏
            let $this = this
            this.$http.get('/palladium/inter/collections//selectAllCollections?userId=' + this.userId)
            .then(function (res) {

                if (res.data.data == null) {
                $this.collectionList += $this.proList[i].id
                $this.newCollectionList = $this.collectionList.split(",")
                 // 添加收藏请求
               $this.$http.get('/palladium/inter/collections/addCollections?userId='+ $this.userId +'&productId=' + $this.collectionList)
                    .then(function (res) {
                      if (res.data.code == 200) {
                        
                      } else {
                        alert("内部服务器错误！")
                      }
                    })
                    .catch(function (error) {
                    })
                } else {
                  
                  // 获取收藏字符串
                  let str = "";
                  for (const item of res.data.data) {
                    str += item[0].id + ",";
                  }
                  if (str.length > 0) {
                      str = str.substr(0,str.length - 1);
                  }
                  $this.collectionList = str
                  // 字符串转数组
                  $this.newCollectionList = $this.collectionList.split(",");
                  
                // 查询是否收藏    
                let haveNumber = "a"
                let strNew = ""
                strNew += $this.proList[i].id
                haveNumber = $this.newCollectionList.indexOf(strNew)
                
                if (haveNumber > 0 || haveNumber == 0) {
                alert("已收藏过了！")
              } else if(haveNumber == -1){
                
                // 添加收藏至字符串
                if ($this.collectionList.length == 0) {
                  $this.collectionList += $this.proList[i].id
                } else {
                  $this.collectionList += "," + $this.proList[i].id
                }
                 $this.newCollectionList = $this.collectionList.split(",")

                // 添加收藏请求
               $this.$http.get('/palladium/inter/collections/addCollections?userId='+ $this.userId +'&productId=' + $this.collectionList)
                    .then(function (res) {
                      if (res.data.code == 200) {
                        
                      } else {
                        alert("内部服务器错误！")
                      }
                    })
                    .catch(function (error) {
                    })
                
              }
                }
            })
            .catch(function (error) {
              console.log(error.msg)
            })
    },

    removecollect(i){
      this.$set(this.proList[i],"scList", false)
      // 查询收藏
            let $this = this
            this.$http.get('/palladium/inter/collections//selectAllCollections?userId='+ this.userId)
            .then(function (res) {
                  
                  // 获取收藏字符串
                  let str = "";
                  for (const item of res.data.data) {
                    str += item[0].id + ",";
                  }
                  if (str.length > 0) {
                      str = str.substr(0,str.length - 1);
                  }
                  $this.collectionList = str
                  // 字符串转数组
                  $this.newCollectionList = $this.collectionList.split(",");

                  
                // 查询是否收藏    
                let haveNumber = "a"
                let strNew = ""
                strNew += $this.proList[i].id
                haveNumber = $this.newCollectionList.indexOf(strNew)
                if (haveNumber == 0 || haveNumber > 0) {
                  
                  // 删除字符串
                  $this.newCollectionList.splice(haveNumber,1)
                  // 数组转字符串
                  $this.collectionList = $this.newCollectionList.join(",")
                }
              else if(haveNumber == -1){
                
               alert("请先收藏产品！")
                
              }



                // 取消收藏请求
               $this.$http.get('/palladium/inter/collections/addCollections?userId='+ $this.userId +'&productId=' + $this.collectionList)
                    .then(function (res) {
                      if (res.data.code == 200) {
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

    },

    // 产品tab切换
    proAli:function(e){

      this.projectUltitle = this.projectUl[e].product_name

      let $this = this
       this.$http.get('/palladium/inter/product/productListByPid?parentProductId='+this.projectUl[e].id+'&userId=' + this.userId)
            .then(function (res) {
             $this.proList = res.data.data

              // 查询收藏
            $this.$http.get('/palladium/inter/collections//selectAllCollections?userId='+ $this.userId)
            .then(function (res) {
                $this.goodsSc = res.data.data
                if ($this.goodsSc == null) {
                } else {
                  // 获取收藏字符串
                  let str = "";
                  for (const item of $this.goodsSc) {
                    str += item[0].id + ",";
                  }
                  if (str.length > 0) {
                      str = str.substr(0,str.length - 1);
                  }
                  $this.collectionList = str
                  // 字符串转数组
                  $this.newCollectionList = $this.collectionList.split(",");

                   //  查询是否收藏
                  let haveNumber = "a"
                  for(let i=0; i<$this.proList.length; i++){
                      let strNew = ""
                      strNew += $this.proList[i].id
                      haveNumber = $this.newCollectionList.indexOf(strNew)
                      if (haveNumber > 0 || haveNumber == 0) {
                      $this.$set($this.proList[i],"scList", true)
                    } else if(haveNumber == -1){
                      $this.$set($this.proList[i],"scList", false)
                    }
                    }
                }

                 // 渲染swiper
              $(function(){
              var swiper = new Swiper('.swiper-container', {
                  spaceBetween: 8,
                  slidesPerView: 2.4,
                  centeredSlides: false,
                  grabCursor: true,
                })
              })
               

             
            })
            .catch(function (error) {
            })
            
            }).catch(function (error) {
              console.log(error.msg)
            })
     
      
    },

    // 产品搜索按钮
    search(e){
      this.projectUltitle = "搜索结果"
      let $this = this
      this.$http.get('/palladium/inter/product/productListByName?userId='+ this.userId +'&productName='+ e)
            .then(function (res) {
              $this.searchLi = res.data.data

              //  查询是否收藏
             let haveNumber = "a"
             for(let i=0; i<$this.searchLi.length; i++){
                let str = ""
                str += $this.searchLi[i].id
                haveNumber = $this.newCollectionList.indexOf(str)
                if (haveNumber > 0 || haveNumber == 0) {
                $this.searchLi[i].scList = true
              } else if(haveNumber == -1){
                $this.searchLi[i].scList = false
              }
              }

            })
            .catch(function (error) {
              console.log(error.msg)
            })
    },

    // 打开搜索
    toSearch(){
      this.searchbox = true
      setTimeout(function(){
        $("input").focus();
      },200);
     
    },

    // 关闭弹窗
    closesearchDialog(){
      this.searchbox = false
    }
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.project{position: absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6;display: flex;flex-direction: column;}

/* 无数据 */
.projectBoxdata{width: 100%;flex: 1; display: flex; flex-direction: column;}
.MineCollectionNoData{text-align: center;}
.MineCollectionNoData img{margin-top: 30%;}
.MineCollectionNoData p{margin-top: 1rem;font-size: .9rem;}

/* 产品搜索 */
.search{width: 100%;padding:.8rem .6rem 2rem .6rem;position: absolute;top:0;left: 0;z-index: 99;
 background: -webkit-linear-gradient(#f6f6f6, transparent); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#f6f6f6, transparent); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#f6f6f6, transparent); /* Firefox 3.6 - 15 */
    background: linear-gradient(#f6f6f6, transparent); /* 标准的语法（必须放在最后） */}
.searchBox{background: #fff;border: 1px solid #eeeeee;width: 100%;height: 2.8rem;border-radius: 50px;position: relative;}
.searchBox em{line-height: 2.8rem; padding-left: 1rem;}
.searchBox input{width: 85%;height: 2.7rem;border-radius: 50px;text-indent: 1rem;font-size: .8rem;}
.searchBox i{position: absolute;right: 1rem;top: 0.4rem;font-size: 1.3rem;}

/* 产品分类 */
.projectUl{width: 100%;padding:0 .4rem;display: flex;justify-content:space-around;margin-top: 4.8rem;}
.projectLi{width: 32%;height: 4rem;border-radius: 5px;color: #fff;font-size:.9rem; position: relative;padding:.4rem;}
.projectLi img:nth-child(1){width: 1rem;position: absolute;left: .5rem;bottom: .8rem;}
.projectLi img:nth-child(2){width: 1.8rem;position: absolute;right: .5rem;bottom: .4rem;}
.projectUl div:nth-child(1){background: #fec92c url(../../static/img/icon/project-num1.png) right bottom no-repeat;background-size: 25%;background-position: 95% 80%;}
.projectUl div:nth-child(2){background: #fe7b57 url(../../static/img/icon/project-num2.png) right bottom no-repeat;background-size: 25%;background-position: 95% 80%;}
.projectUl div:nth-child(3){background: #3555fe url(../../static/img/icon/project-num3.png) right bottom no-repeat;background-size: 25%;background-position: 95% 80%;}

/* 产品标题 */
.projectTitle{width: 100%;padding:1rem .8rem;font-weight: 800;padding-bottom: 0;font-size: .9rem;}

/* 产品列表 */
.projectGoods{display: flex;justify-content: space-between;flex-wrap:wrap;padding:0 .6rem;}
.projectGoods-y{overflow: hidden;height: 100%; overflow-y: auto;}
.projectGoods>a{display: block; width: 48%;background: #fff;text-align: center; border-radius: 10px;height: 10rem; margin: .5rem 0;position: relative;display: flex;flex-direction: column;
background: -webkit-linear-gradient(#fff, #e6e6e6); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#fff, #e6e6e6); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#fff, #e6e6e6); /* Firefox 3.6 - 15 */
    background: linear-gradient(#fff, #e6e6e6); /* 标准的语法 */}
    .projectGoods>a>a{width: 5.6rem;height: 5.6rem;display: flex;align-items: center;margin: 3rem auto 1rem auto;justify-content: center;}
    .projectGoods>a img{width: 70%}
    

.projectGoods>a em{padding: .4rem .8rem;font-size: 1.1rem;width: 3rem;position: absolute;top: 0;left: 0;}
.projectGoods>a em:active{transform:scale(1.2,1.2);}
.projectGoods>a em.active{color: #405efe;}
.projectGoods>a div{width: 100%;height: 100%;padding:0 2rem;height: 6rem;overflow: hidden;    justify-content: center;align-items: center;display: flex;margin-top: 1rem;}
.projectGoods>a p{text-align: center;padding: .8rem .4rem;color: #333;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.projectGoods-y>a p{font-size: .9rem;}



.projectBox{width:100%;height:100%;position: relative;overflow: hidden;overflow-y: auto;flex: 1;}
.searchDiongBox{display: flex;flex-direction: column;position: absolute;top: 0;bottom: 0;left: 0;right: 0;}


/* 无数据 */
.nodata{text-align: center;line-height: 12rem;color: #999; font-size: .9rem;width: 100%;}



.swiper-container{height: auto;margin: 1rem .8rem;}
.swiper-container div.swiper-slide{background: #e3e7f7; height: 5rem;text-align: center;}
.swiper-container div.swiper-slide img{width: 3rem;height: 3rem;margin-top: 1rem;}
.swiper-container div.swiper-slide a{margin-top: -25%;color: #405efe;font-size: .8rem;display: block;}



/* 搜索 */
.searchHead{display: flex;justify-content: space-between;min-height: 5rem;}
.searchHead>a{width: 3rem;font-size: 1.2rem; text-align: center;line-height: 2.8rem;transform: rotate(180deg)}



/* 预加载 */
.projectLoad{position: absolute;top: 0;bottom: 3.8rem;left: 0;right: 0;background: #fff;z-index: 999;overflow: hidden;padding: 1rem;}
.projectLoadsearch{width: 100%;height: 3rem;background: #f7f7f7;border-radius: 50px;}
.projectLoadUl{display: flex;justify-content: space-between;margin-top: 1rem;}
.projectLoadUl li{width: 32%;height: 4.2rem;background: #f7f7f7;border-radius: 5px}
.projectLoadTitle{width: 8rem;height: 1.6rem;background: #f7f7f7;margin-top: 1rem;}
.projectLoadBox{display: flex;justify-content: space-between;flex-wrap:wrap;padding:1rem 0;}
.projectLoadBox li{width: 48%;height:8rem;background: #f7f7f7;border-radius: 5px;margin-bottom: 1rem;}



</style>


<style>
.mu-dialog-wrapper .searchDiong{background:#f0f0f0;}
</style>
