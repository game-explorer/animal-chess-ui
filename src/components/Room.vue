<template>
    <div class="room">
        <div>
            <van-button
                    @click="createRoom" type="default">创建房间
            </van-button>
            <van-button
                    class="m-l-md"
                    @click="joinRoom" type="primary">加入房间
            </van-button>
            <div class="van-hairline--top m-t-md">
                <!-- 输入任意文本 -->
                <van-field v-model="roomId" label="房间号"/>
            </div>

            <van-dialog v-model="show" title="进入房间?"
                        confirmButtonText="进入房间"
                        cancelButtonText="离开房间"
                        @confirm="enterRoom"
                        @cancel="leaveRoom"
                        show-cancel-button>
            </van-dialog>
        </div>
    </div>
</template>

<script>
    import {ROOM_STATUS} from "../assets/js/const";

    export default {
        name: 'room',
        data() {
            return {
                roomId: 0,
                isShowInput: false,
                show: false,
                raw: {}
            }
        },
        methods: {
            createRoom() {
                this.isShowInput = false;
                console.log(this.$ws);
                let params = {
                    type: 'create_room'
                };
                this.$ws.send(JSON.stringify(params))
            },
            joinRoom() {
                this.isShowInput = true;
                let params = {"type": "join_room", "raw": {"room_id": this.roomId}}
                this.$ws.send(JSON.stringify(params))
            },
            enterRoom() {
                console.log('enterRoom');
                let msg = {
                    type: 'join_room',
                    raw: {
                        room_id: this.raw.room_id

                    }
                }
                this.$ws.send(JSON.stringify(msg));
            },
            leaveRoom() {
                console.log('leaveRoom')
            }
        },
        mounted() {
            this.$ws.addEventListener('message', (event) => {
                let {type, raw} = JSON.parse(event.data);
                switch (type) {
                    case 'game_status':
                        switch (raw.status) {
                            case ROOM_STATUS.WAIT:
                                this.show = true;
                                this.raw = raw;
                                break;
                            case ROOM_STATUS.READY:
                                this.show = true;
                                this.raw = raw;
                                console.log('raw', raw)
                                break;
                            default:
                                break
                        }
                        break;
                    case 'join_room':
                        break;
                    default:
                        break;
                }

            })
        }
    }
</script>
<style lang="scss">
    .room {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>