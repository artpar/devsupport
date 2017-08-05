<template>
  <div class="ui grid" style="margin-top: calc(30vh - 125px); padding: 0 5em">

    <div class="sixteen wide column" v-if="state == 'scanning-files'">
      <loading v-if="loading"></loading>
    </div>
    <div class="sixteen wide column" v-if="!loading > 0 && state == 'scanned-files'">


      <table class="ui selectable celled table">
        <thead>
        <tr>
          <th>Pending update</th>
          <th>Change status</th>
          <th>Files</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="change in liveChanges">
          <td>{{change.change.name}}</td>
          <td>{{change.change.status}}</td>
          <td>{{change.selectedFiles.length}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="right floated sixteen wide column" v-if="state == 'scanned-files'">
      <button class="ui large primary button right floated" @click="reviewUpdates">Review Inputs</button>
      <button class="ui large orange button right floated" @click="beginValidateProject">Rescan files</button>
    </div>

    <div class="right floated six wide column" v-if="state == 'review-files'">
      <button class="ui large primary button right floated" @click="secondInputs" v-if="!doneChanges">Next
      </button>
      <button class="ui large orange button right floated" @click="state = 'scanned-files'">Back</button>
    </div>

    <div class="sixteen wide column" v-if="state == 'review-files'">
      <div class="ui styled fluid accordion" style="overflow-y: auto; max-height: 53vh">


        <template v-for="liveChange in liveChanges">
          <div :class="{'title': true, 'active': liveChange.change.changeType == 'fileDownload'}">
            <i class="dropdown icon"></i>
            {{liveChange.change.name}}
            <br><br>
            <span v-if="liveChange.selectedFiles.length == 0 && liveChange.change.changeType != 'fileDownload'">No file to be modified</span>
            <span v-if="liveChange.change.changeType == 'fileDownload'"><i class="fa fa-angle-double-down"></i> Action Required</span>
            <span v-if="liveChange.selectedFiles.length == 1 ">Automated action on selected file</span>
            <span v-if="liveChange.selectedFiles.length > 1 ">Multiple files matched, click here and select</span>
          </div>
          <div :class="{'content': true, 'active': liveChange.change.changeType == 'fileDownload'}">
            <div class="ui large form" v-if="liveChange.change.changeType != 'fileDownload'">

              <div class="field" v-for="file in liveChange.selectedFiles">
                <div class="ui radio checkbox" @click="liveChange.selectedFilePath = file.filepath">
                  <input class="hidden" type="radio" :name="liveChange.name" v-model="liveChange.selectedFilePath"
                         :value="file.filepath">
                  <label>{{file.relative}}</label>
                </div>
              </div>

            </div>
            <template v-if="liveChange.change.changeType == 'fileDownload'">
              <button class="ui small primary button right floated" @click="downloadAsFile(liveChange)">
                Download content as file
              </button>
              <br>
              <br>
              <div class="ui column" v-if="liveChange.change.changeType == 'fileDownload'">
                <editor :options="{fontSize: '12pt'}" :lang="liveChange.change.fileType"
                        :content="liveChange.change.change[0].line"></editor>
              </div>

            </template>

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

    <!--second stage variable screeen begins-->

    <div class="sixteen wide column" v-if="state == 'second-inputs'" style="overflow-y: auto; max-height: 54vh">
      <h2>Please enter the following details:</h2>
      <br>
      <div class="ui large form">
        <div class="sixteen wide required field" v-for="variable2 in secondStageVariables">
          <h3>{{variable2.label}}</h3>
          <input :placeholder="variable2.help" v-model="variable2.value" type="text">
          <p>
            <small>{{variable2.description}}</small>
          </p>
        </div>
      </div>

    </div>
    <div class="right floated sixteen wide column" v-if="state == 'second-inputs'">
      <button class="ui large primary button right floated" @click="doChanges" v-if="!doneChanges">Apply changes
      </button>
      <button class="ui large orange button right floated" @click="state = 'scanned-files'">Back</button>
    </div>

    <!--second stage variable screen ends-->


    <div class="sixteen wide column" v-if="state == 'review-updates'" style="overflow-y: auto; max-height: calc(100vh - 125px);">

      <h2>Please enter the following details:</h2>
      <br>
      <div class="ui large form">
        <div class="sixteen wide required field" v-for="variable in variables">
          <h3>{{variable.label}}</h3>
          <input :placeholder="variable.help" v-model="variable.value" type="text">
          <p>
            <small>{{variable.description}}</small>
          </p>
        </div>
      </div>

    </div>

    <div class="right floated sixteen wide column" v-if="state == 'review-updates'">
      <button class="ui large primary button right floated " @click="reviewFiles">Review files</button>
      <button class="ui large orange button right floated " @click="listScannedFiles" v-if="!doneChanges">Back</button>
    </div>

    <!--result page begins-->

    <div class="sixteen wide column " v-if="state == 'review-results'">


      <h1>Results</h1>

      <!--<div class="ui styled fluid accordion" style="overflow-y: auto; max-height: 53vh;">-->
      <!--<template v-for="liveChange in liveChanges">-->

      <!--<div class="title active">-->
      <!--<i class="dropdown icon"></i>{{liveChange.change.name}}-->
      <!--</div>-->
      <!--<div class="content active">-->
      <!--<span>{{liveChange.change.status}}</span>-->
      <!--</div>-->

      <!--</template>-->
      <!--</div>-->


      <div class="ui large bottom aligned divided relaxed animated list">
        <template v-for="liveChange in liveChanges">
          <div class="ui fluid item">
            <div class="content"><i class="info circle aligned primary icon"></i>
              {{liveChange.change.name}}
              <i v-if="liveChange.change.status=='Completed'" class="right floated large checkmark green icon"></i>
              <i v-else class="right floated large warning circle orange icon"></i>
            </div>
          </div>
        </template>
      </div>
      <br/>

      <div class="ui segment">
        <img class="ui top aligned left floated image" style="margin-top: 6%" src="~@/images/launch.png"/>
        <div class="ui center aligned basic segment"><span class="devcolor" style="font-size: 22px"> Integration should be done now<br><br></span>
          <span style="font-size: 16px">You can now build and run the project<br><br></span>
          <span style="font-size: 20px; margin:1em">Did it help?</span>
          <button class="ui primary button" style="margin: 1em" @click="feedBackYes">Yes</button>
          <button class="ui orange button" style="margin: 1em" @click="feedBackNo">No</button>
          <span><br>We are collecting this information for our feedback</span>
        </div>


      </div>

    </div>

    <!--<div class="right floated four wide column" v-if="state == 'review-results'">-->
    <!--<button class="ui large primary button right floated" @click="reset">Close</button>-->
    <!--</div>-->
    <!--result page ends-->

  </div>
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


  //  import Integrations from '@/plugins/Integrations'


  String.prototype.repeat = function (times) {
    return (new Array(times + 1)).join(this);
  };


  //  const fs = require('fs');
  var fs = require('file-system');


  export default {
    mounted() {
      this.setPageDesc("/app/integrationProcess","IntegrationProcess");
      console.log("pageDesc",this.pageDesc);
      this.$store.commit('PAGE_VIEW',this.pageDesc);
      var that = this;
      this.setIntegration(this.$route.params.id);

      jsonApi.find('integration', this.$route.params.id).then(function (obj) {
        console.log("found integration", obj);
        var changeSet = JSON.parse(obj.change_set);
        that.selectedIntegration = changeSet;
        that.beginValidateProject();
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
        selectedIntegration: null,
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
      setPageDesc(path,title) {
        this.pageDesc.path=path;
        this.pageDesc.title=title;
      },
      setEventDesc(category,action,label) {
        this.eventDesc.category=category;
        this.eventDesc.action=action;
        this.eventDesc.label=label;
      },
      downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      downloadAsFile(liveChange) {
        console.log("download file as contents", liveChange);
        this.downloadURI("data:text/csv;base64," + window.btoa(liveChange.change.change[0].line), liveChange.change.fileName)
      },
      variableUpdate() {
        console.log("variable update", arguments);
      },
      ...mapActions(['setProjectDir', 'setSessionAction']),
      reset() {
        this.setProjectDir({
          projectDir: null
        });
        this.setSessionAction(null);
        this.$router.push({
          name: "select-project"
        })
      },
      feedBackYes() {
        this.setEventDesc("feedBack","yes","did it help?");
        console.log("eventDesc",this.eventDesc);
        this.$store.commit('GA_EVENT',this.eventDesc);
        this.setPageDesc("/app", "home");
        this.$store.commit('PAGE_VIEW', this.pageDesc);
        this.reset();

      },
      feedBackNo() {
        this.setEventDesc("feedBack","no","did it help?");
        console.log("eventDesc",this.eventDesc);
        this.$store.commit('GA_EVENT',this.eventDesc);
        this.setPageDesc("/app", "home");
        this.$store.commit('PAGE_VIEW', this.pageDesc);
        this.reset();

      },
      reviewFiles() {
        var that = this;


        var contextMap = {};

        var invalidFields = that.variables.filter(function (variable) {
          contextMap[variable.name] = variable.value;
          return variable.value == null || variable.value.length < 2;
        });

        if (invalidFields.length > 0) {
          that.$alert(invalidFields[0].label + " is left empty.", 'Missing value');
          return
        }

        that.liveChanges.map(function (liveChange) {
          liveChange.evaluateTemplates(contextMap)
        });

        that.state = "review-files";
        console.log("set timeout for do accordian");
        setTimeout(function () {
          console.log("do accordian");
          jQuery('.ui.accordion').accordion();
        }, 300)
      },
      listScannedFiles() {
        var that = this;
        that.state = "scanned-files";

      },
      secondInputs() {
        var that = this;
        that.state = "second-inputs";

        if (that.secondStageVariables.length < 1) {
          setTimeout(function () {
            that.doChanges();
          }, 300)
        }

      },
      reviewUpdates() {
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

        var contextMap = {};

        var invalidFields = that.secondStageVariables.filter(function (variable) {
          contextMap[variable.name] = variable.value;
          return variable.value == null || variable.value.length < 2;
        });

        that.variables.filter(function (variable) {
          contextMap[variable.name] = variable.value;
          return variable.value == null || variable.value.length < 2;
        });

        if (invalidFields.length > 0) {
          that.$alert(invalidFields[0].label + " is left empty.", 'Missing value');
          return
        }


        console.log("start doing changes")


        function doIndex(ith, doIndex) {
          console.log("do change", ith);
          if (that.liveChanges.length == ith) {
            that.callbackChangeComplete();
            return;
          }
//          debugger
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
        this.setPageDesc("/app/results","Results");
        console.log("pageDesc",this.pageDesc);
        this.$store.commit('PAGE_VIEW',this.pageDesc);
      },
      callbackChangeComplete() {
        var that = this;
        var remaining = this.liveChanges.filter(function (e) {
          return e.change.status == "pending";
        }).length;
        if (remaining == 0) {
          that.doneChanges = true;
          that.viewResult();
        }
      },
      beginValidateProject() {
        var that = this;
        that.loading = true;
        that.state = "scanning-files";
        console.log(this.Project.projectDir);
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
        fs.recurse(that.Project.projectDir,
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