<template>
    <router-view></router-view>
    <footer>
        <div id="nav">
            <router-link to="/"><font-awesome-icon icon="home" size="2x"/></router-link> |
            <router-link to="/about"><font-awesome-icon icon="info-circle" size="2x"/></router-link>
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
#app {
    width: 100%;
    position: relative;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
