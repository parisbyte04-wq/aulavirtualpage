<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50/30">
    <AulaHeader />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <div class="flex gap-8">
        <!-- Sidebar -->
        <aside class="hidden lg:block w-72 shrink-0">
          <div class="bg-white rounded-2xl border border-gray-100 p-5 sticky top-28 shadow-sm space-y-6">
            <!-- Stats -->
            <div>
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Resumen</h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-3 rounded-xl bg-primary-50 border border-primary-100">
                  <span class="text-sm font-medium text-primary-700">Total cursos</span>
                  <span class="text-lg font-bold text-primary-600">{{ enrollments.length }}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-xl bg-accent-50 border border-accent-100">
                  <span class="text-sm font-medium text-accent-700">En curso</span>
                  <span class="text-lg font-bold text-accent-500">{{ activeCount }}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                  <span class="text-sm font-medium text-green-700">Completados</span>
                  <span class="text-lg font-bold text-green-600">{{ completedCount }}</span>
                </div>
              </div>
            </div>

            <hr class="border-gray-100" />

            <!-- Search -->
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Buscar</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input v-model="search" placeholder="Buscar curso..."
                  class="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm bg-gray-50" />
              </div>
            </div>

            <hr class="border-gray-100" />

            <!-- Status filter -->
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Estado</label>
              <div class="space-y-1">
                <button v-for="opt in statusOptions" :key="opt.value" @click="statusFilter = opt.value"
                  class="w-full text-left px-3 py-2 rounded-xl text-sm transition-all"
                  :class="statusFilter === opt.value ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'">
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- Area filter -->
            <div v-if="areas.length > 0">
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Área</label>
              <select v-model="areaFilter"
                class="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm bg-gray-50">
                <option value="all">Todas</option>
                <option v-for="a in areas" :key="a.id" :value="a.id">{{ a.title }}</option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Ordenar</label>
              <select v-model="sortBy"
                class="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm bg-gray-50">
                <option value="recent">Más recientes</option>
                <option value="progress-asc">Menor progreso</option>
                <option value="progress-desc">Mayor progreso</option>
                <option value="az">A-Z</option>
              </select>
            </div>

            <!-- Explore CTA -->
            <router-link to="/aula"
              class="flex items-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Explorar cursos
            </router-link>
          </div>
        </aside>

        <!-- Main content -->
        <div class="flex-1 min-w-0">
          <!-- Mobile filters bar -->
          <div class="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
            <button v-for="opt in statusOptions" :key="opt.value" @click="statusFilter = opt.value"
              class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              :class="statusFilter === opt.value ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'">
              {{ opt.label }}
            </button>
          </div>

          <!-- Stats header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Mis Cursos</h1>
            <div class="flex items-center gap-3 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-accent-500" />
                {{ activeCount }} en curso
              </span>
              <span class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-green-500" />
                {{ completedCount }} completados
              </span>
            </div>
          </div>

          <!-- Skeleton -->
          <div v-if="loading" class="space-y-6">
            <div v-for="i in 3" :key="i" class="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div class="h-16 bg-gradient-to-r from-gray-200 to-gray-100" />
              <div class="p-6 space-y-3">
                <div class="h-5 w-20 bg-gray-200 rounded-full" />
                <div class="h-6 w-3/4 bg-gray-200 rounded" />
                <div class="h-4 w-48 bg-gray-200 rounded" />
                <div class="h-2.5 w-full bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="filteredEnrollments.length === 0" class="text-center py-20">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
              <svg class="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p class="text-gray-500 text-lg mb-2" v-if="search || statusFilter !== 'all' || areaFilter !== 'all'">
              Ningún curso coincide con los filtros.
            </p>
            <p class="text-gray-400 text-lg mb-4" v-else>No estás inscrito en ningún curso aún.</p>
            <router-link to="/aula"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Explorar cursos
            </router-link>
          </div>

          <!-- Course cards -->
          <div v-else class="space-y-5">
            <div v-for="enrollment in filteredEnrollments" :key="enrollment.id"
              class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
              <!-- Colored top bar -->
              <div class="h-2 bg-gradient-to-r" :style="{ background: areaColor(enrollment.course) }" />

              <div class="p-6">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <!-- Area badge -->
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-xs font-semibold px-2.5 py-1 rounded-full"
                        :class="areaBadgeClass(enrollment.course)">
                        {{ enrollment.course.researchArea?.title || 'General' }}
                      </span>
                      <span v-if="enrollment.completedAt"
                        class="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                        Completado
                      </span>
                      <span v-else-if="enrollment.progress === 0"
                        class="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">Sin empezar</span>
                      <span v-else
                        class="text-xs font-semibold text-accent-700 bg-accent-50 px-2.5 py-1 rounded-full">En curso</span>
                    </div>

                    <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      <span v-html="highlightText(enrollment.course.title)" />
                    </h3>

                    <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span class="flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ enrollment.completedLessons }}/{{ enrollment.totalLessons }} lecciones
                      </span>
                      <span class="flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Inscrito {{ formatDate(enrollment.enrolledAt) }}
                      </span>
                    </div>

                    <!-- Progress bar -->
                    <div class="relative w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-700 ease-out"
                        :style="{ width: (enrollment.progress || 0) + '%', background: progressGradient(enrollment.progress || 0) }" />
                      <span class="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
                        :class="(enrollment.progress || 0) > 50 ? 'text-white' : 'text-gray-500'">
                        {{ enrollment.progress || 0 }}%
                      </span>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-3">
                      <router-link v-if="enrollment.course.lessons?.length"
                        :to="`/aula/${enrollment.courseId}/leccion/${enrollment.course.lessons[0].id}`"
                        class="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
                        <span class="flex items-center gap-1.5">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                          {{ enrollment.completedAt ? 'Repasar' : 'Continuar' }}
                        </span>
                      </router-link>

                      <button v-if="enrollment.completedAt" @click="generateCert(enrollment.courseId)"
                        class="px-4 py-2.5 border-2 border-amber-200 text-amber-700 text-sm font-semibold rounded-xl hover:bg-amber-50 transition-all">
                        <span class="flex items-center gap-1.5">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Certificado
                        </span>
                      </button>

                      <router-link v-if="!enrollment.completedAt" :to="`/aula/${enrollment.course.id}`"
                        class="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                        Ver detalle
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AulaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { enrollmentsApi, certificatesApi, researchAreas } from "../../services/api";
import { useRouter } from "vue-router";
import type { Enrollment, ResearchArea } from "../../types";
import AulaHeader from "../../components/layout/AulaHeader.vue";
import AulaFooter from "../../components/layout/AulaFooter.vue";

