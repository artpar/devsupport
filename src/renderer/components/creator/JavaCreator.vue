<template>
  <div>

    <div class="ui grid">
      <div class="eight wide column">
        <div class="ui form">

          <div class="field">
            <label>build.gradle import</label>
            <textarea v-model="gradleImport"></textarea>
          </div>
          <div class="field">
            <label>build.gradle repo</label>
            <textarea v-model="gradleRepo"></textarea>
          </div>
          <div class="field">
            <label>settings.gradle</label>
            <textarea v-model="settingsGradle"></textarea>
          </div>
          <div class="field">
            <label>AndroidManifest.xml Service</label>
            <textarea v-model="androidManifestService"></textarea>
          </div>
          <div class="field">
            <label>AndroidManifest.xml Activity</label>
            <textarea v-model="androidManifestActivity"></textarea>
          </div>
          <div class="field">
            <label>MainActivity fields</label>
            <textarea v-model="mainActivityFields"></textarea>
          </div>
          <div class="field">
            <label>MainActivity imports</label>
            <textarea v-model="mainActivityImports"></textarea>
          </div>
          <div class="field">
            <label>MainActivity Method 1</label>
            <textarea v-model="mainActivityMethod1"></textarea>
          </div>
          <div class="field">
            <label>MainActivity Method 2</label>
            <textarea v-model="mainActivityMethod2"></textarea>
          </div>
          <div class="field">
            <label>After view init</label>
            <textarea v-model="afterViewInit"></textarea>
          </div>
        </div>
      </div>
      <div class="eight wide column" style="height: 1200px">
        <div class="ui form">
          <div class="field">
            <label>Change set</label>
            <textarea style="height: 80vh; max-height: 100vh;" :cols="100" v-model="finalJson"></textarea>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>
