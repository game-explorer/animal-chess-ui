<template>
    <div>
        <van-row class="app-header">
            <van-col span="16">
                <div class="is-flex">
                    <van-circle
                            size="60px"
                            :color="isShouldMoveCamp===userInfo.camp?activeColor:'#999'"
                            v-model="currentRate"
                            :rate="100"
                            :speed="100"
                            :text="userInfo.camp"/>
                    <p class="header__room">房间号：{{userInfo.room_id}}</p>
                </div>
            </van-col>
            <van-col span="8">
                <van-button
                        v-if="diePieces.length"
                        @click="showDieDlgHandle">死亡棋子
                </van-button>
            </van-col>
        </van-row>
        <van-popup v-model="showDieDlg" position="top" :style="{ height: '30%' }">
            <div v-if="!diePieces.length">暂无</div>
            <ul class="piece-list">
                <li
                        class="piece-item"
                        v-for="(item,index) in diePieces" :key="index">{{animalMap[item]}}
                </li>
            </ul>
        </van-popup>

        <div class="chess-board" :class="['current-camp-'+this.userInfo.camp]">
            <div class="part"
                 v-for="item in chessBoard"
                 :key="item.camp"
                 :class="[item.camp,
                 {'is-otherCamp':userInfo.camp!==item.camp,
                 'ready-status':gameStatus===GAME_STATUS.READY}]">
                <div class="row" v-for="y in item.y" :key="y">
                    <div class="cell" v-for="x in [0,2,4,6]" :key="x">
                        <!--                        <span class="text">{{x}}-{{y}}</span>-->
                        <div class="divide a"></div>
                        <div class="divide b"></div>
                        <template>
                            <!--  top-left-->
                            <div class="circle is-top-left"
                                 :pos="x+'-'+(y+2)"
                                 :class="[lairCaveCls(x,y+2),
                                 'pos-'+piecePos[x+'-'+(y+2)],
                                 {   'is-canMove':isCanMove(x+'-'+(y+2)),
                                     'is-selected':toPointString(clickPos)===x+'-'+(y+2)
                                     ||from===join(x,y+2)||to===join(x,y+2),
                                     'other-piece':otherPiecePos[x+'-'+(y+2)]
                                 }
                                 ]"
                                 @click="clickCircleHandle(y+2,x,$event)"></div>
                            <!--  center-->
                            <div class="circle is-center"
                                 :class="['pos-'+piecePos[(x+1)+'-'+(y+1)],
                                   {
                                      'is-canMove':isCanMove((x+1)+'-'+(y+1)),
                                     'is-selected':toPointString(clickPos)===(x+1)+'-'+(y+1)
                                     ||from===join(x+1,y+1)||to===join(x+1,y+1),
                                      'other-piece':otherPiecePos[(x+1)+'-'+(y+1)]
                                 }
                                 ]"
                                 :pos="(x+1)+'-'+(y+1)"
                                 @click="clickCircleHandle(y+1,x+1,$event)"></div>
                            <!--   bottom-left-->
                            <div class="circle is-bottom-left"
                                 :class="[lairCaveCls(x,y),'pos-'+piecePos[x+'-'+y],
                                 {
                                     'is-canMove':isCanMove(x+'-'+y),
                                     'is-selected':toPointString(clickPos)===x+'-'+y
                                     ||from===join(x,y)||to===join(x,y),
                                     'other-piece':otherPiecePos[x+'-'+y]
                                 }]"
                                 @click="clickCircleHandle(y,x,$event)"
                            ></div>
                            <!-- top-right-->
                            <div class="circle is-top-right"
                                 :pos="(x+2)+'-'+(y+2)"
                                 :class="['pos-'+piecePos[(x+2)+'-'+(y+2)],
                                 {
                                     'is-canMove':isCanMove((x+2)+'-'+(y+2)),
                                     'is-selected':toPointString(clickPos)===(x+2)+'-'+(y+2)
                                     ||from===join(x+2,y+2)||to===join(x+2,y+2),
                                     'other-piece':otherPiecePos[(x+2)+'-'+(y+2)]
                                 }]"
                                 @click="clickCircleHandle(y+2,x+2,$event)"></div>
                            <!--  bottom-right-->
                            <div class="circle is-bottom-right"
                                 :pos="(x+2)+'-'+y"
                                 :class="['pos-'+piecePos[(x+2)+'-'+y],
                                 {
                                     'is-canMove':isCanMove((x+2)+'-'+y),
                                     'is-selected':toPointString(clickPos)===(x+2)+'-'+y
                                     ||from===join(x+2,y)||to===join(x+2,y),
                                     'other-piece':otherPiecePos[(x+2)+'-'+y]
                                 }]"
                                 @click="clickCircleHandle(y,x+2,$event)"></div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <Room :isShow="isShow"
              v-if="isRoom"
              @leaveRoom="leaveRoom"
              @enterRoom="enterRoom"></Room>
        <van-dialog v-model="isGameEnd"
                    @confirm="leaveRoom"
                    confirmButtonText="离开房间"
                    title="游戏结束">
            <h3 v-if="winCamp">{{winCamp}}获胜</h3>
        </van-dialog>
        <piece-list
                v-show="isShowPiece"
                :pieces="pieces"
                :style="{
            left:pieceListPos.x+'px',
            top:pieceListPos.y+'px'
                }"
                @select="putPieceHandle"
        ></piece-list>
    </div>
