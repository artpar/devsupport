<template>

</template>
<script>
  import {mapState} from 'vuex';
  import {mapActions} from 'vuex';
  import jsonApi from '../plugins/jsonApi'

  import JavaParser from 'java-parser';
  import FileProcessorFactor from '@/plugins/changehandler'

  import editor from 'vue2-ace'
  import 'brace/mode/php'
  import 'brace/theme/chrome'

  //  const fs = require('fs');


  export default {
    mounted() {
      this.$store.commit('PAGE_VIEW', {
        page: "/app/integrationProcess",
        event: "IntegrationProcess"
      });
    },
    components: {
      editor
    },
    data() {
      return {
        variables: [],
        secondStageVariables: [],
        doneChanges: false,
        searchDef: {
          show: false
        },
        liveChanges: [],
        state: "scanning-files",
        loading: false,
        selectedFiles: [],
        actions: [],
        pageDesc: [
          {
            path: null,
            title: null,
          }
        ],
        eventDesc: [
          {
            category: null,
            action: null,
            label: null,
          }
        ],
      }
    },
    methods: {
      variableUpdate() {
        console.log("variable update", arguments);
      },
      ...mapActions(['setProjectDir', 'setSessionAction']),



      ...mapActions(['setIntegration']),
    },
    computed: {
      ...mapState(['Project'])
    }
  }
</script>
<style>
  .trash {
    color: rgb(209, 91, 71);
  }

  .flag {
    color: rgb(248, 148, 6);
  }

  .panel-body {
    padding: 0px;
  }

  .panel-footer .pagination {
    margin: 0;
  }

  .panel .glyphicon, .list-group-item .glyphicon {
    margin-right: 5px;
  }

  .panel-body input[type=checkbox]:checked + label {
    text-decoration: line-through;
    color: rgb(128, 144, 160);
  }

  .list-group-item:hover, a.list-group-item:focus {
    text-decoration: none;
    background-color: rgb(245, 245, 245);
  }

  .list-group {
    margin-bottom: 0px;
  }
</style>