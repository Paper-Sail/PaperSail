import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import App from './App.vue';
import Utils from './mixins/utils';
import VueResource from 'vue-resource';

Vue.use(ElementUI);
Vue.mixin(Utils);
Vue.use(VueResource);

new Vue({
  el: '#webapp',
  render: h => h(App)
});