<template>
  <v-row>
    <v-col
      v-for="(replayOptions, i) in replays"
      :key="i"
      class="d-flex child-flex"
      cols="4"
    >
      <v-card class="mx-auto">
        <xgplayer :options="replayOptions"></xgplayer>
        <v-card-title>{{ replayOptions.player }}</v-card-title>
        <v-card-title>Score: {{ replayOptions.collected }}</v-card-title>
      </v-card>
    </v-col>
    <infinite-loading @infinite="loadVideos"></infinite-loading>
  </v-row>
</template>
<script>
import swal from "sweetalert2";
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
    getSkyData: async function () {

      return await this.$store.state.client.db.getJSON(
        this.$store.state.publicKey,
        process.env.VUE_APP_APP_KEY
      );
    },
    loadVideos: async function ($state) {
      this.$store.dispatch("showLoading");
      let _this = this;
      var test = await this.getSkyData();
      if (test) {
        test.data.users.map(async (user) => {
          /** */ _this.replays.push({
            url: user.file,
            width: "100%",
            player: user.username,
            collected: user.collected,
          });
        });
        _this.$store.dispatch("hideLoading");
      } else {
        _this.$store.dispatch("hideLoading");
        swal.fire(
          "No Replays Yet",
          "There are no user replays yet :(",
          "warning"
        );
      }
    },
  },
};
</script>