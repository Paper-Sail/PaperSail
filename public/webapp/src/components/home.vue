<template>
  <div class="home flex">
    <h1 class="pt jim" v-html="t(0)"></h1>
    <img class="logo" :src="`${assetsUrl}the_paper_sail_logo.png`">
    <img class="pic" :src="`${assetsUrl}home_picture.gif`">
    <a class="start" @click="openTuto" :style="{ 'background-image': 'url(' + start + ')' }"></a>
    <div class="footer">
      <a class="bottom-btn bitter" @click="openAbout">{{t(1)}}</a>
    </div>
    <About ref="about"/>
  </div>
</template>

<script>
import About from './/about.vue';
export default {
  components: {
    About
  },
  computed: {
    start() {
      return `${publicPath}/assets/start_button.png`;
    }
  },
  methods: {
    openAbout() {
      this.$refs.about.dialogVisible = true;
    },
    openTuto() {
      this.$emit('openTuto');
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  }
}
</script>
<style lang="scss" scoped>
  .home {
    height: 100%;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 0 90%;
    .logo {
      width: 80%;
    }
    .start {
      display: block;
      position: absolute;
      bottom: 15%; 
      width: 80px;
      height: 80px;
      background-repeat: no-repeat;
      background-size: contain;
      margin: 40px auto;
      left: 50%;
      margin-left: -40px;
      &:before, &:after {
        content: "";
        display: block;
        border-radius: 50%;
        border-color: white;
        border-width: 1px;
        border-style: solid;
        width: 90px;
        height: 90px;
        margin-left: -6px;
        margin-top: -6px;
      }
      &:after {
        position: absolute;
        top: 0;
        width: 150px;
        height: 150px;
        margin-left: -36px;
        margin-top: -36px;
        opacity: .5;
      }
    }
  }
</style>