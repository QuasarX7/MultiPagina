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
import { useStore } from 'vuex';
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
    setup() {
        const store = useStore();

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
                    var topic = itemsMenu[itemsMenu.length-1];//titolo menu
                    router.push(`/menu/${topic}/argomento/${data.topics[topic]['titolo']}/pagina/0`);
                    
                    store.dispatch('CURRENT_TOPIC', {
                        name : data.topics[topic]['titolo'], 
                        page : 0,
                        menu : topic
                    });
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
                store.dispatch('START_INIT');
                axios.get(host+"/"+file).then(response => {
                    if(response){
                        if(response.data){
                            data.dataFile = response.data; 
                            console.log('file :>> ', file);
                            store.dispatch('END_INIT');
                        }
                    }
                });
            }
        );

        /**
         * Funzione ricorsiva che crea dinamicamente il menu dai dai grazzi del file json di configurazione.
         * 
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
                        saveTopic(item.name, row['argomento'])
                        
                    }
                    
                }
            }
        }

        /**
         * Salvatagio dei dati.
         * 
         * <pre><code>
         * [1] Esempio codice file configurazione
         * 
         *      {
					"etichetta" : "I 500 Vocaboli più usati", <-- [name]
					"visibile" : true,
					"argomento" : {                           <--- [argomento]
						"titolo" : "Vocaboli",
						"pagine" : [
							{
								"sotto-titolo" : "the",
								"file" : "PagineWeb/Inglese/Dizionario/the.html"
							},
                            ......
                        ]
                    }
                }
                ....
            </code></pre>
         *
         * @param {string} name chiave di ricerca uguale all' [etichetta]
         * @param {object} dataInfo dati dell' [argomento]
         */
        function saveTopic(name, dataInfo){
            if(dataInfo){
                var topic = String(name).toLowerCase();
                data.topics[topic] = dataInfo;
                
                store.dispatch(
                    'SAVE_DATA_FILES_TOPIC', {
                        key : topic,
                        infoPages : dataInfo
                    } 
                );
            }
        }

        /**
         * Al caricamento del file di configurazione effettua sia il rendering 
         * che la creazione del menu
         */
        watch(
            () => data.dataFile,//getter della variabile osservata
            () => {
                console.log('data.update :>> ', data.update);
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