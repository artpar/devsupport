<template>
  <div class="ui centered grid" style="padding: 0 5em; margin-top: 10em;">
    <div class="sixteen wide column">

     <!--  <el-select 
        style="width: 100%; height: 100px; overflow: hidden" 
        size="large" 
        v-model="selectedSP" 
        filterable
        placeholder="What do you want to integrate"
        :loading="loading">
          <el-option style="overflow: hidden"
            v-for="item in list"
            :key="item.id"
            :label="item.name"
            :value="item">
          </el-option>
      </el-select> -->
      <h2>Product you'd like to integrate</h2>
      <el-select style="width: 100%; overflow: hidden; font-family: 'Raleway !important', sans-serif;"
                 size="large" v-model="selectedSP" filterable remote :value-key="'id'"
                 placeholder="Type in the name to look up"
                 :filter-method="remoteMethod" :loading="loading">
        <el-option
          v-for="item in options4"
          :key="item.id"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>

    </div>
    <div class="three wide column">
      <button @click="searchButton()" class="ui secondary button">SEARCH</button>
    </div>


    <!--Error modal-->
    <div class="ui mini modal">
      <div class="header">
        <h3>No Selection</h3>
      </div>
      <div class="content">
        <div class="description">
          Please select a merchant to integrate
        </div>
      </div>
      <div class="actions">
        <div class="ui secondary button" @click="errModal('hide')">OK</div>
      </div>
    </div>
  </div>
</template>

<script>
  import jsonApi from '../plugins/jsonApi';
  import {mapState} from 'vuex';
  import {mapActions} from 'vuex';
  import {Notification} from 'element-ui';

  export default {
    data(){
      return {
        options4: [],
        selectedSP: null,
        list: [],
        loading: false,
        newsp: [],
        newspId: [],
        lastQuery: "",
        message: "",
        pageDesc: [
          {
            path: null,
            title: null,
          }
        ],
        eventDesc: [
          {
            category: null,
            action: null,
            label: null,
          }
        ],
      }
    },
    methods: {
      ...mapActions(['setFaq']),
      reloadMerchantList() {
        let that = this;
        console.log("reload merchant list")

        jsonApi.findAll("merchant", {
          page: {number: 1, size: 50}
        }).then(function (r) {
          console.log("merchants",r);
          that.list = r;
          console.log("options4",that.list);
          if (that.list.length == 0) {
            this.$notify({
              type: 'warn',
              title: 'No providers',
              message: 'No providers are currently active'
            })
          }
        });
      },
      setPageDesc(path,title) {
        this.pageDesc.path=path;
        this.pageDesc.title=title;
      },
      getEventDesc(category, action, label) {
        this.eventDesc.category=category;
        this.eventDesc.action=action;
        this.eventDesc.label=label;
      },
      remoteMethod(query) {
        var that = this;

        if (query == "") {
          this.selectedSP = this.options4[0];
          return;
        }

        if (this.options4.length > 0 && query.indexOf(that.lastQuery) > -1) {
          return;
        }
        console.log("input box active", query, this.lastQuery, this.selectedSP);

        that.lastQuery = query;

        if ((!query || query == "") && this.selectedSP && this.selectedSP.name && this.selectedSP != ""){
          query = this.selectedSP.name;
        }


        if (query && query !== '') {
          this.loading = true;
          this.options4 = this.list.filter(item => {
            return item.name.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
          }).map(function(o){
            return {
              id: o.id,
              name: o.name
            }
          });
          if (this.options4.length == 0) {
            that.reloadMerchantList()
          }
          this.loading = false;
          console.log("final list", this.options4, this.selectedSP)
//          return this.options4;
        } else {
          this.options4 = [];
//          that.reloadMerchantList();
        }


      },
      searchButton(){
        let that = this;

        if (that.selectedSP === null) {
          that.errModal('show','No Selection','Please select a merchant to integrate');
          return
        }

        this.getEventDesc("SP-Selection",that.selectedSP.name,"SP-Selection");
        console.log("eventDesc",this.eventDesc);
        this.$store.commit('GA_EVENT',this.eventDesc);

        console.log("clicked button");
        console.log("selectedSP",that.selectedSP);
        console.log(this.message);


        this.setFaq(that.selectedSP);
        console.log("project object after setting faq",that.Project);

        this.$router.push({
          name: 'SelectIntegration',
          params: {
            id: that.selectedSP.id
          }
        })
      },
      errModal: function (action,header,message) {
        jQuery('.ui.mini.modal').modal(action);
      },
    },
    computed: {
      ...mapState(['Project'])
    },
    mounted(){
      this.setPageDesc("/app/chooseSP","ChooseSP");
      console.log("pageDesc",this.pageDesc);
      this.$store.commit('PAGE_VIEW',this.pageDesc);
      this.reloadMerchantList();


    }
  }

</script>
