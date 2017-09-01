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
        <div class="ui basic segment">
          <div class="ui basic segment">
        <div class="ui centered grid">
            <div class="ui left floated"><img src="~@/images/launch.png"/></div>
            <div class="ui right floated">
          <span class="devblue" style="font-size: 22px"> Integration should be done now<br><br></span>
          <span class="devblue" style="font-size: 16px">You can now build and run the project<br><br></span>
          <span style="color:#383a63; font-size: 20px; margin:1em">Did it help?</span>
          <button class="ui secondary button" style="margin: 1em" @click="feedback('yes')">Yes</button>
          <button class="ui orange button" style="margin: 1em" @click="feedback('no')">No</button>
          <span><br>We are collecting this information for our feedback</span>
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import {mapActions} from 'vuex'


  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState(['Project'])
    },
    mounted() {
      console.log("entered review results")

      !function() {
        var t;
        if (t = window.driftt = window.drift = window.driftt || [], !t.init) return t.invoked ? void (window.console && console.error && console.error("Drift snippet included twice.")) : (t.invoked = !0,
            t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ],
            t.factory = function(e) {
              return function() {
                var n;
                return n = Array.prototype.slice.call(arguments), n.unshift(e), t.push(n), t;
              };
            }, t.methods.forEach(function(e) {
          t[e] = t.factory(e);
        }), t.load = function(t) {
          var e, n, o, i;
          e = 3e5, i = Math.ceil(new Date() / e) * e, o = document.createElement("script"),
              o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + i + "/" + t + ".js",
              n = document.getElementsByTagName("script")[0], n.parentNode.insertBefore(o, n);
        });
      }();
      drift.SNIPPET_VERSION = '0.3.1';
      drift.load('25zu48kkhgdg');

    },
    methods: {
      ...mapActions(['setProjectDir', 'setSessionAction']),
      feedback(answer) {
        this.$store.commit('GA_EVENT', getEventDesc("feedBack", answer, "did it help?"));
        this.$store.commit('PAGE_VIEW', getPageDesc("/app", "home"));

        if (answer == "yes") {
          window.drift.hide();
          this.reset();
        } else {
          window.drift.api.showWelcomeMessage()
        }
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