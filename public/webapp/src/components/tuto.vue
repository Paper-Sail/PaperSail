<template>
  <div class="tuto pt flex">
    <h1 class="jim">Fabriquez<br>votre voile</h1>
      <el-carousel trigger="click" height="250px" indicator-position="outside" arrow="always" :autoplay="true">
      <el-carousel-item v-for="item in items" :key="item.url">
        <img class="pic" :src="`${assetsUrl}${item.url}`">
        <p class="bitter sentence" v-html="item.sentence"></p>
      </el-carousel-item>
    </el-carousel>
    <h3 class="jim bottom-btn" v-if="showStartButton" @click="go">GO !</h3>
    <div v-else class="bottom-btn loading">
      <div class="bitter">CHARGEMENT</div>
      <progress max="100" :value="progressValue"></progress>
    </div>
  </div>
</template>

<script>
 export default {
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
          url:"tuto_1.png",
          sentence:"-1-<br>Pliez un bout de papier"
        },
        {
          url:"tuto_2.png",
          sentence:"-2-<br>Découpez comme ceci"
        },
        {
          url:"tuto_3.png",
          sentence:"-3-<br>Placez le sur l'écran"
        },
        {
          url:"tuto_4.png",
          sentence:"-4-<br>Ajoutez à l'écran d'accueil"
        },
        {
          url:"tuto_5.png",
          sentence:"-5-<br>Eteignez la lumière"
        },
        {
          url:"tuto_6.png",
          sentence:"-6-<br>Explorez seul ou à plusieurs"
        }
      ]
      }
    },
    methods: {
      go() {
        this.$emit('onStartClick');
      }
    }
 }
</script>

<style lang="scss" scoped>
  .tuto {
    .loading {
      margin-bottom: 20px;
    }
    .sentence {
      opacity: .7;
      font-size: 20px;
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