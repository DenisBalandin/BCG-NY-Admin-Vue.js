<template>
  <div class="md-layout table">
    <md-card v-if='emailName'>
      <md-card-content>
        <md-table
          md-fixed-header
          :value="queriedData"
          :md-sort.sync="currentSort"
          :md-sort-order.sync="currentSortOrder"
          :md-sort-fn="customSort"
          class="paginated-table table-striped table-hover"
        >
          <md-table-toolbar>
            <md-field>
              <label for="kiosks">Per page</label>
              <md-select v-model="pagination.perPage" name="kiosks">
                <md-option
                  v-for="item in pagination.perPageOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                  {{ item }}
                </md-option>
              </md-select>
            </md-field>
            <md-field>
              <md-button @click="saveEmailsCSV(csvData)" id="export-csv-btn">
                <md-icon class="material-icons">save_alt</md-icon>
              </md-button>
            </md-field>
            <!-- <md-field>
              <md-input
                type="search"
                class="mb-3"
                clearable
                style="width: 200px"
                placeholder="Search records"
                v-model="searchQuery"
              >
              </md-input>
            </md-field> -->
          </md-table-toolbar>



          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Email" md-sort-by="email">
              {{ item.email }}
            </md-table-cell>
            <md-table-cell md-label="Name" md-sort-by="name">
              {{ item.name }}
            </md-table-cell>
            <template v-if='emailName == "pageSends" || emailName == "all"'>
              <md-table-cell md-label="Page" md-sort-by="page">
                <span v-if='item.page'>{{ item.page }}</span>
              </md-table-cell>
            </template>
            <md-table-cell md-label="Date" md-sort-by="created">
              {{ getTime(item.created) }}
            </md-table-cell>
          </md-table-row>
        </md-table>
      </md-card-content>
      <md-card-actions md-alignment="space-between">
        <div class="">
          <p class="card-category">
            Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
          </p>
        </div>
        <pagination
          class="pagination-no-border pagination-success"
          v-model="pagination.currentPage"
          :per-page="pagination.perPage"
          :total="total"
        >
        </pagination>
      </md-card-actions>
    </md-card>
    <md-card v-else>
      <img class='loader' src="../.././public/img/loader.gif">
    </md-card>
  </div>
</template>

<script>
var moment = require('moment');
import { Pagination } from "@/components";
import Fuse from "fuse.js";
import { db } from "@/config/firebaseInit";
import Swal from "sweetalert2";
import router from "@/router";
import {
  StatsCard,
  ChartCard,
  ProductCard,
  AnimatedNumber,
  GlobalSalesCard,
  GlobalSalesTable
} from "@/components";

