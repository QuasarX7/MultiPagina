<template>
  <DockMenu
    id="idNavMenu"
    :items="items"
    :on-selected="handleSelected"
    :key="update"
    :theme="{
      primary: '#000',
      secondary: '#21022fdf',
      tertiary: '#000',
      textColor: 'aqua',
      textHoverColor: '#fc7a00c7',
    }"
  />
</template>

<script>
import axios from 'axios';
import { DockMenu } from "vue-dock-menu";
import "vue-dock-menu/dist/vue-dock-menu.css";
import router from "../router";
import { 
  watch, 
  reactive, 
  toRefs, 
  onBeforeMount
  } from 'vue'

export default {
    name : 'NavMenu',
    components: {
        DockMenu
    },
    props:{},
    emits: {
        'selected-topic' : 'selectedTopic'
    },
    setup(props,context) {
        let data = reactive({
            dataFile: null, //dati grezzi del file di configurazione
            update: 0, // numero rendering
            items:[], // voci del menu (ad albero)
            topics:[], // lista pagine
        });

        /**
         * Metodo che gestiscie la selezione di una voce del menu
         * @param {object} oData dati legati alla voce del menu
         * es.: {name: 'Gatto', path: 'animale>mmammifero>carnivoro>felino>gatto'}
         */
        function handleSelected(oData){
            if(oData.path){
                var itemsMenu =String(oData.path).split('>');
                if(itemsMenu.length){
                    var topic = itemsMenu[itemsMenu.length-1];
                    context.emit('selectedTopic', data.topics[topic], 0);
                    router.push(`/argomento/${data.topics[topic]['titolo']}/pagina/0`);
                }
            }
        }
        
        /**
         * Carica il file dal server di configurazione
         */
        onBeforeMount(
            () => {
                const file = "argomenti.json";
                const host = window.location.origin;
                axios.get(host+"/"+file).then(response => {
                    if(response){
                        if(response.data){
                            data.dataFile = response.data; 
                        }
                    }
                });
            }
        );

        /**
         * Funzione ricorsiva che crea dinamicamente il menu dai dai grazzi del file json di configurazione
         * @param {object} rawData dati grezzi del file json di configurazione
         * @param {object} newMenu nodo menu (da costruire)
         * @param {string} targetList nome array dei dati grezzi da analizzare
         */
        function createItems(rawData,newMenu,targetList){
            if(rawData){
                if(rawData[targetList]){
                    for (const row of rawData[targetList]) {
                        var item = {
                            name : row['etichetta']
                        };
                        if(row["contenuto"]){
                            // crea sotto-menu
                            item['menu'] = [];
                            createItems(row,item['menu'],"contenuto");
                        }
                        newMenu.push(item); 
                        if(row["argomento"]){
                            var topic = String(item.name).toLowerCase();
                            data.topics[topic] = row["argomento"];
                        }
                        
                    }
                }
            }
        }

        /**
         * Al caricamento del file di configurazione effettua sia il rendering 
         * che la creazione del menu
         */
        watch(
            () => data.dataFile,//getter della variabile osservata
            () => {
                data.update++;//azione di rendering (:key)
                createItems(data.dataFile,data.items,"menu",'');
            }
        );

        return {
            ...toRefs(data), createItems,handleSelected
        };
    },

}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Turret+Road:wght@800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
#idNavMenu{
    font-family: 'Orbitron', sans-serif;
    font-size: 3rem;
}
ul{
    font-family: 'Orbitron', sans-serif;
    list-style-type: none;
    margin: 0;
    padding: 0;
    text-align: left;
}
</style>