<template>
  <a class="start" @click="onClick" :style="{ 'background-image': 'url(' + start + ')' }"></a>
</template>
<script>
export default {
  props: {
    onClick: Function
  },
  computed: {
    start() {
      return `${publicPath}/assets/start_button.png`;
    }
  },
}
</script>
<style scoped lang="scss">
  .start {
    display: block;
    position: absolute;
    bottom: 70px; 
    width: 80px;
    height: 80px;
    background-repeat: no-repeat;
    background-size: contain;
    margin: 40px auto;
    left: 50%;
    margin-left: -40px;
    z-index: 2;
    cursor: pointer;
    transition: all .2s ease-out;
    transform: scale(.9);
    @media only screen and (device-width: 768px) and (device-height: 1024px) {
      bottom: 15%;
    }
    &:hover {
      transform: scale(.8); 
    }

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
</style> 
