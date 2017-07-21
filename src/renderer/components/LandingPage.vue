<template>
  <div class="content-wpr">
    <div class="super-coder">
      <img src="~@/images/batman-full.png" alt="image?">
    </div>
    <div class="get-source-folder">
      <div class="heading">What do you want to do?</div>
      <!--<div class="box">-->
        <!--<div class="message">Drop your source folder here <br> or <br> Click here to locate the folder</div>-->
      <!--</div>-->
    </div>
    <div class="task-list">
      <el-upload :on-preview="folderSelect" :before-upload="folderSelect" :on-change="folderSelect"
                 :auto-upload="false"
                 action="#" style="margin: 12.25px">
      <div @click="setAction('integrate')" class="pull-left c-pointer">
        <img src="~@/images/investigate.png" alt="image?">
        Integrate
      </div>
      </el-upload>
      <div @click="setAction('fix')" class="pull-right c-pointer">
        <img src="~@/images/fix.png" alt="image?">
        Fix
      </div>
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


  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 70%;
    padding: 15%;
    margin: 10%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
