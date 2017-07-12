<template>

  <div class="ui four column grid">

    <div class="ui column ">

    </div>

    <div class="ui column ">


      <div class="ui card hoverZoom1 hoverColor1">
        <div class="image ">
          <img src="~@/assets/icons/152-magic-wand.svg">
        </div>

        <div class="content">
          <a class="header">Integrate</a>
          <div class="meta">
            <!--<span class="date">Added in Jul 2017</span>-->
          </div>
          <div class="description">
            <el-upload :on-preview="folderSelect" :before-upload="folderSelect" :on-change="folderSelect"
                       :auto-upload="false"
                       class="upload-demo" action="#">
              <el-button @click="setAction('integerate')" size="large" type="primary">Integrate</el-button>
              <div slot="tip" class="el-upload__tip">Start a new integration</div>
            </el-upload>

          </div>
          <!--</div>-->
        </div>
      </div>

    </div>

    <div class="ui column">


      <div class="ui card hoverZoom1 hoverColor2">
        <div class="image">
          <img src="~@/assets/icons/146-wrench.svg">
        </div>
        <div class="content">
          <a class="header">Fix</a>
          <div class="meta">
            <!--<span class="date">Added in Jul 2017</span>-->
          </div>
          <div class="description">
            <el-upload :on-preview="folderSelect"
                       :auto-upload="false"
                       class="upload-demo" action="#">
              <el-button @click="setAction('fix')" size="large" type="primary">Fix</el-button>
              <div slot="tip" class="el-upload__tip">Solve an integration issue</div>
            </el-upload>

          </div>
        </div>
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
            name: 'SelectIntegration'
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
