<template>
<div class='loadingContainer'>
  <div class="cssload-container">
    <div class="cssload-zenith"></div>
  </div>
</div>
</template>
<script>
  export default {
    mounted() {
      console.log("loaded loading")
    }
  }
</script>
<style>
  .loadingContainer {
    height: 70vh;
  }
  .cssload-container {
    width: 100%;
    height: 144px;
    text-align: center;
  }

  .cssload-zenith {
    width: 144px;
    height: 144px;
    margin: 0 auto;
    border-radius: 50%;
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
    box-shadow: 9px 9px 3px rgb(0,0,0);
    animation: cssload-spin 1320ms infinite linear;
    -o-animation: cssload-spin 1320ms infinite linear;
    -ms-animation: cssload-spin 1320ms infinite linear;
    -webkit-animation: cssload-spin 1320ms infinite linear;
    -moz-animation: cssload-spin 1320ms infinite linear;
  }



  @keyframes cssload-spin {
    100%{ transform: rotate(360deg); transform: rotate(360deg); }
  }

  @-o-keyframes cssload-spin {
    100%{ -o-transform: rotate(360deg); transform: rotate(360deg); }
  }

  @-ms-keyframes cssload-spin {
    100%{ -ms-transform: rotate(360deg); transform: rotate(360deg); }
  }

  @-webkit-keyframes cssload-spin {
    100%{ -webkit-transform: rotate(360deg); transform: rotate(360deg); }
  }

  @-moz-keyframes cssload-spin {
    100%{ -moz-transform: rotate(360deg); transform: rotate(360deg); }
  }

</style>