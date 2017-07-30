import Vue from 'vue';
import axios from 'axios';
import Element from 'element-ui';
// import ua from 'universal-analytics';


import 'element-ui/lib/theme-default/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import App from './App';
import router from './router';
import store from './store';
import Loading from './components/Loading.vue'


global.jQuery = require('jquery');
import _Tether from 'tether';
window.Tether = _Tether;
require('@/assets/icons.css');
require('lato-font/css/lato-font.css');
require('material-design-icons-iconfont/dist/material-design-icons.css');
require('glyphicons');
require('material-icons/css/material-icons.min.css');
require('@/assets/semantic/semantic.min.css');
require('@/assets/semantic/semantic.min.js');
import Vue2Filters from 'vue2-filters'

Vue.use(Vue2Filters)

Vue.use(Element, {locale});
Vue.component("loading", Loading);


var DURATION_IN_SECONDS = {
  epochs: ['year', 'month', 'day', 'hour', 'minute', 'second'],
  year: 31536000,
  month: 2592000,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

function getDuration(seconds) {
  var epoch, interval;

  for (var i = 0; i < DURATION_IN_SECONDS.epochs.length; i++) {
    epoch = DURATION_IN_SECONDS.epochs[i];
    interval = Math.floor(seconds / DURATION_IN_SECONDS[epoch]);
    if (interval >= 1) {
      return {
        interval: interval,
        epoch: epoch
      };
    }
  }

};

function timeSince(date) {
  if (!date) {
    return "sometime";
  }
  var seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 1) {
    return "0 second";
  }

  var duration = getDuration(seconds);
  var suffix = (duration.interval > 1 || duration.interval === 0) ? 's' : '';
  return duration.interval + ' ' + duration.epoch + suffix;
};


Vue.filter('timeSinceNow', timeSince);

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
