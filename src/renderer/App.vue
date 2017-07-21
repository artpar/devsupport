<template>
  <div id="app" class="ui container fluid">

    <div class="ui grid">

      <recent-projects></recent-projects>

      <div class="twelve wide column">
        <div class="row">
          <div class="ui menu">
            <div class="right menu">
              <a @click="goHome" class="item">Back</a>
            </div>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>


  </div>
</template>

<script>

  import RecentProjects from './components/RecentProjects.vue'

  export default {
    components: {
      'recent-projects': RecentProjects
    },
    methods: {
      goHome() {
        this.$router.push({
          name: 'landing-page'
        })
      },
    },
    mounted() {
      console.log("projects",  app.getPath)
    },
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