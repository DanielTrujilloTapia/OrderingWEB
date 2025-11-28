<template>
  <div class="new-order-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <i class="bi bi-plus-circle"></i>
            Nueva Orden
          </h1>
          <p class="page-subtitle">Crear una nueva orden de compra</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" @click="resetForm">
            <i class="bi bi-arrow-clockwise"></i>
            Limpiar Formulario
          </button>
          <button class="btn btn-secondary" @click="$router.back()">
            <i class="bi bi-arrow-left"></i>
            Volver
          </button>
        </div>
      </div>
    </div>

    <div class="order-creation-layout">
      <!-- Formulario Principal -->
      <div class="form-container">
        <div class="form-card">
          <!-- Información del Cliente -->
          <section class="form-section">
            <div class="section-header">
              <i class="bi bi-person-badge section-icon"></i>
              <h2 class="section-title">Información del Cliente</h2>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  Nombre *
                  <span class="label-helper">Nombre del cliente</span>
                </label>
                <div class="input-container">
                  <i class="bi bi-person input-icon"></i>
                  <input
                    v-model="firstName"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': !firstName && formSubmitted }"
                    placeholder="Ej: Juan"
                    maxlength="50"
                  />
                </div>
                <div v-if="!firstName && formSubmitted" class="error-message">
                  <i class="bi bi-exclamation-circle"></i> El nombre es obligatorio
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Apellido *
                  <span class="label-helper">Apellido del cliente</span>
                </label>
                <div class="input-container">
                  <i class="bi bi-person input-icon"></i>
                  <input
                    v-model="lastName"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': !lastName && formSubmitted }"
                    placeholder="Ej: Pérez"
                    maxlength="50"
                  />
                </div>
                <div v-if="!lastName && formSubmitted" class="error-message">
                  <i class="bi bi-exclamation-circle"></i> El apellido es obligatorio
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Usuario
                  <span class="label-helper">Nombre de usuario único</span>
                </label>
                <div class="input-container">
                  <i class="bi bi-at input-icon"></i>
                  <input
                    v-model="userName"
                    type="text"
                    class="form-input"
                    placeholder="Ej: juan.perez"
                    maxlength="30"
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Email *
                  <span class="label-helper">Correo electrónico válido</span>
                </label>
                <div class="input-container">
                  <i class="bi bi-envelope input-icon"></i>
                  <input
                    v-model="emailAddress"
                    type="email"
                    class="form-input"
                    :class="{ 'input-error': (!emailAddress || !isValidEmail) && formSubmitted }"
                    placeholder="Ej: juan@empresa.com"
                  />
                </div>
                <div v-if="(!emailAddress || !isValidEmail) && formSubmitted" class="error-message">
                  <i class="bi bi-exclamation-circle"></i> 
                  {{ !emailAddress ? 'El email es obligatorio' : 'Ingresa un email válido' }}
                </div>
              </div>
            </div>
          </section>

          <!-- Dirección de Envío -->
          <section class="form-section">
            <div class="section-header">
              <i class="bi bi-geo-alt section-icon"></i>
              <h2 class="section-title">Dirección de Envío</h2>
            </div>
            <div class="form-grid">
              <div class="form-group full-width">
                <label class="form-label">
                  Dirección Completa *
                  <span class="label-helper">Calle, número, colonia</span>
                </label>
                <div class="input-container">
                  <i class="bi bi-house-door input-icon"></i>
                  <input
                    v-model="addressLine"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': !addressLine && formSubmitted }"
                    placeholder="Ej: Av. Principal #123, Col. Centro"
                    maxlength="200"
                  />
                </div>
                <div v-if="!addressLine && formSubmitted" class="error-message">
                  <i class="bi bi-exclamation-circle"></i> La dirección es obligatoria
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  País *
                  <span class="label-helper">País de destino</span>
                </label>
                <div class="input-container">
                  <i class="bi bi-globe input-icon"></i>
                  <input
                    v-model="country"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': !country && formSubmitted }"
                    placeholder="Ej: México"
                    maxlength="50"
                  />
                </div>
                <div v-if="!country && formSubmitted" class="error-message">
                  <i class="bi bi-exclamation-circle"></i> El país es obligatorio
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Estado *
                  <span class="label-helper">Estado o provincia</span>
                </label>
                <div class="input-container">
                  <i class="bi bi-geo input-icon"></i>
                  <input
                    v-model="state"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': !state && formSubmitted }"
                    placeholder="Ej: Ciudad de México"
                    maxlength="50"
                  />
                </div>
                <div v-if="!state && formSubmitted" class="error-message">
                  <i class="bi bi-exclamation-circle"></i> El estado es obligatorio
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Código Postal *
                  <span class="label-helper">Código postal válido</span>
                </label>
                <div class="input-container">
                  <i class="bi bi-postcard input-icon"></i>
                  <input
                    v-model="zipCode"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': !zipCode && formSubmitted }"
                    placeholder="Ej: 01000"
                    maxlength="10"
                  />
                </div>
                <div v-if="!zipCode && formSubmitted" class="error-message">
                  <i class="bi bi-exclamation-circle"></i> El código postal es obligatorio
                </div>
              </div>
            </div>
          </section>

          <!-- Información de Pago -->
          <section class="form-section">
            <div class="section-header">
              <i class="bi bi-credit-card section-icon"></i>
              <h2 class="section-title">Información de Pago</h2>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  Total *
                  <span class="label-helper">Monto total de la orden</span>
                </label>
                <div class="input-container">
                  <span class="currency-symbol">$</span>
                  <input
                    v-model.number="totalPrice"
                    type="number"
                    class="form-input"
                    :class="{ 'input-error': (!totalPrice || totalPrice <= 0) && formSubmitted }"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div v-if="(!totalPrice || totalPrice <= 0) && formSubmitted" class="error-message">
                  <i class="bi bi-exclamation-circle"></i> 
                  {{ !totalPrice ? 'El total es obligatorio' : 'El total debe ser mayor a 0' }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Método de Pago *
                  <span class="label-helper">Selecciona el método de pago</span>
                </label>
                <div class="input-container">
                  <i class="bi bi-wallet2 input-icon"></i>
                  <select
                    v-model.number="paymentMethod"
                    class="form-input"
                    :class="{ 'input-error': !paymentMethod && formSubmitted }"
                  >
                    <option value="">Seleccionar método</option>
                    <option value="1">Tarjeta de Crédito</option>
                    <option value="2">Tarjeta de Débito</option>
                    <option value="3">PayPal</option>
                    <option value="4">Transferencia Bancaria</option>
                    <option value="5">Efectivo</option>
                  </select>
                </div>
                <div v-if="!paymentMethod && formSubmitted" class="error-message">
                  <i class="bi bi-exclamation-circle"></i> El método de pago es obligatorio
                </div>
              </div>
            </div>

            <!-- Detalles de Tarjeta (solo si es tarjeta) -->
            <div v-if="paymentMethod && [1, 2].includes(paymentMethod)" class="card-details-section">
              <h3 class="subsection-title">
                <i class="bi bi-credit-card-2-front"></i>
                Detalles de la Tarjeta
              </h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">
                    Nombre en la Tarjeta *
                    <span class="label-helper">Como aparece en la tarjeta</span>
                  </label>
                  <div class="input-container">
                    <i class="bi bi-person-vcard input-icon"></i>
                    <input
                      v-model="cardName"
                      type="text"
                      class="form-input"
                      :class="{ 'input-error': !cardName && formSubmitted }"
                      placeholder="Ej: JUAN PEREZ"
                      maxlength="100"
                    />
                  </div>
                  <div v-if="!cardName && formSubmitted" class="error-message">
                    <i class="bi bi-exclamation-circle"></i> El nombre en la tarjeta es obligatorio
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    Número de Tarjeta *
                    <span class="label-helper">16 dígitos sin espacios</span>
                  </label>
                  <div class="input-container">
                    <i class="bi bi-credit-card input-icon"></i>
                    <input
                      v-model="cardNumber"
                      type="text"
                      class="form-input"
                      :class="{ 'input-error': (!cardNumber || !isValidCardNumber) && formSubmitted }"
                      placeholder="1234567812345678"
                      maxlength="16"
                    />
                  </div>
                  <div v-if="(!cardNumber || !isValidCardNumber) && formSubmitted" class="error-message">
                    <i class="bi bi-exclamation-circle"></i> 
                    {{ !cardNumber ? 'El número de tarjeta es obligatorio' : 'Número de tarjeta inválido' }}
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    Fecha de Expiración *
                    <span class="label-helper">MM/AA</span>
                  </label>
                  <div class="input-container">
                    <i class="bi bi-calendar input-icon"></i>
                    <input
                      v-model="expiration"
                      type="text"
                      class="form-input"
                      :class="{ 'input-error': (!expiration || !isValidExpiration) && formSubmitted }"
                      placeholder="MM/AA"
                      maxlength="5"
                    />
                  </div>
                  <div v-if="(!expiration || !isValidExpiration) && formSubmitted" class="error-message">
                    <i class="bi bi-exclamation-circle"></i> 
                    {{ !expiration ? 'La fecha es obligatoria' : 'Formato inválido (MM/AA)' }}
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    CVV *
                    <span class="label-helper">3 o 4 dígitos</span>
                  </label>
                  <div class="input-container">
                    <i class="bi bi-shield-lock input-icon"></i>
                    <input
                      v-model="cvv"
                      type="text"
                      class="form-input"
                      :class="{ 'input-error': (!cvv || !isValidCVV) && formSubmitted }"
                      placeholder="123"
                      maxlength="4"
                    />
                  </div>
                  <div v-if="(!cvv || !isValidCVV) && formSubmitted" class="error-message">
                    <i class="bi bi-exclamation-circle"></i> 
                    {{ !cvv ? 'El CVV es obligatorio' : 'CVV inválido' }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Botón de Envío -->
          <div class="form-actions">
            <button 
              class="btn btn-primary btn-submit" 
              @click="submitOrder"
              :disabled="loading"
              :class="{ 'btn-loading': loading }"
            >
              <i class="bi bi-check-lg" v-if="!loading"></i>
              <i class="bi bi-arrow-repeat spin" v-else></i>
              {{ loading ? 'Creando Orden...' : 'Crear Orden' }}
            </button>
          </div>

          <!-- Mensajes de Estado -->
          <div v-if="errorMessage" class="alert alert-error">
            <i class="bi bi-x-circle"></i>
            <div class="alert-content">
              <strong>Error</strong>
              <p>{{ errorMessage }}</p>
            </div>
          </div>

          <div v-if="successMessage" class="alert alert-success">
            <i class="bi bi-check-circle"></i>
            <div class="alert-content">
              <strong>Éxito</strong>
              <p>{{ successMessage }}</p>
            </div>
            <button class="btn btn-outline btn-sm" @click="resetForm">
              Crear Otra Orden
            </button>
          </div>
        </div>
      </div>

      <!-- Panel Lateral de Resumen -->
      <div class="summary-panel">
        <div class="summary-card">
          <h3 class="summary-title">
            <i class="bi bi-receipt"></i>
            Resumen de la Orden
          </h3>
          
          <div class="summary-section">
            <h4>Información del Cliente</h4>
            <div class="summary-item">
              <span>Nombre:</span>
              <strong>{{ firstName || 'No especificado' }} {{ lastName || '' }}</strong>
            </div>
            <div class="summary-item">
              <span>Email:</span>
              <span :class="{ 'text-muted': !emailAddress }">
                {{ emailAddress || 'No especificado' }}
              </span>
            </div>
            <div class="summary-item">
              <span>Usuario:</span>
              <span :class="{ 'text-muted': !userName }">
                {{ userName || 'No especificado' }}
              </span>
            </div>
          </div>

          <div class="summary-section">
            <h4>Dirección de Envío</h4>
            <div class="summary-item">
              <span>Dirección:</span>
              <span :class="{ 'text-muted': !addressLine }">
                {{ addressLine || 'No especificada' }}
              </span>
            </div>
            <div class="summary-item">
              <span>Ubicación:</span>
              <span :class="{ 'text-muted': !state && !country }">
                {{ [state, country].filter(Boolean).join(', ') || 'No especificada' }}
              </span>
            </div>
            <div class="summary-item">
              <span>Código Postal:</span>
              <span :class="{ 'text-muted': !zipCode }">
                {{ zipCode || 'No especificado' }}
              </span>
            </div>
          </div>

          <div class="summary-section">
            <h4>Información de Pago</h4>
            <div class="summary-item">
              <span>Método:</span>
              <span :class="{ 'text-muted': !paymentMethod }">
                {{ getPaymentMethodText(paymentMethod) || 'No especificado' }}
              </span>
            </div>
            <div class="summary-item total-item">
              <span>Total:</span>
              <strong class="total-amount">
                ${{ totalPrice ? totalPrice.toLocaleString() : '0.00' }}
              </strong>
            </div>
          </div>

          <div class="summary-help">
            <i class="bi bi-info-circle"></i>
            <p>Completa todos los campos obligatorios (*) para crear la orden</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Reactive data
const userName = ref('');
const totalPrice = ref('');
const firstName = ref('');
const lastName = ref('');
const emailAddress = ref('');
const addressLine = ref('');
const country = ref('');
const state = ref('');
const zipCode = ref('');
const cardName = ref('');
const cardNumber = ref('');
const expiration = ref('');
const cvv = ref('');
const paymentMethod = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const formSubmitted = ref(false);

// Computed properties for validation
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailAddress.value);
});

