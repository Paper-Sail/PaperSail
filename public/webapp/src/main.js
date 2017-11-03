import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import App from './App.vue';
import Utils from './mixins/utils';

Vue.use(ElementUI)
Vue.mixin(Utils)

new Vue({
  el: '#webapp',
  render: h => h(App)
});