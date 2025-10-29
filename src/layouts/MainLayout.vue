<template>
  <div class="d-flex vh-100"> 
    <aside 
      :class="['sidebar', { 'is-collapsed': isCollapsed }]"
    >
      <!-- HEADER -->
      <div class="sidebar-header d-flex align-items-center justify-content-between p-3 border-bottom border-light-subtle">
        <h1 class="logo-text fs-4 fw-bolder text-info mb-0">{{ isCollapsed ? 'WO' : 'WebOrdering' }}</h1>
        <!-- <button class="btn btn-sm btn-outline-secondary border-0 p-1" @click="toggleSidebar" :title="isCollapsed ? 'Expandir' : 'Colapsar'">
          <i :class="isCollapsed ? 'bi-arrow-right-short' : 'bi-arrow-left-short'" class="fs-4"></i>
        </button> -->
      </div>

      <!-- MENÚ -->
      <nav class="nav flex-column sidebar-nav flex-grow-1 overflow-auto p-2">
        <div v-show="!isCollapsed" class="menu-group-label text-secondary px-3 pt-3 pb-2 small fw-semibold">PRINCIPAL</div>
        
        <router-link 
          v-for="item in navItems.main" 
          :key="item.name" 
          :to="item.path" 
          class="nav-link sidebar-item"
          active-class="active-link"
          :title="isCollapsed ? item.name : ''"
          exact
        >
          <div class="icon-wrapper">
            <i :class="[item.icon, 'nav-icon', 'fs-5']"></i>
          </div>
          <transition name="fade">
            <span v-show="!isCollapsed" class="link-text">{{ item.name }}</span>
          </transition>
        </router-link>

        <hr class="text-light-subtle mx-3 my-3">

        <div v-show="!isCollapsed" class="menu-group-label text-secondary px-3 pt-1 pb-2 small fw-semibold">GESTIÓN</div>

        <router-link 
          v-for="item in navItems.management" 
          :key="item.name" 
          :to="item.path" 
          class="nav-link sidebar-item"
          active-class="active-link"
          :title="isCollapsed ? item.name : ''"
        >
          <div class="icon-wrapper">
            <i :class="[item.icon, 'nav-icon', 'fs-5']"></i>
          </div>
          <transition name="fade">
            <span v-show="!isCollapsed" class="link-text">{{ item.name }}</span>
          </transition>
        </router-link>
      </nav>

      <!-- FOOTER CONFIG (estilo igual al resto) -->
      <div class="sidebar-footer p-3 border-top border-light-subtle">
        <router-link 
          to="/settings" 
          class="nav-link sidebar-item"
          active-class="active-link"
          :title="isCollapsed ? 'Configuración' : ''"
        >
          <div class="icon-wrapper">
            <i :class="['bi-gear-fill', 'nav-icon', 'fs-5']"></i>
          </div>
          <transition name="fade">
            <span v-show="!isCollapsed" class="link-text">Configuración</span>
          </transition>
        </router-link>
      </div>
    </aside>

    <!-- CONTENIDO PRINCIPAL -->
    <div class="main-content d-flex flex-column flex-grow-1 bg-light">
      <Navbar @toggleSidebar="toggleSidebar" />
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
          { name: 'Dashboard', path: '/app/home', icon: 'bi-grid-fill' },
          { name: 'Pedidos', path: '/app/createNewOrder', icon: 'bi-box-seam-fill' },
          { name: 'Clientes', path: '/app/order', icon: 'bi-people-fill' },
        ],
        management: [
          { name: 'Productos', path: '/app/products', icon: 'bi-tag-fill' },
          { name: 'Inventario', path: '/app/inventory', icon: 'bi-boxes' },
          { name: 'Reportes', path: '/app/reports', icon: 'bi-bar-chart-line-fill' },
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

<style scoped>
/* ===== SIDEBAR ===== */
.sidebar {
  background-color: #fff;
  width: 250px;
  transition: width 0.4s ease;
  display: flex;
  flex-direction: column;
  text-align: left;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
}

.sidebar.is-collapsed {
  width: 80px;
}

/* Mantiene los íconos alineados siempre */
.icon-wrapper {
  width: 36px; 
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== LINKS ===== */
.sidebar-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  transition: background 0.3s, color 0.3s;
  color: #333;
}

.sidebar-item:hover {
  background-color: #f1f1f1;
  text-decoration: none;
}

.active-link {
  background-color: #e6f2ff;
  font-weight: 600;
}

/* ===== FOOTER CONFIG ===== */
.sidebar-footer {
  transition: all 0.4s ease;
}

/* ===== ANIMACIONES ===== */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

/* === CORRECCIÓN DE ALTURA Y AJUSTE DE LAYOUT === */
.d-flex.vh-100 {
  min-height: 100vh; /* asegura que toda la vista ocupe la pantalla completa */
  overflow: hidden;  /* evita que algo empuje el contenido hacia arriba */
}

.main-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 100vh;
  overflow: hidden;
}

/* Asegura que el contenido principal se expanda sin romper el scroll */
.view-container {
  flex-grow: 1;
  overflow-y: auto; /* activa scroll cuando el contenido es largo */
  min-height: 0; /* importante para evitar que suba o se recorte */
}

</style>
