<template>

  <div class="ui centered grid" style="margin-top: 20em;">

    <!--<div class="four wide column">-->
    <!--<a class="ui basic button">-->
    <!--<div @click="setAction('integrate')">-->
    <!--<i class="massive settings icon"></i>-->
    <!--&lt;!&ndash;<i class="material-icons inverted devcolordark" style="font-size: 150px; border-radius: 5%">widgets</i> <br/>&ndash;&gt;-->
    <!--<h1>Integrate</h1>-->
    <!--</div>-->
    <!--</a>-->
    <!--</div>-->


    <div class="ui massive primary buttons">
      <div class="ui button" @click="setAction('integrate')">
        <div>
          <i class="huge settings icon"></i>
          <!--<i class="material-icons inverted devcolordark" style="font-size: 150px; border-radius: 5%">widgets</i> <br/>-->
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
  import {mapActions} from 'vuex';
  export default {
    data() {
      return {
        active: true

        }
    },
    methods: {
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
      jQuery('.ui.mini.modal').modal();
      console.log("loaded select action")
    }
  }
</script>