<template>
  <div class="ui grid" style="padding: 0 5em">

    <!--result page begins-->

    <div class="sixteen wide column "><h1>Results</h1>
      <br/>
      <div class="ui segment">
        <div class="ui basic segment">
          <div class="ui basic segment">
            <div class="ui centered grid">


              <!--for php-->
              <!--<template v-if="Project.integration==='0b0c8aa9-68c9-4fdc-bff4-e7e1163d530c'">-->
                <!--<div class="ui right floated">-->
                  <!--<h3 style="font-size: 16px;"> Hey, you just completed PHP integration!</h3>-->
                  <!--<span class="devblue" style="font-size: 16px">You are few seconds away from  accepting payments with Instamojo :)<br></span>-->

                  <!--<div class="ui divider"></div>-->


                  <!--&lt;!&ndash;<h3 style="font-size: 16px;">New Transaction URL</h3>&ndash;&gt;-->
                  <!--&lt;!&ndash;<span class="devblue">&ndash;&gt;-->
                  <!--&lt;!&ndash;{{Project.contextMap.new_transaction_url}}<br></span>&ndash;&gt;-->

                  <!--<textarea id="urlCopy"-->
                            <!--style="position: absolute; left: -999em;">{{Project.contextMap.new_transaction_url}}</textarea>-->

                  <!--<button v-if="Project.currentProject.identification.stack ==='android'"-->
                          <!--class="ui animated secondary button" style="margin-top: 1.4em; margin-bottom: 1.2em"-->
                          <!--@click="resultStartIntegration('cb8c902e-b4d0-49de-a416-358bc4771487')">-->
                    <!--<div class="visible content">-->
                      <!--<i class="android icon" style="font-size: 1.3em;"></i>-->
                      <!--Go to Android Integration-->
                    <!--</div>-->
                    <!--<div class="hidden content">-->
                      <!--<i class="right arrow icon" style="font-size: 1.3em;"></i>-->
                    <!--</div>-->
                  <!--</button>-->


                <!--</div>-->
              <!--</template>-->


              <!--for android  {{Project.changes}} -->
              <!--<template v-else-if="Project.integration ==='cb8c902e-b4d0-49de-a416-358bc4771487'">-->
                <!--<div class="ui right floated">-->
                  <!--<h3 class="devblue" style="font-size: 16px; font-weight: 700">Hey, your Android integration is-->
                    <!--done!</h3>-->
                  <!--<div class="ui divider"></div>-->
                  <!--<br>-->
                  <!--<div class="devblue" style="font-size: 16px;">Here's what you need to do in your-->
                    <!--<b>-->
                      <!--{{Project.changes[2].selectedFilePath.split('/')[Project.changes[2].selectedFilePath.split('/').length-->
                       <!-- - 1]}}-->

                    <!--</b>-->
                    <!--<br>-->
                    <!--<div style="margin-top: 0.5em; margin-bottom: 1em;">-->
                      <!--<b>callInstamojopay(email,phone,amount,purpose,buyername);</b></div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</template>-->


              <!--old box content-->
              <template v-if="Project.reviewResultContent == null">
                <div class="ui left floated"><img src="~@/images/launch.png"/></div>
                <div class="ui right floated">
                  <span class="devblue" style="font-size: 22px"> Integration should be done now<br><br></span>
                  <span class="devblue" style="font-size: 16px">You can now build and run the project<br><br></span>
                  <span style="color:#383a63; font-size: 20px; margin:1em">Did it help?</span>
                  <button class="ui secondary button" style="margin: 1em" @click="feedback('yes')">Yes</button>
                  <button class="ui orange button" style="margin: 1em" @click="feedback('no')">No</button>
                  <span><br>We are collecting this information for our feedback</span>
                </div>
              </template>

              <template v-else>
                <div v-html="Project.reviewResultContent"></div>
                <button v-for="nextIntegration in Project.nextIntegrations"
                        v-if="Project.currentProject.identification.stack === nextIntegration.stack"
                        class="ui animated secondary button" style="margin-top: 1.4em; margin-bottom: 1.2em"
                        @click="resultStartIntegration(nextIntegration.id)">
                  <div class="visible content">
                    <i class="android icon" style="font-size: 1.3em;"></i>
                    Go to Android Integration
                  </div>
                  <div class="hidden content">
                    <i class="right arrow icon" style="font-size: 1.3em;"></i>
                  </div>
                </button>
              </template>

            </div>
          </div>
        </div>
      </div>
      <br/>
      <div class="ui segment">
        <h3 class="devblue" style="font-size: 16px; font-weight: 700">Your feedback is valuable to us.</h3>
        <div class="ui star rating" data-rating="5" data-max-rating="5"></div>
        <form class="ui tiny reply form">
          <div class="field">
            <textarea id="feedback_ta" v-model="feedback_content"></textarea>
          </div>
          <div class="ui blue labeled submit icon button" @click="submitFeedback()">
            <i class="icon edit"></i> Submit
          </div>
        </form>
      </div>

      <!--&lt;!&ndash;this is checklist of changes on ui&ndash;&gt;-->
      <!--<div class="ui large bottom aligned divided relaxed animated list">-->
      <!--<template v-for="liveChange in Project.changes">-->
      <!--<div class="ui fluid item">-->
      <!--<div class="content">&lt;!&ndash;<i class="info circle aligned primary icon"></i>&ndash;&gt;-->
      <!--{{liveChange.change.name}}-->
      <!--<i v-if="liveChange.change.status=='Completed'" class="right floated large checkmark green icon"></i>-->
      <!--<i v-else="" class="right floated large warning circle orange icon"-->
      <!--v-bind:data-content="liveChange.error"></i>-->
      <!--</div>-->
      <!--</div>-->
      <!--</template>-->
      <!--</div>-->

      <div id="snackbar">New Transaction Url Copied</div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import {mapActions} from 'vuex'
  import jsonApi from '../../plugins/jsonApi'


  export default {
    data() {
      return {
        feedback_content: "",
        notsubmitted: true
      }
    },
    computed: {
      ...mapState(['Project'])
    },
    mounted() {
      console.log("entered review results")

      jQuery('.ui.rating')
        .rating();

      !function () {
        var t;
        if (t = window.driftt = window.drift = window.driftt || [], !t.init) return t.invoked ? void (window.console && console.error && console.error("Drift snippet included twice.")) : (t.invoked = !0,
            t.methods = ["identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on"],
            t.factory = function (e) {
              return function () {
                var n;
                return n = Array.prototype.slice.call(arguments), n.unshift(e), t.push(n), t;
              };
            }, t.methods.forEach(function (e) {
            t[e] = t.factory(e);
          }), t.load = function (t) {
            var e, n, o, i;
            e = 3e5, i = Math.ceil(new Date() / e) * e, o = document.createElement("script"),
              o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + i + "/" + t + ".js",
              n = document.getElementsByTagName("script")[0], n.parentNode.insertBefore(o, n);
          });
      }();
      drift.SNIPPET_VERSION = '0.3.1';
      drift.load('25zu48kkhgdg');
      driftt.show();
      jQuery('.orange.icon').popup()
    },
    methods: {
      resultStartIntegration(integrationId) {
//        console.log("new transaction url ", newTxnUrl);

        console.log("start integration ", integrationId);
        this.setError(null);
        window.drift.hide();
        // this.copyText('urlCopy');
        // this.toast();

        // this.setSessionAction(null);
        let that = this;
        that.$router.push({
          name: 'ScanningFiles', params: {id: integrationId}
        });
      },
      copyText(id) {
        console.log("can you pritn this", id);
        var copyTextarea = document.querySelector('#' + id);
        copyTextarea.select();
        document.execCommand('copy');

        if (something != "not null") {

        }


      },
      toast() {
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () {
          x.className = x.className.replace("show", "");
        }, 1200);
      },
      ...mapActions(['setProjectDir', "setError", 'setSessionAction']),
      feedback(answer) {
        this.$store.commit('GA_EVENT', getEventDesc("feedBack", answer, "did it help?"));
        this.$store.commit('PAGE_VIEW', getPageDesc("/app", "home"));

        if (answer == "yes") {
          window.drift.hide();
          this.copyText('urlCopy');
          let that = this;
          setTimeout(function () {
            that.reset();
          }, 1000)
        } else {
          window.drift.api.showWelcomeMessage()
        }
      },
      submitFeedback() {
        let that = this;
        if (that.notsubmitted) {
          let rating = jQuery('.ui.rating').rating('get rating');


          console.log(rating);
          console.log("this is review:" + that.feedback_content + "\n");
          console.log(that.Project.userEmail);
          console.log("\n integration ID" + that.Project.integration);


          let payload = {
            user_email: that.Project.userEmail,
            feedback_content: that.feedback_content,
            rating: rating,
            integration_id: {
              id: that.Project.integration
            }
          }
          console.log("feedback payload", payload);
          jsonApi.create('feedback', payload).then(function (res) {
            console.log(res);
          });

          jQuery('.ui.rating').rating('disable');
          jQuery("#feedback_ta").prop("disabled", true);
          that.notsubmitted = false;


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