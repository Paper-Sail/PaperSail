<template>
  <div class="footer" :style="{ 'background-image': 'url(' + footer + ')' }">
    <slot />
  </div>
</template>

<script>
  export default {
    computed: {
      footer() {
        return `${publicPath}/assets/footer.png`;
      }
    },
}
</script>