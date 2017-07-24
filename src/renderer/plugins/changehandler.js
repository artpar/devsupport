import NewSearchAndReplace from './handlers/searchreplacefilehandler'
import NewXmlFileHandler from './handlers/xmlfilehandler'
import NewJavaFileHandler from './handlers/javafilehandler'
import dot from 'dot';

dot.templateSettings.strip = false;

var FileProcessorFactor = {
  ForType: function (fileType, logger) {
    console.log("return new file processor for ", fileType);
    switch (fileType) {
      case "gradle":
        return NewSearchAndReplace(fileType, logger);
      case "java":
        return NewSearchAndReplace(fileType, logger);
        return NewJavaFileHandler(fileType, logger);
      case "xml":
        return NewSearchAndReplace(fileType, logger);
        return NewXmlFileHandler(fileType, logger);
    }
  },
  ChangeHandler: function (change) {
    var that = {};


    // poor naming choice thats all
    var change1 = change.change;
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
      that.logs.push("[" + file.relative + "] " + message)
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
      var reg = new RegExp(that.change.fileSelector);
      var nameMatch = false;
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

      var validations = that.change.validations;
      if (!(validations instanceof Array)) {
        validations = [validations];
      }
      var totalValidations = validations.length;
      if (validations.length == 0) {
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
        if (failedValidations + passedValidations == totalValidations) {
          if (failedValidations == 0) {
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


    that.doChanges = function (contextMap) {
      return new Promise(function (resolve, reject) {

        // debugger

        if (!that.chosenFile) {
          that.chosenFile = {
            relative: ''
          }
        }


        for (var i = 0; i < change.change.length; i++) {

          console.log("dot is not defined", dot.template);
          let line = change.change[i].line;
          console.log("line is ", line);

          var tempFn = dot.template(line);
          change.change[i].line = tempFn(contextMap);
          console.log("evaluated template: ", change.change[i])
        }

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
