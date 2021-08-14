<template>

    <nav-menu id="navMenu" v-if="window.dy <= 0" />
   
    <header v-if="titlePage" >
        <h1>{{title}}</h1>
        <input class="titleSearch"  
            type="search" list="listTitlePage" autocorrect="true"
            :value="titlePage" 
            @focus="focusTitlePage"
            @blur="blurTitlePage" 
            @change="selectTitlePage"
        />
        <datalist id="listTitlePage">
            <option v-for="(item,index) in list" :key="index" :value="item['sotto-titolo']" />
        </datalist>
        
        <nav>
            <div v-if="id_pagina > 0" @click="onFirst()" class="buttonNav">
                <font-awesome-icon icon="angle-double-left"/>
            </div>
            <div v-else class="buttonNav" />

            <div v-if="id_pagina > 0" @click="onPrevious()" class="buttonNav">
                <font-awesome-icon icon="angle-left"/>
            </div>
            <div v-else class="buttonNav" />

            <div class="indexPageNav"> pag. <input size="3"  @change="onChange" :value="Number(id_pagina) +1" /></div>
            
            <div v-if="id_pagina < list.length-1" @click="onNext()" class="buttonNav">
                <font-awesome-icon icon="angle-right"/>
            </div>
            <div v-else class="buttonNav" />

            <div v-if="id_pagina < list.length-1" @click="onLast()" class="buttonNav">
                <font-awesome-icon icon="angle-double-right"/>
            </div>
            <div v-else class="buttonNav" />
            
        </nav>
    </header>
    <main>
        
        <nav class="menuPage">
            <list-topic :name="title" :menu="list" :nameMenuBar="nameItemMenu"  />
        </nav>
        <section v-if="pageFile" class="areaMain">
            <!-- area pagina -->
            <article class ="page" v-html="pageFile" />

            <!-- area note -->
            <article class ="note" ><p style="color:red; padding:1rem">Attenzione: sito è in fase di costruzione!</p></article>
        </section>
        <section v-else-if="slides.length > 0" class="areaMain">
            <!-- area slide -->
            <article class ="slides">
                <view-slides :images="slides"/>
            </article>
            
            <!-- area note -->
            <article class ="note"><div style="background: red;padding:1rem">Attenzione: sito è in fase di costruzione!</div>
                <!-- note pagina -->
                <div v-if="notePage" style="padding:1rem">
                    <h2 style="padding:1rem">Info:</h2>
                    {{notePage}}
                </div>
                <!-- link -->
                <page-links :list="links" />
            </article>
        </section>
        <section v-else>
            <img style='height: 90%; width: 90%; object-fit: contain' src="note.jpg" />
        </section>
    </main>

    <nav v-if="window.y > window.height">
            <div v-if="id_pagina > 0" @click="onFirst()" class="buttonNav">
                <font-awesome-icon icon="angle-double-left"/>
            </div>
            <div v-else class="buttonNav" />

            <div v-if="id_pagina > 0" @click="onPrevious()" class="buttonNav">
                <font-awesome-icon icon="angle-left"/>
            </div>
            <div v-else class="buttonNav" />

            <div class="indexPageNav"> pag. <input size="3"  @change="onChange" :value="Number(id_pagina) +1" /></div>
            
            <div v-if="id_pagina < list.length-1" @click="onNext()" class="buttonNav">
                <font-awesome-icon icon="angle-right"/>
            </div>
            <div v-else class="buttonNav" />

            <div v-if="id_pagina < list.length-1" @click="onLast()" class="buttonNav">
                <font-awesome-icon icon="angle-double-right"/>
            </div>
            <div v-else class="buttonNav" />
            
        </nav>
    
</template>

<script>
import NavMenu from '../components/NavMenu.vue'
import ListTopic from '../components/ListTopic.vue'
import Slides from '../components/Slides.vue'
import {reactive, toRefs, onMounted,  watch, computed} from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import router from "../router"
import PageLinks from '../components/PageLinks.vue'



