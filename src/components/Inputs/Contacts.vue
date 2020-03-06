<template>
  <div>
    <p>{{title}}</p>
    <div class="upload_holder">
      <div class="new_contact">
        <md-field>
          <label>Name</label>
          <md-input v-model="contact.name" type="text"></md-input>
        </md-field>
        <md-field>
          <label>Email</label>
          <md-input v-model="contact.email" type="email"></md-input>
        </md-field>
        <md-field>
          <label>Phone</label>
          <md-input v-model="contact.phone" type="number"></md-input>
        </md-field>
        <md-field>
          <label>Role</label>
          <md-input v-model="contact.role" type="text"></md-input>
        </md-field>

        <md-button class="md-primary md-round md-small" @click="validate()">Add Contact</md-button>
      </div>

      <div class="contacts">
        <div v-for="(contact, i) in contacts" @click="removeContact(i)" class="contact">
           <md-switch v-model="contact.isPublished" :value="true">Published</md-switch>
          <p>
            {{contact.name}}
            <span>{{contact.role}}</span>
            <span>{{contact.email}}</span>
            <span>{{contact.phone}}</span>
          </p>
          <p class="remove">remove</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, storage } from "@/config/firebaseInit";

export default {
  props: ["contacts", "title"],
  data() {
    return {
      contact: {
        name: "",
        phone: "",
        email: "",
        role: "",
        isPublished: false,
      }
    };
  },
  methods: {
    validate() {
      let valid = true;

      for (let c in this.contact) {
        if (!this.contact[c] && c != 'isPublished') {
          valid = false;
        }
      }

      if (valid) {
        this.addContact();
      } else {
        alert("Please fill in all Contact fields");
      }
    },
    addContact() {
      this.$emit("addContact", this.contact);
      this.contact = {
        name: "",
        phone: "",
        email: "",
        role: ""
      };
    },
    removeContact(contact) {
      if (confirm("Are you sure you want to delete this contact?")) {
        this.$emit("removeContact", contact);
      }
    }
  }
};
</script>

<style lang="css" scoped>
.upload_holder {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  background-color: #f7f7f7;
}

.upload_holder .new_contact {
  width: 50%;
  padding: 30px;
  background-color: #f7f7f7;
  max-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;
  padding-top: 20px;
}

.hide_upload {
  position: absolute;
  z-index: -2;
}

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

.rotate {
  font-size: 40px !important;
  -webkit-animation: loading 1s infinite linear;
}

.success p {
  text-align: center;
  margin-bottom: 0;
}

.success img {
  width: 100%;
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

.contacts {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 30px;
}

.contact {
  background: white;
  padding: 15px 30px;
  margin-right: 10px;
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

.contacts .contact p.remove {
  font-size: 14px;
  color: #e34242;
  font-weight: normal;
  cursor: pointer;
  margin-top: 10px;
}
</style>
