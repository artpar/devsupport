<template>
    <div>
        <div v-if='loading'>
            <loading></loading>
        </div>
        <div v-else-if='!loading'>
            <div class="ui grid" style="padding: 0 5em">
                <!--second stage variable screen ends-->


                <div class="sixteen wide column" style="overflow-y: auto; max-height: calc(100vh - 180px);">
                    <h2>Please enter the following details:</h2>
                    <br>
                    <div class="ui icon negative message" v-if="Project.error != null">
                        <!--<i class="close icon"></i>-->
                        <i class="material-icons" style="margin-right: 0.5em; font-size: 3.5em;">error</i>
                        <!--<i class="warning circle icon"></i>-->
                        <div class="content">
                            <div class="header">
                                There was an error while validating inputs
                            </div>
                            <p v-html="Project.error">
                            </p>
                        </div>
                    </div>
                    <div class="ui large form">
                        <div class="sixteen wide required field" v-for="variable in variables">
                            <h3>{{variable.label}}</h3>
                            <input :placeholder="variable.help" v-model="variable.value" type="text">
                        </div>
                    </div>
                    <div style="margin-bottom: 1.7em"></div>
                    <div class="ui icon message">
                        <i class="material-icons devblue" style="margin-right: 0.5em; font-size: 3.5em;">info_outline</i>
                        <div class="content devblue" style="font-family: 'Raleway',sans-serif; font-size: medium">
                            <ul class="list">
                                <li v-for="variable in variables" v-html="variable.description"></li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div class="sixteen wide column">
                    <button class="ui large secondary button right floated" v-if="!lastStage" @click="nextStage">Next</button>
                    <button class="ui large secondary button right floated" v-if="lastStage" @click="applyChanges">Apply changes
                    </button>
                    <button class="ui large orange button left floated" v-if="!firstStage" @click="goBackStage">Back</button>
                </div>

                <div class="ui mini modal">
                    <div class="header">
                        <h3>Missing value</h3>
                    </div>
                    <div class="content">
                        <div class="description">
                            {{errorField}} is left empty.
                        </div>
                    </div>
                    <div class="actions">
                        <div class="ui secondary button" @click="errModal('hide')">OK</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import jsonApi from '../../plugins/jsonApi'
    import {mapActions} from 'vuex';
    import {mapState} from 'vuex';

    export default {
        mounted() {
            console.log("Entereed stage: ", this.Project.stage);
            console.log("entered review updated: stage: ", this.Project.stage, this.Project);
            var that = this;
            var variables = [];
            var filteredValidations = [];
            variables = this.Project.variables.filter(function (r) {
                return r.stage == that.Project.stage;
            });
            this.variables = variables;
            filteredValidations = this.Project.variableValidations.filter(function (r) {
                return r.stage == that.Project.stage;
            });
            this.filteredValidations = filteredValidations;

            if (that.Project.stage >= that.Project.lastStage) {
                that.lastStage = true;
            }
            if (that.Project.stage == 1) {
                that.firstStage = true;
            }

            if (variables.length == 0) {
                console.log("no changes to do in ", that.Project.stage);
                that.nextStage();
            }
        },
        methods: {
//      closeError(){
//        jquery('.message .close')
//        .on('click', function() {
//          $(this)
//            .closest('.message')
//            .transition('fade')
//          ;
//        });
//
//      },
            updateVariables() {
                var that = this;


                var contextMap = {};
                var invalidFields = that.Project.variables.filter(function (variable) {
                    contextMap[variable.name] = variable.value;
                    return that.Project.stage == variable.stage && (variable.value == null || variable.value.length < 2);
                });


                that.setContextMap(contextMap);

                if (invalidFields.length > 0) {
                    that.errorField = invalidFields[0].label;
                    that.errModal('show');
                    return false
                }
                return true


            },
            applyChanges() {
                var that = this;
                if (!that.updateVariables()) {
                    return
                }
                that.setError(null);
                that.loading = true;
                that.runVariableValidations({
                    filteredValidations: this.filteredValidations,
                    callback: function (response) {
                        console.log("variable validation response", response);


                        if (typeof response == "object" && !(response instanceof Array)) {

                            if (response.result) {
                                that.loading = false;
                                that.$router.push({
                                    name: "ApplyChanges",
                                })
                            } else {
                                that.loading = false;
                                if (!response.validation) {
                                    that.setError("This flow is not ready yet, please try again later.");
                                    return
                                }
                                that.setError(response.validation.errorLabel);
                                that.setStage(response.validation.stage);
                            }
                            return
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
                                that.loading = false;
                                that.$router.push({
                                    name: "ApplyChanges",
                                })

                            } else {
                                that.loading = false;
                                that.setError(response.validation.errorLabel);
                            }
                        }).catch(function (result) {
                            console.log("run of variable validations failed", result);
                        })
                    }
                });

                console.log("validation in applychanges buton finished");

            },
            errModal: function (action) {
                jQuery('.ui.mini.modal').modal(action);
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
            ...mapActions(["setContextMap", "evaluateTemplates", "runVariableValidations", "setError", "setStage"]),
            nextStage() {
                console.log("validations before next stage");
                var that = this;
                if (!that.updateVariables()) {
                    return
                }

                that.setError(null);

                console.log("live changes  :evaluate", that.Project.changes);
                that.evaluateTemplates();

                that.loading = true;
                that.runVariableValidations({
                    filteredValidations: this.filteredValidations,
                    callback: function (response) {
                        console.log("variable validation response", response);


                        if (typeof response == "object" && !(response instanceof Array)) {

                            if (response.result) {
                                that.loading = false;
                                if (that.variables.length > 0) {
                                    that.setStage(that.Project.stage + 1);
                                }
                                that.$router.push({
                                    name: "PresentChanges",
                                })
                            } else {
                                that.loading = false;
                                if (!response.validation) {
                                    that.setError("This flow is not ready yet, please try again later.");
                                    return
                                }
                                that.setError(response.validation.errorLabel);
                                that.setStage(response.validation.stage);
                                that.$router.push({
                                    name: "VariableInputs",
                                });
                            }
                            return
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
                                that.loading = false;
                                if (that.variables.length > 0) {
                                    that.setStage(that.Project.stage + 1);
                                }
                                that.$router.push({
                                    name: "PresentChanges",
                                })

                            } else {
                                that.loading = false;
                                that.setError(response.validation.errorLabel);
                            }
                        }).catch(function (result) {
                            console.log("run of variable validations failed", result);
                        })
                    }
                });
                console.log("validation in next button finished");


//        if (that.variables.length > 0) {
//          that.setStage(that.Project.stage + 1);
//          that.$router.push({
//            name: "PresentChanges",
//          })
//        }
            },
        },
        data() {
            return {
                doneChanges: false,
                lastStage: false,
                variables: [],
                loading: false,
                firstStage: false,
                errorField: "",
                filteredValidations: []

            }
        },
        computed: {
            ...mapState(["Project"]),
        },
    }
</script>