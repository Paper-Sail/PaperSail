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
    },
    tc(number) {
      return this.credits[number];
    }
  },
  mounted() {
    this.$http.get(`${publicPath}/assets/translates.json`).then(response => {
      this.translates = response.body;
      function* values(obj) {
        for (let prop of Object.keys(response.body.credits))
        yield response.body.credits[prop];
      }
      this.credits = Array.from(values(response.body.credits));
    }, response => {
      // error callback
    });
  },
  data() {
    return {
      translates: {
      },
      credits: {

      }
    };
  },
};