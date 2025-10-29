<template>
  <div class="login-container">
    <div class="login-background">
      <div class="background-pattern"></div>
    </div>
    
    <div class="login-layout">
      <!-- Tarjeta con imagen -->
      <div class="image-card">
        <div class="image-content">
          <div class="image-overlay">
            <h2 class="image-title">Bienvenido a Ordering</h2>
            <p class="image-subtitle">Sistema de gestión empresarial</p>
            <div class="feature-list">
              <div class="feature-item">
                <i class="bi bi-shield-check"></i>
                <span>Acceso seguro</span>
              </div>
              <div class="feature-item">
                <i class="bi bi-graph-up"></i>
                <span>Gestión en tiempo real</span>
              </div>
              <div class="feature-item">
                <i class="bi bi-people"></i>
                <span>Colaboración eficiente</span>
              </div>
            </div>
          </div>
          <div class="image-placeholder">
            <i class="bi bi-building" style="font-size: 4rem; color: rgba(255,255,255,0.8);"></i>
            <p style="margin-top: 1rem; color: rgba(255,255,255,0.8);">Imagen corporativa</p>
          </div>
        </div>
      </div>

      <!-- Tarjeta de login -->
      <div class="login-card">
        <div class="card-header">
          <!-- <div class="company-logo">
            <i class="bi bi-building"></i>
            <span class="company-name">Ordering</span>
          </div>-->
          <h1 class="login-title">Iniciar sesión</h1>
          <p class="login-subtitle">Usa tu cuenta de organización</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Campo de usuario/email -->
          <div class="form-group">
            <label for="identificador" class="form-label">Usuario o correo electrónico</label>
            <div class="input-container">
              <i class="bi bi-person input-icon"></i>
              <input
                type="text"
                id="identificador"
                class="form-input"
                :class="{'input-error': identificadorError, 'input-valid': identificador && !identificadorError}"
                v-model.trim="identificador"
                @blur="validateIdentificador"
                @input="clearIdentificadorError"
                placeholder="usuario@empresa.com"
                autocomplete="username"
                aria-describedby="identificador-error"
              />
            </div>
            <div v-if="identificadorError" id="identificador-error" class="error-message">
              <i class="bi bi-exclamation-circle"></i> {{ identificadorError }}
            </div>
          </div>

          <!-- Campo de contraseña -->
          <div class="form-group">
            <div class="label-container">
              <label for="password" class="form-label">Contraseña</label>
              <a href="#" class="forgot-link" @click.prevent="$router.push('/recover-password')">¿Olvidaste tu contraseña?</a>
            </div>
            <div class="input-container">
              <i class="bi bi-lock input-icon"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                class="form-input"
                :class="{'input-error': passwordError, 'input-valid': contrasenaUsuario && !passwordError}"
                v-model="contrasenaUsuario"
                @blur="validatePassword"
                @input="clearPasswordError"
                placeholder="Introduce tu contraseña"
                autocomplete="current-password"
                aria-describedby="password-error"
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
            <div v-if="passwordError" id="password-error" class="error-message">
              <i class="bi bi-exclamation-circle"></i> {{ passwordError }}
            </div>
          </div>

          <!-- Recordar usuario -->
          <!-- <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" v-model="rememberMe" />
              <span class="checkmark"></span>
              Mantener la sesión iniciada
            </label>
          </div>
          -->

          <!-- Mensaje de error general -->
          <div v-if="generalError" class="alert-error" role="alert">
            <i class="bi bi-x-circle"></i>
            <span>{{ generalError }}</span>
          </div>

          <!-- Botón de inicio de sesión -->
          <button 
            class="login-button" 
            type="submit" 
            :disabled="loading || !isFormValid"
            :class="{'button-loading': loading, 'button-disabled': !isFormValid}"
          >
            <span v-if="loading" class="button-spinner"></span>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </button>
        </form>

        <div class="card-footer">
          <div class="signup-section">
            <span>¿No tienes una cuenta?</span>
            <a href="#" class="signup-link" @click.prevent="$router.push('/register')">Regístrate</a>
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
  name: "ProfessionalLoginWithImage",
  data() {
    return {
      identificador: "",
      contrasenaUsuario: "",
      showPassword: false,
      loading: false,
      rememberMe: false,
      identificadorError: "",
      passwordError: "",
      generalError: "",
    };
  },
  computed: {
    isFormValid() {
      return this.identificador && this.contrasenaUsuario && 
             !this.identificadorError && !this.passwordError;
    }
  },
  methods: {
    validateIdentificador() {
      if (!this.identificador) {
        this.identificadorError = "El usuario o correo es obligatorio";
        return false;
      }
      
      // Validación básica de email si parece ser un email
      if (this.identificador.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.identificador)) {
          this.identificadorError = "Introduce un correo electrónico válido";
          return false;
        }
      }
      
      this.identificadorError = "";
      return true;
    },
    
    validatePassword() {
      if (!this.contrasenaUsuario) {
        this.passwordError = "La contraseña es obligatoria";
        return false;
      }
      
      if (this.contrasenaUsuario.length < 6) {
        this.passwordError = "La contraseña debe tener al menos 6 caracteres";
        return false;
      }
      
      this.passwordError = "";
      return true;
    },
    
    clearIdentificadorError() {
      if (this.identificadorError) {
        this.identificadorError = "";
      }
      this.generalError = "";
    },
    
    clearPasswordError() {
      if (this.passwordError) {
        this.passwordError = "";
      }
      this.generalError = "";
    },
    
    async handleLogin() {
      // Validación final antes de enviar
      const isIdentificadorValid = this.validateIdentificador();
      const isPasswordValid = this.validatePassword();
      
      if (!isIdentificadorValid || !isPasswordValid) {
        return;
      }
      
      this.loading = true;
      this.generalError = "";

      try {
        const response = await fetch("http://localhost:8081/api/v1/Auth/login", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ 
            identificador: this.identificador, 
            contrasenaUsuario: this.contrasenaUsuario 
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.generalError = data.message || "Credenciales incorrectas. Verifica tu usuario y contraseña.";
          // Efecto visual de error
          this.$el.classList.add('shake-animation');
          setTimeout(() => {
            this.$el.classList.remove('shake-animation');
          }, 500);
        } else {
          // Guardar datos de sesión
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          
          if (this.rememberMe) {
            localStorage.setItem("rememberedUser", this.identificador);
          } else {
            localStorage.removeItem("rememberedUser");
          }
          
          // Redirección con transición suave
          this.$router.push("/app/order");
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
    // Cargar usuario recordado si existe
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      this.identificador = rememberedUser;
      this.rememberMe = true;
    }
    
    // Enfocar el primer campo al cargar
    this.$nextTick(() => {
      const firstInput = this.$el.querySelector('#identificador');
      if (firstInput) {
        firstInput.focus();
      }
    });
  }
};
</script>

