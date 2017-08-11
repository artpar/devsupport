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
      ...mapActions([
        'setProjectDir',
        'setChanges',
        'setIntegration',
        'setVariables',
        'setVariableValidations',
        'setSecondStageVariables'
      ]),
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
//          if (change.variables && change.variables.length > 0) {
//            change.variables.map(function (variable) {
//              variable.value = null;
////              debugger
//              if (variable.stage == 1) {
//                that.variables.push(variable);
//              } else if (variable.stage == 2) {
//                that.secondStageVariables.push(variable);
//              }
//            })
//          }
        });


        if (this.selectedIntegration.variables && this.selectedIntegration.variables.length > 0) {
          this.selectedIntegration.variables.map(function (variable) {
            variable.value = null;
//              debugger
            if (variable.stage == 1) {
              that.variables.push(variable);
            } else if (variable.stage == 2) {
              that.secondStageVariables.push(variable);
            }
          })
        }


        if (this.selectedIntegration.variableValidations) {
          that.setVariableValidations(this.selectedIntegration.variableValidations)
        }


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
//        var changeSet = JSON.parse(obj.change_set);


        var changeSet = {
          "name": "Instamojo Android Integration",
          "variables": [{
            "name": "serverurl",
            "label": "Server Url",
            "stage": 1,
            "description": "Server URL to generate hash",
            "help": "The url pointing to the script"
          }],
          "variableValidations": [{
            "validationType": "http",
            "errorLabel": "Server is not properly configured at the given url",
            "params": {
              "url": "{{=it.serverurl}}",
              "method": "GET",
              "headers": {},
              "body": {}
            },
            "expectations": [{
              "field": "$.status",
              "value": "200",
              "operator": "eq",
            }],
            "stage": 1
          }],
          "changes": [{
            "name": "Add dependency for InstaMojo SDK",
            "fileSelector": ".+build.gradle$",
            "changeType": "fileEdit",
            "fileType": "gradle",
            "change": [{
              "changeType": "add.line",
              "line": "\ncompile 'ai.devsupport.instamojo:instamojolib:0.0.3'",
              "action": "append",
              "query": "compile 'com.android.support",
              "validations": [{
                "checkType": "negative",
                "query": "godel-release/godel"
              },
                {
                  "checkType": "negative",
                  "query": "instamojo:instamojolib"
                },
                {
                  "checkType": "positive",
                  "query": "compile 'com.android.support"
                }
              ]
            },
              {
                "changeType": "add.line",
                "line": "mavenCentral()\n    maven {\n        url \"https://s3-ap-southeast-1.amazonaws.com/godel-release/godel/\"\n    }",
                "action": "append",
                "query": "repositories[ \t]*{",
                "validations": [{
                  "checkType": "positive",
                  "query": "repositories"
                }, {
                  "checkType": "negative",
                  "query": "godel-release/godel"
                }]
              },
              {
                "changeType": "add.line",
                "line": "repositories {\n    mavenCentral()\n    maven {\n        url \"https://s3-ap-southeast-1.amazonaws.com/godel-release/godel/\"\n    }\n}\n",
                "action": "prepend",
                "query": "dependencies[ \t]*{",
                "validations": [{
                  "checkType": "negative",
                  "query": "repositories"
                }, {
                  "checkType": "negative",
                  "query": "godel-release/godel"
                }]
              }
            ],
            "validations": [{
              "checkType": "positive",
              "query": "apply plugin: 'com.android.application'"
            }]
          },
            {
              "name": "Add key to AndroidManifest.xml",
              "fileSelector": ".+main[\\\\/]AndroidManifest.xml",
              "changeType": "fileEdit",
              "fileType": "xml",
              "change": [{
                "changeType": "add.line",
                "line": "<meta-data android:name=\"instamojo.orderauth.url\"\n                   android:value=\"{{=it.serverurl}}\"\n            />",
                "action": "prepend",
                "query": "</application>"
              },
                {
                  "changeType": "add.line",
                  "line": "<uses-permission android:name=\"android.permission.INTERNET\"/>\n    <uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\" />\n    //required for Juspay to read the OTP from the SMS sent to the device\n    <uses-permission android:name=\"android.permission.READ_PHONE_STATE\" />\n    <uses-permission android:name=\"android.permission.READ_SMS\" />\n    <uses-permission android:name=\"android.permission.RECEIVE_SMS\" />    <uses-permission-sdk-23 android:name=\"android.permission.READ_PHONE_STATE\" />\n    <uses-permission-sdk-23 android:name=\"android.permission.READ_SMS\" />\n    <uses-permission-sdk-23 android:name=\"android.permission.RECEIVE_SMS\" />",
                  "action": "append",
                  "query": "</application>"
                }
              ],
              "validations": [{
                "checkType": "negative",
                "query": "instamojo.orderauth.url"
              }]
            },
            {
              "name": "Add functions to some Activity.java for Initiate Pay and Handle Response",
              "fileSelector": ".+Activity.java",
              "changeType": "fileEdit",
              "fileType": "java",
              "change": [{
                "changeType": "add.line",
                "action": "append",
                "query": "{",
                "line": "private void callInstamojo(String email, String phone, String amount, String purpose, String buyername) {\n        Intent intent = new Intent(MainActivity.this, Instamojo.class);\n        intent.putExtra(\"email\", email);\n        intent.putExtra(\"phone\", phone);\n        intent.putExtra(\"purpose\", purpose);\n        intent.putExtra(\"amount\", amount);\n        intent.putExtra(\"name\", buyername);\n        intent.putExtra(\"env\", Config.TEST);   /* Change this to Config.PROD when you are ready*/ \n       startActivityForResult(intent, Config.INSTAMOJO);\n    }",
                "validations": [{
                  "checkType": "negative",
                  "query": "callInstamojo"
                }]
              },
                {
                  "changeType": "add.line",
                  "action": "append",
                  "query": "{",
                  "line": "@Override\n    protected void onActivityResult(int requestCode, int resultCode, Intent data) {\n        switch (requestCode) {\n            case Config.INSTAMOJO:\n                switch (resultCode) {\n                    case Config.SUCCESS:\n                        Toast.makeText(getApplicationContext(), data.getStringExtra(\"response\"), Toast.LENGTH_LONG)\n                                .show();\n                        break;\n                    case Config.FAILED:\n                        Toast.makeText(getApplicationContext(), data.getStringExtra(\"response\"), Toast.LENGTH_LONG)\n                                .show();\n                        break;\n                    default:\n                        break;\n                }\n\n            default:\n                break;\n        }\n    }",
                  "validations": [{
                    "checkType": "negative",
                    "query": "onActivityResult"
                  }]
                },
                {
                  "changeType": "add.line",
                  "action": "append",
                  "query": "import",
                  "line": "import instamojo.library.Config;\nimport instamojo.library.Instamojo;                        \nimport android.content.Intent;",
                  "validations": [{
                    "checkType": "negative",
                    "query": "lazypay.app.Instamojo"
                  }]
                },
                {
                  "changeType": "add.line",
                  "action": "append",
                  "query": "setContentView",
                  "line": "// Call the function callInstamojo to start payment here",
                  "validations": [{
                    "checkType": "negative",
                    "query": "Call the function callInstamojo"
                  }]
                }
              ],
              "validations": []
            }
          ]
        };
        that.selectedIntegration = changeSet;
        that.beginValidateProject();
      });

    }
  }
</script>