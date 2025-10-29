<template>
  <header class="navbar sticky-top shadow-sm navbar-custom px-3 d-flex align-items-center justify-content-between">
    <!-- Izquierda: toggle y título -->
    <div class="d-flex align-items-center">
      <!-- Botón toggle sidebar (siempre visible) -->
      <button 
        class="btn btn-outline-secondary me-3 toggle-btn"
        @click="$emit('toggleSidebar')"
        type="button"
        aria-label="Toggle sidebar"
      >
        <i class="bi bi-list fs-5"></i>
      </button>

      <!-- Título de la vista -->
      <h1 class="h5 fw-bold text-dark mb-0 d-flex align-items-center">
        <i class="bi bi-speedometer2 text-primary me-2 fs-5"></i> Dashboard
      </h1>
    </div>

    <!-- Derecha: notificaciones y usuario -->
    <div class="d-flex align-items-center">
      <!-- Botón notificaciones -->
      <button class="btn btn-light rounded-circle position-relative me-3 btn-notification" title="Notificaciones">
        <i class="bi bi-bell-fill text-secondary fs-5"></i>
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          3
          <span class="visually-hidden">notificaciones no leídas</span>
        </span>
      </button>

      <!-- Dropdown usuario -->
      <div class="dropdown">
        <button 
          class="btn btn-dark dropdown-toggle d-flex align-items-center"
          type="button"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="bi bi-person-circle fs-5 me-2"></i>
          <span class="fw-semibold d-none d-md-inline">Daniel P.</span>
        </button>

        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          <li><router-link to="/profile" class="dropdown-item"><i class="bi bi-person me-2"></i> Perfil</router-link></li>
          <li><router-link to="/settings" class="dropdown-item"><i class="bi bi-gear me-2"></i> Configuración</router-link></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión</a></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Navbar',
  emits: ['toggleSidebar']
};
</script>

<style scoped>
.navbar-custom {
  background-color: #fff;
  min-height: 61px;
  padding: 0.5rem 1rem;
  z-index: 1020;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Botón del menú lateral */
.toggle-btn {
  border: none;
  background-color: #f8f9fa;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.toggle-btn:hover {
  background-color: #e2e6ea;
  transform: scale(1.05);
}

/* Notificaciones */
.btn-notification {
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.btn-notification:hover {
  background-color: #f0f0f0;
  transform: translateY(-1px);
}

/* Usuario */
.dropdown-toggle {
  background-color: var(--bs-dark);
  border-color: var(--bs-dark);
  transition: background-color 0.3s ease;
}
.dropdown-toggle:hover {
  background-color: #3e444a;
  border-color: #3e444a;
}
</style>
