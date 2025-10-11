<template>
  <q-page class="login-page">
    <div class="login-card">
      <img src="../assets/Logo-test1.png" alt="Logo" class="logo" />
      <h1 class="title">Welcome</h1>
      <p class="subtitle">Please sign in to continue</p>
      <div class="actions">
        <q-btn color="primary" label="Sign in with Google" @click="loginWithGoogle" />
      </div>
    </div>
  </q-page>
  
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    function loginWithGoogle() {
      // Begin OAuth flow on backend
      const backendBase = 'https://api.miranrijschool.nl/'
      window.location.assign(`${backendBase}/auth/google`)
    }
    return { loginWithGoogle }
  }
})
</script>

<style>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
}
.login-card {
  width: 100%;
  max-width: 420px;
  padding: 32px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 24px rgba(0,0,0,0.06);
}
.login-card .logo {
  height: 64px;
  margin-bottom: 12px;
}
.login-card .title {
  margin: 8px 0 6px;
}
.login-card .subtitle {
  margin: 0 0 16px;
  color: #64748b;
}
.login-card .actions {
  margin-top: 8px;
}
</style>



