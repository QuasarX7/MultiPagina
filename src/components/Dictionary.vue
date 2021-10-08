<template>
    <div class="tecnico">
        <h2 style="text-align: center;"> <span class="type"> ( {{items[items.length - index -1]['type']}} ) </span> 
        {{ String(items[items.length - index -1]['description']).replaceAll('/',', ') }}</h2>
        
        <p class="phonetics">{{items[items.length - index -1]['phonetics']}}</p>
        <img :src=' "/"+items[items.length - index -1]["path"]+"/" + items[items.length - index -1]["word"] + ".png"' />
        <audio :src=' "/"+items[items.length - index -1]["path"]+"/" + items[items.length - index -1]["word"] + ".mp3"' autoplay/>
    </div>
</template>

<script>
import {watch} from 'vue'
//import { useStore } from 'vuex'

export default {
    name: 'Dictionary',
    props: [
        'index',
        'items'
    ],
    setup(props) {
       // const store = useStore();
        /**
         * All'aggiornamento della pagina al variare dello stato della props 'id_argomento' o 'id_pagina'
         */
        watch(
            [
                () => props.index,
                () => props.items,
            ],
            () => {
                init();
            }
        );
        function init() {
            console.log('........>>');
        }

    }
}
</script>

<style>
.type{
    text-align: center;
    font-style: italic;
    font-weight: normal;
    font-size: 80%;
    margin: 1rem;
    text-shadow: 0 0 3px aqua;
}

.phonetics{
    text-align: center;
    font-style: italic;
    font-size: 130%;
    font-family: Georgia, 'Times New Roman', Times, serif;
}

</style>