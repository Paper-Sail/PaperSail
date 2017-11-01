<template>
  <div id="app" :style="{ 'background-image': 'url(' + footer + ')' }" v-if="homePageActive">
    <Home v-if="isHomePage" @openTuto="onOpenTuto" />
    <Tuto v-else :progressValue="progressValue" :showStartButton="this.showStartButton" @onStartClick="go" />
  </div>
</template>

<script>
import Home from './components/home.vue';
import Tuto from './components/tuto.vue';

export default {
  components: {
    Home,
    Tuto
  },
  computed: {
    footer() {
      return `${publicPath}/assets/footer.png`;
    },
  },
  methods: {
    onOpenTuto() {
      this.isHomePage = false;
    },
    go() {
      this.homePageActive = false;
      go();
    }
  },
  watch: {
    isHomePage(val) {
      if(!val) {
        this.interval = setInterval(() => {
          this.progressValue = LOADER.completion*100;
        }, 100);
      }
    },
    progressValue() {
      if(this.progressValue >= 100) {
        clearInterval(this.interval);
        this.showStartButton = true;
      }
    }
  },
  data() {
    return {
      isHomePage: true,
      progressValue: LOADER.completion*100,
      interval: null,
      showStartButton: false,
      homePageActive: true
    };
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Jim+Nightshade');
@import url('https://fonts.googleapis.com/css?family=Bitter');

#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
  height: 100%;
  height: 100%;
  background-color: #0e2b5e;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom;
}
h1, h3 {
  color: white;
  font-weight: 400;
  font-size: 25px;
}
h2  {
  color: white;
  font-weight: 400;
  font-size: 20px;
}
p {
  font-size: 18px;
  color: white;
}
ul {
  list-style-type: none;
  padding-left: 0;
  color: white;
}

.pt {
  padding-top: 20px;
}
.mt {
  margin-top: 20px;
}
.jim {
  font-family: 'Jim Nightshade', cursive;
}
.bitter {
  font-family: 'Bitter', serif;
}
.pic {
  width: 80%;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color: white;
  .bottom-btn {
    margin-bottom: 10px;
    display: block;
    margin: 0 auto;
  }
}
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  text-align: center;
}
.el-carousel {
  width: 60%;
}
.el-carousel__arrow--right {
  right: -15px;
  top : 35%;
}
.el-carousel__arrow--left {
  left: -15px;
  top : 35%;
}
.el-carousel__indicators--outside button{
  width: 5px;
  height: 5px;
  border-radius : 50%;
}
</style>
