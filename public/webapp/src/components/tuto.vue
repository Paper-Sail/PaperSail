<template>
  <div class="tuto pt flex">
    <h3 v-if="firstSteps" class="jim">{{t(8)}}</h3>
    <h3 v-else class="jim">{{t(9)}}</h3>
      <el-carousel :interval="4000" trigger="click" height="300px" indicator-position="outside" arrow="always" :autoplay="true" @change="changeSlide">
      <el-carousel-item v-for="item in items" :key="item.url">
        <p class="bitter sentence" v-html="item.sentence"></p>
        <img class="pic" :src="`${assetsUrl}${item.url}`">
      </el-carousel-item>
    </el-carousel>
    <h3 class="jim loading" v-if="showStartButton" @click="go">{{t(17)}}</h3>
    <div v-else class="loading footer">
      <div class="bitter">{{t(16)}}</div>
      <progress max="100" :value="progressValue"></progress>
    </div>
  </div>
</template>

<script>
 import  translations from '../mixins/utils.js';
 export default {
   mixins: [translations],
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
          url:"tuto_1.gif",
          sentence: this.t(11)
        },
        {
          url:"tuto_1.gif",
          sentence: this.t(12)
        },
        {
          url:"tuto_1.gif",
          sentence: this.t(13)
        },
        {
          url:"tuto_1.gif",
          sentence: this.t(14)
        },
        {
          url:"tuto_1.gif",
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
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 0 90%;
    .loading {
      color: white;
      position: absolute;
      bottom: 0;
      background: black;
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
      height: 5px;
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
  }
</style>