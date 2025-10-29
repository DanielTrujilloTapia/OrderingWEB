<template>
  <div class="register-container">
    <div class="register-background">
      <div class="background-pattern"></div>
    </div>
    
    <div class="register-layout">
      <!-- Tarjeta con imagen (mismo diseño que login) -->
      <div class="image-card">
        <div class="image-content">
          <div class="image-overlay">
            <h2 class="image-title">Únete a Nosotros</h2>
            <p class="image-subtitle">Crea tu cuenta y comienza a gestionar</p>
            <div class="feature-list">
              <div class="feature-item">
                <i class="bi bi-person-plus"></i>
                <span>Registro rápido y seguro</span>
              </div>
              <div class="feature-item">
                <i class="bi bi-shield-check"></i>
                <span>Protección de datos</span>
              </div>
              <div class="feature-item">
                <i class="bi bi-rocket"></i>
                <span>Comienza inmediatamente</span>
              </div>
            </div>
          </div>
          <div class="image-placeholder">
            <i class="bi bi-building" style="font-size: 4rem; color: rgba(255,255,255,0.8);"></i>
            <p style="margin-top: 1rem; color: rgba(255,255,255,0.8);">Imagen corporativa</p>
          </div>
        </div>
      </div>

      <!-- Tarjeta de registro -->
      <div class="register-card">
        <div class="card-header">
          <!--<div class="company-logo">
            <i class="bi bi-building"></i>
            <span class="company-name">Tu Empresa</span>
          </div> -->
          <h1 class="register-title">Crear Cuenta</h1>
          <p class="register-subtitle">Completa tus datos para registrarte</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <!-- Fila de dos campos: Usuario y Nombre -->
          <div class="form-row">
            <div class="form-group">
              <label for="nombreUsuario" class="form-label">Nombre de Usuario *</label>
              <div class="input-container">
                <i class="bi bi-person-circle input-icon"></i>
                <input
                  type="text"
                  id="nombreUsuario"
                  class="form-input"
                  :class="{'input-error': nombreUsuarioError, 'input-valid': nombreUsuario && !nombreUsuarioError}"
                  v-model.trim="nombreUsuario"
                  @blur="validateNombreUsuario"
                  @input="clearNombreUsuarioError"
                  placeholder="usuario123"
                  autocomplete="username"
                  aria-describedby="nombreUsuario-error"
                />
              </div>
              <div v-if="nombreUsuarioError" id="nombreUsuario-error" class="error-message">
                <i class="bi bi-exclamation-circle"></i> {{ nombreUsuarioError }}
              </div>
            </div>

            <div class="form-group">
              <label for="nombre" class="form-label">Nombre *</label>
              <div class="input-container">
                <i class="bi bi-person input-icon"></i>
                <input
                  type="text"
                  id="nombre"
                  class="form-input"
                  :class="{'input-error': nombreError, 'input-valid': nombre && !nombreError}"
                  v-model.trim="nombre"
                  @blur="validateNombre"
                  @input="clearNombreError"
                  placeholder="Juan"
                  autocomplete="given-name"
                  aria-describedby="nombre-error"
                />
              </div>
              <div v-if="nombreError" id="nombre-error" class="error-message">
                <i class="bi bi-exclamation-circle"></i> {{ nombreError }}
              </div>
            </div>
          </div>

          <!-- Fila de dos campos: Apellido Paterno y Materno -->
          <div class="form-row">
            <div class="form-group">
              <label for="apellidoP" class="form-label">Apellido Paterno *</label>
              <div class="input-container">
                <i class="bi bi-person input-icon"></i>
                <input
                  type="text"
                  id="apellidoP"
                  class="form-input"
                  :class="{'input-error': apellidoPError, 'input-valid': apellidoP && !apellidoPError}"
                  v-model.trim="apellidoP"
                  @blur="validateApellidoP"
                  @input="clearApellidoPError"
                  placeholder="Pérez"
                  autocomplete="family-name"
                  aria-describedby="apellidoP-error"
                />
              </div>
              <div v-if="apellidoPError" id="apellidoP-error" class="error-message">
                <i class="bi bi-exclamation-circle"></i> {{ apellidoPError }}
              </div>
            </div>

            <div class="form-group">
              <label for="apellidoM" class="form-label">Apellido Materno *</label>
              <div class="input-container">
                <i class="bi bi-person input-icon"></i>
                <input
                  type="text"
                  id="apellidoM"
                  class="form-input"
                  :class="{'input-error': apellidoMError, 'input-valid': apellidoM && !apellidoMError}"
                  v-model.trim="apellidoM"
                  @blur="validateApellidoM"
                  @input="clearApellidoMError"
                  placeholder="Gómez"
                  autocomplete="family-name"
                  aria-describedby="apellidoM-error"
                />
              </div>
              <div v-if="apellidoMError" id="apellidoM-error" class="error-message">
                <i class="bi bi-exclamation-circle"></i> {{ apellidoMError }}
              </div>
            </div>
          </div>

          <!-- Campo de correo -->
          <div class="form-group">
            <label for="correoUsuario" class="form-label">Correo Electrónico *</label>
            <div class="input-container">
              <i class="bi bi-envelope input-icon"></i>
              <input
                type="email"
                id="correoUsuario"
                class="form-input"
                :class="{'input-error': correoUsuarioError, 'input-valid': correoUsuario && !correoUsuarioError}"
                v-model.trim="correoUsuario"
                @blur="validateCorreo"
                @input="clearCorreoError"
                placeholder="usuario@empresa.com"
                autocomplete="email"
                aria-describedby="correoUsuario-error"
              />
            </div>
            <div v-if="correoUsuarioError" id="correoUsuario-error" class="error-message">
              <i class="bi bi-exclamation-circle"></i> {{ correoUsuarioError }}
            </div>
          </div>

          <!-- Fila de dos campos: Teléfono y Contraseña -->
          <div class="form-row">
            <div class="form-group">
              <label for="telefonoUsuario" class="form-label">Teléfono *</label>
              <div class="input-container">
                <i class="bi bi-telephone input-icon"></i>
                <input
                  type="tel"
                  id="telefonoUsuario"
                  class="form-input"
                  :class="{'input-error': telefonoUsuarioError, 'input-valid': telefonoUsuario && !telefonoUsuarioError}"
                  v-model.trim="telefonoUsuario"
                  @blur="validateTelefono"
                  @input="clearTelefonoError"
                  placeholder="+52 123 456 7890"
                  autocomplete="tel"
                  aria-describedby="telefonoUsuario-error"
                />
              </div>
              <div v-if="telefonoUsuarioError" id="telefonoUsuario-error" class="error-message">
                <i class="bi bi-exclamation-circle"></i> {{ telefonoUsuarioError }}
              </div>
            </div>

            <div class="form-group">
              <div class="label-container">
                <label for="contrasenaUsuario" class="form-label">Contraseña *</label>
              </div>
              <div class="input-container">
                <i class="bi bi-lock input-icon"></i>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="contrasenaUsuario"
                  class="form-input"
                  :class="{'input-error': contrasenaUsuarioError, 'input-valid': contrasenaUsuario && !contrasenaUsuarioError}"
                  v-model="contrasenaUsuario"
                  @blur="validateContrasena"
                  @input="clearContrasenaError"
                  placeholder="Mínimo 6 caracteres"
                  autocomplete="new-password"
                  aria-describedby="contrasenaUsuario-error"
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  :class="{'password-visible': showPassword}"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="contrasenaUsuarioError" id="contrasenaUsuario-error" class="error-message">
                <i class="bi bi-exclamation-circle"></i> {{ contrasenaUsuarioError }}
              </div>
            </div>
          </div>

          <!-- Términos y condiciones -->
          <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" v-model="acceptTerms" />
              <span class="checkmark"></span>
              Acepto los <a href="#" class="terms-link">términos y condiciones</a> y la <a href="#" class="terms-link">política de privacidad</a>
            </label>
          </div>

          <!-- Mensaje de error general -->
          <div v-if="generalError" class="alert-error" role="alert">
            <i class="bi bi-x-circle"></i>
            <span>{{ generalError }}</span>
          </div>

          <!-- Botón de registro -->
          <button 
            class="register-button" 
            type="submit" 
            :disabled="loading || !isFormValid || !acceptTerms"
            :class="{'button-loading': loading, 'button-disabled': !isFormValid || !acceptTerms}"
          >
            <span v-if="loading" class="button-spinner"></span>
            {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>
        </form>

        <div class="card-footer">
          <div class="login-section">
            <span>¿Ya tienes una cuenta?</span>
            <a href="#" class="login-link" @click.prevent="$router.push('/login')">Inicia Sesión</a>
          </div>
          
          <div class="footer-links">
            <a href="#" class="footer-link">Términos de uso</a>
            <a href="#" class="footer-link">Privacidad y cookies</a>
          </div>
          
          <div class="copyright">
            <span>© 2025 Tu Empresa. Todos los derechos reservados.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfessionalRegisterView",
  data() {
    return {
      nombreUsuario: "",
      nombre: "",
      apellidoP: "",
      apellidoM: "",
      correoUsuario: "",
      contrasenaUsuario: "",
      telefonoUsuario: "",
      showPassword: false,
      loading: false,
      acceptTerms: false,
      generalError: "",
      nombreUsuarioError: "",
      nombreError: "",
      apellidoPError: "",
      apellidoMError: "",
      correoUsuarioError: "",
      contrasenaUsuarioError: "",
      telefonoUsuarioError: "",
    };
  },
  computed: {
    isFormValid() {
      return this.nombreUsuario && this.nombre && this.apellidoP && 
             this.apellidoM && this.correoUsuario && this.contrasenaUsuario && 
             this.telefonoUsuario && !this.nombreUsuarioError && !this.nombreError && 
             !this.apellidoPError && !this.apellidoMError && !this.correoUsuarioError && 
             !this.contrasenaUsuarioError && !this.telefonoUsuarioError;
    }
  },
  methods: {
    validateNombreUsuario() {
      if (!this.nombreUsuario) {
        this.nombreUsuarioError = "El nombre de usuario es obligatorio";
        return false;
      }
      
      if (this.nombreUsuario.length < 3) {
        this.nombreUsuarioError = "El nombre de usuario debe tener al menos 3 caracteres";
        return false;
      }
      
      this.nombreUsuarioError = "";
      return true;
    },
    
    validateNombre() {
      if (!this.nombre) {
        this.nombreError = "El nombre es obligatorio";
        return false;
      }
      
      this.nombreError = "";
      return true;
    },
    
    validateApellidoP() {
      if (!this.apellidoP) {
        this.apellidoPError = "El apellido paterno es obligatorio";
        return false;
      }
      
      this.apellidoPError = "";
      return true;
    },
    
    validateApellidoM() {
      if (!this.apellidoM) {
        this.apellidoMError = "El apellido materno es obligatorio";
        return false;
      }
      
      this.apellidoMError = "";
      return true;
    },
    
    validateCorreo() {
      if (!this.correoUsuario) {
        this.correoUsuarioError = "El correo electrónico es obligatorio";
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.correoUsuario)) {
        this.correoUsuarioError = "Introduce un correo electrónico válido";
        return false;
      }
      
      this.correoUsuarioError = "";
      return true;
    },
    
    validateContrasena() {
      if (!this.contrasenaUsuario) {
        this.contrasenaUsuarioError = "La contraseña es obligatoria";
        return false;
      }
      
      if (this.contrasenaUsuario.length < 6) {
        this.contrasenaUsuarioError = "La contraseña debe tener al menos 6 caracteres";
        return false;
      }
      
      this.contrasenaUsuarioError = "";
      return true;
    },
    
    validateTelefono() {
      if (!this.telefonoUsuario) {
        this.telefonoUsuarioError = "El teléfono es obligatorio";
        return false;
      }
      
      // Validación básica de teléfono
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(this.telefonoUsuario.replace(/\s/g, ''))) {
        this.telefonoUsuarioError = "Introduce un número de teléfono válido";
        return false;
      }
      
      this.telefonoUsuarioError = "";
      return true;
    },
    
    clearNombreUsuarioError() {
      if (this.nombreUsuarioError) this.nombreUsuarioError = "";
      this.generalError = "";
    },
    
    clearNombreError() {
      if (this.nombreError) this.nombreError = "";
      this.generalError = "";
    },
    
    clearApellidoPError() {
      if (this.apellidoPError) this.apellidoPError = "";
      this.generalError = "";
    },
    
    clearApellidoMError() {
      if (this.apellidoMError) this.apellidoMError = "";
      this.generalError = "";
    },
    
    clearCorreoError() {
      if (this.correoUsuarioError) this.correoUsuarioError = "";
      this.generalError = "";
    },
    
    clearContrasenaError() {
      if (this.contrasenaUsuarioError) this.contrasenaUsuarioError = "";
      this.generalError = "";
    },
    
    clearTelefonoError() {
      if (this.telefonoUsuarioError) this.telefonoUsuarioError = "";
      this.generalError = "";
    },
    
    async handleRegister() {
      // Validación final antes de enviar
      const validations = [
        this.validateNombreUsuario(),
        this.validateNombre(),
        this.validateApellidoP(),
        this.validateApellidoM(),
        this.validateCorreo(),
        this.validateContrasena(),
        this.validateTelefono()
      ];
      
      if (validations.includes(false)) {
        return;
      }
      
      if (!this.acceptTerms) {
        this.generalError = "Debes aceptar los términos y condiciones";
        return;
      }
      
      this.loading = true;
      this.generalError = "";

      try {
        const response = await fetch("http://localhost:8081/api/v1/Auth/register", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            nombreUsuario: this.nombreUsuario,
            nombre: this.nombre,
            apellidoP: this.apellidoP,
            apellidoM: this.apellidoM,
            correoUsuario: this.correoUsuario,
            contrasenaUsuario: this.contrasenaUsuario,
            telefonoUsuario: this.telefonoUsuario,
            rol: 1,
            estatus: 1,
            fechaRegistro: new Date().toISOString()
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.generalError = data.message || "Error al registrar usuario.";
          // Efecto visual de error
          this.$el.classList.add('shake-animation');
          setTimeout(() => {
            this.$el.classList.remove('shake-animation');
          }, 500);
        } else {
          // Registro exitoso
          this.$router.push("/login?registered=true");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        this.generalError = "Error de conexión. Verifica tu conexión a internet.";
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    // Enfocar el primer campo al cargar
    this.$nextTick(() => {
      const firstInput = this.$el.querySelector('#nombreUsuario');
      if (firstInput) {
        firstInput.focus();
      }
    });
  }
};
</script>

<style scoped>
/* Estilos base y contenedor principal */
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  padding: 20px;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.register-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.background-pattern {
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 25%),
    radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 25%);
}

