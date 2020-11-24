<template>
  <v-row>
    <v-col v-for="(replayOptions,i) in replays" :key="i" class="d-flex child-flex" cols="4">
      <v-card class="mx-auto">
        <xgplayer :options="replayOptions"></xgplayer>
        <v-card-title>{{replayOptions.player}}</v-card-title>
        <v-card-actions>
          <v-btn text color="green">Share</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <infinite-loading @infinite="loadVideos"></infinite-loading>
  </v-row>
</template>
<script>
import utils from "web3-utils";

import InfiniteLoading from "vue-infinite-loading";

export default {
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      replays: [],
      isLoading: true,
      fullPage: true,
    };
  },
  mounted: async function () {
    await Promise.resolve(this.loadVideos());
  },
  methods: {
    loadVideos: async function ($state) {
      this.$store.dispatch("showLoading");
      let _this = this;
      var urls = []
      console.log("urls: ", urls);
      if (urls.length === 0) {
        _this.$store.dispatch("hideLoading");
      } else {
        urls.map(async (url) => {
          console.log("url", url);
        /** _this.replays.push({
              url: swarm.toString(array),
              width: "100%",
              player: details,
            }); */
        });
        _this.$store.dispatch("hideLoading");
      }
    },
  },
};
</script>