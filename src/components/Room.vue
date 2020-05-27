<template>
    <div class="room">
        <div>
            <van-button
                    @click="createRoom" type="default">创建房间
            </van-button>
            <van-button
                    class="m-l-md"
                    @click="showRoomInput" type="primary">加入房间
            </van-button>

            <van-dialog v-model="show" title="进入房间?"
                        confirmButtonText="进入房间"
                        cancelButtonText="离开房间"
                        @confirm="enterRoom"
                        @cancel="leaveRoom"
                        show-cancel-button>
            </van-dialog>
            <van-dialog v-model="isShowEnterRoom"
                        show-cancel-button
                        @confirm="enterRoom"
                        title="加入房间">
                <van-field
                        style="margin-top:20px;"
                        v-model="roomId"
                        name="房间号"
                        label="房间号"
                        placeholder="请输入房间号"
                />
            </van-dialog>
        </div>
    </div>
</template>

<script>
    import {SYS_STATUS} from "../assets/js/const";

    export default {
        name: 'room',
        data() {
            return {
                roomId: 0,
                isShowInput: false,
                show: false,
                isShowEnterRoom: false
            }
        },
        props: {
            isShow: {
                type: Boolean
            }
        },
        methods: {
            // 创建房间
            createRoom() {
                this.isShowInput = false;
                let params = {
                    type: SYS_STATUS.CREATE_ROOM
                };
                this.$ws.send(JSON.stringify(params))
            },
            // 显示输入房间号的input框
            showRoomInput() {
                // this.isShowInput = true;
                this.isShowEnterRoom = true;
            },
            // 进入房间
            enterRoom() {
                this.$emit('enterRoom', Number(this.roomId));
            },
            // 离开房间
            leaveRoom() {
                this.$emit('leaveRoom');
            }
        },
        mounted() {
            this.show = this.isShow
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
        position: fixed;
        left: 0;
        top: 0;
        background-color: #f7f8fa;
        z-index: 10;
    }

</style>