<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <p @click="$router.go(-1)" class="back">back</p>
      <md-card>
        <md-card-content>
     
          <md-field>
            <label>Company Name <span class="required">*</span></label>
            <md-input v-model="building.name" type="text"></md-input>
          </md-field>
          <!-- <md-field>
            <label> Face image <span class="required">*</span></label>
            <md-input v-model="building.firstImage" disabled type="text"></md-input>
          </md-field> -->
          <!-- <md-field>
            <label> Main Image<span class="required">*</span></label>
            <md-input v-model="building.mainImage" type="text"></md-input>
          </md-field> -->
          <md-field>
            <label>Level</label>
            <md-input v-model="building.level" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Description<span class="required">*</span></label>
            <md-input v-model="building.description" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Menu<span class="required">*</span></label>
            <md-input v-model="building.menu" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Contact Name<span class="required">*</span></label>
            <md-input v-model="building.contactName" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Email<span class="required">*</span></label>
            <md-input v-model="building.email" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Phone<span class="required">*</span></label>
            <md-input v-model="building.phone" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Details<span class="required">*</span></label>
            <md-input v-model="building.details" type="text"></md-input>
          </md-field>
<!-- 
         <uploadMult
            :media_type="'image'"
            title="Building Logo"
            :media="building.logos"
            @saveImages="saveLogo"
            v-on:removeImage="removeLogoImages($event)"
          ></uploadMult> -->
          <upload
            :media_type="'image'"
            title="Logo"
            :media="building.logo"
            @saveImage="saveLogo"
            v-on:removeImage="building.logo = null"
          ></upload>
          <upload
            :media_type="'image'"
            title="Face Iamage"
            :media="building.firstImage"
            @saveImage="saveImageFace"
            v-on:removeImage="building.firstImage = null"
          ></upload>
          <upload
            :media_type="'image'"
            title="Main Image"
            :media="building.mainImage"
            @saveImage="saveImage"
            v-on:removeImage="building.mainImage = null"
          ></upload>
          
          <!-- <upload
            :media_type="'logos'"
            title="face Image"
            :media="building.logos"
            @saveImage="saveLogo"
            v-on:removeImage="building.imageface = null"
          ></upload> -->


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
        contactName: "",
        firstImage:"",
        mainImage: "",
        logo:"",
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
      building: db.collection("catering").doc(this.$route.params.company_id)
    };
  },
  methods: {


    // saveLogo(logo) {
    //   this.building.logos.push(logo);
    // },
    // removeLogoImages(img) {
    //   this.building.logos = this.building.logos.filter(i => i !== img);
    // },
    saveImage(image) {
      this.building.mainImage = image;
    },
    saveImageFace(image) {
      this.building.firstImage = image;
    },
    saveLogo(image) {
      this.building.logo = image;
    },
    // saveImages(image) {
    //   this.building.image.push(image);
    // },
    // removeImage(img) {
    //   this.building.image = this.building.image.filter(i => i !== img);
    // },
    //  removeImagface(img) {
    //   this.building.imageFace = this.building.imageFace.filter(i => i !== img);
    // },
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

      if (valid) {
        this.save();
      } else {
        alert("Please fill in all fields");
      }
    },
    save() {
      let vm = this;
      if (!this.building.created) {
        this.building.created = new Date();
      }
      return db
        .collection("catering")
        .doc(this.$route.params.company_id)
        .set(vm.building, { merge: true })
        .then(() => {
          return Swal.fire("Success", "Page Updated", "success");
        });

    }
  },
  created() {},
  mounted() {
    // console.log(this.building);
    console.log(this.$route.params.company_id);
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ["contactName", "url"],
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