const isValidCardNumber = computed(() => {
  return cardNumber.value && /^\d{16}$/.test(cardNumber.value.replace(/\s/g, ''));
});

const isValidExpiration = computed(() => {
  return expiration.value && /^\d{2}\/\d{2}$/.test(expiration.value);
});

const isValidCVV = computed(() => {
  return cvv.value && /^\d{3,4}$/.test(cvv.value);
});

const getPaymentMethodText = (method) => {
  const methods = {
    1: 'Tarjeta de Crédito',
    2: 'Tarjeta de Débito',
    3: 'PayPal',
    4: 'Transferencia Bancaria',
    5: 'Efectivo'
  };
  return methods[method] || 'No especificado';
};

// Methods
const resetForm = () => {
  userName.value = '';
  totalPrice.value = '';
  firstName.value = '';
  lastName.value = '';
  emailAddress.value = '';
  addressLine.value = '';
  country.value = '';
  state.value = '';
  zipCode.value = '';
  cardName.value = '';
  cardNumber.value = '';
  expiration.value = '';
  cvv.value = '';
  paymentMethod.value = '';
  errorMessage.value = '';
  successMessage.value = '';
  formSubmitted.value = false;
};

const validateForm = () => {
  formSubmitted.value = true;
  
  const requiredFields = [
    { value: firstName.value, field: 'firstName' },
    { value: lastName.value, field: 'lastName' },
    { value: emailAddress.value, field: 'emailAddress' },
    { value: addressLine.value, field: 'addressLine' },
    { value: country.value, field: 'country' },
    { value: state.value, field: 'state' },
    { value: zipCode.value, field: 'zipCode' },
    { value: totalPrice.value, field: 'totalPrice' },
    { value: paymentMethod.value, field: 'paymentMethod' }
  ];

  // Validar campos requeridos
  for (const field of requiredFields) {
    if (!field.value) {
      return false;
    }
  }

  // Validar email
  if (!isValidEmail.value) {
    return false;
  }

  // Validar total
  if (totalPrice.value <= 0) {
    return false;
  }

  // Validar detalles de tarjeta si aplica
  if ([1, 2].includes(paymentMethod.value)) {
    const cardFields = [
      { value: cardName.value, field: 'cardName' },
      { value: cardNumber.value, field: 'cardNumber' },
      { value: expiration.value, field: 'expiration' },
      { value: cvv.value, field: 'cvv' }
    ];

    for (const field of cardFields) {
      if (!field.value) {
        return false;
      }
    }

    if (!isValidCardNumber.value || !isValidExpiration.value || !isValidCVV.value) {
      return false;
    }
  }

  return true;
};

