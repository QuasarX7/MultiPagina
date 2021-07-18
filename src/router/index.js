import { createRouter, createWebHistory } from "vue-router";
import MultiPages from "../views/MultiPages.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: MultiPages
    },
    {
        path: '/menu/:id_menu/argomento/:id_argomento/pagina/:id_pagina',
        name: 'Argomento',
        component: MultiPages,
        props: true,
    },
    {
        path: "/about",
        name: "About",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/About.vue")
    },
    {
        path: "/test",
        name: "Test",
        component: () =>
            import("../views/Test.vue")
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;