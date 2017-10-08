<template>
  <div>
    <loading v-if="loading"></loading>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import {mapActions} from 'vuex';

  export default {
    data() {
      return {
        loading: true,
      }
    },
    computed: {
      ...mapState(['Project'])
    },
    mounted() {
      console.log('%c ApplyChange.vue mounted ', 'background: #222; color: #E0FFFF');
      this.applyChanges();
    },
    methods: {
      ...mapActions(["setContextMap", "runVariableValidations", "setError", "doChanges", "setStage", "setResults"]),
      applyChanges() {

        var that = this;
        that.loading = true;

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

        console.log("start doing changes");

        that.doChanges(function (result) {
          console.log("Completed all changes", result);
          that.callbackChangeComplete(result);
        })


        this.$store.commit('PAGE_VIEW', getPageDesc("/app/results", "Results"));
      },
      callbackChangeComplete(results) {
        console.log("change complete callback", results);
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

    }
  }
</script>