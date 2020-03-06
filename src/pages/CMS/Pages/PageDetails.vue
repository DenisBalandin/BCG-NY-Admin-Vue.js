<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-content>
          <md-field>
            <label>Title</label>
            <md-input v-model="page.name" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Slug</label>
            <md-input v-model="page.slug" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Description</label>
            <md-textarea
              v-model="page.description"
              md-autogrow
              md-counter="200"
            ></md-textarea>
          </md-field>
          <md-field>
            <label>Page Type</label>
            <md-select v-model="page.type">
              <md-option
                v-for="option in type_options"
                :key="option.val"
                :value="option.val"
                >{{ option.text }}</md-option
              >
            </md-select>
          </md-field>
        </md-card-content>
        <md-card-actions md-alignment="space-between">
          <md-button class="md-primary md-round md-small" @click="save"
            >Save</md-button
          >
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import { db } from "@/config/firebaseInit";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      page: {
        name: "",
        slug: "",
        description: "",
        type: "video"
      },
      type_options: [
        { val: "video", text: "Video" },
        { val: "image", text: "Image" },
        { val: "survey", text: "Survey" },
        { val: "iframe", text: "iFrame" }
      ],
      files: [],
      upload_progress: null,
      upload_error: null
    };
  },
  watch: {
    page: {
      handler(val) {
        this.page.slug = val.name.replace(/[^a-zA-Z0-9]/g, "-");
      },
      deep: true
    }
  },
  firestore() {
    return {
      page: db.collection("pages").doc(this.$route.params.page_id),
      videos: db.collection("videos"),
      surveys: db.collection("surveys")
    };
  },
  methods: {
    save() {
      let vm = this;
      return db
        .collection("pages")
        .doc(this.$route.params.page_id)
        .set(vm.page, { merge: true })
        .then(() => {
          return Swal.fire("Success", "Page Updated", "success");
        });
    }
  },
  created() {},
  mounted() {
    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ["name", "url"],
      threshold: 0.3
    });
  }
};
</script>

<style lang="css" scoped>
.md-card .md-card-actions{
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