const router = useRouter();
const enrollments = ref<Enrollment[]>([]);
const areas = ref<ResearchArea[]>([]);
const loading = ref(true);
const search = ref("");
const statusFilter = ref("all");
const areaFilter = ref("all");
const sortBy = ref("recent");

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "En curso" },
  { value: "completed", label: "Completados" },
];

const activeCount = computed(() =>
  enrollments.value.filter((e) => !e.completedAt).length
);

const completedCount = computed(() =>
  enrollments.value.filter((e) => e.completedAt).length
);

const filteredEnrollments = computed(() => {
  let result = enrollments.value.filter((e) => {
    const q = search.value.toLowerCase();
    const matchesSearch = !q || e.course.title.toLowerCase().includes(q);
    const matchesStatus = statusFilter.value === "all"
      || (statusFilter.value === "active" && !e.completedAt)
      || (statusFilter.value === "completed" && e.completedAt);
    const matchesArea = areaFilter.value === "all"
      || e.course.researchAreaId === Number(areaFilter.value);
    return matchesSearch && matchesStatus && matchesArea;
  });

  if (sortBy.value === "recent") {
    result = [...result].sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime());
  } else if (sortBy.value === "progress-asc") {
    result = [...result].sort((a, b) => (a.progress || 0) - (b.progress || 0));
  } else if (sortBy.value === "progress-desc") {
    result = [...result].sort((a, b) => (b.progress || 0) - (a.progress || 0));
  } else if (sortBy.value === "az") {
    result = [...result].sort((a, b) => a.course.title.localeCompare(b.course.title));
  }

  return result;
});

const areaPalette = [
  { badge: "bg-blue-100 text-blue-700", gradient: "linear-gradient(90deg, #3b82f6, #60a5fa)" },
  { badge: "bg-purple-100 text-purple-700", gradient: "linear-gradient(90deg, #8b5cf6, #a78bfa)" },
  { badge: "bg-red-100 text-red-700", gradient: "linear-gradient(90deg, #ef4444, #f87171)" },
  { badge: "bg-green-100 text-green-700", gradient: "linear-gradient(90deg, #22c55e, #4ade80)" },
  { badge: "bg-pink-100 text-pink-700", gradient: "linear-gradient(90deg, #ec4899, #f472b6)" },
  { badge: "bg-amber-100 text-amber-700", gradient: "linear-gradient(90deg, #f59e0b, #fbbf24)" },
  { badge: "bg-teal-100 text-teal-700", gradient: "linear-gradient(90deg, #14b8a6, #2dd4bf)" },
];

function areaBadgeClass(course: { researchAreaId?: number | null }): string {
  if (course.researchAreaId == null) return "bg-primary-100 text-primary-700";
  return areaPalette[course.researchAreaId % areaPalette.length].badge;
}

function areaColor(course: { researchAreaId?: number | null }): string {
  if (course.researchAreaId == null) return "linear-gradient(90deg, #6366f1, #818cf8)";
  return areaPalette[course.researchAreaId % areaPalette.length].gradient;
}

function progressGradient(progress: number): string {
  if (progress >= 100) return "linear-gradient(90deg, #22c55e, #4ade80)";
  if (progress >= 50) return "linear-gradient(90deg, #f59e0b, #fbbf24)";
  return "linear-gradient(90deg, #3b82f6, #60a5fa)";
}

function highlightText(text: string): string {
  if (!search.value.trim()) return text;
  const q = search.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${q})`, "gi"), "<mark class='bg-yellow-200 rounded px-0.5'>$1</mark>");
}

onMounted(async () => {
  try {
    const [enrollData, allAreas] = await Promise.all([
      enrollmentsApi.getMyEnrollments(),
      researchAreas.getAll(),
    ]);
    enrollments.value = enrollData;
    areas.value = allAreas;
  } finally { loading.value = false; }
});

async function generateCert(courseId: number) {
  try {
    await certificatesApi.generate(courseId);
    router.push("/mis-certificados");
  } catch (e: any) {
    alert(e.response?.data?.error || "Error al generar certificado");
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}
</script>
