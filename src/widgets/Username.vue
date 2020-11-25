<template>
  <v-dialog v-model="$store.state.usernameDialogue" persistent max-width="400">
    <v-card>
      <v-card-title class="headline"> Set Username </v-card-title>
      <v-card-text
        ><v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="username"
            counter
            :rules="[(v) => !!v || 'Username is required']"
            label="Username"
            required
          ></v-text-field> </v-form
      ></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="black darken-1"
          text
          @click="$store.state.usernameDialogue = false"
        >
          Close
        </v-btn>
        <v-btn :disabled="!valid" color="black darken-1" text @click="play()">
          Start
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
var usernameGenerator = require("username-generator");
import { SkynetClient, genKeyPairFromSeed } from "skynet-js";
export default {
  data: () => ({
    username: require("username-generator").generateUsername(),
    valid: false,
  }),
  mounted() {
    console.log("this.username: ", this.valid);
    
  },
  methods: {
    
    play() {
      if (this.$refs.form.validate()) {
        this.$store.state.usernameDialogue = false;
        console.log("this.$route", this.$route);
        localStorage.setItem(
          "user",
          JSON.stringify({ username: this.username })
        );
        this.$router.push("/gameview");
      } else {
        console.log("invalid ");
      }
    },
  },
};
</script>

<style>
</style>