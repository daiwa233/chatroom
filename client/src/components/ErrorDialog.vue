 e3fi; +<template>
   <div class="dialog">
        <div class="dialog-content">
            <p>{{ msg }}</p>
            <div class="btn-dosomething">
                <button @click="turnOffDialog">我知道了</button>
            </div>
        </div>
        <div class="mask"></div>
    </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: {
      msg: {
        required: true,
        type: String
      }
    },
    methods: {
      // 用户点击关闭，退出弹窗
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
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .dialog-content p{
          font-size: 20px;
          line-height: 40px;
          padding-bottom: 20px;
          color: red;
        }
        .btn-dosomething {
            display: flex;
            justify-content: center;
            align-items: center;
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
            background: #d9534f;
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

</style>