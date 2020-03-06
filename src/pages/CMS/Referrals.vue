<template>
  <div class="md-layout">
    <p @click='$router.go(-1)' class='back'>back</p>
    <md-card>
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
            <md-button @click="saveEmailsCSV(csvData)" id="export-csv-btn">
              <md-icon class="material-icons">save_alt</md-icon>
            </md-button>
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
            </md-field>-->
          </md-table-toolbar>

          <md-table-row slot="md-table-row" @click="scanPage(item.id)" slot-scope="{ item }">
            <md-table-cell md-label="First Name" md-sort-by="firstName">
              {{ item.firstName }}
            </md-table-cell>
            <md-table-cell md-label="Last Name" md-sort-by="lastName">
              {{ item.lastName }}
            </md-table-cell>
            <md-table-cell md-label="Email" md-sort-by="email">
              {{ item.email }}
            </md-table-cell>
            <md-table-cell md-label="Phone" md-sort-by="phone">
              {{ item.phone }}
            </md-table-cell>
            <md-table-cell md-label="Location" md-sort-by="location">
              {{ item.location }}
            </md-table-cell>
            <md-table-cell md-label="Date" md-sort-by="date">
              {{ getTime(item.date) }}
            </md-table-cell>
            <md-table-cell md-label="Time" md-sort-by="time">
              {{ item.time.time }}
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
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    queriedData() {
      let scans = this.scans;
      if (scans.length > 0) {
        scans = this.filterByDate(scans);
      }
      this.tableData = scans;
      return scans;
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
    }
  },
  data() {
    return {
      colors: ['blue','rose','warning','green'],
      currentSort: "date",
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
  firestore() {
    return {
      scans: db.collection("scheduled_appointments"),
    };
  },
  methods: {
    customSort(value) {
      return value.sort((a, b) => {
        const sortBy = this.currentSort;
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
      let referrals = vm.tableData;

      let filteredReferrals = referrals.map(referral => ({
        Created: moment(referral.created).format("MM/DD/YYYY"),
        FirstName: referral.first_name,
        LastName: referral.last_name,
        FullName: referral.referral,
        Name: referral.name,
        Kiosk: referral.kiosk
      }))
      console.log(filteredReferrals);

      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        Object.keys(filteredReferrals[0]).join(";"),
        ...filteredReferrals.map(item => Object.values(item).join(";"))
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", "export.csv");
      link.click();
    },
    scanPage(id) {
      console.log(id);
      this.$router.push({ path: '/scans/'+id })
    }
  },
  created() {
  },
  mounted() {
    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ["name", "url"],
      threshold: 0.3
    });
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
