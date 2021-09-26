<template>
    <article>
        <template v-for="(item, index) in code" :key="index">
            <template v-if="item.translate == true" >
                <span class="traslate" :style="colorType(item.info['type'],false)" @click="onClick(item.word)">
                    <span class="text">{{item.word + item.point}}</span>
                    <span class="tooltip">
                        <acronym :style="colorType(item.info['type'],true)">{{item.info['type']}}</acronym> <em>{{item.info['description']}}</em>
                        <dfn>{{item.info['phonetics']}}</dfn>
                    </span>
                </span>
                &nbsp;
            </template>
            <template v-else> 
                <span v-html="item.word ? item.word + ' '  : ''" />
            </template>
        </template>
    </article>
</template>

<script>
import {reactive, toRefs,onMounted} from 'vue'
import { useStore } from 'vuex'

export default {
  name : 'Translate',
    props:['language','page'],
    setup(props){
        const store = useStore();
        let data = reactive({
            code : []
        });

        onMounted(() => {
            if(props.page){
                var wordT = '';
                var tagHTML = '';
                props.page.replace(/<div>/g,'').replace(/<\/div>/g,'').replace(/>/g,'> ').replace(/</g,' <').split(/\s/).filter((w)=> w != "" ).forEach(word => {
                    if(tagHTML){
                        wordT += word +' ';
                    }else{
                        wordT = '';
                    }
                    let toTranslate = false;
                    var info = {};
                    
                    var point = '';
                    if( ! (/(<([^>]+)>)/.test(word)) ){
                        if(!tagHTML){
                            props.language.forEach(item => {
                                let p = String(word).search(/[!.;:?']/);
                                if(p == word.length -1){// se esiste in carattere di puntegiatura 
                                    point = String(word).at(p);
                                    word = word.substring(0,p);
                                }
                                
                                if(item['description'] && item['word'] == String(word).toLowerCase()){
                                    toTranslate = true;
                                    info = item;
                                    wordT = word;
                                    return;
                                }
                            });
                        }
                    }else{
                        // word è tag HTML
                        if(!tagHTML){
                            tagHTML = wordT = word;
                        }else if(tagHTML == word.replace(/\//,'')){// <alfa> <==> </alfa>
                            tagHTML = '';
                        }
                    }
                    if(!tagHTML){
                        data.code.push({
                            translate : toTranslate,
                            word : wordT === '' ? word : wordT,
                            point: point,
                            info : info
                        });
                    }
                });

            }
        });

        function colorType(type,text) {
            type;
            var typeColor = '#FFF';
            switch(type){
                case 'n' :  typeColor = 'cadetblue'; break;
                case 'v' :  typeColor = 'lightgreen'; break;
                case 'v.past' :  typeColor = 'greenyellow'; break;
                case 'art': typeColor = 'lightcoral'; break;
                case 'adj': typeColor = 'tomato'; break;
                case 'prep': typeColor = 'hotpink'; break;
                case 'adv': typeColor = 'yellowgreen'; break;
                default : typeColor = '#AAA'; break;
            }
            return text 
                ? {color: typeColor} 
                : {'background-color': typeColor, 'border-bottom': `0.5px dotted ${typeColor}` } ;
        }
        function onClick(word){
            const host = window.location.origin;
            var file = store.getters.file;
            const path = String(file).substring(0,String(file).lastIndexOf('/'));
            var oAudio = new Audio(`${host}/${path}/${word.toLowerCase()}.mp3`);
            oAudio.play();
            
        }

        return{
            ...toRefs(data),onClick,colorType
        }
           
    }
}
</script>

<style scoped>

.traslate{
    position: relative;
    display: inline-block;
}
.traslate:active{
    font-weight: bold;
}
.traslate:hover{
    cursor: pointer;
    background-color: aqua;
}

.traslate .tooltip {
  visibility: hidden;
  min-width: 7rem;
  background-color: rgb(49, 49, 49);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 150%;
  left: 50%;
  margin-left: -60px;
}

.traslate .tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -0.3rem;
  border-width: 0.3rem;
  border-style: solid;
  border-color: black transparent transparent transparent;
}

.traslate:hover .tooltip {
  visibility: visible;
}

.tooltip dfn{
    display: block;
    font-size:80%;
}

.tooltip em{
    font-weight: normal;
}

.tooltip acronym{
    font-weight: bold;
}

.traslate .text{
    background-color: #FFF;
    
}
.traslate .text:hover{
    background-color: initial;
}
</style>