<template>
  <div>

    <div class="ui grid">
      <div class="eight wide column">
        <div class="ui form">

          <div class="field right floated">

            <button class="ui green button" @click="save()">Save</button>
            <button class="ui yellow button" @click="load()">Load</button>
            <button class="ui red button" @click="clear()">Clear</button>
          </div>

          <div class="field">
            <label>build.gradle import</label>
            <textarea v-model="allData.gradleImport"></textarea>
          </div>
          <div class="field">
            <label>build.gradle repo</label>
            <textarea v-model="allData.gradleRepo"></textarea>
          </div>
          <div class="field">
            <label>settings.gradle</label>
            <textarea v-model="allData.settingsGradle"></textarea>
          </div>
          <div class="field">
            <label>AndroidManifest.xml Service</label>
            <textarea v-model="allData.androidManifestService"></textarea>
          </div>
          <div class="field">
            <label>AndroidManifest.xml Activity</label>
            <textarea v-model="allData.androidManifestActivity"></textarea>
          </div>
          <div class="field">
            <label>MainActivity fields</label>
            <textarea v-model="allData.mainActivityFields"></textarea>
          </div>
          <div class="field">
            <label>MainActivity imports</label>
            <textarea v-model="allData.mainActivityImports"></textarea>
          </div>
          <div class="field">
            <label>MainActivity Method 1</label>
            <textarea v-model="allData.mainActivityMethod1"></textarea>
          </div>
          <div class="field">
            <label>MainActivity Method 2</label>
            <textarea v-model="allData.mainActivityMethod2"></textarea>
          </div>
          <div class="field">
            <label>After view init</label>
            <textarea v-model="allData.afterViewInit"></textarea>
          </div>

          <div class="field">
            <label>PHP File 1</label>
            <textarea v-model="allData.phpFile1"></textarea>
          </div>

          <div class="field">
            <label>PHP File 2</label>
            <textarea v-model="allData.phpFile2"></textarea>
          </div>


          <div class="field">
            <label>PHP File 3</label>
            <textarea v-model="allData.phpFile3"></textarea>
          </div>


        </div>
      </div>
      <div class="eight wide column" style="height: 1200px">
        <div class="ui form">code
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
        allData: {
          gradleRepo: "",
          gradleImport: "compile 'com.android.support:appcompat-v7:25.3.1'\n" +
          "compile 'com.android.support:design:25.3.1'\n" +
          "compile 'com.google.android.gms:play-services-wallet:11.0.2' \n" +
          "compile 'com.squareup.okhttp3:okhttp:3.9.0'\n" +
          "compile project(':oppwa.mobile-2.2.0')",
          settingsGradle: "",
          phpFile1: "",
          phpFile2: "",
          phpFile3: "",
          mainActivityFields: "PeachListener peachListener;",
          mainActivityImports: "import org.json.JSONException;\n" +
          "import org.json.JSONObject;\n" +
          "import peachpay.Config;\n" +
          "import peachpay.Peach;import peachpay.PeachListener;\n",
          mainActivityMethod1: "private void callPeachPayments(String amount, String currency, String type, String env) {    final Activity activity = this;    JSONObject pay = new JSONObject();    try {        pay.put(\"amount\", amount);        pay.put(\"currency\", currency);        pay.put(\"type\", type);        pay.put(\"env\", env);    } catch (JSONException e) {        e.printStackTrace();    }    initListener();    Peach peachPay = new Peach(pay, activity, peachListener);    IntentFilter filter = new IntentFilter(\"ai.devsupport.peachpay\");    registerReceiver(peachPay, filter);    peachPay.start();}  private void initListener() {    peachListener = new PeachListener() {        @Override        public void onSuccess(String response) {            Toast.makeText(getApplicationContext(), \"Success:\" + response, Toast.LENGTH_LONG)                    .show();        }        @Override        public void onFailure(int code, String reason) {            Toast.makeText(getApplicationContext(), \"Failed Reason:\" + reason, Toast.LENGTH_LONG)                    .show();        }    };}",
          mainActivityMethod2: "",
          androidManifestService: "<service android:name=\"com.oppwa.mobile.connect.service.ConnectService\" android:exported=\"false\" />",
          androidManifestActivity: "<activity    tools:replace=\"android:theme\"    android:name=\"com.oppwa.mobile.connect.checkout.dialog.CheckoutActivity\"    android:theme=\"@style/Theme.Checkout.Light\"    android:windowSoftInputMode=\"adjustPan\"    android:exported=\"false\"    android:launchMode=\"singleTop\"/>\n" +
          "\n" +
          "   <activity android:name=\"peachpay.PeachPay\"></activity>",
          afterViewInit: "callPeachPayments(\"95.00\", \"EUR\", \"DB\", Config.TEST);"
        }
      }
    },
    methods: {
      load() {
        var str = window.localStorage.getItem("java");
        if (str) {
          try {
            var jstr = JSON.parse(str);
            this.allData = jstr;
          } catch (e) {
            window.localStorage.setItem("java", "{}");
          }
        }
      },
      save() {
        console.log("value changed, save to localstorage")
        var str = JSON.stringify(this.allData);
        window.localStorage.setItem("java", str);
      },
      clear() {
        var keys = Object.keys(this.allData);
        console.log("Object keys", keys);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          this.allData[key] = "";
        }
      }
    },
    computed: {
      afterViewInitJson: function () {
        return this.allData.afterViewInit.split("\n").filter(function (ee) {
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
        changes = changes.concat(this.phpFile1Json);
        changes = changes.concat(this.phpFile2Json);
        changes = changes.concat(this.phpFile3Json);

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
      phpFile1Json: function () {
        if (this.allData.phpFile1 && this.allData.phpFile1.trim().length > 3) {


          return {
            "name": "New Payment Request Code",
            "fileSelector": "^$",
            "changeType": "fileDownload",
            "help": "Download and host new_transaction.php to handle new payment requests.",
            "stage": 4,
            "fileName": "new_transaction.php",
            "fileType": "php",
            "change": [
              {
                "changeType": "download.file",
                "line": this.allData.phpFile1.trim()
              }
            ],
            "validations": []
          }

        } else {
          return null
        }
      },
      phpFile2Json: function () {
        let line = this.allData.phpFile2;
        if (line && line.trim().length > 3) {


          return {
            "name": "Handle redirection and notification code",
            "fileSelector": "^$",
            "changeType": "fileDownload",
            "help": "Download and host handle_redirect.php to handle redirected users and notifications",
            "stage": 4,
            "fileName": "handle_redirect.php",
            "fileType": "php",
            "change": [
              {
                "changeType": "download.file",
                "line": line.trim()
              }
            ],
            "validations": []
          }

        } else {
          return null
        }
      },
      phpFile3Json: function () {
        let line = this.allData.phpFile3;
        if (line && line.trim().length > 3) {


          return {
            "name": "Handle redirection and notification code",
            "fileSelector": "^$",
            "changeType": "fileDownload",
            "help": "Download and host handle_redirect.php to handle redirected users and notifications",
            "stage": 4,
            "fileName": "handle_redirect.php",
            "fileType": "php",
            "change": [
              {
                "changeType": "download.file",
                "line": line.trim()
              }
            ],
            "validations": []
          }

        } else {
          return null
        }
      },
      gradleImportJson: function () {
        let line = this.allData.gradleImport;
        if (!line || line.trim().length < 2) {
          return null;
        }
        return line.split("\n").map(function (importLine) {

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
        let line = this.allData.gradleRepo;
        return line.split("\n").map(function (importLine) {

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
        let line = this.allData.mainActivityMethod1;
        let parts = line.split("(")[0];
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
              "line": line,
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
        let line = this.allData.mainActivityMethod2;
        if (!line || line.trim().length < 3) {
          return
        }

        return

        let parts = line.split("(")[0];
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

        let line = this.allData.androidManifestActivity;
        return line.split("\n").filter(function (e) {
          return e.trim().length > 2;
        }).map(function (line) {

          return {
            "name": "Add to AndroidManifest.xml activity: " + line.split("\"")[1],
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
        let line = this.allData.mainActivityImports;
        return line.split("\n").filter(function (e) {
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
        let line = this.allData.androidManifestService;

        if (!line || line.trim().length < 3) {
          return
        }

        return line.split("\n").map(function (line) {

          return {
            "name": "Add to AndroidManifest.xml service: " + line.split("\"")[1],
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
      console.log("loaded java creator");
      this.load();
    }
  }
</script>