<template>
  <section id="cursos" class="py-20 lg:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12 lg:mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Cursos <span class="text-primary-600">Disponibles</span></h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Explora nuestros cursos y comienza tu aprendizaje en el aula virtual.</p>
      </div>

      <div v-if="courses.length === 0" class="text-center py-12 text-gray-400">
        No hay cursos disponibles próximamente.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="course in courses"
          :key="course.id"
          class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
        >
          <div class="h-44 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
            <svg class="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="p-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{{ course.category || 'General' }}</span>
              <span class="text-xs text-gray-400">{{ course._count?.lessons || 0 }} lecciones</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{{ course.title }}</h3>
            <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ course.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-400">{{ course._count?.enrollments || 0 }} inscritos</span>
              <router-link
                :to="`/aula/${course.id}`"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all"
              >
                Ver curso
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-10">
        <router-link
          to="/aula"
          class="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold rounded-xl transition-all"
        >
          Ir al Aula Virtual
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { coursesApi } from "../../services/api";
import type { Course } from "../../types";

const courses = ref<Course[]>([]);

onMounted(async () => {
  try {
    courses.value = await coursesApi.getAll();
  } catch {
    // silently fail
  }
});
</script>
