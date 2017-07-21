<template>
  <div class="ui column centered grid">
    <div class="row">
      <div class="ten wide column">
        <img style="width: 100%;" src="~@/images/batman-full.png" alt="image?">
      </div>
    </div>

    <div class="row">
      <div class="eight wide column">
        <!--<div class="heading">Start by selecting your source code folder</div>-->
        <h2>
          Start by selecting your source code folder
        </h2>
      </div>

    </div>
    <div class="row">
      <!--<div class="four wide column">-->
      <!--<el-upload :on-preview="folderSelect" :before-upload="folderSelect" :on-change="folderSelect"-->
      <!--:auto-upload="false"-->
      <!--action="#" style="margin: 12.25px">-->
      <!--<div @click="setAction('integrate')" class="pull-left c-pointer">-->
      <!--<img src="~@/images/investigate.png" alt="image?" class="ui small rounded image">-->
      <!--Integrate-->
      <!--</div>-->
      <!--</el-upload>-->
      <!--</div>-->
      <!--<div class="four wide column">-->
      <!--<i class="bordered inverted devcolor massive users icon"></i>-->
      <!--</div>-->
      <div class="four wide column">
        <el-upload :on-preview="folderSelect" :before-upload="folderSelect" :on-change="folderSelect"
                   :auto-upload="false"
                   action="#">
          <div @click="setAction('integrate')">
            <i class="material-icons inverted devcolor" style="font-size: 150px; border-radius: 5%">widgets</i> <br/>
            Integrate
          </div>
        </el-upload>

      </div>

      <div class="four wide column">
        <el-upload :on-preview="folderSelect" :before-upload="folderSelect" :on-change="folderSelect"
                   :auto-upload="false"
                   action="#">
          <div @click="setAction('fix')">
            <i class="material-icons inverted devcolor" style="font-size: 150px; border-radius: 5%">build</i> <br/>
            Fix
          </div>
        </el-upload>
      </div>

      <!--<div class="four wide column">-->

      <!--<el-upload :on-preview="folderSelect" :before-upload="folderSelect" :on-change="folderSelect"-->
      <!--:auto-upload="false"-->
      <!--action="#" style="margin: 12.25px">-->
      <!--<div @click="setAction('fix')" class="pull-right c-pointer">-->
      <!--<img class="ui small rounded image" src="~@/images/fix.png" alt="image?">-->
      <!--Fix-->
      <!--</div>-->
      <!--</el-upload>-->
      <!--</div>-->
    </div>
  </div>

</template>

<script>

  import {mapState} from 'vuex';
  import {mapActions} from 'vuex'

  export default {
    name: 'landing-page',
    data() {
      return {}
    },
    methods: {
      print() {
        console.log("take me somwewhere");
      },
      ...mapActions(['setProjectDir', 'setSessionAction']),
      open(link) {
        this.$electron.shell.openExternal(link);
      },
      folderSelect: function (file) {
        var rawFile = file.raw;
        this.setProjectDir(rawFile.path);
        console.log("folder selected", file, arguments)

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

      },
      setAction(action) {
        console.log("Set session action")
        this.setSessionAction(action)
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
      }, 500)
    },
  };
</script>

<style>
  .devcolor {
    background-color: #fff !important;
    color: #3d668d !important;
  }

  .inverted.devcolor {
    background-color: #3d668d !important;
    color: #fff !important;
  }


</style>
