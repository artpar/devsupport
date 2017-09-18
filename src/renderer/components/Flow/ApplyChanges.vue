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
      this.applyChanges();
    },
    methods: {
      ...mapActions(["setContextMap", "runVariableValidations", "setError", "doChanges", "setStage"]),
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


        that.runVariableValidations(function (response) {
          console.log("variable validation response", response);


          if (typeof response == "object" && !(response instanceof Array)) {

            if (response.result) {


              that.doChanges(function (result) {
                console.log("Completed all changes, result : ", result);
//                that.$notify({
//                  title: "Success",
//                  message: "All changes were completed."
//                });

                that.callbackChangeComplete();
              })

            } else {
              that.setError(response.validation.errorLabel);
//              that.$notify({
//                message: response.validation.errorLabel,
//                title: "Failed",
//                type: "error"
//              });


              that.setStage(response.validation.stage);
              that.$router.push({
                name: "VariableInputs",
              });
              return
            }

          }

          Promise.all(response).then(function (res) {
            console.log("more response", res);
            var finalResult = true;

            for (var i = 0; i < res.length; i++) {
              let response = res[i];
              if (!response.result) {
                finalResult = false;
                break;
              }
            }

            if (finalResult) {

              that.doChanges(function () {
                console.log("Completed all changes");
//                that.$notify({
//                  title: "Success",
//                  message: "All changes were completed.",
//                  type: "success"
//                });

                that.callbackChangeComplete();
              })

            } else {
              that.setError(response.validation.errorLabel);
//              that.$notify({
//                message: response.validation.errorLabel,
//                title: "Failed",
//                type: "error"
//              });

              switch (response.validation.stage) {
                case 1:
                  that.$router.push({
                    name: "ReviewUpdates",
                  });
                  return;
                case 2:
                  that.$router.push({
                    name: "SecondInputs",
                  });
                  return;
              }
            }
          }).catch(function (result) {
            console.log("run of variable validations failed", result);
          })
        });


        console.log("start doing changes");


        this.$store.commit('PAGE_VIEW', getPageDesc("/app/results", "Results"));
      },
      callbackChangeComplete() {
        console.log("change complete callback");
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