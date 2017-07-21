<template>
  <div class="content-wpr">


    <div class="form-input-wpr">
      <input placeholder="What do you want to integrate" v-model="message">
    </div>
    <div @click="integrate()" class="form-submit-wpr text-center" >
    <div class="cust-btn md">INTEGRATE</div>
    </div>
    <!--<autocomplete :suggestions="cities" :selection.sync="value" class="form-submit-wpr text-center"></autocomplete>-->
    <p>can you see this {{message}}</p>


    <!--**********************************************-->

    <!--<title>jQuery UI Autocomplete - Default functionality</title>-->
    <!--<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">-->
    <!--<link rel="stylesheet" href="/resources/demos/style.css">-->
    <!--<script src="https://code.jquery.com/jquery-1.12.4.js"></script>-->
    <!--<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>-->

    <div class="ui-widget">
      <label for="tags">Tags: </label>
      <input id="tags">
    </div>


    <!--**********************************************-->
  </div>
</template>
<script>
  export default {
    data(){
      return {
        message: ""
      }
    },
    methods: {
      name: 'chose-sp',
      integrate(){
        console.log("clicked button");
        console.log(this.message);

      }
    },
    mounted(){
      console.log(arguments)
    },
  }

</script>