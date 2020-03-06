<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <p @click="$router.go(-1)" class="back">back</p>
      <md-card>
        <md-card-content>
          <label>None Touch Screen <span class="required">*</span></label>
          <div>
            <md-checkbox v-model="building.none_touch" :value="true">Yes</md-checkbox>
            <md-checkbox v-model="building.none_touch" :value="false">No</md-checkbox>
          </div>
          <md-field>
            <label>Building Name <span class="required">*</span></label>
            <md-input v-model="building.name" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Building Slug <span class="required">*</span></label>
            <md-input v-model="building.slug" disabled type="text"></md-input>
          </md-field>
          <md-field>
            <label>Address 1 <span class="required">*</span></label>
            <md-input v-model="building.address_1" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Address 2</label>
            <md-input v-model="building.address_2" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Zip Code <span class="required">*</span></label>
            <md-input v-model="building.zip" type="text"></md-input>
          </md-field>
          <md-field>
            <label>City <span class="required">*</span></label>
            <md-input v-model="building.city" type="text"></md-input>
          </md-field>
          <md-field>
            <label>State <span class="required">*</span></label>
            <md-input v-model="building.state" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Country <span class="required">*</span></label>
            <md-input v-model="building.country" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Description</label>
            <md-textarea v-model="building.description" md-autogrow md-counter="200"></md-textarea>
          </md-field>
          <uploadMult
            :media_type="'image'"
            title="Building Logo"
            :media="building.logos"
            @saveImages="saveLogo"
            v-on:removeImage="removeLogoImages($event)"
          ></uploadMult>

          <uploadMult
            v-if="building.none_touch"
            :media_type="'image'"
            title="Building Image"
            :media="building.image"
            @saveImages="saveImages"
            @changeState="building.image = []"
            v-on:removeImage="removeImage($event)"
          ></uploadMult>
          <upload
            v-else
            :media_type="'image'"
            title="Building Image"
            :media="building.image"
            @saveImage="saveImage"
            v-on:removeImage="building.image = null"
          ></upload>
          <md-field v-if="building.none_touch">
            <label>Add Transition TIme (in seconds)</label>
            <md-input v-model="building.transition_time" type="number"></md-input>
          </md-field>
          <md-field>
            <label>Building's Phone Number</label>
            <md-input v-model="building.phone" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Teamviewer ID</label>
            <md-input v-model="building.teamviewer_id" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Teamviewer Password</label>
            <md-input v-model="building.teamviewer_password" type="text"></md-input>
          </md-field>
        </md-card-content>
        <md-card-actions md-alignment="space-between">
          <md-button class="md-primary md-round md-small" @click="validate">Save</md-button>
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import { db } from "@/config/firebaseInit";
import Swal from "sweetalert2";
import Upload from "../../components/Inputs/Upload.vue";
import UploadMultiple from "@/components/Inputs/UploadMultiple.vue";

export default {
  components: {
    upload: Upload,
    uploadMult: UploadMultiple
  },
  data() {
    return {
      clients: null,
      building: {
        name: "",
        slug: "",
        address_1: "",
        address_2: "",
        floors: 0,
        zip: "",
        city: "",
        state: "",
        country: "",
        description: "",
        phone: "n/a",
        teamviewer_id: "n/a",
        teamviewer_password: "n/a",
        image: [],
        logos: [],
        none_touch: false
      },
      media: [],
      chosenClient: null,
      location: null,
      type_options: [
        { val: "video", text: "Video" },
        { val: "image", text: "Image" },
        { val: "survey", text: "Survey" },
        { val: "iframe", text: "iFrame" }
      ],
      files: [],
      upload_progress: null,
      upload_error: null,
      videos: [],
      surveys: [],
      locations: []
    };
  },
  watch: {
    building: {
      handler(val) {
        if (!this.building.created) {
          this.building.slug = val.name.replace(/[^a-zA-Z0-9]/g, "-");
        }
      },
      deep: true
    },
    location(val) {
      this.building.location = db.collection("locations").doc(val);
    }
  },
  firestore() {
    return {
      building: db.collection("building").doc(this.$route.params.building_id)
    };
  },
  methods: {
    saveLogo(logo) {
      this.building.logos.push(logo);
    },
    removeLogoImages(img) {
      this.building.logos = this.building.logos.filter(i => i !== img);
    },
    saveImage(image) {
      this.building.image = image;
    },
    saveImages(image) {
      this.building.image.push(image);
    },
    removeImage(img) {
      this.building.image = this.building.image.filter(i => i !== img);
    },
    validate() {
      let valid = true;
      // for (let b in this.building) {
      //   if (!this.building[b]) {
      //     if (
      //       b != "phone" &&
      //       b != "description" &&
      //       b != "logos" &&
      //       b != "none_touch" &&
      //       !this.building[b]
      //     ) {
      //       valid = false;
      //     }
      //   }
      // }

      // if (valid) {
      //   this.save();
      // } else {
      //   alert("Please fill in all fields");
      // }
    },
    save() {
      let vm = this;
      if (!this.building.created) {
        this.building.created = new Date();
      }
      return db
        .collection("building")
        .doc(this.$route.params.building_id)
        .set(vm.building, { merge: true })
        .then(() => {
          return Swal.fire("Success", "Page Updated", "success");
        });
    }
  },
  created() {},
  mounted() {
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ["name", "url"],
      threshold: 0.3
    });
  },
  updated() {}
};
</script>

<style scoped>
/* <style lang="css" scoped> */
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}

.md-card.md-theme-default {
    margin-top: 10px;
    background: #ffffff !important;
}
</style>
