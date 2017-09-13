<template>

  <div class="four wide column sidebar-wpr">
    <!--     <div class="ui raised segment background devcolordark" v-if="Project.projectDir != null">
          <h2 class="light">{{Project.name}}</h2>
          <p>{{Project.projectDir}}</p>    "project.location != null"
        </div> -->
    <div class="sidebar-path" v-if="Project.projectDir != null && Project.projectDir != ''">
      <div class="content">
        <img class="c-pointer" style="height: 1.6em; position: absolute; left: calc(95% - 20px);"
             src="~@/images/close_Icon.svg" @click="goHome">
        <div class="heading">{{Project.name}}</div>

        <div v-if="Project.projectDir.length > 34" class="data" style="">
          ....{{Project.projectDir.slice(Project.projectDir.length-29, Project.projectDir.length)}}
        </div>
        <div v-else>{{Project.projectDir}}</div>

      </div>
    </div>
    <template v-if="false">
    <div class="sidebar-heading">Recent Projects</div>
    <div class="sidebar-recent-project">
      <template v-if="Project.recentProjects.length!=0">
      <div class="recent-project-item-wpr" v-for="project in  orderBy(Project.recentProjects, 'lastAccess', -1)">
        <div class="title" @click="setProject(project)">{{project.name}}</div>
        <div class="path" style="">{{project.location}}</div>
        <div class="note">Last opened <i>{{project.lastAccess | timeSinceNow}}</i> ago</div>
      </div>
      </template>
      <template v-else>
        <div class="recent-project-item-wpr">
          <div class="path" style="font-size: 1em;">
            Your recent Projects show up here. Go ahead, link one of your projects and see the magic ;)
          </div>
        </div>
      </template>

    </div>
    </template>

<!--side bar faq starts-->
    <template v-else>
      <div class="sidebar-heading">FAQ's</div>
      <div class="sidebar-recent-project">
        <div class="recent-project-item-wpr" v-for="n in 5">
        <div class="title" @click="faqLayout()">Hash/Signature doesn't Match</div>
        <div class="path" style="">Fix: This is the fix here/it should fix the issue...</div>
          <i class="path" style="color: #383a63">This fix helped 300 other developers</i>
          <span class="tags PAYU pull-right">PAYU</span>

        </div>
      </div>
    </template>




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
      faqLayout() {
        this.$router.push({
          name: 'ShowFaq'
        });

      },
      goHome() {


        if (window.drift && window.drift.reset) {
          window.drift.hide()
        }
        this.setProjectDir({
          projectDir: null
        });
        this.$router.push({
          name: 'select-project'
        })
      },
    },

    computed: {
      ...mapState({
        'Project': 'Project',
      }),
    }
  }

</script>