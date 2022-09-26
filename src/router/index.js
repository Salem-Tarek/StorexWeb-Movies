import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Movies from "../views/Movies.vue";
import MoviePage from "../views/MoviePage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: Movies,
    component: Movies,
    meta: {requiresAuth: true},
  },
  {
    path: '/movie-page/:id',
    name: MoviePage,
    component: MoviePage,
    meta: {requiresAuth: true},
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { guest: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});


router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next()
      return
    }else{
      next('/login')
    }
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      next("/");
      return;
    }else{
      next();
    }
  } else {
    next();
  }
});

export default router;
