<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader solid />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24 pb-12 lg:pb-16">
      <div class="mb-10">
        <h1 class="text-3xl lg:text-4xl font-bold text-gray-900">
          Publicaciones y <span class="text-primary-600">Noticias</span>
        </h1>
        <p class="mt-2 text-gray-500">Explora nuestras publicaciones académicas y anuncios.</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="lg:w-64 shrink-0">
          <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 sticky top-24">
            <div>
              <h3 class="font-semibold text-gray-900 mb-3">Tipo</h3>
              <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" :checked="selectedTypes.length === 0" @change="selectedTypes = []" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
                  <span class="text-sm text-gray-700">Todas</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" :checked="selectedTypes.includes('article')" @change="toggleType('article')" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
                  <span class="text-sm text-gray-700">Artículos</span>
                  <span class="text-xs text-gray-400 ml-auto">{{ typeCount('article') }}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" :checked="selectedTypes.includes('news')" @change="toggleType('news')" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
                  <span class="text-sm text-gray-700">Noticias</span>
                  <span class="text-xs text-gray-400 ml-auto">{{ typeCount('news') }}</span>
                </label>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-4">
              <h3 class="font-semibold text-gray-900 mb-3">Año</h3>
              <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" :checked="selectedYears.length === 0" @change="selectedYears = []" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
                  <span class="text-sm text-gray-700">Todos</span>
                </label>
                <label v-for="year in availableYears" :key="year" class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" :checked="selectedYears.includes(year)" @change="toggleYear(year)" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
                  <span class="text-sm text-gray-700">{{ year }}</span>
                  <span class="text-xs text-gray-400 ml-auto">{{ yearCount(year) }}</span>
                </label>
              </div>
            </div>

            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        </aside>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-6">
            <div class="relative flex-1 max-w-md">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="search" placeholder="Buscar por título o descripción..."
                class="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm bg-white" />
            </div>
            <p class="text-sm text-gray-500 ml-4 shrink-0">
              {{ filtered.length }} {{ filtered.length === 1 ? 'publicación' : 'publicaciones' }}
            </p>
          </div>

          <div v-if="filtered.length === 0" class="text-center py-20">
            <p class="text-gray-400 text-lg">No se encontraron publicaciones con esos filtros.</p>
            <button @click="clearFilters" class="mt-4 text-primary-600 hover:text-primary-700 font-medium">Limpiar filtros</button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="pub in paginated"
              :key="pub.id"
              class="flex gap-4 p-6 rounded-xl bg-white border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all cursor-pointer"
              @click="$router.push(`/publicaciones/${pub.id}`)"
            >
              <div class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                :class="pub.type === 'article' ? 'bg-primary-50 text-primary-600' : 'bg-accent-50 text-accent-600'"
              >
                <svg v-if="pub.type === 'article'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
                    :class="pub.type === 'article' ? 'bg-primary-50 text-primary-700' : 'bg-accent-50 text-accent-700'"
                  >
                    {{ pub.type === 'article' ? 'Artículo' : 'Noticia' }}
                  </span>
                  <span class="text-xs text-gray-400">{{ formatDate(pub.date) }}</span>
                </div>
                <h3 class="font-bold text-gray-900 mb-1">{{ pub.title }}</h3>
                <p class="text-sm text-gray-600">{{ pub.summary }}</p>
              </div>
            </div>
          </div>

          <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-10">
            <button
              :disabled="page === 0"
              @click="page = page - 1"
              class="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-300 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button
              v-for="p in totalPages"
              :key="p"
              @click="page = p - 1"
              class="w-10 h-10 rounded-xl text-sm font-medium transition-all"
              :class="page === p - 1 ? 'bg-primary-600 text-white' : 'border border-gray-200 text-gray-600 hover:border-primary-300'"
            >{{ p }}</button>
            <button
              :disabled="page >= totalPages - 1"
              @click="page = page + 1"
              class="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-300 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { Publication } from "../../types";
import { publications as pubsApi } from "../../services/api";
import AppHeader from "../../components/layout/AppHeader.vue";
import AppFooter from "../../components/layout/AppFooter.vue";

const publications = ref<Publication[]>([]);

const search = ref("");
const selectedTypes = ref<string[]>([]);
const selectedYears = ref<number[]>([]);
const page = ref(0);
const perPage = 10;

onMounted(async () => {
  try {
    publications.value = await pubsApi.getAll();
  } catch (err) {
    console.error("Error cargando publicaciones:", err);
  }
});

const filtered = computed(() =>
  publications.value.filter((pub) => {
    if (selectedTypes.value.length > 0 && !selectedTypes.value.includes(pub.type)) return false;
    if (selectedYears.value.length > 0) {
      const year = new Date(pub.date).getFullYear();
      if (!selectedYears.value.includes(year)) return false;
    }
    if (search.value) {
      const q = search.value.toLowerCase();
      if (!pub.title.toLowerCase().includes(q) && !pub.summary.toLowerCase().includes(q)) return false;
    }
    return true;
  })
);

const paginated = computed(() => {
  const start = page.value * perPage;
  return filtered.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage));

watch(search, () => { page.value = 0; });

const availableYears = computed(() => {
  const years = new Set<number>();
  for (const pub of publications.value) {
    years.add(new Date(pub.date).getFullYear());
  }
  return Array.from(years).sort((a, b) => b - a);
});

const hasActiveFilters = computed(() => search.value || selectedTypes.value.length > 0 || selectedYears.value.length > 0);

function typeCount(type: string) {
  return publications.value.filter((p) => p.type === type).length;
}

function yearCount(year: number) {
  return publications.value.filter((p) => new Date(p.date).getFullYear() === year).length;
}

function toggleType(type: string) {
  const idx = selectedTypes.value.indexOf(type);
  if (idx === -1) selectedTypes.value.push(type);
  else selectedTypes.value.splice(idx, 1);
  page.value = 0;
}

function toggleYear(year: number) {
  const idx = selectedYears.value.indexOf(year);
  if (idx === -1) selectedYears.value.push(year);
  else selectedYears.value.splice(idx, 1);
  page.value = 0;
}

function clearFilters() {
  search.value = "";
  selectedTypes.value = [];
  selectedYears.value = [];
  page.value = 0;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>
