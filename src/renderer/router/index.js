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
      path: '/scanning-files/:id',
      name: "ScanningFiles",
      component: require("@/components/Flow/ScanningFiles")
    },
    {
      path: '/scanned-files',
      name: "ScanningFiles",
      component: require("@/components/Flow/ScannedFiles")
    },
    {
      path: '/review-changes',
      name: "ReviewChanges",
      component: require("@/components/Flow/ReviewChanges")
    },
    {
      path: '/second-inputs',
      name: "SecondInputs",
      component: require("@/components/Flow/SecondInputs")
    },
    {
      path: '/review-updates',
      name: "ReviewUpdates",
      component: require("@/components/Flow/ReviewUpdates")
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
      path: '/scanning/:id',
      name: "ScanningFiles",
      component: require("@/components/Flow/ScanningFiles")
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
