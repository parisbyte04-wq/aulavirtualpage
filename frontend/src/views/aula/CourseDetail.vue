<template>
  <div class="min-h-screen bg-gray-50">
    <AulaHeader />
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <div v-if="loading" class="text-center py-20 text-gray-400">Cargando curso...</div>

      <template v-if="course">
        <div class="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
          <div class="flex items-start justify-between flex-wrap gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{{ course.category || 'General' }}</span>
                <span class="text-xs text-gray-400">{{ course.lessons?.length || 0 }} lecciones</span>
              </div>
              <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ course.title }}</h1>
              <p class="text-gray-600 leading-relaxed">{{ course.description }}</p>
            </div>
          </div>

          <div class="mt-6 flex items-center gap-4">
            <button
              v-if="!isEnrolled"
              @click="handleEnroll"
              :disabled="enrolling"
              class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {{ enrolling ? 'Inscribiendo...' : 'Inscribirme gratis' }}
            </button>
            <router-link
              v-else
              :to="`/aula/${course.id}/leccion/${firstLessonId}`"
              class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all"
            >
              Ir al curso
            </router-link>
            <span v-if="enrollMsg" class="text-sm text-green-600 font-medium">{{ enrollMsg }}</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Contenido del curso</h2>
          <div class="space-y-3">
            <div v-for="(lesson, i) in course.lessons" :key="lesson.id"
              class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all"
              :class="{ 'opacity-50': isEnrolled === false }"
            >
              <div class="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                {{ i + 1 }}
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-gray-900">{{ lesson.title }}</h3>
                <p class="text-xs text-gray-400" v-if="lesson.duration">{{ lesson.duration }} min</p>
              </div>
              <svg v-if="lesson.videoUrl" class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </template>
    </main>
    <AulaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { coursesApi, enrollmentsApi } from "../../services/api";
import { useAuthStore } from "../../stores/auth";
import type { Course } from "../../types";
import AulaHeader from "../../components/layout/AulaHeader.vue";
import AulaFooter from "../../components/layout/AulaFooter.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const course = ref<Course | null>(null);
const loading = ref(true);
const isEnrolled = ref<boolean | null>(null);
const enrolling = ref(false);
const enrollMsg = ref("");

const firstLessonId = computed(() => course.value?.lessons?.[0]?.id || 0);

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    course.value = await coursesApi.getById(id);
    if (authStore.isAuthenticated) {
      const progress = await coursesApi.getProgress(id);
      isEnrolled.value = progress.enrolled;
    }
  } finally { loading.value = false; }
});

async function handleEnroll() {
  if (!authStore.isAuthenticated) {
    router.push("/auth/login");
    return;
  }
  enrolling.value = true;
  try {
    await enrollmentsApi.enroll(Number(route.params.id));
    isEnrolled.value = true;
    enrollMsg.value = "¡Inscripción exitosa!";
  } catch (e: any) {
    enrollMsg.value = e.response?.data?.error || "Error al inscribirse";
  } finally { enrolling.value = false; }
}
</script>
