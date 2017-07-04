import Vue from 'vue';
import axios from 'axios';
import Element from 'element-ui';
import bsCss from 'bootstrap/dist/css/bootstrap.css';

import 'element-ui/lib/theme-default/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import App from './App';
import router from './router';
import store from './store';

global.jQuery = require('jquery');
import _Tether from 'tether';
window.Tether = _Tether;
require('bootstrap');
require('@/assets/icons.css');


Vue.use(Element, {locale});

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
