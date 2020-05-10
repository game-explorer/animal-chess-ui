<template>
    <div>
        <div class="cur-user">
            当前为：{{userInfo.camp}}
        </div>
        <div class="chess-board">
            <div class="part"
                 v-for="item in chessBoard"
                 :key="item.camp"
                 :class="[item.camp,
                 {'is-otherCamp':userInfo.camp!==item.camp,
                 'ready-status':gameStatus===GAME_STATUS.READY}]">
                <div class="row" v-for="y in item.y" :key="y">
                    <div class="cell" v-for="x in [0,2,4,6]" :key="x">
                        <span class="text">{{x}}-{{y}}</span>
                        <div class="divide a"></div>
                        <div class="divide b"></div>
                        <template>
                            <div class="circle is-top-left"
                                 :pos="x+'-'+(y+2)"
                                 :class="[lairCaveCls(x,y+2),
                                 'pos-'+piecePos[x+'-'+(y+2)],
                                 {   'is-canMove':isCanMove(x+'-'+(y+2)),
                                     'is-selected':toPointString(clickPos)===x+'-'+(y+2),
                                     'other-piece':otherPiecePos[x+'-'+(y+2)]
                                 }
                                 ]"
                                 @click="clickCircleHandle(y+2,x,$event)"></div>
                            <div class="circle is-center"
                                 :class="['pos-'+piecePos[(x+1)+'-'+(y+1)],
                                   {
                                      'is-canMove':isCanMove((x+1)+'-'+(y+1)),
                                     'is-selected':toPointString(clickPos)===(x+1)+'-'+(y+1),
                                      'other-piece':otherPiecePos[(x+1)+'-'+(y+1)]
                                 }
                                 ]"
                                 :pos="(x+1)+'-'+(y+1)"
                                 @click="clickCircleHandle(y+1,x+1,$event)"></div>
                            <div class="circle is-bottom-left"
                                 :class="[lairCaveCls(x,y),'pos-'+piecePos[x+'-'+y],
                                 {
                                     'is-canMove':isCanMove(x+'-'+y),
                                     'is-selected':toPointString(clickPos)===x+'-'+y,
                                     'other-piece':otherPiecePos[x+'-'+y]
                                 }]"
                                 @click="clickCircleHandle(y,x,$event)"
                            ></div>
                            <div class="circle is-top-right"
                                 :pos="(x+2)+'-'+(y+2)"
                                 :class="['pos-'+piecePos[(x+2)+'-'+(y+2)],
                                 {
                                     'is-canMove':isCanMove((x+2)+'-'+(y+2)),
                                     'is-selected':toPointString(clickPos)===(x+2)+'-'+(y+2),
                                     'other-piece':otherPiecePos[(x+2)+'-'+(y+2)]
                                 }]"
                                 @click="clickCircleHandle(y+2,x+2,$event)"></div>
                            <div class="circle is-bottom-right"
                                 :class="['pos-'+piecePos[(x+2)+'-'+y],
                                 {
                                     'is-canMove':isCanMove((x+2)+'-'+y),
                                     'is-selected':toPointString(clickPos)===(x+2)+'-'+y,
                                     'other-piece':otherPiecePos[(x+2)+'-'+y]
                                 }]"
                                 @click="clickCircleHandle(y,x+2,$event)"></div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="camp-list">
            <div class="camp-item camp-item--1">p2</div>
            <div class="camp-item camp-item--2">p1</div>
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
                    {{animalMap[item]}}{{item}}
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
                GAME_STATUS,
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
                pieces: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
                userId: 0,
                piecePos: {},
                animalMap: ['', '鼠', '猫', '狗', '狼', '豹', '虎', '狮', '象'],
                lairPos: ['4-0', '4-12'],
                cavePos: ['2-4', '2-8', '6-4', '6-8'],
                gameStatus: 2, // 游戏阶段 准备（摆放棋子）、下棋阶段,
                clickPos: null,
                // 另一方的棋子摆放位置
                otherPiecePos: {},
                // canMovePos: []

            }
        },
        computed: {
            canMovePos() {
                if (!this.clickPos) return [];
                let {x, y} = this.clickPos;
                let pointer = this.clickPos.x + '-' + this.clickPos.y;
                //    2.计算可以当前棋子可以走的点

                // x:奇数点：只能走对角线

                // x:（2、4、6）&y!=(0,12)可以上下左右斜杆

                // x:0 & y!(0,12):上、下、右、右下对角线、右上对角线
                // x:8 & y!(0,12):上、下、左 左下对角线、左上对角线

                // x:0 & y=0:走右侧、上侧、右下对角线
                // x:0 & y=12 下、右侧 左上对角线

                // x:8 & y=0:左、上、右下对角线
                // x:8 & 12：左、下 右上对角线

                // 1,1
                let moveArr = [];
                let right = (x + 2) + '-' + y;
                let left = (x - 2) + '-' + y;
                let top = x + '-' + (y + 2);
                let bottom = x + '-' + (y - 2);
                let leftTop = (x - 1) + '-' + (y - 1);
                let leftBottom = (x - 1) + '-' + (y + 1);
                let rightTop = (x + 1) + '-' + (y - 1);
                let rightBottom = (x + 1) + '-' + (y + 1);

                if (x % 2 === 1) {
                    moveArr = [leftTop, leftBottom, rightTop, rightBottom];
                } else if (x !== 0 && x !== 8 && y !== 0 && y !== 12) {
                    moveArr = [
                        top, bottom, left, right, rightTop, leftTop, leftBottom, rightTop
                    ]
                } else if (x === 0 && y !== 0 && y !== 12) {
                    moveArr = [top, bottom, right, rightTop, rightBottom]
                } else if (x === 8 && y !== 0 && y !== 12) {
                    moveArr = [top, bottom, left, leftTop, leftBottom]
                } else {
                    switch (pointer) {
                        case '0-0':
                            moveArr = [top, right, rightTop];
                            break;
                        case '0-12':
                            moveArr = [bottom, right, rightBottom];
                            break;
                        case '8-0':
                            moveArr = [left, top, leftTop];
                            break;
                        case '8-12':
                            moveArr = [left, bottom, leftBottom];
                            break;
                        default:
                            break;
                    }
                }
                moveArr = moveArr.filter((item) => {
                    return !this.piecePos[item]
                });
                return moveArr;
            }
        },
        components: {Room},
        methods: {
            isCanMove(point) {
                return this.canMovePos.find(item => {
                    return item === point;
                })
            },
            lairCaveCls(x, y) {
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
            // 点击原点、或者棋子
            clickCircleHandle(y, x, e) {
                let pointer = `${x}-${y}`;
                console.log('pointer', pointer);
                switch (this.gameStatus) {
                    case GAME_STATUS.READY:
                        // 棋子已经摆放完毕
                        if (this.pieces.length === 0) {
                            return
                        }
                        // 特殊的位置不能摆棋子
                        if (this.lairPos.includes(pointer) || this.cavePos.includes(pointer)) {
                            this.$notify({
                                type: 'warning',
                                message: '兽穴或则山洞不能放旗子！'
                            });
                            return;
                        }
                        // 有棋子的地方不能放棋子
                        if (this.piecePos[pointer]) {
                            this.$notify({
                                type: 'warning',
                                message: '已经有棋子啦！'
                            });
                            return;
                        }
                        this.curPos = pointer;
                        this.isShowPiece = true;
                        break;
                    case GAME_STATUS.PLAYING:
                        let hasPiece = this.piecePos[pointer];
                        console.log('hasPiece', hasPiece);
                        if (hasPiece) {
                            //    1.当前棋子添加提起来的效果
                            this.clickPos = {
                                x: x,
                                y: y
                            };
                        } else {
                            if (!this.isCanMove(pointer)) {
                                this.clickPos = null;
                                // this.canMovePos = [];
                            } else {
                                console.log('moving piece');
                                //  走棋
                                let msg = {
                                    type: SYS_STATUS.MOVE,
                                    raw: {
                                        from: this.toPointString(this.clickPos),
                                        to: pointer
                                    }
                                };
                                this.$ws.send(JSON.stringify(msg));
                            }
                        }
                        break;
                    default:
                        console.error('click circle other status', this.gameStatus);
                        break;
                }
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
            },
            toPointString(point) {
                if (!point) {
                    return ''
                } else {
                    return point.x + '-' + point.y;
                }
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
                            case GAME_STATUS.NO:
                                // this.isShow = true;
                                this.isRoom = true;
                                break;
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
                            case GAME_STATUS.WAIT:
                                this.isRoom = false;
                                if (this.userId === raw.player_id) {
                                    this.userInfo = raw;
                                }
                                this.$notify({type: 'primary', message: '等待队友！'});
                                break;
                            case GAME_STATUS.READY:
                                this.isRoom = false;
                                if (this.userId === raw.player_id) {
                                    this.userInfo = raw;
                                }
                                this.$notify({type: 'primary', message: '游戏开始，请摆放棋子！'});
                                break;
                            case GAME_STATUS.PLAYING:
                                this.isRoom = false;
                                if (this.userId === raw.player_id) {
                                    this.userInfo = raw;
                                }
                                this.gameStatus = GAME_STATUS.PLAYING;
                                break;
                            default:
                                console.error('bug', this.gameStatus);
                                break;
                        }
                        break;
                    case SYS_STATUS.START:
                        this.$notify({type: 'primary', message: '游戏开始！'});
                        break;
                    case SYS_STATUS.TIME_TO:
                        break;
                    //    创建房间
                    case SYS_STATUS.CREATE_ROOM:
                        this.$ws.send(`{"type":"join_room", "raw":{"room_id": ${raw.room_id}}}`);
                        break;
                    //    获取ROOM
                    case SYS_STATUS.GET_ROOM:
                        this.raw = raw;
                        if (!raw.table_pieces['p1']) {
                            raw.table_pieces['p1'] = {
                                pieces: {}
                            }
                        }
                        if (!raw.table_pieces['p2']) {
                            raw.table_pieces['p2'] = {
                                pieces: {}
                            }
                        }
                        console.log('raw', raw);
                        this.piecePos = this.userInfo.camp === 'p1' ? raw.table_pieces['p1'].pieces : raw.table_pieces['p2'].pieces;
                        this.otherPiecePos = this.userInfo.camp === 'p1' ? raw.table_pieces['p2'].pieces : raw.table_pieces['p1'].pieces;
                        console.log('raw', raw);
                        break;
                    case SYS_STATUS.SET_PIECE:
                        if (this.userId === raw.player_id) {

                        } else {
                            this.otherPiecePos = raw.pieces;
                        }
                        break;
                    case SYS_STATUS.MOVE:
                        let animal = this.piecePos[raw.from];
                        console.log('animal', animal);
                        delete this.piecePos[raw.from];
                        // this.piecePos[raw.to] = animal;
                        this.$set(this.piecePos, raw.to, animal);
                        this.clickPos = null;
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
                if (n.length === 0) {
                    console.log('棋子已经放置完成！');
                    let msg = {
                        type: SYS_STATUS.SET_PIECE,
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
    $is-canMove: #7aff6d;
    $pos-list: (pos-1, '鼠', skyblue),
            (pos-2, '猫', pink),
            (pos-3, '狗', #ff92c1),
            (pos-4, '狼', #ff76d3),
            (pos-5, '豹', #42b983),
            (pos-6, '虎', gray),
            (pos-7, '狮', green),
            (pos-8, '象', orange);

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

        &.is-otherCamp.ready-status {
            pointer-events: none;
            opacity: 0.5;
        }
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

            &.is-selected {
                /*border: 2px solid #42b983;*/
                box-shadow: 0 3px 6px 5px #42b983;
            }

            &.is-canMove {
                border: 2px solid $is-canMove;
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

    .other-piece {
        background-color: skyblue !important;
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

            &:last-child {
                .is-bottom-right,
                .is-bottom-left {
                    background: transparent;
                    box-shadow: none;
                }
            }
        }
    }

    .p1 {
        .row {
            @include circle(red);

            &:first-child {
                .is-top-left,
                .is-top-right {
                    background: transparent;
                    box-shadow: none;
                }
            }

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

    .camp-list {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
    }

    .camp-item {
        position: absolute;
        right: 10px;
    }

    .camp-item--1 {
        position: absolute;
        top: 20%;
    }

    .camp-item--2 {
        position: absolute;
        bottom: 20%;
    }


</style>