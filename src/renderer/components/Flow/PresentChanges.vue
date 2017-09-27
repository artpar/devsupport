<template>
  <div class="ui grid" style="padding: 0 5em">

    <div class="sixteen wide column">
      <div style="overflow-y: auto; max-height: calc(100vh - 190px);">
        <div class="ui relaxed divided list">
          <div class="item" v-for="item in changes" style="margin-top: 0.3em;">
            <label :for="item.name"><h3 style="margin-top: 1em;">{{item.change.name}}</h3></label>
            <div class="relaxed list" style="padding-left: 1em;">
              <div v-if="(item.selectedFiles=='' && item.change.changeType != 'fileDownload')" class="item">

                <div class="ui icon message">
                  <i class="material-icons" style="margin-right: 0.5em;">warning</i>
                  <div class="content devblue">
                    Cant {{item.change.name}} because either no suitable files were found or they already have the required changes.
                  </div>
                </div>

              </div>
              <div class="item" v-for="file in item.selectedFiles" v-if="item.change.changeType != 'fileDownload' && item.change.changeType != 'fileShow'">
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

                <editor :options="options" style="width: 100%; height: 50vh" rows="10" :content="item.change.change[0].line" :lang="php  "></editor>
              </div>
              <div v-if="item.change.changeType == 'fileDownload'" class="field download devblue">
                {{item.change.fileName}}
                <i class="download_as_file_button c-pointer material-icons" @click="downloadAsFile(item)">file_download</i>
              </div>
            </div>
          </div>
        </div>
        <div v-if="downloadNum > 0" style="margin-bottom: 1.7em"></div>
        <div v-if="downloadNum > 0" class="ui icon message">
          <i class="material-icons devblue" style="margin-right: 0.5em; font-size: 3.5em;">info_outline</i>
          <div class="content devblue" style="font-family: 'Raleway',sans-serif; font-size: medium">
            <ul class="list">

              <li v-for="item in changes">{{item.change.help}}</li>

            </ul>
          </div>
        </div>
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
  import 'brace/mode/php';
  import 'brace/theme/chrome';

  export default {
    components: {
      editor
    },
    methods: {
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
        options: {
          fontSize: '14pt'
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
        console.log("no changes to do in ", that.Project.stage)
        that.nextStage();
        return
      }
      for (let i = 0; i < that.changes.length; i++) {
        console.log("check for file download changes", that.changes[i].change.changeType)
        if (that.changes[i].change.changeType == 'fileDownload' || that.changes[i].change.changeType == 'fileAdd') {
          that.downloadNum = 1;
        }
      }
    },
    computed: {
      ...mapState(["Project"])
    }
  }
</script>