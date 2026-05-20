<template>
  <div class="min-h-screen bg-gray-50">
    <AulaHeader />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <div class="mb-10">
        <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Catálogo de Cursos</h1>
        <p class="text-gray-600 text-lg">Explora nuestros cursos y comienza tu aprendizaje.</p>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-400">Cargando cursos...</div>

      <div v-else-if="courses.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg">No hay cursos disponibles aún.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="course in courses" :key="course.id" class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
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
              <router-link :to="`/aula/${course.id}`" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all">
                Ver curso
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AulaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { coursesApi } from "../../services/api";
import type { Course } from "../../types";
import AulaHeader from "../../components/layout/AulaHeader.vue";
import AulaFooter from "../../components/layout/AulaFooter.vue";

const courses = ref<Course[]>([]);
const loading = ref(true);

onMounted(async () => {
  try { courses.value = await coursesApi.getAll(); }
  finally { loading.value = false; }
});
</script>
