<template>
  <div class='ui centered grid'>
    <div class="loader">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
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
  .loader {
    margin-top: calc(40vh);
  }

  .line {
    animation: expand 1.2s infinite;
    border-radius: 1px;
    display: inline-block;
    transform-origin: center center;
    margin: 0 10px;
    width: 1px;
    height: 25px;
  }

  .line:nth-child(1) {
    background: #27ae60;
  }

  .line:nth-child(2) {
    animation-delay: 90ms;
    background: #27ae60;
  }

  .line:nth-child(3) {
    animation-delay: 180ms;
    background: #f1c40f;
  }

  .line:nth-child(4) {
    animation-delay: 270ms;
    background: #f1c40f;
  }
  .line:nth-child(5) {
    animation-delay: 360ms;
    background: #e67e22;
  }
  .line:nth-child(6) {
    animation-delay: 450ms;
    background: #e67e22;
  }
  .line:nth-child(7) {
    animation-delay: 540ms;
    background: #2980b9;
  }
  .line:nth-child(8) {
    animation-delay: 630ms;
    background: #2980b9;
  }

  @keyframes expand {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(2);
    }
  }


</style>