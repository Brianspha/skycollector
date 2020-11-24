<template>
  <div>
    <v-row align="end" justify="end">
      <v-btn @click="createRoom" color="green" block>Play</v-btn>
    </v-row>
    <username />
  </div>
</template>
<script>
import Username from "../widgets/Username.vue";
export default {
  components: { Username },
  data() {
    return {
      rooms: [],
    };
  },

  methods: {
    createRoom() {
      this.$store.state.usernameDialogue = true;
    },
  },
};
</script>

<style>
</style>