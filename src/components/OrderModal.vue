<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-content">
          <h2 class="modal-title">
            <i class="bi bi-receipt"></i>
            {{ mode === 'view' ? 'Detalles de Orden' : 'Editar Orden' }}
          </h2>
          <button class="btn-close" @click="closeModal" title="Cerrar">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="order-meta">
          <span class="order-id">Orden #{{ order.id }}</span>
          <span class="order-date">Creada el {{ formatDate(order.createdDate) }}</span>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="order-form">
          <!-- Información del Cliente -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="bi bi-person-badge"></i>
              Información del Cliente
            </h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Usuario *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="localOrder.userName"
                  :readonly="mode === 'view'"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Nombre *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="localOrder.firstName"
                  :readonly="mode === 'view'"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Apellido *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="localOrder.lastName"
                  :readonly="mode === 'view'"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input
                  type="email"
                  class="form-input"
                  v-model="localOrder.emailAddress"
                  :readonly="mode === 'view'"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Información de Envío -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="bi bi-truck"></i>
              Dirección de Envío
            </h3>
            <div class="form-grid">
              <div class="form-group full-width">
                <label class="form-label">Dirección *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="localOrder.addressLine"
                  :readonly="mode === 'view'"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">País *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="localOrder.country"
                  :readonly="mode === 'view'"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Estado *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="localOrder.state"
                  :readonly="mode === 'view'"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Código Postal *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="localOrder.zipCode"
                  :readonly="mode === 'view'"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Información de Pago -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="bi bi-credit-card"></i>
              Información de Pago
            </h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Total *</label>
                <div class="input-with-symbol">
                  <span class="currency-symbol">$</span>
                  <input
                    type="number"
                    class="form-input"
                    v-model="localOrder.totalPrice"
                    :readonly="mode === 'view'"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Método de Pago *</label>
                <select
                  class="form-input"
                  v-model="localOrder.paymentMethod"
                  :disabled="mode === 'view'"
                  required
                >
                  <option value="1">Tarjeta de Crédito</option>
                  <option value="2">Tarjeta de Débito</option>
                  <option value="3">PayPal</option>
                  <option value="4">Transferencia</option>
                </select>
              </div>
            </div>

            <div v-if="localOrder.paymentMethod && ['1','2'].includes(localOrder.paymentMethod.toString())" class="card-details">
              <h4 class="subsection-title">Detalles de Tarjeta</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Nombre en Tarjeta *</label>
                  <input
                    type="text"
                    class="form-input"
                    v-model="localOrder.cardName"
                    :readonly="mode === 'view'"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Número de Tarjeta *</label>
                  <input
                    type="text"
                    class="form-input"
                    v-model="localOrder.cardNumber"
                    :readonly="mode === 'view'"
                    placeholder="**** **** **** ****"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Expiración *</label>
                  <input
                    type="text"
                    class="form-input"
                    v-model="localOrder.expiration"
                    :readonly="mode === 'view'"
                    placeholder="MM/AA"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">CVV *</label>
                  <input
                    type="text"
                    class="form-input"
                    v-model="localOrder.cvv"
                    :readonly="mode === 'view'"
                    placeholder="***"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Información Adicional -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="bi bi-info-circle"></i>
              Información Adicional
            </h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Estado de la Orden</label>
                <select
                  class="form-input"
                  v-model="localOrder.status"
                  :disabled="mode === 'view'"
                >
                  <option value="pending">Pendiente</option>
                  <option value="processing">Procesando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Notas</label>
                <textarea
                  class="form-input"
                  v-model="localOrder.notes"
                  :readonly="mode === 'view'"
                  rows="3"
                  placeholder="Notas adicionales sobre la orden..."
                ></textarea>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <div class="footer-actions">
          <button class="btn btn-secondary" @click="closeModal" type="button">
            <i class="bi bi-arrow-left"></i>
            Cancelar
          </button>
          
          <div class="primary-actions" v-if="mode === 'edit'">
            <button 
              class="btn btn-danger" 
              @click="deleteOrder" 
              type="button"
              :disabled="loading"
            >
              <i class="bi bi-trash"></i>
              Eliminar Orden
            </button>
            <button 
              class="btn btn-primary" 
              @click="handleSubmit" 
              :disabled="loading || !isFormValid"
              type="submit"
            >
              <i class="bi bi-check-lg" v-if="!loading"></i>
              <i class="bi bi-arrow-repeat spin" v-else></i>
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>

          <div class="primary-actions" v-else>
            <button 
              class="btn btn-outline" 
              @click="switchToEdit" 
              type="button"
            >
              <i class="bi bi-pencil"></i>
              Editar Orden
            </button>
            <button class="btn btn-primary" @click="closeModal" type="button">
              <i class="bi bi-check-lg"></i>
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderModal",
  props: {
    order: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'view',
      validator: (value) => ['view', 'edit'].includes(value)
    }
  },
  data() {
    return {
      localOrder: {},
      localMode: this.mode
    };
  },
  computed: {
    isFormValid() {
      const requiredFields = [
        'userName',
        'firstName',
        'lastName',
        'emailAddress',
        'totalPrice',
        'addressLine',
        'country',
        'state',
        'zipCode'
      ];
      
      return requiredFields.every(field => {
        const value = this.localOrder[field];
        return value !== null && value !== undefined && value.toString().trim() !== '';
      });
    }
  },
  watch: {
    order: {
      handler(newOrder) {
        this.localOrder = { ...newOrder };
        // Asegurar que paymentMethod sea string para el select
        if (this.localOrder.paymentMethod) {
          this.localOrder.paymentMethod = this.localOrder.paymentMethod.toString();
        }
      },
      immediate: true,
      deep: true
    },
    mode(newMode) {
      this.localMode = newMode;
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleSubmit() {
      if (this.localMode === 'edit' && this.isFormValid) {
        // Convertir paymentMethod de vuelta a número si es necesario
        const orderToSave = {
          ...this.localOrder,
          paymentMethod: parseInt(this.localOrder.paymentMethod) || this.localOrder.paymentMethod
        };
        this.$emit('save', orderToSave);
      }
    },
    switchToEdit() {
      this.localMode = 'edit';
      this.$emit('modeChange', 'edit');
    },
    deleteOrder() {
      if (confirm('¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.')) {
        this.$emit('delete', this.localOrder.id);
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'Fecha no disponible';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
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
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 900px;
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

/* Header */
.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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

.modal-title i {
  color: #3b82f6;
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

.order-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
}

.order-id {
  font-weight: 600;
  color: #3b82f6;
}

.order-date {
  color: #64748b;
}

/* Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.order-form {
  padding: 0;
}

.form-section {
  padding: 2rem;
  border-bottom: 1px solid #f1f5f9;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #3b82f6;
}

.subsection-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 1.5rem 0 1rem 0;
  padding-left: 1.75rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:read-only {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #64748b;
  cursor: not-allowed;
}

.form-input:disabled {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #64748b;
  cursor: not-allowed;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.input-with-symbol {
  position: relative;
}

.currency-symbol {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-weight: 500;
}

.input-with-symbol .form-input {
  padding-left: 2rem;
}

.card-details {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
}

/* Footer */
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

.primary-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn {
  padding: 0.75rem 1.5rem;
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

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-outline {
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #9ca3af;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
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

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header,
  .form-section,
  .modal-footer {
    padding: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .footer-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .primary-actions {
    justify-content: space-between;
  }
  
  .order-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .modal-header,
  .form-section,
  .modal-footer {
    padding: 1rem;
  }
  
  .btn {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
  
  .primary-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .primary-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>