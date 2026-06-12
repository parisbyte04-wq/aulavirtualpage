<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-8">
          <router-link to="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">II</span>
            </div>
            <span class="font-semibold text-gray-900">Instituto Innovación</span>
          </router-link>
          <div class="hidden md:flex items-center gap-6">
            <router-link to="/aula" class="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Cursos</router-link>
            <router-link v-if="authStore.isStudent" to="/mis-cursos" class="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Mis cursos</router-link>
            <router-link v-if="authStore.isStudent" to="/mis-certificados" class="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Certificados</router-link>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <template v-if="authStore.isAuthenticated">
            <router-link to="/mi-perfil" class="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center overflow-hidden">
                <img v-if="authStore.user?.avatarUrl" :src="authStore.user.avatarUrl" class="w-full h-full object-cover" />
                <span v-else class="text-sm font-bold text-primary-600">{{ authStore.user?.name?.charAt(0) }}</span>
              </div>
              <span class="hidden sm:inline">{{ authStore.user?.name }}</span>
            </router-link>
            <button @click="handleLogout" class="text-sm text-gray-500 hover:text-red-600">Salir</button>
          </template>
          <template v-else>
            <router-link to="/auth/login" class="text-sm font-medium text-gray-600 hover:text-primary-600">Ingresar</router-link>
            <router-link to="/auth/register" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all">Registrarse</router-link>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push("/");
}
</script>
