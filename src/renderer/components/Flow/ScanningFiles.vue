<template>
  <div class="ui grid" style="padding: 0 5em">

    <div class="sixteen wide column">
      <loading v-if="loading"></loading>
    </div>
  </div>
</template>
<script>
  import jsonApi from '../../plugins/jsonApi'
  import {mapActions} from 'vuex';

  var fs = require('file-system');
  import JavaParser from 'java-parser';
  import FileProcessorFactor from '@/plugins/changehandler'
  import {mapState} from 'vuex';

  export default {
    data() {
      return {
        loading: true,
        selectedIntegration: null,
        liveChanges: [],
        variables: [],
        secondStageVariables: [],
      }
    },
    methods: {
      ...mapActions(['setProjectDir', 'setChanges', 'setIntegration', 'setVariables', 'setSecondStageVariables']),
      beginValidateProject() {
        var that = this;
        that.loading = true;
        console.log("begin ", this.Project.projectDir);
        that.actions = [];
        that.liveChanges = [];
        that.variables = [];
        that.secondStageVariables = [];

        this.selectedIntegration.changes.map(function (change) {
          console.log("Push change", change);
          that.liveChanges.push(new FileProcessorFactor.ChangeHandler(change));

          console.log("variables from changes");
          if (change.variables && change.variables.length > 0) {
            change.variables.map(function (variable) {
              variable.value = null;
//              debugger
              if (variable.stage == 1) {
                that.variables.push(variable);
              } else if (variable.stage == 2) {
                that.secondStageVariables.push(variable);
              }
            })
          }
        });


        that.setVariables(that.variables);
        that.setSecondStageVariables(that.secondStageVariables);
        console.log("Set variables and second stage variables", that.variables, that.secondStageVariables);

        that.files = [];


        var filesToEdit = [{
          matchConditions: [
            new RegExp(".java$")
          ],
          nonMatchConditions: [
            new RegExp("R.java")
          ]
        }, {
          matchConditions: [
            new RegExp("build.gradle")
          ]
        }, {
          matchConditions: [
            new RegExp("AndroidManifest.xml")
          ]
        }];

        let completeTimeout = setTimeout(function () {
          completed();
        }, 2000);

        var changes = [];


        function completed() {
          console.log("completed scan", that.liveChanges);
          that.loading = false;
          that.setChanges(that.liveChanges);
          console.log("set changes", that.liveChanges);
          that.$router.push({
            name: 'ReviewUpdates'
          })
        }

        console.log("begin recurse dir for ", that.Project.projectDir);
        fs.recurse(that.Project.projectDir,
            ['**/*.java', '**/*.xml', '**/build.gradle'], function (filepath, relative, filename) {

              console.log("callback point 1", filepath, relative, filename);
              if (typeof filename != "undefined") {


                if (completeTimeout) {
                  clearTimeout(completeTimeout);
                  completeTimeout = setTimeout(function () {
                    completed();
                  }, 700);
                }
                var matched = false;
                for (var k = 0; k < filesToEdit.length; k++) {

                  var conditions = filesToEdit[k];
                  var matching = true;
                  if (conditions.matchConditions) {

                    for (var o = 0; o < conditions.matchConditions.length; o++) {
                      if (!filepath.match(conditions.matchConditions[o])) {
                        matching = false;
                        break;
                      }
                    }
                  }

                  if (!matching) {
                    // console.log("no match for ", conditions.matchConditions[o], filepath)
                    continue
                  }

                  if (conditions.nonMatchConditions) {
                    for (var o = 0; o < conditions.nonMatchConditions.length; o++) {
                      if (filepath.match(conditions.nonMatchConditions[o])) {
                        matching = false;
                        // console.log("match for ", conditions.nonMatchConditions[o], filepath)

                      }
                    }
                  }
                  matched = matching;
                  break;
                }


                // console.log("File ", filename, matched);
                if (matched) {
                  var file = {
                    filename: filename,
                    filepath: filepath,
                    relative: relative,
                  };
                  that.liveChanges.map(function (liveChange) {
                    console.log("add file to live change", liveChange, file);
                    liveChange.addFile(file)
                  });
                }

                // it's file
              } else {

                // it's folder
              }
            });
      }
    },
    computed: {
      ...mapState(['Project'])
    },
    mounted() {
      var that = this;
      that.$store.commit('PAGE_VIEW', getPageDesc("/app/integrationProcess", "ScanningFiles"));
      that.setIntegration(this.$route.params.id);

      jsonApi.find('integration', that.$route.params.id).then(function (obj) {
        console.log("found integration", obj);
        var changeSet = JSON.parse(obj.change_set);
        that.selectedIntegration = changeSet;
        that.beginValidateProject();
      });

    }
  }
</script>