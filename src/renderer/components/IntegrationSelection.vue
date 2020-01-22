<template>
  <div class="ui grid">
    <div class="sixteen wide column">
      <template>
        <div class="integration list-wpr" style="min-height: calc(100vh - 320px)">
          <div class="list-item" v-for="integration in integrations" @click="startIntegration(integration)">
          <div
              :style="{float: 'bottom', color: integration.color, fontSize: '60px'}"
              :class="'ui image devicon pull-left ' + integration.icon"></div>
            <div class="pull-left content-data">
              <div class="title devblue">{{integration.name}}</div>
              <div class="desc">{{integration.description}}</div>
            </div>
          </div>
          <!--calc(100vh - 470px)-->

        </div>
        <div class="integration list-wpr">
          <div id="myInfo" class="ui icon message" style="display: none;">
            <i class="material-icons devblue" style="margin-right: 0.5em; font-size: 3.5em;">info_outline</i>
            <div class="content devblue" style="font-family: 'Raleway',sans-serif; font-size: medium">
              Complete your server (PHP/Go/Java/Python etc) integration first.
              Devsupport AI will give you files to download. Host these files on your server and get the URLs to these files.
              <br><br>In the next step, complete your front end (Android/iOS) integration.
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
      console.log("started integration selection, merchantReferenceId:", merchantReferenceId);

      //Api calls for integrations
      jsonApi.one("merchant", merchantReferenceId).all("integration_id").get({
        page: {
          number: 1,
          size: 50,
        }
      }).then(function (r) {
        console.log("all integrations", r);
        that.integrations = r;
        jQuery('#myInfo').show()

      }, function(){
          console.log("failed", arguments);
      });


    },
    methods: {
      startIntegration(integration) {
        console.log("start integration ", integration.name);
        this.$store.commit('GA_EVENT',{
          category: "Select-Integration",
          action: integration.name,
          label: "Select-Integration",
        });
        //debugger;
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