<template>
  <div class="home flex">
    <h1 class="pt jim" v-html="t(0)"></h1>
    <img class="logo" :src="`${assetsUrl}the_paper_sail_logo.png`" />
    <div class="flex center">
      <img class="pic" :src="`${assetsUrl}home_picture.gif`" />
    </div>  
    <Start :onClick="openTuto" />
    <AppFooter>
      <a class="bottom-btn bitter" @click="openAbout">{{t(1)}}</a>
    </AppFooter>
    <About ref="about"/>
  </div>
</template>

<script>
import About from './about.vue';
import AppFooter from './footer.vue';
import Start from './start.vue';

export default {
  components: {
    About,
    AppFooter,
    Start
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
    .logo {
      width: 80%;
      @media only screen 
        and (min-device-width: 320px) 
        and (max-device-width: 480px)
        and (-webkit-min-device-pixel-ratio: 2)
        and (orientation: portrait) {
          width: 60%;
      }
      @media only screen and (min-device-width: 1024px) and (max-device-height: 1366px) and (-webkit-min-device-pixel-ratio: 2)  and (orientation: portrait){
         width: 100%;
      }
      @media only screen and (device-width: 768px) and (device-height: 1024px) {
        width: 100%;
      }
    }
  
  }
</style>
