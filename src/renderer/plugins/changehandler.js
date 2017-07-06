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
    that.change.status = "pending";

    that.logs = [];

    that.log = function (file, message) {
      that.logs.push("[" + file.filepath + "] " + message)
    };

    console.log("change handler for ", change);

    that.fileProcessor = FileProcessorFactor.ForType(change.fileType, that.log);

    that.addFile = function (file) {


      var reg = new RegExp(that.change.fileSelector);
      var nameMatch = false;
      if (file.filename.match(reg)) {
        nameMatch = true;
      }
      if (!nameMatch && file.filepath.match(reg)) {
        nameMatch = true;
      }

      if (!nameMatch) {
        return;
      }

      that.fileProcessor.validate(file, that.change.validate).then(function () {
        var validationResult = true;
        that.log(file, "Validation successful: " + validationResult)

        if (!validationResult) {
          console.log("not valid Check validate file before add ", file, that.change.fileSelector, that.change.validate)
          return;
        }

        console.log("add file to change handler", file, that.change.validate);

        that.selectedFiles.push(file);
      }).catch(function () {
        that.log(file, "Validation failed seriously")
      })


    };


    that.doChanges = function () {
      that.selectedFiles.map(function (file) {
        that.fileProcessor.doChange(file, that.change.change);
      })
    };


    return that;
  }
};


export default FileProcessorFactor;
