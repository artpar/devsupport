<template>
  <div class="ui centered grid">
    <div class="super-coder">
      <img src="~@/images/herofull.png" alt="image?">
    </div>

    <div class="task-list">
      <div class="pull-left c-pointer" @click="setAction('integrate')">
        <!--<i class="huge settings icon"></i>-->
        <img src="~@/images/integration_icon1.svg" height="60%"><br/><br>
        Integrate
      </div>
      <div class="pull-right c-pointer" @click="showModal()" @mouseover="active = true" @mouseleave="active = false">
        <img src="~@/images/fix_icon1.svg" height="60%">
        <!--<i class="huge configure icon"></i>-->
        <!--<h4 v-if="active">Coming Soon</h4>-->
        <!--<h4 v-else="active">Fix</h4>-->
        <br><br>Fix
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
  </div>
</template>
<script>
  import Analytics from 'universal-analytics';
  import {mapActions} from 'vuex';

  export default {
    data() {
      return {
        active: false,
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
      setPageDesc(path, title) {
        this.pageDesc.path = path;
        this.pageDesc.title = title;
      },
      getEventDesc(category, action, label) {
        this.eventDesc.category = category;
        this.eventDesc.action = action;
        this.eventDesc.label = label;
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
      setAction(act) {
        this.setSessionAction(act);

        this.$router.push({
          name: 'ChooseSP'
        });


      }
    },

    mounted() {
      console.log("pageDesc", getPageDesc("/app/selectAction", "SelectAction"));
      this.$store.commit('PAGE_VIEW', getPageDesc("/app/selectAction", "SelectAction"));
      jQuery('.ui.mini.modal').modal();
      console.log("loaded select action")
    }
  }
</script>