export default {
    name: 'MultiPages',
    props:[
      'id_menu',
      'id_argomento',
      'id_pagina'
    ],
    components: {
        'nav-menu' : NavMenu,
        'list-topic' : ListTopic,
        'view-slides': Slides,
        'page-links': PageLinks
    },
    setup(props) {
        const store = useStore();
        const  LEN_MENU_PAGE = '20rem';
       

        let data = reactive({
            title : '',
            titlePage : '',
            list : [],
            pageFile : null,//< code file
            slides : [],// image list
            links : [], // note (links)
            notePage : "",
            nameItemMenu : '',

            window : {
                width : 0,
                height : 0,
                x:  0,
                y:  0,
                dx: 0,
                dy: 0
            },

            style : {
                title : { 
                    size : computed( () => {
                        return screen(
                            () => '3rem',
                            () => '2.5rem',
                            () => '2.2rem',
                            () => '2rem',
                            () => '1.9rem'
                        );
                    })
                },
                menuPage : {
                    display : computed(() => {
                        return screen(
                            () => 'inline-block',
                            () => 'inline-block',
                            () => 'none',
                            () => 'none',
                            () => 'none'
                        );
                    }),
                    length : computed(() => {
                        return screen(
                            () => LEN_MENU_PAGE,
                            () => LEN_MENU_PAGE,
                            () => '0',
                            () => '0',
                            () => '0'
                        );
                    }),
                    
                },
                mainArea : {
                    align : computed(() => {
                        return screen(
                            () => 'left',
                            () => 'left',
                            () => 'center',
                            () => 'center',
                            () => 'center'
                        );
                    }),
                },
                page : {
                    length : computed(() => {
                        return screen(
                            () => '75%',
                            () => '75%',
                            () => '100%',
                            () => '100%',
                            () => '100%'
                        );
                    }),
                    text : computed(() => {
                        return screen(
                            () => '1.5rem',
                            () => '1.5rem',
                            () => '1.3rem',
                            () => '1.1rem',
                            () => '1.0rem'
                        );
                    }),
                },
                img : {
                    length : computed(() => {
                        return screen(
                            () => '70%',
                            () => '70%',
                            () => '100%',
                            () => '100%',
                            () => '100%'
                        );
                    }),
                    align : computed(() => {
                        return screen(
                            () => 'left',
                            () => 'left',
                            () => 'left',
                            () => 'none',
                            () => 'none'
                        );
                    }),
                },
                note : {
                    display : computed(() => {
                        return screen(
                            () => 'inline-block',
                            () => 'inline-block',
                            () => 'block',
                            () => 'block',
                            () => 'block'
                        );
                    }),
                    length : computed(() => {
                        return screen(
                            () => '25%',
                            () => '25%',
                            () => '100%',
                            () => '100%',
                            () => '100%'
                        );
                    }),
                },
                button : {
                    size : computed(() => {
                        return screen(
                            () => '3rem',
                            () => '3rem',
                            () => '2.5rem',
                            () => '2rem',
                            () => '1.8rem'
                        );
                    }),
                }
            }

            
        });

        /**
         * Determina il tipo di schermo in base alla lunghezza della finestra.
         * 
         * @param {function} fnDesktop          lunghezza finestra  > 1200px
         * @param {function} fnLaptops          lunghezza finestra  > 992px e <= 1200px
         * @param {function} fnTableLandscape   lunghezza finestra  > 765px e <= 992px
         * @param {function} fnTablePortrait    lunghezza finestra  > 600px e <= 768px
         * @param {function} fnPhone            lunghezza finestra  <= 600px 
         * @returns {*} valori di una delle funzioni passate come argomento
         */
        function screen(fnDesktop,fnLaptops,fnTableLandscape,fnTablePortrait,fnPhone){
            var width = window.screenWidth;
            if(data.window.width){
                width = data.window.width;
            }
            if(width > 1200 ){
                return fnDesktop();

            }else if(width > 992 && width <= 1200){
                return fnLaptops();

            }else if(width > 768 && width <= 992){
                return fnTableLandscape();

            }else if(width > 600 && width <= 768){
                return fnTablePortrait();

            }else{
                return fnPhone();
            }
        }

        function initSizeWindow(){
            data.window.width  = Math.min(window.screen.width,window.innerWidth);
            data.window.height = Math.min(window.screen.height,window.innerHeight);
        }

        onMounted(() => {
            initSizeWindow();
            window.addEventListener('resize', ()=>{
                initSizeWindow();
            });

            window.addEventListener('scroll',() =>{
                initSizeWindow();
                
                data.window.dx = window.scrollX - data.window.x;
                data.window.dy = window.scrollY - data.window.y;
                data.window.x= window.scrollX;
                data.window.y= window.scrollY;
            });
           
        });

        /**
         * (fase iniziale) 
         * Fine caricamento file JSON di configurazione
         */
        watch(
            [() => store.getters.isBuild],
            () =>{
                store.dispatch('CURRENT_TOPIC', {
                    name : props.id_argomento, 
                    page : props.id_pagina,
                    menu : props.id_menu
                });
                init();
            }
        );
        
        /**
         * All'aggiornamento della pagina al variare dello stato della props 'id_argomento' o 'id_pagina'
         */
        watch(
            [
                () => props.id_argomento,
                () => props.id_pagina,
                () => props.id_menu,
            ],
            () => {
                init();
            }
        );


        
        /**
         * Inizializza e caricamento della pagina
         */
        function init(){
    
            if(store.getters.listPages)
                data.list=store.getters.listPages;

            if(store.getters.titleMenuBar)
                data.nameItemMenu=store.getters.titleMenuBar;

            if(store.getters.title)
                data.title=store.getters.title;
    
            if(store.getters.titlePage)
                data.titlePage=store.getters.titlePage;

            if(store.getters.file){
                loadFilePage(store.getters.file);
                data.slides = [];
            }else if(Array.isArray(store.getters.imageList)){
                data.slides = store.getters.imageList;
                data.pageFile = null;
            }

            if(Array.isArray(store.getters.links)){
                data.links = store.getters.links;
            }else{
                data.links = [];
            }

            data.notePage = store.getters.notePage;
            


        }

        /**
         * Carica file di pagina
         */
        function loadFilePage(file){
            const host = window.location.origin;
            axios.get(host+"/"+file).then(response => {
                if(response){
                    if(response.data){
                        data.pageFile = response.data; 
                    }
                }
            });          
        }

        function onPrevious(){
            var index = props.id_pagina - 1;
            if(index >= 0){
                toNav(index);
            }
        }

        function toNav(index){
            var audio = new Audio("/sonar.ogg");
            audio.play();
            router.push(`/menu/${data.nameItemMenu}/argomento/${data.title}/pagina/${index}`);
            store.dispatch('CURRENT_TOPIC', {
                name : data.title, 
                page : index,
                menu : data.nameItemMenu
            });
        }

        function onNext(){
            var index = Number(props.id_pagina) + 1;
            if(index < data.list.length){
                toNav(index);
            }
        }

        function onFirst(){
                toNav(0);
        }

        function onLast(){
                toNav(data.list.length-1);
        }

        function onChange(oEvent){
            
            if(oEvent.target.value > 0 && oEvent.target.value <= data.list.length){
                toNav(Number(oEvent.target.value)-1);
            }else  if(oEvent.target.value > data.list.length){
                toNav(Number(data.list.length)-1);
                oEvent.target.value = Number(data.list.length);
            }else{
                toNav(Number(0));
                oEvent.target.value = Number(1);
            }
            
        }

        function focusTitlePage(event){
            event.target.value = "";
        }

        function blurTitlePage(event){
            event.target.value = data.titlePage;
        }

        function selectTitlePage(event) {
            for (let index = 0; index < data.list.length; index++) {
                if( data.list[index]['sotto-titolo'] == event.target.value){
                    toNav(index);
                    break;
                }
            }
        }


        return{
            ...toRefs(data),onPrevious, onNext, onFirst,onLast,onChange,focusTitlePage,blurTitlePage,selectTitlePage
        }
    }
}

