<template>
  <div class="home flex">
    <h1 class="pt jim">A #VeryVeryShort exploration game<br>by <a href="https://twitter.com/cosmografik" target="_blank">Cosmografik</a> & <a href="https://twitter.com/_gaeel_" target="_blank">Gaeel</a></h1>
    <img class="logo" :src="`${assetsUrl}the_paper_sail_logo.png`">
    <img class="pic" :src="`${assetsUrl}home_picture.gif`">
    <a class="start" @click="openTuto" :style="{ 'background-image': 'url(' + start + ')' }"></a>
    <div class="footer">
      <a class="bottom-btn bitter" @click="openAbout">À PROPOS</a>
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
    h1 a {
      text-decoration: underline;
      color: white;
    }
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