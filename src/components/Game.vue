<template>
  <div></div>
</template>
<script>
import PurchaseTime from "../widgets/PurchaseTime";
export default {
  name: "GameView",
  components: {},
  data: () => ({}),
  mounted() {
  
    this.loadGame();
  },
  methods: {
    loadGame() {
     let gameScript = document.createElement("script");
        gameScript.setAttribute("src", require("../js/main"));
        document.head.appendChild(gameScript);
        window.route = this.$route;
        this.$store.state.usernameDialogue = false;
        
    },
  },
};
</script>