const submitOrder = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!validateForm()) {
    errorMessage.value = 'Por favor completa todos los campos obligatorios correctamente';
    return;
  }

  loading.value = true;

  const payload = {
    userName: userName.value || `${firstName.value.toLowerCase()}.${lastName.value.toLowerCase()}`,
    totalPrice: parseFloat(totalPrice.value),
    firstName: firstName.value,
    lastName: lastName.value,
    emailAddress: emailAddress.value,
    addressLine: addressLine.value,
    country: country.value,
    state: state.value,
    zipCode: zipCode.value,
    cardName: cardName.value,
    cardNumber: cardNumber.value,
    expiration: expiration.value,
    cvv: cvv.value,
    paymentMethod: parseInt(paymentMethod.value),
    estatus: 1,
    fechaRegistro: new Date().toISOString()
  };

  try {
    const res = await fetch('https://localhost:7135/api/v1/Order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      successMessage.value = '¡Orden creada exitosamente!';
      // No limpiar el formulario inmediatamente para que el usuario vea el éxito
    } else {
      errorMessage.value = data.message || 'Error al crear la orden. Por favor intenta nuevamente.';
    }
  } catch (err) {
    console.error('Error creating order:', err);
    errorMessage.value = 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.new-order-container {
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
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
}

/* Layout */
.order-creation-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1.5rem;
  align-items: start;
}

