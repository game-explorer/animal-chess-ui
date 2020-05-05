export default class WebSocketJS {
    constructor(uid) {
        const url = "ws://192.168.1.80:9000/ws?player_id=" + uid;
        this.ws = new WebSocket(url);
        this.ws.addEventListener('open', () => {
            console.log("Connection open ...");
        });
        this.ws.addEventListener('message', (event) => {
            let msg = JSON.parse(event.data);
            console.log('msg', msg);
            switch (msg.type) {
                case "create_room":
                    // 加入房间
                    break;
                case "game_status":
                    break;
                default:
                    break;
            }
            console.log("Received Message: " + event.data);
        });
        this.ws.addEventListener('close', () => {
            console.log("Connection closed.");
        });
        this.ws.addEventListener("error", (e) => {
            console.error('error', e);
        });
        return this.ws
    }
}




