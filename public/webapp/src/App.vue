<template>
  <div id="app" v-if="homePageActive">
    <Home v-if="isHomePage" @openTuto="onOpenTuto" :style="{ 'background-image': 'url(' + footer + ')' }" v-show="isPortrait" />
    <Tuto v-else :progressValue="progressValue" :showStartButton="this.showStartButton" @onStartClick="go" :style="{ 'background-image': 'url(' + footer + ')' }" v-show="isPortrait" />
    <div class="landscape flex" v-if="!isPortrait"><h4>{{t(18)}}</h4></div>
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
    isPortrait() {
      return this.orientation === 'portrait';
    },
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
    },
    checkOrientation() {
      if(window.innerHeight > window.innerWidth){
        this.orientation = 'portrait'
      }
      else {
        this.orientation = 'landscape'
      }
    }
  },
  watch: {
    isHomePage(val) {
      if(!val) {
        this.interval = setInterval(() => {
          this.progressValue = LOADER.completion * 100;
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
  mounted() {
    window.addEventListener('load', _=> {
      this.checkOrientation()
    }, false);
    window.addEventListener('resize', _=> {
      this.checkOrientation()
    }, false);
  },
  data() {
    return {
      orientation: 'portrait',
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

html {
    overflow: scroll;
    overflow-x: hidden;
}
::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
}

#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
  height: 100%;
  height: 100%;
  background: #05267a; /* Old browsers */
  background: -moz-radial-gradient(center, ellipse cover, #05267a 20%, #000000 99%); /* FF3.6-15 */
  background: -webkit-radial-gradient(center, ellipse cover, #05267a 20%,#000000 99%); /* Chrome10-25,Safari5.1-6 */
  background: radial-gradient(ellipse at center, #05267a 20%,#000000 99%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#05267a', endColorstr='#000000',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
}
h1, h2, h3, h4 {
  color: white;
  font-weight: 400;
  a {
    text-decoration: underline;
    color: white;
  }
}

h1 {
  font-size: 30px;
}

h2 {
  font-size: 28px;
}

h3 {
  font-size: 26px;
}

h4 {
  font-size: 24px;
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
  background: black;
  height: 10%;
  z-index: 1;
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
.landscape {
  height: 100%;
  justify-content: center;
}
.el-carousel {
  width: 60%;
}
.el-carousel__arrow--right {
  right: -15px;
  top : 230px;
}
.el-carousel__arrow--left {
  left: -15px;
  top : 230px;
}
.el-carousel__indicators--outside button{
  width: 5px;
  height: 5px;
  border-radius : 50%;
}
</style>
