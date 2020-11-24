require('dotenv').config({ path: './.env' })
import Vue from "vue";
import Vuex from "vuex";
import Swal from "sweetalert2";
import "js-loading-overlay";
import bigNumber from "bignumber.js";
import "js-loading-overlay";
import generateUsername from "random-username-generator";
console.log("JsLoadingOverlay ", JsLoadingOverlay);
Vue.use(Vuex);
generateUsername.setAdjectives(["guest"]);
var new_username = generateUsername.generate();
export default new Vuex.Store({
    state: {
        usernameDialogue: false,
        room: false,
        createRoom: false,
        username: new_username,
        record: false,
        showPlay: false,
    },
    mutations: {},
    actions: {
        showAlert(state, payload) {
            Swal.fire("Alert", payload.message, "warning");
        },
        showSuccess(state, payload) {
            Swal.fire("Success", payload.message, "success");
        },
        hideLoading() {
            JsLoadingOverlay.hide();
        },
        showLoading() {
            JsLoadingOverlay.show({ spinnerIcon: "ball-pulse-rise" });
        },
        calculateDeposit(state, payload) {
            console.log("payload", payload);
            var diff = payload.deposit.minus(
                payload.deposit.minus(payload.deposit.mod(payload.delta))
            );
            payload.deposit = new bigNumber(payload.deposit).minus(diff);
            console.log("deposit.toFixed(): ", payload.deposit.toFixed());
            return payload.deposit.toFixed();
        },
    },
    modules: {},
});