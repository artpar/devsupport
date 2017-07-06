/**
 * Created by artpar on 7/6/17.
 */
var fs = require('file-system');

export default function (fileType, logger) {
  var that = {};
  that.fileType = fileType;
  that.parser = {};


  that.doChange = function (file, change) {
    console.log("xml file handler do change", change);

    logger(file, "Begin reading file");
    fs.readFile(file.filepath, "utf8", function (err, data) {
      logger(file, "Begin read complete: ");
      if (err) {
        logger(file, "Error in reading file: ");
        return;
      }

      var str = data.toString("utf8", 0, data.length);
      that.parser = new DOMParser(str);
      logger(file, "Parser created");
      console.log("new xml parsed file", that.parser, change)


    });

    return "ok"
  };
  that.validate = function (file, validation) {

    return new Promise(function (resolve, reject) {
      resolve();
    })

  };

  return that;
}
