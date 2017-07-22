<template>
  <div id="app" class="ui container fluid">

    <div class="ui grid">
      <recent-projects></recent-projects>


      <div class="ten wide column">
        <div class="ui vertical masthead segment">

          <div class="ui container" v-if="Project.projectDir != null">
            <div class="ui large secondary pointing menu">
              <div class="item" v-if="Project.stack != null">
                <i style="font-size: 50px;" class="material-icons">{{Project.stack}}</i>
              </div>
              <div class="right item">
                <a class="item" @click="goHome">Home</a>
              </div>
            </div>
          </div>

          <div class="ui text" style="margin-top: 3em;">
            <router-view></router-view>
          </div>

        </div>
      </div>
    </div>


  </div>
</template>

<script>

  import RecentProjects from './components/RecentProjects.vue';
  import {mapState, mapActions} from 'vuex';
  export default {
    components: {
      'recent-projects': RecentProjects
    },
    computed: {
      ...mapState({
        'Project': 'Project',
      }),
    },
    methods: {
      ...mapActions([
        'setProjectDir'
      ]),
      goHome() {
        this.setProjectDir(null);
        this.$router.push({
          name: 'select-project'
        })
      },
    },
    mounted() {
      console.log("projects", app.getPath)
    },
    name: 'devsupport-ai',
  };
</script>

<style>

  body {
    padding: 20px;
  }

 h1{
   color: #383A63;
 }
 h2, h3, h4 {
    color: #383A63;
  }


  .light{
    color: #FFFFFF;
  }
  .devcolor {
    color: #3d668d !important;
  }

  .background.devcolor {
    background-color: #3d668d !important;
    color: #fff !important;
  }

  .devcolordark {
    color: #383a63 !important;
  }

  .background.devcolordark {
    background-color: #383a63 !important;
    color: #fff !important;
  }


</style>