<template>
  <section id="cursos" class="py-20 lg:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12 lg:mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Cursos <span class="text-primary-600">Disponibles</span>
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Formación continua con cursos diseñados para potenciar tus habilidades.
        </p>
      </div>

      <!-- Animated Counters -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16" v-if="courses.length > 0">
        <div class="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div class="text-3xl lg:text-4xl font-bold text-primary-600 mb-1" ref="counterEls">{{ courses.length }}</div>
          <div class="text-sm text-gray-500">Cursos</div>
        </div>
        <div class="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div class="text-3xl lg:text-4xl font-bold text-accent-500 mb-1">{{ totalLessons }}</div>
          <div class="text-sm text-gray-500">Lecciones</div>
        </div>
        <div class="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div class="text-3xl lg:text-4xl font-bold text-green-600 mb-1">{{ totalStudents }}</div>
          <div class="text-sm text-gray-500">Estudiantes</div>
        </div>
        <div class="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div class="text-3xl lg:text-4xl font-bold text-amber-600 mb-1">{{ totalDuration }}h</div>
          <div class="text-sm text-gray-500">Horas de contenido</div>
        </div>
      </div>

      <!-- Featured Course Hero -->
      <div v-if="featuredCourse" class="relative mb-16 rounded-2xl overflow-hidden bg-gradient-to-r from-primary-800 to-primary-700 text-white">
        <div class="relative z-10 p-8 lg:p-12 lg:pr-80">
          <span class="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-4">Curso destacado</span>
          <h3 class="text-2xl lg:text-3xl font-bold mb-3">{{ featuredCourse.title }}</h3>
          <p class="text-white/80 text-sm lg:text-base mb-6 max-w-xl line-clamp-3">{{ featuredCourse.description }}</p>
          <div class="flex items-center gap-4 text-sm text-white/70 mb-6">
            <span>{{ featuredCourse._count?.lessons || 0 }} lecciones</span>
            <span>{{ featuredCourse._count?.enrollments || 0 }} inscritos</span>
            <span v-if="featuredArea">{{ featuredArea }}</span>
          </div>
          <router-link :to="`/aula/${featuredCourse.id}`"
            class="inline-block px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-all">
            Ver curso
          </router-link>
        </div>
        <div v-if="featuredCourse.imageUrl" class="hidden lg:block absolute right-0 top-0 w-80 h-full">
          <img :src="featuredCourse.imageUrl" :alt="featuredCourse.title" class="w-full h-full object-cover opacity-40" />
        </div>
        <div v-else class="hidden lg:block absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-primary-600/50 to-transparent" />
      </div>

      <!-- Area Tabs -->
      <div class="flex flex-wrap justify-center gap-2 mb-10">
        <button @click="activeArea = 'all'"
          class="px-4 py-2 rounded-full text-sm font-medium transition-all"
          :class="activeArea === 'all' ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
          Todos
        </button>
        <button v-for="a in areas" :key="a.id" @click="activeArea = a.title"
          class="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
          :class="activeArea === a.title ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
          {{ a.title }}
        </button>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
          <div class="h-44 bg-gray-200" />
          <div class="p-6 space-y-3">
            <div class="h-5 w-20 bg-gray-200 rounded-full" />
            <div class="h-6 w-3/4 bg-gray-200 rounded" />
            <div class="h-4 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div v-else-if="filteredCourses.length === 0" class="text-center py-12 text-gray-400">
        No hay cursos en esta área.
      </div>

      <!-- Course Carousel -->
      <div v-else class="relative">
        <button @click="scrollCarousel(-1)"
          class="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hidden md:flex"
          :class="{ 'opacity-0 pointer-events-none': scrollPos <= 0 }">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div ref="carouselRef" class="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4"
          style="scrollbar-width: none; -ms-overflow-style: none;"
          @scroll="onScroll">
          <CourseCard
            v-for="course in filteredCourses"
            :key="course.id"
            :course="course"
            :lesson-count="course._count?.lessons || 0"
            :enrollment-count="course._count?.enrollments || 0"
            class="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          />
        </div>
        <button @click="scrollCarousel(1)"
          class="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hidden md:flex"
          :class="{ 'opacity-0 pointer-events-none': scrollAtEnd }">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Testimonials -->
      <div v-if="testimonials.length > 0" class="mt-20">
        <div class="text-center mb-10">
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Lo que dicen nuestros <span class="text-primary-600">estudiantes</span></h3>
          <p class="text-gray-500">La experiencia de quienes ya han formado parte de nuestros cursos.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(t, i) in testimonials" :key="i"
            class="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative">
            <svg class="w-8 h-8 text-primary-200 mb-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p class="text-gray-600 text-sm mb-4 leading-relaxed">{{ t.text }}</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">{{ t.name.charAt(0) }}</div>
              <div>
                <p class="font-semibold text-gray-900 text-sm">{{ t.name }}</p>
                <p class="text-xs text-gray-400">{{ t.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-10">
        <router-link to="/aula"
          class="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold rounded-xl transition-all">
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
import { ref, computed, onMounted } from "vue";
import { coursesApi, researchAreas } from "../../services/api";
import type { Course, ResearchArea } from "../../types";
import CourseCard from "../courses/CourseCard.vue";

const courses = ref<Course[]>([]);
const areas = ref<ResearchArea[]>([]);
const loading = ref(true);
const activeArea = ref("all");
const carouselRef = ref<HTMLElement | null>(null);
const scrollPos = ref(0);
const scrollAtEnd = ref(false);

const featuredCourse = computed(() => {
  if (courses.value.length === 0) return null;
  return [...courses.value].sort((a, b) => (b._count?.enrollments || 0) - (a._count?.enrollments || 0))[0];
});

const featuredArea = computed(() => featuredCourse.value?.researchArea?.title || null);

const filteredCourses = computed(() =>
  activeArea.value === "all"
    ? courses.value
    : courses.value.filter((c) => c.researchArea?.title === activeArea.value)
);

const totalLessons = computed(() =>
  courses.value.reduce((sum, c) => sum + (c._count?.lessons || 0), 0)
);

const totalStudents = computed(() =>
  courses.value.reduce((sum, c) => sum + (c._count?.enrollments || 0), 0)
);

const totalDuration = computed(() => {
  let total = 0;
  for (const c of courses.value) {
    if (c.lessons) {
      total += c.lessons.reduce((s, l) => s + (l.duration || 0), 0);
    }
  }
  return Math.round(total / 60);
});

const testimonials = [
  { name: "María García", role: "Estudiante de Tecnología", text: "Los cursos son muy completos y el material está excelentemente organizado. Aprendí más en semanas que en meses." },
  { name: "Carlos Mendoza", role: "Profesional Independiente", text: "La flexibilidad horaria y la calidad de los instructores hacen de esta plataforma una experiencia única." },
  { name: "Ana Lucía Pérez", role: "Investigadora", text: "Pude complementar mi formación con cursos actualizados que realmente se adaptan a las necesidades del mercado." },
];

function scrollCarousel(dir: number) {
  if (!carouselRef.value) return;
  const scrollAmount = carouselRef.value.clientWidth * 0.8;
  carouselRef.value.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
}

function onScroll() {
  const el = carouselRef.value;
  if (!el) return;
  scrollPos.value = el.scrollLeft;
  scrollAtEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
}

onMounted(async () => {
  try {
    const [allCourses, allAreas] = await Promise.all([coursesApi.getAll(), researchAreas.getAll()]);
    courses.value = allCourses;
    areas.value = allAreas;
  } catch { /* silently fail */ }
  finally { loading.value = false; }
});
</script>
