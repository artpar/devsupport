<template>
  <div id="app" class="container">
    <div class="header clearfix">
      <nav>
        <ul class="nav nav-pills float-right">
          <li class="nav-item">
            <a class="nav-link active" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
        </ul>
      </nav>
      <h3 class="text-muted">DevSupport.AI</h3>
    </div>

    <div class="mt-1">
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
  body {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    padding: 60px 0px;
    background-color: rgb(220, 220, 220);
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
