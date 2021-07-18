<template>

    <nav-menu id="navMenu"  v-if="window.dy <= 0" />
    
    <header v-if="titlePage" >
        <h1>{{title}}</h1>
        <h2>{{titlePage}}</h2>
        <nav>
            <div v-if="id_pagina > 0" @click="onFirst()" class="buttonNav">
                <font-awesome-icon icon="angle-double-left"/>
            </div>
            <div v-else class="buttonNav" />

            <div v-if="id_pagina > 0" @click="onPrevious()" class="buttonNav">
                <font-awesome-icon icon="angle-left"/>
            </div>
            <div v-else class="buttonNav" />

            <div class="indexPageNav"> pag. {{ Number(id_pagina) +1 }} </div>
            
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
            <article  
                class ="page"  
                v-html="pageFile" />
            <article class ="note" >Attenzione: sito è in fase di costruzione!</article>
        </section>
        <section v-else>
            <img style='height: 90%; width: 90%; object-fit: contain' src="note.jpg" />
        </section>
    </main>
    
</template>

<script>
import NavMenu from '../components/NavMenu.vue'
import ListTopic from '../components/ListTopic.vue'
import {reactive, toRefs, onMounted,  watch} from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import router from "../router"




export default {
    name: 'MultiPages',
    props:[
      'id_menu',
      'id_argomento',
      'id_pagina'
    ],
    components: {
        'nav-menu' : NavMenu,
        'list-topic' : ListTopic
    },
    setup(props) {
        const store = useStore();

       

        let data = reactive({
            title : '',
            titlePage : '',
            list : [],
            pageFile : null,//< code file
            nameItemMenu : '',
            window : {
                width : 0,
                height : 0,
                x:  0,
                y:  0,
                dx: 0,
                dy: 0

            },

            
        });


        onMounted(() => {
            data.window.width = window.screenWidth;
            data.window.height = window.screenHeight;
            window.addEventListener('resize', ()=>{
                data.window.width = window.innerWidth;
                data.window.height = window.innerHeight;
            });

            window.addEventListener('scroll',() =>{
                data.window.dx = window.scrollX - data.window.x;
                data.window.dy = window.scrollY - data.window.y;
                data.window.x= window.scrollX;
                data.window.y= window.scrollY;
                console.log('d :>> ', ', ', data.window.x, data.window.y);
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

            if(store.getters.file)
                loadFilePage(store.getters.file);
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

        return{
            ...toRefs(data),onPrevious, onNext, onFirst,onLast
        }
    }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Geostar+Fill&display=swap');
#MultiPages {
    position: relative;
    font-family: 'Geostar', cursive;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

body{
    margin: 0;
    padding: 0;
}
/* animazione */

#navMenu {
    font-family: 'Orbitron', sans-serif;
    animation-duration: 0.6s;
    animation-name: slidein;
    animation-iteration-count:initial;
    animation-direction: normal;
    left: 0;
    margin: 0;
    padding: 0;
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

/* */
.menu-bar-container[data-v-4a501398].top, .menu-bar-container[data-v-4a501398].bottom {
    height: 3.5rem;
    width: 100%;
    align-items: center;
    left: 0;
}

h2{
    text-shadow: 0 0 3px rgb(0, 255, 242);
    color: rgb(8, 0, 126);
    font-size: 2.5rem;
}



@import url('https://fonts.googleapis.com/css2?family=Gruppo&display=swap');


/* stili */
@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');
.tecnico{
    font-family: 'Michroma', sans-serif;
}

.contenuto-centrato{
    position: relative;
    margin: auto;
    float: none;
    width: 100%;
}
.contenuto-centrato .img-centrata{
    display: block;
    margin-left: auto;
    margin-right: auto;
}


/*------------------------------------------------- Desktop -----------------------------------------*/
@media only screen and (min-width:769px){

    nav.menuPage{
        display: inline;
    }

    h1{
        display: block;
        font-family: 'Geostar Fill', cursive;
        color: rgb(64, 16, 141);
        font-size: 3rem;
    }
    header{
        position: relative;
    }
    header nav{
        display: block;
        width: auto;
        text-align: center; 
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
    }

    main{
        display: inline-block;
        width: 100%;
        height: auto;
        text-align: left; 
    }

    .areaMain{
        display: inline-block;
        width: calc(100% - 20rem);
        vertical-align: top;
        margin: 0;
        top: 0;
        clear: both;
    }
    .buttonNav{
        display: inline-block;
        width: 4rem;
        height: 4rem;
        font-size: 3rem;
        cursor: pointer;
        padding: 0;
        vertical-align: top;
        
    }
    .buttonNav:hover{
        color:aqua;
        
    }
    .buttonNav:active{
        color:red;
    }
    .indexPageNav{
        vertical-align: top;
        display: inline-block;
        min-width: 11rem;
        height: 3.5rem;
        font-size: 2rem;
        border: gray solid 2px;
        margin: 0.4rem;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    
    .page{
        left: 0;
        display: inline-block;
        background: rgb(255, 255, 255);
        height: 50%;
        width: 70rem;
        font-family: 'Gruppo', cursive;
        font-size: 1.5rem;
        text-align: justify;
        padding: 1rem;
    }
    .page img{
        max-width: 70%;
        margin: 1rem;
        float: left;
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
    .note{
        margin: 3px;
        padding: 5px;
        left: auto;
        right: 0;
        display: inline-block;
        background: red;
        height: 100%;
        width: 20rem;
        vertical-align:top;
    }

}
/*------------------------------------------------- Tablet -------------------------------------------------*/

@media only screen and (min-width:321px) and (max-width:768px){
    nav.menuPage{
        display: none;
    }



    h1{
        display: block;
        font-family: 'Geostar Fill', cursive;
        color: rgb(64, 16, 141);
        font-size: 2rem;
    }
    header{
        position: relative;
    }
    header nav{
        display: block;
        text-align: center; 
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    main{
        display: inline-block;
        text-align: left; 
    }

    .areaMain{
        display: inline-block;
        margin: 0;
        top: 0;
    }


    .buttonNav{
        display: inline-block;
        width: 3rem;
        height: 3rem;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        vertical-align: top;
        
    }
    .buttonNav:hover{
        color:aqua;
        
    }
    .buttonNav:active{
        color:red;
    }
    .indexPageNav{
        vertical-align: top;
        display: inline-block;
        min-width: 7rem;
        height: 2rem;
        font-size: 1.2rem;
        border: gray solid 1px;
        margin: 0.2rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }





    .page{
        left: 0;
        display: inline-block;
        background: rgb(255, 255, 255);
        width:90%;
        font-family: 'Gruppo', cursive;
        font-size: 1.3rem;
        text-align: justify;
        padding: 0.3rem;
    }
    .page img{
        max-width: 70%;
        margin: 1rem;
        float: left;
    }
    .page img.img-centrata{
        max-width: 100%;
        margin: auto;
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
    .note{
        margin: 3px;
        padding: 5px;
        left: auto;
        right: 0;
        display: inline-block;
        background: red;
        width:auto;
    }




}
/*--------------------------------------------------- Phone -----------------------------------------------*/
@media only screen and (max-width: 320px){

    nav.menuPage{
        display: none;
    }

     
    h1{
        display: block;
        font-family: 'Geostar Fill', cursive;
        color: rgb(64, 16, 141);
        font-size: 1rem;
    }
    h2{
        font-size: 1rem;
    }
    header{
        position: relative;
    }
    header nav{
        display: block;
        text-align: center; 
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    .buttonNav{
        display: inline-block;
        width: 2.5rem;
        height: 2.5rem;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        vertical-align: top;
        
    }

    .indexPageNav{
        vertical-align: top;
        display: inline-block;
        min-width: 4.5rem;
        height: 1.5rem;
        font-size: 1rem;
        border: gray solid 1px;
        margin: 0.2rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }


    .page{
        left: 0;
        display: inline-block;
        background: rgb(255, 255, 255);
        font-family: 'Gruppo', cursive;
        font-size: 1.3rem;
        text-align: justify;
        padding: 0.3rem;
    }
    .page img{
        max-width: 100%;
        margin: 0.2rem;
        float: left;
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
    .note{
        margin: 0.5px;
        padding: 0.55px;
        left: auto;
        right: 0;
        display: inline-block;
        background: red;
        width:auto;
    }


}



</style>
