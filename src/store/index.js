import { createStore } from "vuex";

const storeConfig = {
    state: {
        dataTopic: [],
        currentTopic: '',
        currentPage: 0,
        currentMenu: ''
    },
    mutations: {
        SET_TOPIC(state,data) {
            state.dataTopic[data.key] = data.infoPages;
        },
        SET_CURRENT_TOPIC(state,topic) {
            state.currentTopic = topic;
        },
        SET_CURRENT_PAGE(state,page) {
            state.currentPage = page;
        },
        SET_CURRENT_MENU(state,menu) {
            state.currentMenu = menu;
        },
    },
    // update
    actions: {
        SAVE_DATA_FILES_TOPIC({ commit }, topic) {
            commit('SET_TOPIC', topic);
        },

        CURRENT_TOPIC({ commit }, topic) {
            commit('SET_CURRENT_TOPIC', topic.name);
            commit('SET_CURRENT_PAGE', topic.page);
            commit('SET_CURRENT_MENU', topic.menu);
        },
    },
    // get
    getters: {
        titleMenuBar(state) {
            return state.currentMenu;
        },
        title(state) {
            return state.currentTopic;
        },
        topics(state) {
            return state.dataTopic;
        },
        topic(state) {
            return state.dataTopic[state.currentMenu];
        },
        listPages(state) {
            try {
                return state.dataTopic[state.currentMenu]['pagine'];
            } catch (e) {
               console.log('e :>> ', e);
            }
        },
        file(state) {
            try {
                return state.dataTopic[state.currentMenu]['pagine'][state.currentPage]["file"];
            } catch (e) {
               console.log('e :>> ', e);
            }
        },
        titlePage(state) {
            try {
                return state.dataTopic[state.currentMenu]['pagine'][state.currentPage]["sotto-titolo"];
            } catch (e) {
               console.log('e :>> ', e);
            }
        }

    },
    
    modules: {
        // codice per modules
    },
};

export default createStore(storeConfig);