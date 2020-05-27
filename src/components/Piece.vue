<template>
    <div class="nav">
        <ul class="nav-list">
            <li class="nav-item">
                <span>鼠
                    <p>x2</p>
                </span>
            </li>
            <li class="nav-item">
                <span>猫</span>
            </li>
            <li class="nav-item">
                <span>狗</span>
            </li>
            <li class="nav-item">
                <span>狼</span>
            </li>
            <li class="nav-item">
                <span>豹</span>
            </li>
            <li class="nav-item">
                <span>虎</span>
            </li>
            <li class="nav-item">
                <span>狮</span>
            </li>
            <li class="nav-item">
                <span>象</span>
            </li>
        </ul>
    </div>

</template>

<script>
    export default {
        name: 'piece-list',
        data() {
            return {}
        }
    }
</script>
<style scoped lang="scss">
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
        /*overflow: hidden;*/
    }

    .nav-item span {
        position: absolute;
        right: 10px;
        bottom: 10px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transform: skew(-45deg) rotate(-67deg) scale(1);
        transition: opacity 0.3s, color 0.3s;
        background: #477eff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: #ebedf0 0 4px 12px;
        color: #fff;
        font-size: 12px;
    }

    .nav-item span:hover {
        background: #ff6f00;
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