import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    component: MainLayout, // Layout principal
    children: [
      { path: '', name: 'Home', component: HomeView },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
