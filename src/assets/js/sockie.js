export default class WebSocketJS {
    constructor(uid) {
        const url = "ws://192.168.1.80:9000/ws?player_id=" + uid;
        this.ws = new WebSocket(url);
        this.timeout = 3000;
        this.uid = uid;
        this.clientTimeout = null;
        this.serverTimeout = null;
        this.heartCheck = {
            reset: function () {
                clearTimeout(this.clientTimeout);
                clearTimeout(this.serverTimeout);
            },
            start: function () {
                this.clientTimeout = setTimeout(() => {
                    this.ws.send('ping');
                    this.serverTimeout = setTimeout(() => {
                        this.ws.close();
                    }, this.timeout);
                }, this.timeout)
            }
        };
        this.ws.addEventListener('open', () => {
            console.log("Connection open ...");
            // this.heartCheck.start.apply(this);
        });
        this.ws.addEventListener('message', (event) => {
            let msg = JSON.parse(event.data);
            switch (msg.type) {
                case "create_room":
                    // 加入房间
                    break;
                case "game_status":
                    break;
                case 'pong':
                    break;
                default:
                    break;
            }
            console.log("Received Message: " + event.data);
        });
        this.ws.addEventListener('close', () => {
            console.log("Connection closed.");
            // this.ws = new WebSocketJS(uid);
        });
        this.ws.addEventListener("error", (e) => {
            console.error('error', e);
        });
        // this.onLineCheck();
        return this.ws
    }

    heartCheck() {
    }

    onLineCheck() {
        if (Offline.state === 'down') {
            //    网络已经断开
            console.log('网络已经断开');
            // 重新连接
            this.ws = new WebSocketJS(this.uid);
        } else {
            console.log('网络连接成功！');
        }
    }
}




