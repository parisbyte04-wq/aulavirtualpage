<template>
  <section id="nosotros" class="py-20 lg:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12 lg:mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Sobre <span class="text-primary-600">Nosotros</span></h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Conoce nuestra misión, visión y el camino que hemos recorrido.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div class="bg-primary-50 rounded-2xl p-8 border border-primary-100">
          <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Misión</h3>
          <p class="text-gray-600 leading-relaxed">{{ about?.mission }}</p>
        </div>

        <div class="bg-accent-50 rounded-2xl p-8 border border-accent-100">
          <div class="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Visión</h3>
          <p class="text-gray-600 leading-relaxed">{{ about?.vision }}</p>
        </div>

        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <div class="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Historia</h3>
          <p class="text-gray-600 leading-relaxed">{{ about?.history }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.label" class="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div class="text-3xl font-bold text-primary-600 mb-1">{{ stat.value }}</div>
          <div class="text-sm text-gray-500">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { About } from "../../types";

defineProps<{
  about: About | null;
}>();

const stats = [
  { value: "4", label: "Áreas de investigación" },
  { value: "12+", label: "Investigadores" },
  { value: "25+", label: "Proyectos realizados" },
  { value: "10+", label: "Publicaciones" },
];
</script>
