export default class WebSocketJS {
    constructor(path, options) {
        this.path = path;
        this.ws = new WebSocket(path);
        this.attempts = 0;
        this.options = Object.assign(
            {
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000
            },
            options
        );
        console.log('options', this.options);
        // 心跳检测
        this.heartCheck = {
            clientTimeout: null,
            serverTimeout: null,
            timeout: 3000,
            reset: function () {
                clearTimeout(this.clientTimeout);
                clearTimeout(this.serverTimeout);
                return this
            },
            start: function (ws) {
                this.clientTimeout = setTimeout(() => {
                    ws.send(JSON.stringify({type: 'ping'}));
                    this.serverTimeout = setTimeout(() => {
                        ws.close();
                    }, this.timeout);
                }, this.timeout)
            }
        };

        // 窗口关闭前，关闭ws,防止连接还没有断开就关闭窗口,server端会抛异常
        window.addEventListener('beforeunload', () => {
            this.closeWebsocket();
        });

        this.ws.addEventListener('open', () => {
            console.log("Connection open ...");
            this.heartCheck.reset().start(this.ws);
        });

        this.ws.addEventListener('message', (event) => {
            // 心跳检测
            this.heartCheck.reset().start(this.ws);
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

        this.ws.addEventListener('close', (e) => {
            console.log("Connection closed.", e.code + '原因:' + e.reason);
            console.log(e);
        });

        this.ws.addEventListener("error", (e) => {
            console.error('error', e);
            console.log('uid', uid);
            // 断线重新连接
            if (this.options.reconnection && this.options.reconnectionAttempts > this.attempts) {
                setTimeout(() => {
                    this.attempts++;
                    this.ws = new WebSocketJS(this.path);
                }, this.options.reconnectionDelay)
            }
        });
        // 断网重连
        this.onLineCheck();
        return this.ws
    }

    // 断网重连
    onLineCheck() {
        if (Offline.state === 'down') {
            //    网络已经断开
            console.log('网络已经断开');
            // 重新连接
            this.ws = new WebSocketJS(this.path);
        } else {
            console.log('网络连接成功！');
        }
    }

    closeWebsocket() {
        this.ws.close()
    }
}




