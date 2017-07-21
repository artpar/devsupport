import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'select-project',
      component: require('@/components/SelectProject'),
    },
    {
      path: '/action',
      name: 'select-action',
      component: require('@/components/SelectAction'),
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
      path: '/chooseIntegration',
      name: 'ChooseSP',
      component: require('@/components/ChooseSP')
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