</template>
<script>
    import {GAME_STATUS, SYS_STATUS, FIT_STATUS, P1, P2} from "../assets/js/const";
    import Room from '../components/Room'
    import {getAllQuery} from '../assets/js/tool'
    import PieceList from '../components/Piece.vue'
    import {mapState} from 'vuex'

    const R = 100;
    export default {
        name: "chess",
        data() {
            return {
                GAME_STATUS,
                chessBoard: [
                    {
                        camp: P2,
                        y: [10, 8, 6]
                    },
                    {
                        camp: P1,
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
                    camp: P1
                },
                pieces: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
                // userId: 0,
                piecePos: {},
                animalMap: ['', '鼠', '猫', '狗', '狼', '豹', '虎', '狮', '象'],
                lairPos: ['4-0', '4-12'],
                cavePos: ['2-4', '2-8', '6-4', '6-8'],
                gameStatus: 2, // 游戏阶段 准备（摆放棋子）、下棋阶段,
                clickPos: null,
                // 另一方的棋子摆放位置
                otherPiecePos: {},
                // canMovePos: []
                isShouldMovePlayer: 0,

                isGameEnd: false,
                winCamp: '',
                showDieDlg: false,
                diePieces: [],
                from: '',
                to: '',
                timeout: 2000,
                pieceListPos: {
                    x: 0,
                    y: 0
                },
                currentRate: 100,
                activeColor: '#7aff6d'
            }
        },
        computed: {
            ...mapState({
                userId: state => state.userId
            }),
            canMovePos() {
                if (this.gameStatus !== GAME_STATUS.PLAYING) return []
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
                        top, bottom, left, right, rightTop, leftTop, leftBottom, rightBottom
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
                console.log('moveArr', moveArr);
                moveArr = moveArr.filter((item) => {
                    return !this.piecePos[item] && !(this.cavePos.includes(item) && (this.piecePos[item] || this.otherPiecePos[item]));
                });
                return moveArr;
            },
            isShouldMoveCamp() {
                let currentCamp = this.userInfo.camp;
                let otherCamp = this.otherCamp;
                if (this.gameStatus === GAME_STATUS.PLAYING) {
                    if (this.isShouldMovePlayer === this.userInfo.player_id) {
                        return currentCamp;
                    }
                    return otherCamp
                } else {
                    return currentCamp
                }
            },
            otherCamp() {
                let currentCamp = this.userInfo.camp;
                return currentCamp === P1 ? P2 : P1
            }
        },
        components: {Room, PieceList},
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
                this.$ws.send(JSON.stringify({
                    type: SYS_STATUS.LEAVE_ROOM
                }))
            },
            // 点击原点、或者棋子
            clickCircleHandle(y, x, e) {
                console.log('e', e);
                let pointer = `${x}-${y}`;
                if (this.clickPos && this.clickPos.x === x && this.clickPos.y === y) {
                    this.clickPos = null;
                    return;
                }
                console.log('pointer', pointer);
                switch (this.gameStatus) {
                    case GAME_STATUS.READY:
                        // 棋子已经摆放完毕
                        if (this.pieces.length === 0) {
                            return
                        }
                        // 特殊的位置不能摆棋子
                        if (this.lairPos.includes(pointer) ||
                            this.cavePos.includes(pointer)
                            || y === 0 || y === 12) {
                            this.$notify({
                                type: 'warning',
                                message: '兽穴或则山洞、第一排、最后一排不能放旗子！'
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
                        this.clickPos = {
                            x: x,
                            y: y
                        };


                        this.pieceListPos = this.updatePos({
                            x: e.clientX,
                            y: e.clientY + document.documentElement.scrollTop
                        });
                        this.isShowPiece = true;
                        break;
                    case GAME_STATUS.PLAYING:
                        let hasPiece = this.piecePos[pointer];
                        console.log('hasPiece', hasPiece);
                        if (hasPiece) {
                            if (this.isShouldMovePlayer === this.userId) {
                                //    1.当前棋子添加提起来的效果
                                this.clickPos = {
                                    x: x,
                                    y: y
                                };
                            } else {
                                this.$notify({
                                    type: 'warning',
                                    message: '当前不该你走棋子！'
                                })
                            }

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

            showDieDlgHandle() {
                this.showDieDlg = true;
                this.getRoom();
            },

            // 摆放棋子
            putPieceHandle(piece) {
                console.log('putPieceHandle', piece);
                this.piecePos[this.curPos] = piece;
                let index = this.pieces.findIndex(item => {
                    return item === piece
                });
                if (index !== -1) {
                    this.pieces.splice(index, 1);
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
            },
            join(x, y) {
                return x + '-' + y
            },
            // 点击位置：边界情况处理
            updatePos(point) {
                const viewW = screen.width;
                if (point.x < R) {
                    point.x = R
                    point.x = R
                } else if (point.x > viewW - R) {
                    point.x = viewW - R;
                }

                if (point.y < R) {
                    point.y = R;
                }
                return point;
            }
        },
        mounted() {
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
                            case GAME_STATUS.END:
                                this.isGameEnd = true;
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
                        this.isShouldMovePlayer = raw.player_id;
                        this.gameStatus = GAME_STATUS.PLAYING;
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
                                pieces: {},
                                die: []
                            }
                        }
                        if (!raw.table_pieces['p2']) {
                            raw.table_pieces['p2'] = {
                                pieces: {},
                                die: []
                            }
                        }
                        this.piecePos = raw.table_pieces[this.userInfo.camp].pieces;
                        this.otherPiecePos = this.userInfo.camp === 'p1' ? raw.table_pieces['p2'].pieces : raw.table_pieces['p1'].pieces;
                        // 已经死亡的棋子
                        this.diePieces = raw.table_pieces[this.userInfo.camp].die || [];
                        break;
                    case SYS_STATUS.SET_PIECE:
                        if (this.userId === raw.player_id) {

                        } else {
                            this.otherPiecePos = raw.pieces;
                        }
                        break;
                    case SYS_STATUS.MOVE:
                        // 走棋提示
                        this.from = raw.from;
                        this.to = raw.to;
                        // setTimeout(() => {
                        //     this.from = '';
                        //     this.to = '';
                        // }, this.timeout);
                        switch (raw.fit_result) {
                            case FIT_STATUS.BOTH_DIE:
                                console.log('both die');
                                // 当前玩家：是否是操作游戏的人，是的话，则移除当前的from,对方的to位置
                                if (this.userId === raw.player_id) {
                                    delete this.piecePos[raw.from];
                                    delete this.otherPiecePos[raw.to];
                                } else {
                                    delete this.piecePos[raw.to];
                                    delete this.otherPiecePos[raw.from];
                                    this.from = '';
                                    this.to = '';
                                }
                                this.$notify({type: 'danger', message: 'both die'});
                                break;
                            case FIT_STATUS.P1_WIN:
                            case FIT_STATUS.p2_WIN:
                                let map = {
                                    [FIT_STATUS.P1_WIN]: P1,
                                    [FIT_STATUS.p2_WIN]: P2,
                                };

                                console.log('current camp', this.userInfo.camp, map[raw.fit_result]);
                                if (this.userInfo.camp === map[raw.fit_result]) {
                                    // 当前玩家胜利：移除对方棋子，
                                    // 移动当前玩家的棋子(主动，发生了移动操作)，被动：则无需移动棋子
                                    console.log('raw.play_id === this.userId', raw.player_id === this.userId);
                                    if (raw.player_id === this.userId) {
                                        let animal = this.piecePos[raw.from];
                                        console.log('animal', animal);
                                        delete this.piecePos[raw.from];
                                        this.$set(this.piecePos, raw.to, animal);

                                        delete this.otherPiecePos[raw.to];
                                    } else {
                                        delete this.otherPiecePos[raw.from];
                                    }
                                } else {
                                    if (raw.player_id === this.userId) {
                                        // 对方玩家获胜：移除当前玩家的棋子
                                        delete this.piecePos[raw.from];
                                    } else {
                                        delete this.otherPiecePos[raw.from];
                                        this.$set(this.otherPiecePos, raw.to, -1);
                                        delete this.piecePos[raw.to];
                                    }
                                }
                                this.$notify({type: 'primary', message: map[raw.fit_result] + 'win!'});
                                break;
                            default:
                                // 对方玩家
                                if (this.userId !== raw.player_id) {
                                    delete this.otherPiecePos[raw.from];
                                    this.$set(this.otherPiecePos, raw.to, -1);
                                    console.log('otherPiecePos', this.otherPiecePos)
                                } else {
                                    // 当前玩家
                                    let animal = this.piecePos[raw.from];
                                    console.log('animal', animal);
                                    delete this.piecePos[raw.from];
                                    this.$set(this.piecePos, raw.to, animal);
                                }
                                break;

                        }
                        this.clickPos = null;
                        break;
                    case SYS_STATUS.END:
                        if (this.userId === raw.win_player_id) {
                            this.winCamp = this.userInfo.camp;
                        } else {
                            this.winCamp = this.otherCamp;
                        }
                        this.isGameEnd = true;
                        break;
                    case SYS_STATUS.LEAVE_ROOM:
                        this.isShow = false;
                        this.isRoom = true;
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
            document.addEventListener('click', () => {
                if (this.gameStatus === GAME_STATUS.READY) {
                    this.isShowPiece = false;
                    this.clickPos = null;
                }
            }, true);

            let timeId = 0;
            window.addEventListener('resize', (e) => {
                if (this.isShowPiece) {
                    clearTimeout(timeId);
                    timeId = setTimeout(() => {
                        let targetDom = document.querySelector('.is-selected');
                        if (targetDom) {
                            let rect = targetDom.getBoundingClientRect();
                            this.pieceListPos = this.updatePos({
                                x: rect.x + 8,
                                y: rect.y + 8 + document.documentElement.scrollTop
                            })
                        }
                    }, 500);
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
    $other-piece: #7d5a5a;

    $p1-color: #00a1ab;
    $p2-color: #bb3b0e;
    $active-color: #a8df65;

    $pos-list: (pos-1, '鼠'),
            (pos-2, '猫'),
            (pos-3, '狗'),
            (pos-4, '狼'),
            (pos-5, '豹'),
            (pos-6, '虎'),
            (pos-7, '狮'),
            (pos-8, '象');

    .chess-board {
        width: 60vh;
        margin: 5vh auto;
        height: 90vh;
        display: inline-flex;
        flex-direction: column;
        min-height: 360px;
        min-width: 240px;

        @media (max-width: 640px) {
            height: 480px;
            width: 320px;
        }
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
            width: 16px;
            height: 16px;
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
                box-shadow: 0 3px 6px 5px $active-color!important;
            }

            &.is-canMove {
                border: 2px solid $is-canMove;
            }
        }
    }

    @mixin animal-piece($cls,$text,$bg) {
        .#{$cls} {
            width: 30px !important;
            height: 30px !important;

            &::after {
                content: $text !important;
                line-height: 30px;
                width: 100%;
                height: 100%;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color: #fff;
            }
        }
        @at-root {
            .current-camp-p1 {
                .#{$cls} {
                    background-color: $p1-color !important;
                }
            }

            .current-camp-p2 {
                .#{$cls} {
                    background-color: $p2-color !important;
                }
            }
        }
    }

    @each $cls, $text, $bg in $pos-list {
        @include animal-piece($cls, $text, $bg)
    }

    .other-piece {
        width: 30px !important;
        height: 30px !important;
        background-color: $other-piece !important;
    }


    .p2 {
        .row {
            @include circle($p2-color);

            /*&:first-child {*/
            /*    .circle.is-top-left,*/
            /*    .circle.is-top-right {*/
            /*        background: orange;*/
            /*    }*/
            /*}*/

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
            @include circle($p1-color);

            &:first-child {
                .is-top-left,
                .is-top-right {
                    background: transparent;
                    box-shadow: none;
                }
            }

            /*&:last-child {*/
            /*    .circle.is-bottom-left,*/
            /*    .circle.is-bottom-right {*/
            /*        background: orange;*/
            /*    }*/
            /*}*/
        }
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


    .app-header {
        padding: 5px 0;
        display: flex;
        align-items: center;
    }

    .is-flex {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header__room {
        margin-left: 10px;
    }

</style>