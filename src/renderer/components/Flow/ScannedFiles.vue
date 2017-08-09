<template>
  <div class="ui grid" style="padding: 0 5em">


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
      <button class="ui large orange button right floated" @click="rescanFiles">Rescan files</button>
    </div>
  </div>
</template>
<script>
  export default {
    methods: {
      rescanFiles() {
        this.$router.push({
          name: "ScanningFiles"
        })
      },
      reviewUpdates() {
        var that = this;


        that.state = "review-updates";

        if (that.secondStageVariables.length < 1) {
          setTimeout(function () {
            that.doChanges();
          }, 100)
        }

      },
    },
    mounted() {
      console.log("Loaded scanned files")
    }
  }
</script>