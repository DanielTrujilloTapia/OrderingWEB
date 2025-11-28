<template>
  <div class="orders-management">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Gestión de Órdenes</h1>
          <p class="page-subtitle">Administra y supervisa todas las órdenes del sistema</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-refresh" @click="fetchOrders" :disabled="loading">
            <i class="bi bi-arrow-clockwise" :class="{ 'spin': loading }"></i>
            Actualizar
          </button>
          <div class="stats-badge">
            <i class="bi bi-cart-check"></i>
            {{ orders.length }} órdenes
          </div>
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
          placeholder="Buscar por usuario, email o ID..."
          v-model="searchQuery"
        />
        <div class="search-results" v-if="searchQuery">
          {{ filteredOrders.length }} resultados
        </div>
      </div>

      <div class="filters-container">
        <select class="filter-select" v-model="statusFilter">
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
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
              <th class="column-checkbox">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
              </th>
              <th class="column-id" @click="sortByField('id')">
                <span>ID</span>
                <i class="bi bi-arrow-down-up sort-icon"></i>
              </th>
              <th class="column-user" @click="sortByField('userName')">
                <span>Usuario</span>
                <i class="bi bi-arrow-down-up sort-icon"></i>
              </th>
              <th class="column-customer">Cliente</th>
              <th class="column-contact">Contacto</th>
              <th class="column-amount" @click="sortByField('totalPrice')">
                <span>Total</span>
                <i class="bi bi-arrow-down-up sort-icon"></i>
              </th>
              <th class="column-location">Ubicación</th>
               <th class="column-status">Estado</th>
              <th class="column-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in paginatedOrders" :key="order.id" 
                :class="{ 'selected': selectedOrders.includes(order.id) }">
              <td class="column-checkbox">
                <input type="checkbox" :value="order.id" v-model="selectedOrders">
              </td>
              <td class="column-id">
                <span class="order-id">#{{ order.id }}</span>
              </td>
              <td class="column-user">
                <div class="user-info">
                  <div class="avatar">
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
              <td class="column-contact">
                <div class="contact-info">
                  <div class="email">
                    <i class="bi bi-envelope"></i>
                    {{ order.emailAddress }}
                  </div>
                </div>
              </td>
              <td class="column-amount">
                <div class="amount">${{ order.totalPrice.toLocaleString() }}</div>
              </td>
              <td class="column-location">
                <div class="location-info">
                  <i class="bi bi-geo-alt"></i>
                  <span class="truncate-text">{{ order.addressLine }}, {{ order.state }}</span>
                </div>
              </td>
              <td class="column-status">
                <span class="status-badge" :class="getStatusClass(order)">
                  {{ getStatusText(order) }}
                </span>
              </td>
              <td class="column-actions">
                <div class="action-buttons">
                  <button class="btn-action btn-view" @click="viewOrder(order)" title="Ver detalles">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn-action btn-edit" @click="editOrder(order)" title="Editar orden">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn-action btn-delete" @click="deleteOrder(order.id)" title="Eliminar orden">
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
        <h3>No se encontraron órdenes</h3>
        <p>No hay órdenes que coincidan con tu búsqueda</p>
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

    <!-- Bulk Actions -->
    <div v-if="selectedOrders.length > 0" class="bulk-actions">
      <div class="bulk-actions-content">
        <span class="selected-count">{{ selectedOrders.length }} órdenes seleccionadas</span>
        <div class="bulk-buttons">
          <button class="btn-bulk btn-bulk-export" @click="exportSelected">
            <i class="bi bi-download"></i>
            Exportar
          </button>
          <button class="btn-bulk btn-bulk-delete" @click="deleteSelected">
            <i class="bi bi-trash"></i>
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Order Modal -->
    <OrderModal 
      v-if="showModal"
      :order="selectedOrder"
      :loading="modalLoading"
      :mode="modalMode"
      @save="updateOrder"
      @close="closeModal"
      @delete="handleDeleteOrder"
      @modeChange="handleModeChange"
    />
  </div>
</template>

<script>
import OrderModal from '../components/OrderModal.vue';

