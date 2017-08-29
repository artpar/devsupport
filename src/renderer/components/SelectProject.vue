<template>

  <div class="ui column centered grid">
    <div class="super-coder">
      <img src="~@/images/superhero_home.png" alt="image?">
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
    <div class="ui mini modal">
      <div class="header">
        <h3>Unknown project type</h3>
      </div>
      <div class="content">
        <div class="description">
          Unable to identify project. Try something else.
        </div>
      </div>
      <div class="actions">
        <div class="ui primary button" @click="errModal3('hide')">OK</div>
      </div>
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
            "result": {
              "language": "java",
              "stack": "android",
            },
            "checks": [{
              "checkType": "fileExists",
              "value": "build.gradle",
            }]
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
      errModal3: function (action) {
        jQuery('.ui.mini.modal').modal(action);
      },
      ...mapActions(['setProjectDir', 'setSessionAction', 'addProject']),
      open(link) {
        this.$electron.shell.openExternal(link);
      },
      folderSelect: function (file) {
        var that = this;

        var rawFile = file.raw;
        console.log("folder selected", file, arguments);
//        let identification = {
//          stack: 'android',
//          language: 'java'
//        };


        let identification = null;

        for (let i = 0; i < that.ProjectIdentificationRules.length && identification == null; i++) {
          let rule = that.ProjectIdentificationRules[i];

          let isOk = true;

          for (var w=0;w<rule.checks.length && isOk;w++) {
            let check = rule.checks[w];
            switch (check.checkType) {
              case "fileExists":
                console.log("check if file exists", check.value);
                if (fs.existsSync(rawFile.path + "/" + check.value)) {
                  console.log("file", check.value, "exists")
                } else {
                  isOk = false;
                  console.log("file", rule.value, "doesnt exists")
                }
                break;
              default:
                console.error("Unidentified check type", rule);
            }
          }

          if (isOk) {
            identification = rule.result;
            break;
          }

        }


        if (identification == null) {
          that.errModal3('show');
//          that.$alert('Unable to identify project', 'Unknown project type', {
//            confirmButtonText: 'Try something else',
//            callback: action => {
//            }
//          });
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
