<template>
  <div class="ui grid" style="padding: 0 5em">

    <!--second stage variable screen ends-->


    <div class="sixteen wide column" style="overflow-y: auto; max-height: calc(100vh - 180px);">
      <h2>Please enter the following details:</h2>
      <br>
      <div class="ui icon warning message" v-if="Project.error != null">
        <i class="warning sign icon"></i>
        <div class="content">
          <div class="header">
            There was an error while validating inputs
          </div>
          <p>
            {{Project.error}}
          </p>
        </div>
      </div>
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

    <div class="right floated sixteen wide column">
      <button class="ui large primary button right floated" v-if="!lastStage" @click="nextStage">Next</button>
      <button class="ui large primary button right floated" v-if="lastStage" @click="applyChanges">Apply changes</button>
      <button class="ui large orange button right floated" @click="goBackStage">Back</button>
    </div>

  </div>
</template>
<script>
  import jsonApi from '../../plugins/jsonApi'
  import {mapActions} from 'vuex';
  import {mapState} from 'vuex';

  export default {
    mounted() {
      console.log("entered review updated: stage: ", this.Project.stage, this.Project);
      var that = this;
      var variables = [];
      variables = this.Project.variables.filter(function(r){
        return r.stage == that.Project.stage;
      });
      this.variables = variables;
      if (that.Project.lastStage == that.Project.stage) {
        that.lastStage = true;
      }
    },
    methods: {
      applyChanges() {
        this.$router.push({
          name: "ApplyChanges",
        })
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
          name: "PresentChanges"
        })
      },
      ...mapActions(["setContextMap", "evaluateTemplates", "runVariableValidation", "setError", "setStage"]),
      nextStage() {
        console.log("validations before next stage");
        var that = this;
        var contextMap = {};
        var invalidFields = that.Project.variables.filter(function (variable) {
          contextMap[variable.name] = variable.value;
          return that.Project.stage == variable.stage && (variable.value == null || variable.value.length < 2);
        });


        that.setContextMap(contextMap);

        if (invalidFields.length > 0) {
          that.$alert(invalidFields[0].label + " is left empty.", 'Missing value');
          that.setError(invalidFields[0].label + " is left empty.", 'Missing value');
          return
        }

        that.setError(null);

        console.log("live changes  :evaluate", that.Project.changes);
        that.evaluateTemplates();
        that.setStage(that.Project.stage +1 );
        that.$router.push({
          name: "PresentChanges",
        })
      },
    },
    data() {
      return {
        doneChanges: false,
        lastStage: false,
        variables: [],
        loading: false
      }
    },
    computed: {
      ...mapState(["Project"]),
    },
  }
</script>