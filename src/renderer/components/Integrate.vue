<template>
  <div class="ui grid">

    <div class="sixteen wide column" v-if="state == 'scanning-files'">
      <loading v-if="loading"></loading>
    </div>
    <div class="sixteen wide column" v-if="!loading > 0 && state == 'scanned-files'">

      <data-tables
          :actions-def="actionDef"
          :checkbox-filter-def="checkboxFilterDef"
          :row-action-def="rowActionDef"
          :search-def="searchDef"
          :has-action-col="false"
          :pagination-def="{}"
          :data='liveChanges'>
        <el-table-column prop="change.name"
                         label="Pending update">
        </el-table-column>
        <el-table-column
            prop="change.status"
            label="Change status">
        </el-table-column>
        <el-table-column
            prop="selectedFiles.length"
            label="Files ">
        </el-table-column>

      </data-tables>


    </div>
    <div class="right floated six wide column" v-if="state == 'scanned-files'">
      <el-button type="warning" @click="beginValidateProject" size="large">Rescan files</el-button>
      <el-button type="primary" @click="reviewUpdates" size="large">Review Inputs</el-button>
    </div>

    <div class="sixteen wide column" v-if="state == 'review-files'">
      <div class="ui styled fluid accordion">


        <template v-for="liveChange in liveChanges">
          <div class="title ">
            <i class="dropdown icon"></i>
            {{liveChange.change.name}}
            ->
            <span v-if="liveChange.selectedFiles.length == 0 ">No file to be modified</span>
            <span v-if="liveChange.selectedFiles.length == 1 ">{{liveChange.selectedFilePath}}</span>
            <span v-if="liveChange.selectedFiles.length > 1 ">Multiple files matched, click here and select</span>
          </div>
          <div class="content ">
            <div class="ui form">
              <div class="grouped fields">

                <div class="field" v-for="file in liveChange.selectedFiles">
                  <div class="ui radio checkbox" @click="liveChange.selectedFilePath = file.filepath">
                    <input class="hidden" type="radio" :name="liveChange.name" v-model="liveChange.selectedFilePath"
                           :value="file.filepath">
                    <label>{{file.relative}}</label>
                  </div>
                </div>

              </div>
            </div>

          </div>
          <div class="extra content">
              <span v-if="liveChange.selectedFiles.length == 0 ">
              No files matched the search, or the validation failed. <br/>
            </span>
            <span v-if="liveChange.selectedFiles.length > 1 ">
              More then 1 file matched our search for the correct file to change. Choose the file you want to be modified
              </span>


          </div>
        </template>
      </div>


    </div>

    <div class="right floated six wide column" v-if="state == 'review-files'">
      <el-button @click="state = 'scanned-files'" size="large">Back</el-button>
      <el-button @click="reviewFiles" size="large">Review files</el-button>
    </div>


    <div class="sixteen wide column" v-if="state == 'review-updates'">

      <h1>Please enter the following details</h1>
      <br><br>
      <div class="ui massive form">
        <div class="sixteen wide required field" v-for="variable in variables">
          <h2>{{variable.label}}</h2>
          <input :placeholder="variable.label" v-model="variable.value" type="text">
          <p>
            <small>{{variable.description}}</small>
          </p>
        </div>
      </div>

    </div>

    <div class="right floated six wide column" v-if="state == 'review-updates'">
      <el-button type="warning" @click="listScannedFiles" v-if="!doneChanges" size="large">Back</el-button>
      <el-button type="primary" @click="viewResult" v-if="doneChanges" size="large">Next</el-button>
      <el-button type="primary" @click="doChanges" v-if="!doneChanges" size="large">Apply changes</el-button>
    </div>

    <div class="sixteen wide column " v-if="state == 'review-results'">
      <div class="ui ordered steps mini ">
        <div class="completed step">
          <div class="content">
            <div class="title">
              Project Source
            </div>
            <div slot="description">
              {{Project.projectDir}}
            </div>
          </div>
        </div>
        <div class="completed step" title="Choose integration">
          <div class="content">
            <div class="title">
              Choose integration
            </div>
            <div slot="description">
              {{selectedIntegration.name}}
            </div>
          </div>
        </div>
        <div class="completed step" title="Review">
          <div class="content">
            <div class="title">
              Review
            </div>
          </div>
        </div>
        <div class="completed step" title="Execute">
          <div class="content">
            <div class="title">
              Execute
            </div>
          </div>
        </div>
      </div>

      <h2>Results</h2>

      <div class="ui styled fluid accordion">
        <template v-for="liveChange in liveChanges">

          <div class="title active">
            <i class="dropdown icon"></i>{{liveChange.change.name}}
          </div>
          <div class="content active">
            <span>{{liveChange.change.status}}</span>
          </div>

        </template>
      </div>


    </div>

    <div class="right floated four wide column" v-if="state == 'review-results'">
      <el-button size="large" @click="reset">Close</el-button>
    </div>


  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import {mapActions} from 'vuex';
  import jsonApi from '../plugins/jsonApi'
  import {Notification} from 'element-ui';

  import JavaParser from 'java-parser';
  import FileProcessorFactor from '@/plugins/changehandler'
  //  import Integrations from '@/plugins/Integrations'


  String.prototype.repeat = function (times) {
    return (new Array(times + 1)).join(this);
  };


  //  const fs = require('fs');
  var fs = require('file-system');


  export default {
    mounted() {
      var that = this;
      this.setIntegration(this.$route.params.id);

      jsonApi.find('integration', this.$route.params.id).then(function (obj) {
        console.log("found integration", obj);
        var changeSet = JSON.parse(obj.change_set);
        that.selectedIntegration = changeSet;
        that.beginValidateProject();
      });


    },
    data() {
      return {
        variables: [],
        doneChanges: false,
        searchDef: {
          show: false
        },
        liveChanges: [],
        state: "scanning-files",
//        integrations: Integrations,
        loading: false,
        selectedIntegration: null,
        selectedFiles: [],
        actions: [],
        actionDef: {
          width: 5,
          def: []
        },
        checkboxFilterDef: {
          width: 14,
          props: 'state_code',
          def: []
        },
        rowActionDef: [{
          type: 'primary',
          handler: function handler(row) {
            self.$message('Edit clicked');
            console.log('Edit in row clicked', row);
          },

          name: 'Edit'
        }, {
          type: 'primary',
          handler: function handler(row) {
            self.$message('RUA in row clicked');
            console.log('RUA in row clicked', row);
          },

          name: 'RUA'
        }]
      }
    },
    methods: {
      variableUpdate(){
        console.log("variable update", arguments);
      },
      ...mapActions(['setProjectDir', 'setSessionAction']),
      reset() {
        this.setProjectDir(null);
        this.setSessionAction(null);
        this.$router.push({
          name: "select-project"
        })
      },
      reviewFiles() {
        var that = this;
        that.state = "review-files";
        console.log("set timeout for do accordian");
        setTimeout(function () {
          console.log("do accordian");
          jQuery('.ui.accordion').accordion();
        }, 300)
      },
      listScannedFiles(){
        var that = this;
        that.state = "scanned-files";

      },
      reviewUpdates(){
        var that = this;
        that.state = "review-updates";
        setTimeout(function () {
          console.log("do accordian");
          jQuery('.ui.accordion').accordion();
        }, 300)

      },
      viewResult() {
        var that = this;
        that.state = "review-results";
        setTimeout(function () {
          console.log("do accordian");
          jQuery('.ui.accordion').accordion();
        }, 300);
      },
      doChanges() {
        var that = this;
        console.log(this.liveChanges);
        var startCount = 0;

        console.log("variables", that.variables);
        var contextMap = {};

        var invalidFields = that.variables.filter(function (variable) {
          contextMap[variable.name] = variable.value;
          return variable.value == null || variable.value.length < 2;
        });

        if (invalidFields.length > 0) {
          Notification.error({
            message: invalidFields[0].label + " is left empty."
          });
          return
        }

        console.log("start doing changes")


        function doIndex(ith, doIndex) {
          console.log("do change", ith);
          if (that.liveChanges.length == ith) {
            that.callbackChangeComplete();
            return;
          }
          debugger
          that.liveChanges[ith].doChanges(contextMap).then(function () {
            doIndex(ith + 1, doIndex);
          }).catch(function () {
            doIndex(ith + 1, doIndex);
          });
        }

        doIndex(0, doIndex);
//
//        this.liveChanges.forEach(function (liveChange) {
//          startCount += 1;
//          liveChange.doChanges().then(function () {
//            that.callbackChangeComplete();
//          }).catch(function () {
//            that.callbackChangeComplete();
//          });
//        });
//
//
//        if (this.liveChanges.length == 0) {
//          that.callbackChangeComplete();
//        }
      },
      callbackChangeComplete() {
        var that = this;
        var remaining = this.liveChanges.filter(function (e) {
          return e.change.status == "pending";
        }).length;
        if (remaining == 0) {
//          that.doneChanges = true;
        }
      },
      beginValidateProject(){
        var that = this;
        that.loading = true;
        that.state = "scanning-files";
        console.log(this.Project.projectDir);
        that.actions = [];
        that.liveChanges = [];
        that.variables = [];

        this.selectedIntegration.changes.map(function (change) {
          console.log("Push change", change);
          that.liveChanges.push(new FileProcessorFactor.ChangeHandler(change));

          console.log("variables from changes");
          if (change.variables && change.variables.length > 0) {
            change.variables.map(function (variable) {
              variable.value = null;
              that.variables.push(variable);
            })
          }
        });
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
          console.log("completed scan");
          that.loading = false;
          that.state = "scanned-files";
        }

        console.log("begin recurse dir for ", that.Project.projectDir);
        fs.recurseSync(that.Project.projectDir,
            ['**/*.java', '**/*.xml', '**/build.gradle'], function (filepath, relative, filename) {
              // console.log("callback point 1")
              if (typeof filename != "undefined") {
                // console.log("recurse callback", filename.toLowerCase(), filepath, filesToEdit);


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
                    // console.log("add file to live change", liveChange, file);
                    liveChange.addFile(file)
                  });
                }

                // it's file
              } else {
                // it's folder
              }
            });

//        fs.readdir(this.Project.projectDir, function (err, files) {
//          if (err) {
//            console.error(err)
//          }
//          console.log("files", files);
//          files.map(function (file) {
//            fs.stat(that.Project.projectDir + "/" + file, function (err, stats) {
//              if (err) {
//                console.error(err)
//              }
//              console.log(file, stats)
//
//            })
//          })
//        })
      },
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