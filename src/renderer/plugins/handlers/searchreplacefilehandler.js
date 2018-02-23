/**
 * Created by artpar on 7/6/17.
 */
const fs = require('file-system');

export default function (fileType, logger) {
    const that = {};
    that.fileType = fileType;

    that.applyChange = function (file, change, fileLines) {
        let u;
        // debugger;
        switch (change.changeType) {
            case "add.line":
                logger(file, "Add line to file");
                let query = change.query;
                const action = change.action;
                const line = change.line;


                const lineNoToEdit = -1;
                let indentation = 0;

                if (!(query instanceof Array)) {
                    query = [query];
                }

                let currentLineIndex = 0;

                for (let i = 0; i < query.length; i++) {
                    const queryRegex = new RegExp(query[i]);
                    let matched = false;
                    for (let u = currentLineIndex; u < fileLines.length; u++) {
                        if (fileLines[u].match(queryRegex)) {
                            matched = true;
                            logger(file, "Query matched at line number " + (u + 1));
                            currentLineIndex = u;
                            indentation = fileLines[u].match(/[^ ]/).index +  fileLines[u].match(/[^\t]/).index * 4;
                            break;
                        }
                    }
                    if (!matched) {
                        logger(file, "Query didn't match for file: ", query[i]);
                        return fileLines;
                    }
                }

                logger(file, "Line number to change " + currentLineIndex, " at indentation ", indentation);

                if (action === "prepend") {
                    fileLines.splice(currentLineIndex, 0, " ".repeat(indentation) + line);
                } else if (action === "append") {
                    fileLines.splice(currentLineIndex + 1, 0, " ".repeat(indentation) + line);
                } else if (action === "appendInline") {
                    fileLines[currentLineIndex] = fileLines[currentLineIndex] + line;
                }  else if (action === "prependInline") {
                    fileLines[currentLineIndex] = line + fileLines[currentLineIndex];
                } else if (action === "replace") {
                    fileLines[currentLineIndex] = " ".repeat(indentation) + line;
                } else if (action === "delete") {
                    fileLines.splice(currentLineIndex, 1);
                }
                return fileLines;
            default:
                logger(file, "Unknown change type", change.changeType);
                return fileLines;
        }

    };


    that.processChange = function (file, change, fileLines) {

        return new Promise(function (resolve, reject) {


            const fileModified = false;
            if (change.validations) {
                that.validate(file, change.validations).then(function () {
                    fileLines = that.applyChange(file, change, fileLines);
                    resolve(fileLines);
                }, function () {
                    logger(file, "Pre change validation failed");
                    reject();
                });
            } else {
                fileLines = that.applyChange(file, change, fileLines);
                resolve(fileLines);
            }

        });


    };

    that.doChange = function (file, changes) {
        // debugger;


        return new Promise(function (resolve, reject) {
            logger(file, JSON.stringify(changes));
            console.log("search and replace handler do change", file.filepath, changes);

            fs.readFile(file.filepath, "utf8", function (err, data) {
                logger(file, "Reading file ");
                if (err) {
                    logger(file, "Error in reading file");
                    reject("Error in reading file");
                    return;
                }

                const str = data.toString("utf8", 0, data.length);
                // logger(file, "Parser created");

                const fileLines = str.split(/\n/);
                // logger(file, "Line count: " + fileLines.length);

                const fileModified = false;

                that.applyAllChanges(file, changes, fileLines).then(function (response) {
                    const newFileLines = response.fileLines;

                    if (newFileLines) {
                        const contents = newFileLines.join("\n");
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

            let good = 0;
            let bad = 0;

            function doIthChange(ith, fileLines) {
                const change = changes[ith];
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
                if (ith + 1 === changes.length) {
                    resolve({
                        fileLines: newFileLines
                    });
                }
            }

            doIthChange(0, fileLines);

        })

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
    };

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
    };


    return that;
}
