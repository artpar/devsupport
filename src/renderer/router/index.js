import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage'),
    },
    {
      path: '/integrate',
      name: 'SelectIntegration',
      component: require('@/components/IntegrationSelection')
    },
    {
      path: '/integrate/:id',
      name: 'Integrate',
      component: require('@/components/Integrate')
    },
    {
      path: '/SelectFix',
      name: 'SelectFix',
      component: require('@/components/IntegrationSelection')
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
