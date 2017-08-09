<template>
  <div class="ui grid" style="padding: 0 5em">

    <!--second stage variable screen ends-->


    <div class="sixteen wide column"
         style="overflow-y: auto; max-height: calc(100vh - 180px);">

      <h2>Please enter the following details:</h2>
      <br>
      <div class="ui large form">
        <div class="sixteen wide required field" v-for="variable in Project.variables">
          <h3>{{variable.label}}</h3>
          <input :placeholder="variable.help" v-model="variable.value" type="text">
          <p>
            <small>{{variable.description}}</small>
          </p>
        </div>
      </div>

    </div>

    <div class="right floated sixteen wide column">
      <button class="ui large primary button right floated " @click="reviewFiles">Review files</button>
      <button class="ui large orange button right floated " @click="listScannedFiles" v-if="!doneChanges">Rescan Files
      </button>
    </div>

  </div>
</template>
<script>
  import jsonApi from '../../plugins/jsonApi'
  import {mapActions} from 'vuex';
  import {mapState} from 'vuex';

  export default {
    mounted() {
      console.log("entered review updated")
    },
    methods: {
      ...mapActions(["setContextMap", "evaluateTemplates"]),
      listScannedFiles() {
        var that = this;
        that.state = "scanned-files";
        that.$router.push({
          name: "ScanningFiles",
        })

      },
      reviewFiles() {
        var that = this;
        var contextMap = {};
        var invalidFields = that.Project.variables.filter(function (variable) {
          contextMap[variable.name] = variable.value;
          return variable.value == null || variable.value.length < 2;
        });


        that.setContextMap(contextMap);

        if (invalidFields.length > 0) {
          that.$alert(invalidFields[0].label + " is left empty.", 'Missing value');
          return
        }

        console.log("live changes  :evaluate", that.Project.changes);
        that.evaluateTemplates();
        that.$router.push({
          name: "ReviewChanges",
        })
      },
    },
    data() {
      return {
        doneChanges: false,
      }
    },
    computed: {
      ...mapState(["Project"]),
    },
  }
</script>