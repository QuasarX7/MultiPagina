<template>
    <nav-menu />

    <header v-if="titlePage" >
        <h1>{{title}}</h1>
        <h2>{{titlePage}}</h2>
        <nav>
            <div @click="onPrevious()" class="buttonNav"> &lt; </div>
            <div class="indexPageNav"> pag. {{id_pagina}} </div>
            <div @click="onNext()" class="buttonNav"> &gt; </div>
        </nav>
    </header>
    <main>
        <list-topic :name="title" :menu="list" :nameMenuBar="nameItemMenu"  />
        <section v-if="pageFile" class="areaMain">
            <article  class ="page"  v-html="pageFile" />
            <article class ="note" />
        </section>
    </main>
    
</template>

<script>
import NavMenu from '../components/NavMenu.vue'
import ListTopic from '../components/ListTopic.vue'
import {reactive, toRefs, onMounted, watch} from 'vue'
import { useStore } from 'vuex';
import axios from 'axios'
import router from "../router";

export default {
    name: 'MultiPages',
    props:[
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
            nameItemMenu : ''
        });

        onMounted(()=>{
            if(store.getters.file)
                loadFilePage(store.getters.file);
        });

        watch(
            [
                () => props.id_argomento,
                () => props.id_pagina,
            ],
            () => {
                
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
        );


        function loadFilePage(file){
            console.log('file :>> ', file);
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
            router.push(`/argomento/${data.titlePage}/pagina/${index}`);
                        
            store.dispatch('CURRENT_TOPIC', {
                name : data.titlePage, 
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

        return{
            ...toRefs(data),onPrevious, onNext
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

h1{
    font-family: 'Geostar', cursive;
    color: rgb(95, 107, 106);
    font-size: 3rem;
}

h1{
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
    width: calc(100% - 17rem);
    vertical-align: top;
    margin: 0;
    top: 0;
    clear: both;
}
.buttonNav{
    display: inline-block;
    width: 5rem;
    font-size: 4rem;
    cursor: pointer;
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
    border: gray solid 1px;
}

.page{
    left: 0;
    display: inline-block;
    background: rgb(80, 80, 79);
    height: 50%;
    width: 70rem;
}
.note{
    right: 0;
    display: inline-block;
    background: red;
    height: 50%;
    width: 50%;
}

</style>
