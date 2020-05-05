<template>
    <div>
        <div class="cur-user">
            当前为：{{info.camp}}
        </div>
        <div class="chess-board">
            <div class="part p2">
                <div class="row" v-for="i in [10,8,6]" :key="'red-'+i">
                    <div class="cell" v-for="j in [0,2,4,6]" :key="'red-'+j" :pos="i+'-'+j">
                        <span class="text">{{i}}-{{j}}</span>
                        <div class="divide a"></div>
                        <div class="divide b"></div>
                        <template>
                            <div class="circle is-top-left"
                                 @click="showPieceHandle(i+2,j,'top-left')"
                                 :class="lairCaveCls(i+2,j)"></div>
                            <div class="circle is-center"
                                 @click="showPieceHandle(i+1,j+1,'center')"></div>
                            <div class="circle is-bottom-left"
                                 @click="showPieceHandle"
                                 v-if="i!==6"></div>
                            <div class="circle is-top-right"
                                 @click="showPieceHandle(i+2,j+2,'top-right')"></div>
                            <div class="circle is-bottom-right"
                                 @click="showPieceHandle"
                                 v-if="i!==6"></div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="part p1">
                <div class="row" v-for="i in [4,2,0]" :key="i">
                    <div class="cell" v-for="j in [0,2,4,6]" :key="j">
                        <span class="text">{{j}}-{{i}}</span>
                        <div class="divide a"></div>
                        <div class="divide b"></div>
                        <template>
                            <div class="circle is-top-left"
                                 :pos="j+'-'+(i+2)"
                                 :class="lairCaveCls(i+2,j)"
                                 @click="showPieceHandle(i+2,j,'top-left')"
                                 v-if="i!==4"></div>
                            <div class="circle is-center"
                                 :pos="j+'-'+i"
                                 @click="showPieceHandle(i+1,j+1,'center')"></div>
                            <div class="circle is-bottom-left"
                                 :class="lairCaveCls(i,j)"
                                 @click="showPieceHandle(i,j,'bottom-left')"
                            ></div>
                            <div class="circle is-top-right"
                                 :pos="(j+2)+'-'+(i+2)"
                                 @click="showPieceHandle(i+2,j+2,'top-right')"
                                 v-if="i!==4"></div>
                            <div class="circle is-bottom-right"
                                 @click="showPieceHandle(i,j+2,'bottom-right')"></div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <Room :isShow="isShow"
              v-if="isRoom"
              @leaveRoom="leaveRoom"
              @enterRoom="enterRoom"></Room>
        <van-popup v-model="isShowPiece"
                   position="bottom"
                   :style="{ height: '30%' }">
            <ul class="piece-list">
                <li
                        @click="selectPieceHandle(index)"
                        class="piece-item"
                        v-for="(item,index) in pieces" :key="index">
                    {{animalMap[item]}}
                </li>
            </ul>
        </van-popup>
    </div>