export default {
  name: "OrdersManagement",
  components: { OrderModal },
  data() {
    return {
      orders: [],
      searchQuery: "",
      statusFilter: "",
      sortBy: "newest",
      sortField: "id",
      sortDirection: "desc",
      selectedOrder: null,
      selectedOrders: [],
      loading: false,
      modalLoading: false,
      currentPage: 1,
      pageSize: 10,
      showModal: false,
      modalMode: 'view' // 'view' or 'edit'
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
          order.emailAddress.toLowerCase().includes(query) ||
          order.id.toString().includes(query) ||
          `${order.firstName} ${order.lastName}`.toLowerCase().includes(query)
        );
      }

      // Filtro por estado
      if (this.statusFilter) {
        filtered = filtered.filter(order => this.getStatusText(order) === this.statusFilter);
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
    selectAll: {
      get() {
        return this.filteredOrders.length > 0 && 
               this.selectedOrders.length === this.filteredOrders.length;
      },
      set(value) {
        this.selectedOrders = value ? this.filteredOrders.map(order => order.id) : [];
      }
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    statusFilter() {
      this.currentPage = 1;
    },
    pageSize() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const res = await fetch("http://localhost:5002/api/v1/Order");
        if (!res.ok) throw new Error("Error al cargar órdenes");
        this.orders = await res.json();
        console.log('Órdenes cargadas:', this.orders.length);
      } catch (error) {
        console.error("Error al cargar órdenes", error);
        this.showNotification("Error al cargar las órdenes", "error");
      } finally {
        this.loading = false;
      }
    },

    viewOrder(order) {
      console.log('Viendo orden:', order);
      this.selectedOrder = { ...order };
      this.modalMode = 'view';
      this.showModal = true;
    },

    editOrder(order) {
      console.log('Editando orden:', order);
      this.selectedOrder = { ...order };
      this.modalMode = 'edit';
      this.showModal = true;
    },

    async updateOrder(updatedOrder) {
      this.modalLoading = true;
      try {
        console.log('Actualizando orden:', updatedOrder);
        
        const res = await fetch("http://localhost:5002/api/v1/Order", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedOrder),
        });
        
        if (!res.ok) throw new Error("Error al actualizar orden");
        
        this.showNotification("Orden actualizada correctamente", "success");
        this.fetchOrders();
        this.closeModal();
      } catch (error) {
        console.error('Error al actualizar:', error);
        this.showNotification(error.message, "error");
      } finally {
        this.modalLoading = false;
      }
    },

    async handleDeleteOrder(orderId) {
      if (!confirm("¿Estás seguro de que deseas eliminar esta orden?")) return;
      
      try {
        const res = await fetch(`http://localhost:5002/api/v1/Order/delete?id=${orderId}`, {
          method: "DELETE",
        });
        
        if (!res.ok) throw new Error("Error al eliminar la orden");
        
        this.showNotification("Orden eliminada correctamente", "success");
        this.fetchOrders();
        this.closeModal();
      } catch (error) {
        this.showNotification(error.message, "error");
      }
    },

    async deleteOrder(id) {
      if (!confirm("¿Estás seguro de que deseas eliminar esta orden?")) return;
      
      try {
        const res = await fetch(`http://localhost:5002/api/v1/Order/delete?id=${id}`, {
          method: "DELETE",
        });
        
        if (!res.ok) throw new Error("Error al eliminar la orden");
        
        this.showNotification("Orden eliminada correctamente", "success");
        this.fetchOrders();
      } catch (error) {
        this.showNotification(error.message, "error");
      }
    },

    closeModal() {
      this.showModal = false;
      this.selectedOrder = null;
      this.modalMode = 'view';
      this.modalLoading = false;
    },

    handleModeChange(mode) {
      this.modalMode = mode;
    },

    // ... (otros métodos se mantienen igual)
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

    sortByField(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'desc';
      }
    },

    getInitials(name) {
      return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
    },

    getStatusClass(order) {
      const status = this.getStatusText(order);
      return `status-${status}`;
    },

    getStatusText(order) {
      const statuses = ['pending', 'completed', 'cancelled'];
      return statuses[order.id % 3];
    },

    async deleteSelected() {
      if (!confirm(`¿Eliminar ${this.selectedOrders.length} órdenes seleccionadas?`)) return;
      
      try {
        const promises = this.selectedOrders.map(id => 
          fetch(`http://localhost:5002/api/v1/Order/delete?id=${id}`, { method: "DELETE" })
        );
        
        await Promise.all(promises);
        this.showNotification(`${this.selectedOrders.length} órdenes eliminadas`, "success");
        this.selectedOrders = [];
        this.fetchOrders();
      } catch (error) {
        this.showNotification("Error al eliminar órdenes", "error");
      }
    },

    exportSelected() {
      const data = this.orders.filter(order => this.selectedOrders.includes(order.id));
      console.log("Exporting data:", data);
      this.showNotification("Datos exportados correctamente", "success");
    },

    changePage(page) {
      this.currentPage = page;
    },

    toggleSelectAll() {
      this.selectAll = !this.selectAll;
    },

    showNotification(message, type) {
      // Implementar sistema de notificaciones
      const color = type === 'success' ? '#10b981' : '#ef4444';
      console.log(`%c${type.toUpperCase()}: ${message}`, `color: ${color}; font-weight: bold;`);
      
      // Puedes implementar un toast real aquí
      alert(`${type.toUpperCase()}: ${message}`);
    }
  }
};
</script>

<!-- Los estilos se mantienen igual -->

<style scoped>
.orders-management {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Header Styles */
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
  background: #dbeafe;
  color: #1e40af;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Controls Section */
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

/* Table Styles */
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

.orders-table tr.selected {
  background: #dbeafe;
}

/* Column Specific Styles */
.column-checkbox {
  width: 40px;
  text-align: center;
}

.column-id {
  width: 80px;
}

.column-user {
  width: 200px;
}

.column-customer {
  width: 150px;
}

.column-contact {
  width: 200px;
}

.column-amount {
  width: 100px;
  text-align: right;
}

.column-location {
  width: 200px;
}

.column-status {
  width: 120px;
}

.column-actions {
  width: 140px;
}

/* Content Styles */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
}

.user-details .username {
  font-weight: 500;
  color: #1e293b;
}

.contact-info .email {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
}

.amount {
  font-weight: 600;
  color: #059669;
  font-size: 0.95rem;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
}

.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellips;
  max-width: 150px;
}

/* Status Badges */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
}

.status-completed {
  background: #d1fae5;
  color: #059669;
}

.status-cancelled {
  background: #fee2e2;
  color: #dc2626;
}

/* Action Buttons */
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

.btn-edit {
  background: #fef3c7;
  color: #d97706;
}

.btn-edit:hover {
  background: #fde68a;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fecaca;
}

/* Empty State */
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

/* Pagination */
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

/* Bulk Actions */
.bulk-actions {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  z-index: 1000;
}

.bulk-actions-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.selected-count {
  font-weight: 500;
}

.bulk-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn-bulk {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn-bulk-export {
  background: #374151;
  color: white;
}

.btn-bulk-export:hover {
  background: #4b5563;
}

.btn-bulk-delete {
  background: #dc2626;
  color: white;
}

.btn-bulk-delete:hover {
  background: #ef4444;
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
  .orders-management {
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
}

@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .bulk-actions {
    width: 90%;
    bottom: 1rem;
  }
  
  .bulk-actions-content {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>