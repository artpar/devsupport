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
          ....{{Project.projectDir.slice(Project.projectDir.length - 29, Project.projectDir.length)}}
        </div>
        <div v-else>{{Project.projectDir}}</div>

      </div>
    </div>
    <!--side bar faq starts-->
    <div class="sidebar-heading">FAQ's</div>
    <div class="sidebar-recent-project">
      <div class="recent-project-item-wpr" v-for="faq in Faq">
        <div class="title" @click="faqLayout(faq)">{{faq.question_content}}</div>
        <div class="path" style="">Fix: {{faq.summary}}</div>
        <i class="path" style="color: #383a63">This helped {{faq.help_count}} other developers</i>
        <span class="tags PAYU pull-right">{{Project.faq.merchant.name}}</span>
      </div>
    </div>

  </div>

</template>
<script>

  import {mapState, mapActions} from 'vuex';
  import jsonApi from '../plugins/jsonApi';

  export default {
    data() {
      return {
        Faq: []
      }
    },
    mounted() {
      var that = this;
      jsonApi.one("merchant", this.Project.faq.merchant.id).all("faq_id").get({
        page: {
          number: 1,
          size: 10,
        }
      }).then(function (rs) {
        console.log("all Faqs", rs);
        that.Faq = rs;
      })
//      debugger
    },
    methods: {
      ...mapActions(['setProjectDir', 'setFaq']),
      setProject(project) {
        this.setProjectDir({
          projectDir: project.location,
        });
        this.$router.push({
          name: 'select-action'
        });

      },
      faqLayout(faq) {
        this.$router.push({
          name: 'ShowFaq',
          params: {
            faq_id: faq.id
          }
        });

      },
      goHome() {


        if (window.drift && window.drift.reset) {
          window.drift.hide()
        }
        this.setProjectDir({
          projectDir: null
        });
        this.setFaq(null);
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