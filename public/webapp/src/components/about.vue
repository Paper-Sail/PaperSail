<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :modal="true"
    size="full"
    custom-class="dialog"
    :show-close="false">
    <img class="close" :src="`${assetsUrl}close_button.png`" @click="handleClose">
    <h2 class="jim" v-html="t(2)"></h2>
    <img class="logo" :src="`${assetsUrl}the_paper_sail_logo.png`">
    <p class="jim">{{t(3)}}</p>
    <p class="bitter close_btn" @click="handleClose"><img width="20px" :src="`${assetsUrl}close_button.png`">&nbsp;{{t(64)}}</p>
    <h3 class="credits bitter">{{t(4)}}</h3> 
    <ul class="bitter">
      <li class="mt" v-html="t(5)"></li>
      <li class="mt" v-html="t(6)"></li>
      <li class="mt" v-html="t(7)"></li>
      <li class="mt" v-for="(item, index) in credits" v-html="tc(index)" :key="item"></li>
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
.v-modal {
  opacity: .9;
}
.dialog {
  background: transparent;
  color: white;
  padding-top: 0;
  max-width: 425px;
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
.close_btn {
  cursor: pointer;
}
.logo {
  width: 100%;
  margin: 10px 0;
}
.credits {
  margin-top: 50px;
}
</style>