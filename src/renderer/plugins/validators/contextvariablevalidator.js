
export default function (params, expectations) {

  const that = this;
  that.params = params; //probably unused


  that.evaluate = function () {
    console.log("new context variable validation promise");
    return new Promise(function (resolve, reject) {


      if (!expectations || expectations.length === 0) {
        console.log("validation has no expectation, path to happiness");
        resolve({result: true});
        return
      }

      //params["timeout"] = 5000;

      console.log("creating new contextvariable promise", params.url);
      var finalResult = true;
      var failure = null;
      for (var i = 0; i < expectations.length; i++) {
        const expectation = expectations[i];
        var result = false;
        let actualValue = "";
        switch (expectation.operator) {
          case "eq":
            actualValue = expectation.field;
            result = actualValue == expectation.value;
            break;
          case "regex-find":
            actualValue = expectation.field;
            result = actualValue.match(new RegExp(expectation.value)) !== null;
            break
          case "length":
            actualValue = expectation.field;
            result = actualValue.length == expectation.value;
            break
        }

        if (!result) {
          failure = expectation;
          finalResult = false;
          break
        }
      }
      if (finalResult) {
        resolve({"result": finalResult, failure: failure})
      } else {
        reject({"result": finalResult, failure: failure})
      }

    });
  };
  return that;
}