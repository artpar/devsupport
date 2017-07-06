<template>
  <div class="ui one column grid">
    <div v-if="Project" class="ui column">
      <el-steps :space="100" direction="vertical" :active="2">
        <el-step title="Project location">
          <div slot="description">
            <h5>{{Project.projectDir}}</h5>
          </div>
        </el-step>
        <el-step title="Choose integration">
          <div slot="description">
            <ul class="event-list">


              <li>
                <time datetime="2017-07-01">
                  <span class="day">1</span>
                  <span class="month">Jul</span>
                  <span class="year">2017</span>
                  <span class="time">ALL DAY</span>
                </time>
                <span style="font-size: 120px; float: left; width: 120px; color: #a4c639;" class="devicon devicon-android-plain"></span>
                <div class="info">
                  <h3 class="title">
                    <router-link :to="{name: 'Integrate', params: {name: 'lazyPayAndroid'}}">LazyPay Android Integration
                    </router-link>
                  </h3>
                  <p class="desc">Complete payment flow</p>
                </div>
              </li>

              <li>
                <time datetime="2017-07-05">
                  <span class="day">5</span>
                  <span class="month">Jul</span>
                  <span class="year">2017</span>
                  <span class="time">ALL DAY</span>
                </time>
                <span style="font-size: 120px; float: left; width: 120px; color: #8892bf;" class="devicon devicon-php-plain"></span>
                <div class="info">
                  <h3 class="title">
                    <router-link :to="{name: 'Integrate', params: {name: 'lazyPayPHP'}}">LazyPay PHP Integration
                    </router-link>
                  </h3>
                  <p class="desc">Credit Card Payment Integration</p>
                </div>
              </li>


            </ul>
          </div>
        </el-step>
      </el-steps>

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