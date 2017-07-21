<template>

  <div class="content-wpr">
    <div class="form-input-wpr">
      <el-select v-model="selectedSP" filterable remote placeholder="What do you want to integrate"
                 :remote-method="remoteMethod" :loading="loading">
        <el-option
          v-for="item in options4"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div @click="integrate()" class="form-submit-wpr text-center">
      <div class="cust-btn md">INTEGRATE</div>
    </div>
    <p>selected sp: {{selectedSP}}</p>
  </div>

</template>
<script>
  import jsonApi from '../plugins/jsonApi';

  export default {
    data(){
      return {
        options4: [],
        selectedSP: "",
        list: [],
        loading: false,
        newsp: [],
        newspId:[],
        message: "",
      }
    },
    methods: {
      name: 'chose-sp',
      integrate(){
        let that = this;
        console.log("clicked button");
        console.log(this.message);
        this.$router.push({
          name: 'Integrate', params: {id: this.selectedSP}
        })

      },
      remoteMethod(query) {
        console.log("input box active");
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options4 = this.list.filter(item => {
              return item.label.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
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
        let newsp = [];
        let newspId=[];
        for (let i = 0; i < r.length; i++) {
          newsp[i] = r[i];
          console.log("in the loop");
        }
        console.log(r[0].name, "what");
        console.log("value of i and r", r.length, r);

        that.newsp = newsp;
        console.log("something", newsp, that.newsp);
      }).then(function () {
        that.list = that.newsp.map(item => {
          return {value: item.reference_id, label: item.name};


        })

      });


    }
  }

</script>