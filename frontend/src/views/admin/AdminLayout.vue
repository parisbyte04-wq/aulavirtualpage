<template>
  <div class="min-h-screen bg-gray-50">
    <template v-if="route.path === '/admin/login'">
      <router-view />
    </template>
    <template v-else>
      <aside class="fixed top-0 left-0 h-full w-64 bg-primary-800 text-white z-40 hidden lg:block">
        <div class="flex items-center gap-2 px-6 h-16 border-b border-primary-700">
          <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span class="text-primary-600 font-bold text-sm">II</span>
          </div>
          <span class="font-semibold">Admin</span>
        </div>
        <nav class="p-4 space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors"
            :class="route.path.startsWith(item.to) ? 'bg-primary-700 text-white' : 'text-gray-300 hover:bg-primary-700/50 hover:text-white'"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </router-link>
        </nav>
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700">
          <button @click="handleLogout" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-primary-700/50 hover:text-white w-full transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div class="lg:ml-64">
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button @click="mobileSidebar = !mobileSidebar" class="lg:hidden p-2 text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-900">Panel de Administración</h1>
          <div class="relative">
            <button @click="showDropdown = !showDropdown" class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <span class="font-medium">{{ authStore.user?.name || 'Admin' }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="showDropdown" class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <router-link to="/admin/profile" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" @click="showDropdown = false">Mi perfil</router-link>
              <hr class="my-1 border-gray-100" />
              <button @click="handleLogout" class="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 transition-colors">Cerrar sesión</button>
            </div>
            <div v-if="showDropdown" class="fixed inset-0 z-40" @click="showDropdown = false" />
          </div>
        </header>
        <div class="p-6">
          <router-view />
        </div>
      </div>

      <div v-if="mobileSidebar" class="fixed inset-0 z-50 lg:hidden" @click="mobileSidebar = false">
        <div class="absolute inset-0 bg-black/50" />
        <aside class="absolute top-0 left-0 h-full w-64 bg-primary-800 text-white" @click.stop>
          <div class="flex items-center justify-between px-6 h-16 border-b border-primary-700">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span class="text-primary-600 font-bold text-sm">II</span>
              </div>
              <span class="font-semibold">Admin</span>
            </div>
            <button @click="mobileSidebar = false" class="text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="p-4 space-y-1">
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors"
              :class="route.path.startsWith(item.to) ? 'bg-primary-700 text-white' : 'text-gray-300 hover:bg-primary-700/50 hover:text-white'"
              @click="mobileSidebar = false"
            >
              <component :is="item.icon" class="w-5 h-5" />
              {{ item.label }}
            </router-link>
          </nav>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const mobileSidebar = ref(false);
const showDropdown = ref(false);

function navIcon(d: string) {
  return () => h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", class: "w-5 h-5" }, [
    h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": 2, d }),
  ]);
}

const baseNav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: navIcon("M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6") },
  { to: "/admin/courses", label: "Cursos", icon: navIcon("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253") },
  { to: "/admin/enrollments", label: "Inscripciones", icon: navIcon("M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z") },
  { to: "/admin/certificates", label: "Certificados", icon: navIcon("M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z") },
  { to: "/admin/about", label: "Sobre nosotros", icon: navIcon("M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z") },
  { to: "/admin/areas", label: "Áreas", icon: navIcon("M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z") },
  { to: "/admin/projects", label: "Proyectos", icon: navIcon("M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z") },
  { to: "/admin/team", label: "Equipo", icon: navIcon("M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z") },
  { to: "/admin/publications", label: "Publicaciones", icon: navIcon("M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z") },
  { to: "/admin/messages", label: "Mensajes", icon: navIcon("M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z") },
];

const adminNavItem = { to: "/admin/admins", label: "Admins", icon: navIcon("M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z") };

const navItems = computed(() => authStore.isSuperAdmin ? [baseNav[0], baseNav[1], adminNavItem, ...baseNav.slice(2)] : baseNav);

function handleLogout() {
  authStore.logout();
  router.push("/admin/login");
}
</script>
