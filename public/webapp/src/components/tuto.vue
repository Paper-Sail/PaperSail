<template>
  <div class="tuto pt flex">
    <h3 v-if="firstSteps" class="jim">Fabriquez votre voile :</h3>
    <h3 v-else class="jim">Quelques Conseils...</h3>
      <el-carousel :interval="4000" trigger="click" height="300px" indicator-position="outside" arrow="always" :autoplay="true" @change="changeSlide">
      <el-carousel-item v-for="item in items" :key="item.url">
        <p class="bitter sentence" v-html="item.sentence"></p>
        <img class="pic" :src="`${assetsUrl}${item.url}`">
      </el-carousel-item>
    </el-carousel>
    <h3 class="jim loading" v-if="showStartButton" @click="go">GO !</h3>
    <div v-else class="loading footer">
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
          url:"tuto_1.gif",
          sentence:"-1-<br>Pliez un bout de papier"
        },
        {
          url:"tuto_1.gif",
          sentence:"-2-<br>Découpez comme ceci"
        },
        {
          url:"tuto_1.gif",
          sentence:"-3-<br>Placez le sur l'écran"
        },
        {
          url:"tuto_1.gif",
          sentence:"-4-<br>Ajoutez à l'écran d'accueil"
        },
        {
          url:"tuto_1.gif",
          sentence:"-5-<br>Eteignez la lumière"
        },
        {
          url:"tuto_1.gif",
          sentence:"-6-<br>Explorez seul ou à plusieurs"
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
      margin-bottom: 20px;
      color: white;
      position: absolute;
      bottom: 0;
      background: black;
    }
    .sentence {
      opacity: .7;
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