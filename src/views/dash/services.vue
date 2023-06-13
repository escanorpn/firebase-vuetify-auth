<template>
  <div>
    <v-text-field
      v-model="heading"
      label="Heading"
      outlined
    ></v-text-field>
    <v-textarea
      v-model="description"
      label="Description"
      outlined
      rows="4"
    ></v-textarea>
    <UploadImages
      @changed="handleFileSelect"
      clearAll="remove all images"
      :max="5"
      fileError="images files only accepted"
    />
    <div v-if="!loading" class="text-center">
      <v-btn
        rounded
        color="primary"
        dark
        @click="onUpload"
      >
        Upload
      </v-btn>
    </div>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="(service, index) in services"
        :key="index"
      >
        <v-card>
          <v-carousel>
            <v-carousel-item v-for="(image, i) in service.downloadURLs" :key="i">
              <v-img :src="image" height="200" contain></v-img>
            </v-carousel-item>
          </v-carousel>
          <v-card-title>{{ service.heading }}</v-card-title>
          <v-card-text>{{ service.description }}</v-card-text>
          <v-card-subtitle>Upload Date: {{ formatDateTime(service.uploadDate) }}</v-card-subtitle>
          <v-card-actions>
            <!-- <v-btn text color="primary" @click="editService(service)">
              Edit
            </v-btn> -->
            <v-btn text color="error" @click="deleteService(service.id)">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db as firestore } from "../../middleware/firebase";
import UploadImages from "vue-upload-drop-images";
import { mapActions } from "vuex";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  updateDoc
} from "firebase/firestore";

export default {
  components: {
    UploadImages,
  },
  data() {
    return {
      heading: "",
      description: "",
      files: [],
      loading: false,
      services: [],
    };
  },
  methods: {
    ...mapActions("auth", ["startLoading", "stopLoading"]),
    handleFileSelect(files) {
      this.files = files;
    },
    onUpload() {
      this.startLoading();

      const uploadPromises = [];
      const downloadURLs = [];

      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        const fileName = file.name;
        const folderPath = process.env.VUE_APP_UPLOAD_FOLDER;
        const storageRef = ref(storage, folderPath + fileName);

        const uploadTask = uploadBytesResumable(storageRef, file);
        const uploadPromise = new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              this.$toast.success("Upload is " + progress + "% done");
            },
            (error) => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  console.log("File available at", downloadURL);
                  downloadURLs.push(downloadURL);
                  resolve();
                })
                .catch((error) => {
                  reject(error);
                });
            }
          );
        });
        uploadPromises.push(uploadPromise);
      }

      Promise.all(uploadPromises)
        .then(() => {
          this.stopLoading();

          const janaRef = collection(firestore, process.env.VUE_APP_NAME);
          const projectRef = doc(janaRef, "services");
          const pref = collection(projectRef, "one");

          const data = {
            heading: this.heading,
            description: this.description,
            downloadURLs: downloadURLs,
            uploadDate: serverTimestamp(),
          };

          addDoc(pref, data)
            .then(() => {
              console.log("Data added to Firestore collection 'one'");
              this.$toast.success("Data added to Firestore ");
            })
            .catch((error) => {
              console.error("Error adding data:", error);
              this.$toast.error("Error adding data");
       
              
            });
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
          this.stopLoading();
          this.$toast.error("Error uploading files");
        });
    },

    formatDateTime(timestamp) {
      if (!timestamp || !timestamp.seconds) {
        return "";
      }

      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString();
    },
    
    editService(service) {
      // Implement your logic to edit a service here
      // For example, you can open a modal and pre-fill the form fields with the service data
      console.log("Editing service:", service);
    },
    
    deleteService(serviceId) {
      // Implement your logic to delete a service here
      const janaRef = collection(firestore, process.env.VUE_APP_NAME);
      const projectRef = doc(janaRef, "services");
      const pref = collection(projectRef, "one");
      
      const serviceRef = doc(pref, serviceId);
      
      deleteDoc(serviceRef)
        .then(() => {
          console.log("Service deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting service:", error);
          this.$toast.error("Error deleting service");
        });
    },
  },
  created() {
    const janaRef = collection(firestore, process.env.VUE_APP_NAME);
    const projectRef = doc(janaRef, "services");
    const pref = collection(projectRef, "one");

    const q = query(pref, orderBy("uploadDate", "desc"));

    onSnapshot(q, (querySnapshot) => {
      const services = [];
      querySnapshot.forEach((doc) => {
        const service = {
          id: doc.id,
          ...doc.data(),
        };
        services.push(service);
      });
      this.services = services;
    });
  },
};

</script>
