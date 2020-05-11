export const GAME_STATUS = {
    NO: 0, // 不在游戏中
    WAIT: 1, // 等待进入游戏
    READY: 2, // 准备摆放棋盘
    PLAYING: 3, // 开启下棋
    END: 4 // 结束游戏
};

export const SYS_STATUS = {
    GAME_STATUS: 'game_status',
    JOIN_ROOM: 'join_room',
    CREATE_ROOM: 'create_room',
    ERROR: 'err',
    GET_ROOM: 'get_room',
    START: 'start',
    TIME_TO: 'time_to',
    MOVE: 'move',
    SET_PIECE: 'set_piece'
};

export const FIT_STATUS = {
    BOTH_DIE: 'bothdie',
    P1_WIN: 'p1win',
    p2_WIN: 'p2win'
};

export const P1 = 'p1';
export const P2 = 'p2';