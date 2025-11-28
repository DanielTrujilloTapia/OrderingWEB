<template>
  <div class="orders-dashboard">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <i class="bi bi-activity"></i>
            Monitor de Órdenes RabbitMQ
          </h1>
          <p class="page-subtitle">Órdenes en tiempo real desde la cola de mensajes</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-refresh" @click="fetchOrders" :disabled="loading">
            <i class="bi bi-arrow-clockwise" :class="{ 'spin': loading }"></i>
            Actualizar
          </button>
          <div class="stats-badge" :class="getQueueStatusClass">
            <i class="bi bi-circle-fill"></i>
            {{ orders.length }} órdenes
          </div>
          <button class="btn btn-primary" @click="toggleAutoRefresh" :class="{ 'active': autoRefresh }">
            <i class="bi bi-play-circle" v-if="!autoRefresh"></i>
            <i class="bi bi-pause-circle" v-else></i>
            {{ autoRefresh ? 'Pausar' : 'Auto' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total-orders">
          <i class="bi bi-cart-check"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ orders.length }}</div>
          <div class="stat-label">Total Órdenes</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon unique-users">
          <i class="bi bi-people"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ uniqueUsers }}</div>
          <div class="stat-label">Usuarios Únicos</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon total-revenue">
          <i class="bi bi-currency-dollar"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatLargeNumber(totalRevenue) }}</div>
          <div class="stat-label">Ingreso Total</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon avg-order">
          <i class="bi bi-graph-up"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatLargeNumber(averageOrderValue) }}</div>
          <div class="stat-label">Valor Promedio</div>
        </div>
      </div>
    </div>

    <!-- Controls Section -->
    <div class="controls-section">
      <div class="search-container">
        <i class="bi bi-search search-icon"></i>
        <input
          type="text"
          class="search-input"
          placeholder="Buscar por usuario, email, producto..."
          v-model="searchQuery"
        />
        <div class="search-results" v-if="searchQuery">
          {{ filteredOrders.length }} resultados
        </div>
      </div>

      <div class="filters-container">
        <select class="filter-select" v-model="userFilter">
          <option value="">Todos los usuarios</option>
          <option v-for="user in userList" :key="user" :value="user">
            {{ user }}
          </option>
        </select>

        <select class="filter-select" v-model="paymentMethodFilter">
          <option value="">Todos los métodos</option>
          <option value="1">Tarjeta de Crédito</option>
          <option value="2">Tarjeta de Débito</option>
          <option value="3">PayPal</option>
          <option value="10">Otro</option>
        </select>

        <select class="filter-select" v-model="sortBy">
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="price-high">Mayor precio</option>
          <option value="price-low">Menor precio</option>
        </select>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="table-container">
      <div class="table-responsive">
        <table class="orders-table">
          <thead>
            <tr>
              <th class="column-id" @click="sortByField('id')">
                <span>ID</span>
                <i class="bi bi-arrow-down-up sort-icon"></i>
              </th>
              <th class="column-user" @click="sortByField('userName')">
                <span>Usuario</span>
                <i class="bi bi-arrow-down-up sort-icon"></i>
              </th>
              <th class="column-customer">Cliente</th>
              <th class="column-email">Email</th>
              <th class="column-amount" @click="sortByField('totalPrice')">
                <span>Total</span>
                <i class="bi bi-arrow-down-up sort-icon"></i>
              </th>
              <th class="column-payment">Método Pago</th>
              <th class="column-location">Ubicación</th>
              <th class="column-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in paginatedOrders" :key="order.id" 
                class="order-row">
              <td class="column-id">
                <span class="order-id">#{{ order.id }}</span>
              </td>
              <td class="column-user">
                <div class="user-info">
                  <div class="user-avatar">
                    {{ getInitials(order.userName) }}
                  </div>
                  <div class="user-details">
                    <span class="username">{{ order.userName }}</span>
                  </div>
                </div>
              </td>
              <td class="column-customer">
                <div class="customer-info">
                  <strong>{{ order.firstName }} {{ order.lastName }}</strong>
                </div>
              </td>
              <td class="column-email">
                <div class="email-info">
                  <i class="bi bi-envelope"></i>
                  {{ order.emailAddress }}
                </div>
              </td>
              <td class="column-amount">
                <div class="amount" :class="getAmountClass(order.totalPrice)">
                  ${{ order.totalPrice.toLocaleString() }}
                </div>
              </td>
              <td class="column-payment">
                <div class="payment-method" :class="getPaymentMethodClass(order.paymentMethod)">
                  {{ getPaymentMethodText(order.paymentMethod) }}
                </div>
              </td>
              <td class="column-location">
                <div class="location-info">
                  <i class="bi bi-geo-alt"></i>
                  <span class="truncate-text">{{ order.state }}, {{ order.country }}</span>
                </div>
              </td>
              <td class="column-actions">
                <div class="action-buttons">
                  <button class="btn-action btn-view" @click="viewOrder(order)" title="Ver detalles">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn-action btn-process" @click="processOrder(order)" title="Procesar orden">
                    <i class="bi bi-check-lg"></i>
                  </button>
                  <button class="btn-action btn-delete" @click="deleteOrder(order)" title="Eliminar orden">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <i class="bi bi-inbox empty-icon"></i>
        <h3>No hay órdenes en la cola</h3>
        <p>La cola de RabbitMQ está vacía o no hay órdenes que coincidan con tu búsqueda</p>
        <button class="btn btn-primary" @click="fetchOrders">
          <i class="bi bi-arrow-clockwise"></i>
          Recargar Órdenes
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="filteredOrders.length > 0" class="pagination-container">
        <div class="pagination-info">
          Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ filteredOrders.length }} órdenes
        </div>
        <div class="pagination-controls">
          <button class="btn-pagination" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
            <i class="bi bi-chevron-left"></i>
          </button>
          
          <button v-for="page in visiblePages" :key="page"
                  class="btn-page" 
                  :class="{ active: page === currentPage }"
                  @click="changePage(page)">
            {{ page }}
          </button>
          
          <button class="btn-pagination" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
        
        <div class="page-size-selector">
          <select v-model="pageSize" class="page-size-select">
            <option value="10">10 por página</option>
            <option value="25">25 por página</option>
            <option value="50">50 por página</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="selectedOrder" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <div class="header-content">
            <h2 class="modal-title">
              <i class="bi bi-receipt"></i>
              Detalles de la Orden
            </h2>
            <button class="btn-close" @click="closeModal" title="Cerrar">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <div class="modal-body">
          <div class="order-details">
            <!-- Información General -->
            <div class="detail-section">
              <h3 class="section-title">Información General</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>ID de Orden:</label>
                  <span class="detail-value">#{{ selectedOrder.id }}</span>
                </div>
                <div class="detail-item">
                  <label>Usuario:</label>
                  <span class="detail-value">{{ selectedOrder.userName }}</span>
                </div>
                <div class="detail-item">
                  <label>Total:</label>
                  <span class="detail-value amount-highlight">${{ selectedOrder.totalPrice.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Información del Cliente -->
            <div class="detail-section">
              <h3 class="section-title">Información del Cliente</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Nombre:</label>
                  <span class="detail-value">{{ selectedOrder.firstName }} {{ selectedOrder.lastName }}</span>
                </div>
                <div class="detail-item">
                  <label>Email:</label>
                  <span class="detail-value">{{ selectedOrder.emailAddress }}</span>
                </div>
              </div>
            </div>

            <!-- Dirección de Envío -->
            <div class="detail-section">
              <h3 class="section-title">Dirección de Envío</h3>
              <div class="detail-grid">
                <div class="detail-item full-width">
                  <label>Dirección:</label>
                  <span class="detail-value">{{ selectedOrder.addressLine }}</span>
                </div>
                <div class="detail-item">
                  <label>Ciudad/Estado:</label>
                  <span class="detail-value">{{ selectedOrder.state }}</span>
                </div>
                <div class="detail-item">
                  <label>País:</label>
                  <span class="detail-value">{{ selectedOrder.country }}</span>
                </div>
                <div class="detail-item">
                  <label>Código Postal:</label>
                  <span class="detail-value">{{ selectedOrder.zipCode }}</span>
                </div>
              </div>
            </div>

            <!-- Información de Pago -->
            <div class="detail-section">
              <h3 class="section-title">Información de Pago</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Método de Pago:</label>
                  <span class="detail-value payment-badge" :class="getPaymentMethodClass(selectedOrder.paymentMethod)">
                    {{ getPaymentMethodText(selectedOrder.paymentMethod) }}
                  </span>
                </div>
                <div class="detail-item">
                  <label>Nombre en Tarjeta:</label>
                  <span class="detail-value">{{ selectedOrder.cardName }}</span>
                </div>
                <div class="detail-item">
                  <label>Número de Tarjeta:</label>
                  <span class="detail-value">**** **** **** {{ selectedOrder.cardNumber.slice(-4) }}</span>
                </div>
                <div class="detail-item">
                  <label>Expiración:</label>
                  <span class="detail-value">{{ selectedOrder.expiration }}</span>
                </div>
                <div class="detail-item">
                  <label>CVV:</label>
                  <span class="detail-value">***</span>
                </div>
              </div>
            </div>

            <!-- Datos JSON Completos -->
            <div class="detail-section">
              <h3 class="section-title">Datos JSON Completos</h3>
              <pre class="json-viewer">{{ JSON.stringify(selectedOrder, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="footer-actions">
            <button class="btn btn-secondary" @click="closeModal">
              <i class="bi bi-arrow-left"></i>
              Cerrar
            </button>
            <button class="btn btn-success" @click="processSelectedOrder">
              <i class="bi bi-check-lg"></i>
              Procesar Orden
            </button>
            <button class="btn btn-danger" @click="deleteSelectedOrder">
              <i class="bi bi-trash"></i>
              Eliminar Orden
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      <i class="bi" :class="toast.icon"></i>
      <span class="toast-message">{{ toast.message }}</span>
      <button class="toast-close" @click="hideToast">
        <i class="bi bi-x"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrdersDashboardView",
  data() {
    return {
      orders: [],
      loading: false,
      searchQuery: "",
      userFilter: "",
      paymentMethodFilter: "",
      sortBy: "newest",
      sortField: "id",
      sortDirection: "desc",
      selectedOrder: null,
      currentPage: 1,
      pageSize: 10,
      autoRefresh: false,
      autoRefreshInterval: null,
      toast: {
        show: false,
        message: "",
        type: "info",
        icon: "bi-info-circle"
      }
    };
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders;

      // Filtro de búsqueda
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(order => 
          order.userName.toLowerCase().includes(query) ||
          order.firstName.toLowerCase().includes(query) ||
          order.lastName.toLowerCase().includes(query) ||
          order.emailAddress.toLowerCase().includes(query) ||
          order.id.toString().includes(query)
        );
      }

      // Filtro por usuario
      if (this.userFilter) {
        filtered = filtered.filter(order => order.userName === this.userFilter);
      }

      // Filtro por método de pago
      if (this.paymentMethodFilter) {
        filtered = filtered.filter(order => order.paymentMethod.toString() === this.paymentMethodFilter);
      }

      // Ordenamiento
      return this.sortOrders(filtered);
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredOrders.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.pageSize);
    },
    startIndex() {
      return (this.currentPage - 1) * this.pageSize;
    },
    endIndex() {
      return Math.min(this.startIndex + this.pageSize, this.filteredOrders.length);
    },
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(total, start + 4);
      
      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
    uniqueUsers() {
      const users = new Set(this.orders.map(order => order.userName));
      return users.size;
    },
    totalRevenue() {
      return this.orders.reduce((sum, order) => sum + order.totalPrice, 0);
    },
    averageOrderValue() {
      return this.orders.length > 0 ? this.totalRevenue / this.orders.length : 0;
    },
    userList() {
      return [...new Set(this.orders.map(order => order.userName))].sort();
    },
    getQueueStatusClass() {
      if (this.orders.length === 0) return 'status-empty';
      if (this.orders.length < 10) return 'status-low';
      if (this.orders.length < 50) return 'status-medium';
      return 'status-high';
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    userFilter() {
      this.currentPage = 1;
    },
    paymentMethodFilter() {
      this.currentPage = 1;
    },
    pageSize() {
      this.currentPage = 1;
    },
    autoRefresh(newVal) {
      if (newVal) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    }
  },
  mounted() {
    this.fetchOrders();
  },
  beforeUnmount() {
    this.stopAutoRefresh();
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const response = await fetch('https://localhost:7191/api/messages/orders');
        if (!response.ok) throw new Error('Error al cargar órdenes');
        
        const data = await response.json();
        
        this.orders = Array.isArray(data) ? data : [];
        this.showToast('Órdenes actualizadas correctamente', 'success');
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.showToast('Error al cargar las órdenes', 'error');
      } finally {
        this.loading = false;
      }
    },

    sortOrders(orders) {
      return orders.sort((a, b) => {
        let modifier = this.sortDirection === 'asc' ? 1 : -1;
        
        if (this.sortField === 'totalPrice') {
          return (a.totalPrice - b.totalPrice) * modifier;
        } else if (this.sortField === 'userName') {
          return a.userName.localeCompare(b.userName) * modifier;
        } else {
          return (a.id - b.id) * modifier;
        }
      });
    },

    formatLargeNumber(number) {
      if (number >= 1000000) {
        return '$' + (number / 1000000).toFixed(1) + 'M';
      } else if (number >= 1000) {
        return '$' + (number / 1000).toFixed(1) + 'K';
      } else {
        return '$' + number.toLocaleString();
      }
    },

    sortByField(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'desc';
      }
    },

    viewOrder(order) {
      this.selectedOrder = { ...order };
    },

    processOrder(order) {
      if (!confirm(`¿Procesar orden #${order.id} de ${order.userName} por $${order.totalPrice.toLocaleString()}?`)) return;
      
      try {
        // Simular procesamiento
        this.orders = this.orders.filter(o => o.id !== order.id);
        this.showToast(`Orden #${order.id} procesada correctamente`, 'success');
      } catch (error) {
        this.showToast('Error al procesar la orden', 'error');
      }
    },

    async deleteOrder(order) {
      if (!confirm(`¿Eliminar orden #${order.id} de ${order.userName}?`)) return;
      
      try {
        this.orders = this.orders.filter(o => o.id !== order.id);
        this.showToast('Orden eliminada correctamente', 'success');
      } catch (error) {
        this.showToast('Error al eliminar la orden', 'error');
      }
    },

    processSelectedOrder() {
      if (this.selectedOrder) {
        this.processOrder(this.selectedOrder);
        this.closeModal();
      }
    },

    deleteSelectedOrder() {
      if (this.selectedOrder) {
        this.deleteOrder(this.selectedOrder);
        this.closeModal();
      }
    },

    closeModal() {
      this.selectedOrder = null;
    },

    changePage(page) {
      this.currentPage = page;
    },

    toggleAutoRefresh() {
      this.autoRefresh = !this.autoRefresh;
    },

    startAutoRefresh() {
      this.autoRefreshInterval = setInterval(() => {
        this.fetchOrders();
      }, 5000);
    },

    stopAutoRefresh() {
      if (this.autoRefreshInterval) {
        clearInterval(this.autoRefreshInterval);
        this.autoRefreshInterval = null;
      }
    },

    getInitials(name) {
      return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
    },

    getAmountClass(amount) {
      if (amount < 100) return 'amount-low';
      if (amount < 1000) return 'amount-medium';
      return 'amount-high';
    },

    getPaymentMethodText(method) {
      const methods = {
        1: 'Tarjeta Crédito',
        2: 'Tarjeta Débito',
        3: 'PayPal',
        10: 'Otro Método'
      };
      return methods[method] || `Método ${method}`;
    },

    getPaymentMethodClass(method) {
      const classes = {
        1: 'payment-credit',
        2: 'payment-debit',
        3: 'payment-paypal',
        10: 'payment-other'
      };
      return classes[method] || 'payment-other';
    },

    showToast(message, type = 'info') {
      const icons = {
        info: 'bi-info-circle',
        success: 'bi-check-circle',
        error: 'bi-exclamation-circle',
        warning: 'bi-exclamation-triangle'
      };
      
      this.toast = {
        show: true,
        message,
        type,
        icon: icons[type] || icons.info
      };

      setTimeout(() => {
        this.hideToast();
      }, 5000);
    },

    hideToast() {
      this.toast.show = false;
    }
  }
};
</script>

