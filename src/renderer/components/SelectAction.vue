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
      <button class="ui button"><div @click="setAction('integrate')">
        <i class="huge settings icon"></i>
        <!--<i class="material-icons inverted devcolordark" style="font-size: 150px; border-radius: 5%">widgets</i> <br/>-->
        <h2 class="light">Integrate</h2>
      </div></button>
      <div class="or"></div>
      <button class="ui button"><div @click="setAction('fix')">
        <i class="huge configure icon"></i>
        <h2 class="light">Fix</h2>
      </div></button>
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
    methods: {
      ...mapActions(['setSessionAction']),
      setAction(act){
        this.setSessionAction(act);

        this.$router.push({
          name: 'ChooseSP'
        });


      }
    },

    mounted() {
      console.log("loaded select action")
    }
  }
</script>