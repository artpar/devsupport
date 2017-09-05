<template>
  <div class="ui grid">
    <div class="ui button" @click="test1">test 1</div>
    <div class="ui button">test 2</div>
    <div>{{obj1}}</div>
  </div>
</template>
<script>
  import FileProcessorFactor from '@/plugins/changehandler';
  import JavaParser from 'java-parser';
  export default {

    data(){
      return {
        "obj1":{}
      }
    },
    methods: {
      test1: function () {
        console.log("********************************************************************************" +
          "logs for test1 starts*********************************************************************" +
          "***********\n*****************************************************************************" +
          "***********************************************************************************");
        var change = {
              "name": "Add functions to the java file",
              "fileSelector": ".java",
              "changeType": "fileEdit",
              "stage": 2,
              "fileType": "java",
              "change": [
                {
                  "changeType": "add.line",
                  "action": "append",
                  "query": "{",
                  "line": "private void callInstamojo(String email, String phone, String amount, String purpose, String buyername) {\n        Intent intent = new Intent(MainActivity.this, Instamojo.class);\n        intent.putExtra(\"email\", email);\n        intent.putExtra(\"phone\", phone);\n        intent.putExtra(\"purpose\", purpose);\n        intent.putExtra(\"amount\", amount);\n        intent.putExtra(\"name\", buyername);\n        intent.putExtra(\"env\", Config.TEST);   /* Change this to Config.PROD when you are ready*/ \n       startActivityForResult(intent, Config.INSTAMOJO);\n    }",
                  "validations": [
                    {
                      "checkType": "negative",
                      "query": "callInstamojo"
                    }
                  ]
                },
                {
                  "changeType": "add.line",
                  "action": "append",
                  "query": "{",
                  "line": "@Override\n    protected void onActivityResult(int requestCode, int resultCode, Intent data) {\n        switch (requestCode) {\n            case Config.INSTAMOJO:\n                switch (resultCode) {\n                    case Config.SUCCESS:\n                        Toast.makeText(getApplicationContext(), data.getStringExtra(\"response\"), Toast.LENGTH_LONG)\n                                .show();\n                        break;\n                    case Config.FAILED:\n                        Toast.makeText(getApplicationContext(), data.getStringExtra(\"response\"), Toast.LENGTH_LONG)\n                                .show();\n                        break;\n                    default:\n                        break;\n                }\n\n            default:\n                break;\n        }\n    }",
                  "validations": [
                    {
                      "checkType": "negative",
                      "query": "onActivityResult"
                    }
                  ]
                },
                {
                  "changeType": "add.line",
                  "action": "append",
                  "query": "import",
                  "line": "import instamojo.library.Config;\nimport instamojo.library.Instamojo;                        \nimport android.content.Intent;",
                  "validations": [
                    {
                      "checkType": "negative",
                      "query": "lazypay.app.Instamojo"
                    }
                  ]
                },
                {
                  "changeType": "add.line",
                  "action": "append",
                  "query": "setContentView",
                  "line": "// Call the function callInstamojo to start payment here",
                  "validations": [
                    {
                      "checkType": "negative",
                      "query": "Call the function callInstamojo"
                    }
                  ]
                }
              ],
              "validations": []

        };



        let changeHandler = new FileProcessorFactor.ChangeHandler(change);
        changeHandler.addFile({
          "filename" : "notSoMainJava.java",
          "filepath" : "/media/parth/DATA/workspace/code/devsupport/test/unit/Files/Default/notSoMainJava.java",
          "relative" : "notSoMainJava.java",
        });
        changeHandler.doChange({
          var1: "value1"
        });
        console.log("this is what factory returns", changeHandler);
        console.log("did it force to rerun tests");


      }
    },
    mounted(){

    }
  }

</script>