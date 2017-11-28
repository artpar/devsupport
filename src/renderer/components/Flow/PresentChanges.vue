<template>
  <div class="ui grid" style="padding: 0 5em">
    <input type="file" style="display: none" id="folderChooser" webkitdirectory directory @change="folderSelected">
    <div class="sixteen wide column">
      <div style="overflow-y: auto; max-height: calc(100vh - 190px);">
        <div class="ui relaxed divided list">
          <div class="item" v-for="item in changes" style="margin-top: 0.3em;">
            <label :for="item.name">
              <h3 style="margin-top: 1em;">
                {{item.change.name}}
              <span v-if="item.change.changeType === 'fileSave'" style="font-size: 0.75em; margin-left: 1em; vertical-align: text-bottom;">
                <i class="download_as_file_button c-pointer material-icons" @click="saveFiles(item)">file_download</i>
              </span></h3>

            </label>
            <div class="relaxed list" style="padding-left: 1em;">
              <div v-if="item.selectedFiles=='' && item.change.changeType == 'fileEdit'" class="item">

                <div class="ui icon message">
                  <i class="material-icons" style="margin-right: 0.5em;">warning</i>
                  <div class="content devblue">
                    Cant {{item.change.name}} because either no suitable files were found or they already have the required changes.
                  </div>
                </div>

              </div>
              <div class="item" v-for="file in item.selectedFiles" v-if="['fileEdit', 'fileAdd'].indexOf(item.change.changeType) > -1">
                <div class="ui radio checkbox"
                     @click="item.selectedFilePath = file.filepath">
                  <input
                      class="hidden"
                      type="radio"
                      :name="item.name"
                      v-model="item.selectedFilePath"
                      :value="file.filepath">
                  <label>
                    <div class="devblue">{{file.relative}}</div>
                  </label>
                </div>
              </div>
              <div v-if="item.change.changeType == 'fileShow'" class="field download devblue">

                <editor :options="options" style="width: 100%; height: 50vh" rows="10"
                        :content="item.change.change[0].line" :lang="'html'"></editor>
              </div>
              <div v-if="item.change.changeType == 'fileDownload'" class="field download devblue">
                {{item.change.fileName}}
                <i class="download_as_file_button c-pointer material-icons"
                   @click="downloadAsFile(item)">file_download</i>
              </div>

              <div v-if="item.change.changeType == 'fileSave'" class="field download devblue" >
                <ul class="ui bulleted relaxed list">
                <li class="item" v-for="fileToSave in item.change.change">
                  {{fileToSave.fileName}}
                </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div v-if="downloadNum > 0" style="margin-bottom: 1.7em"></div>
        <div v-if="downloadNum > 0" class="ui icon message">
          <i class="material-icons devblue" style="margin-right: 0.5em; font-size: 3.5em;">info_outline</i>
          <div class="content devblue" style="font-family: 'Raleway',sans-serif; font-size: medium">
            <ul class="list">


              <li v-for="item in changes" v-html="item.change.help">
              </li>

            </ul>
          </div>
        </div>


        <!--<div v-if="changes[0] && changes[0].change.changeType == 'fileShow'" style="margin-bottom: 1.7em"></div>-->
        <!--<div v-if="changes[0] && changes[0].change.changeType == 'fileShow'" class="ui icon message">-->
        <!--<i class="material-icons devblue" style="margin-right: 0.5em; font-size: 3.5em;">info_outline</i>-->
        <!--<div class="content devblue" style="font-family: 'Raleway',sans-serif; font-size: medium">-->
        <!--<ul class="list">-->

        <!--<li v-for="item in changes">{{changes[0].change.help}}</li>-->

        <!--</ul>-->
        <!--</div>-->
        <!--</div>-->


      </div>
    </div>


    <div class="sixteen wide column">
      <button class="ui large secondary button right floated" v-if="!lastStage" @click="nextStage">Next</button>
      <button class="ui large secondary button right floated" v-if="lastStage" @click="applyChanges">Apply changes
      </button>
      <button class="ui large orange button left floated" @click="goBackStage">Back</button>
    </div>
  </div>
