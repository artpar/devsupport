/**
 * Created by artpar on 7/6/17.
 */
var fs = require('file-system');

export default function (fileType, logger) {
  var that = {};
  that.fileType = fileType;
  console.log("new java file handler");

  /**
   * Apply one or a set of changes to a file
   * @param file file which is to be edited
   * @param change Single Instance or Array of Change
   * @returns {Promise}
   */
  that.doChange = function (file, change) {
    return new Promise(function (resolve, reject) {
      logger(file, JSON.stringify(change));
      console.log("java file handler do change", change);
      resolve();
      return;
    })
  };

  that.applyAllValidations = function (file, validations) {


  };

  that.validate = function (file, validations) {
    return new Promise(function (resolve, reject) {
      resolve();

      if (!validations) {
        return resolve();
      }

      if (!(validations instanceof Array)) {
        validations = [validations];
      }

      console.log("check validation java file handler", validations, file);

      fs.readFile(file.filepath, "utf8", function (err, data) {
        if (err) {
          reject();
        }


        var str = data.toString("utf8", 0, data.length);
//        that.parser = new JavaParser.parse(str);
        console.log("new java parsed file", that.parser, validations)


        function completedValidation(status) {
          if (status) {
            passedValidations += 1;
          } else {
            failedValidations += 1;
          }

          if (failedValidations + passedValidations == totalValidations) {
            if (failedValidations == 0) {
              that.selectedFiles.push(file);
              if (!that.selectedFilePath) {
                that.selectedFilePath = file.filepath;
              }
            } else {
              that.log(file, "Failed " + failedValidations + " validation.")
            }
          }
        }


      });
      resolve();

    });


  };

  return that;
}
