import NewSearchAndReplace from './handlers/searchreplacefilehandler'
import NewXmlFileHandler from './handlers/xmlfilehandler'
import NewJavaFileHandler from './handlers/javafilehandler'


import NewHttpValidator from './validators/httpvalidator';

import dot from 'dot';

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
      case "php":
        return NewSearchAndReplace(fileType, logger);
        return NewJavaFileHandler(fileType, logger);
      case "xml":
        return NewSearchAndReplace(fileType, logger);
        return NewXmlFileHandler(fileType, logger);
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

        console.log("dot is not defined", dot.template);
        let line = change.change[i].line;
        if (!change.change[i].originalLine) {
          change.change[i].originalLine = line
        } else {
          line = change.change[i].originalLine;
        }
        console.log("line is ", line);

        const tempFn = dot.template(line);
        change.change[i].line = tempFn(contextMap);
        console.log("evaluated template: ", change.change[i])
      }
    };

    that.validateVariable = function (validation) {

      console.log("Creating new variable validation promise", validation)

      return new Promise(function (resolve, reject) {
        let validatorInstance = null;
        const validationParams = validation["params"];
        const expectations = validation.expectations;

        switch (validation.validationType) {
          case "http":
            validatorInstance = new NewHttpValidator(validationParams, expectations);
            break;
        }
        validatorInstance.evaluate().then(function (res) {
          resolve(res);
        }).catch(function(res){
          reject({result: false, validation: validation, failedExpectation: res})
        })
      });


    };


    that.evaluateTemplatesInObject = function (variableValidation, contextMap) {

      if (typeof  variableValidation === "string") {
        const tempFn = dot.template(variableValidation);
        return tempFn(contextMap);
      } else if (typeof variableValidation === "object") {

        if (variableValidation instanceof Array) {
          return variableValidation.map(function (obj) {
            return that.evaluateTemplatesInObject(obj);
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


    that.runVariableValidations = function (contextMap, validations) {

      const that = this;

      return new Promise(function (resolve, reject) {
        const variableValidations = validations;
        if (variableValidations && variableValidations instanceof Array) {
          const results = variableValidations.map(function (variableValidation) {
            return that.validateVariable(that.evaluateTemplatesInObject(variableValidation, contextMap))
          });
          Promise.all(results).then(function (validationResults) {
            console.log("valiation results", validationResults);
            resolve(results);
          }).catch(function(failures){
            console.log("validation failures", failures);
            reject(failures);
          })
        } else {
          resolve([]);
        }
      });
    };


    that.doChanges = function (contextMap) {


      return new Promise(function (resolve, reject) {

        if (!that.chosenFile) {
          that.chosenFile = {
            relative: ''
          }
        }

        that.evaluateTemplates(contextMap);

        that.fileProcessor.doChange({
          filepath: that.selectedFilePath,
          relative: that.chosenFile.relative,
        }, change.change).then(resolve, reject);
        that.change.status = "Completed"


      })
      // that.selectedFiles.map(function (file) {
      // })


    };


    return that;
  }
};


export default FileProcessorFactor;
