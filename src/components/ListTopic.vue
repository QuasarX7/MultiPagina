<template>
    <nav>
        <ul>
            <li @click="onSelectItem(index)" v-for="(item, index) in menu" :key="item['sotto-titolo']">
                    {{ item["sotto-titolo"] }}
            </li>
        </ul>
    </nav>
</template>

<script>
import router from "../router";
export default {
    name : 'ListTopic',
    props:['name','menu'],
    emits: {
        'selected-item' : 'selectedItem'
    },
    setup(props,context){
        function onSelectItem(index){
            context.emit('selectedItem', index);
            router.push(`/argomento/${props.name}/pagina/${index}`);
        }
        return {onSelectItem};
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Geostar&display=swap');
nav{
    display:inline-block;
    width: 17rem;
}
nav ul{
    background-color: black;
    color: aqua;
    font-family: 'Geostar Fill', cursive;
    list-style-type: none;
    margin: 0;
    padding: 0;
    text-align: left;
}

nav ul > li{
    display: block;
    margin: 0;
    padding: 0.7rem;
    list-style-position:inside;
    border: 1px solid white;
    cursor: pointer;
}
nav ul > li:hover{
    background-color: #3c0457;
    list-style-position:inside;
    color: #ff9100;
}


nav ul > li:active{
    color:red;
}
</style>