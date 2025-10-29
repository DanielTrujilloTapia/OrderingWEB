<template>
  <div class="login-page d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow-sm p-4" style="max-width: 400px; width: 100%;">
      <div class="text-center mb-4">
        <h3 class="fw-bold">Iniciar Sesión</h3>
        <p class="text-muted">Ingresa tu usuario o correo electrónico</p>
      </div>

      <form @submit.prevent="handleLogin">
        <!-- Identificador -->
        <div class="mb-3">
          <label for="identificador" class="form-label">Usuario o Correo</label>
          <input
            type="text"
            id="identificador"
            class="form-control"
            v-model="identificador"
            :class="{'is-invalid': identificadorError}"
            placeholder="Ej. DanielCT o correo@ejemplo.com"
          />
          <div class="invalid-feedback">{{ identificadorError }}</div>
        </div>

        <!-- Contraseña -->
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              class="form-control"
              v-model="contrasenaUsuario"
              :class="{'is-invalid': passwordError}"
              placeholder="Ingresa tu contraseña"
            />
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
            <div class="invalid-feedback">{{ passwordError }}</div>
          </div>
        </div>

        <!-- Error general -->
        <div v-if="generalError" class="alert alert-danger py-2">{{ generalError }}</div>

        <!-- Botón de login -->
        <div class="d-grid mt-4">
          <button class="btn btn-primary" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
          </button>
        </div>

        <!-- Botones adicionales -->
        <div class="d-flex justify-content-between mt-3">
          <button type="button" class="btn btn-link p-0" @click="$router.push('/register')">
            Registrarse
          </button>
          <button type="button" class="btn btn-link p-0" @click="$router.push('/recover-password')">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>

      <div class="text-center mt-3">
        <small class="text-muted">© 2025 Tu Empresa</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      identificador: "",
      contrasenaUsuario: "",
      showPassword: false,
      loading: false,
      identificadorError: "",
      passwordError: "",
      generalError: "",
    };
  },
  methods: {
    async handleLogin() {
      this.identificadorError = "";
      this.passwordError = "";
      this.generalError = "";

      if (!this.identificador) {
        this.identificadorError = "Por favor ingresa tu usuario o correo.";
        return;
      }
      if (!this.contrasenaUsuario) {
        this.passwordError = "Por favor ingresa tu contraseña.";
        return;
      }

      this.loading = true;

      try {
        const response = await fetch("http://localhost:8081/api/v1/Auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({  
            identificador: this.identificador,
            contrasenaUsuario: this.contrasenaUsuario,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.generalError = data.message || "Credenciales inválidas.";
        } else {
            console.log(data.token);
            console.log(data.username);
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          this.$router.push("/app/order");
        }
      } catch (error) {
        this.generalError = "Error al conectar con el servidor.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #1f3c88 0%, #0d1a44 100%);
}

.card {
  border-radius: 12px;
}

.btn-primary {
  background-color: #1f3c88;
  border-color: #1f3c88;
}

.btn-primary:hover {
  background-color: #16306d;
  border-color: #16306d;
}

.input-group .form-control.is-invalid {
  border-color: #dc3545;
}

.btn-link {
  font-size: 0.9rem;
}
</style>
