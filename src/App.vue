<template>
  <v-app>
    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
    <playVideo />
  </v-app>
</template>
<script>
import playVideo from "./widgets/playVideo";

export default {
  name: "TheCollector",
  components: { playVideo },
  data: () => ({
    //
  }),
  methods: {
    createEvent() {
      if (window.performance) {
        console.info("window.performance work's fine on this browser");
      }
      if (performance.navigation.type == 1) {
        console.info("This page is reloaded");
        localStorage.clear();
        window.location.href = "/server";
      } else {
        console.info("This page is not reloaded");
      }
      if (typeof history.pushState === "function") {
        history.pushState("jibberish", null, null);
        window.onpopstate = function () {
          history.pushState("newjibberish", null, null);
          // Handle the back (or forward) buttons here
          // Will NOT handle refresh, use onbeforeunload for this.
          this.$router.push({ path: "/server" });
        };
      } else {
        var ignoreHashChange = true;
        window.onhashchange = function () {
          if (!ignoreHashChange) {
            ignoreHashChange = true;
            window.location.hash = Math.random();
            this.$router.push({ path: "/server" });

            // Detect and redirect change here
            // Works in older FF and IE9
            // * it does mess with your hash symbol (anchor?) pound sign
            // delimiter on the end of the URL
          } else {
            ignoreHashChange = false;
          }
        };
      }
    },
    getSkyData: async function () {
      console.log(
        "datakEY: ",
        this.$store.state.publicKey,
        process.env.VUE_APP_APP_KEY
      );
      var test = await this.$store.state.client.db.getJSON(
        this.$store.state.publicKey,
        process.env.VUE_APP_APP_KEY
      );
      console.log("test: ", test);
      return await this.$store.state.client.db.getJSON(
        this.$store.state.publicKey,
        process.env.VUE_APP_APP_KEY
      );
    },
    getData() {
      return new Promise(async (resolve) => {
        try {
          var test = await this.getSkyData();
          if (!test) {
            this.$store.state.data = null;
            this.$store.state.revision = 1;
          } else {
            var { data, revision } = await this.getSkyData();
            this.$store.state.data = data;
            this.$store.state.revision = revision;
            console.log("data");
          }

          //  await client.db.setJSON(appInfo.privateKey, data.secret, data);
          resolve();
        } catch (error) {
          console.log(error);
        }
      });
    },
    createSaveUserModal() {
      let _this = this;
      window.document.addEventListener(
        "saveUser",
        async function (e) {
          await _this.saveUser();
        },
        false
      );
    },
    saveUser: async function () {
      var user = JSON.parse(localStorage.getItem("user"));
      console.log("saving user: ", user);
      console.log("passed user: ", user);
      if (!this.$store.state.data) {
        this.$store.state.data = {
          users: [],
        };
      }
      this.$store.state.data.users.push(user);
      await this.$store.state.client.db.setJSON(
        this.$store.state.privateKey,
        process.env.VUE_APP_APP_KEY,
        this.$store.state.data,
        this.$store.state.revision + 1
      );
    },
  },
  mounted() {
    this.$store.dispatch("showLoading");
    this.createEvent();
    this.getData();
    this.createSaveUserModal();
    this.$store.dispatch("hideLoading");
  },
};
</script>
