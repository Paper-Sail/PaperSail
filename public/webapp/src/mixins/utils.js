import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource);

export default {
  computed: {
    assetsUrl: function() {
      return publicPath + "/assets/";
    },
  },
  methods: {
    t:function(number) {
      return this.translates[number];
    },
    tc:function(number) {
      return this.credits[number];
    }
  },
  mounted:function() {
    this.$http.get(publicPath +'/assets/translates.json').then(function(response) {
      this.translates = response.body;
      function values(obj) {
        var arr = [];
        for(var val in obj) {       
          var trad = obj[val];
          arr.push(trad);
        }
        return arr;
      }
      this.credits = values(response.body.credits)
    });
  },
  data: function() {
    return {
      translates: {
      },
      credits: {

      }
    };
  },
};