<template>
  <div>
    <div class="text-center" style="margin: 22px">
      Companies We have worked with
    </div>
    <UploadImages
      @changed="handleFileSelect"
      clearAll="remove all images"
      :max="5"
      fileError="images files only accepted"
    />
    <div v-if="!loading" class="text-center">
      <v-btn rounded color="primary" dark @click="onUpload">Upload</v-btn>
    </div>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="(company) in companies"
        :key="company.id"
      >
        <v-card class="mx-auto" max-width="400">
          <v-img
            v-for="(url) in company.downloadURLs"
            :key="url"
            :src="url"
            height="200"
          ></v-img>
          <!-- <v-card-title>{{ company.id }}</v-card-title> -->
          <v-btn color="red" text @click="deleteImage(company.id)">
            Delete Image
          </v-btn>
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
  setDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

export default {
  components: {
    UploadImages,
  },
  data() {
    return {
      files: [],
      loading: false,
      companies: [],
    };
  },
  methods: {
    ...mapActions("auth", ["startLoading", "stopLoading"]),
    handleFileSelect(files) {
      this.files = files;
    },
    generateUniqueId() {
      const timestamp = new Date().getTime();
      const randomNum = Math.floor(Math.random() * 10000);
      return `${timestamp}_${randomNum}`;
    },
    onUpload() {
      this.startLoading();

      const uploadPromises = [];
      const companies = [];

      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        const fileName = file.name;
        const folderPath = process.env.VUE_APP_UPLOAD_FOLDER;
        console.log("folderPath", folderPath);
        const storageRef = ref(storage, folderPath + fileName);

        const uploadTask = uploadBytesResumable(storageRef, file);
        const uploadPromise = new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
                  const company = {
                    id: this.generateUniqueId(), // Generate a unique ID for each image
                    downloadURLs: [downloadURL], // Store the download URL in an array
                  };
                  companies.push(company);
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
          const projectRef = doc(janaRef, "company");
          const pref = collection(projectRef, "one");

          const batch = [];
          companies.forEach((company) => {
            const companyDocRef = doc(pref, company.id);
            const companyData = {
              downloadURLs: company.downloadURLs,
            };
            batch.push(setDoc(companyDocRef, companyData));
          });

          Promise.all(batch)
            .then(() => {
              console.log("Images uploaded successfully.");
              this.files = [];
            })
            .catch((error) => {
              console.error("Error uploading images:", error);
            });
        })
        .catch((error) => {
          console.error("Error uploading images:", error);
          this.stopLoading();
        });
    },
    deleteImage(companyId) {
      const janaRef = collection(firestore, process.env.VUE_APP_NAME);
      const projectRef = doc(janaRef, "company");
      const pref = collection(projectRef, "one");

      const companyDocRef = doc(pref, companyId);

      deleteDoc(companyDocRef)
        .then(() => {
          console.log("Document deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting document:", error);
        });
    },
  },
  created() {
    const janaRef = collection(firestore, process.env.VUE_APP_NAME);
    const projectRef = doc(janaRef, "company");
    const pref = collection(projectRef, "one");

    onSnapshot(pref, (querySnapshot) => {
      const companies = [];
      querySnapshot.forEach((doc) => {
        companies.push({
          id: doc.id,
          downloadURLs: doc.data().downloadURLs,
        });
      });
      this.companies = companies;
    });
  },
};
</script>
