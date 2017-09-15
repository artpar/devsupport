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
      path: '/integratation-selection/:id',
      name: 'SelectIntegration',
      component: require('@/components/IntegrationSelection')
    },
    {
      path: '/integrate/:id',
      name: 'Integrate',
      component: require('@/components/Integrate')
    },
    {
      path: '/apply-changes',
      name: "ApplyChanges",
      component: require("@/components/Flow/ApplyChanges")
    },
    {
      path: '/present-changes',
      name: "PresentChanges",
      component: require("@/components/Flow/PresentChanges")
    },
    {
      path: '/scanning-files',
      name: "ScanningFiles",
      component: require("@/components/Flow/ScanningFiles")
    },
    {
      path: '/review-results',
      name: "ReviewResults",
      component: require("@/components/Flow/ReviewResults")
    },
    {
      path: '/variable-inputs',
      name: "VariableInputs",
      component: require("@/components/Flow/VariableInputs")
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
      path: '/showFaq/:thisfaq',
      name: 'ShowFaq',
      component: require('@/components/ShowFaq')
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
