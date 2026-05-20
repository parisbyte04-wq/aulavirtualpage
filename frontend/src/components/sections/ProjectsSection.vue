<template>
  <section id="proyectos" class="py-20 lg:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="Proyectos <span class='text-primary-600'>Destacados</span>"
        subtitle="Conoce algunos de los proyectos que estamos desarrollando actualmente."
      />

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="project in projects"
          :key="project.id"
          class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
        >
          <div class="h-48 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
            <svg class="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div class="p-6">
            <div v-if="project.researchArea" class="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full inline-block mb-3">
              {{ project.researchArea.title }}
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ project.title }}</h3>
            <p class="text-gray-600 text-sm leading-relaxed">{{ project.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Project } from "../../types";
import SectionTitle from "../ui/SectionTitle.vue";

defineProps<{
  projects: Project[];
}>();
</script>
