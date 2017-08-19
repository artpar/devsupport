<template>
  <div class="ui grid">
    <div class="sixteen wide column">
      <template>
        <div class="integration list-wpr">
          <div class="list-item" v-for="integration in integrations" @click="startIntegration(integration)">
            <div
                :style="{float: 'bottom', color: integration.color, fontSize: '85px'}"
                :class="'ui image devicon pull-left ' + integration.icon"></div>
            <div class="pull-left content-data">
              <div class="title">{{integration.name}}</div>
              <div class="desc">{{integration.description}}</div>
            </div>
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
      this.$store.commit('PAGE_VIEW', getPageDesc("/app/integrationSelection", "IntegrationSelection"));
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
          name: 'ScanningFiles', params: {id: integration.id}
        })
      },
      ...mapActions(['setIntegration']),
      chooseIntegration(inte) {
        this.setIntegration(inte);
        this.$router.push({
          name: 'ScanningFiles',
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