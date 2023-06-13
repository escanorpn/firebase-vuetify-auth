/* eslint-disable */
<template >
  <v-card   style="width: 98%; max-width: 1200px; margin-left: auto;margin-right: auto;">
    <v-tabs
      v-model="tab"
      background-color="primary"
      dark
    
    >
      <v-tab
        v-for="item in items"
        :key="item.tab"
      >
        {{ item.tab }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="item in items"
        :key="item.tab"
      >
        <v-card flat>
          <!-- <v-card-text>{{ item.content }}</v-card-text> -->
          <mUpload v-if="item.content === 1"/>
          <mProject v-if="item.content === 2"/>
          <mServices v-if="item.content === 3"/>
          <mProducts v-if="item.content === 4"/>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import mUpload from "./dash/upload.vue"
import mProject from "./dash/project.vue"
import mServices from "./dash/services.vue"
import mProducts from "./dash/products.vue"
  export default {
    components: {
      mUpload,
      mProject,
      mServices,
      mProducts
      
    },
    data () {
      return {
        tab: null,
        items: [
          { tab: 'Companies', content: 1 },
          { tab: 'Projects', content:  2 },
          { tab: 'Services', content: 3 },
          { tab: 'Products', content: 4 },
        ],
      }
    },
  }
</script>