<style scoped>
.orders-dashboard {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Header Styles - Se mantienen igual */
.page-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-section .page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-section .page-subtitle {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-refresh {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-refresh:hover:not(:disabled) {
  background: #e2e8f0;
  color: #334155;
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.stats-badge {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stats-badge.status-empty {
  background: #f3f4f6;
  color: #6b7280;
}

.stats-badge.status-low {
  background: #d1fae5;
  color: #065f46;
}

.stats-badge.status-medium {
  background: #fef3c7;
  color: #92400e;
}

.stats-badge.status-high {
  background: #fee2e2;
  color: #991b1b;
}

/* Statistics Grid - Actualizado para órdenes */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.total-orders {
  background: #dbeafe;
  color: #1e40af;
}

.stat-icon.unique-users {
  background: #fce7f3;
  color: #be185d;
}

.stat-icon.total-revenue {
  background: #f0fdf4;
  color: #15803d;
}

.stat-icon.avg-order {
  background: #fef3c7;
  color: #d97706;
}

.stat-content .stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-content .stat-label {
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

/* Controls Section - Se mantiene igual */
.controls-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.search-container {
  flex: 1;
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-results {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 0.8rem;
}

.filters-container {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.9rem;
  min-width: 150px;
}

/* Table Styles - Actualizado para órdenes */
.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  user-select: none;
}

.orders-table th:hover {
  background: #f1f5f9;
}

.sort-icon {
  margin-left: 0.5rem;
  opacity: 0.5;
}

.orders-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.orders-table tr:last-child td {
  border-bottom: none;
}

.orders-table tr:hover {
  background: #f8fafc;
}

/* Column Specific Styles - Actualizado */
.column-id {
  width: 80px;
}

.column-user {
  width: 150px;
}

.column-customer {
  width: 150px;
}

.column-email {
  width: 200px;
}

.column-amount {
  width: 120px;
}

.column-payment {
  width: 130px;
}

.column-location {
  width: 150px;
}

.column-actions {
  width: 120px;
}

/* Content Styles - Actualizado para órdenes */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
}

.username {
  font-weight: 500;
  color: #1e293b;
}

.customer-info strong {
  color: #1e293b;
}

.email-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.85rem;
}

.amount {
  font-weight: 600;
  font-size: 0.95rem;
}

.amount-low {
  color: #059669;
}

.amount-medium {
  color: #d97706;
}

.amount-high {
  color: #dc2626;
}

.amount-highlight {
  font-size: 1.1rem;
  font-weight: 700;
  color: #059669;
}

.payment-method {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  display: inline-block;
}

.payment-credit {
  background: #dbeafe;
  color: #1e40af;
}

.payment-debit {
  background: #f0fdf4;
  color: #15803d;
}

.payment-paypal {
  background: #fef3c7;
  color: #d97706;
}

.payment-other {
  background: #f3f4f6;
  color: #6b7280;
}

.payment-badge {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.85rem;
}

.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

/* Action Buttons - Actualizado */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-view {
  background: #dbeafe;
  color: #1d4ed8;
}

.btn-view:hover {
  background: #bfdbfe;
}

.btn-process {
  background: #d1fae5;
  color: #065f46;
}

.btn-process:hover {
  background: #a7f3d0;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fecaca;
}

/* Modal Styles - Actualizado para órdenes */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: #f1f5f9;
  color: #475569;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.order-details {
  padding: 2rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.detail-value {
  font-weight: 600;
  color: #1e293b;
  text-align: right;
}

.json-viewer {
  background: #1f2937;
  color: #e5e7eb;
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

/* Toast Notification - Se mantiene igual */
.toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: white;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 10001;
  animation: slideInRight 0.3s ease;
  border-left: 4px solid;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast.info {
  border-left-color: #3b82f6;
}

.toast.success {
  border-left-color: #10b981;
}

.toast.error {
  border-left-color: #ef4444;
}

.toast.warning {
  border-left-color: #f59e0b;
}

.toast-close {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.toast-close:hover {
  background: #f1f5f9;
}

/* Empty State - Se mantiene igual */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: #475569;
  margin-bottom: 0.5rem;
}

/* Pagination - Se mantiene igual */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.pagination-info {
  color: #64748b;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-pagination, .btn-page {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-pagination:hover:not(:disabled),
.btn-page:hover:not(.active) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.btn-page.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-size-select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
}

/* Buttons - Se mantienen igual */
.btn {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary.active {
  background: #1d4ed8;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .orders-dashboard {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .controls-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-container {
    max-width: none;
  }
  
  .filters-container {
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .table-responsive {
    overflow-x: auto;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-header,
  .order-details,
  .modal-footer {
    padding: 1.5rem;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-actions {
    flex-direction: column;
  }
  
  .footer-actions .btn {
    width: 100%;
    justify-content: center;
  }
  
  .toast {
    right: 1rem;
    left: 1rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-container {
    flex-direction: column;
  }
  
  .filter-select {
    min-width: auto;
  }
}
</style>