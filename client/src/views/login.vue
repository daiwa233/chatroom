<template>
  <div>
    <button @click="dialogFlag=true" class="btn-primary btn">登录</button>

    <dva-dialog :visiable.sync="dialogFlag" title="登录" :center="false" width="320px" top="30vh">
      <template v-slot:default>
        <div class="formImg-list">
            <img src="https://b-gold-cdn.xitu.io/v3/static/img/greeting.1415c1c.png" alt="" class="img_show" v-show="emailImgFlag">
            <img src="https://b-gold-cdn.xitu.io/v3/static/img/blindfold.58ce423.png" alt="" class="img_show" v-show="pwdImgFlag">
            <img src="https://b-gold-cdn.xitu.io/v3/static/img/normal.0447fe9.png" alt="" class="img_show" v-show="!emailImgFlag && !pwdImgFlag">
        </div>
        <form class="container">
          <div class="form-group">
            <input type="email" class="form-control" id="exampleInputEmail1" 
            placeholder="请输入邮箱" 
            @focus="emailFocus"
            @blur="emailImgFlag=false"/>
          </div>
          <div class="form-group">
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              placeholder="请输入密码"
              @focus="pwdFocus"
              @blur="pwdImgFlag=false"
            />
          </div>
          <button type="submit" class="btn btn-block btn-primary">登录</button>
          <div class="form-group login_info">
            <span>没有账号？<a href="">注册</a></span>
            <span><a href="">忘记密码</a></span>
          </div>
          <div class=" Oauth-box">
            <div>第三方账号登录:</div>
            <div class="Oauth-img">
            <div class="oauth-bg">
              <a :href="oAuthGithubURL"><img src="https://b-gold-cdn.xitu.io/v3/static/img/github.547dd8a.svg" alt="Github" title="Github"></a>
            </div>
            <div class="oauth-bg">
              <a :href="oAuthGithubURL"><img src="https://b-gold-cdn.xitu.io/v3/static/img/github.547dd8a.svg" alt="微信" title="微信"></a>
            </div>
            <div class="oauth-bg">
              <a :href="oAuthGithubURL"><img src="https://b-gold-cdn.xitu.io/v3/static/img/github.547dd8a.svg" alt="qq" title="qq"></a>
            </div>
            </div>
          </div>
        </form>
      </template>
    </dva-dialog>
  </div>
</template>

<script>
import axios from "@/http/index";
import D_dialog from "@/components/D_dialog.vue";
export default {
  components: {
    "dva-dialog": D_dialog
  },
  data() {
    return {
      oAuthGithubURL: `https://github.com/login/oauth/authorize?client_id=${process.env.VUE_APP_clientID}`,
      dialogFlag: false,
      emailImgFlag: false,
      pwdImgFlag: false
    };
  },

  methods: {
    // github登录认证
    oAuthGithubCode(code) {
      axios({
        url: `/response?code=${code}`,
        method: "get"
      }).then(res => {
        console.log(res);
      });
    },
    // email 输入框获得焦点，改变视图
    emailFocus() {
      this.pwdImgFlag = false;
      this.bodyFlag = false;
      this.emailImgFlag = true;
      
    },
    // 输入密码框获得焦点
    pwdFocus() {
      this.emailImgFlag = false;
      this.bodyFlag = false;
      this.pwdImgFlag = true;
    }
  },

};
</script>

<style lang="less" scoped>
  .formImg-list{
    .img_show{
      position: absolute;
      top: -33px;
      left: 50%;
      width: 8rem;
      transform: translate(-50%,-83%);
      z-index: 1;
    }
  }
  .login_info{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    span{
      font-size: 13px;
    }
  }
  .Oauth-box{
    font-size: 14px;
    .Oauth-img{
      display: flex;
      justify-content: space-around;
      padding-top: 20px;
      flex-wrap: wrap;
      .oauth-bg{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        border-radius: 50%;
        background: #f4f8fb;

        a{
          line-height: 0;
          img{
          width: 20px;
          height: 20px;
        }
        }
        
      }
    }
  }
</style>