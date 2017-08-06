<template>
  <div class="ui grid">
    <div class="sixteen wide column">
        <template >
<!--           <div @click="startIntegration(integration)" class="ui card hoverZoom1 hoverColor1" style="cursor: pointer;">

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

          </div> -->
          <div class="integration list-wpr">
            <div class="list-item" v-for="integration in integrations" @click="startIntegration(integration)">
              <div
                :style="{float: 'bottom', color: integration.color, fontSize: '85px'}"
                :class="'ui image devicon pull-left ' + integration.icon"></div>
              <div class="pull-left content-data">
                <div class="title">{{integration.name}}</div>
                <div class="desc">{{integration.description}}</div> 
              </div>
              <div class="integration-btn pull-right">Integration</div> 
            </div>
          </div>
        </template>
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
        integrations: [],
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
    mounted() {
      this.setPageDesc("/app/integrationSelection","IntegrationSelection");
      console.log("pageDesc",this.pageDesc);
      this.$store.commit('PAGE_VIEW',this.pageDesc);

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
      setPageDesc(path,title) {
        this.pageDesc.path=path;
        this.pageDesc.title=title;
      },
      setEventDesc(category,action,label) {
        this.eventDesc.category=category;
        this.eventDesc.action=action;
        this.eventDesc.label=label;
      },
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