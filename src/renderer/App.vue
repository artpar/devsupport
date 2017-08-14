<template>
  <div id="app" class="container fluid pad-1em">
    <div class="ui grid">
      <recent-projects></recent-projects>
      <div class="twelve wide column content-wpr">
        <div class="ui secondary menu" v-if="Project.currentProject != null">
          <div class="item"
               v-if="Project.currentProject.identification != null && Project.currentProject.identification.language != null">
            <i class="circular big icon"><i
              :class="'devicon devicon-'+Project.currentProject.identification.language+'-plain'"></i></i>
          </div>
          <div class="item"
               v-if="Project.currentProject.identification != null && Project.currentProject.identification.stack != null">
            <i class="circular big icon"><i
              :class="'devicon devicon-'+Project.currentProject.identification.stack+'-plain'"></i></i>
          </div>
          <div class="right item">
            <a @click="goHome"><i class="circular large home link inverted primary icon"></i></a>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import RecentProjects from './components/RecentProjects.vue';
  import {mapState, mapActions} from 'vuex';
  export default {
    data() {
      return {
        pageDesc: [
          {
            path: null,
            title: null,
          }
        ],
        eventDesc: [
          {
            category: null,
            action: null,
            label: null,
          }
        ],

      }
    },
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
        this.setPageDesc("/app", "home");
        this.$store.commit('PAGE_VIEW', this.pageDesc);
        this.setProjectDir({
          projectDir: null
        });
        this.$router.push({
          name: 'select-project'
        })
      },
      setPageDesc(path, title) {
        this.pageDesc.path = path;
        this.pageDesc.title = title;
      },
      getEventDesc(category, action, label) {
        this.eventDesc.category = category;
        this.eventDesc.action = action;
        this.eventDesc.label = label;
      },
    },
    mounted() {
      this.$store.commit('SET_VISITOR');
      console.log("store", this.$store);
      this.setPageDesc("/app", "home");
      console.log("pageDesc", this.pageDesc);
      this.$store.commit('PAGE_VIEW', this.pageDesc);

//      this.$store.state.Project.visitor.event("Event Category", "Event Action").send();
      console.log("projects", app.getPath)
    },
    name: 'devsupport-ai',
  };
</script>

<style>

/*  html, body {
    overflow: hidden;
  }*/

  h1 {
    color: #383A63;
  }

  h2, h3, h4 {
    color: #383A63;
  }

  .light {
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