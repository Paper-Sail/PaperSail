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
    }
  }
</style>