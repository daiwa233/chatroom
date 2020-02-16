<template>
  <transition name="dialog-fade">
    <div
      v-show="visiable"
      :class="center ? 'dva-dialog_wrapper dva-dialog-center' : 'dva-dialog_wrapper dva-dialog-top'"
    >
      <div :style="style" class="dialog-content container">
        <div class="dialog-header">
          <!-- title插槽 -->
          <slot name="title">
            <span class="dialog-title">{{ title }}</span>
          </slot>
          <span v-if="showClose" @click="handleClose">
            <button type="button" class="close" aria-label="关闭">
              <span aria-hidden="true">&times;</span>
            </button>
          </span>
        </div>
        <div class="dialog-body" v-if="rendered">
          <!-- 主要内容插槽 -->
          <slot></slot>
        </div>
        <!-- 底部插槽 -->
        <slot name="footer"></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "dva-dialog",
  data() {
    return {
      rendered: false,
    };
  },
  props: {
    visiable: {
      type: Boolean,
      required: true
    },
    title: {
      type: String
    },
    center: {
      type: Boolean,
      default: true
    },
    top: {
      type: String,
      default: "15vh"
    },
    showClose: {
      type: Boolean,
      default: true
    },
    width: {
      type: String
    }
  },
  computed: {
    style() {
      let style = {};
      // 当center为true时不支持设置top
      if (!this.center) {
        style.marginTop = this.top;
      }
      if (this.width) {
        style = {...style, width: "100%", maxWidth: this.width}
      } 
      return style;
    }
  },
  methods: {
    handleClose() {
      this.$emit("update:visiable", false);
    }
  },
  watch: {
    /* 执行弹窗开启或关闭的回调 */
    visiable(newVal) {
      if (newVal) {
        this.rendered = true;
        this.$emit("open");
      } else {
        
        this.$emit("close");
      }
    }
  },
  mounted() {
    if (this.visiable) {
      this.rendered = true;
    }
  }
};
</script>

<style lang="less" scoped>
/* 遮罩 */
.dva-dialog_wrapper {
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 8888;
}
.dva-dialog-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 弹窗主体样式 */
.dialog-content {
  display: flex;
  justify-content: center;
  background: #fff;
  z-index: 9999;
  padding: 1rem 1rem 0.3rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  margin: 0 auto;

  flex-direction: column;
  .dialog-header {
    display: flex;
    justify-content: space-between;
    .dialog-title {
      font-size: 1.1rem;
      font-weight: bold;
    }
  }
  .dialog-body {
    padding:  2rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
}

/* 过渡动画类 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all 0.3s ease;
}
.dialog-fade-enter,
.dialog-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>