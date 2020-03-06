<template>
  <div>
    <p>{{title}}</p>
    <div class="upload_holder">
      <transition name="fade">
        <div v-if="!media.length && !load" class="upload_click" @click="$refs.upload.click()">
          <md-icon>present_to_all</md-icon>
          <p>You currently have no media uploaded. Click here to upload media. You can upload multiple</p>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="!media && load" class="loading">
          <md-icon class="rotate">autorenew</md-icon>
          <p>loading...</p>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="media.length && !load" class="success">
          <div class="images" v-for="(m,i) in media" :key="i">
            <img v-if="media_type == 'image'" :src="m" />
            <video v-if="media_type == 'video'" :src="m"></video>
            <p @click="$emit('removeImage', m)" class="text_btn">Remove {{media_type}}</p>
          </div>
          <div
            v-if="media.length"
            class="upload_click upload_another"
            @click="$refs.upload.click()"
          >
            <md-icon>present_to_all</md-icon>
            <p>Upload Another Image</p>
          </div>
        </div>
      </transition>
      <input
        ref="upload"
        type="file"
        multiple
        style="display:none;"
        :accept="media_type+'/*'"
        class="hide_upload"
        @change="uploadImage"
      />
    </div>
  </div>
</template>

<script>
import { db, storage } from "@/config/firebaseInit";

export default {
  props: ["media_type", "media", "title"],
  data() {
    return {
      load: false
    };
  },

  created() {
    if (this.media == null || typeof this.media == "string") {
      this.$emit("changeState");
      this.media = [];
    }
  },
  methods: {
    uploadImage(e) {
      let input = e.target;
      let vm = this;
      this.upload = null;
      vm.load = null;
      setTimeout(function() {
        vm.load = true;
      }, 500);

      if (input.files.length) {
        let filePromises = [...input.files].map(file => {
          let metadata = {
            contentType: file.type
          };

          let media = file;
          let reader = new FileReader();
          reader.readAsDataURL(media);
          reader.onload = e => {
            let storageRef = storage.ref(`${vm.media_type}s/${Date.now()}`);
            let uploadTask = storageRef.put(media);

            uploadTask.on(
              "state_changed",
              snapshot => {},
              error => {
                vm.logoLoad = false;
                alert("could not upload logo, please try again.");
              },
              snapshot => {
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                  vm.$emit("saveImages", downloadURL);
                  vm.load = null;
                  setTimeout(function() {
                    vm.load = false;
                  }, 500);
                });
              }
            );
          };
        });
      }
    }
  }
};
</script>

<style lang="css" scoped>
.upload_holder {
  width: 100%;
  padding: 30px;
  /* background-color: #f7f7f7; */
  /* min-width: 400px; */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 40px;
}

/* .hide_upload {
  display: hidden;
  position: absolute;
  z-index: -2;
} */

.upload_click,
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.upload_click .md-icon {
  font-size: 53px !important;
  opacity: 0.5;
}

.upload_click p {
  line-height: 1.3;
  max-width: 300px;
  text-align: center;
  opacity: 0.5;
  margin-top: 30px;
  margin-bottom: 0;
}

.upload_another {
  margin-top: 80px;
  margin-left: 50px;
}
.rotate {
  font-size: 40px !important;
  -webkit-animation: loading 1s infinite linear;
}

.success {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.success p {
  text-align: center;
  margin-bottom: 0;
}

.success img {
  width: 200px;
  max-height: 100%;
}

@-webkit-keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
