import fs from 'fs';
import request from 'request';

var AdmZip = require('adm-zip');
const path = require('path');
import axios from 'axios';
import dot from 'dot';



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
  }


  that.rename_or_copy_and_delete = function (oldPath, newPath, callback) {

    function copy_and_delete() {
      var readStream = fs.createReadStream(oldPath);
      var writeStream = fs.createWriteStream(newPath);

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


            var fileContent = zipEntry.getData().toString('utf8');


            var targetBase = path.parse(zipEntry.entryName);
            if (!zipEntry.isDirectory) {
              var zipEntryName = path.parse(zipEntry.entryName).base;
              console.log("target base", targetBase, zipEntryName);

              const tempFn = dot.template(fileContent);
              var contentToWrite = tempFn(contextMap);

              fs.writeFile(unzipTarget +  zipEntryName, contentToWrite, 'utf8', function(){
                console.log("file written", arguments);
              });
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

  that.validate = function (file, validations) {
    return new Promise(function (resolve, reject) {

    });
  }

  return that;


}