export default {
  components: {
    Pagination,
    StatsCard,
    AnimatedNumber
  },
  props: ['emailName', 'all', 'allEmails', 'fromDate', 'toDate'],
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    queriedData() {
      let matchingEmails = this.matchingEmails;
      let pageSends = this.pageSends;
      let emails = [];
      if (this.emailName == "all"){
        emails = matchingEmails.concat(pageSends);
      }else {
        if (this.allEmails){
          emails = this.allEmails;
        }else {
          emails = this[this.emailName];
        }
      }
      if (!this.all && !this.allEmails) {
        emails = this.filterEmails(emails);
      }
      if (emails) {
        if (emails.length > 0) {
          emails = this.filterByDate(emails);
        }
      }
      this.tableData = emails;
      return emails;
    },
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.searchedData.length > 0
        ? this.searchedData.length
        : this.tableData.length;
    },
    csvData() {
      let vm = this;
      return vm.matchingEmails.map(item => ({
        ...item
      }));
    }
  },
  data() {
    return {
      emails: [],
      colors: ['blue','rose','warning','green'],
      wofEmails: [],
      matchingEmails: [],
      pageSends: [],
      currentSort: "email",
      currentSortOrder: "asc",
      pagination: {
        perPage: 50,
        currentPage: 1,
        perPageOptions: [50, 100, 200],
        total: 0
      },
      footerTable: [
        "Kiosk",
        "Description",
        "Location",
        "Last Signal",
        "Init URL","Actions",""
        ],
      searchQuery: "",
      propsToSearch: [
        "description",
        "last_signal",
        "slug"
      ],
      tableData: [],
      searchedData: [],
      fuseSearch: null
    };
  },
  // firestore() {
  //   return {
  //     matchingEmails: db.collection("matchingEmails"),
  //     pageSends: db.collection("pageSends")
  //   };
  // },
  methods: {
    filterEmails(emails){
      let arr = [];
      let vm = this;
      if (emails) {
        emails.forEach(function(email){
          let emailCreated = moment(email.created).format('LLL');
          let fromDate = moment(vm.fromDate).format('LLL')
          let toDate = moment(vm.toDate).format('LLL')

          //Goes through and checks to see if created date is within date range
          if (moment(emailCreated).isSameOrBefore(toDate) && moment(emailCreated).isSameOrAfter(fromDate)) {
            arr.push(email)
          }

          // if (email.kiosk) {
          //   if(email.kiosk == vm.$route.params.kiosk_id) {
          //     arr.push(email)
          //   }
          // }
        })
      }
      return arr;
    },
    customSort(value) {
      return value.sort((a, b) => {
        const sortBy = this.currentSort;
        if (this.currentSort === "created" & this.currentSortOrder === "desc") {
          return a[sortBy] - b[sortBy];
        }

        if (this.currentSort === "created" & this.currentSortOrder === "asc") {
          return b[sortBy] - a[sortBy];
        }

        if (this.currentSortOrder === "desc") {
          return a[sortBy].localeCompare(b[sortBy]);
        }
        return b[sortBy].localeCompare(a[sortBy]);
      });
    },
    filterByDate(emails){
      let newEmails = emails.sort(function(a,b){
        return new Date(b.created) - new Date(b.created);
      });
      return newEmails
    },
    getTime(time){
      return moment(time).format('LLL');
    },
    saveEmailsCSV() {
      let vm = this;
      let emails = vm.queriedData;

      let filteredEmails = emails.map(email => ({
        Created: moment(email.created).format("MM/DD/YYYY"),
        Email: email.email,
        Kiosk: email.kiosk,
        Name: email.name,
      }))
      console.log(filteredEmails);

      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        Object.keys(filteredEmails[0]).join(";"),
        ...filteredEmails.map(item => Object.values(item).join(";"))
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", "export.csv");
      link.click();
    },
    getMemoryEmails(){
      let vm = this;
      db.collection('wofEmails')
      .get().then(function(snapshot){
        vm.matchingEmails = snapshot.docs.map(doc => doc.data());
      });
    },
    getPageShares(){
      let vm = this;
      db.collection('pageSends')
      .get().then(function(snapshot){
        console.log(snapshot.docs)
        vm.pageSends = snapshot.docs.map(doc => doc.data());
      });
    },
  },
  created() {
  },
  mounted() {
    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ["name", "url"],
      threshold: 0.3
    });

    this.$nextTick(function(){
      if (this.allEmails) {

      }else {
        this.getMemoryEmails();
        this.getPageShares();
      }
    })
  },
  watch: {
    /**
     * Searches through the table data by a given query.
     * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
     * @param value of the query
     */
    searchQuery(value) {
      let result = this.tableData;
      if (value !== "") {
        result = this.fuseSearch.search(this.searchQuery);
      }
      this.searchedData = result;
    }
  }
};
</script>

<style lang="css">
  .paginated-table .md-table-head-container.md-ripple,.md-table.md-theme-default .md-table-row td,.paginated-table .md-table-cell:last-child .md-table-cell-container, .paginated-table .md-table-head:last-child,.paginated-table .md-table-cell:last-child .md-table-cell-container, .paginated-table .md-table-head:last-child {
    text-align: left !important;
    justify-content: flex-start;
  }
</style>
