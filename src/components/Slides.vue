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
            
        </nav>
    </section>
</template>

<script>
import {reactive, toRefs,onMounted} from 'vue'
export default {

    name : 'Slides',
    props:['images'],
    emits: {
    },
    setup(props) {
        
        let data = reactive({
            index : 0,
            limit : 0,
            image : ''
        });


        onMounted(() => {
            data.limit = props.images.length - 1;
            data.image = props.images[0];
        });

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

        return{
            ...toRefs(data),onPrevious, onNext
        }
    }
}
</script>

<style scoped>
section{
    background-color: black;
    color: aqua;
    display: inline-block;
    width: 99vm; /* <-- for IE9 */
    height: 99vm; /* <-- for IE9 */
    width: 99vmin; 
    height: 99vmin;
    height: auto;
}
section img{
    display: block;
    width: 100%;
    height: auto;
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