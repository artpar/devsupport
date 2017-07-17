/**
 * Created by artpar on 7/6/17.
 */
var fs = require('file-system');

export default function (fileType, logger) {
  var that = {};
  that.fileType = fileType;

  that.applyChange = function (file, change, fileLines) {
    switch (change.changeType) {
      case "add.line":
        logger(file, "Add line to file");
        var fileUpdated = false;
        var query = change.query;
        var action = change.action;
        var line = change.line;
        var queryRegex = new RegExp(query);
        for (var u = 0; u < fileLines.length; u++) {
          if (fileLines[u].match(queryRegex)) {
            logger(file, "Query matched at line number " + (u + 1));
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
            return fileLines;
          }
        }
        if (!fileUpdated) {
          logger(file, "Search query did not match " + queryRegex)
        }
        return fileLines;
      default:
        logger(file, "Unknown change type", change.changeType);
        return fileLines;
    }

  }


  that.processChange = function (file, change, fileLines) {

    return new Promise(function (resolve, reject) {


      var fileModified = false;
      if (change.validations) {
        that.validate(file, change.validations).then(function () {
          fileLines = that.applyChange(file, change, fileLines);
          resolve(fileLines);
        }, function () {
          logger(file, "Pre change validation failed")
          reject();
        });
      } else {
        fileLines = that.applyChange(file, change, fileLines);
        resolve(fileLines);
      }

    });


  }

  that.doChange = function (file, changes) {
    return new Promise(function (resolve, reject) {
      logger(file, JSON.stringify(changes));
      console.log("search and replace handler do change", changes);

      fs.readFile(file.filepath, "utf8", function (err, data) {
        logger(file, "Read complete");
        if (err) {
          logger(file, "Error in reading file");
          reject();
          return;
        }

        var str = data.toString("utf8", 0, data.length);
        logger(file, "Parser created");

        var fileLines = str.split(/\n/);
        logger(file, "Line count: " + fileLines.length);

        var fileModified = false;

        that.applyAllChanges(file, changes, fileLines).then(function (response) {
          var newFileLines = response.fileLines;

          if (newFileLines) {
            var contents = newFileLines.join("\n");
            fs.writeFile(file.filepath, contents, {}, function (err) {
              console.log("write file response", err);
              logger(file, "Completed writing file");
              resolve()
            })
          } else {
            reject();
          }


        }, function () {
          reject();
        })


      })


    });

  };


  that.applyAllChanges = function (file, changes, fileLines) {

    return new Promise(function (resolve, reject) {

      var good = 0;
      var bad = 0;

      function doIthChange(ith, fileLines) {
        var change = changes[ith];
        that.processChange(file, change, fileLines).then(function (newFileLines) {
          completeCall(ith, newFileLines);
          if (ith + 1 < changes.length) {
            doIthChange(ith + 1, newFileLines)
          }
        }, function () {
          completeCall(ith, fileLines);
          if (ith + 1 < changes.length) {
            doIthChange(ith + 1, fileLines)
          }
        });

      }

      function completeCall(ith, newFileLines) {
        if (ith + 1 == changes.length) {
          resolve({
            fileLines: newFileLines
          });
        }
      }

      doIthChange(0, fileLines);

    })

  };


  that.validateSingle = function (file, validation, fileLines) {
    switch (validation.checkType) {
      case "positive":
        logger(file, "Check line: " + validation.query);
        var fileUpdated = false;
        var query = validation.query;
        var queryRegex = new RegExp(query);
        for (var u = 0; u < fileLines.length; u++) {
          if (fileLines[u].match(queryRegex)) {
            logger(file, "Validation success, found " + query);
            logger(file, "SearchAndReplace, Validation Failed [Positive]" + query);
            return true;
          }
        }
        return false;
        break;

      case "negative":
        logger(file, "Check line: " + validation.query);
        var fileUpdated = false;
        var query = validation.query;
        var queryRegex = new RegExp(query);
        for (var u = 0; u < fileLines.length; u++) {
          if (fileLines[u].match(queryRegex)) {
            logger(file, "Validation failed, found " + query);
            logger(file, "SearchAndReplace, Validation Failed [Negative]" + query);
            return false;
          }
        }
        return true;
        break;

      default:
        logger(file, "Unknown validation type", validation.checkType)
        return false;
    }
    return false;

  }

  that.validate = function (file, validations) {
    console.log("search and replace handler do validation", validations);
    return new Promise(function (resolve, reject) {

      if (!(validations instanceof Array)) {
        validations = [validations];
      }

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
        logger(file, "Line count: " + fileLines.length);


        var goodCount = 0;
        var badCount = 0;

        for (var i = 0; i < validations.length; i++) {
          var validation = validations[i];
          logger(file, "Validation check type: " + validation.checkType);
          var res = that.validateSingle(file, validation, fileLines);
          if (!res) {
            badCount += 1;
            reject("Validation failed");
            return;
          } else {
            goodCount += 1;
          }
        }
        logger(file, "Resolve from search and replace 2");
        resolve({
          success: goodCount,
          failed: badCount
        });
      })
    })
  };


  return that;
}
