<template>
  <nav v-if="list.length > 0">
    <h2>Link</h2>
        <ul>
            <li @click="onSelectItem(item)" v-for="(item, index) in list" :key="index">
                     {{ item["sotto-titolo"] }}
            </li>
        </ul>
    </nav>
</template>

<script>
import router from "../router";
import { useStore } from 'vuex';
export default {
    name : 'PageLinks',
    props: ['list'],
    setup() {
        const store = useStore();
       
        function onSelectItem(item){
          if(item){
            if(item['titolo'] && item['sotto-titolo'] && item['etichetta'])
            var audio = new Audio("/sonar.ogg");
            audio.play();
            router.push(`/menu/${item['etichetta'].toLocaleLowerCase()}/argomento/${item['titolo']}/pagina/${item['id']}`);
            store.dispatch(
                'CURRENT_TOPIC', {
                    name : item['titolo'], 
                    page : item['id'], 
                    menu:  String(item['etichetta']).toLocaleLowerCase()
            });
          } 
        }
        return {onSelectItem};
    }
}
</script>

<style scoped>
nav ul > li{
    display: block;
    margin: 2px;
    padding: 0.7rem;
    list-style-position:inside;
    cursor: pointer;
}
nav ul > li:hover{
    list-style-position:inside;
    color: #ff9100;
    box-shadow:  0px 0px 20px #ff9100;
    border-color: #ff9100;
}


nav ul > li:active{
    color:red;
}
</style>