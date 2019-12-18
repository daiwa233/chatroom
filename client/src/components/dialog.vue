<template>
   <div class="dialog">
        <div class="dialog-content">
            <p>请输入一个用户名来加入聊天吧</p>
            <div>
                <input type="text" v-model="username" @input="errorMsg=''">
            </div>
            <div class="errorMsg">{{ errorMsg }}</div>
            <div class="btn-dosomething">
                <button @click="turnOffDialog">再看看</button>
                <button @click="sure">确定</button>
            </div>
        </div>
        <div class="mask"></div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        errorMsg: ''
      }
    },
    methods: {
      // 用户输入用户名点击确认
      sure() {
        const uName = this.username.trim();
        if (uName.length == 0) {
          return this.errorMsg = "用户名不能为空";
        }
        
        this.$emit('sureFn1', uName);
      },
      // 用户点击再看看，退出弹窗
      turnOffDialog() {
        this.$emit('turnOff')
      }

    }
  }
</script>

<style  scoped>

        .dialog {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;

        }

        .dialog-content {
            background: #fff;
            width: 20rem;
            height: 10rem;
            z-index: 9999;
            padding: 1rem 1rem .3rem;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.07);
            border-radius: 10px;
        }

        .btn-dosomething {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        .mask {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            height: 100%;
            background: rgba(0, 0, 0, .3);
            z-index: 8888;
        }

        button {
            /* 按钮美化 */
            width: 100px;
            /* 宽度 */
            height: 40px;
            /* 高度 */
            border-width: 0px;
            /* 边框宽度 */
            border-radius: 3px;
            /* 边框半径 */
            background: #1E90FF;
            /* 背景颜色 */
            cursor: pointer;
            /* 鼠标移入按钮范围时出现手势 */
            outline: none;
            /* 不显示轮廓线 */
            font-family: Microsoft YaHei;
            /* 设置字体 */
            color: white;
            /* 字体颜色 */
            font-size: 15px;
            /* 字体大小 */
        }

        button:hover {
            /* 鼠标移入按钮范围时改变颜色 */
            background: #5599FF;
        }

        input {
            outline-style: none;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 13px 14px;
            width: 100%;
            box-sizing: border-box;
            font-size: 14px;
            font-weight: 700;
            font-family: "Microsoft soft";
            margin: 10px 0  ;
        }
        .errorMsg{
          height: 16px;
          color: red;
          font-size: 12px;
        }
</style>