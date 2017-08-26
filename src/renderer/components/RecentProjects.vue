<template>

  <div class="four wide column sidebar-wpr">
<!--     <div class="ui raised segment background devcolordark" v-if="Project.projectDir != null">
      <h2 class="light">{{Project.name}}</h2>
      <p>{{Project.projectDir}}</p>    "project.location != null"
    </div> -->
    <div class="sidebar-path" v-if="Project.projectDir != null && Project.projectDir != ''">
      <div class="content">
        <div class="heading">{{Project.name}}</div>
        <div class="data" style="">{{Project.projectDir}}</div>
      </div>
    </div>
    <div class="sidebar-heading">Recent Projects</div>
    <div class="sidebar-recent-project">
      <div 
        class="recent-project-item-wpr" 
        v-for="project in  orderBy(Project.recentProjects, 'lastAccess', -1)"
        v-if="project.location != null">
          <div class="title" @click="setProject(project)">{{project.name}}</div>
          <div class="path" style="">{{project.location}}</div>
          <div class="note">Last opened <i>{{project.lastAccess | timeSinceNow}}</i> ago</div>
      </div>
      <div class="recent-project-item-wpr" v-else>
        <div class="path" style="font-size: 1em;">
        Your recent Projects show up here. Go ahead, link one of your projects and see the magic ;)
      </div>
      </div>
    </div>


    <!--<h3></h3>-->
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
      })
    },
    methods: {
      ...mapActions(['setProjectDir']),
      setProject(project) {
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