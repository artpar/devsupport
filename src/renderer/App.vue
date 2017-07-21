<template>
  <div id="app" class="ui container fluid">

    <div class="ui grid">
      <div class="four wide column">

        <h1>Recent Projects</h1>

        <div class="column">
          <div class="ui block header">
            <i class="folder icon"></i>
            <div class="content">
              My awesome project
              <div class="sub header">Android - LazyPay</div>
            </div>
          </div>
        </div>
      </div>

      <div class="twelve wide column">
        <router-view></router-view>
      </div>
    </div>


  </div>
</template>

<script>

  export default {
    name: 'devsupport-ai',
  };
</script>

<style>

  body {
    padding: 20px;
  }

  h1, h2, h3, h4 {
    color: #3d668d;
  }
</style>