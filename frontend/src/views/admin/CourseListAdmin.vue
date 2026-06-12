<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Cursos ({{ courses.length }})</h2>
      <router-link to="/admin/courses/crear" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
        + Nuevo curso
      </router-link>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" placeholder="Buscar por título o slug..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm" />
      </div>
      <select v-model="publishedFilter"
        class="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm bg-white">
        <option value="all">Todos</option>
        <option value="published">Publicados</option>
        <option value="draft">Borradores</option>
      </select>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="filteredCourses.length === 0" class="text-gray-400 text-sm py-8 text-center">
        {{ courses.length === 0 ? 'No hay cursos registrados' : 'Ningún curso coincide con los filtros' }}
      </div>
      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Título</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Slug</th>
            <th class="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Lecciones</th>
            <th class="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Publicado</th>
            <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="course in paginatedCourses" :key="course.id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ course.title }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell font-mono">{{ course.slug }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 text-center hidden md:table-cell">{{ course._count?.lessons || 0 }}</td>
            <td class="px-6 py-4 text-center">
              <span class="px-2 py-0.5 text-xs font-semibold rounded-full"
                :class="course.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'">
                {{ course.published ? 'Sí' : 'No' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <router-link :to="`/admin/courses/${course.id}/lessons`" class="text-primary-600 hover:text-primary-800 text-sm font-medium">Lecciones</router-link>
              <router-link :to="`/admin/courses/${course.id}/quiz`" class="text-accent-600 hover:text-accent-800 text-sm font-medium">Quiz</router-link>
              <router-link :to="`/admin/courses/${course.id}/certificate`" class="text-amber-600 hover:text-amber-800 text-sm font-medium">Certificado</router-link>
              <router-link :to="`/admin/courses/${course.id}`" class="text-primary-600 hover:text-primary-800 text-sm font-medium">Editar</router-link>
              <button @click="remove(course.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
          class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-30">
          &larr;
        </button>
        <span class="text-sm text-gray-500">Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages"
          class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-30">
          &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { coursesApi } from "../../services/api";
import type { Course } from "../../types";

const PER_PAGE = 10;

const router = useRouter();
const courses = ref<Course[]>([]);
const search = ref("");
const publishedFilter = ref("all");
const currentPage = ref(1);

const filteredCourses = computed(() =>
  courses.value.filter((c) => {
    const q = search.value.toLowerCase();
    const matchesSearch = !q
      || c.title.toLowerCase().includes(q)
      || c.slug.toLowerCase().includes(q);
    const matchesPublished = publishedFilter.value === "all"
      || (publishedFilter.value === "published" && c.published)
      || (publishedFilter.value === "draft" && !c.published);
    return matchesSearch && matchesPublished;
  })
);

const totalPages = computed(() => Math.ceil(filteredCourses.value.length / PER_PAGE));

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE;
  return filteredCourses.value.slice(start, start + PER_PAGE);
});

onMounted(async () => { courses.value = await coursesApi.getAllAdmin(); });

async function remove(id: number) {
  if (confirm("¿Eliminar este curso y todo su contenido?")) {
    await coursesApi.remove(id);
    courses.value = await coursesApi.getAllAdmin();
  }
}
</script>
