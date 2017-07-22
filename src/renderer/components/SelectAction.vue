<template>

  <div class="ui centered grid" style="    margin-top: 10em;">
    <div class="six wide column">
      <a>
      <div @click="setAction('integrate')">
        <i class="material-icons inverted devcolor" style="font-size: 150px; border-radius: 5%">widgets</i> <br/>
        <h1 style="text-transform: uppercase">Integrate</h1>
      </div>
      </a>


    </div>

    <div class="six wide column">
      <div @click="setAction('fix')">
        <i class="material-icons inverted devcolor" style="font-size: 150px; border-radius: 5%">build</i> <br/>
        <h1 style="text-transform: uppercase">Fix</h1>
      </div>
    </div>
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