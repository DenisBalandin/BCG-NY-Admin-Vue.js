<template>
  <div class="md-layout">
    <div class="md-layout-item">
    <p @click='$router.go(-1)' class='back'>back</p>
      <md-card>
        <md-card-content>
          <md-field>
            <label>Title</label>
            <md-input v-model="video.name" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Description</label>
            <md-input v-model="video.description" type="text"></md-input>
          </md-field>
          <Upload :media_type='"video"' :media='media'></Upload>
          
        </md-card-content>
        <md-card-actions md-alignment="space-between">
          <md-button class="md-primary md-round md-small" @click="validate"
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
import  Upload from "../../components/Inputs/Upload.vue"

export default {
  components: {
    Upload
  },
  data() {
    return {
      media: null,
      video: {
        name: "",
        description: "",
        media: ''
      },
      videoLoad: false,
    };
  },
  firestore() {
    return {
      video: db.collection("video").doc(this.$route.params.id),
    };
  },
  methods: {
    validate() {
      let valid = true;
      
      if (this.video.name.length < 1) {
        valid = false;
        alert('Please enter a video name');
      }
      if (this.video.media.length < 1 && valid) {
        valid = false;
        alert('Please upload a video file');
      }
      if (valid) {
        this.save();
      }
    },
    save() {
      let vm = this;
      this.video.created = new Date();
      return db
        .collection("video")
        .doc(vm.$route.params.id)
        .set(vm.video, { merge: true })
        .then(() => {
          return Swal.fire("Success", "Page Updated", "success");
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
  },
  watch: {
    video: {
      handler(val) {
        this.media = this.video.media;
      },
      deep: true
    },
    media(){
      this.video.media = this.media;
    }
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
