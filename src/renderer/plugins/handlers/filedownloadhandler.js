import fs from 'fs';
import request from 'request';
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

    var out = fs.createWriteStream(targetPath);
    req.pipe(out);

    req.on('response', function (data) {
      // Change the total bytes value to get progress later.
      total_bytes = parseInt(data.headers['content-length']);
    });

    req.on('data', function (chunk) {
      // Update the received bytes
      received_bytes += chunk.length;

      that.showProgress(received_bytes, total_bytes);
    });

    req.on('end', function () {
      if (completed) {
        completed();
      }
    });
  }

  that.showProgress = function (received, total) {
    var percentage = (received * 100) / total;
    console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
    // 50% | 50000 bytes received out of 100000 bytes.
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

  that.doChange = function (file, changes) {
    console.log("file downloader do change", file, changes)
    return new Promise(function (resolve, reject) {

      var targetRootPath = path.dirname(file.filepath);

      var change = changes[0];


      var unzipList = change.unzip;
      var unzipMap = {};
      for (var i = 0; i < unzipList.length; i++) {
        let uz = unzipList[i];
        uz.target = targetRootPath + uz.target
        unzipMap[uz.source] = uz
      }

      let urlParts = change.url.split("/");
      var filename = urlParts[urlParts.length - 1]

      that.downloadFile(change.url, filename, function () {
        console.log('File written!', filename);

        var zip = null;
        try {
          zip = new AdmZip(filename);
        } catch (e) {
          fs.unlink(filename);
          reject();
          return;
        }


        var zipEntries = zip.getEntries(); // an array of ZipEntry records

        zipEntries.forEach(function (zipEntry) {
          if (unzipMap[zipEntry.entryName]) {
            var unzipTarget = unzipMap[zipEntry.entryName].target;
            // console.log(zipEntry.data.toString('utf8'));
            console.log(zipEntry.toString(), " to ", unzipTarget); // outputs zip entries information


            zip.extractEntryTo(
                /*entry name*/ zipEntry.entryName,
                /*target path*/ unzipTarget,
                /*maintainEntryPath*/ false,
                /*overwrite*/ true
            );


          }
        });
        fs.unlink(filename);
        resolve();

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