<template>
  <v-row justify="center">
    <v-dialog persistent v-model="$store.state.showPurchaseTimeForm">
      <v-card>
        <v-card-title class="headline">Extend Game Time</v-card-title>

        <v-card-text>
          <v-stepper v-model="currentStep" vertical>
            <v-stepper-step :complete="currentStep > 1" step="1">
              Enter Eth Address
              <small>The Ethereum Address to use to purchase time</small>
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="ethAddress"
                  :value="ethAddress"
                  label="Eth Address"
                  outlined
                  counter
                  maxlength="42"
                  :rules="[
                    rules.required,
                    rules.counter,
                    rules.validEthAddress,
                  ]"
                ></v-text-field>
              </v-col>
              <v-btn v-if="ethAddress" color="primary" @click="currentStep = 2">Continue</v-btn>
              <v-btn text>Cancel</v-btn>
            </v-stepper-content>
            <v-stepper-step :complete="currentStep > 2" step="2">Enter Token Address</v-stepper-step>
            <v-stepper-content step="2">
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="tokenAddress"
                  :value="tokenAddress"
                  label="ERC20 Token Address"
                  outlined
                  counter
                  maxlength="42"
                  :rules="[
                    rules.required,
                    rules.counter,
                    rules.validEthAddress,
                  ]"
                ></v-text-field>
              </v-col>
              <v-btn @click="currentStep = 1">Back</v-btn>
              <v-btn v-if="tokenAddress" color="primary" @click="currentStep = 3">Approve</v-btn>
            </v-stepper-content>
            <v-stepper-step :complete="currentStep > 3" step="3">Enter Time to Purchase</v-stepper-step>
            <small>Maximum at a time is 6 minutes</small>
            <v-stepper-content step="3">
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="time"
                  value="0"
                  label="Time"
                  outlined
                  :rules="[rules.required, rules.validNumber, rules.maxTime]"
                ></v-text-field>
              </v-col>
              <v-btn @click="currentStep = 2">Back</v-btn>
              <v-space></v-space>
              <v-btn v-if="time > 0 && time <= 6" color="primary" @click="purchaseTime">Purchase</v-btn>
            </v-stepper-content>
          </v-stepper>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="$store.state.showPurchaseTimeForm = false"
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import utils from "web3-utils";
import Contract from "web3-eth-contract";
import bigNumber from "bignumber.js";
export default {
  data() {
    return {
      startDate: "",
      endDate: "",
      deposit: 0,
      tokenAddress: "",
      time: 0,
      currentStep: 1,
      ethAddress: web3.eth.defaultAccount,
      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) =>
          (!!value && value.length <= 42) || "Max 42 characters",
        validEthAddress: (value) =>
          (!!value && utils.isAddress(value)) || "Invalid Eth Address",
        validNumber: (value) => (!!value && !isNaN(value)) || "Invalid Number",
        maxTime: (value) =>
          (!!value && parseInt(value) > 0 && parseInt(value) <= 6) ||
          "Max Time must be less than equal to 6",
      },
    };
  },
  mounted() {
    this.createShowModalEvent();
    console.log("this.$store ", this.$store);
  },
  methods: {
   
  },
};
</script>
