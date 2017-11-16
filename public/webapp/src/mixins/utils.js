import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource);

export default {
  computed: {
    assetsUrl() {
      return `${publicPath}/assets/`;
    },
  },
  methods: {
    t(number) {
      return this.translates[number];
    }
  },
  mounted() {
    this.$http.get(`${publicPath}/assets/translates.json`).then(response => {
      // get body data
      this.translates = response.body;
    }, response => {
      // error callback
    });
  },
  data() {
    return {
      translates: {}
    };
  },
};