<script>
  export default {
    name: "JavaCreator",
    data() {
      return {
        gradleRepo: "",
        gradleImport: "compile 'com.android.support:appcompat-v7:25.3.1'\n" +
        "compile 'com.android.support:design:25.3.1'\n" +
        "compile 'com.google.android.gms:play-services-wallet:11.0.2' \n" +
        "compile 'com.squareup.okhttp3:okhttp:3.9.0'\n" +
        "compile project(':oppwa.mobile-2.2.0')",
        settingsGradle: "",
        mainActivityFields: "PeachListener peachListener;",
        mainActivityImports: "import org.json.JSONException;\n" +
        "import org.json.JSONObject;\n" +
        "import peachpay.Config;\n" +
        "import peachpay.Peach;import peachpay.PeachListener;\n",
        mainActivityMethod1: "private void callPeachPayments(String amount, String currency, String type, String env) {    final Activity activity = this;    JSONObject pay = new JSONObject();    try {        pay.put(\"amount\", amount);        pay.put(\"currency\", currency);        pay.put(\"type\", type);        pay.put(\"env\", env);    } catch (JSONException e) {        e.printStackTrace();    }    initListener();    Peach peachPay = new Peach(pay, activity, peachListener);    IntentFilter filter = new IntentFilter(\"ai.devsupport.peachpay\");    registerReceiver(peachPay, filter);    peachPay.start();}  private void initListener() {    peachListener = new PeachListener() {        @Override        public void onSuccess(String response) {            Toast.makeText(getApplicationContext(), \"Success:\" + response, Toast.LENGTH_LONG)                    .show();        }        @Override        public void onFailure(int code, String reason) {            Toast.makeText(getApplicationContext(), \"Failed Reason:\" + reason, Toast.LENGTH_LONG)                    .show();        }    };}",
        androidManifestService: "<service android:name=\"com.oppwa.mobile.connect.service.ConnectService\" android:exported=\"false\" />",
        androidManifestActivity: "<activity    tools:replace=\"android:theme\"    android:name=\"com.oppwa.mobile.connect.checkout.dialog.CheckoutActivity\"    android:theme=\"@style/Theme.Checkout.Light\"    android:windowSoftInputMode=\"adjustPan\"    android:exported=\"false\"    android:launchMode=\"singleTop\"/>\n" +
        "\n" +
        "   <activity android:name=\"peachpay.PeachPay\"></activity>",
        afterViewInit: "callPeachPayments(\"95.00\", \"EUR\", \"DB\", Config.TEST);"

      }
    },
    computed: {
      afterViewInitJson: function () {
        return this.afterViewInit.split("\n").filter(function (ee) {
          return !!ee && ee.trim().length > 1
        }).map(function (line) {
          return {
            "name": "After set view add line: " + line.split("(")[0],
            "fileSelector": ".+Activity.java",
            "changeType": "fileEdit",
            "stage": 2,
            "fileType": "java",
            "change": [
              {
                "changeType": "add.line",
                "action": "append",
                "query": "setContentView",
                "line": line,
                "validations": [
                  {
                    "checkType": "negative",
                    "query": line
                  }
                ]
              }
            ],
            "validations": []
          }
        })
      },
      finalJson: function () {

        var changes = []
        changes = changes.concat(this.gradleImportJson);
        changes = changes.concat(this.settingsGradleJson);
        changes = changes.concat(this.mainActivityJson);
        changes = changes.concat(this.androidManifestActivityJson);
        changes = changes.concat(this.mainActivityImportsJson);
        changes = changes.concat(this.androidManifestServiceJson);
        changes = changes.concat(this.afterViewInitJson);

        changes = changes.filter(function (e) {
          return !!e;
        })

        return JSON.stringify({
          "name": "PeachPay Android Integration",
          "variables": [
            {
              "name": "serverurl",
              "label": "Url pointing to your txn generating URL",
              "stage": 1,
              "description": "In order to proceed, you need to complete server integration first",
              "help": "Example: https://mywebsite.com/new_txn.php"
            }
          ],
          "variableValidations": [
            {
              "validationType": "http",
              "errorLabel": "Server is not properly configured at the given url",
              "params": {
                "url": "{{=it.serverurl}}",
                "method": "GET",
                "headers": {},
                "body": {}
              },
              "expectations": [
                {
                  "field": "$.status",
                  "value": "200",
                  "operator": "eq"
                }
              ],
              "stage": 1
            }
          ],
          "changes": changes
        }, null, 2)
      },
      gradleImportJson: function () {
        return this.gradleImport.split("\n").map(function (importLine) {

          if (!importLine) {
            return
          }

          let lineParts = importLine.split(":");

          return {
            "name": "Add import " + lineParts[0] + lineParts[1],
            "fileSelector": ".+build.gradle$",
            "changeType": "fileEdit",
            "stage": 2,
            "fileType": "gradle",
            "change": [
              {
                "changeType": "add.line",
                "line": "\n" + importLine,
                "action": "append",
                "query": "compile 'com.android.support",
                "validations": [
                  {
                    "checkType": "negative",
                    "query": lineParts[0] + lineParts[1]
                  },
                  {
                    "checkType": "positive",
                    "query": "compile 'com.android.support"
                  }
                ]
              }
            ],
            "validations": [
              {
                "checkType": "positive",
                "query": "apply plugin: 'com.android.application'"
              }
            ]
          }


        }).filter(function (r) {
          return !!r
        })
      },
      gradleRepoJson: function () {
        return this.gradleRepo.split("\n").map(function (importLine) {

          if (!importLine) {
            return
          }
          return

          let lineParts = importLine.split(":");

          return {
            "name": "Add dependency for InstaMojo SDK",
            "fileSelector": ".+build.gradle$",
            "changeType": "fileEdit",
            "stage": 2,
            "fileType": "gradle",
            "change": [
              {
                "changeType": "add.line",
                "line": "mavenCentral()\n    maven {\n        url \"https://s3-ap-southeast-1.amazonaws.com/godel-release/godel/\"\n    }",
                "action": "append",
                "query": "repositories[ \t]*{",
                "validations": [
                  {
                    "checkType": "positive",
                    "query": "repositories"
                  },
                  {
                    "checkType": "negative",
                    "query": "godel-release/godel"
                  }
                ]
              },
              {
                "changeType": "add.line",
                "line": "repositories {\n    mavenCentral()\n    maven {\n        url \"https://s3-ap-southeast-1.amazonaws.com/godel-release/godel/\"\n    }\n}\n",
                "action": "prepend",
                "query": "dependencies[ \t]*{",
                "validations": [
                  {
                    "checkType": "negative",
                    "query": "repositories"
                  },
                  {
                    "checkType": "negative",
                    "query": "godel-release/godel"
                  }
                ]
              }
            ],
            "validations": [
              {
                "checkType": "positive",
                "query": "apply plugin: 'com.android.application'"
              }
            ]
          }


        }).filter(function (r) {
          return !!r
        })
      },
      settingsGradleJson: function () {
      },
      mainActivityMethod1Json: function () {
        let parts = this.mainActivityMethod1.split("(")[0];
        return {
          "name": "Add method to Activity: " + parts,
          "fileSelector": ".+Activity.java",
          "changeType": "fileEdit",
          "stage": 2,
          "fileType": "java",
          "change": [
            {
              "changeType": "add.line",
              "action": "append",
              "query": "{",
              "line": this.mainActivityMethod1,
              "validations": [
                {
                  "checkType": "negative",
                  "query": parts
                }
              ]
            }
          ],
          "validations": []
        }
      },
      mainActivityMethod2Json: function () {
        if (!this.mainActivityMethod2 || this.mainActivityMethod2.trim().length < 3) {
          return
        }

        return

        let parts = this.mainActivityMethod2.split("(")[0];
        return {
          "changeType": "add.line",
          "action": "append",
          "query": "{",
          "line": this.mainActivityMethod1,
          "validations": [
            {
              "checkType": "negative",
              "query": parts
            }
          ]
        }
      },
      androidManifestActivityJson: function () {

        return this.androidManifestActivity.split("\n").filter(function (e) {
          return e.trim().length > 2;
        }).map(function (line) {

          return {
            "name": "Add to AndroidManifest.xml: " + line.split("\"")[1],
            "fileSelector": ".+main[\\\\/]AndroidManifest.xml",
            "changeType": "fileEdit",
            "fileType": "xml",
            "change": [
              {
                "changeType": "add.line",
                "line": line,
                "action": "prepend",
                "query": "</application>"
              }
            ],
            "validations": {
              "checkType": "negative",
              "query": line.split("\"")[1]
            }
          };


        })

      },
      mainActivityImportsJson: function () {
        return this.mainActivityImports.split("\n").filter(function (e) {
          return !!e && e.trim().length > 2
        }).map(function (line) {
          return {
            "name": "Add import " + line.split(" ")[1],
            "fileSelector": ".+Activity.java",
            "changeType": "fileEdit",
            "stage": 2,
            "fileType": "java",
            "change": [
              {
                "changeType": "add.line",
                "action": "append",
                "query": "import",
                "line": line,
                "validations": [
                  {
                    "checkType": "negative",
                    "query": line.split(" ")[1]
                  }
                ]
              }
            ],
            "validations": []
          }
        })
      },
      androidManifestServiceJson: function () {
        return this.androidManifestService.split("\n").map(function (line) {

          return {
            "name": "Add to AndroidManifest.xml: " + line.split("\"")[1],
            "fileSelector": ".+main[\\\\/]AndroidManifest.xml",
            "changeType": "fileEdit",
            "fileType": "xml",
            "change": [
              {
                "changeType": "add.line",
                "line": line,
                "action": "prepend",
                "query": "</application>"
              }
            ],
            "validations": {
              "checkType": "negative",
              "query": line.split("\"")[1]
            }
          };
        })
      },

    },
    mounted() {
      console.log("loaded java creator")
    }
  }
</script>