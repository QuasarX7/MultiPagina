<template>
    <transition name="fade" mode="out-in">
        <router-view></router-view>
    </transition>
    <footer>
        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
        </div>
    </footer>
</template>
<script>

export default {
    name: 'App',
    components: {
    },
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Geostar+Fill&display=swap');
#app {
    position: relative;
    font-family: 'Geostar', cursive;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

</style>
