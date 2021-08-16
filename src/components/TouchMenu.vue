<template>
    <nav id="touchMenu">
        <span id="sottoMenu">
            <font-awesome-icon @click="onOpen" :icon="open ? 'times' : 'bars'" size="2x" class="icon"/>
            {{open ? nameMenu : 'MENU'}}
        </span>
        <template :style="open  ? 'display:block' : 'display:none'">
            <div class="item" v-for="(item, index) in listMenu" :key="index" @click="onClick">
                        <font-awesome-icon :icon="item['menu'] ? 'expand' : 'feather-alt'" size="2x" class="icon"/>
                        {{ item["name"] }}
            </div>
        </template>
    </nav>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
export default {
    name: 'TouchMenu',
    emits: [
        'on-selected'
    ],
    props: ['items'],
    setup(props,context){
        let data = reactive({
            open : false,
            listMenu : [], // lista sotto-menu visibile
            oldMenu : [],  // "pila" dei vecchi menu
            nameMenu : '', // nome sotto-menu selezionato
            oldNameMenu : [], // "pila" dei nomi dei sotto-menu
            liv : 0,
        });

        onMounted(() => {
            data.listMenu = props.items;
        });

        function onOpen() {

            if(!data.open){
                data.nameMenu = '';
                data.open = true;
            }else{
                // è sotto-menu
                if(data.liv > 0){
                    data.listMenu = data.oldMenu.pop();
                    data.nameMenu = data.oldNameMenu.pop();
                    data.liv--;
                }else{
                    data.open = false;
                }
            }
        }

        function onClick(event) {
            data.oldNameMenu.push(data.nameMenu);

            if(event.target.className instanceof SVGAnimatedString) // seleziona icona
                data.nameMenu = event.target.parentElement.outerText; 
            else // seleziona elemento lista
                data.nameMenu = event.target.outerText; 
            data.nameMenu = data.nameMenu.trim();
            
            for (const item of data.listMenu) {
                if(item['name'] == data.nameMenu){
                    // seleziona sotto-menu
                    if(Array.isArray(item['menu'])){
                        data.oldMenu.push(data.listMenu);
                        data.listMenu = item['menu'];
                        data.liv++;
                    
                    // seleziona voce menu
                    }else{
                        context.emit("on-selected", {
                            name : data.nameMenu,
                            path : createPath(data.oldNameMenu) + String(data.nameMenu).toLowerCase()
                        });
                        // reset
                        data.open = false;
                        data.listMenu = props.items;
                        data.oldMenu = [];
                        data.nameMenu = '';
                        data.oldNameMenu = [];
                        data.liv = 0;
                    }
                    break;
                }
            }
        }

        function createPath(list){
            var path = '';
            if(list.length){
                for (const item of list) {
                    if(item)
                        path += String(item).toLowerCase() + '>'
                }
            }
            return path;
            
        }

        return {...toRefs(data), onOpen, onClick};
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');/*[!]*/

#touchMenu{
    position:fixed;
    padding: 0;
    margin: 0;
    text-align: left;
    top: 0;
    width: 100%;
    display: block;
    background-color: black;
    color: aqua;
    font-family: 'Michroma', sans-serif;/*[!]*/
}

#sottoMenu{
   padding: 0.5rem; 
   display: inline-block;
}

.item{
    background-color: rgb(41, 23, 41);
    margin: 0.1rem 0;
    padding: 1rem;
    border-top: 1px solid aqua;
    cursor: pointer;
}

.item:hover{
    background-color: rgb(38, 50, 66);
    color: rgb(251, 255, 0);
}

.item:active{
    background-color: rgb(146, 4, 4);
    color: rgb(251, 255, 0);
}
.icon{
    margin-right:1rem;
    cursor:pointer;
}

</style>