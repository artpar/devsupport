import axios from 'axios';
var jp = require('jsonpath');

axios.defaults.adapter = require('axios/lib/adapters/http');


export default function (params, expectations) {

  const that = this;
  that.params = params;


  that.evaluate = function () {
    console.log("new http validation promise");
    return new Promise(function (resolve, reject) {


      if (!expectations || expectations.length === 0) {
        console.log("http call has no expectation, then why make it ?");
        resolve({result: true});
        return
      }

      params["timeout"] = 5000;

      console.log("creating new axios promise", params.url);
      axios(params).then(function (res) {
        console.log("response from validation", res);
        var finalResult = true;
        var failure = null;
        for (var i = 0; i < expectations.length; i++) {
          const expectation = expectations[i];
          var result = false;
          let actualValue = "";
          switch (expectation.operator) {
            case "eq":
              actualValue = jp.query(res, expectation.field)[0];
              result = actualValue == expectation.value;
              break;
            case "regex-find":
              actualValue = jp.query(res, expectation.field)[0];
              result = actualValue.match(new RegExp(expectation.value)) !== null;
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
      }).catch(function (err) {
        var res = err.response;
        var finalResult = true;
        var failure = null;
        for (var i = 0; i < expectations.length; i++) {
          const expectation = expectations[i];
          var result = false;
          let actualValue = "";
          try {


            switch (expectation.operator) {
              case "eq":
                actualValue = jp.query(res, expectation.field)[0];
                result = actualValue == expectation.value;
                break;
              case "regex-find":
                actualValue = jp.query(res, expectation.field)[0];
                result = actualValue.match(new RegExp(expectation.value)) !== null;
                break
            }
          } catch(e) {
            console.log("Failed to evaluate value after http call failure", e)
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

      })
    });
  };
  return that;
}