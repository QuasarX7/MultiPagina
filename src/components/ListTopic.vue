<template>
    <nav v-if="menu.length > 0">
        <h3><font-awesome-icon icon="jedi" size="2x"/> Pagine</h3>
        <ul>
            <li @click="onSelectItem(index)" v-for="(item, index) in menu" :key="item['sotto-titolo']">
                    {{index+ 1}} . {{ item["sotto-titolo"] }}
            </li>
        </ul>
    </nav>
</template>

<script>
import router from "../router";
import { useStore } from 'vuex';
export default {
    name : 'ListTopic',
    props:['name','menu','nameMenuBar'],
    setup(props){
        const store = useStore();
       

        function onSelectItem(index){
            var audio = new Audio("/sonar.ogg");
            audio.play();
            router.push(`/menu/${props.nameMenuBar}/argomento/${props.name}/pagina/${index}`);
            store.dispatch(
                'CURRENT_TOPIC', {
                    name : props.name, 
                    page : index, 
                    menu: props.nameMenuBar
            });
        }
        return {onSelectItem};
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Geostar&display=swap');
nav{
    display:inline-block;
    width: 20rem;
    height: 40rem;
    overflow-y:auto;
}
nav ul{
    background-color: rgb(255, 255, 255);
    color: white;
    font-family: 'Geostar Fill', cursive;
    list-style-type: none;
    margin-right: 0.5rem;
    padding: 0;
    text-align: left;
    box-shadow: 5px 5px 5px gray;
}

nav ul > li{
    display: block;
    margin: 2px;
    padding: 0.7rem;
    list-style-position:inside;
    border: 1px solid black;
    background-color: rgb(0, 68, 85);
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

nav h3{
    text-shadow: 0 0 3px aqua;
}
</style>