<template>

  <div class="ui column centered grid">
    <div class="super-coder">
      <img src="~@/images/superhero_home.png" alt="image?">
    </div>

    <div class="get-source-folder">
      <br>
      <!--<div class="heading">Before we start please enter your email so we can support you with issues</div>-->
      <div style="width: 80%" class="ui action input">
        <input type="text" v-model="userEmail" placeholder="Enter your email">
        <div class="ui secondary button" @click="goProjectSelection">Proceed</div>
      </div>


    </div>

    <div class="ui mini modal">
      <div class="header">
        <h3>Email not valid</h3>
      </div>
      <div class="content">
        <div class="description">
          Please enter a valid email address
        </div>
      </div>
      <div class="actions">
        <div class="ui secondary button" @click="errModal('hide')">OK</div>
      </div>
    </div>
  </div>


</template>
<script>


  export default {
    data() {
      return {
        "userEmail" : null

      }
    },
    methods: {
      errModal(action) {
        jQuery('.ui.mini.modal').modal(action);
      },

      goProjectSelection() {
         var that = this;
        console.log("button was clicked")

        var mailRegx =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isValidMail = mailRegx.test(that.userEmail);


        if(isValidMail){
          console.log("its valid mail");



//          this.$router.push({
//          name: 'select-project'
//        })
        }
        else {
          console.log("its not a valid mail")
          that.errModal("show");

        }

//        if(that.userEmail== null)
//        {console.log("email was null")}
//        else{
//
//        }
//
//
//        this.$router.push({
//          name: 'select-project'
//        })
      }
     },
    mounted() {
    }
  }
</script>