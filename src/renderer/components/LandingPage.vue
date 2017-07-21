<template>

  <div class="ui sixteen wide column grid">

    <div class="ui column" style="padding: 0 14% 0 0">
    </div>
    <div class="ui cards" style="margin: 10px 0px 10px 0px">

      <el-upload :on-preview="folderSelect" :before-upload="folderSelect" :on-change="folderSelect"
                 :auto-upload="false"
                 action="#" style="margin: 12.25px">
        <div @click="setAction('integerate')" class="ui card hoverZoom1 hoverColor1">
          <div class="image" style="background-color: rgba(0,0,0,0); padding: 40px;">
            <img src="~@/assets/icons/152-magic-wand.svg">
          </div>

          <div class="content">
            <a class="header">Integrate</a>
            <div class="meta">
              <!--<span class="date">Added in Jul 2017</span>-->
            </div>
            <div class="description">
              Start a new integration
            </div>
          </div>
        </div>
      </el-upload>


      <el-upload :on-preview="folderSelect" :before-upload="folderSelect" :on-change="folderSelect"
                 :auto-upload="false"
                 action="#" style="margin: 12.25px">
        <div @click="setAction('integerate')" class="ui card hoverZoom1 hoverColor2">
          <div class="image" style="background-color: rgba(0,0,0,0); padding: 40px;">
            <img src="~@/assets/icons/146-wrench.svg">
          </div>

          <div class="content">
            <a class="header">Fix</a>
            <div class="meta">
              <!--<span class="date">Added in Jul 2017</span>-->
            </div>
            <div class="description">

              Fix an existing issue

            </div>
          </div>
        </div>
      </el-upload>
    </div>
  </div>

  <!--<div class="ui column" style="margin: 20px">-->
  <!--</div>-->
  <!--<div class="ui column">-->


  <!--<div  class="ui card hoverZoom1 hoverColor2">-->
  <!--<div class="image" style="background-color: rgba(0,0,0,0);">-->
  <!--<img src="~@/assets/icons/146-wrench.svg">-->
  <!--</div>-->
  <!--<div class="content">-->
  <!--<a class="header">Fix</a>-->
  <!--<div class="meta">-->
  <!--&lt;!&ndash;<span class="date">Added in Jul 2017</span>&ndash;&gt;-->
  <!--</div>-->
  <!--<div class="description">-->
  <!--<el-upload :on-preview="folderSelect"-->
  <!--:auto-upload="false"-->
  <!--class="upload-demo" action="#">-->
  <!--<el-button @click="setAction('fix')" size="large" type="primary">Fix</el-button>-->
  <!--<div slot="tip" class="el-upload__tip">Solve an integration issue</div>-->
  <!--</el-upload>-->

  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
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

</style>
