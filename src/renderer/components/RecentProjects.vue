<template>

  <div class="five wide column">

    <div class="ui raised segment background devcolordark" v-if="Project.projectDir != null">
      <h2 class="light">{{Project.name}}</h2>
      <p>{{Project.projectDir}}</p>
    </div>

    <div class="ui raised segment">
      <h1>Recent Projects</h1>

      <!--<div class="ui dividing header">-->
      <!--<i class="folder icon"></i>-->
      <!--<div class="content">-->
      <!--My awesome project-->
      <!--<div class="sub header">Android</div>-->
      <!--</div>-->
      <!--</div>-->

      <div class="ui divided items">

        <div class="item" v-for="project in  orderBy(Project.recentProjects, 'lastAccess', -1)"
             v-if="project.location != null">

          <div class="content">
            <a class="header" @click="setProject(project)">
              <h3>{{project.name}}</h3>
            </a>
            <div class="description">
              <p>{{project.location}}</p>
              <p>Last opened <i>{{project.lastAccess | timeSinceNow}}</i> ago</p>
            </div>
          </div>

        </div>
      </div>



      <h3 v-if="Project.recentProjects.length == 0">No recent projects</h3>

    </div>

  </div>

</template>
<script>

  import {mapState, mapActions} from 'vuex';

  export default {
    data() {
      return {}
    },
    mounted() {
      console.log("loaded recent projects", this.recentProjects);
//      debugger
      this.Project.recentProjects.map(function (e) {
        if (!e || !e.location) {
          console.log("not e or e location, so no name");
          return;
        }
        let parts = e.location.split("/");
        e.name = parts[parts.length - 1];
      })
    },
    methods: {
      ...mapActions(['setProjectDir']),
      setProject(project){
        this.setProjectDir({
          projectDir: project.location,
        });
        this.$router.push({
          name: 'select-action'
        });

      },
    },
    computed: {
      ...mapState({
        'Project': 'Project',
      }),
    }
  }

</script>