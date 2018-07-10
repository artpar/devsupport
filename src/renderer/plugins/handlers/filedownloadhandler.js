import fs from 'fs';
import request from 'request';
import axios from 'axios';
import dot from 'dot';

var AdmZip = require('adm-zip');
const path = require('path');


export default function (fileType, logger) {
  var that = {};

  that.logger = logger;


  that.downloadFile = function (file_url, targetPath, completed) {
    // Save variable to know progress
    var received_bytes = 0;
    var total_bytes = 0;

    var req = request({
      method: 'GET',
      uri: file_url
    });

    // var out = fs.createWriteStream(targetPath);
    axios.get(file_url, {
      responseType: 'arraybuffer'
    }).then((response) => {
      console.log("Write response to ", targetPath);

      var out = fs.createWriteStream(targetPath);

      out.on("open", function (fd) {
        out.write(new Buffer(response.data), function () {
          console.log("fs write completed", arguments);
          out.end();
          completed(true);
        });
      });
    }).catch(function (err) {
      console.log("Failed to connect to ", file_url);
      completed(false, err);
    })
  };


  that.rename_or_copy_and_delete = function (oldPath, newPath, callback) {

    function copy_and_delete() {
      const readStream = fs.createReadStream(oldPath);
      const writeStream = fs.createWriteStream(newPath);

      readStream.on('error', callback);
      writeStream.on('error', callback);
      readStream.on('close',
        function () {
          fs.unlink(oldPath, callback);
        }
      );

      readStream.pipe(writeStream);
    }

    fs.rename(oldPath, newPath,
      function (err) {
        if (err) {
          if (err.code === 'EXDEV') {
            copy_and_delete();
          } else {
            callback(err);
          }
          return;// << both cases (err/copy_and_delete)
        }
        callback();
      }
    );
  }

  that.mkdirSync = function (path1) {
    var pathSep = path.sep;
    var dirs = path1.split(pathSep);
    var root = "";

    while (dirs.length > 0) {
      var dir = dirs.shift();
      if (dir === "") {// If directory starts with a /, the first path will be an empty string.
        root = pathSep;
      }
      if (!fs.existsSync(root + dir)) {
        fs.mkdirSync(root + dir);
      }
      root += dir + pathSep;
    }
  };

  that.doChange = function (file, changes, contextMap) {
    console.log("file downloader do change", file, changes)
    return new Promise(function (resolve, reject) {

      var targetRootPath = path.dirname(file.filepath);
      console.log("target root path", targetRootPath);
      var change = changes[0];


      var unzipList = change.unzip;
      var unzipMap = {};
      for (var i = 0; i < unzipList.length; i++) {
        let uz = unzipList[i];
        uz.target = targetRootPath + uz.target
        unzipMap[uz.source] = uz
      }

      let urlParts = change.url.split("/");
      var filename = targetRootPath + "/" + urlParts[urlParts.length - 1]

      that.downloadFile(change.url, filename, function (result, err) {

        if (!result) {
          console.log("File download failed");
          reject(err);
          return;
        }
        console.log('File written!', filename);

        var zip = null;
        try {
          zip = new AdmZip(filename);
        } catch (e) {
          console.log("Failed to read file as zip file", e);
          // fs.unlink(filename);
          reject(e);
          return;
        }

        var zipEntries = zip.getEntries(); // an array of ZipEntry records
        console.log("Start reading sip entries");
        zipEntries.forEach(function (zipEntry) {
          if (unzipMap[zipEntry.entryName]) {
            var unzipTarget = unzipMap[zipEntry.entryName].target;
            // console.log(zipEntry.data.toString('utf8'));
            console.log(zipEntry.toString(), " to ", unzipTarget); // outputs zip entries information


            var targetBase = path.parse(zipEntry.entryName);
            if (!zipEntry.isDirectory && [".ts", ".js", ".java", ".xml", ".php", ".html", ".cs", ".gradle", ".yml", ".yaml", ".json", ".go", "."].indexOf(targetBase.ext) > -1) {
              var zipEntryName = path.parse(zipEntry.entryName).base;
              console.log("target base", targetBase, zipEntryName);

              var fileContent = zipEntry.getData();

              const tempFn = dot.template(fileContent.toString('utf8'));
              var contentToWrite = tempFn(contextMap);

              console.log("check dir exists", unzipTarget);
              if (!fs.existsSync(unzipTarget)) {
                console.log("Target base doesnt exist, create one");
                var resss = that.mkdirSync(unzipTarget);
                console.log("mkdir result", resss)
              }

              var wstream = fs.createWriteStream(unzipTarget + zipEntryName);
              wstream.write(contentToWrite, function () {
                console.log("Completed writing zip entry", unzipTarget + zipEntryName)
              });

              // fs.writeFile(unzipTarget + zipEntryName, contentToWrite, 'utf8', function () {
              //     console.log("file written", arguments);
              // });
            } else {
              zip.extractEntryTo(
                /*entry name*/ zipEntry.entryName,
                /*target path*/ unzipTarget,
                /*maintainEntryPath*/ false,
                /*overwrite*/ true
              );
            }


          }
        });
        fs.unlink(filename, resolve);
      });


    });
  }


  that.applyAllValidations = function (file, validations) {

  };

  that.validateSingle = function (file, validation, fileLines) {
    logger(file, "Check line: " + validation.query);
    let u;
    switch (validation.checkType) {
      case "positive":
        let fileUpdated = false;
        let query = validation.query;
        let queryRegex = new RegExp(query);
        for (u = 0; u < fileLines.length; u++) {
          if (fileLines[u].match(queryRegex)) {
            logger(file, "Validation success, found <b>" + query + "</b>");
            logger(file, "SearchAndReplace, Validation Failed [Positive]" + query);
            return true;
          }
        }
        return false;
        break;

      case "negative":
        fileUpdated = false;
        query = validation.query;
        queryRegex = new RegExp(query);
        for (u = 0; u < fileLines.length; u++) {
          if (fileLines[u].match(queryRegex)) {
            logger(file, "Validation failed, found " + query);
            logger(file, "SearchAndReplace, Validation Failed [Negative]" + query);
            return false;
          }
        }
        return true;
        break;

      default:
        logger(file, "Unknown validation type", validation.checkType);
        return false;
    }
  }

  that.validate = function (file, validations) {
    console.log("search and replace handler do validation", validations);
    return new Promise(function (resolve, reject) {

      if (!(validations instanceof Array)) {
        validations = [validations];
      }
      logger(file, "Validate file against " + validations.length + " validations");

      fs.readFile(file.filepath, "utf8", function (err, data) {
        // logger(file, "Read complete for validation");
        if (err) {
          logger(file, "Error in reading file");

          reject("Error in reading file");
          return;
        }

        const str = data.toString("utf8", 0, data.length);
        // logger(file, "Parser created");

        const fileLines = str.split(/\n/);
        // logger(file, "Line count: " + fileLines.length);


        let goodCount = 0;
        let badCount = 0;

        for (let i = 0; i < validations.length; i++) {
          const validation = validations[i];
          logger(file, "Validation check type: " + validation.checkType);
          let res = that.validateSingle(file, validation, fileLines);
          if (!res) {
            badCount += 1;
            reject("Validation failed [" + validation.checkType + "]: " + validation.query);
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
  }
  return that;


}