</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Fredericka+the+Great&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Geostar+Fill&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Gruppo&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poller+One&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Stint+Ultra+Expanded&display=swap');

#MultiPages {
    position: relative;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}


/* animazione */

#navMenu {
    font-family: 'Michroma', sans-serif;
    animation-duration: 0.6s;
    animation-name: slidein;
    animation-iteration-count:initial;
    animation-direction: normal;
    left: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    box-shadow: 0px 5px 5px gray;
}

@keyframes slidein {
  from {
    opacity: 0;
  }

  25%{
    opacity: 0.5;
  }

  50%{
    opacity: 0.7;
  }

 75%{
    opacity: 0.9;
  }

  to {
   opacity: 1;
  }
}

/* dynamic */
h1{
    text-align: center;
    font-family: 'Poller One', cursive;
    font-weight: normal;
    color: black;
    text-shadow: 0 0 10px rgb(0, 255, 242);
    font-size: v-bind("style.title.size");
}

.titleSearch{
    text-shadow: 0 0 3px rgb(0, 255, 242);
    font-family: 'Gruppo', cursive;
    text-align: center;
    border-style: none;
    outline: none;
    width: v-bind("style.page.length");
    color: rgb(8, 0, 126);
    font-size: v-bind("style.title.size");

}

.titleSearch:focus{
    border: 2px solid aqua;
    border-radius: 0.25rem;
    box-shadow:  0px 0px 20px aqua;
}