</template>
<script>
  import {mapActions} from 'vuex';
  import {mapState} from 'vuex';
  import editor from 'vue2-ace';
  import 'brace/mode/html';
  import 'brace/theme/chrome';
  import fs from 'fs';

  var path = require('path');
  var pathSep = path.sep;


  let mkdirSync = function (path) {

    var dirs = path.split(pathSep);
    var root = "";

    while (dirs.length > 0) {
      var dir = dirs.shift();
      if (dir === "") {// If directory starts with a /, the first path will be an empty string.
        root = pathSep;
      }
      if (!fs.existsSync(root + dir)) {
        fs.mkdirSync(root + dir);
      }
      root += dir + pathSep;
    }
  };

  export default {
    components: {
      editor
    },
    methods: {
      folderSelected() {
        var chooser = document.getElementById("folderChooser");
        var targetFolder = chooser.files[0].path;
//        jQuery("#folderChooser").reset();
        chooser.value = null;
        console.log("folder selected", arguments, this.fileSaver, chooser.getAttribute("value"));
        for (var i = 0; i < this.fileSaver.change.change.length; i++) {
          var fileToSave = this.fileSaver.change.change[i];

          console.log("save file", fileToSave);


          (function (file, folderPath) {

            let targetPath = folderPath + "/" + file.fileName;

            var targetBase = path.parse(targetPath).dir;

            console.log("check dir exists", targetBase);
            if (!fs.existsSync(targetBase)) {
              console.log("Target base doesnt exist, create one")
              var resss  = mkdirSync(targetBase);
              console.log("makdir result", resss)
            }

            console.log("Write response to ", targetPath);
            var out = fs.createWriteStream(targetPath);
            out.on("open", function (fd) {
              out.write(new Buffer(file.line), function () {
                console.log("fs write completed", arguments);
                out.end();
              });
            });


          })(fileToSave, targetFolder)

        }
      },
      applyChanges() {
        this.$router.push({
          name: "ApplyChanges"
        })
      },
      ...mapActions(["setStage"]),
      downloadAsFile(liveChange) {
        console.log("download file as contents", liveChange);
        this.downloadURI("data:text/csv;base64," + window.btoa(liveChange.change.change[0].line), liveChange.change.fileName)
      },
      saveFiles(liveChange) {
        console.log("save file changes", liveChange);
        this.fileSaver = liveChange;
        document.getElementById("folderChooser").click();
      },
      downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      goBackStage() {
        var that = this;

        if (that.Project.stage == 1) {
          this.$router.push({
            name: "ScanningFiles"
          });
          return
        }

        that.setStage(that.Project.stage - 1);
        this.$router.push({
          name: "VariableInputs"
        })
      },
      nextStage() {

        var that = this;
        if (that.changes.length > 0) {
          that.setStage(that.Project.stage + 1);
        }

        that.$router.push({
          name: "VariableInputs"
        })

      },
    },
    data() {
      return {
        lastStage: false,
        changes: [],
        downloadNum: 0,
        fileSaver: null,
        options: {
          fontSize: '10pt'
        }
      }
    },
    mounted() {
      var that = this;
      if (that.Project.stage >= that.Project.lastStage) {
        that.lastStage = true;
      }
      console.log("entered review changes", that.Project);
      for (var i = 0; i < that.Project.changes.length; i++) {
        let changes = that.Project.changes[i];

        if (changes.change.stage == that.Project.stage) {
          that.changes.push(changes)
        }
      }


      if (that.changes.length == 0) {
        console.log("no changes to do in ", that.Project.stage);

        if (!that.lastStage) {
          that.nextStage();
        } else {
          that.applyChanges();
        }
        return
      }
      for (let i = 0; i < that.changes.length; i++) {
        console.log("check for file download changes", that.changes[i].change.changeType)
        if (
            that.changes[i].change.changeType == 'fileDownload'
            || that.changes[i].change.changeType == 'fileAdd'
            || that.changes[i].change.changeType == 'fileShow'
            || that.changes[i].change.changeType == 'fileSave'
        ) {
          that.downloadNum = 1;
        }
      }
    },
    computed: {
      ...mapState(["Project"])
    }
  }
</script>