<template>
  <div class="ui  grid">
    <div v-if="Project" class="sixteen wide column">


      <div class="ui ordered steps">
        <div class="completed step">
          <div class="content">
            <div class="title">
              Project Source
            </div>
            <div slot="description">
              {{Project.projectDir}}
            </div>
          </div>
        </div>
        <div class="step" title="Choose integration">
          <div class="content">
            <div class="title">
              Choose integration
            </div>
          </div>
        </div>
        <div class="step" title="Review and execute">
          <div class="content">
            <div class="title">
              Review and execute
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="sixteen wide column">

     <div class="ui cards">
       <div class="ui card">
         <div class="image">
              <span style="float: left; color: #1fa67a; font-size: 75px;"
                    class="ui image devicon devicon-android-plain"></span>

         </div>
         <div class="content">

           <a class="header">
             LazyPay - Android
           </a>
           <div class="description">
             <div class="ui list">
               <div class="item">Credit card payment flow</div>
               <div class="item">OTP auto read</div>
               <div class="item">Lazypay wallet flow</div>
             </div>
           </div>
         </div>
         <div class="extra content">
           <div class="ui one buttons">
             <router-link class="ui basic green button" :to="{name: 'Integrate', params: {name: 'lazyPayAndroid'}}">
               Begin
             </router-link>
           </div>
         </div>

       </div>

       <div class="ui card">
         <div class="image">
              <span style="float: left; color: #5C6BC0; font-size: 75px;"
                    class="ui image devicon devicon-php-plain"></span>

         </div>
         <div class="content">

           <a class="header">
             LazyPay - PHP
           </a>
           <div class="description">
             <div class="ui list">
               <div class="item">Server side response handler</div>
               <div class="item">Hash verification</div>
               <div class="item">Hash generation</div>
             </div>
           </div>
         </div>
         <div class="extra content">
           <div class="ui one buttons">
             <router-link class="ui basic green button" :to="{name: 'Integrate', params: {name: 'lazyPayPHP'}}">
               Begin
             </router-link>
           </div>
         </div>

       </div>

     </div>

    </div>

  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import {mapActions} from 'vuex';
  export default {
    mounted() {
      console.log("started integration selection")
    },
    methods: {
      ...mapActions(['setIntegration']),
      chooseIntegration(inte){
        this.setIntegration(inte);
        this.$router.push({
          name: 'Integrate',
          params: {
            name: 'lazyPayAndroid'
          }
        })
      },
    },
    computed: {
      ...mapState(['Project'])
    }
  }
</script>
<style>
  .event-list {
    list-style: none;
    font-family: 'Lato', sans-serif;
    margin: 0px;
    padding: 0px;
  }

  .event-list > li {
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 0px 5px rgb(51, 51, 51);
    box-shadow: 0px 0px 5px rgba(51, 51, 51, 0.7);
    padding: 0px;
    margin: 0px 0px 20px;
  }

  .event-list > li > time {
    display: inline-block;
    width: 100%;
    color: rgb(255, 255, 255);
    background-color: rgb(197, 44, 102);
    padding: 5px;
    text-align: center;
    text-transform: uppercase;
  }

  .event-list > li:nth-child(even) > time {
    background-color: rgb(165, 82, 167);
  }

  .event-list > li > time > span {
    display: none;
  }

  .event-list > li > time > .day {
    display: block;
    font-size: 56pt;
    font-weight: 100;
    line-height: 1;
  }

  .event-list > li time > .month {
    display: block;
    font-size: 24pt;
    font-weight: 900;
    line-height: 1;
  }

  .event-list > li > img {
    width: 100%;
  }

  .event-list > li > .info {
    padding-top: 5px;
    text-align: center;
  }

  .event-list > li > .info > .title {
    font-size: 18pt;
    line-height: 40px;
    font-weight: 700;
    margin: 0px;
  }

  .event-list > li > .info > .desc {
    font-size: 13pt;
    font-weight: 300;
    margin: 0px;
  }

  .event-list > li > .info > ul,
  .event-list > li > .social > ul {
    display: table;
    list-style: none;
    margin: 10px 0px 0px;
    padding: 0px;
    width: 100%;
    text-align: center;
  }

  .event-list > li > .social > ul {
    margin: 0px;
  }

  .event-list > li > .info > ul > li,
  .event-list > li > .social > ul > li {
    display: table-cell;
    cursor: pointer;
    color: rgb(30, 30, 30);
    font-size: 11pt;
    font-weight: 300;
    padding: 3px 0px;
  }

  .event-list > li > .info > ul > li > a {
    display: block;
    width: 100%;
    color: rgb(30, 30, 30);
    text-decoration: none;
  }

  .event-list > li > .social > ul > li {
    padding: 0px;
  }

  .event-list > li > .social > ul > li > a {
    padding: 3px 0px;
  }

  .event-list > li > .info > ul > li:hover,
  .event-list > li > .social > ul > li:hover {
    color: rgb(30, 30, 30);
    background-color: rgb(200, 200, 200);
  }

  .facebook a,
  .twitter a,
  .google-plus a {
    display: block;
    width: 100%;
    color: rgb(75, 110, 168) !important;
  }

  .twitter a {
    color: rgb(79, 213, 248) !important;
  }

  .google-plus a {
    color: rgb(221, 75, 57) !important;
  }

  .facebook:hover a {
    color: rgb(255, 255, 255) !important;
    background-color: rgb(75, 110, 168) !important;
  }

  .twitter:hover a {
    color: rgb(255, 255, 255) !important;
    background-color: rgb(79, 213, 248) !important;
  }

  .google-plus:hover a {
    color: rgb(255, 255, 255) !important;
    background-color: rgb(221, 75, 57) !important;
  }

  @media (min-width: 768px) {
    .event-list > li {
      position: relative;
      display: block;
      width: 100%;
      height: 120px;
      padding: 0px;
    }

    .event-list > li > time,
    .event-list > li > img {
      display: inline-block;
    }

    .event-list > li > time,
    .event-list > li > img {
      width: 120px;
      float: left;
    }

    .event-list > li > .info {
      background-color: rgb(245, 245, 245);
      overflow: hidden;
    }

    .event-list > li > time,
    .event-list > li > img {
      width: 120px;
      height: 120px;
      padding: 0px;
      margin: 0px;
    }

    .event-list > li > .info {
      position: relative;
      height: 120px;
      text-align: left;
      padding-right: 40px;
    }

    .event-list > li > .info > .title,
    .event-list > li > .info > .desc {
      padding: 0px 10px;
    }

    .event-list > li > .info > ul {
      position: absolute;
      left: 0px;
      bottom: 0px;
    }

    .event-list > li > .social {
      position: absolute;
      top: 0px;
      right: 0px;
      display: block;
      width: 40px;
    }

    .event-list > li > .social > ul {
      border-left: 1px solid rgb(230, 230, 230);
    }

    .event-list > li > .social > ul > li {
      display: block;
      padding: 0px;
    }

    .event-list > li > .social > ul > li > a {
      display: block;
      width: 40px;
      padding: 10px 0px 9px;
    }
  }
</style>