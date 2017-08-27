<template>
  <div class="ui grid" style="padding: 0 5em">

    <div class="sixteen wide column">
      <div style="overflow-y: auto; max-height: calc(100vh - 190px);">
        <div class="ui relaxed divided list">
          <div class="item" v-for="item in changes" style="margin-bottom: 1em;margin-top: 1em;">
            <label :for="item.name"><h3>{{item.change.name}}</h3></label>
            <div class="relaxed list" style="padding-left: 1em;">
            <div class="item" v-for="file in item.selectedFiles">
              <div v-if="item.change.changeType != 'fileDownload'" class="ui radio checkbox" style="margin-bottom: 0.2em;margin-top: 0.2em;"
                   @click="item.selectedFilePath = file.filepath">
                <input
                    class="hidden"
                    type="radio"
                    :name="item.name"
                    v-model="item.selectedFilePath"
                    :value="file.filepath">
                <label>{{file.relative}}</label>
              </div>
            </div>
            <div v-if="item.change.changeType == 'fileDownload'" class="field download">
              <span>{{item.change.fileName}}</span>
              <i class="c-pointer cloud download icon" @click="downloadAsFile(item)"></i>
            </div>
          </div>
          </div>
        </div>
      </div>


    </div>


    <div class="sixteen wide column">
      <button class="ui large primary button right floated" v-if="!lastStage" @click="nextStage">Next</button>
      <button class="ui large primary button right floated" v-if="lastStage" @click="applyChanges">Apply changes</button>
      <button class="ui large orange button left floated" @click="goBackStage">Back</button>
    </div>
  </div>
</template>
<script>
  import {mapActions} from 'vuex';
  import {mapState} from 'vuex';

  export default {
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
        that.setStage(that.Project.stage + 1);
        that.$router.push({
          name: "VariableInputs"
        })

      },
    },
    data() {
      return {
        lastStage: false,
        changes: [],
      }
    },
    mounted() {
      var that = this;
      if (that.Project.lastStage == that.Project.stage) {
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
        that.nextStage();
      }
    },
    computed: {
      ...mapState(["Project"])
    }
  }
</script>