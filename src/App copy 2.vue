<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
    >
      <v-list>
        <v-list-item v-for="(link, index) in links" :key="index" @click="navigate(link)">
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      fixed
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-toolbar-title>
        User: <v-chip>{{ getDisplayName }}</v-chip>
      </v-toolbar-title>

      <v-progress-linear
        :active="iLoading"
        :indeterminate="iLoading"
        absolute
        top
        height="10"
        color="cyan"
      ></v-progress-linear>


      <v-spacer />

      <!-- sign in / sign out button -->
      <v-btn v-if="isAuthenticated" outlined @click="signOut()"> Sign Out </v-btn>
      <v-btn v-else outlined @click="$router.push('/protected').catch(() => {})"> Sign In </v-btn>
    </v-app-bar>
    <v-progress-linear
        :active="iLoading"
        :indeterminate="iLoading"
        absolute
        top
        height="10"
        color="cyan"
      ></v-progress-linear>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>

      <v-snackbar
        v-if="isMobileView"
        v-model="snackbarVisible"
        :timeout="5000"
        color="primary"
        bottom
        left
      >
        This is a snackbar message.
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  computed: {
    ...mapGetters("auth", ["isAuthenticated", "getDisplayName", "iLoading"]),
  },

  data() {
    return {
      drawer: false,
      links: [
        { title: 'Home', icon: 'mdi-home', path: '/' },
        { title: 'Companies', icon: 'mdi-information', path: '/about' },
        { title: 'Companies', icon: 'mdi-information', path: '/about' },
        { title: 'Contact', icon: 'mdi-email', path: '/contact' }
      ],
      isMobileView: false,
      snackbarVisible: false
    }
  },

  mounted() {
    this.checkMobileView();

    window.addEventListener('resize', this.checkMobileView);
  },

  methods: {
    ...mapActions("auth", ["signOut"]),
    navigate(link) {
      this.$router.push(link.path).catch(() => {});
    },

    checkMobileView() {
      this.isMobileView = window.innerWidth <= 600;
    }
  }
}
</script>
