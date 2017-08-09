<template>
  <div class="ui grid" style="padding: 0 5em">

    <!--second stage variable screeen begins-->

    <div class="sixteen wide column" style="overflow-y: auto; max-height: 54vh">
      <h2>Please enter the following details:</h2>
      <br>
      <div class="ui large form">
        <div class="sixteen wide required field" v-for="variable2 in Project.secondStageVariables">
          <h3>{{variable2.label}}</h3>
          <input :placeholder="variable2.help" v-model="variable2.value" type="text">
          <p>
            <small>{{variable2.description}}</small>
          </p>
        </div>
      </div>

    </div>
    <div class="right floated sixteen wide column">
      <button class="ui large primary button right floated" @click="applyChanges">Apply changes
      </button>
      <button class="ui large orange button right floated" @click="secondInputs">Back</button>
    </div>
  </div>
</template>
<script>
  import {mapActions} from 'vuex';
  import {mapState} from 'vuex';

  export default {
    mounted() {
      var that = this;
      console.log("entered second inputs", that.Project)
      if (that.Project.secondStageVariables.length == 0) {
        this.applyChanges();
      }
    },
    computed: {
      ... mapState(["Project"]),
    },
    data() {
      return {}
    },
    methods: {
      ...mapActions(["doChanges", "setContextMap"]),
      secondInputs() {
        this.$router.push({
          name: "SecondInputs"
        })
      },
      callbackChangeComplete() {
        console.log("change complete callback")
        var that = this;
        var remaining = that.Project.changes.filter(function (e) {
          return e.change.status == "pending";
        }).length;
        if (remaining == 0) {
          that.viewResult();
        }
      },
      viewResult() {
        var that = this;
        that.$router.push({
          name: "ReviewResults"
        })
      },
      applyChanges() {
        var that = this;
        console.log(this.Project);

        var contextMap = that.Project.contextMap;
        console.log("existing context map", contextMap);

        var invalidFields = that.Project.secondStageVariables.filter(function (variable) {
          contextMap[variable.name] = variable.value;
          return variable.value == null || variable.value.length < 2;
        });

        that.Project.variables.filter(function (variable) {
          contextMap[variable.name] = variable.value;
          return variable.value == null || variable.value.length < 2;
        });

        if (invalidFields.length > 0) {
          that.$alert(invalidFields[0].label + " is left empty.", 'Missing value');
          return
        }


        that.setContextMap(contextMap);

        that.doChanges(function () {
          console.log("Completed all changes");
          that.callbackChangeComplete();
        });


        console.log("start doing changes")


        this.$store.commit('PAGE_VIEW', getPageDesc("/app/results", "Results"));
      }
    },
  }
</script>