nav.menuPage{
    display: v-bind("style.menuPage.display");
}

.areaMain{
    position: relative;
    display: inline-block;
    width: calc(100% - v-bind("style.menuPage.length") );
    vertical-align: top;
    top: 0;
    left: 0;
    clear: both;
    text-align: v-bind("style.mainArea.align") ;
}

.slides{
    display: inline;
    float: left;
    width: v-bind("style.page.length");
}
.page{
    left: 0;
    display: inline-block;
    background: rgb(255, 255, 255);
    height: 50%;
    width: v-bind("style.page.length");
    font-family: 'Gruppo', cursive;
    font-size: v-bind("style.page.text");
    text-align: justify;
}


.page a{
    text-decoration:none;
    color: rgb(97, 97, 219);
    font-weight: bold;
}
.page a:hover{
    text-decoration:none;
    color: orangered;
}

.contenuto-centrato .img-centrata{
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.page img{
    max-width: v-bind("style.img.length");
    margin: 1rem;
    float: v-bind("style.img.align");
}
.contenuto-centrato{
    position: relative;
    margin: auto;
    float: none;
    width: 100%;
}
.page img.img-centrata{
    max-width: 100%;
    margin: auto;
}

.page .titolo{
    display: block;
    width: 100%;
    float: left;
}

.page img.estesa{
    float: none;
}

.note{

    font-family: 'Stint Ultra Expanded', cursive;
    font-size: v-bind("style.page.text");
    display: v-bind("style.note.display");
    height: auto;
    width: v-bind("style.note.length");
    text-align: left;
    vertical-align: top;
    box-shadow: 0 0 10px rgb(0, 255, 242);
    border-color: aqua;
    border-width: 1;
    background-color: rgba(255, 255, 255, 0.294);
}


.menu-bar-container[data-v-4a501398].top, .menu-bar-container[data-v-4a501398].bottom {
    height: 3.5rem;
    width: 100%;
    align-items: center;
    left: 0;
}



header,footer,html,body{
    width: 100%;
    margin: 0 ;
    padding: 0;
}
main{
    padding: 1rem;
}



.indexPageNav{
    vertical-align: top;
    display: inline-block;
    min-width: 11rem;
    height: v-bind("style.button.size");
    font-family: 'Geostar Fill', cursive;
    font-size: v-bind("style.page.text");
    margin: 0.4rem;
    padding-left: 1rem;
    padding-right: 1rem;
}
.indexPageNav>input{
    border:none;
    font-family: 'Geostar Fill', cursive;
    color: rgb(77, 1, 1);
    text-shadow: 2px 2px 2px aqua;
    height: v-bind("style.button.size");
    font-size: v-bind("style.page.text");
    text-align: center;
}
.indexPageNav>input:focus{
    text-shadow: 2px 2px 2px red;
    outline-color:aqua;
    box-shadow:  0px 0px 20px aqua;
}



.buttonNav{
    display: inline-block;
    width: v-bind("style.button.size");
    height: v-bind("style.button.size");
    font-size: v-bind("style.button.size");
    cursor: pointer;
    padding: 0;
    margin: 0.5rem;
    vertical-align: top;
    
}
.buttonNav:hover{
    color:aqua;
    
}
.buttonNav:active{
    color:red;
}


</style>
