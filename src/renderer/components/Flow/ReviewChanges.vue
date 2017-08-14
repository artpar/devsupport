<template>
  <div class="ui grid" style="padding: 0 5em">

    <div class="sixteen wide column">
      <div style="overflow-y: auto; max-height: calc(100vh - 190px);">
        <div class="integration-task-list">
          <div  class="grouped fields" v-for="item in Project.changes">
            <label :for="item.name"><h3>{{item.change.name}}</h3></label>
            <div class="field" v-for="file in item.selectedFiles">
              <div v-if="item.change.changeType != 'fileDownload'" class="ui radio checkbox"
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


    <div class="right floated six wide column">
      <button class="ui large primary button right floated" @click="secondInputs">Next
      </button>
      <button class="ui large orange button right floated" @click="reviewFirstInputs">Back</button>
    </div>
  </div>
</template>
<script>
  import {mapActions} from 'vuex';
  import {mapState} from 'vuex';

  export default {
    methods: {
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
      reviewFirstInputs() {
        this.$router.push({
          name: "ReviewUpdates"
        })
      },
      secondInputs() {
        var that = this;
        that.$router.push({
          name: "SecondInputs"
        })

      },
    },
    mounted() {
      console.log("entered review changes")
    },
    computed: {
      ...mapState(["Project"])
    }
  }
</script>