</template>
<script>
    import {GAME_STATUS, SYS_STATUS} from "../assets/js/const";
    import Room from '../components/Room'
    import {getAllQuery} from '../assets/js/tool'

    export default {
        name: "chess",
        data() {
            return {
                chessBoard: [
                    'red', 'blue'
                ],
                roomId: 0,
                isShow: false,
                isRoom: false,
                curPos: {},
                isShowPiece: false,
                info: {},
                pieces: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
                userId: 0,
                piecePos: [],
                animalMap: ['鼠', '猫', '狗', '狼', '豹', '虎', '狮', '象']
            }
        },
        components: {Room},
        methods: {
            lairCaveCls(y, x) {
                if ((y === 12 && x === 4) || (y === 0 && x === 4)) {
                    return 'lair'
                } else if ((y === 4 && x === 2) || (y === 4 && x === 6)
                    || (x === 2 && y === 8) || (x === 6 && y === 8)) {
                    return 'cave'
                }
            },
            // 进入房间
            enterRoom(id) {
                if (id) {
                    this.roomId = id
                }
                console.log('enterRoom', this.roomId);
                let msg = {
                    type: SYS_STATUS.JOIN_ROOM,
                    raw: {
                        room_id: this.roomId

                    }
                }
                this.$ws.send(JSON.stringify(msg));
            },
            // 离开房间
            leaveRoom() {
                this.isShow = true;
            },
            // 显示棋子弹窗
            showPieceHandle(y, x, pos) {
                this.isShowPiece = true;
                // let newX = x * 2;
                // let newY = y * 2;

                console.log('showPieceHandle', x, y, pos);
                // console.log('newX:newY', newX, newY)
                // this.cu
            },
            // 选择一个棋子
            selectPieceHandle(index) {
                this.pieces.splice(index, 1);
            }
        },
        mounted() {
            this.userId = parseInt(getAllQuery().user_id);
            this.$ws.addEventListener('message', (event) => {
                let {type, raw} = JSON.parse(event.data);
                switch (type) {
                    case SYS_STATUS.GAME_STATUS:
                        switch (raw.status) {
                            case GAME_STATUS.WAIT:
                            case GAME_STATUS.READY:
                                this.isShow = true;
                                this.isRoom = true;
                                this.roomId = raw.room_id;
                                break;
                            default:
                                break
                        }
                        break;
                    case SYS_STATUS.JOIN_ROOM:
                        switch (raw.status) {
                            case GAME_STATUS.READY:
                                this.isRoom = false;
                                if (this.userId === raw.player_id) {
                                    this.info = raw;
                                }

                                this.$notify({type: 'primary', message: '游戏开始，请摆放棋子！'});
                                break;
                            default:
                                break;
                        }
                        break;
                    case SYS_STATUS.CREATE_ROOM:
                        this.$ws.send(`{"type":"join_room", "raw":{"room_id": ${raw.room_id}}}`);
                        break;
                    default:
                        break;
                }

            })
        }
    }
</script>
<style lang="scss">
    $board-color: #999;
    .chess-board {
        width: 60vh;
        margin: 5vh auto;
        height: 90vh;
        display: inline-flex;
        flex-direction: column;
        min-height: 360px;
        min-width: 240px;
    }

    .part {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
    }


    .row {
        display: flex;
        width: 100%;
        height: 100%;
    }

    .cell {
        flex: 1;
        border: 1px solid $board-color;
        margin: 0 -1px -1px 0;
        position: relative;

        .text {
            position: absolute;

        }
    }

    .divide {
        position: absolute;
        height: 142%;
        width: 1px;
        background-color: $board-color;
        transform-origin: 0 0;


        &.a {
            transform: rotate(-45deg);

        }

        &.b {
            right: 0;
            transform: rotate(45deg);
        }
    }


    @mixin circle($color) {
        .circle {
            z-index: 10;
            content: "";
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: $color;
            box-shadow: 0 3px 3px rgba(0, 0, 0, 0.29);
            cursor: pointer;

            &.is-bottom-left {
                bottom: 0;
                left: 0;
                transform: translate(-50%, 50%);
            }

            &.is-top-left {
                top: 0;
                left: 0;
                transform: translate(-50%, -50%);
            }

            &.is-center {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            &.is-top-right {
                top: 0;
                right: 0;
                transform: translate(50%, -50%);
            }

            &.is-bottom-right {
                bottom: 0;
                right: 0;
                transform: translate(50%, 50%);
            }
        }
    }

    .p2 {
        .row {
            @include circle(blue);

            &:first-child {
                .circle.is-top-left,
                .circle.is-top-right {
                    background: orange;
                }
            }
        }
    }

    .p1 {
        .row {
            @include circle(red);

            &:last-child {
                .circle.is-bottom-left,
                .circle.is-bottom-right {
                    background: orange;
                }
            }
        }
    }


    .two:not(:first-child) {
        @include circle(blue);
    }

    @mixin lairCaveCircle($selector,$text) {
        .#{$selector} {
            width: 40px !important;
            height: 40px !important;

            &::after {
                content: $text;
                line-height: 40px;
                width: 100%;
                height: 100%;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color:#fff;
            }
        }
    }

    @include lairCaveCircle(lair, '兽穴');
    @include lairCaveCircle(cave, '山洞');

    .piece-list {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .piece-item {
        padding: 20px;
        border: 1px solid #eee;
        margin: 10px;
        border-radius: 50%;
        cursor: pointer;

        &:hover {
            background-color: #42b983;
            color: #fff;
        }
    }

</style>