<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-content>
          <md-field>
            <label>Name</label>
            <md-input v-model="video.name" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Video File</label>
            <md-file
              type="file"
              ref="file"
              accept="video/*"
              :disabled="upload_progress !== null"
              @md-change="files = $event"
            ></md-file>
            <md-progress-bar
              v-if="upload_progress !== null"
              class="md-primary"
              :md-value="upload_progress"
            ></md-progress-bar>
            <md-error v-if="upload_error">upload_error</md-error>
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
import { db, storage } from "@/config/firebaseInit";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      video: {
        name: "",
        url: ""
      },
      files: [],
      upload_progress: null,
      upload_error: null
    };
  },
  firestore() {
    return {
      video: db.collection("videos").doc(this.$route.params.video_id)
    };
  },
  methods: {
    uploadVid() {
      let file = this.files[0];
      let storageRef = storage.ref().child(
        `videos/${this.$route.params.video_id}_
          ${this.$route.params.video_id}/${Date.parse(new Date())}_${file.name}`
      );
      this.upload_error = null;

      let vm = this;

      let uploadTask = storageRef.put(file);

      uploadTask.on(
        "state_changed",
        () => {
          vm.upload_progress = (vm.upload_transferred / vm.upload_total) * 100;
        },
        error => {
          vm.upload_progress = null;
          vm.upload_error = error.getMessage();
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            vm.upload_progress = null;
            console.log(downloadURL);
          });
        }
      );
    },
    save() {
      let chain_start = Promise.resolve();
      // if (this.files.length) {
      //   chain_start = this.uploadVid;
      // }
      // debugger
      let vm = this;
      return chain_start
        .then(() => {
          // vm.video.url = url;
          return db
            .collection("videos")
            .doc(this.$route.params.video_id)
            .set(vm.video, { merge: true });
        })
        .then(() => {
          return Swal.fire("Success", "Video Updated", "success");
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
  },
  watch: {}
};
</script>

<style lang="css" scoped>
.md-card .md-card-actions{
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
