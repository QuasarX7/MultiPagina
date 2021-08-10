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
            <article class ="note" >Attenzione: sito è in fase di costruzione!</article>
        </section>
        <section v-else-if="slides.length > 0" class="areaMain">
            <!-- area slide -->
            <view-slides :images="slides" />
            
            <!-- area note -->
            <article class ="note"><div style="background: red;">Attenzione: sito è in fase di costruzione!</div>
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
import {reactive, toRefs, onMounted,  watch} from 'vue'
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

       

        let data = reactive({
            title : '',
            titlePage : '',
            list : [],
            pageFile : null,//< code file
            slides : [],// image list
            links : [], // note (links)
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
                data.window.width = window.innerWidth;
                data.window.height = window.innerHeight;
                
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

/* */
.menu-bar-container[data-v-4a501398].top, .menu-bar-container[data-v-4a501398].bottom {
    height: 3.5rem;
    width: 100%;
    align-items: center;
    left: 0;
}

.titleSearch{
    text-shadow: 0 0 3px rgb(0, 255, 242);
    font-family: 'Geostar', cursive;
    text-align: center;
    border-style: none;
    outline: none;
    width: 70%;
    color: rgb(8, 0, 126);
    font-size: 2.5rem;

}

.titleSearch:focus{
    border: 2px solid aqua;
    border-radius: 0.25rem;
    box-shadow:  0px 0px 20px aqua;
}

header,footer,main,html,body{
    width: 100%;
    margin: 0 ;
    padding: 0;
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
        width: 100%;
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
        margin: 0.4rem;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .indexPageNav>input{
        border:none;
        font-family: 'Geostar Fill', cursive;
        color: rgb(77, 1, 1);
        text-shadow: 2px 2px 2px aqua;
        height: 2rem;
        font-size: 24px;
        text-align: center;
    }
    .indexPageNav>input:focus{
        text-shadow: 2px 2px 2px red;
        outline-color:aqua;
        box-shadow:  0px 0px 20px aqua;
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

    .titleSearch{
        text-shadow: 0 0 3px rgb(0, 255, 242);
        font-family: 'Geostar', cursive;
        text-align: center;
        border-style: none;
        outline: none;
        width: 100%;
        color: rgb(8, 0, 126);
        font-size: 2rem;
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
        width: 100%;
    }

    .areaMain{
        display: inline-block;
        margin: 0;
        top: 0;
        width: 100%;
        overflow: auto;
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
        margin: 0.2rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }

    .indexPageNav>input{
        border:none;
        font-family: 'Geostar Fill', cursive;
        color: rgb(77, 1, 1);
        text-shadow: 2px 2px 2px aqua;
        height: 2rem;
        font-size: 20px;
        text-align: center;
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
   
    .titleSearch{
        text-shadow: 0 0 3px rgb(0, 255, 242);
        font-family: 'Geostar', cursive;
        text-align: center;
        border-style: none;
        outline: none;
        color: rgb(8, 0, 126);
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