/* Form Container */
.form-container {
  min-height: 600px;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Form Sections */
.form-section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.section-icon {
  font-size: 1.25rem;
  color: #3b82f6;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.subsection-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 1.5rem 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Form Grid */
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

/* Form Labels */
.form-label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.label-helper {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  margin-top: 0.25rem;
}

/* Input Containers */
.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #6b7280;
  font-size: 1rem;
  z-index: 1;
}

.currency-symbol {
  position: absolute;
  left: 12px;
  color: #6b7280;
  font-weight: 500;
  z-index: 1;
}

/* Form Inputs */
.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
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

.form-input.input-error {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

/* Error Messages */
.error-message {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.5rem;
  gap: 0.25rem;
}

/* Card Details Section */
.card-details-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
}

/* Form Actions */
.form-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-submit {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
}

/* Alerts */
.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-content {
  flex: 1;
}

.alert-content strong {
  display: block;
  margin-bottom: 0.25rem;
}

.alert-content p {
  margin: 0;
  font-size: 0.9rem;
}

/* Summary Panel */
.summary-panel {
  position: sticky;
  top: 2rem;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.summary-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.summary-section {
  margin-bottom: 1.5rem;
}

.summary-section h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.85rem;
}

.summary-item:not(:last-child) {
  border-bottom: 1px solid #f1f5f9;
}

.total-item {
  border-top: 2px solid #e2e8f0;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  font-weight: 600;
}

.total-amount {
  color: #059669;
  font-size: 1.1rem;
}

.text-muted {
  color: #9ca3af;
  font-style: italic;
}

.summary-help {
  background: #dbeafe;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #1e40af;
}

/* Buttons */
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

.btn-outline {
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #9ca3af;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
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

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

.btn-loading {
  position: relative;
  color: transparent;
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
  .order-creation-layout {
    grid-template-columns: 1fr;
  }
  
  .summary-panel {
    position: static;
  }
}

@media (max-width: 768px) {
  .new-order-container {
    padding: 1rem;
  }
  
  .page-header {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .header-actions .btn {
    flex: 1;
    justify-content: center;
  }
  
  .form-card {
    padding: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .form-card {
    padding: 1rem;
  }
  
  .form-section {
    margin-bottom: 2rem;
  }
  
  .alert-success {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}
</style>