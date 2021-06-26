<template>
    <nav-menu @selected-topic="onSelectMenu"/>

    <header v-if="titlePage" >
        <h1>{{title}}</h1>
        <h2>{{titlePage}}</h2>
        <nav>
            <div class="buttonNav"> &lt; </div>
            <div class="indexPageNav"> pag. {{id_pagina}} </div>
            <div class="buttonNav"> &gt; </div>
        </nav>
    </header>
    <main>
        <list-topic :name="title" :menu="list" @selected-item="onSelectSubmenu" />
        <section v-if="pageFile" class="areaMain">
            <article  class ="page"  v-html="pageFile" />
            <article class ="note" />
        </section>
    </main>
    
</template>

<script>
import NavMenu from '../components/NavMenu.vue'
import ListTopic from '../components/ListTopic.vue'
import {reactive, toRefs, onMounted} from 'vue'
import axios from 'axios'

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
        let data = reactive({
            title : '',
            titlePage : '',
            list : [],
            pageFile : null,//< code file
        });

        onMounted(()=>{
          console.log('props.id_argomento :>> ', props.id_argomento);
          console.log('props.id_pagina :>> ', props.id_pagina);
        });

        function onSelectMenu(infoTopic,index) {
          data.title = infoTopic['titolo'];
          data.list = infoTopic['pagine'];
          if(Array.isArray(data.list)){
              if(data.list.length){
                  data.titlePage=data.list[index]["sotto-titolo"];
                  loadFilePage(data.list[index]["file"]);
              }
          }
        }

        function onSelectSubmenu(index) {
          data.titlePage=data.list[index]["sotto-titolo"];
          loadFilePage(data.list[index]["file"]);
        }

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

        return{
            ...toRefs(data), onSelectMenu,onSelectSubmenu
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