/* Layout principal con dos tarjetas */
.register-layout {
  display: flex;
  width: 100%;
  max-width: 1000px;
  height: 700px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: card-appear 0.6s ease-out;
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tarjeta con imagen */
.image-card {
  flex: 1;
  background: linear-gradient(
      rgba(3, 59, 86, 0.85), 
      rgba(3, 59, 86, 0.75)
    ),
    url('/src/assets/loginfondo.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}

.image-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  z-index: 2;
}

.image-overlay {
  color: white;
}

.image-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.image-subtitle {
  font-size: 16px;
  opacity: 0.95;
  margin-bottom: 40px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  font-size: 15px;
  opacity: 0.95;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.feature-item i {
  font-size: 18px;
  margin-right: 12px;
  opacity: 0.95;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Tarjeta de registro */
.register-card {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  background: white;
  min-width: 0;
  overflow-y: auto;
}

.card-header {
  padding: 40px 40px 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.company-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: #0078d4;
  font-weight: 600;
  font-size: 18px;
}

.company-logo i {
  font-size: 24px;
  margin-right: 8px;
}

.register-title {
  font-size: 24px;
  font-weight: 600;
  color: #323130;
  margin: 0 0 8px;
}

.register-subtitle {
  font-size: 14px;
  color: #605e5c;
  margin: 0;
}

/* Formulario */
.register-form {
  padding: 32px 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #323130;
  margin-bottom: 6px;
}

.label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #605e5c;
  font-size: 16px;
  z-index: 1;
}

.form-input {
  width: 100%;
  height: 40px;
  padding: 0 12px 0 36px;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  font-size: 15px;
  transition: all 0.2s ease;
  background-color: white;
}

.form-input:focus {
  outline: none;
  border-color: #0078d4;
  box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.2);
}

.form-input.input-error {
  border-color: #d13438;
}

.form-input.input-valid {
  border-color: #107c10;
}

.password-toggle {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #605e5c;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.password-toggle:hover {
  background-color: #f3f2f1;
}

.password-toggle.password-visible {
  color: #0078d4;
}

/* Mensajes de error */
.error-message {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #d13438;
  margin-top: 6px;
}

.error-message i {
  margin-right: 4px;
  font-size: 14px;
}

.alert-error {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #fef7f7;
  border: 1px solid #f4d5d5;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #d13438;
}

.alert-error i {
  margin-right: 8px;
  font-size: 16px;
}

/* Opciones del formulario */
.form-options {
  margin: 24px 0;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 14px;
  color: #323130;
  line-height: 1.4;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  height: 16px;
  width: 16px;
  background-color: white;
  border: 1px solid #d1d1d1;
  border-radius: 2px;
  margin-right: 8px;
  position: relative;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #0078d4;
  border-color: #0078d4;
}

.checkbox-container input:checked ~ .checkmark:after {
  content: "";
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.terms-link {
  color: #0078d4;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Botón de registro */
.register-button {
  width: 100%;
  height: 40px;
  background-color: #0078d4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: auto;
}

.register-button:hover:not(.button-disabled):not(.button-loading) {
  background-color: #106ebe;
}

.register-button:active:not(.button-disabled):not(.button-loading) {
  background-color: #005a9e;
}

.register-button.button-disabled {
  background-color: #f3f2f1;
  color: #a19f9d;
  cursor: not-allowed;
}

.register-button.button-loading {
  background-color: #0078d4;
  cursor: wait;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Enlaces */
.forgot-link, .login-link, .footer-link {
  color: #0078d4;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.forgot-link:hover, .login-link:hover, .footer-link:hover {
  color: #106ebe;
  text-decoration: underline;
}

/* Pie de tarjeta */
.card-footer {
  padding: 20px 40px 32px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.login-section {
  margin-bottom: 20px;
  font-size: 14px;
  color: #605e5c;
}

.login-link {
  margin-left: 4px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.copyright {
  font-size: 12px;
  color: #605e5c;
}

/* Animación de error */
.shake-animation {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* Responsive */
@media (max-width: 768px) {
  .register-layout {
    flex-direction: column;
    height: auto;
    max-width: 440px;
  }
  
  .image-card {
    display: none;
  }
  
  .register-card {
    width: 100%;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}

@media (max-width: 480px) {
  .register-layout {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
  
  .card-header, .register-form, .card-footer {
    padding-left: 24px;
    padding-right: 24px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>