<style scoped>
/* Estilos base y contenedor principal */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  padding: 20px;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.login-background {
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
.login-layout {
  display: flex;
  width: 100%;
  max-width: 900px;
  height: 600px;
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

/* Tarjeta con imagen - MODIFICADO */
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
}

.image-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 40px;
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
  opacity: 0.9;
}

.feature-item i {
  font-size: 18px;
  margin-right: 12px;
  opacity: 0.9;
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

/* Tarjeta de login */
.login-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  min-width: 0; /* Para evitar problemas de flexbox */
}

.card-header {
  padding: 40px 40px 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
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

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #323130;
  margin: 0 0 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #605e5c;
  margin: 0;
}

/* Formulario */
.login-form {
  padding: 32px 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
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
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #323130;
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

/* Botón de login */
.login-button {
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

.login-button:hover:not(.button-disabled):not(.button-loading) {
  background-color: #106ebe;
}

.login-button:active:not(.button-disabled):not(.button-loading) {
  background-color: #005a9e;
}

.login-button.button-disabled {
  background-color: #f3f2f1;
  color: #a19f9d;
  cursor: not-allowed;
}

.login-button.button-loading {
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
.forgot-link, .signup-link, .footer-link {
  color: #0078d4;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.forgot-link:hover, .signup-link:hover, .footer-link:hover {
  color: #106ebe;
  text-decoration: underline;
}

/* Pie de tarjeta */
.card-footer {
  padding: 20px 40px 32px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.signup-section {
  margin-bottom: 20px;
  font-size: 14px;
  color: #605e5c;
}

.signup-link {
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
  .login-layout {
    flex-direction: column;
    height: auto;
    max-width: 440px;
  }
  
  .image-card {
    display: none; /* Ocultar imagen en móviles para mejor UX */
  }
  
  .login-card {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .login-layout {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
  
  .card-header, .login-form, .card-footer {
    padding-left: 24px;
    padding-right: 24px;
  }
}
</style>