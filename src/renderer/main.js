import Vue from 'vue';
import axios from 'axios';
import Element from 'element-ui';

import DataTables from 'vue-data-tables'

import 'element-ui/lib/theme-default/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import App from './App';
import router from './router';
import store from './store';
import Loading from './components/Loading.vue'
import jsonApi from './plugins/jsonApi'

global.jQuery = require('jquery');
import _Tether from 'tether';
window.Tether = _Tether;
require('@/assets/icons.css');
require('lato-font/css/lato-font.css');
require('glyphicons');
require('semantic-ui/dist/semantic.min.css');
require('semantic-ui/dist/semantic.min.js');

Vue.use(Element, {locale});
Vue.component("loading", Loading);
Vue.use(DataTables);


if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>',
}).$mount('#app');
