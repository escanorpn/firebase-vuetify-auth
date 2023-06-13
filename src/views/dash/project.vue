<template>
  <div>
    <div class="text-center" style="margin: 22px">
      <b>Companies We have worked with</b>
    </div>
    <v-textarea
      v-model="description"
      label="Description"
      outlined
      rows="4"
    ></v-textarea>
    <v-text-field
      v-model="duration"
      label="Duration"
      outlined
    ></v-text-field>
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
        v-for="(project, index) in projects"
        :key="index"
      >
        <v-card>
          <v-card-title>{{ project.description }}</v-card-title>
          <v-card-subtitle>{{ project.duration }}</v-card-subtitle>
          <v-card-text>
            Upload Date: {{ formatDate(project.uploadDate) }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="editProject(project)">Edit</v-btn>
            <v-btn color="red" text @click="deleteProject(project.id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db as firestore } from "../../middleware/firebase";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      description: "",
      duration: "",
      loading: false,
      projects: [],
      editingProject: null,
    };
  },
  methods: {
    ...mapActions("auth", ["startLoading", "stopLoading"]),
    onUpload() {
      if (this.editingProject) {
        this.updateProject();
      } else {
        this.addProject();
      }
    },
    addProject() {
      this.startLoading();
      const janaRef = collection(firestore, "jana");
      const projectRef = doc(janaRef, "projects");
      const pref = collection(projectRef, "one");

      const projectData = {
        description: this.description,
        duration: this.duration,
        uploadDate: serverTimestamp(),
      };

      addDoc(pref, projectData)
        .then(() => {
          console.log("Project data added to Firestore", process.env.VUE_APP_NAME);
          this.clearForm();
          this.stopLoading();
        })
        .catch((error) => {
          console.error("Error adding project data:", error);
          this.stopLoading();
        });
    },
    updateProject() {
      this.startLoading();
      const janaRef = collection(firestore, "jana");
      const projectRef = doc(janaRef, "projects");
      const pref = collection(projectRef, "one");

      const projectDocRef = doc(pref, this.editingProject.id);

      const projectData = {
        description: this.description,
        duration: this.duration,
      };

      updateDoc(projectDocRef, projectData)
        .then(() => {
          console.log("Project data updated in Firestore");
          this.clearForm();
          this.stopLoading();
        })
        .catch((error) => {
          console.error("Error updating project data:", error);
          this.stopLoading();
        });
    },
    deleteProject(projectId) {
      this.startLoading();
      const janaRef = collection(firestore, "jana");
      const projectRef = doc(janaRef, "projects");
      const pref = collection(projectRef, "one");

      const projectDocRef = doc(pref, projectId);

      deleteDoc(projectDocRef)
        .then(() => {
          console.log("Project data deleted from Firestore");
          this.stopLoading();
        })
        .catch((error) => {
          console.error("Error deleting project data:", error);
          this.stopLoading();
        });
    },
    editProject(project) {
      this.editingProject = project;
      this.description = project.description;
      this.duration = project.duration;
    },
    clearForm() {
      this.editingProject = null;
      this.description = "";
      this.duration = "";
    },
    formatDate(timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString();
    },
  },
  created() {
    const janaRef = collection(firestore, "jana");
    const projectRef = doc(janaRef, "projects");
    const pref = collection(projectRef, "one");

    onSnapshot(pref, (querySnapshot) => {
      const projects = [];
      querySnapshot.forEach((doc) => {
        const project = {
          id: doc.id,
          ...doc.data(),
        };
        projects.push(project);
      });
      this.projects = projects;
    });
  },
};
</script>
