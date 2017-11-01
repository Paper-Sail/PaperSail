<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :modal="false"
    size="full"
    custom-class="dialog"
    :show-close="false">
    <img class="close" :src="`${assetsUrl}close_button.png`" @click="handleClose">
    <h2 class="jim">une courte exploration tangible<br>par Cosmografik et Gaeel</h2>
    <img class="logo" :src="`${assetsUrl}the_paper_sail_logo.png`">
    <p class="jim">Pliez un simple morceau de papier et posez-le à la surface de votre écran. Votre voile est prête ! Il ne vous reste plus qu’à larguez les amarres vers des destinations inconnues…</p>
    <h3 class="credits bitter">CRÉDITS :</h3>
    <ul class="bitter">
      <li class="mt">Conception, Direction Artistique<br> et Sound Design : @Cosmografik</li>
      <li class="mt">Développement : <br>
      @Kevin “Gaeel” Bradshaw-Rodriguez<br>avec l’aide de @Nicolas Martin</li>
      <li class="mt">Production : Ex Nihilo / <br>Arnaud Colinart & Corentin Lambot</li>
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