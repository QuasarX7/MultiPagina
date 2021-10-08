<!--                                    *************************
                                        *    Menu Principale    *
                                        *************************

     Componente che rappresenta il menu di navigazione principale, esso effettua anche il caricamento del file
     json di configurazione "argomenti" che descrive il comportamento e il funzionamento dell' App. Oltre ad
     Inizializzare i campi del menu, va anche a salvare le informazioni principali del fine json nella memoria
     condivisa "store".

-->
<template>
    <template v-if="touch" >
        <TouchMenu style="margin-top:-60px" :items="items" @on-selected="handleSelected" />
    </template>
    <template v-else>
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
        >
        <template #link-icon>
            <font-awesome-icon icon="feather-alt" size="lg" />
        </template>
        </DockMenu>
    </template>


</template>

<script>
import axios from 'axios';
import { DockMenu } from "vue-dock-menu";
import TouchMenu from './TouchMenu.vue';
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
        DockMenu, TouchMenu
    },
    props:['touch'],
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
                    router.push(`/menu/${topic}/pagina/0`);
                    var audio = new Audio("/sonar.ogg");
                    audio.play();
                    store.dispatch('CURRENT_TOPIC', {
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
                        if(row["visibile"] === undefined || row["visibile"] != false){
                            if(row["contenuto"]){
                                // crea sotto-menu
                                item['menu'] = [];
                                createItems(row,item['menu'],"contenuto");
                            }else{
                                //icona
                                item["iconSlot"] = "link-icon";
                            }
                            newMenu.push(item); 
                            saveTopic(item.name, row['argomento'])
                        }
                        
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
                            .....
                            {
                                "sotto-titolo" : "Gioco aperto",
								"diapositive" : [
									"PagineWeb/scacchi/b.png",
									"PagineWeb/scacchi/b-e4.png",
									"PagineWeb/scacchi/b-e4e5.png"
								]
                            }
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


</style>