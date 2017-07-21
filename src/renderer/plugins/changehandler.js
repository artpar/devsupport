import NewSearchAndReplace from './handlers/searchreplacefilehandler'
import NewXmlFileHandler from './handlers/xmlfilehandler'
import NewJavaFileHandler from './handlers/javafilehandler'

var FileProcessorFactor = {
  ForType: function (fileType, logger) {
    console.log("return new file processor for ", fileType);
    switch (fileType) {
      case "gradle":
        return NewSearchAndReplace(fileType, console.log);
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

    that.change = change;
    that.selectedFiles = [];
    that.selectedFile = null;
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
        if (!that.selectedFile) {
          that.selectedFile = file.filepath;
        }
        return;
      }
      that.fileProcessor.validate(file, validations).then(function (res) {
        var failedValidations = res.failed;
        var passedValidations = res.success;
        if (failedValidations + passedValidations == totalValidations) {
          if (failedValidations == 0) {
            that.selectedFiles.push(file);
            if (!that.selectedFile) {
              that.selectedFile = file.filepath;
            }
          } else {
            that.log(file, "Failed " + failedValidations + " validation.")
          }
        }
      }, function () {
        that.log(file, "Failed validation")
      })

    };


    that.doChanges = function () {

      return new Promise(function (resolve, reject) {

        var change = that.change.change;
        if (!(change instanceof Array)) {
          change = [change];
        }

        if (!that.selectedFile) {
          that.logs.push("No selected file for " + that.change.change);
          that.change.status = "N/A";
          resolve();
        } else {
          that.fileProcessor.doChange({
            filepath: that.selectedFile,
          }, change).then(resolve, reject);
          that.change.status = "Completed"
        }


      })
      // that.selectedFiles.map(function (file) {
      // })


    };


    return that;
  }
};


export default FileProcessorFactor;
