import Vue from 'vue'
import App from './App.vue'
// import Vuex from 'vuex'
import store from './store/index'
// import WebSocket from "./assets/js/sockie";
import vueRouter from 'vue-router'
import router from './ router/index.js'
import {getAllQuery} from './assets/js/tool'
import './assets/css/common.scss'
import {Button, Field, Dialog, Notify, Popup, NoticeBar, Col, Row, Circle} from 'vant';

Vue.use(Button);
Vue.use(Field);
Vue.use(Dialog);
Vue.use(Notify);
Vue.use(Popup);
Vue.use(NoticeBar);
Vue.use(Col);
Vue.use(Row);
Vue.use(Circle);
Vue.use(vueRouter);
// Vue.use(Vuex);

Vue.config.productionTip = false;

const query = getAllQuery();
console.log('query', query);
// Vue.prototype.$ws = new WebSocket(query.user_id);
new Vue({
    router,
    store,
    sockets: {
        connect: function () {
            console.log('socket connected')
        },
        customEmit: function () {
            console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        }
    },
    render: h => h(App),
}).$mount('#app');
