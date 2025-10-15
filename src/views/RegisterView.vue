<template>
  <div class="register-page d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow-sm p-4" style="max-width: 500px; width: 100%;">
      <div class="text-center mb-4">
        <h3 class="fw-bold">Crear Cuenta</h3>
        <p class="text-muted">Completa los campos para registrarte</p>
      </div>

      <form @submit.prevent="handleRegister">
        <!-- Nombre de Usuario -->
        <div class="mb-3">
          <label class="form-label">Nombre de Usuario</label>
          <input
            type="text"
            class="form-control"
            v-model="nombreUsuario"
            :class="{'is-invalid': nombreUsuarioError}"
            placeholder="Ingresa tu nombre de usuario"
          />
          <div class="invalid-feedback">{{ nombreUsuarioError }}</div>
        </div>

        <!-- Nombre -->
        <div class="mb-3">
          <label class="form-label">Nombre</label>
          <input
            type="text"
            class="form-control"
            v-model="nombre"
            :class="{'is-invalid': nombreError}"
            placeholder="Ingresa tu nombre"
          />
          <div class="invalid-feedback">{{ nombreError }}</div>
        </div>

        <!-- Apellido Paterno -->
        <div class="mb-3">
          <label class="form-label">Apellido Paterno</label>
          <input
            type="text"
            class="form-control"
            v-model="apellidoP"
            :class="{'is-invalid': apellidoPError}"
            placeholder="Ingresa tu apellido paterno"
          />
          <div class="invalid-feedback">{{ apellidoPError }}</div>
        </div>

        <!-- Apellido Materno -->
        <div class="mb-3">
          <label class="form-label">Apellido Materno</label>
          <input
            type="text"
            class="form-control"
            v-model="apellidoM"
            :class="{'is-invalid': apellidoMError}"
            placeholder="Ingresa tu apellido materno"
          />
          <div class="invalid-feedback">{{ apellidoMError }}</div>
        </div>

        <!-- Correo -->
        <div class="mb-3">
          <label class="form-label">Correo Electrónico</label>
          <input
            type="email"
            class="form-control"
            v-model="correoUsuario"
            :class="{'is-invalid': correoUsuarioError}"
            placeholder="Ingresa tu correo"
          />
          <div class="invalid-feedback">{{ correoUsuarioError }}</div>
        </div>

        <!-- Teléfono -->
        <div class="mb-3">
          <label class="form-label">Teléfono</label>
          <input
            type="tel"
            class="form-control"
            v-model="telefonoUsuario"
            :class="{'is-invalid': telefonoUsuarioError}"
            placeholder="Ingresa tu teléfono"
          />
          <div class="invalid-feedback">{{ telefonoUsuarioError }}</div>
        </div>

        <!-- Contraseña -->
        <div class="mb-3">
          <label class="form-label">Contraseña</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              v-model="contrasenaUsuario"
              :class="{'is-invalid': contrasenaUsuarioError}"
              placeholder="Ingresa tu contraseña"
            />
            <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
            <div class="invalid-feedback">{{ contrasenaUsuarioError }}</div>
          </div>
        </div>

        <!-- Error general -->
        <div v-if="generalError" class="alert alert-danger py-2">{{ generalError }}</div>

        <!-- Botón de registrar -->
        <div class="d-grid mt-4">
          <button class="btn btn-primary" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
          </button>
        </div>

        <!-- Volver al login -->
        <div class="text-center mt-3">
          <button type="button" class="btn btn-link p-0" @click="$router.push('/login')">
            ¿Ya tienes cuenta? Inicia Sesión
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterView",
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
  methods: {
    async handleRegister() {
      // Limpiar errores
      this.generalError = "";
      this.nombreUsuarioError = "";
      this.nombreError = "";
      this.apellidoPError = "";
      this.apellidoMError = "";
      this.correoUsuarioError = "";
      this.contrasenaUsuarioError = "";
      this.telefonoUsuarioError = "";

      // Validaciones básicas
      if (!this.nombreUsuario) this.nombreUsuarioError = "Ingresa un nombre de usuario";
      if (!this.nombre) this.nombreError = "Ingresa tu nombre";
      if (!this.apellidoP) this.apellidoPError = "Ingresa tu apellido paterno";
      if (!this.apellidoM) this.apellidoMError = "Ingresa tu apellido materno";
      if (!this.correoUsuario) this.correoUsuarioError = "Ingresa tu correo";
      if (!this.contrasenaUsuario) this.contrasenaUsuarioError = "Ingresa tu contraseña";
      if (!this.telefonoUsuario) this.telefonoUsuarioError = "Ingresa tu teléfono";

      if (
        this.nombreUsuarioError || this.nombreError || this.apellidoPError ||
        this.apellidoMError || this.correoUsuarioError || this.contrasenaUsuarioError ||
        this.telefonoUsuarioError
      ) return;

      this.loading = true;

      try {
        const response = await fetch("http://localhost:8081/api/v1/Auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        } else {
          alert("Registro exitoso, ahora inicia sesión");
          this.$router.push("/login");
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
.register-page {
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
