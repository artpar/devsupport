/**
 * Created by artpar on 7/6/17.
 */
var fs = require('file-system');

export default function (fileType, logger) {
  var that = {};
  that.fileType = fileType;
  that.parser = {};


  that.doChange = function (file, change) {

    return new Promise(function (resolve, reject) {
      console.log("xml file handler do change", change);

      logger(file, "Begin reading file for change");
      fs.readFile(file.filepath, "utf8", function (err, data) {
        logger(file, "Read complete for change");
        if (err) {
          logger(file, "Error in reading file: ");
          reject();
          return;
        }

        console.log("begin parse xml")
        var str = data.toString("utf8", 0, data.length);
        var xml = jQuery('<root>' + str + '</root>');
        that.parser = xml;
        logger(file, "Parser created");
        console.log("new xml parsed file", that.parser, change)
        var contentUpdated = false;
        switch (change.changeType) {
          case "add.tag":
            logger(file, "Add tag: ", change.tag);
            switch (change.action) {
              case "prepend":
                that.parser.find(change.query).append(change.tag)
                contentUpdated = true;
                break;
              case "append":
              default:
                that.parser.find(change.query).append(change.tag)
                contentUpdated = true;
            }
            break;
          default:
            logger(file, "Unknown change type: " + change.changeType)
        }

        if (contentUpdated) {
          logger(file, "Content updated, writing to file");
          console.log("log before xml write")
          fs.writeFile(file.filepath, that.parser.html(), {}, function (err) {
            if (err) {
              logger(file, "Error on updating contents of file")
              reject();
              return;
            } else {
              logger(file, "Contents updated")
              resolve();
              return;
            }
          })
        } else {
          logger(file, "No changes to write")
          reject();
          return;
        }


      });


    })

    return "ok"
  };
  that.validate = function (file, validation) {

    return new Promise(function (resolve, reject) {
      var checkType = validation.checkType;


      logger(file, "Begin reading file for validation");
      fs.readFile(file.filepath, "utf8", function (err, data) {
        logger(file, "Read complete for validation");
        if (err) {
          logger(file, "Error in reading file");
          reject();
          return;
        }

        var str = data.toString("utf8", 0, data.length);
        that.parser = jQuery(str);
        logger(file, "Parser created");
        console.log("xml check do validate", file, validation)

        switch (checkType) {
          case "tag.attribute":
            logger(file, "Find query " + validation.query)
            var res = that.parser.find(validation.query)
            if (res && res.length > 0) {

              for (var i = 0; i < res.length; i++) {
                var ele = res[i];
                var attrValue = jQuery(ele).attr(validation.attribute)
                logger(file, "Compare attribute value with " + attrValue)
                if (attrValue == validation.value) {
                  logger(file, "Validation failed, already found: " + validation.value)
                  reject();
                  return;
                }
              }
              logger(file, "Validation success, no elements has same attribute")
              resolve();
              return;

            } else {
              logger(file, "Validation success, query returned no results")
              resolve();
              return;

            }
            break;
          default:
            logger(file, "Invalid check type")
            reject();
            return;
        }


      });


    })

  };

  return that;
}
