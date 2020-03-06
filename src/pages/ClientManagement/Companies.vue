<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <Modal @close="showModal = false" :showModal="showModal">
        <template v-slot:header>
          <h3>Contacts</h3>
        </template>
        <template v-slot:body>
          <div class="contacts">
            <div v-for="(contact, i) in contacts" class="contact">
              <p>
                {{contact.name}}
                <span>{{contact.role}}</span>
                <span>{{contact.email}}</span>
                <span>{{contact.phone}}</span>
              </p>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <md-button @click="showModal = false">Close</md-button>
        </template>
      </Modal>
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
                <label for="companies">Per page</label>
                <md-select v-model="pagination.perPage" name="companies">
                  <md-option
                    v-for="item in pagination.perPageOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  >{{ item }}</md-option>
                </md-select>
              </md-field>

              <md-field>
                <md-button
                  class="md-primary md-round md-small"
                  @click="newCompany"
                >Add A New Restaurant</md-button>
              </md-field>

              <md-field>
                <md-input
                  type="search"
                  class="mb-3"
                  clearable
                  style="width: 200px"
                  placeholder="Search records"
                  v-model="searchQuery"
                ></md-input>
              </md-field>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Company" md-sort-by="company">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="Description" md-sort-by="description">{{ item.description }}</md-table-cell>

            
              <md-table-cell md-label="Edit">
                <md-button
                  class="md-just-icon md-warning md-simple"
                  @click.native="handleEdit(item)"
                >
                  <md-icon>edit</md-icon>
                </md-button>
              </md-table-cell>
              <md-table-cell md-label="Delete">
                <md-button
                  class="md-just-icon md-danger md-simple"
                  @click.native="handleDelete(item)"
                >
                  <md-icon>close</md-icon>
                </md-button>
              </md-table-cell>
            </md-table-row>
          </md-table>
          <!-- <div class="footer-table md-table">
            <table>
              <tfoot>
                <tr>
                  <th v-for="item in footerTable" :key="item.name" class="md-table-head">
                    <div class="md-table-head-container md-ripple md-disabled">
                      <div class="md-table-head-label">{{ item }}</div>
                    </div>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div> -->
        </md-card-content>
        <md-card-actions md-alignment="space-between">
          <div class>
            <p class="card-category">Showing {{ from + 1 }} to {{ to }} of {{ total }} entries</p>
          </div>
          <pagination
            class="pagination-no-border pagination-success"
            v-model="pagination.currentPage"
            :per-page="pagination.perPage"
            :total="total"
          ></pagination>
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>

<script>
import { Pagination } from "@/components";
import Fuse from "fuse.js";
import { db } from "@/config/firebaseInit";
import Swal from "sweetalert2";
import router from "@/router";
import Modal from "@/components/Modal.vue";

export default {
  components: {
    Pagination,
    Modal
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    queriedData() {
      let result = this.tableData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result.slice(this.from, this.to);
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
      currentSort: "name",
      currentSortOrder: "asc",
      showModal: false,
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0
      },
      footerTable: [
        "Company",
        "Building",
        "Description",
        "Floor",
        "Reports",
        "Contacts",
        "Edit",
        "Delete"
      ],
      searchQuery: "",
      propsToSearch: ["description", "last_signal", "slug"],
      tableData: [],
      searchedData: [],
      contacts: [],
      fuseSearch: null
    };
  },
  firestore() {
    return {
      tableData: db.collectionGroup("restaurants")
    };
  },
  methods: {
    openContacts(item) {
      this.contacts = item.contacts;
      this.showModal = true;
    },
    customSort(value) {
      return value.sort((a, b) => {
        const sortBy = this.currentSort;
        if (this.currentSortOrder === "desc") {
          return a[sortBy].localeCompare(b[sortBy]);
        }
        return b[sortBy].localeCompare(a[sortBy]);
      });
    },
    newCompany() {
      let ref = db.collection("restaurants").doc();
      router.push(`/privatedining/${ref.id}`);
    },
    handleEdit(item) {
      let id = item.id;
      router.push(`/privatedining/${id}`);
    },
    handleDelete(item) {
      console.log(item)
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to undo this",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "DELETE",
        cancelButtonText: "CANCEL"
      }).then(result => {
        if (result.value) {
          return db
            .collection("restaurants")
            .doc(item.id)
            .delete()
            .then(() => {
              Swal.fire("Deleted!", "The page has been deleted.", "success");
            });
        }
      });
    },
    goToReports(client) {
      router.push(`/reports/${client.building_id}/${client.id}`);
    }
  },
  created() {
    db.collection("restaurants")
      .get()
      .then(results => {
        console.log(results.docs);
      });
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
<style scoped>
.md-card.md-theme-default {
    margin-top: 10px;
    background: #ffffff !important;
}
/* <style lang="css" scoped> */
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
.contacts {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 30px;
}

.contact {
  background: white;
  padding: 15px 30px;
  margin-right: 10px;
  margin-bottom: 20px;
  width: 250px;
  border: 1px dashed black;
}

.contacts .contact p {
  margin: 0;
  display: flex;
  flex-direction: column;
  font-weight: 500;
  font-size: 17px;
}

.contacts .contact p span {
  font-weight: normal;
  font-size: 15px;
  opacity: 0.7;
  margin: 0;
}
</style>
