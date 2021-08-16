import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store"

import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleRight, faAngleLeft, faAngleDoubleRight, faAngleDoubleLeft, faInfoCircle, faHome,faJedi,faBomb,faFeatherAlt,faExpand,faCompress,faBars,faTimes }
    from "@fortawesome/free-solid-svg-icons";

library.add(faAngleRight,faAngleLeft,faAngleDoubleRight,faAngleDoubleLeft,faInfoCircle,faHome,faJedi,faBomb,faFeatherAlt,faExpand,faCompress,faBars,faTimes);
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";



createApp(App)
    .use(store) // installa lo store di Vuex nell'applicazione
    .use(router)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount('#app')
