<template>
  <div class="min-h-screen bg-gray-50">
    <AulaHeader />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <router-link to="/" class="hover:text-primary-600 transition-colors">Inicio</router-link>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <span class="text-gray-600">Cursos</span>
        <span v-if="areaFilter !== 'all'" class="text-gray-400">
          <svg class="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-gray-600 ml-1">{{ areaFilter }}</span>
        </span>
      </nav>

      <!-- Hero -->
      <div class="mb-10">
        <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Catálogo de Cursos</h1>
        <p class="text-gray-600 text-lg">Explora nuestra oferta formativa y comienza tu aprendizaje.</p>
      </div>

      <!-- Filters bar -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="search" placeholder="Buscar cursos por título, descripción..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm" />
        </div>
        <select v-model="areaFilter"
          class="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm bg-white">
          <option value="all">Todas las áreas</option>
          <option v-for="a in areas" :key="a.id" :value="a.title">{{ a.title }}</option>
        </select>
        <select v-model="durationFilter"
          class="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm bg-white">
          <option value="all">Cualquier duración</option>
          <option value="short">Menos de 1h</option>
          <option value="medium">1-3 horas</option>
          <option value="long">3-10 horas</option>
          <option value="extended">10+ horas</option>
        </select>
        <select v-model="sortBy"
          class="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm bg-white">
          <option value="newest">Más recientes</option>
          <option value="popular">Más populares</option>
          <option value="title">A-Z</option>
        </select>
        <div class="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button @click="viewMode = 'grid'"
            class="px-3 py-2.5 transition-colors"
            :class="viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button @click="viewMode = 'list'"
            class="px-3 py-2.5 transition-colors"
            :class="viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
          <div class="h-44 bg-gray-200" />
          <div class="p-6 space-y-3">
            <div class="flex gap-2"><div class="h-5 w-20 bg-gray-200 rounded-full" /><div class="h-5 w-16 bg-gray-200 rounded-full" /></div>
            <div class="h-6 w-3/4 bg-gray-200 rounded" />
            <div class="h-4 w-full bg-gray-200 rounded" />
            <div class="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div v-else-if="paginatedCourses.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg">{{ courses.length === 0 ? 'No hay cursos disponibles aún.' : 'Ningún curso coincide con los filtros.' }}</p>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="course in paginatedCourses" :key="course.id" class="relative">
          <CourseCard
            :course="course"
            :lesson-count="course._count?.lessons || 0"
            :enrollment-count="course._count?.enrollments || 0"
          />
          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span v-if="isNew(course)" class="px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full shadow-md">Nuevo</span>
            <span v-if="course.certificateEnabled" class="px-2 py-0.5 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-md">Certificado</span>
            <span v-if="isPopular(course)" class="px-2 py-0.5 bg-accent-500 text-white text-xs font-semibold rounded-full shadow-md">Popular</span>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <div v-for="course in paginatedCourses" :key="course.id"
          class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col sm:flex-row">
          <div class="sm:w-56 h-40 sm:h-auto shrink-0">
            <div v-if="course.imageUrl" class="w-full h-full">
              <img :src="course.imageUrl" :alt="course.title" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
              <svg class="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{{ course.researchArea?.title || 'General' }}</span>
                <span class="text-xs text-gray-400">{{ course._count?.lessons || 0 }} lecciones</span>
                <span v-if="isNew(course)" class="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Nuevo</span>
                <span v-if="course.certificateEnabled" class="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Certificado</span>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2" v-html="highlightSearch(course.title)"></h3>
              <p class="text-sm text-gray-500 mb-3 line-clamp-2" v-html="highlightSearch(course.description || '')"></p>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-400">{{ course._count?.enrollments || 0 }} inscritos</span>
              <router-link :to="`/aula/${course.id}`"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all">
                Ver curso
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-10">
        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
          class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
          &larr; Anterior
        </button>
        <button v-for="p in totalPages" :key="p" @click="currentPage = p"
          class="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
          :class="p === currentPage ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-50'">
          {{ p }}
        </button>
        <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
          Siguiente &rarr;
        </button>
      </div>
    </main>
    <AulaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { coursesApi, researchAreas } from "../../services/api";
import type { Course, ResearchArea } from "../../types";
import AulaHeader from "../../components/layout/AulaHeader.vue";
import AulaFooter from "../../components/layout/AulaFooter.vue";
import CourseCard from "../../components/courses/CourseCard.vue";

const PER_PAGE = 9;

const courses = ref<Course[]>([]);
const areas = ref<ResearchArea[]>([]);
const loading = ref(true);
const search = ref("");
const areaFilter = ref("all");
const durationFilter = ref("all");
const sortBy = ref("newest");
const viewMode = ref<"grid" | "list">("grid");
const currentPage = ref(1);

function courseDuration(course: Course): number {
  if (!course.lessons) return 0;
  return course.lessons.reduce((sum, l) => sum + (l.duration || 0), 0);
}

function isNew(course: Course): boolean {
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(course.createdAt || "").getTime() < thirtyDays;
}

function isPopular(course: Course): boolean {
  return (course._count?.enrollments || 0) >= 100;
}

const filteredCourses = computed(() => {
  let result = courses.value.filter((c) => {
    const q = search.value.toLowerCase();
    const matchesSearch = !q
      || c.title.toLowerCase().includes(q)
      || (c.description || "").toLowerCase().includes(q);
    const matchesArea = areaFilter.value === "all" || c.researchArea?.title === areaFilter.value;

    const dur = courseDuration(c);
    let matchesDuration = true;
    if (durationFilter.value === "short") matchesDuration = dur > 0 && dur < 60;
    else if (durationFilter.value === "medium") matchesDuration = dur >= 60 && dur < 180;
    else if (durationFilter.value === "long") matchesDuration = dur >= 180 && dur < 600;
    else if (durationFilter.value === "extended") matchesDuration = dur >= 600;

    return matchesSearch && matchesArea && matchesDuration;
  });

  if (sortBy.value === "popular") {
    result = [...result].sort((a, b) => (b._count?.enrollments || 0) - (a._count?.enrollments || 0));
  } else if (sortBy.value === "title") {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title));
  }

  return result;
});

const totalPages = computed(() => Math.ceil(filteredCourses.value.length / PER_PAGE));

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE;
  return filteredCourses.value.slice(start, start + PER_PAGE);
});

function highlightSearch(text: string): string {
  if (!search.value.trim()) return text;
  const q = search.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${q})`, "gi"), "<mark class='bg-yellow-200 rounded px-0.5'>$1</mark>");
}

onMounted(async () => {
  try {
    const [allCourses, allAreas] = await Promise.all([coursesApi.getAll(), researchAreas.getAll()]);
    courses.value = allCourses;
    areas.value = allAreas;
  } finally { loading.value = false; }
});
</script>
