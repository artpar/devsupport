<template>
  <div id="app" class="ui container">

    <div class="ui top attached menu">
      <router-link to="/">
        <div class="ui item">
          <i class="home icon"></i>
        </div>
      </router-link>
      <div class="right menu">
        <div class="ui right aligned category search item">
          <div class="ui transparent icon input">
            DevSupport.AI
          </div>
          <div class="results"></div>
        </div>
      </div>
    </div>
    <div class="ui bottom attached segment">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'devsupport-ai',
  };
</script>

<style>
  /* CSS */

  h1 {
    font-weight: 900;
    font-style: normal;
  }

  body {
    font-family: "Lato Medium";
    padding: 60px 0px;
    font-size: 20px;
    background-color: #eceeef;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  /* Everything but the jumbotron gets side spacing for mobile first views */
  .header,
  .marketing,
  .footer {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  /* Custom page header */
  .header {
    padding-bottom: 1rem;
    border-bottom: .05rem solid #e5e5e5;
  }

  /* Make the masthead heading the same height as the navigation */
  .header h3 {
    margin-top: 0;
    margin-bottom: 0;
    line-height: 3rem;
  }

  /* Custom page footer */
  .footer {
    padding-top: 1.5rem;
    color: #777;
    border-top: .05rem solid #e5e5e5;
  }

  /* Customize container */
  @media (min-width: 48em) {
    .container {
      max-width: 46rem;
    }
  }

  .container-narrow > hr {
    margin: 2rem 0;
  }

  /* Main marketing message and sign up button */
  .jumbotron {
    text-align: center;
    border-bottom: .05rem solid #e5e5e5;
  }

  .jumbotron .btn {
    padding: .75rem 1.5rem;
    font-size: 1.5rem;
  }

  /* Supporting marketing content */
  .marketing {
    margin: 3rem 0;
  }

  .marketing p + h4 {
    margin-top: 1.5rem;
  }

  /* Responsive: Portrait tablets and up */
  @media screen and (min-width: 48em) {
    /* Remove the padding we set earlier */
    .header,
    .marketing,
    .footer {
      padding-right: 0;
      padding-left: 0;
    }

    /* Space out the masthead */
    .header {
      margin-bottom: 2rem;
    }

    /* Remove the bottom border on the jumbotron for visual effect */
    .jumbotron {
      border-bottom: 0;
    }
  }


</style>
