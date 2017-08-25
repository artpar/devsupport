<template>

  <div class="ui column centered grid">
    <div class="super-coder">
      <img src="~@/images/herofull.png" alt="image?">
    </div>

    <div class="get-source-folder">
      <div class="heading">Before we start please link your source folder here</div>
      <el-upload
          class="upload-demo box"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="folderSelect" :before-upload="folderSelect" :on-change="folderSelect"
          :auto-upload="false"
          drag>
        <!--<i class="el-icon-upload"></i>-->
        <div class="el-upload__text" style="margin-top: 35px; color: #515151; font-size: 16px">Drop your source folder here <br>or<br>Click here to locate the folder</div>
        <div class="el-upload__tip" slot="tip">
          Root folder of your project OR 
          <span class="skip" @click="skip()">Skip</span>
        </div>
      </el-upload>
    </div>
  </div>

</template>

<script>

  import {mapState} from 'vuex';
  import {mapActions} from 'vuex'

  var fs = require('file-system');

  export default {
    name: 'select-project',
    data() {
      return {
        ProjectIdentificationRules: [
          {
            "checkType": "fileNameIs",
            "value": "AndroidManifest.xml",
            "result": {
              "language": "java",
              "stack": "android",
            }
          }
        ]
      }
    },
    methods: {
      skip() {
        this.setProjectDir({
         projectDir: ""
        });
        this.$router.push({
          name: 'select-action'
        });
      },
      ...mapActions(['setProjectDir', 'setSessionAction', 'addProject']),
      open(link) {
        this.$electron.shell.openExternal(link);
      },
      folderSelect: function (file) {
        var that = this;

        var rawFile = file.raw;
        console.log("folder selected", file, arguments);
        let identification = {
          stack: 'android',
          language: 'java'
        };
//        fs.recurseSync(
//            rawFile.path,
//            ['**/build.gradle', '**/AndroidManifest.xml'],
//            function (filepath, relative, filename) {
//              console.log("matched file ", filepath);
//
//              for (let i = 0; i < that.ProjectIdentificationRules.length && identification == null; i++) {
//                let rule = that.ProjectIdentificationRules[i];
//
//                switch (rule.checkType) {
//                  case "fileNameIs":
//                    console.log("rule file name check", filename, rule.value)
//                    if (filename == rule.value) {
//                      identification = rule.result;
//                    }
//                    break;
//                  default:
//                    console.error("Unidentified check type", rule);
//                }
//
//
//              }
//
//            }
//        );


        if (identification == null) {
          that.$alert('Unable to identify project', 'Unknown project type', {
            confirmButtonText: 'Try something else',
            callback: action => {
            }
          });
          return;
        }
        this.setProjectDir({
          projectDir: rawFile.path,
          identification: identification
        });


        that.$router.push({
          name: 'select-action'
        });


        return;

        if (this.Project.action == "fix") {
          this.$router.push({
            name: 'SelectFix'
          });
          return;
        } else {
          this.$router.push({
            name: 'ChooseSP'
          });
          return;

        }

      }
    },
    computed: {
      ...mapState({
        'Project': 'Project',
      }),
    },
    mounted() {
      setTimeout(function () {
        console.log("input file", jQuery("input[type=file]"))
        jQuery("input[type=file]").attr("webkitdirectory", "true")
      }, 500);
    },
  };
</script>

<style>

</style>
