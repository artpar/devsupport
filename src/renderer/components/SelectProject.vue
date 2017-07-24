<template>
  <div class="ui column centered grid">
    <div class="row">
      <div class="ten wide column">
        <img style="width: 100%;" src="~@/images/herofull.png" alt="image?">
      </div>
    </div>

    <div class="row">
      <h2>
        Start by selecting your source code folder
      </h2>

    </div>
    <div class="row">
      <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="folderSelect" :before-upload="folderSelect" :on-change="folderSelect"
          :auto-upload="false"
          drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Drop file here or <em>click to select</em></div>
        <div class="el-upload__tip" slot="tip">Root folder of your project</div>
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
//      processFile: function (file, filelist) {
//        console.log("provided schema", this.schema, file.raw)
//      },
      print() {
        console.log("take me somwewhere");
      },
      ...mapActions(['setProjectDir', 'setSessionAction', 'addProject']),
      open(link) {
        this.$electron.shell.openExternal(link);
      },
      folderSelect: function (file) {
        var that = this;

        var rawFile = file.raw;
        console.log("folder selected", file, arguments);

        let identification = null;

        fs.recurseSync(
            rawFile.path,
            ['**/build.gradle', '**/AndroidManifest.xml'],
            function (filepath, relative, filename) {
              console.log("matched file ", filepath);

              for (let i = 0; i < that.ProjectIdentificationRules.length && identification == null; i++) {
                let rule = that.ProjectIdentificationRules[i];

                switch (rule.checkType) {
                  case "fileNameIs":
                    console.log("rule file name check", filename, rule.value)
                    if (filename == rule.value) {
                      identification = rule.result;
                    }
                    break;
                  default:
                    console.error("Unidentified check type", rule);
                }


              }

            }
        );


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
