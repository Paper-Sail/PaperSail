<template>
  <div class="tuto flex">
    <h2 v-if="firstSteps" class="jim mt">{{t(8)}}</h2>
    <h2 v-else class="jim mt">{{t(9)}}</h2>
      <el-carousel :interval="2850" trigger="click" height="350px" indicator-position="outside" arrow="always" :autoplay="true" @change="changeSlide">
      <el-carousel-item v-for="item in items" :key="item.url">
        <p class="bitter sentence" v-html="item.sentence"></p>
        <img class="pic" :src="`${assetsUrl}${item.url}`">
      </el-carousel-item>
    </el-carousel>
    <AppFooter>
      <Start v-if="showStartButton" :onClick="go" class="start" />
      <div v-else class="loading">
        <div class="bitter">{{t(16)}}</div>
        <progress max="100" :value="progressValue"></progress>
      </div>
    </AppFooter>
  </div>
</template>

<script>
 import  translations from '../mixins/utils.js';
 import AppFooter from './footer.vue';
 import Start from './start.vue';

 export default {
   mixins: [translations],
   components: {
     AppFooter,
     Start
   },
   props: {
     progressValue: 0,
     showStartButton: false
   },
   computed: {
    start() {
      return `${publicPath}/assets/start_button.png`;
    },
    items() {
      return [
        {
          url:"tuto_1.gif",
          sentence: this.t(10)
        },
        {
          url:"tuto_2.gif",
          sentence: this.t(11)
        },
        {
          url:"tuto_3.gif",
          sentence: this.t(12)
        },
        {
          url:"tuto_5.gif",
          sentence: this.t(14)
        },
        {
          url:"tuto_6.gif",
          sentence: this.t(15)
        }
      ]
      }
    },
    methods: {
      go() {
        GAME.start();
        this.$emit('onStartClick');
      },
      changeSlide(index) {
        this.firstSteps = index <= 2;
      }
    },
    data() {
      return {
        firstSteps: true
      };
    },
 }
</script>

<style lang="scss" scoped>
  .tuto {
    height: 100%;
    .loading {
      color: white;
      bottom: 0;
    }
    .sentence {
      font-size: 20px;
      min-height: 80px;
    }
    progress {
      color: white;
    }
    progress[value] {
      /* Reset the default appearance */
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      border: none;
      width: 250px;
      height: 2px;
    }
    progress::-webkit-progress-value { 
      background: white; 
    }
    progress::-moz-progress-bar {
      background: white;
    }

    progress[value]::-webkit-progress-bar {
      background-color: #1a75c1;
    }

    progress::-moz-progress-bar {
      background: #1a75c1;
    }
    .start {
      transform: scale(.6);
      bottom: 0;
      @media only screen and (min-device-width: 1024px) and (max-device-height: 1366px) and (-webkit-min-device-pixel-ratio: 2)  and (orientation: portrait){
        transform: scale(1.2);
        bottom: 50px;
      }
      @media only screen and (device-width: 768px) and (device-height: 1024px) {
        transform: scale(1.2);
        bottom: 50px;
      }
    }
  }
</style>