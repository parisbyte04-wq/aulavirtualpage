<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="solid || scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <a href="#" class="flex items-center gap-2">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">II</span>
          </div>
          <span
            class="font-semibold text-lg transition-colors duration-300"
            :class="solid || scrolled ? 'text-gray-900' : 'text-white'"
          >
            Instituto Innovación
          </span>
        </a>

        <div class="hidden md:flex items-center gap-8">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="text-sm font-medium transition-colors duration-300 hover:text-accent-400"
            :class="solid || scrolled ? 'text-gray-700' : 'text-white/90'"
          >
            {{ link.label }}
          </a>
          <a
            href="/#contacto"
            class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            :class="solid || scrolled
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-white text-primary-600 hover:bg-gray-100'"
          >
            Contacto
          </a>
          <router-link
            to="/aula"
            class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all"
            :class="solid || scrolled
              ? 'border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white'
              : 'border-white text-white hover:bg-white hover:text-primary-600'"
          >
            Aula Virtual
          </router-link>
        </div>

        <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2" :class="solid || scrolled ? 'text-gray-900' : 'text-white'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="mobileOpen" class="md:hidden pb-4 border-t border-gray-200">
        <div class="flex flex-col gap-2 pt-4">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="text-gray-700 font-medium px-3 py-2 rounded-lg hover:bg-gray-100"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </a>
          <a
            href="/#contacto"
            class="px-3 py-2 bg-primary-600 text-white rounded-lg text-center font-semibold"
            @click="mobileOpen = false"
          >
            Contacto
          </a>
          <router-link
            to="/aula"
            class="px-3 py-2 border-2 border-primary-600 text-primary-600 rounded-lg text-center font-semibold"
            @click="mobileOpen = false"
          >
            Aula Virtual
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

defineProps<{ solid?: boolean }>();

const links = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#areas", label: "Áreas" },
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#software", label: "Software" },
  { href: "/#equipo", label: "Equipo" },
  { href: "/#publicaciones", label: "Publicaciones" },
  { href: "/#cursos", label: "Cursos" },
];

const scrolled = ref(false);
const mobileOpen = ref(false);

function onScroll() {
  scrolled.value = window.scrollY > 50;
}

onMounted(() => window.addEventListener("scroll", onScroll));
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>
