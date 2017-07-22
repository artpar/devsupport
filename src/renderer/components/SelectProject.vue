<template>
  <div class="ui column centered grid">
    <div class="row">
      <div class="twelve wide column">
        <img style="width: 100%;" src="~@/images/batman-full.png" alt="image?">
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
        <div class="el-upload__tip" slot="tip">Root folder of your projec</div>
      </el-upload>

    </div>
  </div>

</template>

<script>

  import {mapState} from 'vuex';
  import {mapActions} from 'vuex'

  export default {
    name: 'select-project',
    data() {
      return {}
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
        var rawFile = file.raw;
        console.log("folder selected", file, arguments);
        this.setProjectDir(rawFile.path);
        this.$router.push({
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
