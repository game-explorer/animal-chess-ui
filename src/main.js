import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './ router/index'


var uid=1;
var ws = new WebSocket("ws://192.168.1.80:9000/ws?player_id=" + uid);

ws.onopen = function() {
    console.log("Connection open ...");
};

ws.onmessage = function (event) {
    let msg = JSON.parse(event.data)
    switch (msg.type) {
        case "create_room":
            // 加入房间
            ws.send(`{"type":"join_room", "raw":{"room_id": ${msg.raw.room_id}}}`);
            break
    }
    console.log("Received Message: " + event.data);
    // ws.close();
};

ws.onclose = function() {
    console.log("Connection closed.");
};

Vue.use(VueRouter);
Vue.config.productionTip = false;

new Vue({
    router,
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
