<template>
    <div class="chess-board">
        <div class="row one" v-for="i in 3" :key="'red-'+i">
            <div class="cell" v-for="j in 4" :key="'red-'+j" :pos="i+'-'+j">
                <span class="text">{{i}}-{{j}}</span>
                <div class="divide a"></div>
                <div class="divide b"></div>
                <template>
                    <div class="circle is-top-left"></div>
                    <div class="circle is-center"></div>
                    <div class="circle is-bottom-left" v-if="i!==3"></div>
                    <div class="circle is-top-right"></div>
                    <div class="circle is-bottom-right" v-if="i!==3"></div>
                </template>
            </div>
        </div>
        <div class="row two" v-for="i in 3" :key="i">
            <div class="cell" v-for="j in 4" :key="j" :pos="i+'-'+j">
                <div class="divide a"></div>
                <div class="divide b"></div>
                <template>
                    <div class="circle is-top-left" v-if="i!==1"></div>
                    <div class="circle is-center"></div>
                    <div class="circle is-bottom-left"></div>
                    <div class="circle is-top-right" v-if="i!==1"></div>
                    <div class="circle is-bottom-right"></div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "chess",
        data() {
            return {
                chessBoard: [
                    'red', 'blue'
                ]
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

    .one {
        @include circle(red);
    }

    .two:not(:first-child) {
        @include circle(blue);
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

</style>