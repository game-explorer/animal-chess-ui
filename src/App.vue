<template>
    <div id="app">
        <Chess v-if="isReady"></Chess>
    </div>
</template>

<script>
    import Vue from 'vue'
    import WebSocket from "./assets/js/sockie";
    import Chess from "./components/Chess";
    import {getUserId as getUserIdApi} from './api/index.js'
    import {mapMutations} from 'vuex'
    import {getAllQuery} from "./assets/js/tool";

    export default {
        name: 'App',
        data() {
            return {
                userId: 0,
                isReady: false
            }
        },
        computed: {},
        components: {
            Chess
        },
        methods: {
            ...mapMutations({
                setUserId: 'setUserId'
            }),
            async getUserIdHandle() {
                try {
                    // 测试代码
                    const query = getAllQuery();
                    if (query.user_id) {
                        this.isReady = true;
                        Vue.prototype.$ws = new WebSocket(parseInt(query.user_id));
                        return;
                    }
                    console.log('this.$route.query.user_id', this.$route);
                    const res = await getUserIdApi();
                    console.log('res', res);
                    this.userId = res.data.id;
                    const path = "ws://192.168.1.80:9000/ws?player_id=" + this.userId;
                    Vue.prototype.$ws = new WebSocket(path)
                    this.isReady = true;
                    this.setUserId(this.userId);

                    // if (parseInt(this.$route.query.user_id) !== this.userId) {
                    //     this.$router.replace({
                    //         query: {
                    //             user_id: this.userId
                    //         }
                    //     })
                    // }
                } catch (err) {
                    console.error(err);
                }
            }
        },
        mounted() {
            this.getUserIdHandle();
        }
    }
</script>

<style>
    body {
        background-color: #f7f8fa;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    * {
        padding: 0;
        margin: 0;
    }
</style>
