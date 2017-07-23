<template>

  <div class="ui centered grid" style="    margin-top: 10em;">
    <div class="sixteen wide column">
      <el-select style="width: 100%; height: 100px" size="large" v-model="selectedSP" filterable remote
                 placeholder="What do you want to integrate"
                 :remote-method="remoteMethod" :loading="loading">
        <el-option
            v-for="item in options4"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="four wide column">
      <button @click="integrate()" class="ui huge button background devcolordark">INTEGRATE</button>
    </div>

  </div>


</template>
<script>
  import jsonApi from '../plugins/jsonApi';
  import {Notification} from 'element-ui';

  export default {
    data(){
      return {
        options4: [],
        selectedSP: "",
        list: [],
        loading: false,
        newsp: [],
        newspId: [],
        message: "",
      }
    },
    methods: {
      name: 'chose-sp',
      integrate(){
        let that = this;
        console.log("clicked button");
        console.log(this.message);

        if (that.selectedSP == "") {
          that.$alert({
            type: 'error',
            message: "Please select a merchant to integrate"
          });
          return
        }

        this.$router.push({
          name: 'SelectIntegration',
          params: {
            id: that.selectedSP
          }
        })


      },
      remoteMethod(query) {
        console.log("input box active");
        if (query !== '') {
          this.loading = true;
          this.options4 = this.list.filter(item => {
            return item.name.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
          });
          this.loading = false;

        } else {
          this.options4 = [];
        }
      }
    },
    mounted(){
      let that = this;

      jsonApi.findAll("merchant", {
        page: {number: 1, size: 50}
      }).then(function (r) {

        that.list = r;
      });


    }
  }

</script>