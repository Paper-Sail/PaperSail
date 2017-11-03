<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :modal="false"
    size="full"
    custom-class="dialog"
    :show-close="false">
    <img class="close" :src="`${assetsUrl}close_button.png`" @click="handleClose">
    <h2 class="jim">{{t(2)}}</h2>
    <img class="logo" :src="`${assetsUrl}the_paper_sail_logo.png`">
    <p class="jim">{{t(3)}}</p>
    <h3 class="credits bitter">{{t(4)}}</h3>
    <ul class="bitter">
      <li class="mt" v-html="t(5)"></li>
      <li class="mt" v-html="t(6)"></li>
      <li class="mt" v-html="t(7)"></li>
    </ul>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false
      };
    },
    methods: {
      handleClose() {
        this.dialogVisible = false;
      }
    }
  };
</script>

<style lang="scss">
.dialog {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding-top: 0;
  .el-dialog__body {
    padding-top: 0;
  }
}
.close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 20px;
}
.logo {
  width: 100%;
  margin: 10px 0;
}
.credits {
  margin-top: 50px;
}
</style>