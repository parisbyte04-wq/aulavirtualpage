<template>
  <div class="min-h-screen bg-gray-50">
    <AulaHeader />

    <!-- Sticky header on scroll -->
    <div v-if="showSticky && course"
      class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          <button @click="scrollToTop" class="text-sm text-gray-500 hover:text-gray-700 shrink-0">&larr;</button>
          <span class="font-medium text-gray-900 truncate">{{ course.title }}</span>
        </div>
        <button v-if="!isEnrolled && authStore.isStudent" @click="handleEnroll" :disabled="enrolling"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 shrink-0">
          {{ enrolling ? 'Inscribiendo...' : 'Inscribirme gratis' }}
        </button>
        <router-link v-else-if="isEnrolled" :to="`/aula/${course.id}/leccion/${firstLessonId}`"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all shrink-0">
          Ir al curso
        </router-link>
      </div>
    </div>

    <main class="pt-28 pb-16">
      <!-- Hero Banner -->
      <div class="relative" v-if="course">
        <div class="h-48 lg:h-64 bg-gradient-to-br from-primary-700 to-primary-900 overflow-hidden">
          <img v-if="course.imageUrl" :src="course.imageUrl" :alt="course.title"
            class="w-full h-full object-cover opacity-30" />
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="relative -mt-20 mb-8">
            <div class="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-xl">
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-3 flex-wrap">
                    <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{{ course.researchArea?.title || 'General' }}</span>
                    <span class="text-xs text-gray-400">{{ course.lessons?.length || 0 }} lecciones</span>
                    <span v-if="course.certificateEnabled" class="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Certificado incluido</span>
                    <span v-if="isNewCourse(course)" class="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Nuevo</span>
                  </div>
                  <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{{ course.title }}</h1>
                  <p class="text-gray-600 leading-relaxed">{{ course.description }}</p>

                  <!-- Social proof -->
                  <div class="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>
                      {{ course._count?.enrollments || 0 }} inscritos
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      {{ totalDuration }} min total
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                      {{ course.lessons?.length || 0 }} lecciones
                    </span>
                  </div>

                  <!-- Course progress -->
                  <div v-if="isEnrolled && progressData" class="mt-6 p-4 bg-primary-50 rounded-xl">
                    <div class="flex items-center justify-between text-sm mb-2">
                      <span class="font-medium text-primary-700">Tu progreso</span>
                      <span class="text-primary-600">{{ progressData.completedLessons }}/{{ progressData.totalLessons }} lecciones</span>
                    </div>
                    <div class="w-full bg-primary-200 rounded-full h-2.5">
                      <div class="bg-primary-600 h-2.5 rounded-full transition-all" :style="{ width: progressData.progress + '%' }" />
                    </div>
                    <div v-if="progressData.completedAt" class="mt-2 text-sm text-green-600 font-medium">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      Completado el {{ formatDate(progressData.completedAt) }}
                    </div>
                  </div>
                </div>

                <!-- Info Sidebar -->
                <div class="lg:w-72 shrink-0">
                  <div class="bg-gray-50 rounded-xl p-5 space-y-4">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-gray-900">{{ totalDuration }} min</div>
                      <div class="text-xs text-gray-500">Duración total</div>
                    </div>
                    <hr class="border-gray-200" />
                    <div class="space-y-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-500">Lecciones</span>
                        <span class="font-medium text-gray-900">{{ course.lessons?.length || 0 }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-500">Categoría</span>
                        <span class="font-medium text-gray-900">{{ course.researchArea?.title || 'General' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-500">Certificado</span>
                        <span class="font-medium" :class="course.certificateEnabled ? 'text-green-600' : 'text-gray-400'">
                          {{ course.certificateEnabled ? 'Incluido' : 'No disponible' }}
                        </span>
                      </div>
                    </div>
                    <hr class="border-gray-200" />
                    <div class="flex justify-center gap-3">
                      <button @click="shareUrl('facebook')" class="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Compartir en Facebook">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </button>
                      <button @click="shareUrl('twitter')" class="p-2 rounded-lg bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors" title="Compartir en Twitter">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </button>
                      <button @click="shareUrl('whatsapp')" class="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors" title="Compartir en WhatsApp">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </button>
                      <button @click="copyLink" class="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Copiar enlace">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                      </button>
                    </div>
                    <button v-if="copied" class="text-xs text-green-600 text-center w-full">¡Enlace copiado!</button>
                  </div>
                </div>
              </div>

              <!-- CTA -->
              <div class="mt-6 flex items-center gap-4">
                <button v-if="!isEnrolled && authStore.isStudent" @click="handleEnroll" :disabled="enrolling"
                  class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
                  {{ enrolling ? 'Inscribiendo...' : 'Inscribirme gratis' }}
                </button>
                <router-link v-else-if="isEnrolled" :to="`/aula/${course.id}/leccion/${firstLessonId}`"
                  class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all">
                  {{ progressData?.completedAt ? 'Repasar curso' : 'Ir al curso' }}
                </router-link>
                <span v-if="enrollMsg" class="text-sm font-medium" :class="enrollMsg.includes('exitosa') ? 'text-green-600' : 'text-red-600'">{{ enrollMsg }}</span>
              </div>
            </div>
          </div>

          <!-- Content + Lessons -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div class="lg:col-span-2 space-y-8">
              <!-- Lessons / Modules -->
              <div class="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
                <h2 class="text-xl font-bold text-gray-900 mb-6">Contenido del curso</h2>
                <div v-if="modules.length > 0">
                  <div v-for="(mod, mi) in modules" :key="mi" class="mb-6 last:mb-0">
                    <div @click="mod.open = !mod.open"
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors mb-2">
                      <h3 class="font-semibold text-gray-900 text-sm">{{ mod.name }}</h3>
                      <svg class="w-4 h-4 text-gray-400 transition-transform" :class="{ 'rotate-180': mod.open }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div v-show="mod.open" class="space-y-2">
                      <div v-for="(lesson, i) in mod.lessons" :key="lesson.id"
                        class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all"
                        :class="{
                          'opacity-50': isEnrolled === false,
                          'border-green-200 bg-green-50': isEnrolled && lessonProgressMap[lesson.id]?.completed,
                        }"
                      >
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                          :class="isEnrolled && lessonProgressMap[lesson.id]?.completed
                            ? 'bg-green-100 text-green-600'
                            : 'bg-primary-100 text-primary-600'"
                        >
                          <svg v-if="isEnrolled && lessonProgressMap[lesson.id]?.completed" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                          <span v-else>{{ lesson.order }}</span>
                        </div>
                        <div class="flex-1">
                          <h4 class="font-medium text-gray-900 text-sm">{{ lesson.title }}</h4>
                          <p class="text-xs text-gray-400" v-if="lesson.duration">{{ lesson.duration }} min</p>
                        </div>
                        <svg v-if="lesson.videoUrl" class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="space-y-3">
                  <div v-for="(lesson, i) in course.lessons" :key="lesson.id"
                    class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all"
                    :class="{
                      'opacity-50': isEnrolled === false,
                      'border-green-200 bg-green-50': isEnrolled && lessonProgressMap[lesson.id]?.completed,
                    }"
                  >
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                      :class="isEnrolled && lessonProgressMap[lesson.id]?.completed
                        ? 'bg-green-100 text-green-600'
                        : 'bg-primary-100 text-primary-600'"
                    >
                      <svg v-if="isEnrolled && lessonProgressMap[lesson.id]?.completed" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                      <span v-else>{{ i + 1 }}</span>
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

              <!-- FAQ -->
              <div class="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
                <h2 class="text-xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
                <div class="space-y-3">
                  <div v-for="(faq, i) in faqs" :key="i" class="border border-gray-100 rounded-xl overflow-hidden">
                    <button @click="faq.open = !faq.open"
                      class="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                      <span class="font-medium text-gray-900 text-sm">{{ faq.q }}</span>
                      <svg class="w-4 h-4 text-gray-400 transition-transform shrink-0" :class="{ 'rotate-180': faq.open }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div v-show="faq.open" class="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{{ faq.a }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar bottom section -->
            <div class="space-y-6">
              <!-- Social proof card -->
              <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 class="font-semibold text-gray-900 mb-4">¿Por qué este curso?</h3>
                <ul class="space-y-3 text-sm text-gray-600">
                  <li class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span>{{ course.lessons?.length || 0 }} lecciones organizadas secuencialmente</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span>{{ totalDuration }} minutos de contenido en video</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span>Acceso inmediato al inscribirte</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span v-if="course.certificateEnabled">Certificado de finalización incluido</span>
                    <span v-else>Evaluación final para medir tu progreso</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span>Foro de discusión por lección</span>
                  </li>
                </ul>
              </div>

              <!-- Instructor (placeholder) -->
              <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 class="font-semibold text-gray-900 mb-4">Instructor</h3>
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                    II
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 text-sm">Instituto Innovación</p>
                    <p class="text-xs text-gray-400">Centro de formación</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Courses -->
          <div v-if="relatedCourses.length > 0" class="mb-12">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Cursos relacionados</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CourseCard
                v-for="rc in relatedCourses"
                :key="rc.id"
                :course="rc"
                :lesson-count="rc._count?.lessons || 0"
                :enrollment-count="rc._count?.enrollments || 0"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
    <AulaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { coursesApi, enrollmentsApi } from "../../services/api";
import type { CourseProgress } from "../../services/api";
import type { Course } from "../../types";
import { useAuthStore } from "../../stores/auth";
import AulaHeader from "../../components/layout/AulaHeader.vue";
import AulaFooter from "../../components/layout/AulaFooter.vue";
import CourseCard from "../../components/courses/CourseCard.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const allCourses = ref<Course[]>([]);
const course = ref<Course | null>(null);
const loading = ref(true);
const isEnrolled = ref<boolean | null>(null);
const enrolling = ref(false);
const enrollMsg = ref("");
const progressData = ref<CourseProgress | null>(null);
const showSticky = ref(false);
const copied = ref(false);

const firstLessonId = computed(() => course.value?.lessons?.[0]?.id || 0);

const lessonProgressMap = computed(() => {
  if (!progressData.value?.lessonProgress) return {};
  const map: Record<number, { completed: boolean }> = {};
  for (const lp of progressData.value.lessonProgress) {
    map[lp.lessonId] = { completed: lp.completed };
  }
  return map;
});

const totalDuration = computed(() => {
  if (!course.value?.lessons) return 0;
  return course.value.lessons.reduce((sum, l) => sum + (l.duration || 0), 0);
});

function isNewCourse(c: Course): boolean {
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(c.createdAt || "").getTime() < thirtyDays;
}

const relatedCourses = computed(() =>
  allCourses.value.filter((c) => {
    if (c.id === course.value?.id) return false;
    return course.value?.researchAreaId ? c.researchAreaId === course.value.researchAreaId : false;
  }).slice(0, 3)
);

const modules = computed(() => {
  if (!course.value?.lessons || course.value.lessons.length <= 5) return [];
  const lessons = course.value.lessons;
  const mods: { name: string; open: boolean; lessons: typeof lessons }[] = [];
  const chunkSize = Math.ceil(lessons.length / Math.ceil(lessons.length / 5));
  for (let i = 0; i < lessons.length; i += chunkSize) {
    mods.push({
      name: `Módulo ${mods.length + 1}`,
      open: mods.length === 0,
      lessons: lessons.slice(i, i + chunkSize),
    });
  }
  return mods;
});

const faqs = ref([
  { q: "¿Necesito conocimientos previos?", a: "No, los cursos están diseñados para guiarte desde lo básico hasta un nivel avanzado. Cada lección está explicada paso a paso.", open: false },
  { q: "¿Cuánto tiempo tengo acceso al curso?", a: "Una vez inscrito, tienes acceso ilimitado al contenido del curso para que puedas avanzar a tu propio ritmo.", open: false },
  { q: "¿Cómo obtengo el certificado?", a: "Al completar todas las lecciones y aprobar el examen final con la calificación mínima requerida, podrás descargar tu certificado en formato PDF.", open: false },
  { q: "¿Puedo acceder desde el celular?", a: "Sí, la plataforma está diseñada para ser responsive y funciona correctamente en dispositivos móviles y tablets.", open: false },
]);

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleScroll() {
  showSticky.value = window.scrollY > 400;
}

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  try {
    const id = Number(route.params.id);
    const [courseData, allData] = await Promise.all([
      coursesApi.getById(id),
      coursesApi.getAll(),
    ]);
    course.value = courseData;
    allCourses.value = allData;
    if (authStore.isAuthenticated) {
      progressData.value = await coursesApi.getProgress(id);
      isEnrolled.value = progressData.value.enrolled;
    }
  } finally { loading.value = false; }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
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
    progressData.value = await coursesApi.getProgress(Number(route.params.id));
  } catch (e: any) {
    enrollMsg.value = e.response?.data?.error || "Error al inscribirse";
  } finally { enrolling.value = false; }
}

function shareUrl(platform: string) {
  const url = window.location.href;
  const text = course.value ? `${course.value.title} - Instituto Innovación` : "";
  const urls: Record<string, string> = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
  };
  window.open(urls[platform], "_blank", "width=600,height=400");
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch { /* fallback */ }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}
</script>
