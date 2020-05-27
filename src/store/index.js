import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        userId: 0
    },
    mutations: {
        setUserId(state, data) {
            state.userId = data
        }
    }
});

export default store