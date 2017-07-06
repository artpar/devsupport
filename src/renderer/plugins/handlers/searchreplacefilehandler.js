/**
 * Created by artpar on 7/6/17.
 */
var fs = require('file-system');

export default function (fileType, logger) {
  var that = {};
  that.fileType = fileType;

  that.doChange = function (file, change) {

    logger(file, JSON.stringify(change))
    console.log("search and replace handler do change", change);


    fs.readFile(file.filepath, "utf8", function (err, data) {
      logger(file, "Read complete");
      if (err) {
        logger(file, "Error in reading file");
        return;
      }

      var str = data.toString("utf8", 0, data.length);
      logger(file, "Parser created");

      var fileLines = str.split(/\n/);
      logger(file, "Line count: " + fileLines.length)

      switch (change.changeType) {
        case "add.line":
          logger(file, "Add line to file")
          var fileUpdated = false;
          var query = change.query;
          var action = change.action;
          var line = change.line;
          var queryRegex = new RegExp(query);
          for (var u = 0; u < fileLines.length; u++) {
            if (fileLines[u].match(queryRegex)) {
              logger(file, "Query matched at line number " + (u + 1))
              var firstNonSpaceChar = fileLines[u].match(/[^ ]/).index;

              if (action == "prepend") {
                fileLines.splice(u, 0, " ".repeat(firstNonSpaceChar) + line);
              } else if (action == "append") {
                fileLines.splice(u + 1, 0, " ".repeat(firstNonSpaceChar) + line);
              } else if (action == "replace") {
                fileLines[u] = " ".repeat(firstNonSpaceChar) + line;
              } else if (action == "delete") {
                fileLines.splice(u, 1);
              }
              fileUpdated = true;
              break;
            }
          }
          if (!fileUpdated) {
            logger(file, "Search query did not match " + queryRegex)
          }
          break;
        default:
          logger(file, "Unknown change type", change.changeType)
      }

      if (fileUpdated) {
        var contents = fileLines.join("\n");
        fs.writeFile(file.filepath, contents, {}, function (err) {
          console.log("write file response", err)
          logger(file, "Completed writing file")
        })
      }


    })


    return "ok"
  };


  that.validate = function (file, validation) {
    console.log("search and replace handler do validation", validation);
    return new Promise(function (resolve, reject) {

      fs.readFile(file.filepath, "utf8", function (err, data) {
        logger(file, "Read complete for validation");
        if (err) {
          logger(file, "Error in reading file");

          reject();
          return;
        }

        var str = data.toString("utf8", 0, data.length);
        logger(file, "Parser created");

        var fileLines = str.split(/\n/);
        logger(file, "Line count: " + fileLines.length)
        logger(file, "Validation check type: " + validation.checkType)
        switch (validation.checkType) {
          case "textSearch":
            logger(file, "Check line: " + validation.query)
            var fileUpdated = false;
            var query = validation.query;
            var queryRegex = new RegExp(query);
            for (var u = 0; u < fileLines.length; u++) {
              if (fileLines[u].match(queryRegex)) {
                logger(file, "Validation failed, found " + query)
                logger(file, "reject from search and replace")
                reject();
                return;
              }
            }
            break;
          default:
            logger(file, "Unknown validation type", validation.checkType)
        }
        logger(file, "Resolve from search and replace 2")
        resolve();
        return

      })
      return
    })
  };


  return that;
}
