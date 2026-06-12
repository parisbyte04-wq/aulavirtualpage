<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-700 to-primary-900 p-4">
    <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-2 mb-6">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">II</span>
          </div>
        </router-link>
        <h1 class="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
        <p class="text-gray-500 text-sm mt-1">Accede al aula virtual</p>
      </div>
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{{ error }}</div>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="tu@email.com" />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" required class="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="••••••••" />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
        <button type="submit" :disabled="loading" class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
      <p class="text-center text-sm text-gray-500 mt-6">
        ¿No tienes cuenta?
        <router-link to="/auth/register" class="text-primary-600 font-medium hover:underline">Regístrate</router-link>
      </p>
      <p class="text-center text-xs text-gray-400 mt-4">
        Demo estudiante: estudiante@instituto.com / student123
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
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

async function handleLogin() {
  loading.value = true; error.value = "";
  try {
    await authStore.login(email.value, password.value);
    if (authStore.isAdmin) router.push("/admin/dashboard");
    else router.push("/mis-cursos");
  } catch (e: any) {
    error.value = e.response?.data?.error || "Error al iniciar sesión";
  } finally { loading.value = false; }
}
</script>
