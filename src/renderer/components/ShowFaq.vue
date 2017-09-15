<template>
  <div class="ui centered grid">
    <div class="ui fifteen wide column grid">
      <div class="ui grid" style="margin-bottom: 1em;">
        <div class="ui fourteen wide column left floated">
          <h3 style="font-size: 20px">{{faq.question_content}}</h3>
        </div>
        <div class="ui two wide column right floated">
          <div class="devblue">
            <span style="background: #ececed; border-radius: 2px; padding: 4px;"><i class="material-icons" style="vertical-align: middle; font-size: 18px;">check_box</i> {{faq.help_count}}</span>
          </div>
        </div>
      </div>
      <div class="devblue" style="line-height: 1.5em;">
        <div v-html="faq.answer_content"></div>
        <br>

      </div>

      <div class="ui message">
        <div class="devblue" style="line-height: 1.5em; font-size: 14px" v-html="faq.answer_box_content">

        </div>

      </div>
      <div class="ui centered grid" style="margin-top: 30px">

        <span
            style="color:#383a63; font-size: 16px; font-weight: 600; margin:1em; vertical-align: middle">Did it help?</span>
        <button class="ui secondary small button" style="margin: 1em" @click="feedback('yes')">Yes</button>
        <button class="ui orange small button" style="margin: 1em" @click="feedback('no')">No</button>
      </div>

    </div>
  </div>
</template>
<script>
  import jsonApi from "../plugins/jsonApi"
  export default {
    data() {
      return {
        faq: null
      }
    },
    methods: {
      feedback(value) {
        console.log("he clicked", value);
      },
      updateFaq() {
        var that = this;
        let faqId = this.$route.params.faq_id;
        console.log("load faq", faqId);
        jsonApi.one("faq", faqId).get().then(function(res){
          console.log("faq", res);
          that.faq = res;
        })
      }
    },
    mounted() {
      console.log("mounted function executed")
      this.updateFaq();
    },
    watch: {
      '$route.params.faq_id': function() {
        console.log("faq changed", arguments);
        this.updateFaq();
      }
    }
  }

</script>