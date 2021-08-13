<template>
    <section>
        <img :src="'/'+ image" />
        <nav>
            <div @click="onPrevious()" :class="index == 0 ? 'buttonDisable' : 'buttonActive'">
                <font-awesome-icon icon="angle-left"/>
            </div>
            
            <div class="indexNav"> {{index +1}} </div>
            
            <div @click="onNext()" :class="index == limit ?  'buttonDisable' :  'buttonActive'" >
                <font-awesome-icon icon="angle-right"/>
            </div>

            <div @click="onSwitch()" class="buttonActive" >
                <font-awesome-icon :icon="expand ?  'compress' : 'expand'  "/>
            </div>
            
        </nav>
    </section>
</template>

<script>
import {reactive, toRefs,onMounted,watch, computed} from 'vue'
export default {

    name : 'Slides',
    props:['images'],
    emits: {
    },
    setup(props) {
        
        let data = reactive({
            expand : true,
            index : 0,
            limit : 0,
            image : '',
            width : computed(
                () => data.expand ? '100%' : '99vmin'
            ),
            width2 : computed(
                () => data.expand ? '100%' : '99vm'
            ),
            hieght : computed(
                () => data.expand ? 'auto' : '99vmin'
            ),
            hieght2 : computed(
                () => data.expand ? 'auto' : '99vm'
            ),

        });

        function init() {
            data.index = 0;
            data.limit = props.images.length - 1;
            data.image = props.images[0];
        }

        onMounted(() => {
            init();
        });

        /**
         * All'aggiornamento della pagina al variare dello stato della props 'id_argomento' o 'id_pagina'
         */
        watch(
            [
                () => props.images,
            ],
            () => {
                init();
            }
        );
        

        function onPrevious(){
            if(data.index > 0){
                toNav(--data.index);
            }
        }

        function toNav(index){
            var audio = new Audio("/sonar.ogg");
            audio.play();
            data.image = props.images[index];
        }

        function onNext(){
            
            if(data.index < data.limit){
                toNav(++data.index);
            }
        }

        function onSwitch(){
            data.expand = !data.expand;
        }

        return{
            ...toRefs(data),onPrevious, onNext,onSwitch
        }
    }
}
</script>

<style scoped>
section{
    position: relative;
    margin: auto;
    float: none;
    background-color: black;
    color: aqua;
    display: inline-block;
    width: 100%;
    height: auto;
    padding: auto;
    text-align: center;
    overflow-x: auto;
}
section img{
    margin: auto;
    display: block;
    width:  v-bind("width2"); /* <-- for IE9 */
    height: v-bind("height2");  /* <-- for IE9 */
    width:  v-bind("width");
    height: v-bind("height");
}

nav{
    text-align: center;
    display: block;
}
.buttonActive{
    font-size: 2rem;
    color: aqua;
    box-shadow:  0px 0px 20px aqua;
    display: inline-block;
    margin: 0.5rem;
    width: 2rem;
    height: 2rem;
    text-align: center;
}
.buttonActive:hover{
    font-size: 2rem;
    color: red;
    box-shadow:  0px 0px 20px red;
    display: inline-block;
    margin: 0.5rem;
    width: 2rem;
    height: 2rem;
    text-align: center;
}
.buttonDisable{
    font-size: 2rem;
    margin: 0.5rem;
    color: gray;
    display: inline-block;
    width: 2rem;
    height: 2rem;
}

.indexNav{
   font-family: 'Michroma', sans-serif;
    font-size: 1.5rem;
    background-color: black;
    color: aqua;
    text-shadow:  4px 4px 4px red;
    vertical-align:top;
    display: inline-block;
    width: 5rem;
    height: 1rem;
}

</style>