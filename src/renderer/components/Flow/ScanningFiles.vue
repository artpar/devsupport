<template>
    <div class="ui grid" style="padding: 0 5em">

        <div class="sixteen wide column">
            <loading v-if="loading"></loading>
        </div>
    </div>
</template>
<script>
    import jsonApi from '../../plugins/jsonApi'
    import {mapActions} from 'vuex';

    var fs = require('file-system');
    import JavaParser from 'java-parser';
    import FileProcessorFactor from '@/plugins/changehandler'
    import {mapState} from 'vuex';

    export default {
        data() {
            return {
                loading: true,
                selectedIntegration: null,
                liveChanges: [],
                variables: [],
            }
        },
        methods: {
            ...mapActions([
                'setProjectDir',
                'setChanges',
                'setReviewResultContent',
                'setNextIntegrations',
                'setStage',
                'setLastStage',
                'setIntegration',
                'setVariables',
                'setContextMap',
                'setVariableValidations',
            ]),
            beginValidateProject() {
                var that = this;
                console.log("begin ", this.Project.projectDir);
                that.actions = [];
                that.liveChanges = [];
                that.variables = [];

                this.selectedIntegration.changes.map(function (change) {
                    console.log("Push change", change);
                    that.liveChanges.push(new FileProcessorFactor.ChangeHandler(change));
                    console.log("variables from changes");
                });


                if (this.selectedIntegration.variables && this.selectedIntegration.variables.length > 0) {
                    this.selectedIntegration.variables.map(function (variable) {
                        variable.value = null;
                        that.variables.push(variable);
                    })
                }
                if (this.selectedIntegration.variableValidations) {
                    that.setVariableValidations(this.selectedIntegration.variableValidations)
                }


                that.setVariables(that.variables);
                console.log("Set variables and second stage variables", that.variables);


                console.log("variable captures", that.selectedIntegration.captures);

                var captureMap = {};

                that.files = [];


                var filesToEdit = [{
                    matchConditions: [
                        new RegExp(".java$")
                    ],
                    nonMatchConditions: [
                        new RegExp("R.java")
                    ]
                }, {
                    matchConditions: [
                        new RegExp(".gradle")
                    ]
                }, {
                    matchConditions: [
                        new RegExp(".xml")
                    ]
                }, {
                    matchConditions: [
                        new RegExp(".php$")
                    ]
                }, {
                    matchConditions: [
                        new RegExp(".html$")
                    ]
                }, {
                    matchConditions: [
                        new RegExp("Podfile")
                    ]
                }, {
                    matchConditions: [
                        new RegExp(".swift$")
                    ]
                }, {
                    matchConditions: [
                        new RegExp(".plist$")
                    ]
                }];

                let completeTimeout = setTimeout(function () {
                    completed();
                }, 2000);

                var changes = [];


                function completed() {
                    console.log("completed scan", that.liveChanges);
                    that.loading = false;
                    that.setChanges(that.liveChanges);
                    console.log("set changes", that.liveChanges);
                    that.setStage(1);
                    console.log("set context map", captureMap);
                    that.setContextMap(captureMap);
                    that.$router.push({
                        name: 'VariableInputs',
                    })
                }

                var captures = [];
                if (that.selectedIntegration.captures && that.selectedIntegration.captures.length > 0) {

                    captures = that.selectedIntegration.captures;


                }


                console.log("begin recurse dir for ", that.Project.projectDir);
                fs.recurse(that.Project.projectDir,
                    ['**/*.java', '**/*.xml', '**/*.gradle', '**/*.php', '**/*.html', '*', '**/*.swift', '**/*.plist'], function (filepath, relative, filename) {

                        let o;
                        console.log("callback point 1", filepath, relative, filename);
                        if (typeof filename != "undefined") {


                            if (completeTimeout) {
                                clearTimeout(completeTimeout);
                                completeTimeout = setTimeout(function () {
                                    completed();
                                }, 700);
                            }


                            captures.map(function (capture) {
                                console.log("capture attempt", filepath, filename);

                                if (filepath.match(capture.fileSelector)) {
                                    console.log("capture file matched", filepath, capture);

                                    var fileContentString = fs.readFileSync(filepath).toString();

                                    var regexToMatch = new RegExp(capture.regex);
                                    var matches = regexToMatch.exec(fileContentString);
                                    if (!matches || matches.length == 0) {
                                        return;
                                    }

                                    var captureValue = matches[capture.extract];
                                    console.log("captured variable", capture.name, captureValue);
                                    captureMap[capture.name] = captureValue;


                                }


                            });


                            let matched = false;
                            for (let k = 0; k < filesToEdit.length; k++) {

                                const conditions = filesToEdit[k];
                                let matching = true;
                                if (conditions.matchConditions) {

                                    for (o = 0; o < conditions.matchConditions.length; o++) {
                                        if (!filepath.match(conditions.matchConditions[o])) {
                                            matching = false;
                                            break;
                                        }
                                    }
                                }

                                if (!matching) {
                                    console.log("no match for ", conditions.matchConditions[o], filepath);
                                    continue
                                }

                                if (conditions.nonMatchConditions) {
                                    for (o = 0; o < conditions.nonMatchConditions.length; o++) {
                                        if (filepath.match(conditions.nonMatchConditions[o])) {
                                            matching = false;
                                            break;
                                            console.log("match for ", conditions.nonMatchConditions[o], filepath)

                                        }
                                    }
                                }
                                matched = matching;
                                break;
                            }


                            console.log("File ", filename, matched);
                            if (matched) {
                                const file = {
                                    filename: filename,
                                    filepath: filepath,
                                    relative: relative,
                                };
                                that.liveChanges.map(function (liveChange) {
                                    console.log("add file to live change", liveChange, file);
                                    liveChange.addFile(file)
                                });
                            }

                            // it's file
                        } else {

                            // it's folder
                        }
                    });
            }
        },
        computed: {
            ...mapState(['Project'])
        },
        mounted() {
            const that = this;
            that.$store.commit('PAGE_VIEW', getPageDesc("/app/integrationProcess", "ScanningFiles"));
            that.setIntegration(this.$route.params.id);

            jsonApi.find('integration', that.$route.params.id).then(function (obj) {
                const changeSet = JSON.parse(obj.change_set);
                console.log("found integration", obj);
                try {

                } catch (e) {
                    that.$notify({
                        type: "error",
                        title: "Not ready yet",
                        message: "This flow is still under construction"
                    });
                    return;
                }
                that.selectedIntegration = changeSet;
                that.setReviewResultContent(changeSet.reviewResultContent);
                that.setNextIntegrations(changeSet.nextIntegrations);

                let lastStage = 1;
                changeSet.changes.map(function (c) {

                    if (!c.stage) {
                        c.stage = 2;
                    }

                    if (c.stage > lastStage) {
                        lastStage = c.stage
                    }
                });
                changeSet.variables.map(function (c) {

                    if (!c.stage) {
                        c.stage = 2;
                    }

                    if (c.stage > lastStage) {
                        lastStage = c.stage
                    }
                });

                console.log("last stage is ", lastStage);
                that.setLastStage(lastStage);

                that.loading = true;
                setTimeout(function () {
                    that.beginValidateProject();
                }, 1000)
            });

        }
    }
</script>