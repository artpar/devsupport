<template>

  <div class="ui centered grid" style="margin-top: calc(50vh - calc(90px + 1rem));">
    <div class="ui massive primary buttons">
      <div class="ui button" @click="setAction('integrate')">
        <div>
          <i class="huge settings icon"></i>
          <h3 class="light">Integrate</h3>
        </div>
      </div>
      <div class="or"></div>
      <div class="ui button" @click="showModal()" @mouseover="active = true" @mouseleave="active = false">
        <div v-if="active">
          <i class="huge configure icon"></i>
          <h3 class="light">coming soon</h3>
        </div>
        <div v-else>
          <i class="huge configure icon"></i>
          <h3 class="light">Fix</h3>
        </div>
      </div>
    </div>
    <div class="ui mini modal">
      <div class="header">
       <h3> Coming soon</h3>
      </div>
      <div class="content">
        <div class="description">
          This feature will be added soon.
        </div>
      </div>
      <div class="actions">
        <div class="ui primary button" @click="hideModal">OK</div>
      </div>
    </div>
    <!--<div class="four wide column">-->
    <!--<a class="ui button">-->
    <!--<div @click="setAction('fix')">-->
    <!--<i class="massive configure icon"></i>-->
    <!--<h1>Fix</h1>-->
    <!--</div>-->
    <!--</a>-->
    <!--</div>-->
  </div>

</template>
<script>
  import Analytics from 'universal-analytics';
  import {mapActions} from 'vuex';
  export default {
    data() {
      return {
        active: true,
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
      showModal: function () {
        jQuery('.ui.mini.modal').modal('show');
      },
      hideModal: function () {
        jQuery('.ui.mini.modal').modal('hide');
      },

      printre: function () {
        console.log("printing stuff", arguments);
      },
      ...mapActions(['setSessionAction']),
      setAction(act){
        this.setSessionAction(act);

        this.$router.push({
          name: 'ChooseSP'
        });


      }
    },

    mounted() {

      this.setPageDesc("/app/selectAction","SelectAction");
      console.log("pageDesc",this.pageDesc);
      this.$store.commit('PAGE_VIEW',this.pageDesc);
      jQuery('.ui.mini.modal').modal();
      console.log("loaded select action")
    }
  }
</script>