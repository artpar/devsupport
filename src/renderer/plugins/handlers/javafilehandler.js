/**
 * Created by artpar on 7/6/17.
 */
var fs = require('file-system');

export default function (fileType, logger) {
  var that = {};
  that.fileType = fileType;
  console.log("new java file handler");

  that.doChange = function (file, change) {
    return new Promise(function (resolve, reject) {
      logger(file, JSON.stringify(change));
      console.log("java file handler do change", change);
      resolve();
      return;
    })
  };

  that.validate = function (file, validation) {
    return new Promise(function (resolve, reject) {

      if (!validation) {
        return resolve();
      }
      console.log("check validation java file handler", validation, file);

      fs.readFile(file.filepath, "utf8", function (err, data) {
        if (err) {
          reject();
        }

        var str = data.toString("utf8", 0, data.length);
//        that.parser = new JavaParser.parse(str);
        console.log("new java parsed file", that.parser, validation)
      });
      resolve();

    });


  };

  return that;
}
