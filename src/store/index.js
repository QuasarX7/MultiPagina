import { createStore } from "vuex";

const storeConfig = {
    state: {
        dataTopic: [],
        currentPage: 0,
        currentMenu: '',
        load: true
    },
    mutations: {
        SET_LOAD(state, value) {
            state.load = value;
        },
        SET_TOPIC(state,data) {
            state.dataTopic[data.key] = data.infoPages;
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
        START_INIT({ commit }) {
            commit('SET_LOAD', true);
        },

        END_INIT({ commit }) {
            commit('SET_LOAD', false);
        },
        
        SAVE_DATA_FILES_TOPIC({ commit }, topic) {
            commit('SET_TOPIC', topic);
        },

        CURRENT_TOPIC({ commit }, topic) {
            commit('SET_CURRENT_PAGE', topic.page);
            commit('SET_CURRENT_MENU', topic.menu);
        },
    },
    // get
    getters: {
        isBuild(state) {
            return state.load;
        },
        titleMenuBar(state) {
            return state.currentMenu;
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
                e;
            }
        },
        file(state) {
            try {
                return state.dataTopic[state.currentMenu]['pagine'][state.currentPage]["file"];
            } catch (e) {
                e;
            }
        },
        titlePage(state) {
            try {
                return state.dataTopic[state.currentMenu]['pagine'][state.currentPage]["sotto-titolo"];
            } catch (e) {
                e;
            }
        },
        imageList(state) {
             try {
                return state.dataTopic[state.currentMenu]['pagine'][state.currentPage]["diapositive"];
            } catch (e) {
                e;
            }
        },
        links(state) {
             try {
                return state.dataTopic[state.currentMenu]['pagine'][state.currentPage]["collegamenti"];
            } catch (e) {
                e;
            }
        },
        notePage(state) {
             try {
                return state.dataTopic[state.currentMenu]['pagine'][state.currentPage]["note"];
            } catch (e) {
                e;
            }
        }

    },
    
    modules: {
        // codice per modules
    },

};


export default createStore(storeConfig);