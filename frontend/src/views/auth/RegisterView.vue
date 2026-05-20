<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-700 to-primary-900 p-4">
    <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-2 mb-6">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">II</span>
          </div>
        </router-link>
        <h1 class="text-2xl font-bold text-gray-900">Crear cuenta</h1>
        <p class="text-gray-500 text-sm mt-1">Regístrate en el aula virtual</p>
      </div>
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{{ error }}</div>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input v-model="name" type="text" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="Tu nombre" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="tu@email.com" />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input v-model="password" type="password" required minlength="6" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="Mínimo 6 caracteres" />
        </div>
        <button type="submit" :disabled="loading" class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
          {{ loading ? 'Registrando...' : 'Crear cuenta' }}
        </button>
      </form>
      <p class="text-center text-sm text-gray-500 mt-6">
        ¿Ya tienes cuenta?
        <router-link to="/auth/login" class="text-primary-600 font-medium hover:underline">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function handleRegister() {
  loading.value = true; error.value = "";
  try {
    await authStore.register(name.value, email.value, password.value);
    router.push("/mis-cursos");
  } catch (e: any) {
    error.value = e.response?.data?.error || "Error al registrarse";
  } finally { loading.value = false; }
}
</script>
