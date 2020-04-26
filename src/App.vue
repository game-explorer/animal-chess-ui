<template>
    <div id="app">
        <Chess></Chess>
    </div>
</template>

<script>
    import Chess from './components/Chess.vue'


    export default {
        name: 'App',
        components: {
            Chess
        }
    }
</script>

<style>
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
