import Vue from 'vue';
import Router from 'vue-router';
import CleanUpList from './views/CleanUpList.vue';
import UsersList from './views/UsersList.vue';
import PlacesList from './views/PlacesList.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'cleanuplist',
      component: CleanUpList,
    },
    {
      path: '/userslist',
      name: 'userslist',
      component: UsersList,
    },
    {
      path: '/placeslist',
      name: 'placeslist',
      component: PlacesList,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
