<template>
  <div class="d-flex vh-100"> 
    <aside 
      :class="['bg-white', 'd-flex', 'flex-column', 'text-dark', 'shadow-sm', 'sidebar-width', { 'is-collapsed': isCollapsed }]"
    >
      <div class="sidebar-header d-flex align-items-center justify-content-between p-3 border-bottom border-light-subtle">
        <h1 class="logo-text fs-4 fw-bolder text-info mb-0">{{ isCollapsed ? 'WO' : 'WebOrdering' }}</h1>
        <button class="btn btn-sm btn-outline-secondary border-0 p-1" @click="toggleSidebar" :title="isCollapsed ? 'Expandir' : 'Colapsar'">
          <i :class="isCollapsed ? 'bi-arrow-right-short' : 'bi-arrow-left-short'" class="fs-4"></i>
        </button>
      </div>

      <nav class="nav flex-column sidebar-nav flex-grow-1 overflow-auto p-2">
        <div v-show="!isCollapsed" class="menu-group-label text-secondary px-3 pt-3 pb-2 small fw-semibold">PRINCIPAL</div>
        
        <router-link 
          v-for="item in navItems.main" 
          :key="item.name" 
          :to="item.path" 
          class="nav-link text-dark-emphasis py-2 d-flex align-items-center rounded-2 mb-1"
          active-class="active-link"
          :title="isCollapsed ? item.name : ''"
          exact
        >
          <i :class="[item.icon, 'nav-icon', 'fs-5', { 'me-3': !isCollapsed, 'mx-auto': isCollapsed }]"></i>
          <transition name="fade">
            <span class="link-text fw-normal" v-show="!isCollapsed">{{ item.name }}</span>
          </transition>
        </router-link>

        <hr class="text-light-subtle mx-3 my-3">
        
        <div v-show="!isCollapsed" class="menu-group-label text-secondary px-3 pt-1 pb-2 small fw-semibold">GESTIÓN</div>

        <router-link 
          v-for="item in navItems.management" 
          :key="item.name" 
          :to="item.path" 
          class="nav-link text-dark-emphasis py-2 d-flex align-items-center rounded-2 mb-1"
          active-class="active-link"
          :title="isCollapsed ? item.name : ''"
          exact
        >
          <i :class="[item.icon, 'nav-icon', 'fs-5', { 'me-3': !isCollapsed, 'mx-auto': isCollapsed }]"></i>
          <transition name="fade">
            <span class="link-text fw-normal" v-show="!isCollapsed">{{ item.name }}</span>
          </transition>
        </router-link>

      </nav>

      <div class="sidebar-footer p-3 border-top border-light-subtle">
        <router-link 
          to="/settings" 
          class="nav-link text-dark-emphasis py-2 d-flex align-items-center rounded-2"
          active-class="active-link"
          :title="isCollapsed ? 'Configuración' : ''"
        >
          <i :class="['bi-gear-fill', 'nav-icon', 'fs-5', { 'me-3': !isCollapsed, 'mx-auto': isCollapsed }]"></i>
          <transition name="fade">
            <span class="link-text fw-normal" v-show="!isCollapsed">Configuración</span>
          </transition>
        </router-link>
      </div>

    </aside>

    <div class="main-content d-flex flex-column flex-grow-1 bg-light">
      <Navbar />
      <main class="view-container p-4 flex-grow-1 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';

export default {
  name: 'MainLayout',
  components: { Navbar },
  data() {
    return {
      isCollapsed: false,
      navItems: {
        main: [
          { name: 'Dashboard', path: '/', icon: 'bi-grid-fill' },
          { name: 'Pedidos', path: '/orders', icon: 'bi-box-seam-fill' },
          { name: 'Clientes', path: '/customers', icon: 'bi-people-fill' },
        ],
        management: [
          { name: 'Productos', path: '/products', icon: 'bi-tag-fill' },
          { name: 'Inventario', path: '/inventory', icon: 'bi-boxes' },
          { name: 'Reportes', path: '/reports', icon: 'bi-bar-chart-line-fill' },
        ]
      }
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
};
</script>

<style>
.sidebar-width {
  width: 250px;
  transition: width 0.3s ease; /* transición suave */
}

.sidebar-width.is-collapsed {
  width: 80px;
}

.nav-icon {
  transition: margin 0.3s ease; /* íconos se ajustan suavemente */
}

/* transición para texto de los links */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
