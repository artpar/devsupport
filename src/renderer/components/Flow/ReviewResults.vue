<template>
  <div class="ui grid" style="padding: 0 5em">

    <!--result page begins-->

    <div class="sixteen wide column "><h1>Results</h1>
      <div class="ui large bottom aligned divided relaxed animated list">
        <template v-for="liveChange in Project.changes">
          <div class="ui fluid item">
            <div class="content"><!--<i class="info circle aligned primary icon"></i>-->
              {{liveChange.change.name}}
              <i v-if="liveChange.change.status=='Completed'" class="right floated large checkmark green icon"></i>
              <i v-else="" class="right floated large warning circle orange icon"></i>
            </div>
          </div>
        </template>
      </div>
      <br/>
      <div class="ui segment">
        <img class="ui top aligned left floated image" style="margin-top: 6%" src="~@/images/launch.png"/>
        <div class="ui center aligned basic segment"><span class="devcolor" style="font-size: 22px"> Integration should be done now<br><br></span>
          <span style="font-size: 16px">You can now build and run the project<br><br></span>
          <span style="font-size: 20px; margin:1em">Did it help?</span>
          <button class="ui primary button" style="margin: 1em" @click="feedback('yes')">Yes</button>
          <button class="ui orange button" style="margin: 1em" @click="feedback('no')">No</button>
          <span><br>We are collecting this information for our feedback</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex';

  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState(['Project'])
    },
    mounted() {
      console.log("entered review results")

    },
    methods: {
      feedback(answer) {
        this.$store.commit('GA_EVENT', getEventDesc("feedBack", answer, "did it help?"));
        this.$store.commit('PAGE_VIEW', getPageDesc("/app", "home"));
        this.reset();

      },
      reset() {
        this.setProjectDir({
          projectDir: null
        });
        this.setSessionAction(null);
        this.$router.push({
          name: "select-project"
        })
      },
    }
  }
</script>