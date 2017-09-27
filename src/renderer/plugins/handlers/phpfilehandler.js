/**
 * Created by artpar on 7/6/17.
 */

var antlr4 = require("antlr4");
const {PHPParser} = require("./php/PHPParser")
const {PHPLexer} = require("./php/PHPLexer")
const {PHPListener} = require('./php/PHPParserListener');

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

      fs.readFile(file.filepath, "utf8", function (err, data) {
        logger(file, "Reading file ");
        if (err) {
          logger(file, "Error in reading file");
          reject("Error in reading file");
          return;
        }

        var input = data.toString("utf8", 0, data.length);
        // logger(file, "Parser created");

        var chars = new antlr4.InputStream(input);
        var lexer = new PHPLexer.ExprLexer(chars);
        var tokens  = new antlr4.CommonTokenStream(lexer);
        var parser = new PHPParser.PHPParser(tokens);
        parser.buildParseTrees = true;
        var tree = parser.prog();
        debugger
        console.log("parsed tree", tree);

      });

      console.log("do some changes here")
    })
  };

  that.applyAllValidations = function (file, validations) {

    console.log("apply validations");
    resolve();
  };

  that.validate = function (file, validations) {
    return new Promise(function (resolve, reject) {
      console.log("validate file");
      resolve();
    });


  };

  return that;
}
