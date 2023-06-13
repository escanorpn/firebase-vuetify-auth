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
        v-for="(product, index) in products"
        :key="index"
      >
        <v-card>
          <!-- Display product images using a carousel or other suitable component -->
          <!-- ... -->
          <v-carousel>
            <v-carousel-item v-for="(image, i) in product.downloadURLs" :key="i">
              <v-img :src="image" height="200" contain></v-img>
            </v-carousel-item>
          </v-carousel>
          <v-card-title>{{ product.heading }}</v-card-title>
          <v-card-text>{{ product.description }}</v-card-text>
          <v-card-actions>
            <!-- <v-btn text color="primary" @click="editService(product)">
              Edit
            </v-btn> -->
            <v-btn text color="error" @click="deleteProduct(product.id)">
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
      products: [],
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
          const projectRef = doc(janaRef, "products");
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
            })
            .catch((error) => {
              console.error("Error adding data:", error);
            });
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
          this.stopLoading();
        });
    },

    editProduct(product) {
      // Logic for editing a product
    },

    deleteProduct(productId) {
      const janaRef = collection(firestore, process.env.VUE_APP_NAME);
      const projectRef = doc(janaRef, "products");
      const pref = collection(projectRef, "one");
      const productDoc = doc(pref, productId);

      deleteDoc(productDoc)
        .then(() => {
          console.log("Product deleted from Firestore collection 'one'");
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        });
    },
  },
  created() {
    const janaRef = collection(firestore, process.env.VUE_APP_NAME);
    const projectRef = doc(janaRef, "products");
    const pref = collection(projectRef, "one");

    const q = query(pref, orderBy("uploadDate", "desc"));

    onSnapshot(q, (querySnapshot) => {
      const products = [];
      querySnapshot.forEach((doc) => {
        const product = {
          id: doc.id,
          ...doc.data(),
        };
        products.push(product);
      });
      this.products = products;
    });
  },
};
</script>
