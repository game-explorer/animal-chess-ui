import Vue from 'vue'
import Vuex from 'vuex'
import {getAllQuery} from "../assets/js/tool";

Vue.use(Vuex)
const query = getAllQuery();
const store = new Vuex.Store({
    state: {
        userId: query.user_id ? parseInt(query.user_id) : 0
    },
    mutations: {
        setUserId(state, data) {
            state.userId = data
        }
    }
});

export default store