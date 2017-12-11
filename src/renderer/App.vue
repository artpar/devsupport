<template>
  <div id="app" class="container fluid pad-1em">
    <div class="ui grid">
      <faq-sidebar v-if="Project.faq.visibility===true"></faq-sidebar>
      <recent-projects v-else></recent-projects>
      <div class="twelve wide column content-wpr">
        <div class="ui secondary menu" style="height: 60px">
          <!--<div class="item"-->
               <!--v-if="Project.currentProject.identification != null && Project.currentProject.identification.language != null">-->
            <!--<i class="circular big icon"><i-->
              <!--:class="'devicon devicon-'+Project.currentProject.identification.language+'-plain'"></i></i>-->
          <!--</div>-->
          <!--<div class="item"-->
               <!--v-if="Project.currentProject.identification != null && Project.currentProject.identification.stack != null">-->
            <!--<i class="circular big icon"><i-->
              <!--:class="'devicon devicon-'+Project.currentProject.identification.stack+'-plain'"></i></i>-->
          <!--</div>-->
          <div class="right item">
            <img class="c-pointer" v-if="Project.currentProject != null" src="~@/images/close_Icon.svg" @click="goHome">
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import RecentProjects from './components/RecentProjects.vue';
  import FaqSidebar from './components/FaqSidebar.vue';
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
      'recent-projects': RecentProjects,
      'faq-sidebar': FaqSidebar
    },
    computed: {
      ...mapState({
        'Project': 'Project',
      }),

    },
    methods: {
      ...mapActions([
        'setProjectDir',
        'setFaq'
      ]),
      goHome() {


        if (window.drift && window.drift.reset) {
          window.drift.hide()
        }

        this.setPageDesc("/app", "home");
        this.$store.commit('PAGE_VIEW', this.pageDesc);
        this.setProjectDir({
          projectDir: null
        });
        this.setFaq(null);
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
      var that = this;
      window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
//        console.log("key pressed", key)
        if (key == 52) {
          that.$router.push({
            name: 'JavaCreator'
          })
        }
      }





//      this.setPageDesc("/app", "home");
//      console.log("pageDesc", this.pageDesc);
//      this.$store.commit('PAGE_VIEW', this.pageDesc);



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
