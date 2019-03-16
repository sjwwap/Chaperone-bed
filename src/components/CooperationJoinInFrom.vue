<template>
  <div class="CooperationJoinInFrom">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="CooperationJoinInFromBox">
         <div class="From">
           <div class="JoinInFromLi">
             <em>姓名：</em><input type="text" v-model="fromdata.fromnamedata" @blur="fromnamedataFocus" placeholder="请输入真实姓名">
           </div>
           <p class="error" v-if="fromdata.fromnamestyle">*{{fromdata.fromnameerror}}</p>
           <div class="JoinInFromLi">
             <em>电话：</em><input type="text" v-model="fromdata.fromteldata" @blur="fromteldataFocus" placeholder="请输入实名电话">
           </div>
           <p class="error" v-if="fromdata.fromtelstyle">*{{fromdata.fromtelerror}}</p>
           <div class="JoinInFromLi">
             <em>地址：</em><input type="text" v-model="fromdata.fromadredata" @blur="fromadredataFocus" placeholder="请输入真实地址">
           </div>
           <p class="error" v-if="fromdata.fromadrestyle">*{{fromdata.fromadreerror}}</p>
           <div class="JoinInFromLi JoinInFromUpdata">
             <em>证件照片：</em>
             <div class="JoinInFromBox">
                <div class="img-item" v-for="(item,index) in fromdata.imgArr" :key="index">
                    <input type="file" @click="tirggerFile($event,index)">
                    <i class="iconfont icon-jiahao"></i>
                    <p>{{item.desc}}</p>
                    <div v-show="item.urlimg"><img :src="item.url" width="100%"></div>
                </div>
            </div>
           </div>
           <p class="error" v-if="fromdata.fromupstyle">*{{fromdata.fromuperror}}</p>
           <br/>
         <mu-button color="primary" full-width round large @click="submit" :disabled="examineSub">提交审核</mu-button>
          <br/>
           <br/>
         </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CooperationJoinInFrom',
  data () {
    return {
        fromdata:{
        fromnamedata:null,
        fromnameerror:"",
        fromnamestyle:false,
        fromteldata:null,
        fromtelerror:"",
        fromtelstyle:false,
        fromadredata:null,
        fromadreerror:"",
        fromadrestyle:false,
        imgArr:[
            {url:null,desc:"身份证照片面照片",urlimg:false},
            {url:null,desc:"身份证国辉面照片",urlimg:false}
        ],
        fromuperror:"",
        fromupstyle:false
        },
        // 按钮状态
        examineSub:false,
        type:"",
        userId:""
    }
  },
  created(){
    this.type = this.$route.query.type
    this.userId = this.getCookie("userId")
  },
 methods: {
     tirggerFile : function (event,int){
       let $this = this
       this.uploadImg({
        maxNum: 680,
        rate: 0.8,
        className:$(event.target),
        index:int,
        callback: function (baseUrl,className,indexValue) {
        $this.fromdata.imgArr[indexValue].urlimg = true
        $this.fromdata.imgArr[indexValue].url = baseUrl
        }
    })  
    },

      // 监听函数
    fromnamedataFocus(){
      if (this.fromdata.fromnamedata) {
        this.fromdata.fromnamestyle = false
      } else {
      }
    },
    fromteldataFocus(){
      let phoneCheck = /^[1][3,4,5,7,8][0-9]{9}$/
      if (this.fromdata.fromteldata && phoneCheck.test(this.fromdata.fromteldata)) {
        this.fromdata.fromtelstyle = false
      } else {
      }
    },
    fromadredataFocus(){
      if (this.fromdata.fromadredata) {
        this.fromdata.fromadrestyle = false
      } else {
      }
    },
    // 提交
    submit(){
      this.examineSub = true
      let phoneCheck = /^[1][3,4,5,7,8][0-9]{9}$/
      // 
      if (this.fromdata.fromnamedata && this.fromdata.fromteldata && phoneCheck.test(this.fromdata.fromteldata) && this.fromdata.fromadredata && this.fromdata.imgArr[0].url && this.fromdata.imgArr[1].url) {
        let $this = this
        const url ='/palladium/inter/operator/saveOperator';

        let postData = this.$qs.stringify({
            userId:$this.userId,
            name:$this.fromdata.fromnamedata,
            phone:$this.fromdata.fromteldata,
            idPhotosJust:$this.fromdata.imgArr[0].url,
            idPhotosBack:$this.fromdata.imgArr[1].url,
            type:$this.type,
            address:$this.fromdata.fromadredata,
            state:0
            });
            this.$http({
                method: 'post',
                url:url,
                data:postData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((res)=>{
              if (res.data.code == 200) {
                this.examineSub = false
                this.$router.push({
                  path:"/CooperationState",
                  query:{
                    state:"待审核"
                  }
                });
              } else {
                this.examineSub = false
                alert("图片上传失败！")
              }
            })
      } else {
        this.examineSub = false
          if (this.fromdata.fromnamedata) {
        this.fromdata.fromnamestyle = false
      } else {
        this.fromdata.fromnamestyle = true
        this.fromdata.fromnameerror = "姓名不可为空！"
      }

      let phoneCheckB = /^[1][3,4,5,7,8][0-9]{9}$/
      if (this.fromdata.fromteldata && phoneCheckB.test(this.fromdata.fromteldata)) {
          this.fromdata.fromtelstyle = false
        } else {
          this.fromdata.fromtelstyle = true
          this.fromdata.fromtelerror = "请填写正确的手机号！"
        }

        if (this.fromdata.fromadredata) {
          this.fromdata.fromadrestyle = false
        } else {
          this.fromdata.fromadrestyle = true
          this.fromdata.fromadreerror = "地址不可为空！"
        }

          if (this.fromdata.imgArr[1].url == null || this.fromdata.imgArr[0].url == null) {
          this.fromdata.fromupstyle = true
          this.fromdata.fromuperror = "身份证照片为必填项！"
        } else {
          this.fromdata.fromaupstyle = false
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.CooperationJoinInFrom{position: absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6;display: flex;flex-direction: column;}
.CooperationJoinInFromBox{width:100%;height:100%;position: relative;overflow: hidden; background: #fff;overflow-y: auto;}
.From{width: 100%;padding: .5rem;}
.From p.error{line-height: 1.8rem;color: red;}
.JoinInFromLi{border-bottom: 1px solid #e6e6e6;height: 3.2rem; line-height: 3.2rem;display: flex;justify-content: flex-start;}
.JoinInFromLi em{min-width: 15%;font-size: .9rem;color: #333;}
.JoinInFromLi input{width: 85%;font-size: .9rem;}
.JoinInFromUpdata{border-bottom: 0;height: auto;}
.JoinInFromUpdata em{min-width: 25%;}
.JoinInFromUpdata input{border: 1px dotted #dedede;margin-top: 1rem;height: 10rem;}

.JoinInFromBox{display:flex;flex-direction: column;width: 70%;}
.img-item{width: 100%;height: 10rem;border: 1px dotted #e6e6e6;border-radius:5px;margin-top: 1rem;text-align: center;position: relative;overflow: hidden;align-items: center;justify-content: center;}
.img-item i{font-size: 2rem;color: #999;position: absolute;top: 25%;width: 3rem;text-align: center;left: 50%;margin-left: -1.3rem;font-weight: 700;}
.img-item p{font-size: .9rem; color: #999; width: 100%;position: absolute;left: 0;text-align: center;top: 45%;}
.img-item input{opacity: 0;position: absolute;width: 100%;height: 100%;top: 0;left: 0;z-index: 999}
.img-item>div{position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 998;background: #fff;}
.img-item img{ vertical-align: middle;align-items: center;width: 100%}

</style>


