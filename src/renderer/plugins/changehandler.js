import NewSearchAndReplace from './handlers/searchreplacefilehandler'
import NewXmlFileHandler from './handlers/xmlfilehandler'
import NewJavaFileHandler from './handlers/javafilehandler'
import NewDownloadHandler from './handlers/filedownloadhandler'
import NewHttpValidator from './validators/httpvalidator';
import NewContextVariableValidator from './validators/contextvariablevalidator';

import dot from 'dot';
// import NewPhpFileHandler from './handlers/phpfilehandler'

var sha512 = require('js-sha512').sha512;
window.sha512 = sha512;

dot.templateSettings.strip = false;

const FileProcessorFactor = {
    ForType: function (fileType, logger) {
        console.log("return new file processor for ", fileType);
        switch (fileType) {
            case "gradle":
                return NewSearchAndReplace(fileType, logger);
            case "java":
                return NewSearchAndReplace(fileType, logger);
                return NewJavaFileHandler(fileType, logger);
            case "html":
                return NewSearchAndReplace(fileType, logger);
                return NewJavaFileHandler(fileType, logger);
            case "download":
                return NewDownloadHandler(fileType, logger);
            case "php":
                return NewSearchAndReplace(fileType, logger);
            case "json":
                return NewSearchAndReplace(fileType, logger);
            case "ts":
                return NewSearchAndReplace(fileType, logger);
            case "text":
                return NewSearchAndReplace(fileType, logger);
            // return NewPhpFileHandler(fileType, logger);
            // return NewJavaFileHandler(fileType, logger);
            case "xml":
                return NewSearchAndReplace(fileType, logger);
                return NewXmlFileHandler(fileType, logger);
            case "csproj":
                return NewSearchAndReplace(fileType, logger);
        }
    },
    ChangeHandler: function (change) {
        const that = {};


        // poor naming choice thats all
        let change1 = change.change;
        if (!(change1 instanceof Array)) {
            change1 = [change1];
            change.change = change1;
        }


        that.change = change;
        that.selectedFiles = [];
        that.selectedFilePath = null;
        that.chosenFile = null;
        that.change.status = "pending";

        that.logs = [];

        that.log = function (file, message) {
            console.log("message", file, message);
            // that.logs.push("[" + file.relative + "] " + message)
        };

        that.getFileCount = function () {
            return that.selectedFiles.length;
        };

        that.getSelectedFiles = function () {
            return that.selectedFiles;
        };

        that.setSelectedFiles = function (files) {
            that.selectedFiles = files;
        };

        console.log("change handler for ", change);

        that.fileProcessor = FileProcessorFactor.ForType(change.fileType, that.log);

        that.addFile = function (file) {
            console.log("Call add file for ", file.filepath);
            const reg = new RegExp(that.change.fileSelector);
            let nameMatch = false;
            if (file.filename.match(reg)) {
                console.log("File Name matches the regex", file.filepath, that.change.fileSelector, reg);
                nameMatch = true;
            }
            if (!nameMatch && file.filepath.match(reg)) {
                console.log("File path matches the regex", file.filepath, that.change.fileSelector, reg);
                nameMatch = true;
            }

            if (!nameMatch) {
                return;
            }

            let validations = that.change.validations;
            if (!validations) {
                validations = [];
            }

            if (!(validations instanceof Array)) {
                validations = [validations];
            }
            const totalValidations = validations.length;
            if (validations.length === 0) {
                that.log(file, "No validations");
                that.selectedFiles.push(file);
                if (!that.selectedFilePath) {
                    that.selectedFilePath = file.filepath;
                    that.chosenFile = file;
                }
                return;
            }
            that.fileProcessor.validate(file, validations).then(function (res) {
                const failedValidations = res.failed;
                const passedValidations = res.success;
                if (failedValidations + passedValidations === totalValidations) {
                    if (failedValidations === 0) {
                        that.selectedFiles.push(file);
                        if (!that.selectedFilePath) {
                            that.selectedFilePath = file.filepath;
                            that.chosenFile = file;
                        }
                    } else {
                        that.log(file, "Failed " + failedValidations + " validation.")
                    }
                }
            }, function (reason) {
                that.log(file, "Failed validation: " + reason)
            })

        };


        that.evaluateTemplates = function (contextMap) {

            for (let i = 0; i < change.change.length; i++) {

                // console.log("dot is not defined", dot.template);
                let line = change.change[i].line;

                if (!line) {
                    continue
                }

                if (!change.change[i].originalLine) {
                    change.change[i].originalLine = line
                } else {
                    line = change.change[i].originalLine;
                }
                // console.log("line is ", line);

                const tempFn = dot.template(line);
                change.change[i].line = tempFn(contextMap);
                if (change.change[i].query) {
                    if (change.change[i].query instanceof Array) {
                        const len = change.change[i].query.length;
                        for (let e = 0; e < len; e++) {
                            change.change[i].query[e] = dot.template(change.change[i].query[e])(contextMap);
                        }
                    } else {
                        change.change[i].query = dot.template(change.change[i].query)(contextMap);
                    }
                }
                // console.log("evaluated template: ", change.change[i])
            }
        };

        that.validateVariable = function (validation, delay) {

            console.log("Creating new variable validation promise", validation);

            return new Promise(function (resolve, reject) {
                let validatorInstance = null;
                const validationParams = validation["params"];
                const expectations = validation.expectations;

                switch (validation.validationType) {
                    case "http":
                        validatorInstance = new NewHttpValidator(validationParams, expectations);
                        break;
                    case "contextvariable":
                        validatorInstance = new NewContextVariableValidator(validationParams, expectations);
                        break;
                }
                setTimeout(function () {
                    validatorInstance.evaluate().then(function (res) {
                        resolve(res);
                    }).catch(function (res) {
                        reject({result: false, validation: validation, failedExpectation: res})
                    })
                }, delay);
            });


        };


        that.evaluateTemplatesInObject = function (variableValidation, contextMap) {

            if (typeof  variableValidation === "string") {
                const tempFn = dot.template(variableValidation);
                return tempFn(contextMap);
            } else if (typeof variableValidation === "object") {

                if (variableValidation instanceof Array) {
                    return variableValidation.map(function (obj) {
                        return that.evaluateTemplatesInObject(obj, contextMap);
                    })
                } else {
                    const retObj = {};
                    const keys = Object.keys(variableValidation);

                    for (let i = 0; i < keys.length; i++) {
                        retObj[keys[i]] = that.evaluateTemplatesInObject(variableValidation[keys[i]], contextMap);
                    }
                    return retObj;
                }

            } else {
                return variableValidation;
            }

        };


        that.runVariableValidations1 = function (contextMap, validations) {

            const that = this;

            return new Promise(function (resolve, reject) {
                const variableValidations = validations;
                if (variableValidations && variableValidations instanceof Array) {
                    const results = variableValidations.map(function (variableValidation, i) {
                        return that.validateVariable(that.evaluateTemplatesInObject(variableValidation, contextMap), i * 1000)
                    });
                    Promise.all(results).then(function (validationResults) {
                        console.log("validation results", validationResults);
                        resolve(results);
                    }).catch(function (failures) {
                        console.log("validation failures", failures);
                        reject(failures);
                    })
                } else {
                    resolve([]);
                }
            });
        };


        that.doChanges = function (contextMap) {

            if (!that.change.modifyAllMatchedFiles) {

                return new Promise(function (resolve, reject) {

                    console.log("execute change", that.change, contextMap);
                    if (!that.chosenFile) {
                        console.log("no chosen file - resolving", change);
                        // that.chosenFile = {
                        //   relative: ''
                        // };
                        that.change.status = "Completed";
                        resolve();
                        return;
                    }

                    that.evaluateTemplates(contextMap);


                    that.fileProcessor.doChange({
                        filepath: that.selectedFilePath,
                        relative: that.chosenFile.relative,
                    }, change.change, contextMap).then(function () {
                        that.change.status = "Completed";
                        resolve();
                    }, function (err) {
                        console.log("change failed", err);
                        that.change.status = "Failed";
                        reject(err);
                    });
                })
            } else {

                return Promise.all(that.selectedFiles.map(function (file) {

                    return new Promise(function (resolve, reject) {

                        console.log("execute change", that.change, contextMap, file);
                        that.evaluateTemplates(contextMap);

                        that.fileProcessor.doChange({
                            filepath: file.filepath,
                            relative: that.chosenFile.relative,
                        }, change.change, contextMap).then(function () {
                            that.change.status = "Completed";
                            resolve();
                        }, function (err) {
                            console.log("change failed", err);
                            that.change.status = "Failed";
                            reject(err);
                        });
                    })


                }));

            }


        };


        return that;
    }
};


export default FileProcessorFactor;
