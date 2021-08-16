<template>
    <touch-menu :items="menu" @on-selected="onSelected" />
</template>

<script>
import { reactive, toRefs } from 'vue'
import TouchMenu from '../components/TouchMenu.vue'

export default {
    name: 'test',
    components : {
        'touch-menu' : TouchMenu
    },
    setup(){
        let data = reactive({
            menu : [
                {name : "Nodo 1"},
                {
                    name : "Nodo 2",
                    menu : [
                        {name : "Nodo 2-1"},
                        {name : "Nodo 2-2"},
                        {
                            name : "Nodo 2-3",
                            menu : [
                                 {name : "Nodo 2-3-1"},
                                 {name : "Nodo 2-3-2"}
                            ]
                        },
                    ]
                },
                {name : "Nodo 3"}

            ]
        });

        function onSelected(val){
            console.log('val :>> ', val);
        }
        
        return {
            ...toRefs(data) ,onSelected
        };
    }
}
</script>

<style scoped>


</style>