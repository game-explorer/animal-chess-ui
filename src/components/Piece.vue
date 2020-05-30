<template>
    <div class="nav">
        <ul class="nav-list">
            <template
                    v-for="i in 8">
                <li class="nav-item"
                    :key="i"
                    v-if="getNum(i)">
                    <div class="nav-item__wrapper" @click="selectPieceHandle(i)">
                        <p>{{animalMap[i]}}</p>
                        <p>x{{getNum(i)}}</p>
                    </div>

                </li>
            </template>
        </ul>
    </div>

</template>

<script>
    export default {
        name: 'piece-list',
        props: {
            pieces: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                animalMap: ['', '鼠', '猫', '狗', '狼', '豹', '虎', '狮', '象'],
            }
        },
        methods: {
            getNum(i) {
                let findA = this.pieces.filter((item) => {
                    return item === i
                })
                return findA.length
            },
            selectPieceHandle(i) {
                this.$emit('select', i)
            }
        }
    }
</script>
<style scoped lang="scss">
    $piece-color: #60373E;
    ul, li {
        padding: 0;
        margin: 0;
    }

    li {
        list-style: none;
    }

    .nav {
        width: 200px;
        height: 200px;
        overflow: hidden;
        position: absolute;
        transform: translate(-50%, -50%);
        z-index: 999;
    }

    .nav-item {
        position: absolute;
        width: 100px;
        height: 100px;
        left: 0;
        top: 0;
        transform-origin: 100% 100%;

        .nav-item__wrapper {
            position: absolute;
            right: 10px;
            bottom: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            transform: skew(-45deg) rotate(-67deg) scale(1);
            transition: all 0.3s;
            background: $piece-color;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            cursor: pointer;
            box-shadow: #ebedf0 0 4px 12px;
            color: #fff;
            font-size: 12px;
        }
    }

    .nav-item .nav-item__wrapper:hover {
        background: #ff6f00;
        transform: skew(-45deg) rotate(-67deg) scale(1.2);
    }

    .nav-item:first-child {
        transform: rotate(0deg) skew(45deg);
    }

    .nav-item:nth-child(2) {
        transform: rotate(45deg) skew(45deg);
    }

    .nav-item:nth-child(3) {
        transform: rotate(90deg) skew(45deg)
    }

    .nav-item:nth-child(4) {
        transform: rotate(135deg) skew(45deg);
    }

    .nav-item:nth-child(5) {
        transform: rotate(180deg) skew(45deg);
    }

    .nav-item:nth-child(6) {
        transform: rotate(225deg) skew(45deg);
    }

    .nav-item:nth-child(7) {
        transform: rotate(270deg) skew(45deg);
    }

    .nav-item:nth-child(8) {
        transform: rotate(315deg) skew(45deg);
    }

</style>