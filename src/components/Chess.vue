<template>
    <div>
        <div class="cur-user">
            当前为：{{userInfo.camp}}
        </div>
        <div class="chess-board">
            <!--            <div class="part p2" :class="{'is-current':userInfo.camp==='p2'}">-->
            <!--                <div class="row" v-for="i in [10,8,6]" :key="'red-'+i">-->
            <!--                    <div class="cell" v-for="j in [0,2,4,6]" :key="'red-'+j" :pos="i+'-'+j">-->
            <!--                        <span class="text">{{i}}-{{j}}</span>-->
            <!--                        <div class="divide a"></div>-->
            <!--                        <div class="divide b"></div>-->
            <!--                        <template>-->
            <!--                            <div class="circle is-top-left"-->
            <!--                                 @click="showPieceHandle(i+2,j,'top-left')"-->
            <!--                                 :class="lairCaveCls(i+2,j)"></div>-->
            <!--                            <div class="circle is-center"-->
            <!--                                 @click="showPieceHandle(i+1,j+1,'center')"></div>-->
            <!--                            <div class="circle is-bottom-left"-->
            <!--                                 @click="showPieceHandle"-->
            <!--                                 v-if="i!==6"></div>-->
            <!--                            <div class="circle is-top-right"-->
            <!--                                 @click="showPieceHandle(i+2,j+2,'top-right')"></div>-->
            <!--                            <div class="circle is-bottom-right"-->
            <!--                                 @click="showPieceHandle"-->
            <!--                                 v-if="i!==6"></div>-->
            <!--                        </template>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->
            <!--            <div class="part p1" :class="{'is-current':userInfo.camp==='p1'}">-->
            <!--                <div class="row" v-for="i in [4,2,0]" :key="i">-->
            <!--                    <div class="cell" v-for="j in [0,2,4,6]" :key="j">-->
            <!--                        <span class="text">{{j}}-{{i}}</span>-->
            <!--                        <div class="divide a"></div>-->
            <!--                        <div class="divide b"></div>-->
            <!--                        <template>-->
            <!--                            <div class="circle is-top-left"-->
            <!--                                 :pos="j+'-'+(i+2)"-->
            <!--                                 :class="lairCaveCls(i+2,j)"-->
            <!--                                 @click="showPieceHandle(i+2,j,'top-left')"-->
            <!--                                 v-if="i!==4"></div>-->
            <!--                            <div class="circle is-center"-->
            <!--                                 :pos="(j+1)+'-'+(i+1)"-->
            <!--                                 @click="showPieceHandle(i+1,j+1,'center')"></div>-->
            <!--                            <div class="circle is-bottom-left"-->
            <!--                                 :class="lairCaveCls(i,j)"-->
            <!--                                 @click="showPieceHandle(i,j,'bottom-left')"-->
            <!--                            ></div>-->
            <!--                            <div class="circle is-top-right"-->
            <!--                                 :pos="(j+2)+'-'+(i+2)"-->
            <!--                                 @click="showPieceHandle(i+2,j+2,'top-right')"-->
            <!--                                 v-if="i!==4"></div>-->
            <!--                            <div class="circle is-bottom-right"-->
            <!--                                 @click="showPieceHandle(i,j+2,'bottom-right')"></div>-->
            <!--                        </template>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->

            <div class="part"
                 v-for="item in chessBoard"
                 :key="item.camp"
                 :class="[item.camp,{'is-current':userInfo.camp===item.camp}]">
                <div class="row" v-for="i in item.y" :key="i">
                    <div class="cell" v-for="j in [0,2,4,6]" :key="j">
                        <span class="text">{{j}}-{{i}}</span>
                        <div class="divide a"></div>
                        <div class="divide b"></div>
                        <template>
                            <div class="circle is-top-left"
                                 :pos="j+'-'+(i+2)"
                                 :class="[lairCaveCls(i+2,j),'pos-'+piecePos[j+'-'+(i+2)]]"
                                 @click="showPieceHandle(i+2,j,'top-left')"
                                 v-if="i!==4"></div>
                            <div class="circle is-center"
                                 :class="['pos-'+piecePos[(j+1)+'-'+(i+1)]]"
                                 :pos="(j+1)+'-'+(i+1)"
                                 @click="showPieceHandle(i+1,j+1,'center')"></div>
                            <div class="circle is-bottom-left"
                                 v-if="i!==6"
                                 :class="[lairCaveCls(i,j),'pos-'+piecePos[j+'-'+i]]"
                                 @click="showPieceHandle(i,j,'bottom-left')"
                            ></div>
                            <div class="circle is-top-right"
                                 :pos="(j+2)+'-'+(i+2)"
                                 :class="['pos-'+piecePos[(j+2)+'-'+(i+2)]]"
                                 @click="showPieceHandle(i+2,j+2,'top-right')"
                                 v-if="i!==4"></div>
                            <div class="circle is-bottom-right"
                                 v-if="i!==6"
                                 :class="['pos-'+piecePos[i+'-'+(j+2)]]"
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
                    {
                        camp: 'p2',
                        y: [10, 8, 6]
                    },
                    {
                        camp: 'p1',
                        y: [4, 2, 0]
                    }
                ],
                roomId: 0,
                isShow: false,
                isRoom: false,
                curPos: '',
                isShowPiece: false,
                // 用户信息
                userInfo: {
                    camp: 'p1'
                },
                pieces: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
                userId: 0,
                piecePos: {},
                animalMap: ['鼠', '猫', '狗', '狼', '豹', '虎', '狮', '象'],
                lairPos: ['4-0', '4-12'],
                cavePos: ['2-4', '2-8', '6-4', '6-8'],
                process: 'ready' // 游戏阶段 准备（摆放棋子）、下棋阶段,

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
                // 棋子已经摆放完毕
                if (this.pieces.length === 0) {
                    return
                }
                console.log('showPieceHandle', x, y, x + '-' + y, pos);
                let pointer = x + '-' + y;

                // 特殊的位置不能摆棋子
                if (this.lairPos.includes(pointer) || this.cavePos.includes(pointer)) {
                    this.$notify({
                        type: 'warning',
                        message: '兽穴或则山洞不能放旗子！'
                    });
                    return;
                }
                // 有棋子的地方不能放棋子
                if (this.piecePos[pointer] || this.piecePos[pointer] === 0) {
                    this.$notify({
                        type: 'warning',
                        message: '已经有棋子啦！'
                    });
                    return;
                }
                this.curPos = pointer;
                this.isShowPiece = true;
            },
            // 选择一个棋子
            selectPieceHandle(index) {
                this.piecePos[this.curPos] = this.pieces[index];
                this.pieces.splice(index, 1);
                console.log('this.piecePos', this.piecePos);
                this.isShowPiece = false;
            },
            getRoom() {
                this.$ws.send(JSON.stringify({type: 'get_room'}))
            }
        },
        mounted() {
            this.userId = parseInt(getAllQuery().user_id);
            this.$ws.addEventListener('message', (event) => {
                let {type, raw} = JSON.parse(event.data);
                switch (type) {
                    // 游戏状态
                    case SYS_STATUS.GAME_STATUS:
                        switch (raw.status) {
                            case GAME_STATUS.WAIT:
                            case GAME_STATUS.READY:
                            case GAME_STATUS.PLAYING:
                                this.isShow = true;
                                this.isRoom = true;
                                this.roomId = raw.room_id;
                                break;
                            default:
                                break
                        }
                        break;
                    //    进入房间
                    case SYS_STATUS.JOIN_ROOM:
                        this.getRoom();
                        switch (raw.status) {
                            case GAME_STATUS.READY:
                            case GAME_STATUS.PLAYING:
                                this.isRoom = false;
                                if (this.userId === raw.player_id) {
                                    this.userInfo = raw;
                                }

                                this.$notify({type: 'primary', message: '游戏开始，请摆放棋子！'});
                                break;
                            default:
                                console.error('bug')
                                break;
                        }
                        break;
                    //    创建房间
                    case SYS_STATUS.CREATE_ROOM:
                        this.$ws.send(`{"type":"join_room", "raw":{"room_id": ${raw.room_id}}}`);
                        break;
                    //    获取ROOM
                    case SYS_STATUS.GET_ROOM:
                        this.raw = raw;
                        this.piecePos = raw.table_pieces[this.userInfo.camp].pieces
                        console.log('raw', raw);
                        break;
                    //    报错
                    case SYS_STATUS.ERROR:
                        this.$notify({
                            type: 'danger',
                            message: raw.msg
                        });
                        break;
                    default:
                        break;
                }

            })
        },
        watch: {
            pieces(n) {
                if (n.length === 14) {
                    console.log('棋子已经放置完成！');
                    let msg = {
                        type: "set-piece",
                        raw: {
                            pieces: this.piecePos
                        }
                    };
                    this.$ws.send(JSON.stringify(msg))
                }
            }
        }
    }
</script>
<style lang="scss">
    $board-color: #999;
    $pos-list: (pos-0, '鼠', skyblue),
            (pos-1, '猫', pink),
            (pos-2, '狗', #ff92c1),
            (pos-3, '狼', #ff76d3),
            (pos-4, '豹', #42b983),
            (pos-5, '虎', gray),
            (pos-6, '狮', green),
            (pos-7, '象', orange);

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

    @mixin animal-piece($cls,$text,$bg) {
        .#{$cls} {
            &::after {
                content: $text;
                line-height: 40px;
                width: 100%;
                height: 100%;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color: #fff;
            }
        }
    }

    @each $cls, $text, $bg in $pos-list {
        @include animal-piece($cls, $text, $bg)
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
                color: #fff;
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