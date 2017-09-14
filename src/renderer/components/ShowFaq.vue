<template>
  <div class="ui centered grid">
    <div class="ui fifteen wide column grid">
      <div class="ui grid" style="margin-bottom: 1em;">
        <div class="ui fourteen wide column left floated">
          <h3 style="font-size: 20px">What kind of friend are you?</h3>
        </div>
        <div class="ui two wide column right floated">
          <div class="devblue" style="background: #ececed; border-radius: 2px; padding: 3px;">
            <i class="material-icons" style="vertical-align: middle; font-size: 18px;">remove_red_eye</i> 100000
          </div>
        </div>
      </div>
      <div class="devblue" style="line-height: 1.5em;">
        The product key is located inside the product packaging, on the receipt or confirmation page for a digital
        purchase or in a confirmation e-mail that shows you purchased Windows. If you purchased a digital copy from
        Microsoft Store, you can locate your product key in your Account under Digital Content.
        <br><br>Windows 7<br><br>
        The product key is located inside the box that the Windows DVD came in, on the DVD, on the receipt or
        confirmation page for a digital purchase or in a confirmation e-mail that shows you purchased Windows. If you
        purchased a digital copy from Microsoft Store, you can locate your product key in your Account under Digital
        Content.<br>

        <br>
        <span style="background: #ffeced; padding: 0.3em; color: #af6063; border-radius: 2px;">http://www.someurl.com</span>
      </div>
      <div class="ui message">
        <span class="devblue" style="line-height: 1.5em; font-size: 14px">
        Card no: 121231213<br>
        Mike: 123123123123<br>
        Moon: earth<br>
          Card no: 121231213
          </span>

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

      }
    }
  }

</script>