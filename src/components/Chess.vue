<template>
    <div class="chess-board">
        <div class="row one" v-for="i in 3" :key="i">
            <div class="cell" v-for="j in 4" :key="j" :pos="i+'-'+j">
                <div class="divide a">
<!--                    <div class="circle"></div>-->
<!--                    <div class="circle"></div>-->
                </div>
                <div class="divide b"></div>
            </div>
        </div>
        <div class="row two" v-for="i in 3" :key="i">
            <div class="cell" v-for="j in 4" :key="j" :pos="i+'-'+j">
                <div class="divide a"></div>
                <div class="divide b"></div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "chess",
        data() {
            return {
                chessBoard: []
            }
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

    @mixin circle-after($selector,$color) {
        .#{$selector} {
            &::after {
                z-index: 10;
                content: "";
                position: absolute;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: $color;
            }
        }
    }

    @mixin circle-before($selector,$color) {
        .#{$selector} {
            &::before {
                z-index: 10;
                content: "";
                position: absolute;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: $color;
            }
        }
    }
    .one {
        @include circle-after('a', #2b6cff);

        .a {
            &::after {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        @include circle-after('b', #2b6cff);
        .b {
            &::after {
                top:0;
                left:0;
                transform: translate(-50%, -50%);
            }
        }
        @include circle-before('b', #2b6cff);
        .b {
            &::before {
                bottom:0;
                left:0;
                transform: translate(-50%, 50%);
            }
        }
    }

    .two {
        @include circle-after('a', #ff6955);

        .a {
            &::after {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }

</style>