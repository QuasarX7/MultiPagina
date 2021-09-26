<template>
    <h1 class="traslate" @click="onClick">
        hello!
        <span class="tooltip">Ciao</span>
    </h1>

</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
    name: 'test',
    components : {
    },
    setup(){
        let data = reactive({
            
        });

        function onClick(){
            console.log("xxx");
            var oAudio = new Audio('/PagineWeb/Inglese/Dizionario/hello.mp3');
            oAudio.play();
        }
        
        return {
            ...toRefs(data), onClick 
        };
    }
}
</script>

<style scoped>
.traslate{
    position: relative;
    display: inline-block;
}
.traslate:active{
    color: red;
}
.traslate:hover{
    cursor: pointer;
}

.traslate .tooltip {
  visibility: hidden;
  width: 120px;
  background-color: rgb(49, 49, 49);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
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
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}

.traslate:hover .tooltip {
  visibility: visible;
}

</style>