import NewSearchAndReplace from './handlers/searchreplacefilehandler'
import NewXmlFileHandler from './handlers/xmlfilehandler'
import NewJavaFileHandler from './handlers/javafilehandler'

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

    that.change = change;
    that.selectedFiles = [];
    that.selectedFile = null;
    that.change.status = "pending";

    that.logs = [];

    that.log = function (file, message) {
      that.logs.push("[" + file.filepath + "] " + message)
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
      console.log("Call add file for ", file.filepath)
      var reg = new RegExp(that.change.fileSelector);
      var nameMatch = false;
      if (file.filename.match(reg)) {
        nameMatch = true;
      }
      if (!nameMatch && file.filepath.match(reg)) {
        nameMatch = true;
      }

      if (!nameMatch) {
        console.log("File path didnt match regex", file.filepath, that.change.fileSelector, reg)
        return;
      }

      if (that.change.validate instanceof Array) {

        var totalValidations = that.change.validate.length;
        var failedValidations = 0;
        var passedValidations = 0;

        that.change.validate.map(function (val) {
          that.fileProcessor.validate(file, val).then(function () {
            var validationResult = true;
            that.log(file, "Validation successful: " + validationResult);

            if (!validationResult) {
              console.log("not valid Check validate file before add ", file, that.change.fileSelector, that.change.validate);
              return;
            }

            console.log("add file to change handler", file, that.change.validate);
            completedValidation(true)
          }).catch(function () {
            that.log(file, "Validation failed seriously");
            completedValidation(false)
          });
        });

        function completedValidation(status) {
          if (status) {
            passedValidations += 1;
          } else {
            failedValidations += 1;
          }

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
        }


      } else {
        that.fileProcessor.validate(file, that.change.validate).then(function () {
          var validationResult = true;
          that.log(file, "Validation successful: " + validationResult);

          if (!validationResult) {
            console.log("not valid Check validate file before add ", file, that.change.fileSelector, that.change.validate);
            return;
          }

          console.log("add file to change handler", file, that.change.validate);

          that.selectedFiles.push(file);
          if (!that.selectedFile) {
            that.selectedFile = file.filepath;
          }
        }).catch(function () {
          that.log(file, "Validation failed seriously")
        })
      }


    };


    that.doChanges = function () {

      return new Promise(function (resolve, reject) {


        if (!that.selectedFile) {
          that.logs.push("No selected file for " + that.change.change)
          that.change.status = "N/A";
          resolve();
        } else {
          that.fileProcessor.doChange({
            filepath: that.selectedFile,
          }, that.change.change).then(resolve, reject);
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
