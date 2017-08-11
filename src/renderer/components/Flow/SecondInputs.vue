<template>
  <div class="ui grid" style="padding: 0 5em">

    <!--second stage variable screeen begins-->
    <loading v-if="loading"></loading>

    <div class="sixteen wide column" style="overflow-y: auto; max-height: 54vh" v-if="!loading">
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
    <div class="right floated sixteen wide column" v-if="!loading">
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
      return {
        loading: false,
      }
    },
    methods: {
      ...mapActions(["doChanges", "setContextMap", "runVariableValidations", "setError"]),
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


              that.doChanges(function () {
                console.log("Completed all changes");
                that.$notify({
                  title: "Success",
                  message: "All changes were completed."
                });

                that.callbackChangeComplete();
              })

            } else {
              that.setError(response.validation.errorLabel);
              that.$notify({
                message: response.validation.errorLabel,
                title: "Failed",
                type: "error"
              });

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

          }

          Promise.all(response).then(function (res) {
            console.log("more response", res);
            for (var i = 0; i < res.length; i++) {
              let response = res[i];
              if (response.result) {

                that.doChanges(function () {
                  console.log("Completed all changes");
                  that.$notify({
                    title: "Success",
                    message: "All changes were completed.",
                    type: "success"
                  });

                  that.callbackChangeComplete();
                })

              } else {
                that.setError(response.validation.errorLabel);
                that.$notify({
                  message: response.validation.errorLabel,
                  title: "Failed",
                  type: "error"
                });

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
            }
          }).catch(function (result) {
            console.log("run of variable validations failed", result);
          })
        });


        console.log("start doing changes")


        this.$store.commit('PAGE_VIEW', getPageDesc("/app/results", "Results"));
      }
    },
  }
</script>