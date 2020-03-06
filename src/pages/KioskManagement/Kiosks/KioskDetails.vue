<template>
  <div class="md-layout">
    <div class="md-layout-item">
    <p @click='$router.go(-1)' class='back'>back</p>
      <md-card>
        <md-card-content>
          <md-field>
            <label>Title</label>
            <md-input v-model="kiosk.name" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Slug</label>
            <md-input v-model="kiosk.slug" disabled type="text"></md-input>
          </md-field>
          <md-field>
            <label>Location</label>
            <md-input v-model="kiosk.location" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Description</label>
            <md-textarea
              v-model="kiosk.description"
              md-autogrow
              md-counter="200"
            ></md-textarea>
          </md-field>
          <md-field>
            <label>Location's Phone Number</label>
            <md-input v-model="kiosk.phone" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Teamviewer ID</label>
            <md-input v-model="kiosk.teamviewer_id" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Teamviewer Password</label>
            <md-input v-model="kiosk.teamviewer_password" type="text"></md-input>
          </md-field>
          <md-field>
            <label for="client">Client</label>
            <md-select v-model="kiosk.client_id">
              <md-option
              v-for="client in clients"
              :key="client.id"
              :value="client.id"
              >{{ client.name }}</md-option>
            </md-select>
          </md-field>
          <!-- <md-field>
            <label>Location</label>
            <md-select v-model="location">
              <md-option
                v-for="location in locations"
                :key="location.id"
                :value="location.id"
                >{{ location.name }}</md-option
              >
            </md-select>
          </md-field> -->
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

export default {
  data() {
    return {
      clients: null,
      kiosk: {
        name: "",
        slug: "",
        location: '',
        description: "",
        phone: 'n/a',
        teamviewer_id: 'n/a',
        teamviewer_password: 'n/a',
        client_id: null
      },
      chosenClient: null,
      location:null,
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
      locations: [],
      pages: [
        {
          name: 'Designer',
          slug: 'designer',
          cta: 'CREATE YOUR OWN',
          icon: 'design.png',
          clicks: 0
        },
        {
          name: 'Mouthguards',
          slug: 'offer',
          cta: 'MOST POPULAR',
          icon: 'benefits.png',
          clicks: 0
        },
        {
          name: 'Benefits',
          slug: 'benefits',
          cta: 'BENEFITS',
          icon: 'ribbon.png',
          clicks: 0
        },
        {
          name: 'Wheel of Fortune',
          slug: 'wheel',
          cta: 'SPIN TO WIN',
          icon: 'offer.png',
          clicks: 0
        },
      ]
    };
  },
  watch: {
    kiosk: {
      handler(val) {
        if (!this.kiosk.created) {
          this.kiosk.slug = val.name.replace(/[^a-zA-Z0-9]/g, "-");
        }
      },
      deep: true
    },
    location(val) {
      this.kiosk.location = db.collection('locations').doc(val)
    }
  },
  firestore() {
    return {
      // locations: db.collection("locations"),
      kiosk: db.collection("kiosks").doc(this.$route.params.kiosk_id),
      videos: db.collection("videos"),
      surveys: db.collection("surveys"),
      clients: db.collection("clients")
    };
  },
  methods: {
    validate() {
      let valid = true
console.log(this.kiosk)
      for (let k in this.kiosk) {
        if (!this.kiosk[k]) {
          if (k != 'phone' && this.kiosk[k] < 0) {
            valid = false;
          }
        }
      }

      if (valid) {
        this.save()
      } else {
        alert('Please fill in all fields');
      }
    },
    save() {
      let vm = this;
      if (!this.kiosk.created){
        this.kiosk.created = new Date();
        this.kiosk.clicks = 0;
        this.savePages();
      }
      console.log(this.kiosk)
      return db
        .collection("kiosks")
        .doc(this.$route.params.kiosk_id)
        .set(vm.kiosk, { merge: true })
        .then(() => {
          return Swal.fire("Success", "Page Updated", "success");
        });
    },
    savePages(){
      let vm = this;
      this.pages.forEach(function(page){
        db.collection("kiosks")
        .doc(vm.$route.params.kiosk_id)
        .collection('pages')
        .doc(page.slug)
        .set(page)
      });

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
  updated() {
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
