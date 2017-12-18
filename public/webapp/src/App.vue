<template>
  <div id="app" v-if="homePageActive" >
    <Home v-if="isHomePage" @openTuto="onOpenTuto"  v-show="isPortrait" />
    <Tuto v-else :progressValue="progressValue" :showStartButton="this.showStartButton" @onStartClick="go" v-show="isPortrait" />
    <div class="landscape flex" v-if="!isPortrait" v-show="isMobile"><h4>{{t(18)}}</h4></div>
    <div id="particles-js" class="particles"></div>
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
      return this.orientation === 'portrait' || !this.isMobile;
    },
    isMobile() {
      return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
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
    particlesJS.load('particles-js', `${publicPath}/assets/particlesjs-config.json`, function() {
      //console.log('callback - particles.js config loaded');
    });
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

html {
  background: black;
}
body {
  background: #05267a; /* Old browsers */
  background: -moz-radial-gradient(center, ellipse cover, #05267a 20%, #000000 99%); /* FF3.6-15 */
  background: -webkit-radial-gradient(center, ellipse cover, #05267a 20%,#000000 99%); /* Chrome10-25,Safari5.1-6 */
  background: radial-gradient(ellipse at center, #05267a 20%,#000000 99%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#05267a', endColorstr='#000000',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
}
#app {
  max-width: 425px;
  margin: 0 auto;
  font-family: Helvetica, sans-serif;
  text-align: center;
  height: 100%;
}
h1, h2, h3, h4 {
  color: white;
  font-weight: 400;
  a {
    text-decoration: underline;
    color: white;
  }
}

h1,h2 {
  font-size: 25px;
  @media only screen and (min-device-width: 1024px) and (max-device-height: 1366px) and (-webkit-min-device-pixel-ratio: 2)  and (orientation: portrait){
    font-size: 50px;
  }
  @media only screen and (device-width: 768px) and (device-height: 1024px) {
    font-size: 50px;
  }
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
  @media only screen 
    and (min-device-width: 320px) 
    and (max-device-width: 480px)
    and (-webkit-min-device-pixel-ratio: 2)
    and (orientation: portrait) {
      padding: 0;
  }
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
  margin-top: 20px;
  @media only screen 
    and (min-device-width: 320px) 
    and (max-device-width: 480px)
    and (-webkit-min-device-pixel-ratio: 2)
    and (orientation: portrait) {
      width: 60%;
      margin-top: 0;
  }
  @media only screen and (min-device-width: 1024px) and (max-device-height: 1366px) and (-webkit-min-device-pixel-ratio: 2)  and (orientation: portrait){
    width: 100%;
  }
  @media only screen and (device-width: 768px) and (device-height: 1024px) {
    width: 100%;
  }
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color: white;
  height: 10%;
  z-index: 1;
  background-repeat: repeat-x;
  background-size: contain;
  background-position: 0 80%;
  .bottom-btn {
    margin-bottom: 10px;
    display: block;
    margin: 0 auto;
    cursor: pointer;
  }
}
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  text-align: center;
  &.center {
    @media only screen and (min-device-width: 1024px) and (max-device-height: 1366px) and (-webkit-min-device-pixel-ratio: 2)  and (orientation: portrait){
      height: 40%;
    }
    @media only screen and (device-width: 768px) and (device-height: 1024px) {
      height: 40%;
    }

    justify-content: center;  
  }
}
.landscape {
  height: 100%;
  justify-content: center;
}
.el-carousel {
  width: 60%;
  bottom: 30px;
  @media only screen 
    and (min-device-width: 320px) 
    and (max-device-width: 480px)
    and (-webkit-min-device-pixel-ratio: 2)
    and (orientation: portrait) {
      bottom: 40px;
  }
}
.el-carousel__arrow--right {
  right: -15px;
  top : 230px;
  @media only screen 
    and (min-device-width: 320px) 
    and (max-device-width: 480px)
    and (-webkit-min-device-pixel-ratio: 2)
    and (orientation: portrait) {
      top: 180px;
  }
  @media only screen and (min-device-width: 1024px) and (max-device-height: 1366px) and (-webkit-min-device-pixel-ratio: 2)  and (orientation: portrait){
   top: 270px;
  }
  @media only screen and (device-width: 768px) and (device-height: 1024px) {
    top: 270px;
  }
}
.el-carousel__arrow--left {
  left: -15px;
  top : 230px;
  @media only screen 
    and (min-device-width: 320px) 
    and (max-device-width: 480px)
    and (-webkit-min-device-pixel-ratio: 2)
    and (orientation: portrait) {
      top: 180px;
  }
  @media only screen and (min-device-width: 1024px) and (max-device-height: 1366px) and (-webkit-min-device-pixel-ratio: 2)  and (orientation: portrait){
   top: 270px;
  }
  @media only screen and (device-width: 768px) and (device-height: 1024px) {
    top: 270px;
  }
}
.el-carousel__indicators--outside {
  button{
    width: 5px;
    height: 5px;
    border-radius : 50%;
  }
}
.el-carousel__container{
  @media only screen 
    and (min-device-width: 320px) 
    and (max-device-width: 480px)
    and ( max-height: 500px )
    and (-webkit-min-device-pixel-ratio: 2)
    and (orientation: portrait) {
      height: 245px !important;
  }
  @media only screen and (min-device-width: 1024px) and (max-device-height: 1366px) and (-webkit-min-device-pixel-ratio: 2)  and (orientation: portrait){
    height: 400px !important;
  }
  @media only screen and (device-width: 768px) and (device-height: 1024px) {
    height: 400px !important;
  }
}
.particles {
  bottom:0;
  position: absolute;
  z-index: 0;
  min-height: 70%;
  left:0;
  pointer-events: none;
}
</style>
