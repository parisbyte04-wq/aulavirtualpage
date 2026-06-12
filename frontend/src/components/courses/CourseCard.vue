<template>
  <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
    <div v-if="course.imageUrl" class="h-44 overflow-hidden">
      <img :src="course.imageUrl" :alt="course.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div v-else class="h-44 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
      <svg class="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
    <div class="p-6">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{{ course.researchArea?.title || 'General' }}</span>
        <span class="text-xs text-gray-400">{{ lessonCount }} lecciones</span>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{{ course.title }}</h3>
      <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ course.description }}</p>
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-400">{{ enrollmentCount }} inscritos</span>
        <slot name="actions">
          <router-link :to="`/aula/${course.id}`" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all">
            Ver curso
          </router-link>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from "../../types";

const props = withDefaults(defineProps<{
  course: Course;
  lessonCount?: number;
  enrollmentCount?: number;
}>(), {
  lessonCount: 0,
  enrollmentCount: 0,
});
</script>
