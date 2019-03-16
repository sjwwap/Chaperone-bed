<template>
  <div class="truename">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="truenameBox">
      <img src="static/img/orderuser.png">
      <div class="truenameUser">
        <mu-form
          ref="form"
          :model="validateForm"
          class="mu-demo-form"
        >
          <mu-form-item
            prop="username"
            :rules="usernameRules"
          >
            <mu-text-field
              type="text"
              v-model="validateForm.username"
              prop="username"
              placeholder="手机号"
            ></mu-text-field>
            <mu-button
              @click="getCode($event)"
              :disabled="getCodeBut"
              class="clickcode"
              color="primary"
              small
            >{{codetext}}</mu-button>
          </mu-form-item>
          <br />
          <mu-form-item
            prop="code"
            :rules="codeRules"
          >
            <mu-text-field
              type="text"
              v-model="validateForm.code"
              prop="code"
              placeholder="验证码"
            ></mu-text-field>
          </mu-form-item>

          <mu-button
            color="primary"
            @click="submit"
            :disabled="getSubBut"
            full-width
            large
          >立即提交</mu-button>
          <br />
          <br />
          <mu-form-item
            prop="isAgree"
            :rules="argeeRules"
          >
            <mu-checkbox
              v-model="validateForm.isAgree"
              label="我已阅读并同意"
            ></mu-checkbox>
            <div
              style="color:#3166fd;"
              @click="toagreement"
            >《金钯子共享产品协议与隐私政策》</div>
          </mu-form-item>
        </mu-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "truename",
  components: {},
  data() {
    return {
      usernameRules: [
        { validate: val => !!val, message: "请填写手机号" },
        {
          validate: val => /^[1][3,4,5,7,8][0-9]{9}$/.test(val),
          message: "请填写正确的手机号"
        }
      ],
      codeRules: [
        { validate: val => !!val, message: "请填写验证码" }
      ],
      argeeRules: [{ validate: val => !!val, message: "必须同意用户协议" }],
      validateForm: {
        username: "",
        code: "",
        isAgree: false
      },
      // 用户id
      userId: "",
      // 提交按钮
      getSubBut: true,
      // 获取验证码按钮
      getCodeBut: true,
      codetext: "获取验证码",
      codetime: ""
    };
  },
  // this.validateForm.username
  watch: {
    validateForm: {
      handler(newValue, oldValue) {
        let phoneCheck = /^[1][3,4,5,7,8][0-9]{9}$/;

        if (this.codetime == 0 && phoneCheck.test(newValue.username)) {
          this.getCodeBut = false;
        } else {
          this.getCodeBut = true;
        }

        if (
          phoneCheck.test(newValue.username) &&
          newValue.code &&
          newValue.isAgree == true
        ) {
          this.getSubBut = false;
        } else {
          this.getSubBut = true;
        }
      },
      // 深度监听 监听对象，数组的变化
      deep: true
    }
  },
  created() {
    // userId
    this.userId = this.getCookie("userId");
  },
  methods: {
    submit() {
      // 验证程序
      this.$refs.form.validate().then(result => {
        // 提交
        let $this = this;
        this.$http
          .get(
            "/palladium/inter/smsverification/checkoutSms?userId=" +
              this.userId +
              "&smsCode=" +
              this.validateForm.code
          )
          .then(function(response) {
            if (response.data.code == 200) {
              $this.$router.push({
                path: "/TruenameSuccess"
              });
            } else {
              alert("验证码错误！");
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },

    getCode() {
      this.getCodeBut = true;
      // 获取验证码
      let $this = this;
      this.$http
        .get(
          "/palladium/inter/smsverification/sendSms?phone=" +
            this.validateForm.username
        )
        .then(function(response) {
          console.log(response);
          if (response.data.code == 200) {
            let codenumber = 60;
            var interval = setInterval(function() {
              let phoneCheck = /^[1][3,4,5,7,8][0-9]{9}$/;
              if (codenumber == 0) {
                if (phoneCheck.test($this.validateForm.username)) {
                  $this.codetext = "获取验证码";
                  $this.getCodeBut = false;
                  clearInterval(interval);
                } else {
                  $this.codetext = "获取验证码";
                  clearInterval(interval);
                }
              } else {
                codenumber--;
                $this.codetime = codenumber;
                $this.codetext = codenumber + "秒后重试";
              }
            }, 1000);
          } else {
            alert("请重新获取验证码！");
          }
        })
        .catch(function(error) {
          console.log(error.msg);
        });
    },
    // 服务协议
    toagreement() {
      this.$router.push({
        path: "/agreement"
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.truename{position: absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6;display: flex;flex-direction: column;}
.truenameBox{width:100%;height:100%;position: relative;overflow: hidden;overflow-y: auto; background: #fff;}
.truenameBox img{width: 6rem;height: 6rem;margin: 15% auto;display: block;}

.truenameUser{width: 100%;height: auto;padding: 0 3%;}
.truenameUser em{font-size: .8rem;color: #3166fd;}

.clickcode{position: absolute;right: 0;bottom: 1rem;}
</style>


