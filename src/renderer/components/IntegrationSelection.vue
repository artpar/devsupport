<template>
  <div class="ui grid">
    <!--<div v-if="Project" class="sixteen wide column">-->


    <!--<div class="ui ordered steps mini">-->
    <!--<div class="completed step">-->
    <!--<div class="content">-->
    <!--<div class="title">-->
    <!--Project Source-->
    <!--</div>-->
    <!--<div slot="description">-->
    <!--{{Project.projectDir}}-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="active step" title="Choose integration">-->
    <!--<div class="content">-->
    <!--<div class="title">-->
    <!--Choose integration-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="step" title="Review">-->
    <!--<div class="content">-->
    <!--<div class="title">-->
    <!--Review-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="step" title="Execute">-->
    <!--<div class="content">-->
    <!--<div class="title">-->
    <!--Execute-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->

    <!--</div>-->
    <div class="sixteen wide column">

      <div class="ui cards">


        <template v-for="integration in integrations">
          <div @click="startIntegration(integration)" class="ui card hoverZoom1 hoverColor1" style="cursor: pointer;">

            <div class="image">
              <span
                  :style="{float: 'bottom', color: integration.color, fontSize: '150px', padding: '62px'}"
                  :class="'ui image devicon ' + integration.icon"></span>

            </div>
            <div class="content">
              <a class="primary header">
                {{integration.name}}
              </a>
              <div class="description">
                {{integration.description}}
              </div>
            </div>

          </div>
        </template>

      </div>

    </div>

  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import {mapActions} from 'vuex';
  import jsonApi from '../plugins/jsonApi';


  export default {
    data() {
      return {
        integrations: []
      }
    },
    mounted() {
      var that = this;
      let merchantReferenceId = this.$route.params.id;
      console.log("started integration selection", merchantReferenceId);


      jsonApi.one("merchant", merchantReferenceId).all("integration_id").get({
        page: {
          number: 1,
          size: 10,
        }
      }).then(function (r) {
        console.log("all integrations", r);
        that.integrations = r;
      })

    },
    methods: {
      startIntegration(integration) {
        console.log("start integration ", integration.id);
        this.$router.push({
          name: 'Integrate', params: {id: integration.id}
        })
      },
      ...mapActions(['setIntegration']),
      chooseIntegration(inte) {
        this.setIntegration(inte);
        this.$router.push({
          name: 'Integrate',
          params: {
            name: 'lazyPayAndroid'
          }
        })
      },
    },
    computed: {
      ...mapState(['Project'])
    }
  }
</script>
<style>


</style>