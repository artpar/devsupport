<template>
  <div class="ui centered grid">
    <div class="ui fifteen wide column grid">
      <div class="ui grid" style="margin-bottom: 1em;">
        <div class="ui fourteen wide column left floated">
          <h3 style="font-size: 20px">{{newfaq.question_content}}</h3>
        </div>
        <div class="ui two wide column right floated">
          <div class="devblue" style="background: #ececed; border-radius: 2px; padding: 3px;">
            <i class="material-icons" style="vertical-align: middle; font-size: 18px;">remove_red_eye</i> 100000
          </div>
        </div>
      </div>
      <div class="devblue" style="line-height: 1.5em;">
        <div v-html="newfaq.answer_content"></div>
        <br>

      </div>

      <div class="ui message">
        <div class="devblue" style="line-height: 1.5em; font-size: 14px" v-html="newfaq.answer_box_content">

          </div>

      </div>
      <div class="ui centered grid" style="margin-top: 30px">

      <span style="color:#383a63; font-size: 16px; font-weight: 600; margin:1em; vertical-align: middle">Did it help?</span>
      <button class="ui secondary small button" style="margin: 1em" @click="feedback('yes')">Yes</button>
      <button class="ui orange small button" style="margin: 1em" @click="feedback('no')">No</button>
      </div>

    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
//        faq: "this is empty"

      }
    },
    computed: {
      newfaq: function () {
        return this.$route.params.thisfaq;
        
      }

    },
    methods: {
      feedback(value){
        console.log("he clicked", value);
      }
    },
    mounted() {
      console.log("mounted function executed")
      var that = this;
//    this.faq = this.$route.params.thisfaq;
//      debugger
    }
  }

</script>