// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const routes = [
  // Ruta raíz redirige al login
  {
    path: '/',
    redirect: '/login'
  },

  // Rutas públicas (sin layout)
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },

  // Rutas protegidas (con layout principal)
  {
    path: '/app',
    component: MainLayout,
    meta: { requiresAuth: true }, // <--- Protegemos toda la ruta /app
    children: [
      {
        path: 'home',
        name: 'Home',
        component: HomeView,
        meta: { requiresAuth: true }
      },
      // Puedes agregar más rutas protegidas aquí
      // { path: 'perfil', name: 'Perfil', component: PerfilView, meta: { requiresAuth: true } },
      // Redirección automática al home si el path es /app
      {
        path: '',
        redirect: 'home'
      }
    ]
  },

  // Ruta por defecto para cualquier otra URL
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// --- Guardia de rutas para protección ---
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // Token guardado después del login

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y no hay token → login
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    // Si ya estás logueado y tratas de ir a login o registro → home
    next('/app/home');
  } else {
    next();
  }
});

export default router;
