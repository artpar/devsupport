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
  .padding-0{
    padding: 0px !important;
  }
  .border-none{
    border: none !important;
  }
  .list-nostyle{
    list-style: none;
    margin: 0px;
    padding: 0px;
  }
  .bg-fff{
    background: #fff !important;
  }
  .c-pointer{
    cursor: pointer;
  }
  .p-relative{
    position: relative;
  }
  .ellipsis{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
  }
  .float-none{
    float: none;
  }
  .pull-right{
    float: right;
  }
  .pull-left{
    float: left;
  }
  .text-left{
    text-align: left;
  }
  .text-center{
    text-align: center;
  }

  .cust-btn{
    text-align: center;
    color: #eee;
    border-radius: 8px;
    display: inline-block;
    background: #302d53;
    cursor: pointer;
    transition: 0.18s ease All;
    box-shadow: 0px 3.7px 6px 0px rgba(0, 0, 0, 0.26);
  }
  .cust-btn:hover {
    background: #343E6A;
    box-shadow: 0px 3.7px 6px 0px rgba(0, 0, 0, 0.26);
    transition: 0.18s ease All;
  }
  .cust-btn.sm{
    font-size: 16px;
    width: 112px;
    padding: 7px;
  }
  .cust-btn.md{
    width: 142px;
    padding: 10px;
  }
  .cust-btn.success{
    background: rgba(62,174,144,1);
  }
  .cust-btn.warn{
    background: rgba(250,107,78,1);
  }
  .cust-btn.warn:hover{
    background: #FF856A;
    box-shadow: 0px 3.7px 6px 0px rgba(0, 0, 0, 0.26);
    transition: 0.18s ease All;
  }

  .cust-input-wpr{
    text-align: center;
    width: 300px;
    margin: 5px 0;
    position: relative;
  }
  .cust-input-wpr>input{
    width: calc(100% - 20px);
    padding: 6px 10px;
    border: 1px solid rgba(33,28,61,1);
    border-radius: 4px;
    font-size: 16px;
  }
  .cust-input-wpr.lg{
    width: 500px !important;
  }
  .cust-input-wpr .validation{
    position: absolute;
    top: 0;
    right: 5px;
    padding: 3px;
    line-height: 0;
    border-radius: 50%;
    color: #eee;
    margin: 5px 0px;
  }
  .cust-input-wpr .validation>i{
    font-size: 16px;
    font-weight: 600;
  }
  .cust-input-wpr .validation.success{
    background: rgba(62,174,144,1);
  }
  .cust-input-wpr .validation.fail{
    background: rgba(250,107,78,1);
  }
  .validation-err{
    color: rgba(250,107,78,1);
    text-align: right;
    margin-top: 7px;
    font-size: 14px;
    font-weight: 500;
  }

  /*PAD-MARG*/
  .margin-bottom-10-px{
    margin-bottom: 10px;
  }
  .margin-bottom-50-px{
    margin-bottom: 50px !important;
  }
  .margin-bottom-20-px{
    margin-bottom: 20px;
  }
  /*Sidebar Global*/
  .tags{
    color: #fff;
    line-height: 17px;
    font-size: 11px;
    padding: 0 10px;
    border-radius: 2px;
  }
  .tags.PAYU{
    background: rgba(188,207,0,1);
  }
  .tags.CLEVERTAP{
    background: rgba(48,19,106,1)
  }
  /*Sidebar*/
  .sidebar-wpr{
    min-height: 1px;
    float: left;
    position: relative;
    width: 25%;
    height: 100vh;
    background: #fbfcfc;
  }

  /*Sidebar for screen 1*/
  .sidebar-wpr .sidebar-heading{
    padding: 0px 20px;
    margin-top: 30px;
    text-align: left;
    font-weight: 500;
    font-size: 23px;
    margin-bottom: 20px;
  }
  .sidebar-wpr .sidebar-recent-project{
    padding: 0pc 20px;
    height: calc(100vh - 90px);
    overflow-y: auto;
  }
  .sidebar-wpr .sidebar-recent-project .recent-project-item-wpr{
    border-bottom: 1px solid rgba(60,71,145,0.25);
    margin-bottom: 15px;
    padding-bottom: 10px;
    text-align: left;
  }
  .recent-project-item-wpr .title{
    font-size: 17px;
    font-weight: 700;
    color: rgba(56,58,99,1);
    line-height: 25px
  }
  .recent-project-item-wpr .path{
    font-size: 12px;
    color: rgba(118,118,118,1);
    padding-bottom: 8px
  }
  .recent-project-item-wpr .note{
    font-size: 12px;
    font-style: italic;
    color: rgba(118,118,118,1);
    font-weight: 500
  }
  /*Sidebar for screen 2 and more*/
  .sidebar-path{
    padding: 0px 20px;
  }
  .sidebar-path .content{
    background: rgba(56,58,99,1);
    border-radius: 5px;
    padding: 10px 20px;
    color: #fff;
    line-height: 30px;
    margin: 15px 0 30px 0;
    box-shadow: 0px 2.8px 6.5px 1px rgba(0,0,0,0.26);
    position: relative;
  }
  .sidebar-path .content .heading{
    font-weight: 600;
    font-size: 19px;
  }
  .sidebar-path .content .data{
    font-size: 13px;
  }
  .sidebar-path .content>i{
    position: absolute;
    top: 10px;
    right: 7px;
    color: #eeeeee;
  }
  .sidebar-path .close-sidebar-path{
    position: absolute;
    background: #302d53;
    color: #fff;
    border-radius: 50%;
    padding: 3px;
    right: 7px;
    top: 7px;
    line-height: 0;
  }
  .close-sidebar-path>i{
    font-size: 16px;
  }

  .sidebar-faq{
    padding: 0px 20px;
  }
  .sidebar-faq>.title{
    font-size: 23px;
    color: #383a63;
    font-weight: 500;
  }
  .sidebar-faq>.input{
    position: relative;
    padding: 10px 0px 20px 0px;
  }
  .sidebar-faq>.input>input{
    width: calc(100% - 22px);
    border: 1px solid;
    padding: 0 10px;
    border-radius: 5px;
    line-height: 43px;
    font-size: 16px;
  }
  .sidebar-faq>.input>i{
    position: absolute;
    top: 17px;
    right: 8px;
    font-size: 30px;
  }
  .sidebar-faq .content{
    height: calc(100vh - 235px);
    overflow-y: auto;
  }
  .sidebar-faq .content .content-item-wpr{
    border-bottom: 1px solid rgba(60,71,145,0.25);
    margin-bottom: 15px;
    padding-bottom: 10px;
    text-align: left;
  }
  .content-item-wpr>.title{
    font-size: 15px;
    font-weight: 700;
    color: rgba(56,58,99,1);
    line-height: 18px;
    padding-bottom: 5px;
  }
  .content-item-wpr>.fix{
    font-size: 12px;
    color: rgba(118,118,118,1);
    line-height: 14px;
  }
  .content-item-wpr>.note{
    padding-top: 5px;
  }
  .content-item-wpr>.note>.text{
    font-size: 12px;
    color: rgba(56,58,99,1);
    line-height: 20px;
    font-style: italic;
    font-weight: 400;
  }
  /*Content Global*/
  .content-wpr .dropable-input{

  }
  .close-content{
    position: absolute;
    background: #302d53;
    color: #fff;
    padding: 5px;
    border-radius: 50%;
    right: 15px;
    top: 15px;
    line-height: 0;
  }
  .home-content{
    position: absolute;
    background: #302d53;
    color: #fff;
    padding: 5px;
    border-radius: 50%;
    right: 15px;
    top: 15px;
    line-height: 0;
  }

  /*Content area*/
  .content-wpr{
    min-height: 1px;
    float: left;
    position: relative;
    width: 75%;
    height: 100vh;
    box-shadow: -5px 0px 20px 0px #ddd;
    overflow-y: auto;
  }
  .content-wpr>.super-coder{
    width: 58%;
    margin: 5vh auto 0 auto;
  }
  .super-coder>img{
    width: 100%;
  }
  /*for screen 1*/
  .get-source-folder{
    width: 80%;
    margin: auto;
    text-align: center;
  }
  .get-source-folder .heading{
    font-size: 20px;
    color: rgba(33,28,61,1);
    font-weight: 500;
  }
  .get-source-folder .box{
    padding: 30px;
    margin: 20px 0px;
    border: 1px dashed rgba(33,28,61,0.7);
    border-radius: 5px;
  }
  .get-source-folder .box .message{
    font-size: 14px;
    font-weight: 300;
    color: rgba(33,28,61,1);
  }

  /*for screen 2*/
  .content-wpr>.task-list{
    width: 50%;
    margin: auto;
  }
  .content-wpr>.task-list>div{
    color: #eee;
    background: rgb(58, 103, 138);
    width: 150px;
    height: 120px;
    text-align: center;
    border-radius: 10px;
    padding: 10px 0;
  }
  .content-wpr>.task-list img{
    display: block;
    width: 80px;
    margin: 5px auto 10px auto;
  }
  .form-input-wpr{
    text-align: center;
    margin-top: 35vh;
  }
  .form-input-wpr>div {
    width: 80%;
    padding: 15px 18px;
    border: 1px solid rgba(33,28,61,1);
    border-radius: 4px;
    font-size: 16px;
  }
  .form-submit-wpr{
    text-align: center;
    margin-top: 5vh;
  }

  /*Popup to get payU credentials*/
  .popup-mask{
    position: absolute;
    background: rgba(0,0,0,0);
    z-index: 50;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .investigate-popup{
    background: rgba(250,250,250,1);
    position: absolute;
    width: 60%;
    display: block;
    margin: auto;
    padding: 20px 40px;
    top: 0;
    box-shadow: 0px 2px 23px 0px rgba(212,212,212,1);
    margin-left: calc(20% - 40px);
    margin-top: calc(50vh - 175px);
    /*height: 320px;*/
    z-index: 80;
  }
  .investigate-popup .close-content>i{
    font-size: 16px;
  }

  .get-cred-popup-wpr>.title{
    font-size: 18px;
    font-weight: 500;
    margin-top: 25px;
  }
  .get-cred-popup-wpr p{
    font-size: 14px;
  }
  .get-cred-popup-wpr input{
    width: 50%;
    padding: 5px 10px;
    border: 1px solid rgba(33,28,61,1);
    border-radius: 4px;
    font-size: 14px;
    margin: 5px 0 10px 0;
  }
  .get-cred-popup-wpr .login-wpr{
    margin-top: 15px;
    text-align: center;
  }

  .activity-popup-wpr{
    font-weight: 500;
  }
  .activity-popup-wpr>.title{
    padding-top: 25px;
  }
  .activity-popup-wpr>ul{
    margin: 20px 0 0 30px;
  }
  .activity-popup-wpr>ul>li{
    padding: 5px 0px;
  }
  .activity-popup-wpr>ul>li>span{
    padding-left: 20px;
  }
  .activity-popup-wpr .new-activity-text{
    width: 60%;
    text-align: center;
    margin-top: 30px;
    font-weight: 700;
    margin-bottom: 25px;
  }
  .activity-popup-wpr .activity-next{
    margin-top: 25px;
  }

  .host-file-wpr>.heading{
    margin-top: 15px;
    font-weight: 500;
    font-size: 16px;
    width: 80%;
    line-height: 22px
  }
  .host-file-wpr>.note{
    font-size: 13px;
    margin-top: 10px;
  }
  .host-file-wpr .text{
    font-size: 15px;
    vertical-align: super;
  }
  .host-file-wpr .form-wpr{
    font-weight: 600;
  }
  .host-file-wpr .form-wpr .cloud-download{
    margin-left: 10px;
  }
  .host-file-wpr .download-host{
    margin-top: 45px;
  }

  /*Integration Progress preview screen 21*/
  .int-progress{
    width: 80%;
    margin: auto;
    margin-top: 15vh;
  }
  .int-progress .title{
    font-size: 21px;
    font-weight: 600;
  }
  .int-progress .sub-title{
    font-size: 17px;
    font-weight: 500;
    margin: 10px 0 20px 0;
  }
  .int-progress .progress-bar-wpr{
    margin: 20px 0 25px 0;
    border: 1px solid;
    border-radius: 15px;
  }
  .int-progress .progress-bar-wpr>.bar{
    width: 1%;
    height: 10px;
    background: rgba(62,174,144,1);
    margin: 4px;
    border-radius: 5px;
  }
  .int-progress .actions-list{
    margin: 0px;
    padding: 0px;
    width: 65%;
    min-width: 450px;
  }
  .int-progress .actions-list>li>span{
    color: rgba(118,118,118,1);
    line-height: 28px;
  }
  .int-progress .actions-list>li>.done-text{
    float: right;
    font-weight: 500;
  }

  /*Integration DONE preview screen 22*/
  .launch-box-wpr{
    height: 200px;
    width: 80%;
    border-radius: 6px;
    border: 1px solid #d0d0d0;
    margin: 30px auto 20px auto;
  }
  .launch-img-wpr{
    min-height: 1px;
    float: left;
    position: relative;
    width: 30%;
    height: 100%;
  }
  .launch-img-wpr>img{
    margin: 13% 10% 10% 20%;
  }
  .launch-content-wpr{
    min-height: 1px;
    float: left;
    position: relative;
    width: 70%;
    height: 100%;
    font-weight: 500;
  }
  .launch-content-wpr .heading{
    color: rgb(33, 28, 61);
    font-size: 23px;
    margin-top: 30px;
    padding-left: 25px;
  }
  .launch-content-wpr .sub-heading{
    color: rgb(33, 28, 61);
    font-size: 17px;
    margin-top: 10px;
    padding-left: 50px;
  }
  .launch-content-wpr .feedback{
    color: rgb(60, 71, 145);
    font-size: 21px;
    margin-top: 30px;
  }
  .launch-content-wpr .feedback>div{
    margin-left: 20px;
  }
  .launch-content-wpr .note{
    color: rgb(33, 28, 61);
    font-size: 12px;
    padding-left: 50px;
    margin-top: 10px;
  }

  </style>